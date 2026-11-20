# processDeployments()

**Project:** `snow-publish-java` · Snow Publish Java  
**Source file:** `src/main/java/com/snow/tasks/ScheduledProcessTasks.java`  
**Class:** `ScheduledProcessTasks`  
**Method:** `processDeployments()` (lines 45–112)  
**Runs:** every 2 seconds via `@Scheduled(fixedRate = 2000)`

Second stage of the deployment pipeline. Reads up to 100 rows from the volatile staging table, upserts into per-profile tables `connectors.snow_deployments_{profile_id}`, marks persistent rows as processed, and deletes volatile rows.

**Does not** insert into `connectors.snow_deployments_anonymous`.

The code uses the Java class `SnowDeploymentsAnonymous` and `DeploymentMapper.deploymentVolatileToDeploymentAnonymousMapper()` as a **data shape** for upserts — that mapper name is historical; it does not write to the anonymous table.

---

## Pipeline position

```
POST /connectors/publish-snow-deployment
     → SingletonQueue
     → ScheduledCommandTasks (1s): INSERT persistent + volatile
     → ScheduledProcessTasks (2s): THIS METHOD
           → UPSERT snow_deployments_{profile_id}
           → UPDATE persistent processed = 1
           → DELETE volatile rows
     → GET /connectors/get-snow-deployments?actorId=X reads profile table
```

---

## Flow

```
ScheduledProcessTasks.processDeployments()   [@Transactional, synchronized]
        │
        ├── findBatchRecords(100) from data_source_snow_deployments_volatile
        │       empty? → log and exit (no DB writes)
        │
        ├── FOR EACH volatile row:
        │       ├── add PK to deleteIds
        │       ├── map to persistent (processed = 1) → processed list
        │       ├── actorId blank? → warn, skip upsert for this row
        │       ├── getProfileByActorId(item.actorId, item.gitType)
        │       │       profile null? → warn, skip upsert for this row
        │       └── else → add DTO to profileDeployments[profile_id]
        │
        ├── FOR EACH profile_id in profileDeployments:
        │       ├── dedupe by repository (last wins)
        │       ├── createTableIfNotExists(profile_id)
        │       └── upsertProfileDeployments(profile_id, dedupedRecords)
        │
        ├── updateProcessedRecords(processed)   — all volatile rows in batch
        ├── deleteByIds(deleteIds)              — all volatile rows in batch
        │
        ▼
     one transaction commit (or full rollback on failure)
```

---

## Dependencies

| Field | Repository | Role in this method |
|---|---|---|
| `dataSourceSnowVolatileRepository` | `DataSourceSnowVolatileRepository` | Read batch, delete processed rows |
| `dataSourceSnowPersistentRepository` | `DataSourceSnowPersistentRepository` | Mark rows `processed = 1` |
| `profileOwnersRepository` | `ProfileOwnersRepository` | Resolve profile by deployment `actor_id` |
| `profileSnowDeploymentsRepository` | `ProfileSnowDeploymentsRepository` | Create table + upsert profile rows |

---

## Full method source

```java
@Transactional
@Scheduled(fixedRate = 2000)
public synchronized void processDeployments() {
    processTaskLog.info("Starting scheduled process task - processing deployments from volatile table");
    processTaskLog.info("Reading batch of 100 records from data source volatile table");

    List<DataSourceSnowDeploymentsVolatile> list = dataSourceSnowVolatileRepository.findBatchRecords(100);
    processTaskLog.info("Retrieved {} records from volatile table", list.size());

    List<DataSourceSnowDeploymentsPersistent> processed = new ArrayList<>();
    List<Long> deleteIds = new ArrayList<>();
    Map<Long, List<SnowDeploymentsAnonymous>> profileDeployments = new LinkedHashMap<>();

    if (!list.isEmpty()) {
        processTaskLog.info("Processing {} volatile deployment records", list.size());

        for (DataSourceSnowDeploymentsVolatile item : list) {
            deleteIds.add(item.getSnowDeploymentId());
            processed.add(DeploymentMapper.deploymentVolatileToDeploymentPersistentMapper(item));

            if (item.getActorId() == null || item.getActorId().isBlank()) {
                processTaskLog.warn("actorId missing for repository: {} - skipping profile deployment upsert",
                        item.getRepository());
                continue;
            }

            ProfileOwners profile = profileOwnersRepository.getProfileByActorId(item.getActorId(), item.getGitType());
            if (profile == null) {
                processTaskLog.warn("Profile not found for actorId: {} - skipping profile deployment upsert for repository: {}",
                        item.getActorId(), item.getRepository());
                continue;
            }

            profileDeployments
                    .computeIfAbsent(profile.getProfileId(), profileId -> new ArrayList<>())
                    .add(DeploymentMapper.deploymentVolatileToDeploymentAnonymousMapper(item));
        }

        for (Map.Entry<Long, List<SnowDeploymentsAnonymous>> entry : profileDeployments.entrySet()) {
            List<SnowDeploymentsAnonymous> dedupedRecords = new ArrayList<>(
                    entry.getValue().stream()
                            .collect(Collectors.toMap(
                                    SnowDeploymentsAnonymous::getRepository,
                                    record -> record,
                                    (a, b) -> b,
                                    LinkedHashMap::new
                            ))
                            .values()
            );

            processTaskLog.info("Ensuring profile deployments table exists for profile ID: {}", entry.getKey());
            profileSnowDeploymentsRepository.createTableIfNotExists(entry.getKey());

            processTaskLog.info("Upserting {} deployment records for profile ID: {}", dedupedRecords.size(), entry.getKey());
            profileSnowDeploymentsRepository.upsertProfileDeployments(entry.getKey(), dedupedRecords);
        }

        processTaskLog.info("Updating {} persistent records as processed", processed.size());
        dataSourceSnowPersistentRepository.updateProcessedRecords(processed);

        processTaskLog.info("Deleting {} processed records from volatile table", deleteIds.size());
        dataSourceSnowVolatileRepository.deleteByIds(deleteIds);

        processTaskLog.info("Successfully completed processing deployment batch");
    } else {
        processTaskLog.info("No records found in volatile table - skipping processing");
    }
}
```

