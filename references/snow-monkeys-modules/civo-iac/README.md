# civo-iac

Reusable GitHub Actions workflow for provisioning Civo instances and deploying Docker Compose services and applications. Consumed by other repositories via `workflow_call`.

Maintainer notes → [CLAUDE.md](CLAUDE.md)

---

## How it works

This module covers the three stages of a typical deployment:

1. **Kubernetes (default)** — empty `type` or `type: kubernetes` deploys a container image into a Civo cluster
2. **Create compute** — `type: compute` provisions via Terraform (`iac-terraform/v1/modules/dev/civo/$RESOURCE`)
3. **Deploy compose** — `docker_compose` / `docker_compose_app` on an existing host

After deployment, the workflow notifies Snow (`CLUSTER` / `RESOURCE` / `SERVICE` / `APPLICATION`). Kubernetes reports `APPLICATION`.

---

## Quick start

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-snow-service-name
      host: my-snow-server-name
      snow_host_url: https://snow.internal
      git_type: github
      provider: civo
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

For Terraform compute, pass `type: compute`, `type_values`, and `civo_token`. Kubernetes callers keep kebab-case secrets (`civo-token`, `snow-token`). Size/image/location for Terraform go in `type_values`, not dedicated workflow inputs.

See [docs/EXAMPLES.md](docs/EXAMPLES.md) for full examples of all deployment types.

---

## Naming conventions

| Layer | Convention |
|---|---|
| Workflow inputs, outputs, secrets | snake_case (`type_values`, `server_ip`, `civo_token`) |
| Snow API query params and JSON bodies | camelCase (`snowName`, `actorId`, `gitType`) |

Full reference → [docs/NAMING.md](docs/NAMING.md)

`actor` and `actorId` for Snow are taken from `github.actor` and `github.actor_id` automatically.

---

## Deployment types

| `type` | What it does |
|---|---|
| empty or `kubernetes` | Image deploy into Civo Kubernetes; reports `APPLICATION` |
| `compute` | Terraform instance (`iac-terraform/.../civo/compute`); reports `CLUSTER` |
| `bucket` / `observability` / `resource` / other non-compose | Terraform resource; reports `RESOURCE` |
| `docker_compose` | Docker Compose service on an existing host; reports `SERVICE` |
| `docker_compose_app` | Docker Compose app plus cleanup; reports `APPLICATION` |

---

## Inputs

Full reference → [docs/INPUTS_OUTPUTS.md](docs/INPUTS_OUTPUTS.md)

| Input | Required | Default | Description |
|---|---|---|---|
| `type` | No | `''` | Empty/`kubernetes` = k8s deploy. Terraform: `compute`, `bucket`, `observability`. Compose: `docker_compose`, `docker_compose_app` |
| `name` | No | `snow-server` | Resource name used for identification in Snow |
| `host` | No | `snow-server` | Target host — IP, hostname, or Snow service name (`docker_compose` / `docker_compose_app` only) |
| `snow_host_url` | No | `https://api.snow-monkeys.com` | Base URL of the Snow API; bare IPs get `https://` prepended before host resolution |
| `git_type` | No | `github` | Git provider type sent to Snow (e.g. `github`) |
| `provider` | No | `civo` | Cloud provider |
| `resource` | No | `''` | Terraform module folder under `iac-terraform/v1/modules/dev/civo/`. Empty → same value as `type`. |
| `type_values` | No | `''` | `KEY=VALUE` lines for Civo Terraform vars (`size`, `region`, …) |
| `infra` | No | `infra` | Caller-repo directory copied to the remote host |
| `enable_generate_ssh_key` | No | `false` | Forwarded to `server-resource` |
| `destroy` | No | `false` | Set to `true` to destroy the server/resource instead of creating it |
| `environment` | No | `''` | GitHub environment name |
| `expected_url` | No | `''` | `hostname:port` reported to Snow; hostname replaced with resolved host, port kept |
| `health_url` | No | `''` | Health check URL; when non-empty on `docker_compose_app`, queues a liveness probe in Snow after notify |
| `test_flag` | No | `false` | Forwarded to composite actions. On `server-resource`, `true` runs Terraform destroy after provision |

This workflow does not have `server_type` / `image` / `location` inputs. Pass Civo-specific Terraform variables through `type_values`.

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
| `civo_token` | Civo API token (Terraform / compose path) |
| `civo-token` | Civo API token (Kubernetes path) |
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
| `server_ip` | Public IP of the provisioned server (`type: compute`, `resource`, or other non-compose) |
| `terraform_vars` | Non-secret Terraform variables as JSON (`type: compute`, `resource`, or other non-compose) |
| `address` | Resolved host address from `docker_compose` or `docker_compose_app` deployment |
| `container_name` | Container name returned by `init.sh` on the remote host |
| `docker_output` | Docker logs from the deployed container, as JSON (`type: docker_compose` or `docker_compose_app`) |
| `docker_vars` | Compose service fields (`image`, `container_name`, `ports`, and the rest) as JSON (`type: docker_compose` or `docker_compose_app`) |

---

## Terraform options

Civo size and region are **not** workflow inputs. Pass them as `type_values` to the Terraform module:

```yaml
    with:
      type: compute
      type_values: |
        size=g4s.kube.small
        region=LON1
```

Terraform runs in `iac-terraform/v1/modules/dev/civo/$RESOURCE`. If `resource` is empty, `assign_resource` copies `type` so they match.

> Size and region values go in `type_values`. The Civo `compute` Terraform folder is a stub.

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
