# Snow Publish Java — User Guide

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**Stack:** Spring Boot 3.4 · Java 21 · PostgreSQL (`connectors` schema) · package `com.snow`

Spring Boot service that ingests Snow deployment events, processes them asynchronously, and exposes read APIs for profile-scoped and global deployment data.

---

## Run the Service

**Requirements:** Java 21+, PostgreSQL with `connectors` schema tables.

**Environment variables:**

| Variable | Default | Purpose |
|---|---|---|
| `POSTGRES_USER` | `postgres` | DB user |
| `POSTGRES_PASSWORD` | `admin` | DB password |
| `POSTGRES_DB_URL` | `jdbc:postgresql://postgres:5432/postgres` | JDBC URL |
| `SNOW_AUTH_TOKEN_VALIDATION_ENABLED` | `true` | Enforce `snowTokenPipeline` Bearer on publish POST and get-snow-url |

```bash
./mvnw spring-boot:run
```

Listens on `http://0.0.0.0:8080`.

```bash
./mvnw clean package
java -jar target/snow-publish-java-selfhosted-1.0.0-SNAPSHOT.jar
```

**Health check:** `GET /health` → `Healthy`

**API docs:**

- Swagger UI: `/swagger-ui.html`
- OpenAPI: `/openapi`

---

## How Publishing Works

1. `POST /connectors/publish-snow-deployment` queues the event and returns `201` immediately.
2. `ScheduledCommandTasks` (every 1s) writes to persistent + volatile PostgreSQL tables.
3. `ScheduledProcessTasks` (every 2s) upserts `snow_deployments_anonymous` by `repository` when `profile_owners` matches the deployment `actorId` + `gitType`.
4. Profile must exist (`POST /connectors/profile`) for the anonymous upsert. Missing profile → volatile row is still marked processed and deleted, but no anonymous upsert.

**Query endpoints:**

| Endpoint | Reads from |
|---|---|
| `GET /connectors/get-snow-deployments` | `snow_deployments_anonymous` |
| `GET /connectors/get-snow-deployments/all` | `snow_deployments_anonymous` |
| `GET /connectors/get-snow-url?snowName=Y&gitType=Z` | `snow_deployments_anonymous` |
| `GET /connectors/get-snow-repository?snowName=Y&gitType=Z` | `snow_deployments_anonymous` |
| `GET /connectors/get-snow-repository/all` | `profile_owners` (all) + each `snow_deployments_{profile_id}` |

No sensitive tokens are returned in query responses.

---

## API Reference

All JSON bodies and query parameters use **camelCase** (`actorId`, `gitType`, `snowName`). Database columns remain snake_case internally.

**Auth** (see [api-authentication-and-security.md](api-authentication-and-security.md)):

| Path | Header | CORS |
|---|---|---|
| `POST /connectors/publish-snow-deployment` | `Authorization: Bearer <snowTokenPipeline>` | Allow all |
| `GET /connectors/get-snow-url` | `Authorization: Bearer <snowTokenPipeline>` | Allow all |
| Other `/connectors/**` | none | Allow all |

`snowTokenPipeline` validation is **on by default** (`snow.auth.token-validation-enabled=true`). A missing or invalid pipeline token on publish POST or get-snow-url returns HTTP `401`. Set `false` only for local/dev.

Health/Swagger endpoints are not under `/connectors/**` and stay open.

CORS: allow all origins/methods/headers via early `CorsFilter`.

### Deployments

| Method | Path | Description |
|---|---|---|
| `POST` | `/connectors/publish-snow-deployment` | Queue a deployment event |
| `DELETE` | `/connectors/publish-snow-deployment?repository=X&actorId=Y&gitType=Z` | Delete profile-table row by repository (`gitType` optional) |
| `GET` | `/connectors/get-snow-deployments` | List all rows from `snow_deployments_anonymous` |
| `GET` | `/connectors/get-snow-deployments/all` | List all rows from `snow_deployments_anonymous` |
| `GET` | `/connectors/get-snow-url?snowName=X&gitType=Z` | Resolve URL from anonymous table (`gitType` optional) |
| `GET` | `/connectors/get-snow-repository?snowName=X&gitType=Z` | Resolve repository from anonymous table (`gitType` optional) |
| `GET` | `/connectors/get-snow-repository/all` | All profiles and each profile's deployment table |
| `PUT` | `/connectors/publish-snow-deployment/color/{id}?color=X` | Set display color |
| `PUT` | `/connectors/publish-snow-deployment/liveness-type/{id}?livenessType=X` | Set liveness type |
| `DELETE` | `/connectors/publish-snow-deployment/liveness-type/{id}` | Clear liveness type |
| `PUT` | `/connectors/publish-snow-deployment/liveness-status/{id}?livenessStatus=X` | Set liveness status |
| `DELETE` | `/connectors/publish-snow-deployment/liveness-status/{id}` | Clear liveness status |
| `GET` | `/connectors/publish-snow-deployment/table-data?tableName=X` | Read all rows from named table |
| `DELETE` | `/connectors/publish-snow-deployment/truncate` | Truncate all connector tables |

