# Cloudflare R2 bucket

Creates a Cloudflare R2 object-storage bucket.

**Path:** `v1/modules/dev/cloudflare/cloudflare_r2_bucket`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `cloudflare_r2_bucket` | `this` | R2 bucket named `var.name` in `account_id`. |

Provider `cloudflare/cloudflare` `~> 5.0`. Auth is `TF_VAR_cloudflare_api_token`. Empty `location` becomes `null`. Storage class default `Standard`. Use this bucket name as `TF_VAR_bucket` for `cloudflare_pipeline_sink`.

```
main.tf        # provider, R2 bucket
variables.tf   # inputs
outputs.tf     # r2_bucket_id, r2_bucket_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_account_id="..."
export TF_VAR_name="snow-r2-bucket"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/cloudflare_r2_bucket/terraform.tfstate"
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
terraform output -raw r2_bucket_name
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_api_token` | yes | — | yes | API token. |
| `account_id` | yes | — | no | Cloudflare account ID. |
| `name` | no | `snow-r2-bucket` | no | Bucket name. |
| `location` | no | `""` | no | Empty omits. |
| `storage_class` | no | `Standard` | no | Storage class. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `r2_bucket_id` | `cloudflare_r2_bucket.this.id` | ID (workflow `resource_id`). |
| `r2_bucket_name` | `.name` | Name. |

## Docs

- [cloudflare_r2_bucket](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/r2_bucket)
