# getSnowDeploymentsByActorId()

**Project:** `snow-publish-java` · Snow Publish Java  
**HTTP:** `GET /connectors/get-snow-deployments`  
**Controller:** `src/main/java/com/snow/controller/SnowDeploymentQueryController.java` — `getSnowDeploymentsByActorId()` (lines 30–45)  
**Handler:** `src/main/java/com/snow/service/impl/SnowDeploymentQueryHandlerImpl.java` — `getSnowDeploymentsByActorId()` (lines 34–52)  
**Tables:** `connectors.profile_owners` (lookup by `actor_id`), `connectors.snow_deployments_{profile_id}` (read)  
**Auth:** `Authorization: Bearer <firebase-id-token>` (required by default; `snow.auth.token-validation-enabled=true`) — see [api-authentication-and-security.md](api-authentication-and-security.md)  
**CORS:** allow all

Returns deployment records for a profile identified by `actorId`. Resolves the profile in `profile_owners`, then reads matching rows from `snow_deployments_{profile_id}`. Does **not** read from `snow_deployments_anonymous`.

Query params and response JSON use **camelCase** (`actorId`, `gitType`, `snowDeploymentId`, etc.).

Always returns HTTP `200` with a JSON array (empty when `actorId` is missing, profile not found, or no rows). Missing/invalid Bearer → HTTP `401`.

---

## Request and response

### Request

```bash
curl "http://localhost:8080/connectors/get-snow-deployments?actorId=54486644&type=SERVICE&gitType=github" \
  -H "Authorization: Bearer <firebase-id-token>"
```

```bash
curl "http://localhost:8080/connectors/get-snow-deployments?actorId=54486644&type=ALL" \
  -H "Authorization: Bearer <firebase-id-token>"
```

| Query param | Required | Description |
|---|---|---|
| `actorId` | yes (for results) | Matches `profile_owners.actor_id`. If missing or blank → empty array. |
| `type` | no | Filter by `snow_type`. Omit, blank, or `ALL` → all types. |
| `gitType` | no | When set, profile lookup uses `actorId` + `gitType` on `profile_owners`. Omit → `actorId` only. |

### Response

HTTP `200` — JSON array of `SnowDeploymentsAnonymous` objects, ordered by `created_at DESC`:

```json
[
  {
    "snowDeploymentId": 1,
    "snowType": "SERVICE",
    "snowName": "my-service-v1.2.0",
    "gitType": "github",
    "provider": "aws",
    "actor": "yabinboxes",
    "actorId": "54486644",
    "repositoryOwner": "myorg",
    "repository": "myorg/my-service",
    "createdAt": "2026-07-05T16:00:00Z",
    "updatedAt": "2026-07-05T16:00:00Z",
    "status": "default",
    "url": "https://my-service.example.com",
    "environment": "production",
    "urlPath": "/api",
    "tabName": "Main Tab",
    "tabId": 1,
    "port": "8080",
    "image": "my-service:1.2.0",
    "registry": "ghcr.io",
    "description": "Main API service",
    "extras": "",
    "payload": "{}",
    "healthCheckUrl": "https://my-service.example.com/health",
    "healthCheckTime": "30s",
    "notes": "",
    "email": "user@example.com",
    "color": "",
    "livenessType": "deployable",
    "livenessStatus": "active",
    "livenessResponse": "",
    "terraformOutput": "",
    "terraformVars": "",
    "dockerOutput": "",
    "dockerVars": ""
  }
]
```

No tokens are returned. Response shape uses the `SnowDeploymentsAnonymous` Java DTO — that is the JSON field layout, not an indication that rows come from `snow_deployments_anonymous`.

---

## Flow

```
GET /connectors/get-snow-deployments?actorId=54486644&type=SERVICE&gitType=github
        │
        ▼
SnowDeploymentQueryController.getSnowDeploymentsByActorId()
        │
        ▼
SnowDeploymentQueryHandlerImpl.getSnowDeploymentsByActorId(actorId, type, gitType)
        │
        ├── actorId blank? → return []
        │
        ├── ProfileOwnersRepository.getProfileByActorId(actorId, gitType)
        │       └── findFirstByActorIdOrderByProfileIdDesc(actorId, gitType)
        │       profile not found? → return []
        │
        ├── ProfileSnowDeploymentsRepository.findAllByProfileId(profileId, type)
        │       └── createTableIfNotExists(profile_id) if missing
        │       └── SELECT FROM connectors.snow_deployments_{profile_id}
        │           optional WHERE snow_type = :type
        │           ORDER BY created_at DESC
        │
        ▼
HTTP 200 + JSON array
```

