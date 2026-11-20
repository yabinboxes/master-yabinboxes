# Inputs, secrets, and outputs

Shared `workflow_call` contract for every `snow-monkeys-modules/<provider>-iac` workflow, plus the modules in [snow-monkeys-infra/iac-terraform](https://github.com/snow-monkeys-infra/iac-terraform). For logic flow see [FLOW.md](FLOW.md). For caller examples see [EXAMPLES.md](EXAMPLES.md).

All workflow keys use **snake_case**. See [NAMING.md](NAMING.md).

---

## Calling the workflow

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      provider: hetzner
      type: docker_compose_app
      name: my-service
      host: my-server
      snow_host_url: https://api.snow-monkeys.com
      git_type: github
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

Replace `hetzner-iac` / `provider: hetzner` with the matching `*-iac` repo and provider folder (`aws`, `cloudflare`, …).

**Reading outputs from a caller job:**

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    # ... with / secrets ...

  follow_up:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ needs.deploy.outputs.server_ip }}"
      - run: echo "${{ needs.deploy.outputs.resource_id }}"
      - run: echo "${{ needs.deploy.outputs.address }}"
      - run: echo "${{ needs.deploy.outputs.container_name }}"
```

`actor_id` and `actor_name` for Snow notify/health come from `github.actor_id` and `github.actor` — there are no caller inputs for them.

---

## Workflow inputs

| Input | Type | Default | Applies to | Description |
|---|---|---|---|---|
| `provider` | string | `hetzner` | all | Cloud folder under `v1/modules/dev/` (`hetzner`, `aws`, `cloudflare`, `civo`, `gcp`, `digitalocean`) |
| `type` | string | `server` | all | `server`, `resource`, `docker_compose`, `docker_compose_app` |
| `resource` | string | `''` | `server`, `resource` | Module folder. If empty, resolve from `list-of-resources.md` for that provider + type |
| `name` | string | `snow-server` | all | Snow resource name. Also passed as `TF_VAR_name` when the module has `name` |
| `snow_host_url` | string | `https://api.snow-monkeys.com` | all | Snow API base URL; bare IPs get `https://` prepended |
| `git_type` | string | `github` | all | Git provider sent to Snow |
| `host` | string | `''` | compose types | SSH target — IP, hostname, or Snow service name. Empty skips resolution |
| `server_type` | string | provider default | `server` | Size / SKU (`TF_VAR_server_type` or provider equivalent) |
| `image` | string | provider default | `server` | OS image slug |
| `location` | string | provider default | `server` | Region / datacenter (`location`, `region`, or `zone`) |
| `destroy` | boolean | `false` | `server`, `resource` | Destroy the Terraform module instead of creating it |
| `environment` | string | `''` | all | GitHub environment name (optional) |
| `expected_url` | string | `''` | compose types | `hostname:port` reported to Snow |
| `health_url` | string | `''` | `docker_compose_app` | Non-empty queues a Snow liveness probe after APPLICATION notify |

### `host`

Used only for compose types. Default is empty so omitting `host` skips `get_resource_name`.

| Value | Behaviour |
|---|---|
| Empty | Resolution step skipped |
| IP (`1.2.3.4`) | Used directly for SSH |
| Name (`my-service`) | Resolved via Snow API before SSH |

```
GET {snow_host_url}/connectors/get-snow-url?snowName={host}&actorId={github.actor_id}&gitType={git_type}
Authorization: Bearer {snow_token}
```

`http://` / `https://` prefixes are stripped before SSH.

### `expected_url`

Format: `hostname:port` or `ip:port`. Optional on both compose types. IP host parts pass through; hostname parts are replaced with the resolved `host`. Used as Snow `url` when `address` is empty.

### `health_url`

Only `docker_compose_app`. Default `''` skips liveness.

### `provider` + `resource`

Module path:

```
v1/modules/dev/${provider}/${resource || list-of-resources default}/
```

| Provider | Type | Default `resource` folder |
|---|---|---|
| `hetzner` | `server` | `hcloud_server` |
| `hetzner` | `resource` | `hcloud_firewall` |
| `cloudflare` | `resource` | `dns` |
| `aws` | `resource` | `aws_s3_bucket` |
| `digitalocean` | `server` | `droplet` |
| `gcp` | `server` | `compute` |
| `civo` | `resource` | `bucket` |

