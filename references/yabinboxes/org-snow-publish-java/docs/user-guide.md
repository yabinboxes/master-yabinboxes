# Snow Publish Java — User Guide

**Project:** `snow-publish-java` · Snow Publish Java  
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
| `SNOW_AUTH_TOKEN_VALIDATION_ENABLED` | `true` | Enforce Bearer on `/connectors/**` |
| `FIREBASE_ADMINSDK` | (none) | Base64 Firebase service-account JSON (needed when auth is on) |
| `GOOGLE_APPLICATION_CREDENTIALS` | (none) | Alt: path to Firebase service-account JSON file |

When auth is enabled (default), provide Firebase credentials via `FIREBASE_ADMINSDK`, `GOOGLE_APPLICATION_CREDENTIALS`, or the classpath service-account file. See [api-authentication-and-security.md](api-authentication-and-security.md).

```bash
./mvnw spring-boot:run
```

Listens on `http://0.0.0.0:8080`.

```bash
./mvnw clean package
java -jar target/snow-publish-java-1.0.0-SNAPSHOT.jar
```

**Health check:** `GET /health` → `Healthy`

**API docs:**

- Swagger UI: `/swagger-ui.html`
- OpenAPI: `/openapi`

---

## How Publishing Works

1. `POST /connectors/publish-snow-deployment` queues the event and returns `201` immediately.
2. `ScheduledCommandTasks` (every 1s) writes to persistent + volatile PostgreSQL tables.
3. `ScheduledProcessTasks` (every 2s) upserts into `snow_deployments_{profile_id}` — profile resolved by deployment `actorId` + `gitType` via `profile_owners`. Does **not** write `snow_deployments_anonymous`.
4. Profile must exist (`POST /connectors/profile`) for deployments to land in a profile table. Missing profile → volatile row still processed and deleted, but no profile upsert.

**Query endpoints:**

| Endpoint | Reads from |
|---|---|
| `GET /connectors/get-snow-deployments?actorId=X` | `profile_owners` → `snow_deployments_{profile_id}` |
| `GET /connectors/get-snow-deployments/all` | `snow_deployments_anonymous` (global) |
| `GET /connectors/get-snow-url?actorId=X&snowName=Y` | `profile_owners` → `snow_deployments_{profile_id}` |
| `GET /connectors/get-snow-repository?actorId=X&snowName=Y` | `profile_owners` → `snow_deployments_{profile_id}` |
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
| Other `/connectors/**` (including DELETE publish) | `Authorization: Bearer <firebase-id-token>` | Allow all |

Bearer validation is **on by default** (`snow.auth.token-validation-enabled=true`). Missing/invalid token → HTTP `401`. Set `false` only for local/dev.

Health/Swagger endpoints are not under `/connectors/**` and stay open.

CORS: allow all origins/methods/headers via early `CorsFilter`.

### Deployments

| Method | Path | Description |
|---|---|---|
| `POST` | `/connectors/publish-snow-deployment` | Queue a deployment event |
| `DELETE` | `/connectors/publish-snow-deployment?repository=X&actorId=Y&gitType=Z` | Delete profile-table row by repository (`gitType` optional) |
| `GET` | `/connectors/get-snow-deployments` | List deployments for a profile by `actorId` |
| `GET` | `/connectors/get-snow-deployments/all` | List all rows from global anonymous table |
| `GET` | `/connectors/get-snow-deployments-persistent` | All rows in `data_source_snow_deployments_persistent` |
| `GET` | `/connectors/get-snow-url?snowName=X&actorId=Y&gitType=Z` | Resolve URL from profile table (`gitType` optional) |
| `GET` | `/connectors/get-snow-repository?snowName=X&actorId=Y&gitType=Z` | Resolve repository from profile table (`gitType` optional) |
| `GET` | `/connectors/get-snow-repository/all` | All profiles and each profile's deployment table |
| `PUT` | `/connectors/publish-snow-deployment/color/{id}?color=X` | Set display color |
| `PUT` | `/connectors/publish-snow-deployment/liveness-type/{id}?livenessType=X` | Set liveness type |
| `DELETE` | `/connectors/publish-snow-deployment/liveness-type/{id}` | Clear liveness type |
| `PUT` | `/connectors/publish-snow-deployment/liveness-status/{id}?livenessStatus=X` | Set liveness status |
| `DELETE` | `/connectors/publish-snow-deployment/liveness-status/{id}` | Clear liveness status |
| `GET` | `/connectors/publish-snow-deployment/table-data?tableName=X` | Read all rows from named table |
| `DELETE` | `/connectors/publish-snow-deployment/truncate` | Truncate all connector tables |