---

## Controller — full method

```java
@GetMapping
public ResponseEntity<List<SnowDeploymentsAnonymous>> getSnowDeploymentsByActorId(
        @RequestParam(required = false) String actorId,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String gitType) {
    List<SnowDeploymentsAnonymous> deployments =
            snowDeploymentQueryHandler.getSnowDeploymentsByActorId(actorId, type, gitType);
    return ResponseEntity.ok(deployments);
}
```

| Part | What it does |
|---|---|
| `@GetMapping` | `GET /connectors/get-snow-deployments` |
| `actorId` | Optional at HTTP layer; handler returns `[]` when blank |
| `type` | Optional `snow_type` filter |
| `gitType` | Optional; passed to `getProfileByActorId(actorId, gitType)` |
| `ResponseEntity.ok(...)` | Always HTTP 200, even for empty results |

Note: Swagger text still references “anonymous” read model — runtime behavior reads `snow_deployments_{profile_id}` via the handler below.

---

## Handler — full method

```java
@Override
public List<SnowDeploymentsAnonymous> getSnowDeploymentsByActorId(String actorId, String type, String gitType) {
    queryHandlerLog.info("Processing deployment query by actorId - actorId: {}, type: {}, gitType: {}",
            actorId, type, gitType);

    if (actorId == null || actorId.isBlank()) {
        queryHandlerLog.warn("actorId is required for profile deployment lookup");
        return Collections.emptyList();
    }

    ProfileOwners profile = profileOwnersRepository.getProfileByActorId(actorId, gitType);
    if (profile == null) {
        queryHandlerLog.warn("No profile found for actorId: {}", actorId);
        return Collections.emptyList();
    }

    List<SnowDeploymentsAnonymous> deployments =
            profileSnowDeploymentsRepository.findAllByProfileId(profile.getProfileId(), type);
    queryHandlerLog.info("Retrieved {} deployment records from snow_deployments_{}", deployments.size(), profile.getProfileId());
    return deployments;
}
```

---

## Profile lookup — getProfileByActorId

**Repository:** `src/main/java/com/snow/repository/ProfileOwnersRepository.java`

```java
public ProfileOwners getProfileByActorId(String actorId, String gitType) {
    profileOwnersRepoLog.info("Searching for profile by actorId: {}, gitType: {}", actorId, gitType);
    Optional<ProfileOwners> profile = jpaRepository.findFirstByActorIdOrderByProfileIdDesc(actorId, gitType);
    if (profile.isPresent()) {
        profileOwnersRepoLog.info("Found profile with ID: {} for actorId: {}", profile.get().getProfileId(), actorId);
        return profile.get();
    }
    profileOwnersRepoLog.info("Profile not found for actorId: {}", actorId);
    return null;
}
```

**JPA:** `findFirstByActorIdOrderByProfileIdDesc(actorId, gitType)` — optional `gitType` filter (same rule as get-snow-url).

When multiple profiles share the same `actor_id`, the profile with the **highest `profile_id`** is used.

This endpoint does not accept `email` as a query parameter.

---

## Profile table query — findAllByProfileId

**Repository:** `src/main/java/com/snow/repository/ProfileSnowDeploymentsRepository.java` — `findAllByProfileId()` (lines 169–200)

```java
@Transactional
public List<SnowDeploymentsAnonymous> findAllByProfileId(Long profileId, String snowType) {
    if (profileId == null) {
        return Collections.emptyList();
    }

    createTableIfNotExists(profileId);

    String tableRef = "connectors.snow_deployments_" + profileId;
    boolean allTypes = snowType == null || snowType.isBlank() || "ALL".equalsIgnoreCase(snowType);

    profileDeploymentsRepoLog.info("Reading all records from {} with type filter: {}", tableRef, allTypes ? "ALL" : snowType);

    String sql = allTypes
            ? "SELECT " + PROFILE_DEPLOYMENT_COLUMNS + " FROM " + tableRef + " ORDER BY created_at DESC"
            : "SELECT " + PROFILE_DEPLOYMENT_COLUMNS + " FROM " + tableRef
            + " WHERE snow_type = :snowType ORDER BY created_at DESC";

    var query = entityManager.createNativeQuery(sql);
    if (!allTypes) {
        query.setParameter("snowType", snowType);
    }

    @SuppressWarnings("unchecked")
    List<Object[]> rows = query.getResultList();
    List<SnowDeploymentsAnonymous> results = new ArrayList<>(rows.size());
    for (Object[] row : rows) {
        results.add(mapProfileDeploymentRow(row));
    }

    profileDeploymentsRepoLog.info("Found {} deployment records in {}", results.size(), tableRef);
    return results;
}
```

