# Azure PostgreSQL Flexible Database

Creates a database on an existing PostgreSQL flexible server. The directory is named `azurerm_postgresql_database`; the resource is `azurerm_postgresql_flexible_server_database` because the classic resource was removed in azurerm 4+/5+.

**Path:** `v1/modules/dev/azure/azurerm_postgresql_database`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_postgresql_flexible_server_database` | `this` | Database on `server_id`. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. Charset default `UTF8`, collation `en_US.utf8`. No tags argument. Apply `azurerm_postgresql_server` first and pass `postgresql_server_id` as `TF_VAR_server_id`.

```
main.tf        # provider, database
variables.tf   # inputs
outputs.tf     # postgresql_database_id, postgresql_database_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snowdb"
export TF_VAR_server_id="$(terraform -chdir=../azurerm_postgresql_server output -raw postgresql_server_id)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_postgresql_database/terraform.tfstate"
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
terraform output -raw postgresql_database_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `server_id` | yes | — | no | Existing PostgreSQL flexible server ID. |
| `name` | no | `snowdb` | no | Database name. |
| `charset` | no | `UTF8` | no | Charset. |
| `collation` | no | `en_US.utf8` | no | Collation. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `postgresql_database_id` | `azurerm_postgresql_flexible_server_database.this.id` | ID (workflow `resource_id`). |
| `postgresql_database_name` | `.name` | Database name. |

## Docs

- [azurerm_postgresql_flexible_server_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server_database)