**Query filters** for `GET /connectors/get-snow-deployments`:

| Param | Required | Description |
|---|---|---|
| `actorId` | yes (for results) | Matches `profile_owners.actor_id`. Blank → empty array. |
| `type` | no | Filter by deployment type; omit, blank, or `ALL` → all types |
| `gitType` | no | When set, profile lookup uses `actorId` + `gitType`. Omit → match by `actorId` only. |

**Valid types:** `CLUSTER`, `SERVICE`, `APPLICATION`, `WORKFLOW_CALL`, `REPOSITORY`, `RESOURCE`

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
    "url": "https://payments.acme.io"
  }'
```

Response: `201` / `completed`

Include `actorId` and `gitType` matching a profile so `processDeployments` can upsert into `snow_deployments_{profile_id}`.

### Delete by repository (profile table)

Auth: `Authorization: Bearer <firebase-id-token>` (not the pipeline token).

```bash
curl -X DELETE "http://localhost:8080/connectors/publish-snow-deployment?repository=acme/payments-api&actorId=54486644&gitType=github" \
  -H "Authorization: Bearer <firebase-id-token>"
```

`repository` and `actorId` are required. Optional `gitType` filters profile lookup. Deletes the matching row from `snow_deployments_{profile_id}`. Returns `{"message":"Deployment deleted successfully","repository":"..."}` or HTTP `404` if the profile or row is missing.

### Query by actorId (profile table)

```bash
curl "http://localhost:8080/connectors/get-snow-deployments?actorId=54486644&type=SERVICE&gitType=github" \
  -H "Authorization: Bearer <firebase-id-token>"
curl "http://localhost:8080/connectors/get-snow-deployments?actorId=54486644&type=ALL" \
  -H "Authorization: Bearer <firebase-id-token>"
```

### Query all (anonymous table)

```bash
curl http://localhost:8080/connectors/get-snow-deployments/all \
  -H "Authorization: Bearer <firebase-id-token>"
```

### URL lookup (profile table)

```bash
curl "http://localhost:8080/connectors/get-snow-url?snowName=payments-api&actorId=54486644&gitType=github" \
  -H "Authorization: Bearer <snow-token-pipeline>"
```

Both `snowName` and `actorId` are required. Optional `gitType` filters profile and deployment lookup. Returns `{"url": "..."}` or `{"url": ""}` if not found. Auth uses `snowTokenPipeline` (same as publish), not Firebase.

### Repository lookup (profile table)

```bash
curl "http://localhost:8080/connectors/get-snow-repository?snowName=payments-api&actorId=54486644&gitType=github" \
  -H "Authorization: Bearer <firebase-id-token>"
```

Returns `{"repository": "..."}` or `{"repository": ""}` if not found.

### All profiles with deployments

```bash
curl http://localhost:8080/connectors/get-snow-repository/all \
  -H "Authorization: Bearer <firebase-id-token>"
```

Returns HTTP `200` with a JSON array. Each element has `profile` (full `profile_owners` row) and `deployments` (all rows from `snow_deployments_{profileId}`, or `[]` if that table does not exist). See [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md).

### Profile

```bash
curl -X POST http://localhost:8080/connectors/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <firebase-id-token>" \
  -d '{"email": "dev@example.com", "actor": "yabinboxes", "actorId": "54486644", "gitType": "github"}'
