# Snow Publish Java — Business Logic

**Project:** `snow-publish-java` · Snow Publish Java  
**Stack:** Spring Boot 3.4 · Java 21 · PostgreSQL (`connectors` schema) · package `com.snow`

---

## Overview

**snow-publish-java** (Snow Publish Java) receives deployment events over HTTP, buffers them in an in-memory queue, persists to PostgreSQL in background batches, and maintains per-profile deployment tables (`snow_deployments_{profile_id}`) as the primary read model for profile-scoped queries. The global `snow_deployments_anonymous` table still exists in the schema but **receives no deployment inserts** from the processing pipeline. It is only read by `GET /all`, updated by color/liveness endpoints, and used as the `LIKE` template when creating profile tables.

Stack: Spring Boot 3.4, Java 21 virtual threads, PostgreSQL (`connectors` schema), Spring Data JPA.

---

## Authentication

Dual auth (see **[api-authentication-and-security.md](api-authentication-and-security.md)**):

| Path | Bearer | CORS |
|---|---|---|
| `POST /connectors/publish-snow-deployment` | `snowTokenPipeline` (HMAC-verified with `profile_owners.snow_token`) | Allow all |
| `GET /connectors/get-snow-url` | `snowTokenPipeline` | Allow all |
| Other `/connectors/**` (including DELETE publish) | Firebase ID token (`FirebaseTokenVerifier`) | Allow all |

Publish does not accept `snowToken` in the JSON body. Required publish body fields include `actorId` and `gitType` (used for profile upsert).

Token validation is enabled by default (`snow.auth.token-validation-enabled=true`). Disable with `false` or env `SNOW_AUTH_TOKEN_VALIDATION_ENABLED=false`.  
CORS allows all origins/methods/headers.

---

## Pipeline

See **[publish-snow-deployment.md](publish-snow-deployment.md)** for the POST API.

```
POST /connectors/publish-snow-deployment
     │  (Authorization: Bearer <snowTokenPipeline>)
     ▼
SingletonQueue (LinkedBlockingQueue)     → 201 returned immediately
     │
     │  ScheduledCommandTasks — every 1s
     ▼
INSERT data_source_snow_deployments_persistent   (processed = 0)
INSERT data_source_snow_deployments_volatile    (staging)
     │
     │  ScheduledProcessTasks — every 2s
     ▼
Lookup profile_owners by deployment actorId + gitType
UPSERT snow_deployments_{profile_id} by repository   (if profile exists)
UPDATE persistent SET processed = 1
DELETE volatile records
     │
     ▼
GET /connectors/get-snow-deployments?actorId=X  → profile_owners → snow_deployments_{profile_id}
GET /connectors/get-snow-deployments/all         → snow_deployments_anonymous (unchanged by pipeline)
GET /connectors/get-snow-url?actorId=X&snowName=Y&gitType=Z        → profile_owners → snow_deployments_{profile_id}
GET /connectors/get-snow-repository?actorId=X&snowName=Y&gitType=Z → profile_owners → snow_deployments_{profile_id}
```

### Tables

| Table | Role |
|---|---|
| `data_source_snow_deployments_persistent` | Audit trail; never deleted by pipeline |
| `data_source_snow_deployments_volatile` | Staging buffer; deleted after processing |
| `snow_deployments_{profile_id}` | Per-profile read/write model; one row per `repository`; no tokens |
| `snow_deployments_anonymous` | Global read model; only served by `/all`; not updated by pipeline |
| `profile_owners` | Profile registry; links `email`, `actor`, `actor_id` to `profile_id` |

---

## Scheduled Tasks

The deployment pipeline runs in the background via Spring `@Scheduled` methods. Scheduling is enabled on `SnowPublishApplication` with `@EnableScheduling`.

These tasks run on **platform threads** from the scheduler pool (`spring.task.scheduling.pool.size=4`). They are separate from REST virtual threads.

### Task overview

| Class | Method | Interval | Input | Output |
|---|---|---|---|---|
| `ScheduledCommandTasks` | `batchDeploymentQueue()` | every **1s** (`fixedRate = 1000`) | `SingletonQueue` | rows in persistent + volatile tables |
| `ScheduledProcessTasks` | `processDeployments()` | every **2s** (`fixedRate = 2000`) | volatile table (batch of 100) | upsert profile table, mark persistent processed, delete volatile |
| `ScheduledCleanTasks` | — | disabled | — | no-op; duplicate cleanup not active |

Both active methods are `synchronized` and `@Transactional`. Each run is one database transaction — if it fails, the whole batch rolls back.

### End-to-end timing

