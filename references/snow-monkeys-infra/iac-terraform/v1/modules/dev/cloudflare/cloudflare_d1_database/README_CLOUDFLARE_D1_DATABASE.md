# Cloudflare D1 database

Creates a Cloudflare D1 SQLite database.

**Path:** `v1/modules/dev/cloudflare/cloudflare_d1_database`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `cloudflare_d1_database` | `this` | D1 database named `var.name` in `account_id`. |

Provider `cloudflare/cloudflare` `~> 5.0`. Auth is `TF_VAR_cloudflare_api_token`. Empty `jurisdiction` and `primary_location_hint` become `null`.

```
main.tf        # provider, D1 database
variables.tf   # inputs
outputs.tf     # d1_database_id, d1_database_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_account_id="..."
export TF_VAR_name="snow-d1"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/cloudflare_d1_database/terraform.tfstate"
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
terraform output -raw d1_database_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_api_token` | yes | — | yes | API token. |
| `account_id` | yes | — | no | Cloudflare account ID. |
| `name` | no | `snow-d1` | no | Database name. |
| `jurisdiction` | no | `""` | no | Empty omits. |
| `primary_location_hint` | no | `""` | no | Empty omits. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `d1_database_id` | `cloudflare_d1_database.this.id` | ID (workflow `resource_id`). |
| `d1_database_name` | `.name` | Name. |

## Docs

- [cloudflare_d1_database](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/d1_database)
