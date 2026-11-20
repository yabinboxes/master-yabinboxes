# API authentication and security

**Project:** `snow-publish-java` · Snow Publish Java  
**Scope:** HTTP APIs under `/connectors/**` and related secrets  
**Components:** `FirebaseAuthInterceptor`, `SnowTokenPipelineAuthInterceptor`, `FirebaseTokenVerifier`, `SnowTokenPipelineVerifier`, `FirebaseConfig`, `WebConfig`

This document describes how clients authenticate to the API, CORS policy by path, Firebase Admin credentials, and how profile tokens relate to publish auth.

For a short Firebase Bearer quick reference, see [firebase-bearer-auth.md](firebase-bearer-auth.md).

---

## Security model (summary)

| Path | Auth | CORS |
|---|---|---|
| `POST /connectors/publish-snow-deployment` | `Authorization: Bearer <snowTokenPipeline>` | Allow all |
| `GET /connectors/get-snow-url` | `Authorization: Bearer <snowTokenPipeline>` | Allow all |
| All other `/connectors/**` (including `DELETE /connectors/publish-snow-deployment`) | `Authorization: Bearer <firebase-id-token>` | Allow all |
| Health / OpenAPI (outside `/connectors/**`) | None | Allow all |

There is no Spring Security filter chain. Auth is Spring MVC interceptors registered in `WebConfig`.

Toggle: `snow.auth.token-validation-enabled` (default `true`). When `false`, both Bearer checks are skipped.

---

## Request flow for all APIs except publish POST and get-snow-url

```
Client
  │  Authorization: Bearer <firebase-id-token>
  ▼
WebConfig CORS allow all (CorsFilter)
  │
  ▼
FirebaseAuthInterceptor  (/connectors/** except publish POST and get-snow-url)
  ├── OPTIONS → allow (preflight)
  ├── snow.auth.token-validation-enabled=false? → allow
  ├── extractBearerToken(Authorization)
  └── FirebaseTokenVerifier.verify(token)
          └── FirebaseAuth.getInstance().verifyIdToken(token)
                fail → 401
  │
  ▼
Controller / handler
```

**401 body:**

```json
{"error":"Invalid or expired Firebase ID token"}
```

Applies to profile, deployments queries, tabs, repository lookup, `DELETE /connectors/publish-snow-deployment`, and publish **subpaths** (`/color/{id}`, `/table-data`, `/truncate`, etc.).

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

Required body fields: `actorId`, `gitType`, `snowType`, `snowName`, `repository`, `repositoryOwner`.

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

Obtain the pipeline JWT from [get-snow-token-pipeline.md](get-snow-token-pipeline.md) (that read/regenerate API still uses Firebase Bearer).

---

## Enable / disable token validation

Property (default `true` — Bearer validation on):

```properties
snow.auth.token-validation-enabled=${SNOW_AUTH_TOKEN_VALIDATION_ENABLED:true}
```

| Value | Behavior |
|---|---|
| `true` (default) | Firebase Bearer and `snowTokenPipeline` Bearer are validated. Firebase Admin SDK initializes at startup. |
| `false` | Both auth interceptors skip validation. Firebase Admin is **not** initialized. |

Keep enabled in production. Set `false` only for local/dev when tokens are not required.

Examples:

```bash
# disable locally
SNOW_AUTH_TOKEN_VALIDATION_ENABLED=false

# or JVM / Spring arg
--snow.auth.token-validation-enabled=false
```

---

## Token systems

| Token | Where | Purpose | Used as Bearer for |
|---|---|---|---|
| Firebase ID token | `Authorization` header | Authenticate browser/app callers | All `/connectors/**` **except** publish POST and get-snow-url |
| Profile `snowTokenPipeline` | `Authorization` header + `profile_owners.snow_token_pipeline` | Pipeline / CI auth | `POST /connectors/publish-snow-deployment`, `GET /connectors/get-snow-url` |
| Profile `snowToken` | `profile_owners.snow_token` | HMAC secret for pipeline JWT | Never sent as Bearer |

- `snowToken` on `ProfileQuery` is **write-only** (never returned in JSON).
- Publish verification loads `snowToken` from `profile_owners` and cryptographically verifies the Bearer JWT.

---

## CORS

CORS **allows all** origins, methods, and headers (including `Authorization`).

Implemented with an early servlet `CorsFilter` (`Ordered.HIGHEST_PRECEDENCE`) plus `WebMvcConfigurer.addCorsMappings("/**")`, so browser `OPTIONS` preflight succeeds before MVC/auth interceptors. A bare `CorsConfigurationSource` bean alone is not enough without Spring Security.

If nginx terminates TLS in front of the app, prefer letting Spring set `Access-Control-*` headers (avoid conflicting duplicates in nginx).

