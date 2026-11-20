# Azure Linux Web App

Creates an Azure Linux Web App on an existing App Service Plan.

**Path:** `v1/modules/dev/azure/azurerm_linux_web_app`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_linux_web_app` | `this` | Linux Web App in `resource_group_name` / `location`, bound to `service_plan_id`. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal (`subscription_id`, `tenant_id`, `client_id`, `client_secret`). `site_config.always_on` comes from `var.always_on` (default `true`). Tags merge `managed_by=terraform` and `var.tags`.

The resource group and App Service Plan must already exist.

```
main.tf        # provider, web app
variables.tf   # inputs
outputs.tf     # linux_web_app_id, default_hostname
backend.tf     # backend "s3" {}
```

## Usage

Remote state uses AWS S3 ([BACKEND_S3.md](../../BACKEND_S3.md)). Azure credentials are `TF_VAR_*`; S3 backend credentials are `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`. Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snow-linux-web-app"
export TF_VAR_resource_group_name="my-rg"
export TF_VAR_service_plan_id="/subscriptions/.../serverFarms/..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_linux_web_app/terraform.tfstate"
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
| `name` | no | `snow-linux-web-app` | no | Web App name. |
| `location` | no | `westeurope` | no | Azure region. |
| `always_on` | no | `true` | no | Keep the app always on. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `linux_web_app_id` | `azurerm_linux_web_app.this.id` | ID (workflow `resource_id`). |
| `default_hostname` | `.default_hostname` | Default hostname. |

## Docs

- [azurerm_linux_web_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app)