```
T=0ms     POST /publish-snow-deployment → item added to SingletonQueue → 201 returned
T≤1000ms  ScheduledCommandTasks drains queue → INSERT persistent (processed=0) + volatile
T≤3000ms  ScheduledProcessTasks picks up volatile row → UPSERT snow_deployments_{profile_id} → processed=1 → DELETE volatile
```

Worst-case latency from publish to queryable profile record: ~3 seconds (1s queue flush + up to 2s process tick), plus any backlog if more than 100 volatile rows exist. Requires a matching profile (`actorId` + `gitType` on the published deployment = `profile_owners`).

---

### Stage 0 — HTTP enqueue (before scheduled tasks)

**Class:** `SnowDeploymentCommandController` → `SnowDeploymentCommandHandlerImpl` → `SingletonQueue`

1. Validate `snowType` against `Type` enum.
2. `singletonQueue.addData(command)` — appends to a `LinkedBlockingQueue`.
3. Return `201 completed`. No database I/O on the request thread.

The queue is in-memory only. If the JVM stops before `ScheduledCommandTasks` runs, queued commands are lost.

---

### Task 1 — `ScheduledCommandTasks.batchDeploymentQueue()`

**Purpose:** Move queued commands from memory into PostgreSQL.

**Trigger:** every 1 second, whether or not the queue has items.

**Step-by-step:**

1. Acquire `synchronized` lock on the task method.
2. If `singletonQueue.isEmpty()` → exit (no DB work).
3. Snapshot the queue: `singletonQueue.returnQueue().stream().toList()`.
   - This copies references to all items currently in the queue.
   - Items added to the queue **after** this snapshot are not in the list but **will** be removed by step 6.
4. For each item in the snapshot:
   - **Map to persistent** (`DeploymentMapper.entityToDeploymentPersistentMapper`):
     - `processed = 0`
     - `status = "default"`
     - `license = "no-license"`
     - `notes = ""`
     - null strings → `""`
   - **`saveAndFlush` persistent** — inserts row, generates `snow_deployment_id`.
   - **Map to volatile** (`DeploymentMapper.deploymentPersistentToDeploymentVolatileMapper`):
     - copies the same `snow_deployment_id`
     - sets `created_at = now()`
   - **`save` volatile** — staging row ready for Task 2.
5. **`singletonQueue.cleanQueue()`** — clears the entire queue (`data.clear()`).

**Tables written:**

| Table | What gets stored |
|---|---|
| `data_source_snow_deployments_persistent` | Full record including `snow_token`; `processed = 0` |
| `data_source_snow_deployments_volatile` | Copy of persistent row + `created_at`; same PK |

**Notes:**

- Every publish creates a **new** persistent row (audit trail). Re-publishing the same `repository` does not update the old persistent row — it inserts another.
- `saveAndFlush` per item forces the ID before volatile insert (volatile PK is not auto-generated).
- Commands are processed sequentially within one tick, not in parallel.

---

### Task 2 — `ScheduledProcessTasks.processDeployments()`

Full method source and line-by-line explanation: **[process-deployments.md](process-deployments.md)**

Summary: every 2s, reads up to 100 volatile rows → groups by `profile_id` (resolved via `actor_id`) → dedupes by `repository` per profile → upserts `snow_deployments_{profile_id}` → marks all persistent rows `processed = 1` → deletes volatile rows. Does **not** touch `snow_deployments_anonymous`. One transaction per tick.

---

### Task 3 — `ScheduledCleanTasks` (disabled)

Empty `@Component`. Duplicate cleanup for `snow_deployments_anonymous` is not scheduled. The repository still has a `cleanDuplicateRecords()` method (native SQL delete by `repository_owner`), but nothing calls it on a schedule.

---

### Concurrency between tasks and HTTP

| Actor | Threading | Interaction |
|---|---|---|
| REST controllers | Virtual threads | Add to `SingletonQueue` concurrently |
| `ScheduledCommandTasks` | Scheduler platform thread | `synchronized` — only one run at a time |
| `ScheduledProcessTasks` | Scheduler platform thread | `synchronized` — only one run at a time |

Task 1 and Task 2 can overlap in wall-clock time (different methods, different locks). Task 1 may insert volatile rows while Task 2 is processing an earlier batch — those new rows are picked up on a later process tick.

The queue uses `LinkedBlockingQueue` (thread-safe for add). HTTP publishes while Task 1 runs are safe for the queue structure, but anything added after the snapshot and before `cleanQueue()` is cleared without being written to the DB.

---

## Database Schema

All tables in `connectors` schema.

