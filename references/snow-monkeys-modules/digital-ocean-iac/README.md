# digital-ocean-iac

Reusable GitHub Actions workflow for provisioning Digital Ocean droplets and deploying Docker Compose services and applications. Consumed by other repositories via `workflow_call`.

Maintainer notes → [CLAUDE.md](CLAUDE.md)

---

## How it works

This module covers the three stages of a typical deployment:

1. **Create a server** — provisions a Digital Ocean droplet via Terraform
2. **Deploy a service** — deploys a database, message broker, or other backing service via Docker Compose
3. **Deploy an application** — deploys an application via Docker Compose, with automatic Docker space cleanup and log rotation

After deployment, the workflow notifies the Snow platform (`CLUSTER`, `RESOURCE`, `SERVICE`, or `APPLICATION`) via `snow-iac`. For `docker_compose_app`, an optional health check is queued when `health_url` is set (default: empty — probe skipped).

---

## Quick start

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-snow-service-name
      host: my-snow-server-name
      snow_host_url: https://snow.internal
      git_type: github
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

For server provisioning, pass Terraform fields such as `name`, `server_type`, `image`, and `location` in `type_values`, and pass the `digitalocean_token` secret. Optional remote state uses `s3_bucket_state` plus `aws_access_key_id` / `aws_secret_access_key`. Optional on `docker_compose_app`: `health_url`, `expected_url`.

See [docs/EXAMPLES.md](docs/EXAMPLES.md) for full examples of all three deployment types.

---

## Naming conventions

| Layer | Convention |
|---|---|
| Workflow inputs, outputs, secrets | snake_case (`type_values`, `server_ip`, `git_type`) |
| Snow API query params and JSON bodies | camelCase (`snowName`, `actorId`, `gitType`) |

Full reference → [docs/NAMING.md](docs/NAMING.md)

`actor` and `actorId` for Snow are taken from `github.actor` and `github.actor_id` automatically.

---

## Deployment types

| `type` | What it does |
|---|---|
| `digitalocean_droplet` | Provisions a new Digital Ocean droplet via Terraform; reports `CLUSTER` to Snow |
| `digitalocean_droplet_autoscale` | Provisions droplet autoscale via Terraform; reports `CLUSTER` to Snow |
| `resource` | Same Terraform path; reports `RESOURCE` to Snow |
| other non-compose | Same as `resource` (empty `resource` → copies `type`) |
| `docker_compose` | Deploys a Docker Compose service to an existing host |
| `docker_compose_app` | Deploys a Docker Compose application to an existing host (includes Docker cleanup and log rotation) |

---

## Inputs

Full reference → [docs/INPUTS_OUTPUTS.md](docs/INPUTS_OUTPUTS.md)

| Input | Required | Default | Description |
|---|---|---|---|
| `type` | No | `digitalocean_droplet` | Deployment type: `digitalocean_droplet`, `resource`, `docker_compose`, or `docker_compose_app` |
| `name` | No | `snow-server` | Resource name used for identification in Snow |
| `host` | No | `snow-server` | Target host — IP, hostname, or Snow service name (`docker_compose` / `docker_compose_app` only) |
| `snow_host_url` | No | `https://api.snow-monkeys.com` | Base URL of the Snow API; bare IPs get `https://` prepended before host resolution |
| `git_type` | No | `github` | Git provider type sent to Snow (e.g. `github`) |
| `provider` | No | `digitalocean` | Cloud provider |
| `resource` | No | `''` | Terraform module folder under `iac-terraform/v1/modules/dev/digitalocean/`. Empty → same value as `type`. |
| `type_values` | No | `''` | `KEY=VALUE` lines exported as `TF_VAR_*` (`name`, `server_type`, `image`, `location`, and other module variables) |
| `infra` | No | `infra` | Caller-repo directory copied to the remote host |
| `destroy` | No | `false` | Set to `true` to destroy the server instead of creating it |
| `environment` | No | `''` | GitHub environment name |
| `expected_url` | No | `''` | `hostname:port` reported to Snow; hostname replaced with resolved host, port kept |
| `health_url` | No | `''` | Health check URL; when non-empty on `docker_compose_app`, queues a liveness probe in Snow after notify |

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
| `digitalocean_token` | Digital Ocean API token (only for `type: digitalocean_droplet`, `resource`, or other non-compose) |
| `aws_access_key_id` | AWS access key for the S3 Terraform backend (when `s3_bucket_state` is set) |
| `aws_secret_access_key` | AWS secret key for the S3 Terraform backend (when `s3_bucket_state` is set) |
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
| `server_ip` | Public IP of the provisioned server (`type: digitalocean_droplet` or `resource` only) |
| `terraform_vars` | Non-secret Terraform variables as JSON (`type: digitalocean_droplet`, `resource`, or other non-compose) |
| `address` | Resolved host address from `docker_compose` or `docker_compose_app` deployment |
| `container_name` | Container name returned by `init.sh` on the remote host |
| `docker_output` | Docker logs from the deployed container, as JSON (`type: docker_compose` or `docker_compose_app`) |
| `docker_vars` | Compose service fields (`image`, `container_name`, `ports`, and the rest) as JSON (`type: docker_compose` or `docker_compose_app`) |

---

## Droplet options

Pass these as `type_values` lines (`server_type=s-2vcpu-4gb`, `image=ubuntu-22-04-x64`, `location=nyc1`). They are not workflow inputs.

> Full specs and pricing at [docs.digitalocean.com/products/droplets](https://docs.digitalocean.com/products/droplets/)

### Sizes (`server_type`)

| Series | Examples | Notes |
|---|---|---|
| Basic shared | `s-1vcpu-1gb` `s-1vcpu-2gb` `s-2vcpu-2gb` `s-2vcpu-4gb` `s-4vcpu-8gb` | General-purpose droplets |
| General purpose | `g-2vcpu-8gb` `g-4vcpu-16gb` | Dedicated vCPU |
| CPU-optimized | `c-2` `c-4` `c-8` | Compute-heavy workloads |
| Memory-optimized | `m-2vcpu-16gb` `m-4vcpu-32gb` | Memory-heavy workloads |

### Images

| Image | Slugs |
|---|---|
| Ubuntu | `ubuntu-22-04-x64` `ubuntu-24-04-x64` |
| Debian | `debian-11-x64` `debian-12-x64` |
| Fedora | `fedora-40-x64` `fedora-41-x64` |
| Rocky Linux | `rockylinux-8-x64` `rockylinux-9-x64` |

### Regions (`location`)

| Code | City | Country |
|---|---|---|
| `nyc1` `nyc3` | New York | USA |
| `sfo2` `sfo3` | San Francisco | USA |
| `ams3` | Amsterdam | Netherlands |
| `sgp1` | Singapore | Singapore |
| `lon1` | London | UK |
| `fra1` | Frankfurt | Germany |
| `tor1` | Toronto | Canada |
| `blr1` | Bangalore | India |
| `syd1` | Sydney | Australia |

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