---

## Annotations

| Annotation | What it does |
|---|---|
| `@Scheduled(fixedRate = 2000)` | Spring calls this method every 2 seconds (interval starts when the previous run **starts**). |
| `@Transactional` | One database transaction for the whole method. Failure rolls back all writes in that tick. |
| `synchronized` | Only one thread runs this method at a time in the JVM. |

---

## Line-by-line explanation

### Lines 51–52 — Fetch batch from volatile table

```java
List<DataSourceSnowDeploymentsVolatile> list = dataSourceSnowVolatileRepository.findBatchRecords(100);
```

- Loads up to **100** rows from `connectors.data_source_snow_deployments_volatile`.
- If empty, jumps to the `else` branch (line 109) and does no DB writes.

---

### Lines 54–56 — Create working lists

| List / map | Purpose |
|---|---|
| `processed` | Persistent entities with `processed = 1` — one entry **per volatile row** |
| `deleteIds` | Volatile PKs to delete at the end — one entry **per volatile row** |
| `profileDeployments` | Map of `profile_id` → `SnowDeploymentsAnonymous` DTOs to upsert |

---

### Lines 61–81 — Loop over every volatile row

```java
for (DataSourceSnowDeploymentsVolatile item : list) {
    deleteIds.add(item.getSnowDeploymentId());
    processed.add(DeploymentMapper.deploymentVolatileToDeploymentPersistentMapper(item));

    if (item.getActorId() == null || item.getActorId().isBlank()) {
        processTaskLog.warn("actorId missing for repository: {} - skipping profile deployment upsert",
                item.getRepository());
        continue;
    }

    ProfileOwners profile = profileOwnersRepository.getProfileByActorId(item.getActorId(), item.getGitType());
    if (profile == null) {
        processTaskLog.warn("Profile not found for actorId: {} - skipping profile deployment upsert for repository: {}",
                item.getActorId(), item.getRepository());
        continue;
    }

    profileDeployments
            .computeIfAbsent(profile.getProfileId(), profileId -> new ArrayList<>())
            .add(DeploymentMapper.deploymentVolatileToDeploymentAnonymousMapper(item));
}
```

For each volatile row:

1. **`deleteIds`** — record PK; deleted at the end regardless of profile lookup outcome.
2. **`processed`** — maps to persistent with **`processed = 1`** (always, even if profile missing or `actorId` blank).
3. **`actorId` check** — blank or null → log warning, skip upsert for that row.
4. **Profile lookup** — `getProfileByActorId(item.getActorId(), item.getGitType())` via `findFirstByActorIdOrderByProfileIdDesc(actorId, gitType)`. If no profile → log warning, skip upsert for that row.
5. **`profileDeployments`** — groups DTO objects by `profile_id` for batch upsert.

---

### Lines 83–100 — Upsert per profile table

```java
for (Map.Entry<Long, List<SnowDeploymentsAnonymous>> entry : profileDeployments.entrySet()) {
    List<SnowDeploymentsAnonymous> dedupedRecords = new ArrayList<>(
            entry.getValue().stream()
                    .collect(Collectors.toMap(
                            SnowDeploymentsAnonymous::getRepository,
                            record -> record,
                            (a, b) -> b,
                            LinkedHashMap::new
                    ))
                    .values()
    );

    profileSnowDeploymentsRepository.createTableIfNotExists(entry.getKey());
    profileSnowDeploymentsRepository.upsertProfileDeployments(entry.getKey(), dedupedRecords);
}
```