`GET /connectors/get-snow-deployments` takes no query filters. It returns every row in `snow_deployments_anonymous`.

**Valid publish types:** `CLUSTER`, `SERVICE`, `APPLICATION`, `WORKFLOW_CALL`, `REPOSITORY`, `RESOURCE`

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service health |
| `POST` | `/health/liveness-status` | Update liveness by repository |
| `GET` | `/liveness-test` | Returns `active` |

### Profiles

| Method | Path | Description |
|---|---|---|
| `POST` | `/connectors/profile` | Get or create by email |
| `PUT` | `/connectors/profile` | Update actor, actorId, snowToken, license, org |
| `GET` | `/connectors/profile/snow-token-pipeline?actorId=X&gitType=Y` | Get pipeline token |
| `PUT` | `/connectors/profile/snow-token-pipeline?actorId=X&gitType=Y` | Regenerate pipeline token |
| `PUT` | `/connectors/profile/license` | Update license |

### Tabs

| Method | Path | Description |
|---|---|---|
| `POST` | `/connectors/tabs` | Create tab |
| `GET` | `/connectors/tabs` | List tabs |
| `PUT` | `/connectors/tabs/{tabId}` | Rename tab |
| `DELETE` | `/connectors/tabs/{tabId}` | Delete tab |

### Self-hosted

| Method | Path | Description |
|---|---|---|
| `GET` | `/connectors/self-hosted` | Read the single `self_hosted` row |
| `PUT` | `/connectors/self-hosted` | Update fields sent on the body. Omitted fields stay unchanged. Does not insert a row |
| `GET` | `/connectors/self-hosted/first-time-flag` | Read `{ "firstTimeFlag": 1 }` from the single `self_hosted` row |
| `PUT` | `/connectors/self-hosted/first-time-flag` | Write `auth`, `baseUrl`, `clientId`, `redirectUri`, and `hostBaseUrl`, and set `firstTimeFlag` to `0` |

---

## Examples

### Publish

Required fields: `actorId`, `gitType`, `snowType`, `snowName`, `repository`, `repositoryOwner`.  
Auth: `Authorization: Bearer <snowTokenPipeline>` (not in body). CORS allow all.

```bash
curl -X POST http://localhost:8080/connectors/publish-snow-deployment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <snow-token-pipeline>" \
  -d '{
    "actorId": "54486644",
    "gitType": "github",
    "email": "dev@example.com",
    "snowType": "SERVICE",
    "snowName": "payments-api",
    "repository": "acme/payments-api",
    "repositoryOwner": "acme",
    "url": "https://payments.acme.io",
    "terraformOutput": "Apply complete! Resources: 1 added, 0 changed, 0 destroyed."
  }'
```

Response: `201` / `completed`

Include `actorId` and `gitType` matching a profile so `processDeployments` can upsert `snow_deployments_anonymous`.

### Delete by repository (profile table)

Auth: `Authorization: Bearer <>` (not the pipeline token).

```bash
curl -X DELETE "http://localhost:8080/connectors/publish-snow-deployment?repository=acme/payments-api&actorId=54486644&gitType=github" \
  ```

`repository` and `actorId` are required. Optional `gitType` filters profile lookup. Deletes the matching row from `snow_deployments_{profile_id}`. Returns `{"message":"Deployment deleted successfully","repository":"..."}` or HTTP `404` if the profile or row is missing.

### Query deployments (anonymous table)

```bash
curl http://localhost:8080/connectors/get-snow-deployments \
  curl http://localhost:8080/connectors/get-snow-deployments/all \
  ```

Both return every row from `snow_deployments_anonymous`.

### URL lookup (anonymous table)

```bash
curl "http://localhost:8080/connectors/get-snow-url?snowName=payments-api&gitType=github" \
  -H "Authorization: Bearer <snow-token-pipeline>"
```

`snowName` is required. Optional `gitType` filters the anonymous row. Returns `{"url": "..."}` or `{"url": ""}` if not found. Auth uses `snowTokenPipeline` (same as publish).

### Repository lookup (anonymous table)

```bash
curl "http://localhost:8080/connectors/get-snow-repository?snowName=payments-api&gitType=github" \
  ```

Returns `{"repository": "..."}` or `{"repository": ""}` if not found.

### All profiles with deployments

```bash
curl http://localhost:8080/connectors/get-snow-repository/all \
  ```

Returns HTTP `200` with a JSON array. Each element has `profile` (full `profile_owners` row) and `deployments` (all rows from `snow_deployments_{profileId}`, or `[]` if that table does not exist). See [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md).

### Profile

```bash
curl -X POST http://localhost:8080/connectors/profile \
  -H "Content-Type: application/json" \
  -d '{"email": "dev@example.com", "actor": "yabinboxes", "actorId": "54486644", "gitType": "github"}'
```

