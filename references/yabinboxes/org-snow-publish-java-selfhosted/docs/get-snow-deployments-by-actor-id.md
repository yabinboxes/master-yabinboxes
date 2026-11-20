# getSnowDeployments()

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**HTTP:** `GET /connectors/get-snow-deployments`  
**Controller:** `SnowDeploymentQueryController.getSnowDeployments()`  
**Handler:** `SnowDeploymentQueryHandlerImpl.getSnowDeployments()`  
**Table:** `connectors.snow_deployments_anonymous`  
**Auth:** none. See [api-authentication-and-security.md](api-authentication-and-security.md).

Returns every row from `snow_deployments_anonymous`. No query parameters. Response JSON uses **camelCase**.

Always returns HTTP `200` with a JSON array (empty when the table has no rows). Missing/invalid Bearer → HTTP `401`.

`GET /connectors/get-snow-deployments/all` calls `listAll()` on the same table.

---

## Request

```bash
curl http://localhost:8080/connectors/get-snow-deployments \
  ```

---

## Flow

```
GET /connectors/get-snow-deployments
        │
        ▼
SnowDeploymentQueryController.getSnowDeployments()
        │
        ▼
SnowDeploymentQueryHandlerImpl.getSnowDeployments()
        └── SnowDeploymentsAnonymousRepository.listAll()
                └── SELECT from connectors.snow_deployments_anonymous
        │
        ▼
HTTP 200 + JSON array
```

---

## Behavior summary

| Scenario | HTTP | Body |
|---|---|---|
| Rows exist in `snow_deployments_anonymous` | 200 | JSON array |
| Table is empty | 200 | `[]` |

Rows are written by `processDeployments()` when the published deployment has a matching profile. See [process-deployments.md](process-deployments.md).

---

## Related endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/connectors/get-snow-deployments/all` | Same table, `listAll()` |
| `GET` | `/connectors/get-snow-url?snowName=X&gitType=Y` | One URL from `snow_deployments_anonymous` |
| `GET` | `/connectors/get-snow-repository?snowName=X&gitType=Y` | One repository from `snow_deployments_anonymous` |
| `GET` | `/connectors/get-snow-repository/all` | All profiles and each `snow_deployments_{profile_id}` |

---

## Related docs

- [process-deployments.md](process-deployments.md) — how rows are upserted
- [get-snow-url.md](get-snow-url.md) — URL lookup by `snowName`
- [get-snow-repository.md](get-snow-repository.md) — repository lookup by `snowName`
- [user-guide.md](user-guide.md) — API overview
