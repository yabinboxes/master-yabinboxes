# AWS S3 bucket

Creates the Amazon S3 bucket used as remote Terraform state for every project under `v1/modules/dev/`. Also enables versioning, AES256 encryption, and a public-access block.

**Path:** `v1/modules/dev/aws/aws_s3_bucket`

Apply this project first (local state), then migrate it into itself. Other modules init against this bucket. See [BACKEND_S3.md](../../BACKEND_S3.md).

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `aws_s3_bucket` | `this` | Bucket named `var.name`. Tagged `managed_by=terraform` and `purpose=terraform-state`. |
| `aws_s3_bucket_versioning` | `this` | Versioning `Enabled` so state history is kept. |
| `aws_s3_bucket_server_side_encryption_configuration` | `this` | SSE-S3 (`AES256`). |
| `aws_s3_bucket_public_access_block` | `this` | All four public-access blocks on. |

Provider `hashicorp/aws` `~> 6.0`. Credentials: `TF_VAR_aws_access_key_id` / `TF_VAR_aws_secret_access_key`. Region: `TF_VAR_region`. The S3 backend block in `backend.tf` is empty and is filled at init.

```
main.tf        # provider, bucket, versioning, encryption, public-access block
variables.tf   # inputs
outputs.tf     # bucket_id, bucket_arn, bucket_region
backend.tf     # backend "s3" {}
```

`force_destroy` defaults to `false`. This module does not add a bucket policy or lifecycle rules.

## Usage

Do not pass `-var` or commit `terraform.tfvars`. Set inputs with `TF_VAR_*` ([TERRAFORM_RULES.md](../../TERRAFORM_RULES.md)).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="my-unique-bucket"
export TF_VAR_region="us-east-1"
export TF_STATE_BUCKET="$TF_VAR_name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_s3_bucket/terraform.tfstate"
export TF_STATE_REGION="$TF_VAR_region"
export TF_STATE_ENCRYPT="true"

terraform init -backend=false
terraform apply
terraform init -migrate-state \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

Then init other modules with the same `TF_STATE_BUCKET` / `TF_STATE_REGION` and a unique `TF_STATE_KEY_PREFIX` per project.

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. `TF_VAR_aws_access_key_id`. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. `TF_VAR_aws_secret_access_key`. |
| `name` | no | `snow-backup` | no | Globally unique bucket name. |
| `region` | no | `us-east-1` | no | Bucket region. Must match `TF_STATE_REGION`. |
| `force_destroy` | no | `false` | no | Allow destroy when the bucket is not empty. |
| `tags` | no | `{}` | no | Extra tags (JSON in the env var). |

## Outputs

| Name | Source | Description |
|---|---|---|
| `bucket_id` | `aws_s3_bucket.this.id` | Bucket name (workflow `resource_id`). |
| `bucket_arn` | `.arn` | Bucket ARN. |
| `bucket_region` | `.bucket_region` | Region. |

```bash
terraform output -raw bucket_id
```

## Docs

- [aws_s3_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)
- [S3 remote state](../../BACKEND_S3.md)