Set `resource` explicitly when a provider has more than one folder of the same type.

### Server shape inputs (`server_type`, `image`, `location`)

Used when `type` is `server`. Passed as `TF_VAR_*`. Names stay generic; each module maps them to its own variables (`server_type` / `droplet_size` / `machine_type`, `location` / `region` / `zone`). Ignored for `resource` and compose types.

---

## Secrets

Pass secrets under the job `secrets:` block.

### Shared

| Secret | Required for | Description |
|---|---|---|
| `snow_token` | all types | Snow API Bearer token |
| `snow_github_token` | all types | Clone `iac-terraform` on the runner; clone private repos on the remote |
| `ssh_public_key` | `server`, compose | Public SSH key |
| `ssh_private_key` | `server`, compose | Private SSH key (ed25519). Not required for resource-only apply or destroy |
| `env_values` | optional (`server`, compose) | Remote `.env` before `init.sh`. Unused by resource modules |

### Provider credentials (`server` and `resource`)

| Provider | Secret(s) | Terraform mapping |
|---|---|---|
| `hetzner` | `hcloud_token` | `TF_VAR_hcloud_token` |
| `aws` | `aws_access_key_id`, `aws_secret_access_key` | AWS provider env / `TF_VAR_*` |
| `cloudflare` | `cloudflare_api_key` (and email / zone as required) | `TF_VAR_cloudflare_api_key`, `TF_VAR_cloudflare_email`, `TF_VAR_cloudflare_zone_id` |
| `civo` | `civo_token` | `TF_VAR_civo-token` |
| `digitalocean` | `digitalocean_token` | `TF_VAR_digitalocean_token` |
| `gcp` | project credentials | `GOOGLE_CREDENTIALS` / provider block |

### `env_values` format

```
DATABASE_URL=postgres://...
API_KEY=abc123
PORT=3000
```

---

## Required inputs and secrets by type

### `type: server`

| | Required |
|---|---|
| **Inputs** | `provider`, `name` (recommended); `resource` if more than one server module |
| **Secrets** | provider token(s), `ssh_public_key`, `ssh_private_key`, `snow_token`, `snow_github_token` |
| **Destroy** | provider token(s), `snow_github_token`, `snow_token` (no SSH) |

### `type: resource`

| | Required |
|---|---|
| **Inputs** | `provider`, `name` (recommended); `resource` if more than one resource module |
| **Secrets** | provider token(s), `snow_token`, `snow_github_token` |

### `type: docker_compose`

| | Required |
|---|---|
| **Inputs** | `host`, `name` (recommended) |
| **Secrets** | `ssh_public_key`, `ssh_private_key`, `snow_token`, `snow_github_token` |
| **Optional** | `expected_url` |

### `type: docker_compose_app`

| | Required |
|---|---|
| **Inputs** | `host`, `name` (recommended) |
| **Secrets** | `ssh_public_key`, `ssh_private_key`, `snow_token`, `snow_github_token` |
| **Optional** | `health_url`, `expected_url` |

---

## Workflow outputs

| Output | Type | Set when | Source | Description |
|---|---|---|---|---|
| `server_ip` | string | `type: server` | Terraform public address | Host IPv4 / public IP |
| `resource_id` | string | `type: resource` | Terraform primary id | Firewall, bucket, DNS record, … |
| `address` | string | compose types | compose action | SSH host used for deployment |
| `container_name` | string | compose types | `init.sh` stdout | Container name from caller `infra/init.sh` |

Outputs not applicable to the current `type` are empty strings.

### Output usage internally

| Output | Consumed by |
|---|---|
| `server_ip` | `snow_notify_server_or_resource` → Snow `url` (`CLUSTER`) |
| `resource_id` | `snow_notify_server_or_resource` → Snow `url` (`CLUSTER`) |
| `address` | service / application notify → Snow `url` (`expected_url` fallback) |
| `container_name` | service / application notify → Snow `image` |

---

## Terraform module inputs and outputs

Set locally with `TF_VAR_*` or a gitignored `terraform.tfvars`. The workflow maps the common subset above; extra module variables are not workflow inputs unless a provider workflow adds them.

### Hetzner hcloud_server — `v1/modules/dev/hetzner/hcloud_server`

