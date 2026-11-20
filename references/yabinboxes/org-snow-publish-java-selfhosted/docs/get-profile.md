# getProfile()

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**HTTP:** `POST /connectors/profile`  
**Controller:** `src/main/java/com/snow/controller/ProfileController.java` — `getProfile()` (lines 33–38)  
**Handler:** `src/main/java/com/snow/service/impl/ProfileCommandHandlerImpl.java` — `getProfile()` (lines 33–90)  
**Tables:** `connectors.profile_owners`, `connectors.snow_deployments_{profile_id}` (on create only)  
**Auth:** none. See [api-authentication-and-security.md](api-authentication-and-security.md).  
**CORS:** allow all

Retrieves an existing profile by email, or creates a new one if none exists. On create, also ensures a per-profile deployments table exists. Always returns HTTP 200 with a `ProfileQuery` body when the handler completes.

Missing/invalid Bearer → HTTP `401` `{"error":"Invalid or expired no token check"}`.

---

## Request and response

### Request

```bash
curl -X POST http://localhost:8080/connectors/profile \
  -H "Content-Type: application/json" \
  -d '{"email": "dev@example.com", "actor": "yabinboxes", "actorId": "54486644", "gitType": "github"}'
```

Request and response JSON use **camelCase** (`actorId`, `gitType`).

| Field | Required | Stored in DB | Returned |
|---|---|---|---|
| `email` | yes (lookup key) | yes | yes |
| `actor` | no | yes | yes |
| `actorId` | no | yes | yes |
| `gitType` | no | yes | yes |
| `snowToken` | no | ignored on create | **no** (write-only) |
| `license` | no | ignored on create | yes (from DB) |
| `org` | no | ignored on create | yes (from DB) |

- **Create:** `actor` and `actorId` from the request are saved to `profile_owners`. Null values are normalized to `""` (NOT NULL columns).
- **Existing profile:** `actor` and `actorId` are updated when non-empty values are sent; otherwise stored values are kept.
- Other request fields (`snowToken`, `license`, `org`) are ignored by `getProfile`.

### Response

HTTP `200` — JSON `ProfileQuery`:

```json
{
  "email": "dev@example.com",
  "actor": "yabinboxes",
  "actorId": "54486644",
  "gitType": "github",
  "license": "self",
  "org": ""
}
```

All returned fields are read from `profile_owners` after the handler runs. On create, omitted `actor` / `actorId` are stored as `""`.

`snowToken` is **write-only** (`@JsonProperty(access = WRITE_ONLY)` on `ProfileQuery`) — accepted on `PUT /connectors/profile` requests, never serialized in responses.

`snowTokenPipeline` is **not** returned. Use [get-snow-token-pipeline.md](get-snow-token-pipeline.md).

---

## Flow

```
POST /connectors/profile  { "email": "...", "actor": "...", "actorId": "...", "gitType": "..." }
        │
        ▼
ProfileController.getProfile()
        │
        ▼
ProfileCommandHandlerImpl.getProfile()   [@Transactional, synchronized]
        │
        ├── findByEmail(email) → found?
        │       │
        │       yes → update actor / actorId if request values are non-empty
        │       │     else return stored row unchanged
        │       │
        │       no  → insert ProfileOwners (email, actor, actorId, generated tokens)
        │             saveAndFlush → assign profile_id
        │             createTableIfNotExists(profile_id)
        │                   └── connectors.snow_deployments_{profile_id}
        │
        ▼
Build ProfileQuery from ProfileOwners (email, actor, actorId, license, org; snowToken omitted in JSON)
        │
        ▼
HTTP 200 + ProfileQuery JSON
```

---

## Controller — full method

```java
@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
@Operation(
        summary = "Get or Create Profile",
        description = "Retrieves an existing profile by email or creates a new profile if it doesn't exist."
)
public ResponseEntity<ProfileQuery> getProfile(@Valid @RequestBody ProfileQuery profileQuery) {
    profileControllerLog.info("Received profile request for email: {}", profileQuery.getEmail());
    ProfileQuery profile = profileCommandHandler.getProfile(profileQuery);
    profileControllerLog.info("Returning profile with HTTP 200 for email: {}", profile.getEmail());
    return ResponseEntity.ok(profile);
}
```

