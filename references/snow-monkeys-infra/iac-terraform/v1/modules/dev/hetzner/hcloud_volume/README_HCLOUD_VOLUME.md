# Hetzner Cloud volume

Creates a Hetzner Cloud block volume. Optionally attaches it to a server on create.

**Path:** `v1/modules/dev/hetzner/hcloud_volume`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_volume` | `this` | Volume of `size` GB. |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. If `server_id` is set, the volume is created attached and `location` is omitted (it must match the server). If `server_id` is null, `location` is used (default `hel1`). Empty `format` skips formatting. For attach-after-create, use `hcloud_volume_attachment` instead.

```
main.tf        # provider, volume
variables.tf   # inputs
outputs.tf     # volume_id, volume_name, linux_device, location
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="snow-volume"
export TF_VAR_size=10
export TF_VAR_location="hel1"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_volume/terraform.tfstate"
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
terraform output -raw volume_id
terraform output -raw linux_device
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `name` | no | `snow-volume` | no | Volume name. |
| `size` | no | `10` | no | Size in GB. |
| `location` | no | `hel1` | no | Used when `server_id` is unset. |
| `server_id` | no | `null` | no | Attach on create. |
| `automount` | no | `false` | no | Automount when attached. |
| `format` | no | `""` | no | `xfs` or `ext4`. Empty skips format. |
| `labels` | no | `{ managed_by = "terraform" }` | no | Labels. |
| `delete_protection` | no | `false` | no | Block delete in the API. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `volume_id` | `hcloud_volume.this.id` | Volume ID. |
| `volume_name` | `.name` | Name. |
| `linux_device` | `.linux_device` | Device path on the server. |
| `location` | `.location` | Location. |

## Docs

- [hcloud_volume](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/volume)
