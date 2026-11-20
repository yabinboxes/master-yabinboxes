# publishSnowDeployment()

**Project:** `snow-publish-java` · Snow Publish Java  
**HTTP:** `POST /connectors/publish-snow-deployment` · `DELETE /connectors/publish-snow-deployment`  
**Controller:** `SnowDeploymentCommandController.resourceRequest()` · `SnowDeploymentCommandController.deleteByRepository()`  
**Handler:** `SnowDeploymentCommandHandlerImpl.addSnowDeploymentToQueue()` · `SnowDeploymentCommandHandlerImpl.deleteByRepository()`  
**DTO:** `PublishSnowDeploymentCommand` (POST)  
**Auth:** `POST` uses `Authorization: Bearer <snowTokenPipeline>`; `DELETE` uses `Authorization: Bearer <firebase-id-token>` (required by default)  
**CORS:** allow all  
**Security:** [api-authentication-and-security.md](api-authentication-and-security.md)

`POST` accepts a deployment event as JSON, validates it, and enqueues it in memory. Returns **`201`** immediately with plain text `completed`. Persistence and profile upsert happen asynchronously via scheduled tasks.

`DELETE` removes the matching row from `snow_deployments_{profile_id}` immediately, keyed by **`repository`**. Profile is resolved by **`actorId`** and optional **`gitType`**. Does **not** read or write `snow_deployments_anonymous`.

Request JSON and query params use **camelCase** (see `.cursor/rules/api-json-camelcase.mdc`).

Bearer validation is on by default (`snow.auth.token-validation-enabled=true`).

---

## Request and response

```bash
curl -X POST http://localhost:8080/connectors/publish-snow-deployment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <snow-token-pipeline>" \
  -d '{
    "actorId": "54486644",
    "actor": "yabinboxes",
    "email": "dev@example.com",
    "snowType": "SERVICE",
    "gitType": "github",
    "snowName": "payments-api",
    "repository": "acme/payments-api",
    "repositoryOwner": "acme",
    "url": "https://payments.acme.io",
    "terraformOutput": "Apply complete! Resources: 1 added, 0 changed, 0 destroyed.",
    "terraformVars": "",
    "dockerOutput": "",
    "dockerVars": ""
  }'
```

### Auth

| Header | Required | Description |
|---|---|---|
| `Authorization` | yes | `Bearer <snowTokenPipeline>`. Verified by `SnowTokenPipelineAuthInterceptor` → `SnowTokenPipelineVerifier` using `profile_owners.snow_token`. |

Missing/invalid token → HTTP `401` `{"error":"Invalid or missing snowTokenPipeline Bearer token"}`.

`snowToken` is **not** accepted in the request body. Other `/connectors/**` APIs use Firebase Bearer instead.

### Required JSON fields

Validated by `@NotBlank` on `PublishSnowDeploymentCommand`:

| Field | Description |
|---|---|
| `actorId` | User identifier; used later to resolve profile |
| `gitType` | Git provider type (e.g. `github`); used with `actorId` for profile lookup |
| `snowType` | Must be a valid `Type` enum value (case-insensitive) |
| `snowName` | Deployment name |
| `repository` | Repository key (upsert dedupe key in profile table) |
| `repositoryOwner` | Repository owner/org |

### Optional fields

`actor`, `email`, `sha`, `provider`, `status`, `payload`, `url`, `environment`, `urlPath`, `tabName`, `tabId`, `port`, `image`, `registry`, `notes`, `extras`, `description`, `healthCheckUrl`, `healthCheckTime`, `livenessType`, `livenessStatus`, `livenessResponse`, `terraformOutput`, `terraformVars`, `dockerOutput`, `dockerVars`, `processed`

### Valid `snowType` values

`CLUSTER`, `SERVICE`, `APPLICATION`, `WORKFLOW_CALL`, `REPOSITORY`, `RESOURCE`

### Responses

| HTTP | Body | When |
|---|---|---|
| `201` | `completed` | Enqueued successfully |
| `400` | `Invalid snowType. Must be one of: CLUSTER, SERVICE, APPLICATION, WORKFLOW_CALL, REPOSITORY, RESOURCE` | Unknown `snowType` |
| `400` | Spring validation error JSON | Missing required field (`actorId`, `gitType`, etc.) |
| `401` | `{"error":"Invalid or missing snowTokenPipeline Bearer token"}` | Missing/invalid pipeline Bearer |
| `500` | `error` | Queue add failed |

Success response `Content-Type` is **plain text**, not JSON.

---

## DELETE — remove by repository

