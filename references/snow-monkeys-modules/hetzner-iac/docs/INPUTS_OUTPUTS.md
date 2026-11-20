# Inputs, secrets, and outputs

Reference for `.github/workflows/main.yml` `workflow_call` interface. For logic flow see [FLOW.md](FLOW.md). For full caller examples see [EXAMPLES.md](EXAMPLES.md).

All keys use **snake_case**. See [NAMING.md](NAMING.md).

---

## Calling the workflow

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
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
      - run: echo "${{ needs.deploy.outputs.address }}"
      - run: echo "${{ needs.deploy.outputs.container_name }}"
```

`actor_id` and `actor_name` for Snow notify/health are taken from `github.actor_id` and `github.actor` automatically — there are no caller inputs for them.

---

## Inputs

| Input | Type | Default | Applies to | Description |
|---|---|---|---|---|
| `type` | string | `hcloud_server` | all | Deployment type: `hcloud_server`, `resource`, `docker_compose`, `docker_compose_app` (other values run Terraform + RESOURCE notify) |
| `name` | string | `snow-server` | all | Snow resource name; also the first segment of `TF_STATE_KEY_PREFIX` |
| `snow_host_url` | string | `https://api.snow-monkeys.com` | all | Snow API base URL; bare IPs get `https://` prepended during host resolution |
| `git_type` | string | `github` | all | Git provider sent to Snow; also used in `TF_STATE_KEY_PREFIX` |
| `provider` | string | `hetzner` | all | Cloud provider label sent to Snow |
| `resource` | string | `''` | terraform types | Terraform module folder under `iac-terraform/v1/modules/dev/hetzner/`. Empty → same value as `type`. |
| `infra` | string | `infra` | all | Caller-repo directory copied to the remote host |
| `host` | string | `snow-server` | `docker_compose`, `docker_compose_app` | SSH target — IP, hostname, or Snow service name (resolved via API when not an IP) |
| `type_values` | string | `''` | terraform types | `KEY=VALUE` lines written with `env_values` as `.env` and exported as `TF_VAR_*`. This is how `name`, `server_type`, `image`, `location`, and other module variables reach Terraform. |
| `state_values` | string | `''` | terraform types | `KEY=VALUE` lines written to `.env` and exported as `TF_VAR_*`. `region` is the S3 backend region when `s3_bucket_state` is set. |
| `s3_bucket_state` | string | `''` | terraform types | S3 bucket for Terraform remote state. Empty → remove `backend.tf` and `terraform init`. |
| `enable_generate_ssh_key` | boolean | `false` | terraform types | Forwarded to `server-resource` |
| `destroy` | boolean | `false` | terraform types | When `true`, destroys the server instead of creating it |
| `environment` | string | `''` | all | GitHub environment name (optional) |
| `expected_url` | string | `''` | `docker_compose`, `docker_compose_app` | `hostname:port` reported to Snow; hostname replaced with resolved host, port kept |
| `health_url` | string | `''` | `docker_compose_app` | When non-empty, queues a liveness probe in Snow after APPLICATION notify |
| `test_flag` | boolean | `false` | all | On `server-resource`, `true` runs Terraform destroy after provision |

### Input details

#### `host`

Used only when `type` is `docker_compose` or `docker_compose_app`.

| Value | Behaviour |
|---|---|
| Empty | Resolution step skipped |
| IP (`1.2.3.4`) | Used directly for SSH |
| Name (`my-service`) | Resolved via Snow API before SSH |

Resolution API:

```
GET {snow_host_url}/connectors/get-snow-url?snowName={host}&actorId={github.actor_id}&gitType={git_type}
Authorization: Bearer {snow_token}
```

`http://` / `https://` prefixes are stripped in composite actions before SSH.

#### `expected_url`

Format: `hostname:port` or `ip:port`.

| Host part | Behaviour |
|---|---|
| IP | Passed through unchanged |
| Hostname | Hostname replaced with resolved `host`; port unchanged |

