# Cloudflare Workers script

Creates a Cloudflare Worker from inline script content.

**Path:** `v1/modules/dev/cloudflare/cloudflare_workers_script`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `cloudflare_workers_script` | `this` | Worker. `script_name` is `var.name`. Body is `var.content`. |

Provider `cloudflare/cloudflare` `~> 5.0`. Auth is `TF_VAR_cloudflare_api_token`. Default content is a small Hello Worker. `main_module` default `worker.js`; empty becomes `null`.

```
main.tf        # provider, workers script
variables.tf   # inputs
outputs.tf     # workers_script_id, workers_script_name
backend.tf     # backend "s3" {}
```

This module does not create routes or custom domains.

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_account_id="..."
export TF_VAR_name="snow-worker"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/cloudflare_workers_script/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

Override the script:

```bash
export TF_VAR_content="$(cat ./worker.js)"
export TF_VAR_main_module="worker.js"
```

```bash
terraform output -raw workers_script_name
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_api_token` | yes | — | yes | API token. |
| `account_id` | yes | — | no | Cloudflare account ID. |
| `name` | no | `snow-worker` | no | Script name. |
| `content` | no | Hello Worker JS | no | Script body. |
| `main_module` | no | `worker.js` | no | Empty omits. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `workers_script_id` | `cloudflare_workers_script.this.id` | ID (workflow `resource_id`). |
| `workers_script_name` | `.script_name` | Script name. |

## Docs

- [cloudflare_workers_script](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/workers_script)
