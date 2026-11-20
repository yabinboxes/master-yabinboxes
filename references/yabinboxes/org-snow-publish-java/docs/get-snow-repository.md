# getRepositoryBySnowName()

**Project:** `snow-publish-java` · Snow Publish Java  
**HTTP:** `GET /connectors/get-snow-repository`  
**Controller:** `SnowRepositoryQueryController.getRepositoryBySnowName()`  
**Handler:** `SnowUrlQueryHandlerImpl.getRepositoryBySnowName()`  
**Tables:** `connectors.profile_owners` (lookup), `connectors.snow_deployments_{profile_id}` (read)  
**Auth:** `Authorization: Bearer <firebase-id-token>` (required by default; `snow.auth.token-validation-enabled=true`) — see [api-authentication-and-security.md](api-authentication-and-security.md)  
**CORS:** allow all

Returns the deployment `repository` for `snowName` + `actorId`. Same profile resolution and filters as [get-snow-url.md](get-snow-url.md), but selects the `repository` column instead of `url`.

Query params and JSON use **camelCase**.

Missing/invalid Bearer → HTTP `401` `{"error":"Invalid or expired Firebase ID token"}`.

---

## Request and response

```bash
curl "http://localhost:8080/connectors/get-snow-repository?snowName=payments-api&actorId=54486644&gitType=github" \
  -H "Authorization: Bearer <firebase-id-token>"
```

| Query param | Required | Description |
|---|---|---|
| `snowName` | yes | Matches `snow_name` column. Blank → HTTP 400. |
| `actorId` | yes | Resolves `profile_id` via `profile_owners.actor_id`. Blank → HTTP 400. |
| `gitType` | no | Profile lookup + deployment SQL filter when set. |

**Found:** HTTP `200` → `{"repository": "acme/payments-api"}`  
**Not found:** HTTP `200` → `{"repository": ""}`  
**Missing param:** HTTP `400` → `{"error": "snowName parameter is required"}` or `actorId parameter is required`

---

## Flow

```
GET /connectors/get-snow-repository?snowName=X&actorId=Y&gitType=Z
        │
        ▼
SnowRepositoryQueryController → validate snowName, actorId
        │
        ▼
SnowUrlQueryHandlerImpl.getRepositoryBySnowName(snowName, actorId, gitType)
        ├── getProfileByActorId(actorId, gitType)
        └── findRepositoryBySnowName(profileId, snowName, gitType)
        │
        ▼
HTTP 200 + {"repository": "..."}
```

---

## Handler interface

```java
Optional<String> getRepositoryBySnowName(String snowName, String actorId, String gitType);
```

Implementation mirrors `getUrlBySnowName`, calling `ProfileSnowDeploymentsRepository.findRepositoryBySnowName` instead of `findUrlBySnowName`.

Deployment SQL selects `repository` with the same `snow_name` / optional `git_type` filters and `ORDER BY created_at DESC LIMIT 1`.

---

## Related docs

All docs are for project **`snow-publish-java`**.

- [firebase-bearer-auth.md](firebase-bearer-auth.md) — Bearer auth for `/connectors/**`
- [get-snow-url.md](get-snow-url.md) — URL lookup (same parameters)
- [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md) — all profiles with deployment tables
- [user-guide.md](user-guide.md) — run service and API overview
