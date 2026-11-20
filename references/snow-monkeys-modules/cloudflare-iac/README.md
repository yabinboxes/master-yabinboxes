# cloudflare-iac

Reusable GitHub Actions workflow for provisioning Cloudflare resources and deploying Docker Compose services and applications. Consumed by other repositories via `workflow_call`.

Maintainer notes → [CLAUDE.md](CLAUDE.md)

---

## How it works

This module covers the three stages of a typical deployment:

1. **Create a resource** — provisions Cloudflare via Terraform (`iac-terraform/v1/modules/dev/cloudflare/$RESOURCE`). For `cloudflare_pages_project`, Wrangler then uploads `$INFRA`.
2. **Deploy a service** — deploys a database, message broker, or other backing service via Docker Compose
3. **Deploy an application** — deploys an application via Docker Compose, with automatic Docker space cleanup and log rotation

After deployment, the workflow notifies the Snow platform (`RESOURCE`, `SERVICE`, or `APPLICATION`) via `snow-iac`. For `docker_compose_app`, an optional health check is queued when `health_url` is set (default: empty — probe skipped).

---

## Quick start

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-snow-service-name
      host: my-snow-server-name
      snow_host_url: https://snow.internal
      git_type: github
      provider: cloudflare
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

For Terraform types, also pass `type_values` and the `cloudflare_token` / `cloudflare_account_id` secrets. Optional on `docker_compose_app`: `health_url`, `expected_url`.

See [docs/EXAMPLES.md](docs/EXAMPLES.md) for full examples of all deployment types.

---

## Naming conventions

| Layer | Convention |
|---|---|
| Workflow inputs, outputs, secrets | snake_case (`type_values`, `server_ip`, `cloudflare_token`) |
| Snow API query params and JSON bodies | camelCase (`snowName`, `actorId`, `gitType`) |

Full reference → [docs/NAMING.md](docs/NAMING.md)

`actor` and `actorId` for Snow are taken from `github.actor` and `github.actor_id` automatically.

---

## Deployment types

| `type` | What it does |
|---|---|
| `cloudflare_pages_project` | Provisions Cloudflare Pages via Terraform, then Wrangler uploads `$INFRA`; reports `RESOURCE` to Snow |
| `resource` | Same Terraform path; reports `RESOURCE` to Snow |
| other non-compose | Same as `resource` (empty `resource` → copies `type`) |
| `docker_compose` | Deploys a Docker Compose service to an existing host |
| `docker_compose_app` | Deploys a Docker Compose application to an existing host (includes Docker cleanup and log rotation) |

---

## Inputs

Full reference → [docs/INPUTS_OUTPUTS.md](docs/INPUTS_OUTPUTS.md)

| Input | Required | Default | Description |
|---|---|---|---|
| `type` | No | `cloudflare_pages_project` | Deployment type: `cloudflare_pages_project`, `resource`, `docker_compose`, or `docker_compose_app` |
| `name` | No | `snow-server` | Resource name used for identification in Snow |
| `host` | No | `snow-server` | Target host — IP, hostname, or Snow service name (`docker_compose` / `docker_compose_app` only) |
| `snow_host_url` | No | `https://api.snow-monkeys.com` | Base URL of the Snow API; bare IPs get `https://` prepended before host resolution |
| `git_type` | No | `github` | Git provider type sent to Snow (e.g. `github`) |
| `provider` | No | `cloudflare` | Cloud provider |
| `resource` | No | `''` | Terraform module folder under `iac-terraform/v1/modules/dev/cloudflare/`. Empty → same value as `type`. |
| `type_values` | No | `''` | `KEY=VALUE` lines for Cloudflare Terraform vars (Pages/project Terraform vars, …) |
| `infra` | No | `infra` | Caller-repo directory copied to the remote host |
| `enable_generate_ssh_key` | No | `false` | Forwarded to `server-resource` |
| `destroy` | No | `false` | Set to `true` to destroy the server/resource instead of creating it |
| `environment` | No | `''` | GitHub environment name |
| `expected_url` | No | `''` | `hostname:port` reported to Snow; hostname replaced with resolved host, port kept |
| `health_url` | No | `''` | Health check URL; when non-empty on `docker_compose_app`, queues a liveness probe in Snow after notify |
| `test_flag` | No | `false` | Forwarded to composite actions. On `server-resource`, `true` runs Terraform destroy after provision |

