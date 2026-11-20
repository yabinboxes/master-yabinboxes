# snow-publish-java documentation

**Project:** `snow-publish-java` · **Snow Publish Java**

Spring Boot service that ingests Snow deployment events, processes them asynchronously, and exposes read APIs for profile-scoped and global deployment data.

Auth: publish POST and get-snow-url use `snowTokenPipeline` Bearer; other `/connectors/**` (including DELETE publish) use Firebase Bearer. Bearer validation **on by default** (`snow.auth.token-validation-enabled=true`). CORS allows all. See [api-authentication-and-security.md](api-authentication-and-security.md).

## Docs

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
| [user-guide.md](user-guide.md#tabs) | `POST`/`GET`/`PUT`/`DELETE /connectors/tabs` |
| [user-guide.md](user-guide.md#deployments) | `GET /connectors/get-snow-deployments-persistent` is the persistent audit list. History in the dashboard calls it |
| [user-guide.md](user-guide.md#health) | `GET /health`, `POST /health/liveness-status`, `GET /liveness-test` |
