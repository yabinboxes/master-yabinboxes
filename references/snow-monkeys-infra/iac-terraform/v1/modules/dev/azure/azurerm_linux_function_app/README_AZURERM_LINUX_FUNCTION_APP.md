# Azure Linux Function App

Creates an Azure Linux Function App on an existing App Service Plan and storage account.

**Path:** `v1/modules/dev/azure/azurerm_linux_function_app`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_linux_function_app` | `this` | Function App bound to `service_plan_id` and a storage account. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. `site_config` is an empty block (provider defaults). Tags merge `managed_by=terraform` and `var.tags`.

The resource group, App Service Plan, and storage account must already exist.

```
main.tf        # provider, function app
variables.tf   # inputs
outputs.tf     # linux_function_app_id, default_hostname
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snow-linux-function-app"
export TF_VAR_resource_group_name="my-rg"
export TF_VAR_service_plan_id="/subscriptions/.../serverFarms/..."
export TF_VAR_storage_account_name="mystorage"
export TF_VAR_storage_account_access_key="..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_linux_function_app/terraform.tfstate"
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
terraform output -raw default_hostname
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `resource_group_name` | yes | — | no | Existing resource group. |
| `service_plan_id` | yes | — | no | Existing App Service Plan ID. |
| `storage_account_name` | yes | — | no | Storage account name. |
| `storage_account_access_key` | yes | — | yes | Storage account key. |
| `name` | no | `snow-linux-function-app` | no | Function App name. |
| `location` | no | `westeurope` | no | Azure region. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `linux_function_app_id` | `azurerm_linux_function_app.this.id` | ID (workflow `resource_id`). |
| `default_hostname` | `.default_hostname` | Default hostname. |

## Docs

- [azurerm_linux_function_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_function_app)
