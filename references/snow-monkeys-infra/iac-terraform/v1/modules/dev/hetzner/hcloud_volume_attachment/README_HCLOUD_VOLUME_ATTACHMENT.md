# Hetzner Cloud volume attachment

Attaches an existing Hetzner volume to an existing server.

**Path:** `v1/modules/dev/hetzner/hcloud_volume_attachment`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_volume_attachment` | `this` | Links `volume_id` to `server_id`. |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. Both IDs are required numbers with no defaults. The volume and server must already exist (typically from `hcloud_volume` and `hcloud_server`) and share a location.

```
main.tf        # provider, attachment
variables.tf   # inputs
outputs.tf     # volume_attachment_id, volume_id, server_id
backend.tf     # backend "s3" {}
```

Use this when the volume was created without `server_id`. Creating a volume with `server_id` already attaches it.

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_volume_id="$(terraform -chdir=../hcloud_volume output -raw volume_id)"
export TF_VAR_server_id="$(terraform -chdir=../hcloud_server output -raw server_id)"
export TF_VAR_automount=false
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_volume_attachment/terraform.tfstate"
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
terraform output volume_attachment_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `volume_id` | yes | — | no | Volume to attach. |
| `server_id` | yes | — | no | Server to attach to. |
| `automount` | no | `false` | no | Automount on attach. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `volume_attachment_id` | `hcloud_volume_attachment.this.id` | Attachment ID. |
| `volume_id` | `.volume_id` | Volume ID. |
| `server_id` | `.server_id` | Server ID. |

## Docs

- [hcloud_volume_attachment](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/volume_attachment)