### data_source_snow_deployments_persistent

Audit trail. Key columns: `snow_deployment_id` (PK), `snow_token`, `actor`, `actor_id`, `email`, `snow_type`, `sha`, `snow_name`, `provider`, `repository_owner`, `repository`, `status`, `payload`, `url`, `environment`, `url_path`, `tab_name`, `tab_id`, `port`, `image`, `registry`, `notes`, `processed` (0/1), `extras`, `description`, `health_check_url`, `health_check_time`, `liveness_type`, `liveness_status`, `liveness_response`, `terraform_output`, `terraform_vars`, `docker_output`, `docker_vars`, `license`.

### data_source_snow_deployments_volatile

Same as persistent plus `created_at`. PK mirrors persistent ID. Deleted after processing.

### snow_deployments_anonymous

Global read model. No `snow_token`, `sha`, or `license`. Adds `created_at`, `updated_at`, `color`. Deduplication key: `repository`. **Not written by `processDeployments`.** Read by `GET /connectors/get-snow-deployments/all`.

### snow_deployments_{profile_id}

Per-profile read model. Created on profile insert via `ProfileSnowDeploymentsRepository.createTableIfNotExists()`. Schema cloned from `snow_deployments_anonymous` (`LIKE ... INCLUDING DEFAULTS INCLUDING IDENTITY`). PK on `snow_deployment_id`, unique on `repository`, index on `created_at DESC`. Written by `processDeployments` and read by profile-scoped query endpoints.

### profile_owners

`profile_id`, `email`, `actor`, `actor_id`, `git_type`, `snow_token`, `snow_token_pipeline`, `license`, `org`, `role_profile` (default `'OWNER'`).

Profile lookup by `actor_id` uses `findFirstByActorIdOrderByProfileIdDesc(actorId, gitType)` — optional `git_type` filter; highest `profile_id` wins when duplicates exist.

### tabs_anonymous

`tab_id`, `tab_name`.

---

## Domain Rules

### Deployment types

`CLUSTER`, `SERVICE`, `APPLICATION`, `WORKFLOW_CALL`, `REPOSITORY`, `RESOURCE` — invalid values → HTTP 400.

### Repository deduplication

- Profile tables: one row per `repository` per profile.
- Batch processing collapses duplicates within a profile batch (last wins).
- Upsert uses `ON CONFLICT (repository) DO UPDATE`.
- `DELETE /connectors/publish-snow-deployment?repository=X&actorId=Y` deletes that unique row from `snow_deployments_{profile_id}`.

### Truncate

`DELETE /connectors/publish-snow-deployment/truncate` truncates (with identity restart):

1. `profile_owners`
2. `data_source_snow_deployments_persistent`
3. `data_source_snow_deployments_volatile`
4. `snow_deployments_anonymous`

Per-profile tables (`snow_deployments_{profile_id}`) are **not** truncated by this endpoint.

### Color

`color=nocolor` → stored as empty string.

### Liveness

**By repository** (`POST /health/liveness-status`):

| Probe `status` | Stored |
|---|---|
| `unhealthy` | `inactive` |
| else | `active` |

Also sets `liveness_response`. Updates all rows matching `repository`.

**By deployment ID** (`PUT/DELETE .../liveness-*`): stores value as given; delete sets `null`.

---

## Profile Logic

**Handler:** `ProfileCommandHandlerImpl`

Full `getProfile()` documentation: **[get-profile.md](get-profile.md)**

| Operation | Behavior |
|---|---|
| `getProfile` (POST) | See [get-profile.md](get-profile.md) |
| `modifyProfile` (PUT) | Updates non-empty `actor`, `actorId`, `snowToken`, `license`, `org`. Null if not found. |
| `getSnowTokenPipeline` | Read by `actorId` (+ optional `gitType`). |
| `regenerateSnowTokenPipeline` | New compact UUID → `snow_token`; JWT signed with that secret → `snow_token_pipeline`; returns JWT. |

`ProfileQuery` response excludes `snowToken` (write-only) and `snowTokenPipeline`.

On create: `normalizeText()` ensures `actor` and `actor_id` are never null in DB. Creates `snow_deployments_{profile_id}`.

---

## Query Logic

HTTP query params and JSON bodies use **camelCase** (`actorId`, `gitType`, `snowName`, `tableName`). DB columns remain snake_case.

### Profile-scoped deployments — `GET /connectors/get-snow-deployments?actorId=X`

**Handler:** `SnowDeploymentQueryHandlerImpl.getSnowDeploymentsByActorId()`