### Type filter logic

| `type` param | SQL |
|---|---|
| null, blank, or `ALL` | `SELECT ... FROM snow_deployments_{id} ORDER BY created_at DESC` |
| `SERVICE`, `CLUSTER`, etc. | `... WHERE snow_type = :snowType ORDER BY created_at DESC` |

### Table auto-creation

`createTableIfNotExists(profileId)` runs before the SELECT. If the profile exists but its table was never created (legacy data or missed profile create), the table is provisioned empty and the endpoint returns `[]`.

Places that ensure `snow_deployments_{profile_id}` exists:

| Trigger | Location |
|---|---|
| New profile | `ProfileCommandHandlerImpl.getProfile()` on create |
| This query | `findAllByProfileId()` |
| `processDeployments()` | `upsertProfileDeployments()` |

DDL clones schema from `snow_deployments_anonymous` via PostgreSQL `LIKE ... INCLUDING DEFAULTS INCLUDING IDENTITY`. See [get-profile.md](get-profile.md).

---

## Empty results?

If you get `[]` but expect rows:

1. Confirm `actorId` matches a row in `profile_owners`.
2. Confirm `snow_deployments_{profile_id}` has data (e.g. via `table-data?tableName=snow_deployments_{id}`).

How rows are written into profile tables is covered in [process-deployments.md](process-deployments.md).

---

## Behavior summary

| Scenario | HTTP | Body |
|---|---|---|
| Valid `actorId`, profile exists, rows in profile table | 200 | JSON array of deployments |
| Valid `actorId`, profile exists, empty or missing table | 200 | `[]` (table created if missing) |
| Valid `actorId`, no matching profile | 200 | `[]` |
| Missing or blank `actorId` | 200 | `[]` |
| Duplicate `actorId` in DB | 200 | Uses highest `profile_id` |
| `type=ALL` or omitted | 200 | All types for that profile |
| `type=SERVICE` | 200 | Only `snow_type = SERVICE` |

---

## Related endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/connectors/get-snow-deployments/all` | All rows from `snow_deployments_anonymous` (global, not per profile) |
| `GET` | `/connectors/get-snow-url?snowName=X&actorId=Y&gitType=Z` | Single URL from profile table |
| `GET` | `/connectors/get-snow-repository?snowName=X&actorId=Y&gitType=Z` | Single repository from profile table |
| `GET` | `/connectors/publish-snow-deployment/table-data?tableName=snow_deployments_{id}` | All rows by table name |
| `POST` | `/connectors/profile` | Create profile + `snow_deployments_{profile_id}` table |
| `POST` | `/connectors/publish-snow-deployment` | Enqueue a deployment |
| `DELETE` | `/connectors/publish-snow-deployment?repository=X&actorId=Y` | Delete profile-table row by repository |

### vs `table-data`

| | `get-snow-deployments?actorId=X` | `table-data?tableName=snow_deployments_N` |
|---|---|---|
| Resolves profile | yes, via `actorId` (+ optional `gitType`) | no — you pass the table name directly |
| Type filter | optional `type` param | no — always all types |
| Allowed tables | profile table for resolved `profile_id` | `snow_deployments_anonymous` or `snow_deployments_<digits>` |

---

## Related docs

All docs are for project **`snow-publish-java`**.

- [firebase-bearer-auth.md](firebase-bearer-auth.md) — Bearer auth for `/connectors/**`
- [get-profile.md](get-profile.md) — profile creation and per-profile table provisioning
- [publish-snow-deployment.md](publish-snow-deployment.md) — enqueue deployment
- [get-snow-url.md](get-snow-url.md) — resolve deployment URL by `snowName` and `actorId`
- [get-snow-repository.md](get-snow-repository.md) — resolve deployment repository by `snowName` and `actorId`
- [process-deployments.md](process-deployments.md) — how rows are written to profile tables
- [user-guide.md](user-guide.md) — run service and API overview
- [business-logic.md](business-logic.md) — service overview