This workflow does not have `server_type` / `image` / `location` inputs. Pass Cloudflare-specific Terraform variables through `type_values`.

### `host` resolution

Runs for `docker_compose` and `docker_compose_app` when `host` is not empty:

- **Empty** — step is skipped; downstream steps receive an empty host
- **IP address** (`1.2.3.4`) — used directly, no API call
- **Name** (`my-service`) — resolved via Snow API with Bearer auth:

  `GET {snow_host_url}/connectors/get-snow-url?snowName={host}&actorId={github.actor_id}&gitType={git_type}`  
  `Authorization: Bearer {snow_token}`

Bare IP `snow_host_url` values get `https://` prepended before the API call. `http://` / `https://` prefixes on `host` are stripped in composite actions before SSH.

### `expected_url` resolution

If `expected_url` contains a hostname (e.g. `my-service:3000`), the hostname is replaced with the resolved `host` value, keeping the port. If it already contains an IP, it is left unchanged.

---

## Secrets

Full reference → [docs/INPUTS_OUTPUTS.md](docs/INPUTS_OUTPUTS.md)

| Secret | Description |
|---|---|
| `ssh_public_key` | SSH public key added to the remote server |
| `ssh_private_key` | SSH private key used to connect (ed25519) |
| `cloudflare_token` | Cloudflare API token (terraform types) |
| `cloudflare_account_id` | Cloudflare account ID (terraform types) |
| `aws_access_key_id` | AWS access key for S3 Terraform state when `s3_bucket_state` is set |
| `aws_secret_access_key` | AWS secret key for S3 Terraform state when `s3_bucket_state` is set |
| `snow_token` | Snow API Bearer token (host resolution + notify/health via `snow-iac`) |
| `snow_github_token` | GitHub token for cloning private repos on the remote host |
| `env_values` | `.env` contents written on the remote before `init.sh` runs |

`env_values` format — newline-separated `KEY=VALUE` pairs:

```
DATABASE_URL=postgres://...
API_KEY=abc123
PORT=3000
```

---

## Outputs

Full reference → [docs/INPUTS_OUTPUTS.md](docs/INPUTS_OUTPUTS.md)

| Output | Description |
|---|---|
| `server_ip` | Pages URL or Terraform host (`type: cloudflare_pages_project`, `resource`, or other non-compose) |
| `terraform_vars` | Non-secret Terraform variables as JSON (`type: cloudflare_pages_project`, `resource`, or other non-compose) |
| `address` | Resolved host address from `docker_compose` or `docker_compose_app` deployment |
| `container_name` | Container name returned by `init.sh` on the remote host |
| `docker_output` | Docker logs from the deployed container, as JSON (`type: docker_compose` or `docker_compose_app`) |
| `docker_vars` | Compose service fields (`image`, `container_name`, `ports`, and the rest) as JSON (`type: docker_compose` or `docker_compose_app`) |

---

## Terraform options

Cloudflare zone, account, and project fields are **not** workflow inputs. Pass them as `type_values` to the Terraform module:

```yaml
    with:
      type: cloudflare_pages_project
      type_values: |
        account_id=abc123
        project_name=my-pages
```

Terraform runs in `iac-terraform/v1/modules/dev/cloudflare/$RESOURCE`. If `resource` is empty, `assign_resource` copies `type` so they match.

> Cloudflare Terraform resources: [developers.cloudflare.com/terraform](https://developers.cloudflare.com/terraform/)

---

## Caller repository requirements

For `docker_compose` and `docker_compose_app` types, the calling repository must have an `infra/` directory at its root containing at minimum:

- `init.sh` — executed on the remote host to start the application; must print the container name to stdout

The contents of `infra/` are copied to `/tmp/` on the remote host before `init.sh` is run. `mkdir -p /tmp` creates that directory when it does not already exist.

---

## Documentation

- [docs/INPUTS_OUTPUTS.md](docs/INPUTS_OUTPUTS.md) — inputs, secrets, and outputs reference
- [docs/FLOW.md](docs/FLOW.md) — step-by-step logic flow for `main.yml`
- [docs/EXAMPLES.md](docs/EXAMPLES.md) — full workflow examples for all deployment types
- [docs/NAMING.md](docs/NAMING.md) — string format conventions
- [CLAUDE.md](CLAUDE.md) — maintainer and AI editing guidelines