Full documentation: **[get-snow-deployments-by-actor-id.md](get-snow-deployments-by-actor-id.md)**

1. Require non-blank `actorId`.
2. Optional `gitType` → `getProfileByActorId(actorId, gitType)`.
3. `findAllByProfileId(profileId, type)` → `snow_deployments_{profile_id}`.
4. Optional `type` filter; `ALL` or omitted → all types.

Returns empty array (HTTP 200) when `actorId` missing, profile not found, or table empty.

### All deployments — `GET /connectors/get-snow-deployments/all`

`SnowDeploymentsAnonymousRepository.listAll()` — reads global anonymous table only.

### URL lookup — `GET /connectors/get-snow-url?snowName=X&actorId=Y`

**Handler:** `SnowUrlQueryHandlerImpl.getUrlBySnowName()`

Full documentation: **[get-snow-url.md](get-snow-url.md)**

1. Require non-blank `actorId` and `snowName`.
2. Resolve profile (`actorId` + optional `gitType`).
3. `findUrlBySnowName(profileId, snowName, gitType)`.
4. Returns `{"url": "..."}` or `{"url": ""}`.

### Repository lookup — `GET /connectors/get-snow-repository?snowName=X&actorId=Y`

**Handler:** `SnowUrlQueryHandlerImpl.getRepositoryBySnowName()`

Full documentation: **[get-snow-repository.md](get-snow-repository.md)**

Same parameters and profile resolution as URL lookup. Returns `{"repository": "..."}` or `{"repository": ""}`.

---

## Entity Mapping

`DeploymentMapper` — null strings → `""` via `safe()`.

| Method | From → To |
|---|---|
| `entityToDeploymentPersistentMapper` | Command → Persistent |
| `deploymentPersistentToDeploymentVolatileMapper` | Persistent → Volatile |
| `deploymentVolatileToDeploymentPersistentMapper` | Volatile → Persistent |
| `deploymentVolatileToDeploymentAnonymousMapper` | Volatile → Anonymous (used for profile upsert payload shape) |

Anonymous mapping: strips tokens; defaults `color=""`, `liveness_status="unknown"` if null.

---

## Code Layout

```
com.snow
├── SnowPublishApplication
├── config/          OpenApiConfig, WebConfig (CORS)
├── controller/      REST endpoints
├── entity/          Request DTOs
├── model/           JPA entities
├── queue/           SingletonQueue
├── repository/      Data access
├── service/impl/    Handlers
├── tasks/           Scheduled pipeline
└── utils/           DeploymentMapper, Type
```

| Controller | Handler |
|---|---|
| `SnowDeploymentCommandController` | `SnowDeploymentCommandHandler` |
| `SnowDeploymentQueryController` | `SnowDeploymentQueryHandler` |
| `SnowUrlQueryController` | `SnowUrlQueryHandler` |
| `SnowRepositoryQueryController` | `SnowUrlQueryHandler` |
| `ProfileController` | `ProfileCommandHandler` |
| `TabsController` | `TabsAnonymousHandler` |
| `HealthController` | `SnowDeploymentCommandHandler` |

Key repositories for profile deployments: `ProfileSnowDeploymentsRepository`, `ProfileOwnersRepository`.

---

## Configuration

| Property | Value |
|---|---|
| `server.port` | `8080` |
| `spring.threads.virtual.enabled` | `true` |
| `spring.task.scheduling.pool.size` | `4` |
| `spring.datasource.hikari.maximum-pool-size` | `20` |
| `spring.jpa.properties.hibernate.jdbc.batch_size` | `50` |
| `logging.level.root` | `ERROR` |
| `spring.jackson.property-naming-strategy` | `LOWER_CAMEL_CASE` |

---

## Data Flow

```
POST /connectors/profile → INSERT profile_owners + CREATE snow_deployments_{profile_id}
POST /connectors/publish-snow-deployment → SingletonQueue
→ ScheduledCommandTasks (1s): INSERT persistent + volatile
→ ScheduledProcessTasks (2s): UPSERT snow_deployments_{profile_id} by actorId + gitType, UPDATE processed, DELETE volatile
POST /health/liveness-status → UPDATE anonymous WHERE repository = ?
GET /connectors/get-snow-deployments?actorId=X → profile_owners → snow_deployments_{profile_id}
GET /connectors/get-snow-deployments/all → SELECT snow_deployments_anonymous
GET /connectors/get-snow-url?actorId=X&snowName=Y → profile_owners → snow_deployments_{profile_id}
GET /connectors/get-snow-repository?actorId=X&snowName=Y → profile_owners → snow_deployments_{profile_id}
```
