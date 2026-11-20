# Cloudflare Pipeline sink

Creates a Cloudflare Pipelines sink, defaulting to R2 with JSON format.

**Path:** `v1/modules/dev/cloudflare/cloudflare_pipeline_sink`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `cloudflare_pipeline_sink` | `this` | Sink named `var.name`. `type` is `sink_type` (default `r2`). |

Provider `cloudflare/cloudflare` `~> 5.0`. Auth is `TF_VAR_cloudflare_api_token`. `config` includes account (falls back to `account_id` if `config_account_id` is empty), R2 `bucket`, and R2 access keys. Optional `path` prefix. `format.type` defaults to `json`.

Create the R2 bucket with `cloudflare_r2_bucket` first. R2 API tokens are separate from the Cloudflare API token.

```
main.tf        # provider, pipeline sink
variables.tf   # inputs
outputs.tf     # pipeline_sink_id, pipeline_sink_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_account_id="..."
export TF_VAR_name="snow_sink"
export TF_VAR_bucket="snow-r2-bucket"
export TF_VAR_r2_access_key_id="..."
export TF_VAR_r2_secret_access_key="..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/cloudflare_pipeline_sink/terraform.tfstate"
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
terraform output -raw pipeline_sink_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_api_token` | yes | — | yes | Cloudflare API token. |
| `account_id` | yes | — | no | Cloudflare account ID. |
| `bucket` | yes | — | no | R2 bucket name. |
| `r2_access_key_id` | yes | — | yes | R2 access key. |
| `r2_secret_access_key` | yes | — | yes | R2 secret. |
| `name` | no | `snow_sink` | no | Sink name. |
| `sink_type` | no | `r2` | no | Sink type. |
| `config_account_id` | no | `""` | no | Empty uses `account_id`. |
| `path` | no | `""` | no | Optional prefix. |
| `format_type` | no | `json` | no | Format type. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `pipeline_sink_id` | `cloudflare_pipeline_sink.this.id` | ID (workflow `resource_id`). |
| `pipeline_sink_name` | `.name` | Name. |

## Docs

- [cloudflare_pipeline_sink](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/pipeline_sink)
