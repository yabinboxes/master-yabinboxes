# Azure MySQL Flexible Database

Creates a database on an existing MySQL flexible server.

**Path:** `v1/modules/dev/azure/azurerm_mysql_flexible_database`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_mysql_flexible_database` | `this` | Database on `server_name` in `resource_group_name`. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. Parent is linked by **server name**, not ID. Charset default `utf8`, collation `utf8_unicode_ci`. This resource has no tags argument.

```
main.tf        # provider, database
variables.tf   # inputs
outputs.tf     # mysql_flexible_database_id, mysql_flexible_database_name
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
export TF_VAR_resource_group_name="my-rg"
export TF_VAR_server_name="snow-mysql-server"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_mysql_flexible_database/terraform.tfstate"
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
terraform output -raw mysql_flexible_database_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `resource_group_name` | yes | — | no | Existing resource group. |
| `server_name` | yes | — | no | Existing MySQL flexible server name. |
| `name` | no | `snowdb` | no | Database name. |
| `charset` | no | `utf8` | no | Charset. |
| `collation` | no | `utf8_unicode_ci` | no | Collation. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `mysql_flexible_database_id` | `azurerm_mysql_flexible_database.this.id` | ID (workflow `resource_id`). |
| `mysql_flexible_database_name` | `.name` | Database name. |

## Docs

- [azurerm_mysql_flexible_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_database)
