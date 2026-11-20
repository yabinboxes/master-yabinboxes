# API authentication and security

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**Scope:** HTTP APIs under `/connectors/**` and related secrets  
**Components:** `SnowTokenPipelineAuthInterceptor`, `SnowTokenPipelineVerifier`, `WebConfig`

Publish POST and get-snow-url require a `snowTokenPipeline` bearer token. Other `/connectors/**` requests are not token-checked.

---

## Security model (summary)

| Path | Auth | CORS |
|---|---|---|
| `POST /connectors/publish-snow-deployment` | `Authorization: Bearer <snowTokenPipeline>` | Allow all |
| `GET /connectors/get-snow-url` | `Authorization: Bearer <snowTokenPipeline>` | Allow all |
| All other `/connectors/**` | None | Allow all |
| Health / OpenAPI (outside `/connectors/**`) | None | Allow all |

There is no Spring Security filter chain. Pipeline auth is a Spring MVC interceptor registered in `WebConfig`.

Toggle: `snow.auth.token-validation-enabled` (default `true`). When `false`, the pipeline Bearer check is skipped.

---

## Request flow for `POST /connectors/publish-snow-deployment` and `GET /connectors/get-snow-url`

```
Client
  │  Authorization: Bearer <snow-token-pipeline>
  ▼
WebConfig CORS allow all (CorsFilter)
  │
  ▼
SnowTokenPipelineAuthInterceptor
  ├── OPTIONS → allow (preflight)
  ├── snow.auth.token-validation-enabled=false? → allow
  ├── extractBearerToken(Authorization)
  └── SnowTokenPipelineVerifier.verify(token)
          ├── resolve profile_owners (by snow_token_pipeline or JWT claims)
          ├── read snowToken from profile_owners
          └── verify JWT HMAC with SHA-256(snowToken)
                fail → 401
  │
  ▼
Controller / handler
```

**401 body:**

```json
{"error":"Invalid or missing snowTokenPipeline Bearer token"}
```

`snowToken` is **not** accepted in the JSON body. Auth is header-only via `snowTokenPipeline`.

Required publish body fields: `actorId`, `gitType`, `snowType`, `snowName`, `repository`, `repositoryOwner`.

`DELETE /connectors/publish-snow-deployment` is not checked by this interceptor.

### Example

```bash
curl -X POST http://localhost:8080/connectors/publish-snow-deployment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -d '{
    "actorId": "54486644",
    "gitType": "github",
    "snowType": "SERVICE",
    "snowName": "payments-api",
    "repository": "acme/payments-api",
    "repositoryOwner": "acme"
  }'
```

Obtain the pipeline JWT from [get-snow-token-pipeline.md](get-snow-token-pipeline.md).

---

## Enable / disable token validation

Property (default `true` — pipeline Bearer validation on):

```properties
snow.auth.token-validation-enabled=${SNOW_AUTH_TOKEN_VALIDATION_ENABLED:true}
```

| Value | Behavior |
|---|---|
| `true` (default) | `snowTokenPipeline` Bearer is validated on publish POST and get-snow-url. |
| `false` | That interceptor skips validation. |

Keep enabled in production. Set `false` only for local/dev when the pipeline token is not required.

```bash
SNOW_AUTH_TOKEN_VALIDATION_ENABLED=false
```

---

## Token systems

| Token | Where | Purpose | Used as Bearer for |
|---|---|---|---|
| Profile `snowTokenPipeline` | `Authorization` header + `profile_owners.snow_token_pipeline` | Pipeline / CI auth | `POST /connectors/publish-snow-deployment`, `GET /connectors/get-snow-url` |
| Profile `snowToken` | `profile_owners.snow_token` | HMAC secret for pipeline JWT | Never sent as Bearer |

- `snowToken` on `ProfileQuery` is **write-only** (never returned in JSON).
- Publish verification loads `snowToken` from `profile_owners` and cryptographically verifies the Bearer JWT.

---

## CORS

CORS **allows all** origins, methods, and headers (including `Authorization`).

Implemented with an early servlet `CorsFilter` (`Ordered.HIGHEST_PRECEDENCE`) plus `WebMvcConfigurer.addCorsMappings("/**")`, so browser `OPTIONS` preflight succeeds before MVC/auth interceptors.

---

## Interceptor registration

```java
registry.addInterceptor(snowTokenPipelineAuthInterceptor)
        .addPathPatterns(
                "/connectors/publish-snow-deployment",
                "/connectors/get-snow-url");
```

---

## Protected vs open endpoints

### Pipeline auth — `snowTokenPipeline` Bearer

| Method | Path |
|---|---|
| `POST` | `/connectors/publish-snow-deployment` |
| `GET` | `/connectors/get-snow-url` |

### Open

Other `/connectors/**` paths, including profile, deployment queries, tabs, self-hosted, and `DELETE /connectors/publish-snow-deployment`. Health, liveness, and OpenAPI stay outside the interceptor.

---

## Client integration checklist

1. Read or regenerate `snowTokenPipeline` for the profile (`GET`/`PUT` `/connectors/profile/snow-token-pipeline`).
2. Send `Authorization: Bearer <snowTokenPipeline>` on `POST /connectors/publish-snow-deployment` and `GET /connectors/get-snow-url`.
3. Do not put `snowToken` or `snowTokenPipeline` in the publish JSON body.
4. CORS allows any origin.

### Postman

| Variable | Use |
|---|---|
| `{{snowTokenPipeline}}` | Bearer on Publish Snow Deployment and Get URL by Snow Name |

---

## Components reference

| Class | Role |
|---|---|
| `com.snow.config.WebConfig` | CORS allow-all (`CorsFilter` + MVC) + interceptor registration |
| `com.snow.config.SnowTokenPipelineAuthInterceptor` | Pipeline Bearer for publish POST and get-snow-url |
| `com.snow.service.SnowTokenPipelineVerifier` | Read the Bearer header, resolve profile, verify JWT with `snowToken` |

---

## Related docs

- [publish-snow-deployment.md](publish-snow-deployment.md) — publish API (`snowTokenPipeline` Bearer)
- [get-snow-token-pipeline.md](get-snow-token-pipeline.md) — read/regenerate pipeline JWT
- [get-profile.md](get-profile.md) — profile create/update; write-only `snowToken`
- [user-guide.md](user-guide.md) — API reference and examples
- [business-logic.md](business-logic.md) — pipeline and domain rules
