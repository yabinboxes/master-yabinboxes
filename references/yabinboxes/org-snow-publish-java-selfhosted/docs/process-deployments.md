# processDeployments()

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**Source file:** `src/main/java/com/snow/tasks/ScheduledProcessTasks.java`  
**Class:** `ScheduledProcessTasks`  
**Method:** `processDeployments()`  
**Runs:** every 2 seconds via `@Scheduled(fixedRate = 2000)`

Second stage of the deployment pipeline. Reads up to 100 rows from the volatile staging table, upserts matching rows into `connectors.snow_deployments_anonymous`, marks persistent rows as processed, and deletes volatile rows.

A row is upserted only when `actorId` is present and `profile_owners` has a match for `actorId` + `gitType`. Rows that fail that check are still marked processed and removed from volatile.

---

## Pipeline position

```
POST /connectors/publish-snow-deployment
     → SingletonQueue
     → ScheduledCommandTasks (1s): INSERT persistent + volatile
     → ScheduledProcessTasks (2s): THIS METHOD
           → UPSERT snow_deployments_anonymous by repository
           → UPDATE persistent processed = 1
           → DELETE volatile rows
     → GET /connectors/get-snow-deployments reads snow_deployments_anonymous
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
        │       ├── getProfileByActorId(actorId, gitType)
        │       │       missing? → warn, skip upsert for this row
        │       └── map to SnowDeploymentsAnonymous → anonymousRecords
        │
        ├── dedupe anonymousRecords by repository (last wins)
        ├── upsertByRepository(deduped) into snow_deployments_anonymous
        │       ON CONFLICT (repository) DO UPDATE
        │
        ├── updateProcessedRecords(processed)   — all volatile rows in the batch
        └── deleteByIds(deleteIds)              — all volatile rows in the batch
```

The method is `synchronized` and `@Transactional`. One tick is one transaction. A failure rolls back the upsert, the processed update, and the volatile delete.

---

## Upsert rules

| Condition | Persistent | Volatile | `snow_deployments_anonymous` |
|---|---|---|---|
| Profile found for `actorId` + `gitType` | `processed = 1` | deleted | upsert by `repository` |
| Profile not found | `processed = 1` | deleted | no upsert |
| `actorId` blank | `processed = 1` | deleted | no upsert |
| Duplicate `repository` in the same batch | — | — | last row wins |
| Empty volatile table | no change | no change | no change |

`DeploymentMapper.deploymentVolatileToDeploymentAnonymousMapper` strips tokens and sets `color` to `""`. The SQL does not send `snow_deployment_id`; the identity column generates it on insert. On conflict, `updated_at` is set to `now()`. Color and liveness columns already stored on the row are left as they are.

---

## Downstream reads

| Endpoint | Reads |
|---|---|
| `GET /connectors/get-snow-deployments` | `snow_deployments_anonymous` |
| `GET /connectors/get-snow-deployments/all` | `snow_deployments_anonymous` |
| `GET /connectors/get-snow-url?snowName=Y&gitType=Z` | `snow_deployments_anonymous` |
| `GET /connectors/get-snow-repository?snowName=Y&gitType=Z` | `snow_deployments_anonymous` |
| `DELETE /connectors/publish-snow-deployment?repository=X&actorId=Y` | deletes from `snow_deployments_{profile_id}`, not from anonymous |

---

## Related docs

- [business-logic.md](business-logic.md) — full pipeline and other scheduled tasks
- [get-profile.md](get-profile.md) — profile create and `snow_deployments_{profile_id}` table creation
- [publish-snow-deployment.md](publish-snow-deployment.md) — enqueue deployment API
- [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) — list anonymous deployments
- [user-guide.md](user-guide.md) — run service and API overview
