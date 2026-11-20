# Differences from snow-publish-java

**This repo:** `org-snow-publish-java-selfhosted` (`snow-publish-java-selfhosted`)  
**Compared with:** `org-snow-publish-java` (`snow-publish-java`)  
**Compared:** working trees, excluding `target/`, `.git/`, and `.idea/`

Both projects are the same Spring Boot / Java 21 publish service: ingest a deployment, stage it, then process it on a schedule into a read model. The self-hosted fork drops Firebase, reads and writes the shared anonymous table instead of per-profile tables for the main list and lookup APIs, and adds a single-row `self_hosted` setup API.

---

## Summary

| Area | `snow-publish-java` | `snow-publish-java-selfhosted` |
|---|---|---|
| Artifact / image | `snow-publish-java` | `snow-publish-java-selfhosted` |
| Dashboard auth | Firebase ID token on other `/connectors/**` | No token check on those paths |
| Pipeline auth | `snowTokenPipeline` Bearer on publish POST and get-snow-url | Same two paths |
| Firebase Admin | `firebase-admin` 9.10.0, `FIREBASE_ADMINSDK` | Removed |
| Stage 2 write target | `snow_deployments_{profile_id}` | `snow_deployments_anonymous` |
| List deployments | `GET /connectors/get-snow-deployments?actorId&type&gitType` from the profile table | `GET /connectors/get-snow-deployments` with no query params, all anonymous rows |
| URL / repository lookup | `snowName` + required `actorId` + optional `gitType`, profile table | `snowName` + optional `gitType`, anonymous table |
| Persistent dump API | `GET /connectors/get-snow-deployments-persistent` | Removed |
| Extra deployment columns | `terraform_output`, `terraform_vars`, `docker_output`, `docker_vars` | The same four text columns |
| Setup row | None | `connectors.self_hosted` plus GET/PUT under `/connectors/self-hosted` |
| Default `profile_owners.role_profile` | `OWNER` | `REGULAR` |
| Schema doc | None | [database-schema.md](database-schema.md) |
| Firebase how-to | `docs/firebase-bearer-auth.md` in the other repo | None |

Per-profile tables still exist in both. Profile create still copies `snow_deployments_anonymous` into `snow_deployments_{profile_id}`. `DELETE /connectors/publish-snow-deployment` still deletes from that profile table. `GET /connectors/get-all-profiles-with-deployments` still reads those profile tables. Only the scheduled processor and the list / URL / repository reads moved to the anonymous table.

---

## Files only in one repo

**Only in `snow-publish-java`:**

| File | Role |
|---|---|
| `src/main/java/com/snow/config/FirebaseConfig.java` | Initializes Firebase Admin from `GOOGLE_APPLICATION_CREDENTIALS`, classpath service-account JSON, or base64 `FIREBASE_ADMINSDK` |
| `src/main/java/com/snow/config/FirebaseAuthInterceptor.java` | Bearer check for `/connectors/**` except publish POST and get-snow-url |
| `src/main/java/com/snow/service/FirebaseTokenVerifier.java` | `FirebaseAuth.verifyIdToken` and Bearer extraction |
| `src/main/java/com/snow/controller/SnowPersistentDeploymentQueryController.java` | `GET /connectors/get-snow-deployments-persistent` |
| `docs/firebase-bearer-auth.md` | Short Firebase Bearer how-to |
| `snow-publish-java.postman_collection.json` | Postman collection for the hosted service |

**Only in `snow-publish-java-selfhosted`:**

| File | Role |
|---|---|
| `src/main/java/com/snow/model/SelfHosted.java` | JPA entity for `connectors.self_hosted`. `@PrePersist` rejects inserts |
| `src/main/java/com/snow/entity/SelfHostedCommand.java` | Partial-update body |
| `src/main/java/com/snow/repository/SelfHostedRepository.java` | `findFirstByOrderByIdAsc()` |
| `src/main/java/com/snow/service/SelfHostedHandler.java` | Read, finish first-time, partial update |
| `src/main/java/com/snow/service/impl/SelfHostedHandlerImpl.java` | Updates the single existing row. Save fails unless exactly one row exists |
| `src/main/java/com/snow/controller/SelfHostedQueryController.java` | `GET /connectors/self-hosted` and `GET /connectors/self-hosted/first-time-flag` |
| `src/main/java/com/snow/controller/SelfHostedCommandController.java` | `PUT /connectors/self-hosted` and `PUT /connectors/self-hosted/first-time-flag` |
| `docs/database-schema.md` | Column-level schema for `connectors` |
| `snow-publish-java-selfhosted.postman_collection.json` | Postman collection for this service |

