# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

| | |
|--|--|
| **Service** | `health-cron-bun` |
| **Repository** | [snow-monkeys-org/snow-cron-bun](https://github.com/snow-monkeys-org/snow-cron-bun) |
| **Docker image** | `yabinm/health-cron-bun:latest` |
| **Documentation** | `docs/` — index at `docs/README.md` |

Bun HTTP health-check relay for the **Snow Monkeys** stack. Registers liveness probes in PostgreSQL, polls `healthUrl` every 10 minutes, and POSTs results to `snowHostUrl`. All JSON API fields use **camelCase**.

## Commands

```bash
bun install      # install dependencies
bun run dev      # run with hot-reload (--watch)
bun run start    # run without hot-reload
```

No build step or test runner is configured. The Dockerfile comments out `bun test` and `bun run build`.

## Architecture

```
Client ──POST /queue──► PostgreSQL (profile tables + main queue)
                              │
                        node-cron (every 10 min)
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
              GET healthUrl      POST snowHostUrl
```

**Data flow:**

1. `POST /queue` — upsert keyed by `snowName` into `connectors.livenessprobe_records_{profileId}`. Requires `snowName`, `healthUrl`, `actorId`, `gitType`; optional `snowHostUrl` (default `http://snow-monkeys.com:8080`). Resolves or creates `connectors.livenessprobe_profiles` by `actorId` + `gitType`. Does **not** write to main `livenessprobe_records`.
2. `node-cron` every 10 minutes — reads **main** `connectors.livenessprobe_records` only. For each record:
   - GET `healthUrl`; on network failure sets `status = "0"` and uses the error message as `response`
   - POST `DashboardPayload` (`repository`, `response`, `status` as string) to `snowHostUrl`
   - Tracks consecutive network failures in `failure_count`; after more than 10 failures moves the record to `livenessprobe_failed_records`
   - All records processed in parallel via `Promise.allSettled`

**API routes:**

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/queue` | Upsert probe in profile table — `201` inserted, `200` updated, `400` bad JSON, `422` missing fields |
| `GET` | `/queue` | List probes for a profile — query params `actorId`, `gitType`; `404` if profile missing |
| `GET` | `/profiles` | List all profiles with probes from each `livenessprobe_records_{id}` table |
| `POST` | `/delete-record-from-queue` | Delete from main active queue — `200` deleted, `404` not found, `422` missing `snowName` |
| `GET` | `/failed-records` | List all rows in `livenessprobe_failed_records` with `total` |
| `GET` | `/deleted-records` | List all rows in `livenessprobe_deleted_records` with `total` |
| `GET` | `/health` | Returns `{ status: "ok", uptime: <seconds> }` |

**Source files** (`src/`):

| File | Role |
|------|------|
| `db.ts` | PostgreSQL pool, schema/table init |
| `index.ts` | Bun HTTP server, route handlers, starts cron |
| `cron.ts` | `startCron()` (10-minute schedule) and `processRecord()` (health GET + host POST) |
| `queue.ts` | `InputQueue` class, parsers, profile/probe persistence (`inputQueue` singleton) |
| `types.ts` | `QueueRecord`, `QueueUpsertRequest`, `DashboardPayload`, and related interfaces |

**PostgreSQL** (`connectors` schema): `livenessprobe_profiles`, `livenessprobe_records`, `livenessprobe_failed_records`, `livenessprobe_deleted_records`, and dynamic `livenessprobe_records_{profileId}` tables.

Postman collection: `health-cron-bun.postman_collection.json`.

## Deployment

Push to `main` triggers `.github/workflows/build-and-push-image.yml`, which calls `snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main` and publishes `yabinm/health-cron-bun:latest`.

Deploy workflow: `.github/workflows/deploy-application.yml` → `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main` (runs after a successful build on `main`).

Dockerfile: multi-stage build on `oven/bun:alpine`. Release stage copies `src/` and `package.json` — new source files under `src/` are included automatically.

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | HTTP listen port |
| `POSTGRES_HOST` | `postgres` | Database host |
| `POSTGRES_PORT` | `5434` | Database port |
| `POSTGRES_DB` | `postgres` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `admin` | Database password |
| `POSTGRES_SCHEMA` | `connectors` | Schema for queue tables |
