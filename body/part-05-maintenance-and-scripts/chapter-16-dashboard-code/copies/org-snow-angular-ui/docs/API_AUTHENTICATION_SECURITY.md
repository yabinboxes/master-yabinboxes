# API Authentication and Security

**Project:** Snow Angular UI (`snow-angular-ui`) — **dashboard** app

This document describes how the dashboard authenticates to the Snow connectors API, how tokens are applied, and security expectations for frontend and backend.

For endpoint shapes and request/response payloads, see [API.md](./API.md). For Firebase project setup, see [FIREBASE_SETUP.md](../projects/dashboard/FIREBASE_SETUP.md).

---

## Overview

| Layer | Mechanism |
|-------|-----------|
| **UI session** | Firebase Authentication (GitHub OAuth via popup) |
| **Route protection** | `authGuard` on all `/dashboard/**` routes |
| **API authorization** | Firebase **ID token** sent as `Authorization: Bearer <token>` |
| **User identity in business APIs** | `actorId` + `gitType` (and sometimes `email`) in query/body — not a substitute for Bearer auth |

```
Browser (dashboard)
  │
  │  1. User signs in with GitHub (Firebase)
  │  2. Firebase issues ID token (JWT)
  │
  ├──► Firebase Auth (session / refresh)
  │
  └──► HTTPS  Authorization: Bearer <Firebase ID token>
           https://api.snow-monkeys.com/connectors/...
                │
                ▼
         Backend validates JWT (Firebase Admin / JWKS)
         then applies business rules (actorId, gitType, etc.)
```

---

## Base URL

Configured in environment files:

| File | Typical value |
|------|----------------|
| `projects/dashboard/src/environments/environment.ts` | `https://api.snow-monkeys.com/connectors` |
| `projects/dashboard/src/environments/environment.prod.ts` | same for production builds |

All connector HTTP calls (`profile`, `get-snow-deployments`, `snow-token-pipeline`, `tabs`, license, etc.) use `environment.api.baseUrl` + path segments under `environment.api.endpoints`.

**Require HTTPS** for production API hosts. Do not ship browser clients that call production connectors over plain HTTP.

---

## UI authentication (Firebase)

### Providers

- **GitHub OAuth** (primary product path) via `FirebaseAuth.signInWithGitHub()`
- Optional Google path exists in auth service; dashboard login is GitHub-oriented

### Auth state

`FirebaseAuth` keeps:

- `currentUser` — Firebase `User | null`
- `isAuthenticated` — derived from current user
- `isLoading` — true until first `onAuthStateChanged` settles
- `githubAccessToken` — GitHub OAuth **access** token (for GitHub API / import flows only; **not** the connectors `Authorization` header)

### Route guard

Protected dashboard routes use `canActivate: [authGuard]` (`projects/dashboard/src/app/guards/auth.guard.ts`):

- Waits until `isLoading` is false
- If not authenticated → redirect to `/login` with `returnUrl`
- Does **not** attach API headers; it only gates navigation

Public routes (e.g. login) do not use the guard.

---

## API authentication (Bearer Firebase ID token)

### Header

Every `HttpClient` request whose URL **starts with** `environment.api.baseUrl` should receive:

```http
Authorization: Bearer <Firebase_ID_token>
```

Example:

