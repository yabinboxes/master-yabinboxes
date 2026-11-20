# getUrlBySnowName()

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**HTTP:** `GET /connectors/get-snow-url`  
**Controller:** `SnowUrlQueryController.getUrlBySnowName()`  
**Handler:** `SnowUrlQueryHandlerImpl.getUrlBySnowName(snowName, gitType)`  
**Table:** `connectors.snow_deployments_anonymous`  
**Auth:** `Authorization: Bearer <snowTokenPipeline>` (pipeline JWT; required by default) — see [api-authentication-and-security.md](api-authentication-and-security.md)  
**CORS:** allow all

Returns the deployment `url` for `snowName`. Optional `gitType` filters the anonymous row. Does not look up `profile_owners` and does not read `snow_deployments_{profile_id}`.

Query params and JSON use **camelCase**.

Bearer validation is on by default (`snow.auth.token-validation-enabled=true`).  
Missing/invalid Bearer → HTTP `401` `{"error":"Invalid or missing snowTokenPipeline Bearer token"}`.

Same auth as `POST /connectors/publish-snow-deployment`: `SnowTokenPipelineAuthInterceptor` → `SnowTokenPipelineVerifier` (HMAC with `profile_owners.snow_token`).

---

## Request and response

```bash
curl "http://localhost:8080/connectors/get-snow-url?snowName=my-service-v1.2.0&gitType=github" \
  -H "Authorization: Bearer <snow-token-pipeline>"
```

| Query param | Required | Description |
|---|---|---|
| `snowName` | yes | Matches `snow_name`. Blank → HTTP 400. |
| `gitType` | no | When set, also matches `git_type`. Omit → `snowName` only. |

**Found:** HTTP `200` → `{"url": "https://my-service.example.com"}`  
**Not found:** HTTP `200` → `{"url": ""}`  
**Missing param:** HTTP `400` → `{"error": "snowName parameter is required"}`  
**Auth fail:** HTTP `401` → `{"error":"Invalid or missing snowTokenPipeline Bearer token"}`

Latest `created_at` wins when several rows match.

Obtain the pipeline JWT from [get-snow-token-pipeline.md](get-snow-token-pipeline.md).

---

## Flow

```
GET /connectors/get-snow-url?snowName=X&gitType=Z
        │  Authorization: Bearer <snowTokenPipeline>
        ▼
SnowTokenPipelineAuthInterceptor
        ├── extractBearerToken
        └── SnowTokenPipelineVerifier.verify  → 401 if fail
        │
        ▼
SnowUrlQueryController.getUrlBySnowName(snowName, gitType)
        ├── snowName blank? → HTTP 400
        │
        ▼
SnowUrlQueryHandlerImpl.getUrlBySnowName(snowName, gitType)
        └── SnowDeploymentsAnonymousRepository.findUrlBySnowName(snowName, gitType)
        │
        ▼
HTTP 200 + {"url": "..."} or {"url": ""}
```

---

## Related docs

- [api-authentication-and-security.md](api-authentication-and-security.md) — `snowTokenPipeline` Bearer
- [publish-snow-deployment.md](publish-snow-deployment.md) — same pipeline Bearer auth
- [get-snow-token-pipeline.md](get-snow-token-pipeline.md) — obtain / regenerate pipeline JWT
- [get-snow-repository.md](get-snow-repository.md) — repository lookup
- [user-guide.md](user-guide.md) — API overview
