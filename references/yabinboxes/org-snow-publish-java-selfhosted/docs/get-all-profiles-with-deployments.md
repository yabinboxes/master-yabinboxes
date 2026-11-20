# getAllProfilesWithDeployments()

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**HTTP:** `GET /connectors/get-snow-repository/all`  
**Controller:** `SnowRepositoryQueryController.getAllProfilesWithDeployments()`  
**Handler:** `SnowUrlQueryHandlerImpl.getAllProfilesWithDeployments()`  
**Response DTO:** `ProfileWithDeploymentsQuery`  
**Tables:** `connectors.profile_owners` (read all), `connectors.snow_deployments_{profile_id}` (read all per profile)  
**Auth:** none. See [api-authentication-and-security.md](api-authentication-and-security.md).  
**CORS:** allow all

Returns every row from `profile_owners`, and for each profile loads all deployment rows from `snow_deployments_{profileId}` when that table exists. No query parameters. Response JSON uses **camelCase**.

Always returns HTTP `200` with a JSON array (empty when there are no profiles). Missing/invalid Bearer → HTTP `401`.

---

## Request and response

### Request

```bash
curl http://localhost:8080/connectors/get-snow-repository/all \
  ```

No query parameters.

### Response

HTTP `200` — JSON array of `ProfileWithDeploymentsQuery` objects:

```json
[
  {
    "profile": {
      "profileId": 3,
      "email": "user@example.com",
      "actor": "yabinboxes",
      "actorId": "54486644",
      "gitType": "github",
      "snowToken": "tok_abc",
      "snowTokenPipeline": "pipe_xyz",
      "license": "enterprise",
      "org": "MyOrg",
      "roleProfile": "REGULAR"
    },
    "deployments": [
      {
        "snowDeploymentId": 1,
        "snowType": "SERVICE",
        "snowName": "payments-api",
        "gitType": "github",
        "provider": "aws",
        "actor": "yabinboxes",
        "actorId": "54486644",
        "repositoryOwner": "acme",
        "repository": "acme/payments-api",
        "createdAt": "2026-07-05T16:00:00Z",
        "updatedAt": "2026-07-05T16:00:00Z",
        "status": "default",
        "url": "https://payments.acme.io",
        "environment": "production",
        "urlPath": "/api",
        "tabName": "Main Tab",
        "tabId": 1,
        "port": "8080",
        "image": "payments-api:1.2.0",
        "registry": "ghcr.io",
        "description": "Payments API",
        "extras": "",
        "payload": "{}",
        "healthCheckUrl": "https://payments.acme.io/health",
        "healthCheckTime": "30s",
        "notes": "",
        "email": "user@example.com",
        "color": "",
        "livenessType": "deployable",
        "livenessStatus": "active",
        "livenessResponse": "",
        "terraformOutput": ""
      }
    ]
  }
]
```

| Field | Description |
|---|---|
| `profile` | Full `ProfileOwners` row from `connectors.profile_owners`, including `snowToken` and `snowTokenPipeline`. |
| `deployments` | All rows from `connectors.snow_deployments_{profileId}`, ordered by `created_at DESC`. Empty array when the profile table does not exist yet. |

Deployment objects use the `SnowDeploymentsAnonymous` DTO shape. That is the JSON field layout only — rows come from `snow_deployments_{profile_id}`, not from `snow_deployments_anonymous`.

---

## Flow

```
GET /connectors/get-snow-repository/all
        │
        ▼
SnowRepositoryQueryController.getAllProfilesWithDeployments()
        │
        ▼
SnowUrlQueryHandlerImpl.getAllProfilesWithDeployments()
        │
        ├── ProfileOwnersRepository.findAll()
        │       └── SELECT all rows from connectors.profile_owners
        │
        └── for each profile:
                ProfileSnowDeploymentsRepository.findAllByProfileIdReadOnly(profileId)
                    ├── table missing? → deployments = []
                    └── table exists? → SELECT all rows ORDER BY created_at DESC
        │
        ▼
HTTP 200 + JSON array
```

---

## Handler interface

```java
List<ProfileWithDeploymentsQuery> getAllProfilesWithDeployments();
```

Implementation loads all profiles, then for each `profileId` calls `findAllByProfileIdReadOnly`. Unlike `findAllByProfileId`, this read path does **not** call `createTableIfNotExists` — missing profile tables return an empty `deployments` array instead of provisioning DDL.

Table existence is checked via `information_schema.tables` before querying `snow_deployments_{profileId}`.

---

## Behavior summary

| Scenario | HTTP | Body |
|---|---|---|
| One or more profiles in `profile_owners` | 200 | JSON array with `profile` + `deployments` per row |
| Profile exists, `snow_deployments_{id}` has rows | 200 | `deployments` contains all rows (all types) |
| Profile exists, deployment table never created | 200 | `deployments`: `[]` |
| No profiles in `profile_owners` | 200 | `[]` |

---

## Related endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/connectors/get-snow-repository?snowName=X&gitType=Z` | Single repository from `snow_deployments_anonymous` |
| `GET` | `/connectors/get-snow-deployments` | All rows from `snow_deployments_anonymous` |
| `GET` | `/connectors/get-snow-deployments/all` | All rows from global `snow_deployments_anonymous` |
| `GET` | `/connectors/publish-snow-deployment/table-data?tableName=snow_deployments_{id}` | All rows from one named table |
| `POST` | `/connectors/profile` | Create profile + `snow_deployments_{profile_id}` table |

### vs other list endpoints

| | `get-snow-repository/all` | `get-snow-deployments` | `get-snow-deployments/all` |
|---|---|---|---|
| Scope | All profiles + each profile table | Global anonymous table | Global anonymous table |
| Includes `profile_owners` data | yes | no | no |
| Creates missing profile tables | no | no | no |
| Type filter | no — all deployment types | no | no |

---

## Related docs

All docs are for project **`snow-publish-java-selfhosted`**.

- [api-authentication-and-security.md](api-authentication-and-security.md) — Bearer auth for `/connectors/**`
- [get-snow-repository.md](get-snow-repository.md) — single repository lookup by `snowName`
- [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) — deployments for one profile
- [get-profile.md](get-profile.md) — profile creation and table provisioning
- [process-deployments.md](process-deployments.md) — how rows are written to `snow_deployments_anonymous`
- [user-guide.md](user-guide.md) — run service and API overview