| Part | What it does |
|---|---|
| `@PostMapping` | Accepts JSON body, returns JSON. |
| `@Valid` | Runs Jakarta validation on `ProfileQuery`. |
| `profileCommandHandler.getProfile()` | Delegates all logic to the handler. |
| `ResponseEntity.ok(profile)` | Always HTTP 200 — no 404 (creates profile if missing). |

---

## Handler — full method

```java
@Override
@Transactional
public synchronized ProfileQuery getProfile(ProfileQuery eProfileQuery) {
    profileHandlerLog.info("Processing profile query request");
    profileHandlerLog.info("Searching for profile with email: {}", eProfileQuery.getEmail());

    Optional<ProfileOwners> existingProfile = profileOwnersRepository.findByEmail(eProfileQuery.getEmail());
    ProfileOwners profileOwners;

    if (existingProfile.isPresent()) {
        profileHandlerLog.info("Found existing profile for email: {}", eProfileQuery.getEmail());
        profileOwners = existingProfile.get();
        boolean updated = false;
        if (eProfileQuery.getActor() != null && !eProfileQuery.getActor().isEmpty()) {
            profileHandlerLog.info("Updating actor for profile ID: {}", profileOwners.getProfileId());
            profileOwners.setActor(eProfileQuery.getActor());
            updated = true;
        }
        if (eProfileQuery.getActorId() != null && !eProfileQuery.getActorId().isEmpty()) {
            profileHandlerLog.info("Updating actorId for profile ID: {}", profileOwners.getProfileId());
            profileOwners.setActorId(eProfileQuery.getActorId());
            updated = true;
        }
        if (updated) {
            profileOwnersRepository.save(profileOwners);
        } else {
            profileHandlerLog.info("Retrieved existing profile with ID: {} without updates", profileOwners.getProfileId());
        }
    } else {
        profileHandlerLog.info("Profile not found for email: {}, creating new profile", eProfileQuery.getEmail());

        profileOwners = new ProfileOwners();
        profileOwners.setEmail(eProfileQuery.getEmail());
        profileOwners.setActor(normalizeText(eProfileQuery.getActor()));
        profileOwners.setActorId(normalizeText(eProfileQuery.getActorId()));
        String generatedToken = UUID.randomUUID().toString();
        String generatedPipelineToken = "snow_" + UUID.randomUUID();
        profileOwners.setSnowToken(generatedToken);
        profileOwners.setSnowTokenPipeline(generatedPipelineToken);
        profileOwners.setLicense("self");
        profileOwners.setOrg("");

        profileOwnersRepository.saveAndFlush(profileOwners);
        profileHandlerLog.info("Created new profile with ID: {} with generated UUIDs", profileOwners.getProfileId());

        profileSnowDeploymentsRepository.createTableIfNotExists(profileOwners.getProfileId());
    }

    ProfileQuery result = new ProfileQuery(
            profileOwners.getEmail(),
            profileOwners.getActor(),
            profileOwners.getActorId(),
            profileOwners.getSnowToken(),
            profileOwners.getLicense(),
            profileOwners.getOrg()
    );

    profileHandlerLog.info("Returning profile for email: {}", result.getEmail());
    return result;
}

private static String normalizeText(String value) {
    return value != null ? value : "";
}
```

---

## Handler — line-by-line

### Annotations

| Annotation | Effect |
|---|---|
| `@Transactional` | Lookup, insert, update, and table DDL run in one transaction. |
| `synchronized` | Only one thread executes this method at a time in the JVM. |

### Lines 37–38 — Lookup by email

```java
Optional<ProfileOwners> existingProfile = profileOwnersRepository.findByEmail(eProfileQuery.getEmail());
```

Calls `ProfileOwnersJpaRepository.findByEmail(email)` on `connectors.profile_owners`.

### Lines 40–58 — Existing profile

If a row exists:

