# Azure SQL Server

Creates an Azure SQL (MSSQL) server.

**Path:** `v1/modules/dev/azure/azurerm_mssql_server`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_mssql_server` | `this` | Logical SQL server. `version` is `var.server_version` (default `12.0`). |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. Admin login defaults to `snowadmin`; password is required and sensitive. Minimum TLS is `1.2`. The resource group must already exist. Create databases with `azurerm_mssql_database` using the `mssql_server_id` output.

```
main.tf        # provider, SQL server
variables.tf   # inputs
outputs.tf     # mssql_server_id, fully_qualified_domain_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snow-mssql-server"
export TF_VAR_resource_group_name="my-rg"
export TF_VAR_administrator_login_password="..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_mssql_server/terraform.tfstate"
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
terraform output -raw fully_qualified_domain_name
terraform output -raw mssql_server_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `resource_group_name` | yes | — | no | Existing resource group. |
| `administrator_login_password` | yes | — | yes | Admin password. |
| `name` | no | `snow-mssql-server` | no | Server name. |
| `location` | no | `westeurope` | no | Azure region. |
| `server_version` | no | `12.0` | no | SQL Server version. |
| `administrator_login` | no | `snowadmin` | no | Admin login. |
| `minimum_tls_version` | no | `1.2` | no | Minimum TLS. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `mssql_server_id` | `azurerm_mssql_server.this.id` | ID (workflow `resource_id`). |
| `fully_qualified_domain_name` | `.fully_qualified_domain_name` | FQDN. |

## Docs

- [azurerm_mssql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mssql_server)
