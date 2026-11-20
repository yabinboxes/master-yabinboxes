# Firebase Bearer authentication

**Project:** `snow-publish-java` · Snow Publish Java  
**Interceptor:** `FirebaseAuthInterceptor`  
**Verifier:** `FirebaseTokenVerifier`  
**Scope:** all `/connectors/**` endpoints **except** `POST /connectors/publish-snow-deployment` and `GET /connectors/get-snow-url`  
**CORS:** allow all (early servlet `CorsFilter`)  
**Default:** Bearer validation **enabled** (`snow.auth.token-validation-enabled=true`)

Full security model (dual auth, publish/get-url pipeline token, credentials, toggle): **[api-authentication-and-security.md](api-authentication-and-security.md)**.

Every request under `/connectors/**` except publish POST and get-snow-url must include a Firebase ID token as a Bearer token. The token is verified with the Firebase Admin SDK before the controller runs.

---

## Header

```http
Authorization: Bearer <firebase-id-token>
```

Example:

```bash
curl "http://localhost:8080/connectors/get-snow-deployments?actorId=54486644" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."
```

---

## Flow

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

`POST /connectors/publish-snow-deployment` and `GET /connectors/get-snow-url` are excluded; they use `snowTokenPipeline` Bearer instead. `DELETE /connectors/publish-snow-deployment` uses Firebase Bearer.

**401 body:**

```json
{"error":"Invalid or expired Firebase ID token"}
```

---

## Toggle

| Property / env | Default | Effect |
|---|---|---|
| `snow.auth.token-validation-enabled` / `SNOW_AUTH_TOKEN_VALIDATION_ENABLED` | `true` | `true` = require Firebase Bearer (this interceptor). `false` = skip. |

---

## Credentials

Firebase Admin app is initialized when token validation is enabled (first match wins):

1. `GOOGLE_APPLICATION_CREDENTIALS` file path  
2. Classpath `snow-angular-ui-firebase-adminsdk-fbsvc-73950f4e06.json`  
3. Base64 env `FIREBASE_ADMINSDK`

Deploy sets `FIREBASE_ADMINSDK` from GitHub secrets (see `.github/workflows/deploy-application.yml`).

---

## Not Firebase-protected

| Path | Auth instead |
|---|---|
| `POST /connectors/publish-snow-deployment` | `snowTokenPipeline` Bearer — see [publish-snow-deployment.md](publish-snow-deployment.md) |
| `GET /connectors/get-snow-url` | `snowTokenPipeline` Bearer — see [get-snow-url.md](get-snow-url.md) |
| `/health`, `/liveness-test`, OpenAPI | None (outside `/connectors/**`) |