| Name | Type | Default | Sensitive |
|---|---|---|---|
| `hcloud_token` | string | — | yes |
| `ssh_public_key` | string | — | yes |
| `name` | string | `CX23` | no |
| `server_type` | string | `cx23` | no |
| `image` | string | `ubuntu-24.04` | no |
| `location` | string | `hel1` | no |
| `ipv4_enabled` | bool | `true` | no |
| `ipv6_enabled` | bool | `false` | no |

Outputs: `server_id`, `server_ipv4` → workflow `server_ip`, `server_status`.

### Hetzner hcloud_firewall — `v1/modules/dev/hetzner/hcloud_firewall`

| Name | Type | Default | Sensitive |
|---|---|---|---|
| `hcloud_token` | string | — | yes |
| `name` | string | `snow-firewall` | no |
| `labels` | `map(string)` | `{ managed_by = "terraform" }` | no |
| `rules` | list of objects | ICMP + TCP 22/80/443 | no |
| `apply_to` | list of objects | `[]` | no |

Outputs: `firewall_id` → workflow `resource_id`, `firewall_name`, `firewall_rules`.

### Cloudflare DNS — `v1/modules/dev/cloudflare/dns`

| Name | Type | Default | Sensitive |
|---|---|---|---|
| `cloudflare_email` | string | — | no |
| `cloudflare_api_key` | string | — | yes |
| `cloudflare_zone_id` | string | — | no |
| `cloudflare_record_name` | string | `*.connectorsapp.com` | no |

Creates `cloudflare_record` (A) and a Kubernetes secret for the API key. Treat as `type: resource`.

### DigitalOcean droplet — `v1/modules/dev/digitalocean/droplet`

| Name | Type | Default | Sensitive |
|---|---|---|---|
| `digitalocean_token` | string | — | yes |
| `region` | string | `nyc3` | no |
| `droplet_name` | string | `web-server` | no |
| `droplet_size` | string | `s-1vcpu-1gb` | no |
| `droplet_image` | string | `ubuntu-22-04-x64` | no |

Output: `droplet_ip` → workflow `server_ip`.

### AWS S3 — `v1/modules/dev/aws/aws_s3_bucket`

Listed in `list-of-resources.md`. Module files are created by `master-aws.md`. Treat as `type: resource`; map the bucket id to `resource_id`.

---

## Quick reference matrix

| Input / secret | `server` | `resource` | `docker_compose` | `docker_compose_app` |
|---|---|---|---|---|
| `provider` | ✓ | ✓ | optional | optional |
| `resource` | if ambiguous | if ambiguous | — | — |
| provider token(s) | ✓ | ✓ | — | — |
| `ssh_public_key` | ✓ | — | ✓ | ✓ |
| `ssh_private_key` | ✓ | — | ✓ | ✓ |
| `snow_token` | ✓ | ✓ | ✓ | ✓ |
| `snow_github_token` | ✓ | ✓ | ✓ | ✓ |
| `env_values` | optional | — | optional | optional |
| `host` | — | — | ✓ | ✓ |
| `expected_url` | — | — | optional | optional |
| `health_url` | — | — | — | optional |
| `server_type` / `image` / `location` | ✓ | — | — | — |
| `destroy` | optional | optional | — | — |

| Output | `server` | `resource` | `docker_compose` | `docker_compose_app` |
|---|---|---|---|---|
| `server_ip` | ✓ | — | — | — |
| `resource_id` | — | ✓ | — | — |
| `address` | — | — | ✓ | ✓ |
| `container_name` | — | — | ✓ | ✓ |

---

## Example: chain server then deploy

```yaml
jobs:
  provision:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      provider: hetzner
      type: server
      name: my-cluster
    secrets:
      hcloud_token: ${{ secrets.HCLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}

  deploy_app:
    needs: provision
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-app
      host: ${{ needs.provision.outputs.server_ip }}
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

---

## Related docs

- [FLOW.md](FLOW.md) — how inputs drive workflow logic
- [EXAMPLES.md](EXAMPLES.md) — caller workflow and local Terraform examples
- [INTERNAL.md](INTERNAL.md) — module files and action internals
- [NAMING.md](NAMING.md) — snake_case conventions
- [TERRAFORM_COMPLIANCE.md](TERRAFORM_COMPLIANCE.md) — checkout vs this spec