New profiles get: `snowToken` (compact UUID), `snowTokenPipeline` (JWT signed with `snowToken`), `license` (`self`), `org` (`""`), and an empty `snow_deployments_{profile_id}` table.

`POST /connectors/profile` response does **not** include `snowToken` (write-only) or `snowTokenPipeline`. Read/regenerate the pipeline JWT via [get-snow-token-pipeline.md](get-snow-token-pipeline.md).

```bash
curl "http://localhost:8080/connectors/profile/snow-token-pipeline?actorId=54486644&gitType=github" \
  curl -X PUT "http://localhost:8080/connectors/profile/snow-token-pipeline?actorId=54486644&gitType=github" \
  ```

### Liveness by repository

```bash
curl -X POST http://localhost:8080/health/liveness-status \
  -H "Content-Type: application/json" \
  -d '{"repository": "acme/payments-api", "status": "healthy", "response": "HTTP 200"}'
```

| Request `status` | Stored value |
|---|---|
| `unhealthy` | `inactive` |
| anything else | `active` |

### Color

```bash
curl -X PUT "http://localhost:8080/connectors/publish-snow-deployment/color/42?color=blue" \
  ```

`color=nocolor` clears the field.

---

## Publish Request Fields

| Field / header | Required |
|---|---|
| `Authorization: Bearer <snowTokenPipeline>` | yes (header) |
| `actorId` | yes |
| `gitType` | yes |
| `snowType` | yes |
| `snowName` | yes |
| `repository` | yes |
| `repositoryOwner` | yes |
| `actor`, `email`, `sha`, `provider`, `status`, `payload`, `url`, `environment`, `urlPath`, `tabName`, `tabId`, `port`, `image`, `registry`, `notes`, `extras`, `description`, `healthCheckUrl`, `healthCheckTime`, `livenessType`, `livenessStatus`, `livenessResponse`, `terraformOutput` | no |

---

## Status Codes

| Code | When |
|---|---|
| `200` | Success |
| `201` | Deployment queued or tab created |
| `400` | Invalid request (e.g. missing `snowName`, `actorId`, or required publish `gitType`) |
| `401` | Missing/invalid no token check (most `/connectors/**`, including DELETE publish) or `snowTokenPipeline` Bearer (publish POST, get-snow-url) |
| `404` | Not found |
| `500` | Server error |

**CORS:** allow all origins, methods, and headers. See [api-authentication-and-security.md](api-authentication-and-security.md).

---

## Documentation index

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java — see also [docs/README.md](README.md).

| Doc | Topic |
|---|---|
| [user-guide.md](user-guide.md) | Run, API reference, examples |
| [business-logic.md](business-logic.md) | Pipeline, schema, domain rules |
| [database-schema.md](database-schema.md) | `connectors` tables, columns, defaults, indexes |
| [api-authentication-and-security.md](api-authentication-and-security.md) | API auth, no token check, credentials, CORS |
| [api-authentication-and-security.md](api-authentication-and-security.md) | Short Bearer how-to for `/connectors/**` |
| [publish-snow-deployment.md](publish-snow-deployment.md) | `POST`/`DELETE /connectors/publish-snow-deployment` |
| [process-deployments.md](process-deployments.md) | Background anonymous upsert task |
| [get-profile.md](get-profile.md) | Profile create/update |
| [get-snow-token-pipeline.md](get-snow-token-pipeline.md) | Read/regenerate pipeline token |
| [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) | List rows from `snow_deployments_anonymous` |
| [get-snow-url.md](get-snow-url.md) | Resolve URL by `snowName` |
| [get-snow-repository.md](get-snow-repository.md) | Resolve repository by `snowName` |
| [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md) | All profiles + profile deployment tables |

## Further Reading

- [api-authentication-and-security.md](api-authentication-and-security.md) — API auth and security
- [api-authentication-and-security.md](api-authentication-and-security.md) — Bearer auth for `/connectors/**`
- [business-logic.md](business-logic.md) — pipeline, schema, domain rules
- [database-schema.md](database-schema.md) — `connectors` tables, columns, defaults, and indexes
- [publish-snow-deployment.md](publish-snow-deployment.md) — enqueue or delete deployment (`POST`/`DELETE /connectors/publish-snow-deployment`)
- [process-deployments.md](process-deployments.md) — `processDeployments()` upserts `snow_deployments_anonymous`
- [get-profile.md](get-profile.md) — full `getProfile()` method explained line by line
- [get-snow-token-pipeline.md](get-snow-token-pipeline.md) — read and regenerate pipeline token
- [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) — list `snow_deployments_anonymous`
- [get-snow-url.md](get-snow-url.md) — resolve deployment URL by `snowName`
- [get-snow-repository.md](get-snow-repository.md) — resolve deployment repository by `snowName`
- [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md) — all profiles with profile-scoped deployment tables
