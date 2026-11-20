# health-cron-bun Documentation

A Bun HTTP service that registers liveness probes, checks health endpoints on a schedule, and forwards results to a host URL.

## Project

This code lives in the **[snow-cron-bun](https://github.com/snow-monkeys-org/snow-cron-bun)** repository, owned by the **[snow-monkeys-org](https://github.com/snow-monkeys-org)** GitHub organization.

| | |
|--|--|
| **Service name** | `health-cron-bun` |
| **Repository** | [github.com/snow-monkeys-org/snow-cron-bun](https://github.com/snow-monkeys-org/snow-cron-bun) |
| **Docker image** | `yabinm/health-cron-bun:latest` |
| **Runtime** | [Bun](https://bun.sh) |
| **Database** | PostgreSQL (`connectors` schema) |

It is part of the **Snow Monkeys** services stack: a small relay that registers liveness probes, polls `healthUrl` on a schedule, and POSTs results to each probe's `snowHostUrl` (default `http://snow-monkeys.com:8080`). CI/CD uses shared workflows from [snow-monkeys-modules/docker-iac](https://github.com/snow-monkeys-modules/docker-iac) (build/push) and [snow-monkeys-modules/hetzner-iac](https://github.com/snow-monkeys-modules/hetzner-iac) (deploy).

## Contents

| Document | Description |
|----------|-------------|
| [Getting Started](getting-started.md) | Prerequisites, local setup, Docker, quick examples |
| [Architecture](architecture.md) | Data flow, cron behavior, source layout |
| [processRecord](process-record.md) | Per-record health check and relay logic (`src/cron.ts`) |
| [API Reference](api.md) | HTTP endpoints, request/response formats, errors |
| [POST /queue](post-queue.md) | Register or update a liveness probe (detailed) |
| [GET /queue](get-queue.md) | List probes for a profile (detailed) |
| [GET /profiles](get-profiles.md) | List all profiles with nested probe records (detailed) |
| [Database](database.md) | PostgreSQL schema, connection config, persistence |
| [Deployment](deployment.md) | Environment variables, Docker, CI/CD |

## Quick overview

```
Client ──POST /queue──► PostgreSQL (connectors.livenessprobe_records)
                              │
                        node-cron (every 10 min)
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
              GET healthUrl      POST snowHostUrl
```

1. Register a service with `POST /queue` (`snowName`, `healthUrl`, optional `snowHostUrl`).
2. Every 10 minutes the cron job reads all records from PostgreSQL.
3. For each record it GETs `healthUrl` and POSTs the result to `snowHostUrl`.

## Postman

Import [`health-cron-bun.postman_collection.json`](../health-cron-bun.postman_collection.json) for ready-made API requests.