---

## Interceptor registration

```java
registry.addInterceptor(snowTokenPipelineAuthInterceptor)
        .addPathPatterns(
                "/connectors/publish-snow-deployment",
                "/connectors/get-snow-url");

registry.addInterceptor(firebaseAuthInterceptor)
        .addPathPatterns("/connectors/**")
        .excludePathPatterns("/connectors/get-snow-url");
// Firebase also skips POST /connectors/publish-snow-deployment (method check in interceptor).
// DELETE /connectors/publish-snow-deployment uses Firebase Bearer.
```

---

## Protected vs open endpoints

### Pipeline auth — `snowTokenPipeline` Bearer

| Method | Path |
|---|---|
| `POST` | `/connectors/publish-snow-deployment` |
| `GET` | `/connectors/get-snow-url` |

### Firebase auth — Firebase ID token Bearer

All other `/connectors/**` paths, including:

| Area | Examples |
|---|---|
| Publish DELETE + subpaths | delete by repository, color, liveness, table-data, truncate |
| Deployment queries | get-snow-deployments, URL, repository |
| Profiles | profile, snow-token-pipeline, license |
| Tabs | `/connectors/tabs` |

### Not protected by interceptors

| Path | Notes |
|---|---|
| `GET /health` | Service health |
| `POST /health/liveness-status` | Liveness update by repository |
| `GET /liveness-test` | Returns `active` |
| `/openapi`, `/swagger-ui.html` | API docs UI |

---

## Firebase Admin credentials

`FirebaseConfig` initializes the Admin SDK once at startup. Credential source (first match wins):

1. **`GOOGLE_APPLICATION_CREDENTIALS`** — filesystem path to service-account JSON  
2. **Classpath** — `snow-angular-ui-firebase-adminsdk-fbsvc-73950f4e06.json`  
3. **`FIREBASE_ADMINSDK`** — base64-encoded service-account JSON

If none are available, the app fails to start with an `IllegalStateException`.

### Operational guidance

- Prefer env-based credentials in deployed environments.
- The classpath service-account file is **gitignored** — do not commit it.
- Rotate the Firebase service account if it is ever exposed.
- Clients using Firebase Bearer must obtain ID tokens from the **same Firebase project** the Admin SDK is configured for.

---

## Client integration checklist

### UI / app callers (Firebase)

1. Sign in with Firebase Auth.
2. Send `Authorization: Bearer <firebase-id-token>` on `/connectors/**` calls **except** publish POST and get-snow-url.
3. Any browser origin is allowed (CORS allow all).
4. On HTTP `401`, refresh the ID token and retry once.

### Pipeline / CI callers (publish and get-snow-url)

1. Read or regenerate `snowTokenPipeline` for the profile (`GET`/`PUT` `/connectors/profile/snow-token-pipeline` — those calls still need Firebase Bearer).
2. Send `Authorization: Bearer <snowTokenPipeline>` on `POST /connectors/publish-snow-deployment` and `GET /connectors/get-snow-url`.
3. Do not put `snowToken` or `snowTokenPipeline` in the publish JSON body.
4. CORS allows any origin.

### Postman

| Variable | Use |
|---|---|
| `{{firebaseIdToken}}` | Collection default Bearer for most `/connectors/**` requests |
| `{{snowTokenPipeline}}` | Bearer on Publish Snow Deployment and Get URL by Snow Name |

---

## Components reference

| Class | Role |
|---|---|
| `com.snow.config.WebConfig` | CORS allow-all (`CorsFilter` + MVC) + interceptor registration |
| `com.snow.config.FirebaseAuthInterceptor` | Firebase Bearer for `/connectors/**` except publish POST and get-snow-url |
| `com.snow.config.SnowTokenPipelineAuthInterceptor` | Pipeline Bearer for publish POST and get-snow-url |
| `com.snow.service.FirebaseTokenVerifier` | `extractBearerToken`, Firebase `verifyIdToken` |
| `com.snow.service.SnowTokenPipelineVerifier` | Resolve profile, verify JWT with `snowToken` |
| `com.snow.config.FirebaseConfig` | Loads Admin credentials, initializes `FirebaseApp` |

---

## Related docs

- [firebase-bearer-auth.md](firebase-bearer-auth.md) — short Firebase Bearer how-to
- [publish-snow-deployment.md](publish-snow-deployment.md) — publish API (`snowTokenPipeline` Bearer)
- [get-snow-token-pipeline.md](get-snow-token-pipeline.md) — read/regenerate pipeline JWT
- [get-profile.md](get-profile.md) — profile create/update; write-only `snowToken`
- [user-guide.md](user-guide.md) — API reference and examples
- [business-logic.md](business-logic.md) — pipeline and domain rules
