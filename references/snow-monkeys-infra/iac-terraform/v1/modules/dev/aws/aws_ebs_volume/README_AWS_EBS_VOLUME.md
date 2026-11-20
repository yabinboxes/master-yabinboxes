# AWS EBS volume

Creates a standalone EBS volume. It does not attach the volume to an instance.

**Path:** `v1/modules/dev/aws/aws_ebs_volume`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `aws_ebs_volume` | `this` | Volume in `availability_zone`, size `size` GiB, type `volume_type`. |

Provider `hashicorp/aws` `~> 6.0`. Encryption is on by default. `iops`, `throughput`, `snapshot_id`, and `kms_key_id` are omitted when they are `0` or empty. Tags merge `managed_by=terraform`, `Name`, and `var.tags`.

```
main.tf        # provider, volume
variables.tf   # inputs
outputs.tf     # volume_id, volume_arn, availability_zone
backend.tf     # backend "s3" {}
```

`availability_zone` has no default; it must match the AZ of any instance you attach later.

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="snow-ebs"
export TF_VAR_availability_zone="us-east-1a"
export TF_VAR_size=20
export TF_VAR_volume_type="gp3"
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_ebs_volume/terraform.tfstate"
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
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. |
| `availability_zone` | yes | — | no | AZ, e.g. `us-east-1a`. |
| `name` | no | `snow-ebs` | no | Name tag. |
| `region` | no | `us-east-1` | no | Region. |
| `size` | no | `20` | no | Size GiB. |
| `volume_type` | no | `gp3` | no | Volume type. |
| `encrypted` | no | `true` | no | Encrypt the volume. |
| `iops` | no | `0` | no | `0` omits. |
| `throughput` | no | `0` | no | `0` omits (gp3). |
| `snapshot_id` | no | `""` | no | Optional snapshot. |
| `kms_key_id` | no | `""` | no | Optional KMS key. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `volume_id` | `aws_ebs_volume.this.id` | Volume ID. |
| `volume_arn` | `.arn` | ARN. |
| `availability_zone` | `.availability_zone` | AZ. |

## Docs

- [aws_ebs_volume](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ebs_volume)