```http
GET /connectors/get-snow-deployments?actorId=583231&gitType=github&type=ALL HTTP/1.1
Host: api.snow-monkeys.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

This is the Firebase **ID token** (JWT), obtained with `user.getIdToken()`, not:

- The GitHub OAuth access token (`githubAccessToken`)
- A custom app API key
- A pipeline snow token (that token is a **product secret** for CI pipelines, not the browsers’s Authorization Bearer for dashboard REST)

### Frontend interceptor

| Item | Location |
|------|----------|
| Interceptor | `projects/dashboard/src/app/interceptors/firebase-auth.interceptor.ts` |
| Registration | `provideHttpClient(withFetch(), withInterceptors([firebaseAuthInterceptor]))` in `app.config.ts` |
| Optional helper | `FirebaseAuth.getIdToken(forceRefresh?)` |

**Behavior:**

1. If `req.url` does not start with `environment.api.baseUrl` → pass through unchanged (e.g. GitHub API, unrelated hosts).
2. If no Firebase `auth.currentUser` → pass through (no Bearer header).
3. Else call `user.getIdToken()` (Firebase refreshes when near expiry unless forced).
4. Clone request with `Authorization: Bearer <idToken>`.
5. On token retrieval failure → request continues **without** Bearer (backend should reject protected routes).

### Scope of protected client calls

All dashboard services that use `HttpClient` against `environment.api.baseUrl` inherit the interceptor, including:

| Client | Endpoint(s) |
|--------|-------------|
| `HandleProfilesApi` | `POST /profile`, `PUT /profile/license`, `GET|PUT /profile/snow-token-pipeline` |
| `DeploymentsActionsApi` | `GET /get-snow-deployments`, `DELETE /publish-snow-deployment` |
| `TabsActionsApi` | tabs endpoints under connectors |

No per-call manual header wiring is required when using Angular `HttpClient` and the shared base URL.

### Getting a token manually (services / debugging)

```typescript
// From FirebaseAuth
authService.getIdToken().subscribe((token) => {
  // token is the Firebase JWT string, or null
});

// Force refresh before a sensitive call
authService.getIdToken(true).subscribe(/* ... */);
```

---

## Backend verification (server expectations)

The connectors API **must** treat unauthenticated requests as unauthorized for protected operations.

Recommended flow:

1. Read `Authorization` header; require scheme `Bearer`.
2. Verify JWT signature and claims with Firebase Admin SDK (or Google JWKS for the project).
3. Reject if:
   - header missing / malformed
   - signature invalid
   - `exp` in the past
   - `aud` / `iss` do not match the Firebase project used by the dashboard
4. Map `uid` / email from token claims to server-side user identity.
5. Optionally ensure business params (`actorId`, `email`) are consistent with the authenticated identity (see [Impersonation risk](#impersonation-and-identity-binding)).

Suggested status codes:

| Situation | Status |
|-----------|--------|
| Missing / invalid token | `401 Unauthorized` |
| Valid token, insufficient permission for resource | `403 Forbidden` |
| Valid token, resource empty / not found | `404` or empty success body (API-specific) |

---

## Business parameters vs auth

Query and body fields such as:

- `actorId`, `gitType` (deployments, snow-token-pipeline)
- `email` (profile)

identify **which resource** to load. They are **not** a replacement for Bearer auth.

| Concern | Mechanism |
|---------|-----------|
| “Is this call from a signed-in Snow user?” | Firebase ID token (Bearer) |
| “Which GitHub user / org shape of data?” | `actorId`, `gitType`, profile payload |

### Impersonation and identity binding

If the backend trusts `actorId` or `email` from the client alone, a client could request another user’s data.

**Mitigation (backend):** after verifying the JWT, resolve the caller’s allowed `actorId` / email from server-side account linkage (or verified GitHub identity stored at first login) and **ignore or override** client-supplied ids when they do not match.

The dashboard sends `actorId` derived from the signed-in GitHub `providerData` for convenience; security still depends on server verification and binding.

---

## Pipeline snow token vs Firebase ID token

| Token | Purpose | How used |
|-------|---------|----------|
| **Firebase ID token** | Authenticate browser → connectors API | `Authorization: Bearer …` on HTTPS REST |
| **Pipeline snow token** | Authenticate CI / modules → Snow reporting | Stored/copied in Settings; passed as secret `SNOW_TOKEN` / `snow-token` in workflows — not auto-attached as Bearer by the Angular interceptor |

Pipeline token endpoints themselves still require a signed-in user (Bearer ID token) when called from the dashboard (`GET`/`PUT` `/profile/snow-token-pipeline`).

Treat pipeline tokens as long-lived secrets: regenerate on compromise, never log them, never commit them to git.

---

## CORS and browser security

- Production dashboard origin must be allowed by the connectors API CORS policy for methods, headers (`Authorization`, `Content-Type`), and credentials policy as designed.
- Prefer **same-site HTTPS** dashboard + API or clearly documented allowlist origins.
- Do not expose Firebase **service accounts** or Admin SDK keys in the frontend config. Only the public Firebase web config (apiKey, authDomain, projectId, etc.) belongs in `environment.ts`.

---

## Token lifecycle and session security

| Topic | Behavior |
|-------|----------|
| ID token lifetime | Managed by Firebase (~1 hour typical); `getIdToken()` renews when needed |
| Refresh | Handled by Firebase SDK with persistent auth session |
| Sign-out | `FirebaseAuth.signOut()` clears local session; subsequent requests lack Bearer user |
| Storage | Firebase Auth persistence in the browser; never write ID tokens to `localStorage` manually in app code |
| Clipboard | Settings “copy token” copies the **pipeline** token, not the Firebase ID token |

Additional frontend hardening:

- Keep `authGuard` on all privileged routes.
- Prefer zoneless / short-lived in-memory state for secrets; do not put pipeline tokens in URLs or analytics events.
- Use `ng build dashboard --configuration production` (prod environment HTTPS API host) for releases.
- Avoid logging full Authorization headers or ID tokens in production build consoles.

---

## What is intentionally *not* authenticated by this interceptor

- External APIs not under `environment.api.baseUrl` (e.g. GitHub REST) — may use GitHub OAuth access token separately where implemented.
- Static assets and the **docs** app (`projects/docs/`) — public, no Firebase dashboard session required.
- WebSocket URLs that are not routed through `HttpClient` (if re-enabled) must attach auth independently if the socket protocol requires it.

---

## Threat model (summary)

| Threat | Control |
|--------|---------|
| Anonymous access to user deployments / tokens | Backend JWT verification + `401` |
| Stolen session cookie / persistence | Short-lived ID tokens; user sign-out; Firebase account security |
| Stolen pipeline snow token | Rotate via `PUT /profile/snow-token-pipeline`; scope CI secrets |
| Client forges `actorId` | Server binds identity to JWT, not only query params |
| MITM on API traffic | TLS (`https://api.snow-monkeys.com`) |
| XSS exfiltrating tokens | CSP / careful HTML; do not inject untrusted markdown as executable script in dashboard |

