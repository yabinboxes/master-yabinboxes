# Hetzner Docker Compose

Deploy a Docker Compose service onto a Hetzner server that already exists.

**Workflow:** `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main`  
**Deployment type:** `docker_compose`  
**Snow record:** `SERVICE`

| Section | For |
|---|---|
| [User documentation](#user-documentation) | People deploying a service onto a server |
| [Agent AI documentation](#agent-ai-documentation) | Agents generating or updating that repository |

The server itself is [Hetzner server](/docs/provider/hetzner/hetzner-server). An application deploy, which also cleans Docker disk and rotates logs, is [Hetzner Docker Compose app](/docs/provider/hetzner/hetzner-docker-compose-app).

[All example files](/docs/provider/hetzner/examples)

---

# User documentation

## What this deploys

`hetzner-iac` resolves `host`, copies `infra/` to `/tmp/` on that host, writes `env_values` to `/tmp/.env`, and runs `bash init.sh`. The first line of `init.sh` stdout is stored as `container_name`. Snow receives a `SERVICE` record.

The standalone example is Nginx:

| Setting | Value |
|---|---|
| `type` | `docker_compose` |
| Stateless `name` | `service-hetzner-stateless` |
| Stateful `name` | `service-hetzner` |
| `host` | Snow name of the server (`server-hetzner-stateless` or `server-hetzner`) |
| `expected_url` | `<server name>:8080` |
| Container | `my-nginx` (`nginx:alpine`), host port `8080` |

The combined example deploys Postgres instead of Nginx. See [Postgres](#postgres-in-the-combined-example).

## Host and expected URL

`host` is an IP, or a Snow name. The examples pass the server `name` from the server workflow. `hetzner-iac` asks Snow to resolve that name before SSH. `http://` and `https://` are stripped from the host before the connection.

`expected_url` is `hostname:port`. When the host part is a name, it is replaced with the resolved address and the port stays. When the host part is an IPv4 address, the value is left as written. Snow uses the deploy `address` as the service URL, and falls back to `expected_url` when address is empty.

## Stateless and stateful

The service job does not take `s3_bucket_state`. State belongs to the server (and any Terraform resource), not to the Compose deploy.

The standalone service workflows still create the server in the same file:

- Stateless: create `hcloud_server`, then `docker_compose`. [service-stateless.yml](/docs/provider/hetzner/examples?file=stateless/service/workflows/service-stateless.yml)
- Stateful: create the S3 bucket, create the server with that bucket, then `docker_compose`. [service-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/service/workflows/service-statefull-s3.yml)
- Stateful destroy removes the server with `destroy: true` in that same run. [service-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/service/workflows/service-statefull-s3-destroy.yml)

Server inputs are documented on the [server page](/docs/provider/hetzner/hetzner-server). The Compose job runs only after the server job.

Prefer a separate repository for the service once the server already exists. Set `host` to the server's Snow name and omit the server job.

## Prerequisites

| GitHub secret | Workflow secret | Used for |
|---|---|---|
| `SSH_PUBLIC_KEY_TEST` | `ssh_public_key` | Key registered for the connection |
| `SSH_PRIVATE_KEY_TEST` | `ssh_private_key` | SSH as `root` |
| `SNOW_TOKEN_PIPELINE` | `snow_token_pipeline` | Host lookup and Snow notify |
| `ENV_VALUES` | `env_values` | Optional `.env` written to `/tmp/.env` |

`env_values` is newline-separated `KEY=VALUE` text. The Nginx example does not set it.

The server half of these workflows also needs `HETZNER_CLOUD_TOKEN`, `SNOW_GITHUB_TOKEN`, and, when stateful, the AWS state-bucket keys.

## Repository layout

```text
.github/workflows/service-stateless.yml
infra/init.sh
infra/docker-compose.yml
infra/deployment/deploy-in-hetzner.sh
```

| File | Role |
|---|---|
| [init.sh](/docs/provider/hetzner/examples?file=stateless/service/infra/init.sh) | Runs `deployment/deploy-in-hetzner.sh` |
| [deploy-in-hetzner.sh](/docs/provider/hetzner/examples?file=stateless/service/infra/deployment/deploy-in-hetzner.sh) | `cd /tmp` and `docker compose up -d` |
| [docker-compose.yml](/docs/provider/hetzner/examples?file=stateless/service/infra/docker-compose.yml) | Nginx on `8080:80`, container name `my-nginx` |

`infra/*` is copied to `/tmp/`, so `infra/docker-compose.yml` becomes `/tmp/docker-compose.yml`.

`init.sh` stdout is the container name passed to `docker logs`. The example script prints `containers=<image>` after compose starts. A new service should print only the container name, for this Nginx example `my-nginx`, and send progress logs to stderr.

## Service workflow

Full file: [service-stateless.yml](/docs/provider/hetzner/examples?file=stateless/service/workflows/service-stateless.yml)

```yaml
  deploy_service_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: service-hetzner-stateless
      host: server-hetzner-stateless
      expected_url: server-hetzner-stateless:8080
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-service:
    needs: deploy_service_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - run: echo "Url is ${{ needs.deploy_service_on_hetzner.outputs.address }}"
```

The stateful service job is the same call with `name: service-hetzner`, `host: server-hetzner`, and `expected_url: server-hetzner:8080`.

`health_url` applies to `docker_compose_app` only. This type does not queue a liveness probe.

## Postgres in the combined example

[example-2-stateless.yml](/docs/provider/hetzner/examples?file=stateless/combined/workflows/example-2-stateless.yml) deploys Postgres onto the server it just created. The stateful pair is [example-2-statefull.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-2-statefull.yml) and [example-2-statefull-destroy.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-2-statefull-destroy.yml).

```yaml
  create-postgres-db-on-hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: server-example-2-stateless
      host: server-example-2-stateless
      expected_url: jdbc:postgresql://localhost:5432/postgres
      infra: service/infra
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
      env_values: |
        DB_USER=postgres
        DB_PASSWORD=admin
```

`infra: service/infra` is how a combined repository selects the service directory. A repository that only contains the service keeps the files at `infra/` and can omit `infra`.

| File | Role |
|---|---|
| [init.sh](/docs/provider/hetzner/examples?file=stateless/combined/service/infra/init.sh) | Runs `deployment/postgres-hetzner.sh` |
| [postgres-hetzner.sh](/docs/provider/hetzner/examples?file=stateless/combined/service/infra/deployment/postgres-hetzner.sh) | Compose from `/tmp/deployment/postgres` |
| [docker-compose.yml](/docs/provider/hetzner/examples?file=stateless/combined/service/infra/deployment/postgres/docker-compose.yml) | `postgres:15`, container `postgres`, bound to `127.0.0.1:5432` |
| [init-db.sql](/docs/provider/hetzner/examples?file=stateless/combined/service/infra/deployment/postgres/init-db.sql) | Creates schema `snow` and table `snow.data_source_users` |

The compose file sets `POSTGRES_USER` and `POSTGRES_PASSWORD` itself. `env_values` is still written to `/tmp/.env`. The database port is bound to localhost on the server, so it is not a public port. `8080` on the Nginx service is public.

Keep the server, the service, and the application in separate repositories when you are not running the combined example. The combined workflows say that in their header comments.

## Outputs

| Output | Meaning |
|---|---|
| `address` | SSH host after name resolution |
| `container_name` | First stdout line from `init.sh` |
| `docker_output` | JSON `{"container_name","logs"}` from `docker logs` |
| `docker_vars` | Compose service fields as JSON (`image`, `container_name`, `ports`, and the rest). Secret env names are omitted |

`server_ip` stays empty for this type.

## Checks

- `address` is the server IP Snow resolved from `host`
- `docker ps` on the server shows `my-nginx` or `postgres`
- Nginx answers on `http://<address>:8080`
- Postgres answers on the server at `127.0.0.1:5432`
- Snow shows a `SERVICE` with this `name`

---

# Agent AI documentation

Use this section to deploy a Compose service onto an existing Hetzner server. To create the server, follow [hetzner-server.md](/docs/provider/hetzner/hetzner-server).

## Goal

Create a caller repository whose `infra/init.sh` starts the Compose project, and whose workflow calls `hetzner-iac` with `type: docker_compose`.

Copy one of these trees into the caller repository (`workflows/` becomes `.github/workflows/`):

| Service | Workflow | Infra |
|---|---|---|
| Nginx, stateless | [service-stateless.yml](/md/providers/hetzner/examples/stateless/service/workflows/service-stateless.yml) | [infra/](/docs/provider/hetzner/examples?file=stateless/service/infra/init.sh) |
| Nginx, stateful server | [service-statefull-s3.yml](/md/providers/hetzner/examples/stateful/service/workflows/service-statefull-s3.yml) | [infra/](/docs/provider/hetzner/examples?file=stateful/service/infra/init.sh) |
| Postgres | [example-2-stateless.yml](/md/providers/hetzner/examples/stateless/combined/workflows/example-2-stateless.yml) | [service/infra/](/docs/provider/hetzner/examples?file=stateless/combined/service/infra/init.sh) |

## Call contract

```yaml
uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
with:
  type: docker_compose
  name: service-hetzner-stateless
  host: server-hetzner-stateless          # Snow name or IP of the server
  expected_url: server-hetzner-stateless:8080
  infra: infra                            # default. Combined Postgres uses service/infra
secrets:
  ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
  ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
  snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  env_values: ${{ secrets.ENV_VALUES }}   # omit when the compose file needs no .env
```

## Rules

- `type` is `docker_compose`. This path does not run Terraform, does not take `s3_bucket_state`, and does not prune Docker.
- `host` is the server Snow `name` when you want Snow to resolve the IP. An IPv4 value is used as-is.
- `expected_url` is `hostname:port` for the Nginx examples (`server-hetzner-stateless:8080`). A name is replaced with the resolved host. An IPv4 host part is kept. The Postgres example passes `jdbc:postgresql://localhost:5432/postgres` instead.
- `infra/` must contain `init.sh`. The action copies `infra/*` to `/tmp/` and runs `cd /tmp && bash init.sh`.
- The first stdout line of `init.sh` is `container_name` and is passed to `docker logs`. Print the compose `container_name` (`my-nginx` or `postgres`) and send other logs to stderr.
- The Nginx compose file publishes `8080:80`. The Postgres compose file publishes `127.0.0.1:5432:5432` and mounts `init-db.sql`.
- Pass SSH keys and `snow_token_pipeline` on the Compose job. Pass `hcloud_token` only on a server or resource job in the same workflow.
- Keep `DB_PASSWORD` and similar values in `env_values` or in GitHub secrets. The Postgres compose file in the example also sets `POSTGRES_PASSWORD` in the compose file.
- `health_url` does nothing for `docker_compose`. Use `docker_compose_app` when you need the liveness probe, log rotation, or `docker system prune -f`.
- Snow notify uses `type: SERVICE`, `url` = `address` (fallback `expected_url`), `image` = `container_name`, plus `docker_output` and `docker_vars`.
- If the workflow also creates the server, the service job `needs` that server job. Stateful server create `needs` the S3 bucket job. Destroy the server with `destroy: true` in the same run. See the server page for the state key.

## Prompt

```text
Using https://docs.snow-monkeys.com/md/providers/hetzner/hetzner-docker-compose.md
and https://docs.snow-monkeys.com/md/providers/hetzner/examples/stateless/service/

Add a workflow that calls
snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
with type docker_compose, name service-hetzner-stateless,
host server-hetzner-stateless, and expected_url server-hetzner-stateless:8080.

Map ssh_public_key, ssh_private_key, and snow_token_pipeline from secrets.

Add infra/init.sh, infra/deployment/deploy-in-hetzner.sh, and
infra/docker-compose.yml from the example. init.sh must print the
container name my-nginx as its first stdout line.

The service job needs the server job when this workflow also creates
the server. Echo needs.deploy_service_on_hetzner.outputs.address.

For Postgres, copy the combined service/infra tree, set infra to
service/infra, and pass DB_USER and DB_PASSWORD through env_values.
```

## Raw documentation URL

```text
https://docs.snow-monkeys.com/md/providers/hetzner/hetzner-docker-compose.md
```
