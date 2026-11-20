# Hetzner Cloud server

Creates a Hetzner Cloud server and uploads an SSH public key for access.

**Path:** `v1/modules/dev/hetzner/hcloud_server`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_ssh_key` | `yabin` | Uploads `ssh_public_key`. Named `${var.name}key`. |
| `hcloud_server` | `cx23` | Server with public networking and that SSH key attached. |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. Labels are hardcoded `{ managed_by = "terraform" }`. Public IPv4 is on by default; IPv6 is off. The resource local name `cx23` is fixed even if `server_type` changes.

```
main.tf        # provider, SSH key, server
variables.tf   # inputs
outputs.tf     # server_id, server_ipv4, server_status
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md) (AWS keys for S3, Hetzner token for the provider). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
# optional:
# export TF_VAR_name="dev-box"
# export TF_VAR_server_type="cx23"
# export TF_VAR_location="hel1"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_server/terraform.tfstate"
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
ssh root@$(terraform output -raw server_ipv4)
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | Hetzner Cloud API token. |
| `ssh_public_key` | yes | — | yes | Public key uploaded and attached. |
| `name` | no | `CX23` | no | Server name. SSH key is `${name}key`. |
| `server_type` | no | `cx23` | no | Plan, e.g. `cx22`, `cx23`, `cx33`. |
| `image` | no | `ubuntu-24.04` | no | OS image. |
| `location` | no | `hel1` | no | Datacenter (`hel1`, `nbg1`, `fsn1`, `ash`, `hil`). |
| `ipv4_enabled` | no | `true` | no | Public IPv4. |
| `ipv6_enabled` | no | `false` | no | Public IPv6. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `server_id` | `hcloud_server.cx23.id` | Server ID. |
| `server_ipv4` | `.ipv4_address` | Public IPv4. Empty if IPv4 is off. |
| `server_status` | `.status` | Status (`running`, `off`, …). |

## Docs

- [hcloud_server](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/server)
- [hcloud_ssh_key](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/ssh_key)
- [Overview](../../../../../docs/modules/hetzner-hcloud-server.md)
- [Inputs](../../../../../docs/modules/hetzner-hcloud-server/inputs.md)
- [Outputs](../../../../../docs/modules/hetzner-hcloud-server/outputs.md)