Deletes the row whose `repository` matches from `connectors.snow_deployments_{profile_id}`. Profile lookup is the same as [get-snow-url.md](get-snow-url.md): `getProfileByActorId(actorId, gitType)`. Auth is Firebase Bearer (not `snowTokenPipeline`).

```bash
curl -X DELETE "http://localhost:8080/connectors/publish-snow-deployment?repository=acme/payments-api&actorId=54486644&gitType=github" \
  -H "Authorization: Bearer <firebase-id-token>"
```

| Query param | Required | Description |
|---|---|---|
| `repository` | yes | Unique key in the profile table. Blank → HTTP 400. |
| `actorId` | yes | Resolves `profile_id` via `profile_owners.actor_id`. Blank → HTTP 400. |
| `gitType` | no | When set, profile lookup uses `actorId` + `gitType`. Omit → `actorId` only. |

### Responses

| HTTP | Body | When |
|---|---|---|
| `200` | `{"message":"Deployment deleted successfully","repository":"acme/payments-api"}` | Row deleted |
| `400` | `{"error":"repository parameter is required"}` or `actorId parameter is required` | Missing query param |
| `401` | `{"error":"Invalid or expired Firebase ID token"}` | Missing/invalid Firebase Bearer |
| `404` | `{"error":"Deployment not found for repository: acme/payments-api"}` | Profile missing, table missing, or no matching row |

Because each profile table has `UNIQUE (repository)`, at most one row is deleted.

---

## Flow

```
POST /connectors/publish-snow-deployment  (JSON body + Authorization Bearer <snowTokenPipeline>)
        │
        ▼
SnowTokenPipelineAuthInterceptor
        ├── extractBearerToken(Authorization)
        └── SnowTokenPipelineVerifier.verify(token)
                ├── resolve profile_owners (snow_token_pipeline or JWT claims)
                ├── read snowToken
                └── verify JWT HMAC  → 401 if fail
        │
        ▼
SnowDeploymentCommandController.resourceRequest()
        ├── @Valid body (actorId, gitType, snowType, snowName, repository, repositoryOwner)
        ├── parse snowType → Type enum (400 if invalid)
        └── addSnowDeploymentToQueue(command, type)
                └── SingletonQueue.addData(command)
        │
        ▼
HTTP 201 + completed   (immediate — no DB write yet)

--- async (see process-deployments.md) ---

ScheduledCommandTasks.batchDeploymentQueue()  every 1s
        ├── INSERT data_source_snow_deployments_persistent
        └── INSERT data_source_snow_deployments_volatile

ScheduledProcessTasks.processDeployments()  every 2s
        ├── resolve profile: getProfileByActorId(actorId, gitType)
        └── UPSERT snow_deployments_{profile_id}  (by repository)

---

DELETE /connectors/publish-snow-deployment?repository=X&actorId=Y&gitType=Z
        │  Authorization: Bearer <firebase-id-token>
        ▼
FirebaseAuthInterceptor  → 401 if fail
        │
        ▼
SnowDeploymentCommandController.deleteByRepository()
        ├── repository / actorId blank? → HTTP 400
        └── deleteByRepository(repository, actorId, gitType)
                ├── getProfileByActorId(actorId, gitType)  → 404 if missing
                └── DELETE FROM snow_deployments_{profile_id} WHERE repository = :repository
        │
        ▼
HTTP 200 + {"message":"...","repository":"..."}   or HTTP 404
```

---

## Related endpoints

| Method | Path | Purpose |
|---|---|---|
| `DELETE` | `/connectors/publish-snow-deployment?repository=X&actorId=Y` | Delete profile-table row by repository |
| `GET` | `/connectors/get-snow-deployments?actorId=X` | Read profile deployments after processing |
| `GET` | `/connectors/get-snow-url?snowName=X&actorId=Y` | Resolve URL from profile table |
| `GET` | `/connectors/get-snow-repository?snowName=X&actorId=Y` | Resolve repository from profile table |
| `POST` | `/connectors/profile` | Create profile + `snow_deployments_{profile_id}` table |

POST on this path uses `snowTokenPipeline` Bearer. DELETE uses Firebase Bearer. CORS allows all origins for all APIs.

---

## Related docs

All docs are for project **`snow-publish-java`**.

- [firebase-bearer-auth.md](firebase-bearer-auth.md) — Bearer auth for `/connectors/**`
- [process-deployments.md](process-deployments.md) — async processing after enqueue
- [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) — read profile deployments
- [user-guide.md](user-guide.md) — run service and API overview