---

## Java sources that are the same

These files match byte for byte:

- `SnowPublishApplication.java`
- `OpenApiConfig.java`
- `HealthController.java`, `LivenessTestController.java`, `ProfileController.java`, `TabsController.java`
- `LivenessCommand.java`, `ProfileQuery.java`, `ProfileWithDeploymentsQuery.java`
- `TabsAnonymous.java`
- `SingletonQueue.java`
- `DataSourceSnowPersistentJpaRepository.java`, `DataSourceSnowVolatileJpaRepository.java`, `DataSourceSnowVolatileRepository.java`
- `ProfileOwnersJpaRepository.java`, `ProfileOwnersRepository.java`
- `TabsAnonymousRepository.java`
- `ProfileCommandHandler.java`, `ProfileCommandHandlerImpl.java`
- `SnowDeploymentCommandHandler.java`, `SnowDeploymentCommandHandlerImpl.java`
- `TabsAnonymousHandler.java`, `TabsAnonymousHandlerImpl.java`
- `ScheduledCleanTasks.java`, `ScheduledCommandTasks.java`
- `Type.java`

Profile create/update, license, pipeline-token issue and regenerate, tab CRUD, liveness, color, truncate, and delete-by-repository are the same code paths.

---

## Authentication

Both keep `snow.auth.token-validation-enabled=true` by default and allow all CORS origins, methods, and headers. There is no Spring Security filter chain. Auth is MVC interceptors in `WebConfig`.

| Request | `snow-publish-java` | `snow-publish-java-selfhosted` |
|---|---|---|
| `POST /connectors/publish-snow-deployment` | `snowTokenPipeline` Bearer | `snowTokenPipeline` Bearer |
| `GET /connectors/get-snow-url` | `snowTokenPipeline` Bearer | `snowTokenPipeline` Bearer |
| Other `/connectors/**`, including DELETE publish, profile, tabs, repository lookup, and publish subpaths (`/color`, `/table-data`, `/truncate`, …) | Firebase ID token. `401` body: `{"error":"Invalid or expired Firebase ID token"}` | No token check |
| Health and OpenAPI | None | None |

`WebConfig` in the hosted service registers both interceptors. The self-hosted `WebConfig` registers only `SnowTokenPipelineAuthInterceptor` on the publish path and get-snow-url.

`SnowTokenPipelineAuthInterceptor` in the hosted service extracts the Bearer header through `FirebaseTokenVerifier`. The self-hosted interceptor calls `SnowTokenPipelineVerifier.extractBearerToken`, which was copied onto that class. HMAC verification of the pipeline JWT is otherwise the same: resolve `profile_owners`, then verify with `SHA-256(snowToken)`.

`FirebaseConfig` is conditional on token validation being enabled. It loads credentials from `GOOGLE_APPLICATION_CREDENTIALS`, the classpath file `snow-angular-ui-firebase-adminsdk-fbsvc-73950f4e06.json`, or base64 `FIREBASE_ADMINSDK`. None of that exists here. `infra/docker-compose.yml` and `.github/workflows/deploy-application.yml.og` in the hosted repo pass `FIREBASE_ADMINSDK`; the self-hosted copies do not.

---

## Processing pipeline

`ScheduledProcessTasks` still runs on the same schedule in both:

1. Read unprocessed rows from `data_source_snow_deployments_volatile`.
2. Map each row to a persistent record and mark it processed.
3. Require a non-blank `actorId` and a matching `profile_owners` row (`actorId` + `gitType`). A missing profile skips the read-model write. The volatile row is still marked processed and later deleted.
4. Deduplicate by `repository` (last row wins).
5. Delete the volatile rows and persist the audit rows.

The fork is step 4–5’s destination:

| | `snow-publish-java` | `snow-publish-java-selfhosted` |
|---|---|---|
| Grouping | Bucket rows by `profile_id` | One list |
| Table ensure | `createTableIfNotExists(profileId)` | None in this task |
| Upsert | `ProfileSnowDeploymentsRepository.upsertProfileDeployments` into `snow_deployments_{profile_id}` | `SnowDeploymentsAnonymousRepository.upsertByRepository` into `connectors.snow_deployments_anonymous` |
| Conflict key | `repository` | `repository` |

