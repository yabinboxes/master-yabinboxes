# Civo compute (stub)

Placeholder for Civo compute. **No resources, variables, provider block, or outputs.** `terraform apply` is a no-op after init.

**Path:** `v1/modules/dev/civo/compute`

## Implementation

`provider.tf` only declares `required_version = ">= 0.13.0"` and `civo/civo` `~> 1.1.0`. There is no `provider "civo"` block, no `variables.tf`, and no compute instance resource.

```
provider.tf    # required_providers only
backend.tf     # backend "s3" {}
```

This is not a usable compute module yet. There is no parameterized Civo instance project in this tree.

## Usage

Init still needs remote state ([BACKEND_S3.md](../../BACKEND_S3.md)):

```bash
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/civo/compute/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

Apply succeeds with an empty plan until resources are added.

## Inputs

None.

## Outputs

None.

## Docs

- [Civo Terraform provider](https://registry.terraform.io/providers/civo/civo/latest/docs)