```

New profiles get: `snowToken` (compact UUID), `snowTokenPipeline` (JWT signed with `snowToken`), `license` (`self`), `org` (`""`), and an empty `snow_deployments_{profile_id}` table.

`POST /connectors/profile` response does **not** include `snowToken` (write-only) or `snowTokenPipeline`. Read/regenerate the pipeline JWT via [get-snow-token-pipeline.md](get-snow-token-pipeline.md).

```bash
curl "http://localhost:8080/connectors/profile/snow-token-pipeline?actorId=54486644&gitType=github" \
  -H "Authorization: Bearer <firebase-id-token>"
curl -X PUT "http://localhost:8080/connectors/profile/snow-token-pipeline?actorId=54486644&gitType=github" \
  -H "Authorization: Bearer <firebase-id-token>"
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
  -H "Authorization: Bearer <firebase-id-token>"
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
| `actor`, `email`, `sha`, `provider`, `status`, `payload`, `url`, `environment`, `urlPath`, `tabName`, `tabId`, `port`, `image`, `registry`, `notes`, `extras`, `description`, `healthCheckUrl`, `healthCheckTime`, `livenessType`, `livenessStatus`, `livenessResponse`, `terraformOutput`, `terraformVars`, `dockerOutput`, `dockerVars` | no |

---

## Status Codes

| Code | When |
|---|---|
| `200` | Success |
| `201` | Deployment queued or tab created |
| `400` | Invalid request (e.g. missing `snowName`, `actorId`, or required publish `gitType`) |
| `401` | Missing/invalid Firebase Bearer (most `/connectors/**`, including DELETE publish) or `snowTokenPipeline` Bearer (publish POST, get-snow-url) |
| `404` | Not found |
| `500` | Server error |

**CORS:** allow all origins, methods, and headers. See [api-authentication-and-security.md](api-authentication-and-security.md).

---

## Documentation index

**Project:** `snow-publish-java` · Snow Publish Java — see also [docs/README.md](README.md).

| Doc | Topic |
|---|---|
| [user-guide.md](user-guide.md) | Run, API reference, examples |
| [business-logic.md](business-logic.md) | Pipeline, schema, domain rules |
| [api-authentication-and-security.md](api-authentication-and-security.md) | API auth, Firebase Bearer, credentials, CORS |
| [firebase-bearer-auth.md](firebase-bearer-auth.md) | Short Bearer how-to for `/connectors/**` |
| [publish-snow-deployment.md](publish-snow-deployment.md) | `POST`/`DELETE /connectors/publish-snow-deployment` |
| [process-deployments.md](process-deployments.md) | Background profile upsert task |
| [get-profile.md](get-profile.md) | Profile create/update |
| [get-snow-token-pipeline.md](get-snow-token-pipeline.md) | Read/regenerate pipeline token |
| [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) | List deployments by `actorId` |
| [get-snow-url.md](get-snow-url.md) | Resolve URL by `snowName` |
| [get-snow-repository.md](get-snow-repository.md) | Resolve repository by `snowName` |
| [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md) | All profiles + profile deployment tables |

## Further Reading

- [api-authentication-and-security.md](api-authentication-and-security.md) — API auth and security
- [firebase-bearer-auth.md](firebase-bearer-auth.md) — Bearer auth for `/connectors/**`
- [business-logic.md](business-logic.md) — pipeline, schema, domain rules
- [publish-snow-deployment.md](publish-snow-deployment.md) — enqueue or delete deployment (`POST`/`DELETE /connectors/publish-snow-deployment`)
- [process-deployments.md](process-deployments.md) — full `processDeployments()` method explained line by line
- [get-profile.md](get-profile.md) — full `getProfile()` method explained line by line
- [get-snow-token-pipeline.md](get-snow-token-pipeline.md) — read and regenerate pipeline token
- [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) — profile-scoped deployment query
- [get-snow-url.md](get-snow-url.md) — resolve deployment URL by `snowName` and `actorId`
- [get-snow-repository.md](get-snow-repository.md) — resolve deployment repository by `snowName` and `actorId`
- [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md) — all profiles with profile-scoped deployment tables
