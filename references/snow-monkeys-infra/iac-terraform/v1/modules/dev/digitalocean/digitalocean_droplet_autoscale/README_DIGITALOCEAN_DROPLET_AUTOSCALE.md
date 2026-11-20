# DigitalOcean droplet autoscale pool

Creates a Droplet autoscale pool from a template (size, region, image, SSH keys).

**Path:** `v1/modules/dev/digitalocean/digitalocean_droplet_autoscale`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `digitalocean_ssh_key` | `this` | Created when `ssh_public_key` is non-empty. |
| `digitalocean_droplet_autoscale` | `this` | Pool with min/max instances and CPU/memory targets. |

Provider `digitalocean/digitalocean` `~> 2.0`. Token: `TF_VAR_digitalocean_token`. `config` holds `min_instances` (1), `max_instances` (3), utilization targets `0.5`, and `cooldown_minutes` (5). `droplet_template` uses `server_type`, `region`, `image`, SSH fingerprints, tags, IPv6, droplet agent, and optional user_data.

```
main.tf        # provider, optional SSH key, autoscale pool
variables.tf   # inputs
outputs.tf     # droplet_autoscale_id, droplet_autoscale_status
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_digitalocean_token="..."
export TF_VAR_name="snow-autoscale"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
export TF_VAR_min_instances=1
export TF_VAR_max_instances=3
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

```bash
terraform output droplet_autoscale_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `digitalocean_token` | yes | — | yes | API token. |
| `name` | no | `snow-autoscale` | no | Pool name. |
| `min_instances` | no | `1` | no | Minimum Droplets. |
| `max_instances` | no | `3` | no | Maximum Droplets. |
| `target_cpu_utilization` | no | `0.5` | no | Target CPU 0–1. |
| `target_memory_utilization` | no | `0.5` | no | Target memory 0–1. |
| `cooldown_minutes` | no | `5` | no | Scale cooldown. |
| `server_type` | no | `s-1vcpu-1gb` | no | Size slug. |
| `region` | no | `nyc3` | no | Region. |
| `image` | no | `ubuntu-24-04-x64` | no | Image slug. |
| `ssh_public_key` | no | `""` | yes | Creates a key when set. |
| `ssh_keys` | no | `[]` | no | Existing fingerprints. |
| `tags` | no | `["managed_by:terraform"]` | no | Tags. |
| `ipv6` | no | `false` | no | Enable IPv6. |
| `with_droplet_agent` | no | `true` | no | Install the Droplet agent. |
| `user_data` | no | `""` | no | Cloud-init. Empty omits. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `droplet_autoscale_id` | `digitalocean_droplet_autoscale.this.id` | Pool ID (workflow `resource_id`). |
| `droplet_autoscale_status` | `.status` | Status when the API returns it. |

## Docs

- [digitalocean_droplet_autoscale](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet_autoscale)
