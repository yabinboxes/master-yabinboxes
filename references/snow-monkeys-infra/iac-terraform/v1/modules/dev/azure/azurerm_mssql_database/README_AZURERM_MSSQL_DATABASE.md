# Azure SQL Database

Creates an Azure SQL database on an existing MSSQL server.

**Path:** `v1/modules/dev/azure/azurerm_mssql_database`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_mssql_database` | `this` | Database on `server_id`. SKU default `S0`. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. Empty `license_type` and `max_size_gb` of `0` become `null`. Collation defaults to `SQL_Latin1_General_CP1_CI_AS`. Apply `azurerm_mssql_server` first and pass `mssql_server_id` as `TF_VAR_server_id`.

```
main.tf        # provider, database
variables.tf   # inputs
outputs.tf     # mssql_database_id, mssql_database_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snow-mssql-db"
export TF_VAR_server_id="$(terraform -chdir=../azurerm_mssql_server output -raw mssql_server_id)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_mssql_database/terraform.tfstate"
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
terraform output -raw mssql_database_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `server_id` | yes | — | no | Existing MSSQL server ID. |
| `name` | no | `snow-mssql-db` | no | Database name. |
| `collation` | no | `SQL_Latin1_General_CP1_CI_AS` | no | Collation. |
| `license_type` | no | `""` | no | Empty omits. |
| `max_size_gb` | no | `2` | no | `0` omits. |
| `sku_name` | no | `S0` | no | SKU. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `mssql_database_id` | `azurerm_mssql_database.this.id` | ID (workflow `resource_id`). |
| `mssql_database_name` | `.name` | Database name. |

## Docs

- [azurerm_mssql_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mssql_database)
