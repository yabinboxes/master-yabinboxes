# DigitalOcean droplet (legacy)

Older Droplet project with fewer options. Prefer [`digitalocean_droplet`](../digitalocean_droplet/README_DIGITALOCEAN_DROPLET.md).

**Path:** `v1/modules/dev/digitalocean/droplet`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `digitalocean_droplet` | `web` | Droplet named `var.droplet_name`. |

Provider `digitalocean/digitalocean` `2.54.0` (pinned). Token: `TF_VAR_digitalocean_token`. No SSH key, tags, IPv6, or user_data. Default image `ubuntu-22-04-x64`. Outputs live in `output.tf` (singular). Terraform `required_version` is `>= 0.13.0`.

```
provider.tf    # digitalocean provider
droplet.tf     # droplet
variables.tf   # inputs
output.tf      # droplet_ip
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_digitalocean_token="..."
export TF_VAR_droplet_name="web-server"
export TF_VAR_region="nyc3"
export TF_VAR_droplet_size="s-1vcpu-1gb"
export TF_VAR_droplet_image="ubuntu-22-04-x64"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/digitalocean/droplet/terraform.tfstate"
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
terraform output -raw droplet_ip
```

Without an SSH key this Droplet is only reachable if you add a key in the DigitalOcean account or console.

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `digitalocean_token` | yes | — | yes | API token. |
| `region` | no | `nyc3` | no | Region. |
| `droplet_name` | no | `web-server` | no | Droplet name. |
| `droplet_size` | no | `s-1vcpu-1gb` | no | Size slug. |
| `droplet_image` | no | `ubuntu-22-04-x64` | no | Image slug. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `droplet_ip` | `digitalocean_droplet.web.ipv4_address` | Public IPv4. |

## Docs

- [digitalocean_droplet](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet)
