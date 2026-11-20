# getUrlBySnowName()

**Project:** `snow-publish-java` · Snow Publish Java  
**HTTP:** `GET /connectors/get-snow-url`  
**Controller:** `SnowUrlQueryController.getUrlBySnowName()`  
**Handler:** `SnowUrlQueryHandlerImpl.getUrlBySnowName()`  
**Tables:** `connectors.profile_owners` (lookup), `connectors.snow_deployments_{profile_id}` (read)  
**Auth:** `Authorization: Bearer <snowTokenPipeline>` (pipeline JWT; not Firebase; required by default) — see [api-authentication-and-security.md](api-authentication-and-security.md)  
**CORS:** allow all

Returns the deployment `url` for `snowName` + `actorId`. Optional `gitType` filters profile lookup and deployment row match. Does **not** read `snow_deployments_anonymous`.

Query params and JSON use **camelCase** (see `.cursor/rules/api-json-camelcase.mdc`).

Bearer validation is on by default (`snow.auth.token-validation-enabled=true`).  
Missing/invalid Bearer → HTTP `401` `{"error":"Invalid or missing snowTokenPipeline Bearer token"}`.

Same auth as `POST /connectors/publish-snow-deployment`: `SnowTokenPipelineAuthInterceptor` → `SnowTokenPipelineVerifier` (HMAC with `profile_owners.snow_token`). `DELETE /connectors/publish-snow-deployment` uses Firebase Bearer instead.

---

## Request and response

```bash
curl "http://localhost:8080/connectors/get-snow-url?snowName=my-service-v1.2.0&actorId=54486644&gitType=github" \
  -H "Authorization: Bearer <snow-token-pipeline>"
```

| Query param | Required | Description |
|---|---|---|
| `snowName` | yes | Matches `snow_name` column. Blank → HTTP 400. |
| `actorId` | yes | Resolves `profile_id` via `profile_owners.actor_id`. Blank → HTTP 400. |
| `gitType` | no | Profile lookup + deployment SQL filter when set. Omit → `actorId` / `snowName` only. |

**Found:** HTTP `200` → `{"url": "https://my-service.example.com"}`  
**Not found:** HTTP `200` → `{"url": ""}`  
**Missing param:** HTTP `400` → `{"error": "snowName parameter is required"}` or `actorId parameter is required`  
**Auth fail:** HTTP `401` → `{"error":"Invalid or missing snowTokenPipeline Bearer token"}`

Latest `created_at` wins when multiple rows match.

Obtain the pipeline JWT from [get-snow-token-pipeline.md](get-snow-token-pipeline.md) (that read/regenerate API still uses Firebase Bearer).

---

## Flow

```
GET /connectors/get-snow-url?snowName=X&actorId=Y&gitType=Z
        │  Authorization: Bearer <snowTokenPipeline>
        ▼
SnowTokenPipelineAuthInterceptor
        ├── extractBearerToken
        └── SnowTokenPipelineVerifier.verify  → 401 if fail
        │
        ▼
SnowUrlQueryController.getUrlBySnowName(snowName, actorId, gitType)
        ├── snowName / actorId blank? → HTTP 400
        │
        ▼
SnowUrlQueryHandlerImpl.getUrlBySnowName(snowName, actorId, gitType)
        ├── getProfileByActorId(actorId, gitType)
        └── findUrlBySnowName(profileId, snowName, gitType)
        │
        ▼
HTTP 200 + {"url": "..."} or {"url": ""}
```

---

## Related docs

- [api-authentication-and-security.md](api-authentication-and-security.md) — `snowTokenPipeline` Bearer
- [publish-snow-deployment.md](publish-snow-deployment.md) — same pipeline Bearer auth
- [get-snow-token-pipeline.md](get-snow-token-pipeline.md) — obtain / regenerate pipeline JWT
- [get-snow-repository.md](get-snow-repository.md) — repository lookup (Firebase Bearer)
- [user-guide.md](user-guide.md) — API overview
