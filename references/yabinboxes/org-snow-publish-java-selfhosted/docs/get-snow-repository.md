# getRepositoryBySnowName()

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**HTTP:** `GET /connectors/get-snow-repository`  
**Controller:** `SnowRepositoryQueryController.getRepositoryBySnowName()`  
**Handler:** `SnowUrlQueryHandlerImpl.getRepositoryBySnowName(snowName, gitType)`  
**Table:** `connectors.snow_deployments_anonymous`  
**Auth:** none. See [api-authentication-and-security.md](api-authentication-and-security.md).  
**CORS:** allow all

Returns the deployment `repository` for `snowName`. Optional `gitType` filters the anonymous row. Same lookup as [get-snow-url.md](get-snow-url.md), selecting `repository` instead of `url`.

Query params and JSON use **camelCase**.

Missing/invalid Bearer → HTTP `401` `{"error":"Invalid or expired no token check"}`.

---

## Request and response

```bash
curl "http://localhost:8080/connectors/get-snow-repository?snowName=payments-api&gitType=github" \
  ```

| Query param | Required | Description |
|---|---|---|
| `snowName` | yes | Matches `snow_name`. Blank → HTTP 400. |
| `gitType` | no | When set, also matches `git_type`. |

**Found:** HTTP `200` → `{"repository": "acme/payments-api"}`  
**Not found:** HTTP `200` → `{"repository": ""}`  
**Missing param:** HTTP `400` → `{"error": "snowName parameter is required"}`

Latest `created_at` wins when several rows match.

---

## Flow

```
GET /connectors/get-snow-repository?snowName=X&gitType=Z
        │
        ▼
SnowRepositoryQueryController → validate snowName
        │
        ▼
SnowUrlQueryHandlerImpl.getRepositoryBySnowName(snowName, gitType)
        └── SnowDeploymentsAnonymousRepository.findRepositoryBySnowName(snowName, gitType)
        │
        ▼
HTTP 200 + {"repository": "..."} or {"repository": ""}
```

---

## Handler interface

```java
Optional<String> getRepositoryBySnowName(String snowName, String gitType);
```

---

## Related docs

- [api-authentication-and-security.md](api-authentication-and-security.md) — Bearer auth for `/connectors/**`
- [get-snow-url.md](get-snow-url.md) — URL lookup
- [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md) — all profiles with per-profile deployment tables
- [user-guide.md](user-guide.md) — run service and API overview
