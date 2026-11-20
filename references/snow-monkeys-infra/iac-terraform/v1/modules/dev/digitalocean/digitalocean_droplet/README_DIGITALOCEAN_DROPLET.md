# DigitalOcean droplet

Creates a Droplet and, when `ssh_public_key` is set, an SSH key.

**Path:** `v1/modules/dev/digitalocean/digitalocean_droplet`

Prefer this project over the older [`droplet`](../droplet/README_DROPLET.md) demo.

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `digitalocean_ssh_key` | `this` | Created when `ssh_public_key` is non-empty. Named `${var.name}-key`. |
| `digitalocean_droplet` | `this` | Droplet. Size is `server_type`. SSH keys are the new key and/or `var.ssh_keys`. |

Provider `digitalocean/digitalocean` `~> 2.0`. Token: `TF_VAR_digitalocean_token`. Default image `ubuntu-24-04-x64`, size `s-1vcpu-1gb`, region `nyc3`. IPv6 off. Empty `user_data` is omitted. Tags default `["managed_by:terraform"]`.

```
main.tf        # provider, optional SSH key, droplet
variables.tf   # inputs
outputs.tf     # droplet_id, droplet_ip, droplet_status
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_digitalocean_token="..."
export TF_VAR_name="snow-droplet"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/digitalocean/digitalocean_droplet/terraform.tfstate"
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
ssh root@$(terraform output -raw droplet_ip)
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `digitalocean_token` | yes | — | yes | API token. |
| `name` | no | `snow-droplet` | no | Droplet name. |
| `region` | no | `nyc3` | no | Region. |
| `server_type` | no | `s-1vcpu-1gb` | no | Size slug. |
| `image` | no | `ubuntu-24-04-x64` | no | Image slug. |
| `ssh_public_key` | no | `""` | yes | Creates a key when set. |
| `ssh_keys` | no | `[]` | no | Existing key IDs / fingerprints. |
| `ipv6` | no | `false` | no | Enable IPv6. |
| `user_data` | no | `""` | no | Cloud-init. Empty omits. |
| `tags` | no | `["managed_by:terraform"]` | no | Tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `droplet_id` | `digitalocean_droplet.this.id` | Droplet ID. |
| `droplet_ip` | `.ipv4_address` | Public IPv4 (workflow `server_ip`). |
| `droplet_status` | `.status` | Status. |

## Docs

- [digitalocean_droplet](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet)
