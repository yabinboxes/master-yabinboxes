# Deployment

## Environment variables

### HTTP server

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | HTTP listen port |

### PostgreSQL

| Variable | Default | Purpose |
|----------|---------|---------|
| `POSTGRES_HOST` | `postgres` | Database host |
| `POSTGRES_PORT` | `5434` | Database port |
| `POSTGRES_DB` | `postgres` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `admin` | Database password |
| `POSTGRES_SCHEMA` | `connectors` | Schema name |

## Docker

### Image

```
yabinm/health-cron-bun:latest
```

Built and pushed to Docker Hub on push to `main` via GitHub Actions.

### Run

```bash
docker run -p 3000:3000 \
  -e POSTGRES_HOST=postgres \
  -e POSTGRES_PORT=5434 \
  -e POSTGRES_DB=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_SCHEMA=connectors \
  yabinm/health-cron-bun:latest
```

### Dockerfile notes

- Multi-stage build on `oven/bun:alpine`
- Production stage copies `src/` and `package.json` only
- Runs as non-root `bun` user
- Exposes port `3000`
- Entrypoint: `bun run src/index.ts`

## CI/CD

### Build and push image

Workflow: [`.github/workflows/build-and-push-image.yml`](../.github/workflows/build-and-push-image.yml)

- **Trigger:** push to `main`
- **Reusable workflow:** `snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main`
- **Publishes:** `yabinm/health-cron-bun:latest`

| Input / secret | Value |
|----------------|-------|
| `type` | `build-and-push-image` |
| `name` | `yabinm/health-cron-bun` |
| `tag` | `latest` |
| `registry_user` | `secrets.GLOBAL_DOCKERHUB_USERNAME` |
| `registry_token` | `secrets.GLOBAL_DOCKERHUB_TOKEN` |
| `snow_token` | `secrets.SNOW_TOKEN` |

All multi-word reusable-workflow keys use **snake_case**.

### Deploy to Hetzner

Workflow: [`.github/workflows/deploy-application.yml`](../.github/workflows/deploy-application.yml)

- **Trigger:** successful completion of **Build and push image to registry** on `main`
- **Reusable workflow:** `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main`

| Input / secret | Value |
|----------------|-------|
| `snow_host_url` | `http://65.109.233.99` |
| `provider` | `hetzner` |
| `type` | `docker-compose-app` |
| `name` | `health-cron-bun` |
| `host` | `65.109.233.99` |
| `destroy` | `false` |
| `ssh_public_key` | `secrets.SSH_PUBLIC_KEY` |
| `ssh_private_key` | `secrets.SSH_PRIVATE_KEY` |
| `snow_github_token` | `secrets.SNOW_GITHUB_TOKEN` |
| `snow_token` | `secrets.SNOW_TOKEN` |
| `env_values` | multiline env file content |

## Runtime requirements

- PostgreSQL must be reachable before the container/process starts
- Outbound network access to all registered `healthUrl` and `snowHostUrl` values
- No persistent volume required for the app itself (state is in PostgreSQL)

## Health monitoring

Monitor this service itself via:

```bash
curl http://<host>:3000/health
```

Cron activity is logged to stdout:

```
[cron] Triggered
[cron] Running — 3 record(s) in queue
[cron] Dashboard POST for "my-service" → 200
[cron] Done
```