Used as Snow notify `url` fallback when deployment `address` output is empty.

#### `health_url`

Only affects `docker_compose_app`. Default `''` skips `snow_livenessprobe_application`. Any non-empty value queues a health check in Snow after notify.

#### Terraform fields (`name`, `server_type`, `image`, `location`)

These are not workflow inputs. Pass them in `type_values` so they are exported as `TF_VAR_*`. Workflow `name` is only the Snow resource name and the first segment of `TF_STATE_KEY_PREFIX`. `hcloud_token` and `ssh_public_key` are still set directly as `TF_VAR_hcloud_token` and `TF_VAR_ssh_public_key`. See [README.md](../README.md#server-options) for valid server types, images, and locations.

`destroy` is a workflow input. It is ignored when `type` is `docker_compose` or `docker_compose_app`.

#### `s3_bucket_state` and `state_values`

Used by `server-resource` for Terraform remote state.

| `s3_bucket_state` | `terraform init` |
|---|---|
| Empty | Remove `backend.tf`, then `terraform init` (local state). `plan` is skipped. |
| Set | `-reconfigure -backend-config` for `bucket`, `key`, `region`, and `encrypt=true` |

`TF_STATE_KEY_PREFIX` is `{name}/{git_type}/{actor_id}/{sha}`.

`state_values` must include the backend region when the bucket is set:

```
region=us-east-1
```

`encrypt` is always `true` on that init. It is not read from `state_values`. If the bucket is set and `region` is missing, init fails. The S3 backend uses `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from the workflow secrets.

`env_values`, `type_values`, and `state_values` are written to the Terraform module `.env` and exported as `TF_VAR_KEY` for later plan/apply/destroy steps.

---

## Secrets

Pass all secrets under the job `secrets:` block when calling this workflow.

| Secret | Required for | Description |
|---|---|---|
| `ssh_public_key` | all types | SSH public key added to the remote server |
| `ssh_private_key` | all types | SSH private key for remote connection (ed25519) |
| `snow_token` | all types | Snow API Bearer token — host resolution, notify, and health |
| `snow_github_token` | all types | GitHub token for cloning private repos on the remote host |
| `env_values` | optional | `.env` contents written on the remote before `init.sh` runs |
| `hcloud_token` | terraform types | Hetzner Cloud API token for Terraform |
| `aws_access_key_id` | when `s3_bucket_state` is set | AWS access key for the S3 backend (`AWS_ACCESS_KEY_ID`) |
| `aws_secret_access_key` | when `s3_bucket_state` is set | AWS secret key for the S3 backend (`AWS_SECRET_ACCESS_KEY`) |

### `env_values` format

Newline-separated `KEY=VALUE` pairs:

```
DATABASE_URL=postgres://...
API_KEY=abc123
PORT=3000
```

---

## Required inputs and secrets by type

### `type: hcloud_server` or `resource`

| | Required |
|---|---|
| **Inputs** | `name` (recommended). Pass Terraform `name`, `server_type`, `image`, and `location` in `type_values` |
| **Secrets** | `hcloud_token`, `ssh_public_key`, `ssh_private_key`, `snow_token`, `snow_github_token`; `aws_access_key_id` and `aws_secret_access_key` when `s3_bucket_state` is set |

### `type: docker_compose`

| | Required |
|---|---|
| **Inputs** | `host`, `name` (recommended) |
| **Secrets** | `ssh_public_key`, `ssh_private_key`, `snow_token`, `snow_github_token` |

### `type: docker_compose_app`

| | Required |
|---|---|
| **Inputs** | `host`, `name` (recommended) |
| **Secrets** | `ssh_public_key`, `ssh_private_key`, `snow_token`, `snow_github_token` |
| **Optional inputs** | `health_url`, `expected_url` |

---

## Outputs

Workflow-level outputs exposed to callers:

| Output | Type | Set when | Source | Description |
|---|---|---|---|---|
| `server_ip` | string | `type: hcloud_server`, `resource`, or other non-compose | Terraform / server-resource action | Public IP of the provisioned Hetzner server |
| `terraform_output` | string | same as `server_ip` | `terraform output -json` | Terraform outputs as one-line JSON |
| `terraform_vars` | string | same as `server_ip` | `TF_VAR_*` on the apply step | Non-secret Terraform variables as one-line JSON |
| `address` | string | `type: docker_compose` or `docker_compose_app` | docker-compose action | SSH host used for deployment (resolved `host`) |
| `container_name` | string | `type: docker_compose` or `docker_compose_app` | `init.sh` stdout on remote | Container name printed by caller's `infra/init.sh` |
| `docker_output` | string | `type: docker_compose` or `docker_compose_app` | `docker logs` of that container | One-line JSON `{"container_name":"...","logs":"..."}` |
| `docker_vars` | string | `type: docker_compose` or `docker_compose_app` | Compose file under `infra/` | Service fields (`image`, `container_name`, `ports`, and the rest) as one-line JSON |

Outputs not applicable to the current `type` are empty strings.

### Output usage internally

| Output | Consumed by |
|---|---|
| `server_ip` | `snow_notify_server` → Snow `url` (`CLUSTER`); `snow_notify_resource` → Snow `url` (`RESOURCE`) |
| `terraform_vars` | `snow_notify_server` / `snow_notify_resource` → Snow `terraform_vars` field |
| `address` | `snow_notify_service` / `snow_notify_application` → Snow `url` (with `expected_url` fallback) |
| `container_name` | `snow_notify_service` / `snow_notify_application` → Snow `image` field |
| `docker_output` | `snow_notify_service` / `snow_notify_application` → Snow `dockerOutput` field |
| `docker_vars` | `snow_notify_service` / `snow_notify_application` → Snow `dockerVars` field |

### Example: chain server then deploy

```yaml
jobs:
  provision:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
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

## Quick reference matrix

| Input / secret | `hcloud_server` | `resource` | `docker_compose` | `docker_compose_app` |
|---|---|---|---|---|
| `hcloud_token` | ✓ | ✓ | — | — |
| `aws_access_key_id` | when `s3_bucket_state` is set | when `s3_bucket_state` is set | — | — |
| `aws_secret_access_key` | when `s3_bucket_state` is set | when `s3_bucket_state` is set | — | — |
| `ssh_public_key` | ✓ | ✓ | ✓ | ✓ |
| `ssh_private_key` | ✓ | ✓ | ✓ | ✓ |
| `snow_token` | ✓ | ✓ | ✓ | ✓ |
| `snow_github_token` | ✓ | ✓ | ✓ | ✓ |
| `env_values` | optional | optional | optional | optional |
| `host` | — | — | ✓ | ✓ |
| `expected_url` | — | — | optional | optional |
| `health_url` | — | — | — | optional |
| `type_values` | optional (`name`, `server_type`, `image`, `location`, other module vars) | optional | — | — |
| `state_values` | optional | optional | — | — |
| `s3_bucket_state` | optional | optional | — | — |
| `destroy` | optional | optional | — | — |
| `test_flag` | optional | optional | optional | optional |

| Output | `hcloud_server` | `resource` | `docker_compose` | `docker_compose_app` |
|---|---|---|---|---|
| `server_ip` | ✓ | ✓ | — | — |
| `terraform_output` | ✓ | ✓ | — | — |
| `terraform_vars` | ✓ | ✓ | — | — |
| `address` | — | — | ✓ | ✓ |
| `container_name` | — | — | ✓ | ✓ |
| `docker_output` | — | — | ✓ | ✓ |
| `docker_vars` | — | — | ✓ | ✓ |

---

## Related docs

- [FLOW.md](FLOW.md) — how inputs drive workflow logic
- [EXAMPLES.md](EXAMPLES.md) — full caller workflow examples
- [README.md](../README.md) — Hetzner server options (types, images, locations)
- [NAMING.md](NAMING.md) — snake_case conventions
