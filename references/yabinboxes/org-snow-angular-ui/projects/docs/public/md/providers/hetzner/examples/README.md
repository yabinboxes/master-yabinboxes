# Hetzner examples

Caller repositories for `snow-monkeys-modules/hetzner-iac`. Each workflow file belongs at `.github/workflows/` in that repository. The `infra/` trees are copied to `/tmp/` on the server.

Put the workflow files in your repository as `.github/workflows/<file>.yml`. Paths below are the copies served by these docs.

| Guide | `type` | Audience sections |
|---|---|---|
| [Hetzner server](/docs/provider/hetzner/hetzner-server) | `hcloud_server` | User documentation, Agent AI documentation |
| [Hetzner resource](/docs/provider/hetzner/hetzner-resource) | `hcloud_firewall`, `hcloud_network`, `hcloud_volume`, `hcloud_floating_ip`, `hcloud_volume_attachment` | User documentation, Agent AI documentation |
| [Hetzner Docker Compose](/docs/provider/hetzner/hetzner-docker-compose) | `docker_compose` | User documentation, Agent AI documentation |
| [Hetzner Docker Compose app](/docs/provider/hetzner/hetzner-docker-compose-app) | `docker_compose_app` | User documentation, Agent AI documentation |

Stateless workflows keep Terraform state on the runner. Stateful workflows create an S3 bucket with `aws-iac`, then pass `s3_bucket_state` and `state_values` (`region`, `encrypt`). Destroy jobs set `destroy: true` in the same workflow run.

The server job in the stateful server workflows depends on `create_s3_bucket`.

## Stateless server

| File | What it is |
|---|---|
| [server-stateless.yml](/docs/provider/hetzner/examples?file=stateless/server/workflows/server-stateless.yml) | Create `server-hetzner-stateless` (`cpx12`, `ubuntu-26.04`, `hel1`) |
| [init.sh](/docs/provider/hetzner/examples?file=stateless/server/infra/init.sh) | Bootstrap entrypoint |
| [setup-docker.sh](/docs/provider/hetzner/examples?file=stateless/server/infra/init/setup-docker.sh) | Docker CE install |
| [setup-nginx.sh](/docs/provider/hetzner/examples?file=stateless/server/infra/init/setup-nginx.sh) | Start Nginx |
| [nginx compose](/docs/provider/hetzner/examples?file=stateless/server/infra/init/nginx/docker-compose.yml) | Container `snow-api` on port `8080` |
| [default.conf](/docs/provider/hetzner/examples?file=stateless/server/infra/init/nginx/default.conf) | `/health` |

## Stateless service

| File | What it is |
|---|---|
| [service-stateless.yml](/docs/provider/hetzner/examples?file=stateless/service/workflows/service-stateless.yml) | Server, then Nginx service on port `8080` |
| [init.sh](/docs/provider/hetzner/examples?file=stateless/service/infra/init.sh) | Service entrypoint |
| [deploy-in-hetzner.sh](/docs/provider/hetzner/examples?file=stateless/service/infra/deployment/deploy-in-hetzner.sh) | `docker compose up -d` |
| [docker-compose.yml](/docs/provider/hetzner/examples?file=stateless/service/infra/docker-compose.yml) | `my-nginx` |

## Stateless application

| File | What it is |
|---|---|
| [application-stateless.yml](/docs/provider/hetzner/examples?file=stateless/application/workflows/application-stateless.yml) | Server, then app on port `4321` |
| [init.sh](/docs/provider/hetzner/examples?file=stateless/application/infra/init.sh) | App entrypoint |
| [deploy-in-hetzner.sh](/docs/provider/hetzner/examples?file=stateless/application/infra/deployment/deploy-in-hetzner.sh) | `docker compose up -d` |
| [docker-compose.yml](/docs/provider/hetzner/examples?file=stateless/application/infra/docker-compose.yml) | `growing-gravity` |

## Stateless resources

| File | `type` |
|---|---|
| [firewall-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/firewall-stateless.yml) | `hcloud_firewall` |
| [network-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/network-stateless.yml) | `hcloud_network` |
| [volume-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/volume-stateless.yml) | `hcloud_volume` |
| [floating-ip-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/floating-ip-stateless.yml) | `hcloud_floating_ip` |
| [volume-attachment-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/volume-attachment-stateless.yml) | `hcloud_volume_attachment` |

## Stateless combined

One repository, several `infra` paths. Prefer separate repositories outside these demos.

| File | What it runs |
|---|---|
| [example-1-stateless.yml](/docs/provider/hetzner/examples?file=stateless/combined/workflows/example-1-stateless.yml) | Server (`server/infra`) and application (`application/infra`) |
| [example-2-stateless.yml](/docs/provider/hetzner/examples?file=stateless/combined/workflows/example-2-stateless.yml) | Server (`server/infra`) and Postgres (`service/infra`) |
| [Postgres compose](/docs/provider/hetzner/examples?file=stateless/combined/service/infra/deployment/postgres/docker-compose.yml) | `postgres:15` on `127.0.0.1:5432` |
| [init-db.sql](/docs/provider/hetzner/examples?file=stateless/combined/service/infra/deployment/postgres/init-db.sql) | Schema `snow` |

## Stateful server

| File | What it is |
|---|---|
| [server-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/server/workflows/server-statefull-s3.yml) | S3 bucket, then `server-hetzner` |
| [server-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/server/workflows/server-statefull-s3-destroy.yml) | Same, then `destroy: true` |
| [init.sh](/docs/provider/hetzner/examples?file=stateful/server/infra/init.sh) | Same Docker and Nginx bootstrap |

## Stateful service and application

| File | What it is |
|---|---|
| [service-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/service/workflows/service-statefull-s3.yml) | Bucket, server, Nginx service |
| [service-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/service/workflows/service-statefull-s3-destroy.yml) | Same, then destroy the server |
| [application-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/application/workflows/application-statefull-s3.yml) | Bucket, server, application |
| [application-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/application/workflows/application-statefull-s3-destroy.yml) | Same, then destroy the server |

## Stateful resources

| File | Destroy file |
|---|---|
| [firewall-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/firewall-statefull-s3.yml) | [destroy](/docs/provider/hetzner/examples?file=stateful/resources/workflows/firewall-statefull-s3-destroy.yml) |
| [network-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/network-statefull-s3.yml) | [destroy](/docs/provider/hetzner/examples?file=stateful/resources/workflows/network-statefull-s3-destroy.yml) |
| [volume-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/volume-statefull-s3.yml) | [destroy](/docs/provider/hetzner/examples?file=stateful/resources/workflows/volume-statefull-s3-destroy.yml) |
| [floating-ip-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/floating-ip-statefull-s3.yml) | [destroy](/docs/provider/hetzner/examples?file=stateful/resources/workflows/floating-ip-statefull-s3-destroy.yml) |
| [volume-attachment-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/volume-attachment-statefull-s3.yml) | [destroy](/docs/provider/hetzner/examples?file=stateful/resources/workflows/volume-attachment-statefull-s3-destroy.yml) |

## Stateful combined

| File | What it runs |
|---|---|
| [example-1-statefull.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-1-statefull.yml) | Bucket, server, application |
| [example-1-statefull-destroy.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-1-statefull-destroy.yml) | Same, then destroy the server |
| [example-2-statefull.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-2-statefull.yml) | Bucket, server, Postgres |
| [example-2-statefull-destroy.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-2-statefull-destroy.yml) | Same, then destroy the server |
