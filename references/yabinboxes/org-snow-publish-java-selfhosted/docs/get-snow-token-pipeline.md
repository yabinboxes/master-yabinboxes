# getSnowTokenPipeline() / regenerateSnowTokenPipeline()

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**HTTP:** `GET /connectors/profile/snow-token-pipeline` · `PUT /connectors/profile/snow-token-pipeline`  
**Controller:** `ProfileController.getSnowTokenPipeline()` · `ProfileController.regenerateSnowTokenPipeline()`  
**Handler:** `ProfileCommandHandlerImpl.getSnowTokenPipeline()` · `ProfileCommandHandlerImpl.regenerateSnowTokenPipeline()`  
**Table:** `connectors.profile_owners` (lookup by `actor_id`, optional `git_type`)  
**Auth:** none. See [api-authentication-and-security.md](api-authentication-and-security.md).  
**CORS:** allow all

Reads or regenerates the pipeline JWT for a profile resolved by **`actorId`** and optional **`gitType`**. Same profile lookup as [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md).

On regenerate, a new compact UUID is stored in `snow_token`, and a JWT signed with that secret is stored in `snow_token_pipeline`. `POST /connectors/profile` does not return `snowToken` (write-only on `ProfileQuery`) or `snowTokenPipeline`.

Query params and response JSON use **camelCase** (`actorId`, `gitType`, `snowTokenPipeline`).

This endpoint has no token check. The returned `snowTokenPipeline` value is the Bearer token for **`POST /connectors/publish-snow-deployment`** and **`GET /connectors/get-snow-url`**. `DELETE /connectors/publish-snow-deployment` also has no token check. See [api-authentication-and-security.md](api-authentication-and-security.md).

---

## Request and response

### GET — read pipeline JWT

```bash
curl "http://localhost:8080/connectors/profile/snow-token-pipeline?actorId=54486644&gitType=github" \
  ```

| Query param | Required | Description |
|---|---|---|
| `actorId` | yes | Matches `profile_owners.actor_id`. Blank → HTTP 400. |
| `gitType` | no | When set, profile lookup uses `actorId` + `gitType`. Omit → highest `profile_id` for `actorId` only. |

**Found:** HTTP `200`

```json
{"snowTokenPipeline": "eyJhbGciOiJIUzI1NiJ9..."}
```

**Missing/invalid Bearer:** HTTP `401` → `{"error":"Invalid or expired no token check"}`  
**Missing actorId:** HTTP `400` → `{"error": "actorId parameter is required"}`  
**Profile not found:** HTTP `404` → `{"error": "Profile not found for actorId: 54486644"}`

---

### PUT — regenerate pipeline JWT

```bash
curl -X PUT "http://localhost:8080/connectors/profile/snow-token-pipeline?actorId=54486644&gitType=github" \
  ```

Same query params as GET. No request body.

Generates a new `snowToken` (compact UUID), creates a JWT signed with that secret, saves both columns, and returns the JWT.

**Found:** HTTP `200`

```json
{"snowTokenPipeline": "eyJhbGciOiJIUzI1NiJ9..."}
```

**Missing actorId:** HTTP `400`  
**Profile not found:** HTTP `404`

---

## regenerateSnowTokenPipeline() — method detail

**File:** `ProfileCommandHandlerImpl.java`  
**Annotation:** `@Transactional`  
**Signature:**

```java
String regenerateSnowTokenPipeline(String actorId, String gitType);
```

### Steps

1. Resolve profile via `getProfileByActorId(actorId, gitType)`.
2. If missing → return `null` (controller → HTTP 404).
3. `snowToken = compactUuid()` — UUID with `-` and spaces removed.
4. `snowTokenPipeline = createJwtWithSecret(snowToken, profile)` — JWT signed with that secret.
5. Persist:
   - `profile.setSnowToken(snowToken)` → column `snow_token`
   - `profile.setSnowTokenPipeline(snowTokenPipeline)` → column `snow_token_pipeline`
6. `profileOwnersRepository.save(profile)`
7. Return the JWT string.

### JWT creation (`createJwtWithSecret`)

```java
SecretKey key = Keys.hmacShaKeyFor(sha256(snowToken));
return Jwts.builder()
        .subject(normalizeText(profile.getActorId()))
        .claim("gitType", normalizeText(profile.getGitType()))
        .issuedAt(new Date())
        .signWith(key)
        .compact();
```

