# Hetzner Cloud network

Creates a private Hetzner Cloud network. It does not create a subnet.

**Path:** `v1/modules/dev/hetzner/hcloud_network`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_network` | `this` | Private network with `ip_range` (default `10.0.0.0/16`). |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. Labels default to `{ managed_by = "terraform" }`. `delete_protection` and `expose_routes_to_vswitch` default to `false`.

```
main.tf        # provider, network
variables.tf   # inputs
outputs.tf     # network_id, network_name, ip_range
backend.tf     # backend "s3" {}
```

Add a subnet in Hetzner (or another module) before attaching servers.

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="snow-network"
export TF_VAR_ip_range="10.0.0.0/16"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_network/terraform.tfstate"
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
terraform output -raw network_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `name` | no | `snow-network` | no | Network name. |
| `ip_range` | no | `10.0.0.0/16` | no | RFC1918 CIDR. |
| `labels` | no | `{ managed_by = "terraform" }` | no | Labels. |
| `delete_protection` | no | `false` | no | Block delete in the API. |
| `expose_routes_to_vswitch` | no | `false` | no | Expose routes to a vSwitch. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `network_id` | `hcloud_network.this.id` | Network ID. |
| `network_name` | `.name` | Name. |
| `ip_range` | `.ip_range` | CIDR. |

## Docs

- [hcloud_network](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/network)
