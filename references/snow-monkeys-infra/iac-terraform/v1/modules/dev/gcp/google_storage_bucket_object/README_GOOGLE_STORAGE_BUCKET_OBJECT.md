# GCP Cloud Storage object

Uploads an object into an existing Cloud Storage bucket.

**Path:** `v1/modules/dev/gcp/google_storage_bucket_object`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_storage_bucket_object` | `this` | Object `name` in `bucket`. |

Provider `hashicorp/google` `~> 8.0`. The bucket is referenced by name only (create it with `google_storage_bucket`). Default content is the string `hello from terraform`. If `source` is set, that local file is uploaded and `content` should be left empty. Empty `content_type` / `cache_control` become `null`.

```
main.tf        # provider, object
variables.tf   # inputs
outputs.tf     # object_id, object_name, media_link
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_project="your-gcp-project"
export TF_VAR_bucket="snow-gcs-bucket"
export TF_VAR_name="hello.txt"
export TF_VAR_content="hello from terraform"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/google_storage_bucket_object/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

Upload a file instead of inline content:

```bash
export TF_VAR_content=""
export TF_VAR_source="./local-file.txt"
export TF_VAR_content_type="text/plain"
```

```bash
terraform output -raw media_link
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `project` | yes | — | no | GCP project ID. |
| `bucket` | yes | — | no | Existing bucket name. |
| `credentials` | no | `""` | yes | SA JSON. Empty uses ADC. |
| `name` | no | `hello.txt` | no | Object path. |
| `region` | no | `us-central1` | no | Provider region. |
| `content` | no | `hello from terraform` | no | Inline body. Conflicts with `source`. |
| `source` | no | `""` | no | Local file path. |
| `content_type` | no | `text/plain` | no | Empty omits. |
| `cache_control` | no | `""` | no | Empty omits. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `object_id` | `google_storage_bucket_object.this.id` | Object ID. |
| `object_name` | `.name` | Name. |
| `media_link` | `.media_link` | Download URL. |

## Docs

- [google_storage_bucket_object](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket_object)