| Piece | Value |
|---|---|
| Library | JJWT `0.12.6` |
| Secret | SHA-256 hash of `snowToken` → HMAC key |
| Algorithm | HS256 (via `signWith`) |
| `sub` | `actorId` |
| `gitType` | profile `gitType` |
| `iat` | current time |
| Expiration | none |

Compact UUID example for `snowToken`:

```text
550e8400e29b41d4a716446655440000
```

JWT example shape for `snowTokenPipeline`:

```text
eyJhbGciOiJIUzI1NiJ9.<payload>.<signature>
```

### Flow

```
PUT /connectors/profile/snow-token-pipeline?actorId=X&gitType=Y
        │
        ▼
ProfileController.regenerateSnowTokenPipeline(actorId, gitType)
        ├── actorId blank? → HTTP 400
        │
        ▼
ProfileCommandHandlerImpl.regenerateSnowTokenPipeline(actorId, gitType)   [@Transactional]
        ├── getProfileByActorId(actorId, gitType)
        │       profile not found? → null → HTTP 404
        │
        ├── snowToken = compactUuid()
        ├── snowTokenPipeline = createJwtWithSecret(snowToken, profile)
        │       ├── key = HMAC(SHA-256(snowToken))
        │       ├── sub = actorId
        │       ├── claim gitType
        │       └── iat = now
        │
        ├── setSnowToken(snowToken)
        ├── setSnowTokenPipeline(snowTokenPipeline)
        ├── save(profile)
        │
        └── return snowTokenPipeline
        │
        ▼
HTTP 200 + {"snowTokenPipeline": "<jwt>"}
```

---

## GET flow

```
GET /connectors/profile/snow-token-pipeline?actorId=X&gitType=Y
        │
        ▼
ProfileController.getSnowTokenPipeline(actorId, gitType)
        ├── actorId blank? → HTTP 400
        │
        ▼
ProfileCommandHandlerImpl.getSnowTokenPipeline(actorId, gitType)
        ├── getProfileByActorId(actorId, gitType)
        │       profile not found? → null → HTTP 404
        │
        └── return profile.getSnowTokenPipeline()
        │
        ▼
HTTP 200 + {"snowTokenPipeline": "<jwt>"}
```

GET is read-only. It does not regenerate tokens.

---

## Columns

| Java attribute | DB column | Content |
|---|---|---|
| `snowToken` | `snow_token` | Compact UUID secret used to sign the JWT |
| `snowTokenPipeline` | `snow_token_pipeline` | Compact JWT string |

On regenerate, both values are replaced. Previous JWT and previous secret are invalidated.

Profile create (`POST /connectors/profile`) also generates the same pair: compact UUID → `snow_token`, JWT → `snow_token_pipeline`.

---

## Behavior summary

| Scenario | GET | PUT |
|---|---|---|
| Valid `actorId`, profile exists | 200 + stored JWT | 200 + new JWT; updates `snow_token` and `snow_token_pipeline` |
| Valid `actorId`, no matching profile | 404 | 404 |
| Missing or blank `actorId` | 400 | 400 |
| Duplicate `actorId` in DB | highest `profile_id` | highest `profile_id` |
| `gitType` set | filters lookup | filters lookup |
| Profile never created | 404 — call `POST /connectors/profile` first | 404 |

---

## Related endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/connectors/profile` | Create profile (also generates initial `snowToken` + JWT `snowTokenPipeline`) |
| `PUT` | `/connectors/profile` | Update profile fields (`snowTokenPipeline` not regenerated here) |
| `GET` | `/connectors/get-snow-deployments` | List `snow_deployments_anonymous` |
| `PUT` | `/connectors/profile/license` | Update license |

---

## Related docs

All docs are for project **`snow-publish-java-selfhosted`**.

- [api-authentication-and-security.md](api-authentication-and-security.md) — `snowTokenPipeline` Bearer on publish POST and get-snow-url
- [publish-snow-deployment.md](publish-snow-deployment.md) — POST enqueue uses `snowTokenPipeline`; DELETE by repository uses no token check
- [get-snow-url.md](get-snow-url.md) — uses `snowTokenPipeline` as Bearer
- [api-authentication-and-security.md](api-authentication-and-security.md) — no token check for other `/connectors/**`
- [get-profile.md](get-profile.md) — profile create/update
- [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) — list `snow_deployments_anonymous`
- [user-guide.md](user-guide.md) — run service and API overview
- [business-logic.md](business-logic.md) — profile domain overview