---

## Implementation checklist

### Frontend (dashboard)

- [x] Firebase Auth for login
- [x] `authGuard` on dashboard routes
- [x] `firebaseAuthInterceptor` attaches Bearer ID token to connectors requests
- [x] API base URL uses HTTPS in deployed environments
- [ ] Ensure CI builds use `environment.prod.ts` with production base URL

### Backend (connectors API)

- [ ] Verify Firebase ID token on every protected route
- [ ] Return `401` when missing/invalid
- [ ] Bind `actorId` / email to authenticated user where applicable
- [ ] CORS allowlist for dashboard origin(s)
- [ ] Rate-limit auth-sensitive and token endpoints
- [ ] Never log raw Bearer tokens or pipeline secrets

### Operators

- [ ] Restrict Firebase authorized domains to known dashboard hosts
- [ ] Rotate compromised pipeline tokens
- [ ] Monitor `401`/`403` spikes for abuse

---

## Quick reference

```http
# Authenticated connectors call (browser automatically via interceptor)
Authorization: Bearer <firebase-id-token>

# Base
https://api.snow-monkeys.com/connectors
```

```typescript
// Registration (app.config.ts)
provideHttpClient(withFetch(), withInterceptors([firebaseAuthInterceptor]))

// Only URLs starting with environment.api.baseUrl get the header
```

```typescript
// Manual ID token
inject(FirebaseAuth).getIdToken().subscribe(token => { /* ... */ });
```

### Key files

| Path | Role |
|------|------|
| `projects/dashboard/src/app/interceptors/firebase-auth.interceptor.ts` | Attaches Bearer token |
| `projects/dashboard/src/app/app.config.ts` | Registers interceptor |
| `projects/dashboard/src/app/services/auth/firebase-auth.ts` | Login, profile, `getIdToken` |
| `projects/dashboard/src/app/guards/auth.guard.ts` | Route protection |
| `projects/dashboard/src/environments/environment*.ts` | API base URL + Firebase config |

---

## Related documentation

- [API.md](./API.md) — endpoint reference  
- [SERVICES.md](./SERVICES.md) — dashboard services  
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system architecture  
- [BUSINESS_LOGIC.md](./BUSINESS_LOGIC.md) — product workflows  
- [FIREBASE_SETUP.md](../projects/dashboard/FIREBASE_SETUP.md) — Firebase console setup  
