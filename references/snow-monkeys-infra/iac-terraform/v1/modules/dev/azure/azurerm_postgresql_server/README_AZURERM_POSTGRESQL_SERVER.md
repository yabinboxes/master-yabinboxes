# Azure PostgreSQL Flexible Server

Creates an Azure Database for PostgreSQL flexible server. The directory is named `azurerm_postgresql_server`; the resource is `azurerm_postgresql_flexible_server` because the classic resource was removed in azurerm 4+/5+.

**Path:** `v1/modules/dev/azure/azurerm_postgresql_server`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_postgresql_flexible_server` | `this` | Flexible server. Version `var.postgres_version` (default `14`). |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. SKU default `B_Standard_B1ms`, storage `32768` MB. Empty `zone` becomes `null`. Admin login defaults to `snowadmin`; password is required. Create databases with `azurerm_postgresql_database` using `postgresql_server_id`.

```
main.tf        # provider, flexible server
variables.tf   # inputs
outputs.tf     # postgresql_server_id, fqdn
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snow-pg-server"
export TF_VAR_resource_group_name="my-rg"
export TF_VAR_administrator_password="..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_postgresql_server/terraform.tfstate"
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
terraform output -raw fqdn
terraform output -raw postgresql_server_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `resource_group_name` | yes | — | no | Existing resource group. |
| `administrator_password` | yes | — | yes | Admin password. |
| `name` | no | `snow-pg-server` | no | Server name. |
| `location` | no | `westeurope` | no | Azure region. |
| `postgres_version` | no | `14` | no | PostgreSQL version. |
| `administrator_login` | no | `snowadmin` | no | Admin login. |
| `sku_name` | no | `B_Standard_B1ms` | no | SKU. |
| `storage_mb` | no | `32768` | no | Storage MB. |
| `zone` | no | `""` | no | Empty omits. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `postgresql_server_id` | `azurerm_postgresql_flexible_server.this.id` | ID (workflow `resource_id`). |
| `fqdn` | `.fqdn` | FQDN. |

## Docs

- [azurerm_postgresql_flexible_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server)
