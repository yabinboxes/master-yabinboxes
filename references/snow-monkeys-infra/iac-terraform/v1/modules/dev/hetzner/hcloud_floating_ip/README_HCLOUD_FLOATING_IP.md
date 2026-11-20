# Hetzner Cloud floating IP

Creates a Hetzner Cloud floating IP. Optionally assigns it to a server on create.

**Path:** `v1/modules/dev/hetzner/hcloud_floating_ip`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_floating_ip` | `this` | Floating IP of `type` (`ipv4` or `ipv6`). |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. If `server_id` is set, the IP is assigned to that server and `home_location` is omitted. If `server_id` is null, `home_location` is used (default `hel1`). Empty `description` becomes `null`.

```
main.tf        # provider, floating IP
variables.tf   # inputs
outputs.tf     # floating_ip_id, ip_address, floating_ip_name, home_location
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="snow-floating-ip"
export TF_VAR_type="ipv4"
export TF_VAR_home_location="hel1"
# optional assign:
# export TF_VAR_server_id="$(terraform -chdir=../hcloud_server output -raw server_id)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_floating_ip/terraform.tfstate"
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
terraform output -raw ip_address
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `type` | no | `ipv4` | no | `ipv4` or `ipv6`. |
| `name` | no | `snow-floating-ip` | no | Name. |
| `home_location` | no | `hel1` | no | Used when `server_id` is unset. |
| `server_id` | no | `null` | no | Assign on create. |
| `description` | no | `""` | no | Empty omits. |
| `labels` | no | `{ managed_by = "terraform" }` | no | Labels. |
| `delete_protection` | no | `false` | no | Block delete in the API. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `floating_ip_id` | `hcloud_floating_ip.this.id` | ID. |
| `ip_address` | `.ip_address` | Address. |
| `floating_ip_name` | `.name` | Name. |
| `home_location` | `.home_location` | Home location. |

## Docs

- [hcloud_floating_ip](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/floating_ip)