- Loads the managed entity from the database.
- If request `actor` is non-null and non-empty → sets `actor`.
- If request `actorId` is non-null and non-empty → sets `actorId`.
- Saves only when at least one field changed.
- Does **not** update `snowToken`, `license`, or `org`.
- Does **not** regenerate tokens.
- Does **not** call `createTableIfNotExists` (table is only created on first profile insert).

### Lines 59–77 — Create new profile

If no row exists:

| Field | Value |
|---|---|
| `email` | from request |
| `actor` | `normalizeText(request.actor)` → `""` if null |
| `actorId` | `normalizeText(request.actorId)` → `""` if null |
| `snowToken` | compact UUID (`compactUuid()`) — not returned in JSON |
| `snowTokenPipeline` | JWT signed with `snowToken` — not returned; see [get-snow-token-pipeline.md](get-snow-token-pipeline.md) |
| `license` | `"self"` |
| `org` | `""` |

`saveAndFlush(profileOwners)` inserts the row and assigns `profile_id`.

Then `profileSnowDeploymentsRepository.createTableIfNotExists(profileOwners.getProfileId())` ensures the per-profile deployments table exists (see below).

### Lines 79–89 — Build response

```java
ProfileQuery result = new ProfileQuery(
        profileOwners.getEmail(),
        profileOwners.getActor(),
        profileOwners.getActorId(),
        profileOwners.getSnowToken(),
        profileOwners.getLicense(),
        profileOwners.getOrg()
);
```

Response fields come from `ProfileOwners`. `snowToken`, `snowTokenPipeline`, and `profileId` are not included in the JSON response.

---

## createTableIfNotExists

**Repository:** `src/main/java/com/snow/repository/ProfileSnowDeploymentsRepository.java` — `createTableIfNotExists()` (lines 37–78)

Called only on the **create** path, immediately after `saveAndFlush`, using the newly assigned `profile_id`.

### Table name

```
connectors.snow_deployments_{profile_id}
```

Example: profile `profile_id = 3` → `connectors.snow_deployments_3`

### What it does

1. **No-op if `profileId` is null** — logs a warning and returns.
2. **`CREATE TABLE IF NOT EXISTS`** — copies column definitions from `connectors.snow_deployments_anonymous` using PostgreSQL `LIKE ... INCLUDING DEFAULTS INCLUDING IDENTITY`.
3. **Adds constraints if missing** (via `DO` block):
   - `PRIMARY KEY (snow_deployment_id)` — constraint name `snow_deployments_{profile_id}_pkey`
   - `UNIQUE (repository)` — constraint name `uq_snow_deployments_{profile_id}_repository`
4. **`CREATE INDEX IF NOT EXISTS`** — `idx_snow_deployments_{profile_id}_created_at` on `(created_at DESC)`.

Schema matches `snow_deployments_anonymous` (same columns, defaults, identity column, unique repository key, created_at index). Safe to call repeatedly — existing tables are left unchanged.

Also called from `upsertProfileDeployments()` as a safety net before inserts.

### Full method

```java
@Transactional
public void createTableIfNotExists(Long profileId) {
    if (profileId == null) {
        profileDeploymentsRepoLog.warn("Cannot create profile deployments table: profileId is null");
        return;
    }

    String tableName = "snow_deployments_" + profileId;
    String tableRef = "connectors." + tableName;
    String pkConstraint = tableName + "_pkey";
    String uniqueConstraint = "uq_" + tableName + "_repository";
    String createdAtIndex = "idx_" + tableName + "_created_at";

    profileDeploymentsRepoLog.info("Creating table if not exists: {}", tableRef);

    entityManager.createNativeQuery(
                    "CREATE TABLE IF NOT EXISTS " + tableRef
                            + " (LIKE connectors.snow_deployments_anonymous INCLUDING DEFAULTS INCLUDING IDENTITY)")
            .executeUpdate();

    entityManager.createNativeQuery("""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = '%s'
                ) THEN
                    ALTER TABLE %s ADD CONSTRAINT %s PRIMARY KEY (snow_deployment_id);
                END IF;
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = '%s'
                ) THEN
                    ALTER TABLE %s ADD CONSTRAINT %s UNIQUE (repository);
                END IF;
            END $$
            """.formatted(pkConstraint, tableRef, pkConstraint, uniqueConstraint, tableRef, uniqueConstraint))
            .executeUpdate();

    entityManager.createNativeQuery(
                    "CREATE INDEX IF NOT EXISTS " + createdAtIndex + " ON " + tableRef + " (created_at DESC)")
            .executeUpdate();

    profileDeploymentsRepoLog.info("Successfully ensured table exists: {}", tableRef);
}
```