`SnowDeploymentsAnonymousRepository` in this repo adds that upsert, plus `findUrlBySnowName` / `findRepositoryBySnowName`. Lookup uses `findFirstBySnowNameAndGitTypeOrderByCreatedAtDesc` when `gitType` is set, otherwise `findFirstBySnowNameOrderByCreatedAtDesc`. The hosted repository only has `findFirstBySnowName` and does not upsert the anonymous table from the processor.

---

## HTTP API

### List deployments

Hosted `SnowDeploymentQueryController.getSnowDeploymentsByActorId`:

`GET /connectors/get-snow-deployments?actorId={actorId}&type={type}&gitType={gitType}`

Resolves the profile, then reads `snow_deployments_{profile_id}`. Blank `actorId` or a missing profile returns an empty list. `type=ALL` returns every type.

Self-hosted `getSnowDeployments`:

`GET /connectors/get-snow-deployments`

No query parameters. Returns every row from `snow_deployments_anonymous` via `listAll()`.

`SnowDeploymentQueryHandler.getSnowDeploymentsByActorId` and `getAllPersistentSnowDeployments` exist only in the hosted service. `DataSourceSnowPersistentRepository.findAll()` exists only there, and it backs the persistent endpoint.

Both still expose `GET /connectors/get-snow-deployments/all`, which lists `snow_deployments_anonymous`. In this repo that result matches `GET /connectors/get-snow-deployments`.

### URL and repository lookup

| | `snow-publish-java` | `snow-publish-java-selfhosted` |
|---|---|---|
| URL | `GET /connectors/get-snow-url?snowName&actorId&gitType` | `GET /connectors/get-snow-url?snowName&gitType` |
| Repository | `GET /connectors/get-snow-repository?snowName&actorId&gitType` | `GET /connectors/get-snow-repository?snowName&gitType` |
| Required | `snowName` and `actorId` | `snowName` |
| Source | Profile table after `getProfileByActorId` | `snow_deployments_anonymous` |
| Missing row | `{"url":""}` or `{"repository":""}` | Same |

Get-snow-url stays pipeline-token protected in both. Get-snow-repository is Firebase-protected in the hosted service and open in this one.

### Delete

`DELETE /connectors/publish-snow-deployment?repository&actorId&gitType` is the same handler in both. It deletes from `snow_deployments_{profile_id}`, not from `snow_deployments_anonymous`. The OpenAPI text in this repo drops the Firebase `401` response. The hosted description says a Firebase ID token is required.

### Self-hosted setup (this repo only)

`connectors.self_hosted` is a single row. The entity throws on insert. Updates save only when `count() == 1`.

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/connectors/self-hosted` | The row, or `404` `{"error":"self_hosted record not found"}` |
| `GET` | `/connectors/self-hosted/first-time-flag` | `{"firstTimeFlag": <int>}` |
| `PUT` | `/connectors/self-hosted` | Partial update. At least one of `firstTimeFlag`, `auth`, `baseUrl`, `clientId`, `redirectUri`, `hostBaseUrl`. Omitted fields stay unchanged. `400` if the body has no fields |
| `PUT` | `/connectors/self-hosted/first-time-flag` | Requires `auth` of `github` or `gitlab`, plus `baseUrl` and `hostBaseUrl`. Writes those fields, `clientId`, `redirectUri`, and sets `firstTimeFlag` to `0` |

Entity defaults: `firstTimeFlag=1`, `auth=gitlab`, `baseUrl=https://gitlab.com`, `clientId=""`, `redirectUri=http://localhost:4200/login`, `hostBaseUrl=""`.

These routes are not in the self-hosted Postman collection.

### Unchanged endpoints

Same paths and handlers: health, liveness, profile POST/PUT, license, pipeline token GET/PUT, tabs, publish POST, color, liveness-type, liveness-status, table-data, truncate, and get-all-profiles-with-deployments.

---

## Data model

### Deployment text columns

Both deployment entities, the publish command, `DeploymentMapper`, and the deployment upserts carry four text columns:

- `terraform_output`
- `terraform_vars`
- `docker_output`
- `docker_vars`

`ensureTerraformOutputColumns()` adds all four columns on anonymous, persistent, volatile, and `snow_deployments_{profile_id}` tables.

Both Postman publish bodies include `terraformOutput`, `terraformVars`, `dockerOutput`, and `dockerVars`.

### Profile role default

`ProfileOwners.roleProfile`:

| Repo | Column default | Java default |
|---|---|---|
| `snow-publish-java` | `'OWNER'` | `"OWNER"` |
| `snow-publish-java-selfhosted` | `'REGULAR'` | `"REGULAR"` |

