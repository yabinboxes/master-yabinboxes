# Cloudflare Pages Project

Terraform module that creates a `cloudflare_pages_project` (type: resource).

## Docs

- [cloudflare_pages_project](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/pages_project)

## Quick start

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_account_id="..."
export TF_VAR_name="snow-pages"
export TF_VAR_production_branch="main"
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/cloudflare_pages_project/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

## Outputs

- `pages_project_id` (workflow `resource_id`)
- `pages_project_name`
- `pages_project_subdomain`
