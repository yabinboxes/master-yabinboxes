# S3 remote state

Every project under `v1/modules/dev/` stores Terraform state in the bucket created by `aws/aws_s3_bucket`. Bucket, key, region, and encrypt are **not** hardcoded. Terraform cannot read env vars inside a `backend` block, so pass them at init:

```bash
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/<provider>/<resource>/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"
terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

- `TF_STATE_BUCKET` must match the name used when applying `aws/aws_s3_bucket` (`TF_VAR_name`).
- `TF_STATE_KEY_PREFIX` is the S3 object key for this project's state. Use a unique value per project so states do not overwrite each other.
- `TF_STATE_REGION` must match the bucket region (`TF_VAR_region` on the S3 module).
- `TF_STATE_ENCRYPT` is `true` or `false`.

## Bootstrap

1. Create the bucket (local state, once):

```bash
cd v1/modules/dev/aws/aws_s3_bucket
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="your-bucket-name"
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

2. Init any other module:

```bash
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/<provider>/<resource>/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"
cd v1/modules/dev/<provider>/<resource>
terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

If any of these env vars is unset, `terraform init` fails or prompts — there are no defaults in `backend.tf`.