- Dedupes by `repository` within each profile batch — **`(a, b) -> b` keeps the last one**.
- **`createTableIfNotExists(profileId)`** — ensures `connectors.snow_deployments_{profile_id}` exists (DDL via `LIKE snow_deployments_anonymous`).
- **`upsertProfileDeployments`** — also calls `createTableIfNotExists` internally before insert (safe to call twice).
- Target table: `connectors.snow_deployments_{profile_id}`.
- Upsert SQL: `INSERT ... ON CONFLICT (repository) DO UPDATE` (see `ProfileSnowDeploymentsRepository`).

---

### Lines 102–106 — Mark persistent processed and delete volatile

```java
dataSourceSnowPersistentRepository.updateProcessedRecords(processed);
dataSourceSnowVolatileRepository.deleteByIds(deleteIds);
```

- **Persistent:** every volatile row in the batch → `processed = 1`, even rows skipped for upsert.
- **Volatile:** all batch rows deleted.

---

### Lines 109–111 — Empty volatile table

Logs and exits. No database changes.

---

## Prerequisites for profile upsert

For a volatile row to be upserted into `snow_deployments_{profile_id}`:

| Requirement | Why |
|---|---|
| `actorId` on the deployment is non-blank | Blank → row skipped for upsert |
| `actorId` matches `profile_owners.actor_id` | Lookup uses `getProfileByActorId(actorId, gitType)` |
| `gitType` on deployment matches `profile_owners.git_type` | Publish API requires `gitType` in the JSON body; lookup filters when non-blank |
| Profile exists (`POST /connectors/profile`) | No profile → row skipped for upsert |
| Profile table may not exist yet | `createTableIfNotExists` runs before upsert |

`POST /connectors/publish-snow-deployment` validates `gitType` as `@NotBlank` before enqueue. Auth for that POST is `Authorization: Bearer <snowTokenPipeline>` — see [api-authentication-and-security.md](api-authentication-and-security.md).

When multiple profiles share the same `actor_id`, the profile with the **highest `profile_id`** is used.

---

## Example: 3 volatile rows in one batch

| Volatile rows | actor_id | repository |
|---|---|---|
| row 1 | `54486644` | `acme/api` |
| row 2 | `54486644` | `acme/api` |
| row 3 | `99999999` | `acme/web` |

Assume profiles exist for both actor IDs (`profile_id` 1 and 2).

| Step | Result |
|---|---|
| `profileDeployments` map | `1 → [api, api]`, `2 → [web]` |
| Deduped per profile | `1 → [api last wins]`, `2 → [web]` |
| `createTableIfNotExists` | called for profile 1 and 2 |
| `snow_deployments_1` | upsert `acme/api` |
| `snow_deployments_2` | upsert `acme/web` |
| Persistent | 3 rows → `processed = 1` |
| Volatile | all 3 rows deleted |
| `snow_deployments_anonymous` | **not touched** |

If `actor_id` `54486644` has no profile, rows 1–2 still get `processed = 1` and deleted from volatile, but no upsert into a profile table.

---

## Behavior summary

| Scenario | Persistent | Volatile | Profile table |
|---|---|---|---|
| Profile found for `actor_id` | `processed = 1` | deleted | upsert by `repository` |
| Profile not found for `actor_id` | `processed = 1` | deleted | no upsert |
| `actorId` blank on deployment | `processed = 1` | deleted | no upsert |
| Duplicate `repository` in same profile batch | — | — | last row wins |
| Empty volatile table | no change | no change | no change |
| Transaction failure | rollback all writes in tick | rollback | rollback |

---

## Downstream reads

After this task completes, deployment data is available from:

| Endpoint | Reads |
|---|---|
| `GET /connectors/get-snow-deployments?actorId=X` | `profile_owners` → `snow_deployments_{profile_id}` |
| `GET /connectors/get-snow-url?actorId=X&snowName=Y` | same profile table |
| `GET /connectors/get-snow-repository?actorId=X&snowName=Y` | same profile table |
| `GET /connectors/publish-snow-deployment/table-data?tableName=snow_deployments_N` | direct table read |
| `DELETE /connectors/publish-snow-deployment?repository=X&actorId=Y` | delete row by repository from profile table |

See [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md).

---

## Related docs

- [business-logic.md](business-logic.md) — full pipeline and other scheduled tasks
- [get-profile.md](get-profile.md) — profile + `snow_deployments_{profile_id}` table creation
- [publish-snow-deployment.md](publish-snow-deployment.md) — enqueue deployment API
- [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) — query profile tables by `actorId`
- [user-guide.md](user-guide.md) — run service and API overview (`snow-publish-java`)
- [user-guide.md](user-guide.md) — API usage