---

## Database

### profile_owners

**Table:** `connectors.profile_owners`

| Column | On create | On existing (if sent) | In response |
|---|---|---|---|
| `profile_id` | auto-generated | unchanged | not returned |
| `email` | from request | unchanged | yes |
| `actor` | `normalizeText(request)` | updated if non-empty | yes |
| `actorId` | `normalizeText(request)` | updated if non-empty | yes |
| `gitType` | from request | updated if non-empty | yes |
| `snow_token` | compact UUID | unchanged | not returned (write-only) |
| `snow_token_pipeline` | JWT signed with `snow_token` | unchanged | not returned |
| `license` | `"self"` | unchanged | yes |
| `org` | `""` | unchanged | yes |

### Per-profile deployments table

**Table:** `connectors.snow_deployments_{profile_id}` (created on first profile insert only)

| Property | Value |
|---|---|
| Schema source | `LIKE connectors.snow_deployments_anonymous` |
| Primary key | `snow_deployment_id` (identity) |
| Unique key | `repository` |
| Index | `created_at DESC` |

Not written to by `getProfile` itself — table is provisioned empty, ready for profile-scoped deployment records.

---

## actor, actorId, and deployments

- `actor` and `actorId` are stored on `profile_owners` by this endpoint.
- `actorId` and optional `gitType` are used by `processDeployments()` to decide whether a published row may be upserted into `snow_deployments_anonymous`. See [process-deployments.md](process-deployments.md).
- When multiple profiles share the same `actor_id`, lookup uses the profile with the **highest `profile_id`** (`findFirstByActorIdOrderByProfileIdDesc(actorId, gitType)`).
- `GET /connectors/get-snow-repository/all` reads `snow_deployments_{profile_id}` when that table exists.
- `DELETE /connectors/publish-snow-deployment` deletes a row from `snow_deployments_{profile_id}`.

`processDeployments()` writes deployment rows to `snow_deployments_anonymous`, not to the per-profile table. `GET /connectors/get-snow-deployments` and `GET /connectors/get-snow-deployments/all` both read `snow_deployments_anonymous`.

---

## Behavior summary

| Scenario | DB change | Side effects |
|---|---|---|
| First call for email | INSERT into `profile_owners` | Creates `connectors.snow_deployments_{profile_id}` |
| Repeat call, no `actor` / `actorId` in request | none | none |
| Repeat call with non-empty `actor`, `actorId`, and/or `gitType` | UPDATE matching columns | none |
| Concurrent calls for same new email | `synchronized`; first insert wins | one profile table created |

---

## Related endpoints

| Method | Path | Purpose |
|---|---|---|
| `PUT` | `/connectors/profile` | Update profile (`modifyProfile` — also updates `actor`, `actorId`) |
| `GET` | `/connectors/profile/snow-token-pipeline?actorId=X&gitType=Y` | Read pipeline token — [get-snow-token-pipeline.md](get-snow-token-pipeline.md) |
| `PUT` | `/connectors/profile/snow-token-pipeline?actorId=X&gitType=Y` | Regenerate pipeline token — [get-snow-token-pipeline.md](get-snow-token-pipeline.md) |
| `PUT` | `/connectors/profile/license` | Update license |

---

## Related docs

All docs are for project **`snow-publish-java-selfhosted`**.

- [api-authentication-and-security.md](api-authentication-and-security.md) — Bearer auth for `/connectors/**`
- [get-snow-token-pipeline.md](get-snow-token-pipeline.md) — read and regenerate pipeline token
- [user-guide.md](user-guide.md) — run service and API overview
- [business-logic.md](business-logic.md) — profile domain overview
- [process-deployments.md](process-deployments.md) — how deployments land in `snow_deployments_anonymous`
- [get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md) — list `snow_deployments_anonymous`
