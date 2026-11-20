# GCP Cloud Storage bucket

Creates a Cloud Storage bucket with uniform bucket-level access on by default.

**Path:** `v1/modules/dev/gcp/google_storage_bucket`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_storage_bucket` | `this` | Bucket named `var.name` (globally unique). |

Provider `hashicorp/google` `~> 8.0`. Provider `region` is separate from bucket `location` (default `US`). Storage class default `STANDARD`. `force_destroy` defaults to `false`. Labels merge `managed_by=terraform`.

```
main.tf        # provider, bucket
variables.tf   # inputs
outputs.tf     # bucket_id, bucket_name, bucket_url
backend.tf     # backend "s3" {}
```

Upload objects with `google_storage_bucket_object`.

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_project="your-gcp-project"
export TF_VAR_name="snow-gcs-bucket"
export TF_VAR_location="US"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/google_storage_bucket/terraform.tfstate"
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
terraform output -raw bucket_name
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `project` | yes | — | no | GCP project ID. |
| `credentials` | no | `""` | yes | SA JSON. Empty uses ADC. |
| `name` | no | `snow-gcs-bucket` | no | Globally unique bucket name. |
| `region` | no | `us-central1` | no | Provider region. |
| `location` | no | `US` | no | Bucket location. |
| `force_destroy` | no | `false` | no | Destroy with objects. |
| `uniform_bucket_level_access` | no | `true` | no | UBLA. |
| `storage_class` | no | `STANDARD` | no | Storage class. |
| `labels` | no | `{}` | no | Extra labels. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `bucket_id` | `google_storage_bucket.this.id` | Bucket ID. |
| `bucket_name` | `.name` | Name. |
| `bucket_url` | `.url` | `gs://` URL. |

## Docs

- [google_storage_bucket](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket)
