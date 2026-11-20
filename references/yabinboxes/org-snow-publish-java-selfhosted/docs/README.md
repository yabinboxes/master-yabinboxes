# snow-publish-java-selfhosted documentation

**Project:** `snow-publish-java-selfhosted` · **Snow Publish Java**

Spring Boot service that ingests Snow deployment events, processes them asynchronously, and exposes read APIs over `snow_deployments_anonymous`.

Auth: publish POST and get-snow-url use `snowTokenPipeline` Bearer. Other `/connectors/**` requests have no token check. Pipeline validation is **on by default** (`snow.auth.token-validation-enabled=true`). CORS allows all. See [api-authentication-and-security.md](api-authentication-and-security.md).

## Docs

| Doc | Topic |
|---|---|
| [differences-from-snow-publish-java.md](differences-from-snow-publish-java.md) | Differences from `snow-publish-java` |
| [user-guide.md](user-guide.md) | Run, API reference, examples |
| [business-logic.md](business-logic.md) | Pipeline, schema, domain rules |
| [database-schema.md](database-schema.md) | `connectors` tables, columns, defaults, indexes |
| [api-authentication-and-security.md](api-authentication-and-security.md) | Pipeline-token auth and CORS |
| [publish-snow-deployment.md](publish-snow-deployment.md) | `POST`/`DELETE /connectors/publish-snow-deployment` |
| [process-deployments.md](process-deployments.md) | Background anonymous upsert task |
| [get-profile.md](get-profile.md) | Profile create/update |
| [get-snow-token-pipeline.md](get-snow-token-pipeline.md) | Read/regenerate pipeline token |
| [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) | List rows from `snow_deployments_anonymous` |
| [get-snow-url.md](get-snow-url.md) | Resolve URL by `snowName` |
| [get-snow-repository.md](get-snow-repository.md) | Resolve repository by `snowName` |
| [get-all-profiles-with-deployments.md](get-all-profiles-with-deployments.md) | All profiles + profile deployment tables |