### `self_hosted` table

Present only in this service. Columns: `id`, `first_time_flag`, `created_at`, `auth`, `base_url`, `client_id`, `redirect_uri`, `host_base_url`. Full column list is in [database-schema.md](database-schema.md). The hosted repo has no equivalent table or entity.

The other `connectors` tables (`profile_owners`, tabs, persistent, volatile, anonymous, and runtime `snow_deployments_{profile_id}`) exist in both.

---

## Build, runtime, and deploy names

| File | Change |
|---|---|
| `pom.xml` | `artifactId` and `name` are `snow-publish-java-selfhosted`. `com.google.firebase:firebase-admin:9.10.0` is removed. `jjwt` stays |
| `src/main/resources/application.properties` | `spring.application.name=snow-publish-java-selfhosted` |
| `Dockerfile` | Copies `snow-publish-java-selfhosted-*.jar` |
| `infra/docker-compose.yml` | Image `yabinm/snow-publish-java-selfhosted:latest`. No `FIREBASE_ADMINSDK` |
| `.github/workflows/build-and-push-image.yml.og` | Image name `yabinm/snow-publish-java-selfhosted` |
| `.github/workflows/deploy-application.yml.og` | App name `snow-publish-java-selfhosted`. No `FIREBASE_ADMINSDK` env value |
| `.cursor/rules/api-json-camelcase.mdc` | Glob points at `snow-publish-java-selfhosted.postman_collection.json` |

Java version, Spring Boot parent, virtual threads, Postgres settings, and the rest of `application.properties` match.

---

## Docs and Postman

Every shared markdown file under `docs/` differs, because the hosted docs describe Firebase and profile-table reads, and these docs describe pipeline-only auth and anonymous reads.

| Doc | What changed in this repo |
|---|---|
| `docs/README.md` | Drops the Firebase sentence and `firebase-bearer-auth.md`. Adds `database-schema.md`. List and process topics point at `snow_deployments_anonymous` |
| `docs/api-authentication-and-security.md` | Removes `FirebaseAuthInterceptor`, `FirebaseConfig`, and `FirebaseTokenVerifier`. Other `/connectors/**` have no token check |
| `docs/firebase-bearer-auth.md` | Hosted only |
| `docs/database-schema.md` | This repo only |
| `docs/business-logic.md` | Stage 2 writes the anonymous table. Schema notes match the narrower columns and `self_hosted` |
| `docs/user-guide.md` | API table, curls, and auth section match this service, including `/connectors/self-hosted` |
| `docs/process-deployments.md` | Anonymous upsert instead of per-profile upsert |
| `docs/publish-snow-deployment.md` | DELETE description no longer mentions a Firebase token |
| `docs/get-snow-deployments-by-actor-id.md` | Documents `getSnowDeployments()` with no query params |
| `docs/get-snow-url.md`, `docs/get-snow-repository.md` | Drop required `actorId`. Source is the anonymous table |
| `docs/get-profile.md`, `docs/get-snow-token-pipeline.md`, `docs/get-all-profiles-with-deployments.md` | Same endpoints. Cross-links and “where rows are read” text follow the anonymous read model |

Postman collections are separate files (`snow-publish-java.postman_collection.json` vs `snow-publish-java-selfhosted.postman_collection.json`). Collection-level auth text matches the table above. Request differences:

| Request | Hosted collection | Self-hosted collection |
|---|---|---|
| Get deployments | “Get Deployments by Actor ID” and “Get Deployments by Actor ID and Type”, with `actorId`, `type`, `gitType` | One “Get Deployments” request, no query string |
| Persistent deployments | “Get All Persistent Deployments” | Absent |
| Get URL / repository | `snowName`, `actorId`, `gitType` | `snowName`, `gitType` |
| Publish body | Includes `terraformOutput`, `terraformVars`, `dockerOutput`, `dockerVars` | The same four fields |
| Self-hosted setup | Absent | Absent (the API exists in code; the collection does not call it) |

---

## What did not change

- Publish POST still enqueues into the volatile table and returns when the command is accepted.
- A profile must exist before Stage 2 writes a read-model row.
- Delete, profile deployment tables, and get-all-profiles-with-deployments still use `snow_deployments_{profile_id}`.
- Pipeline JWT issue, regenerate, and HMAC verification are the same.
- Tabs, liveness, health, queue, and clean tasks are the same.
- JSON and query fields stay camelCase (`actorId`, `gitType`, `snowName`).
