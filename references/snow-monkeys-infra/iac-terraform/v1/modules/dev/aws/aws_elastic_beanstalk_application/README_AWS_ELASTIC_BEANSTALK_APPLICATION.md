# AWS Elastic Beanstalk application

Creates an Elastic Beanstalk application only. It does not create an environment or deploy a version.

**Path:** `v1/modules/dev/aws/aws_elastic_beanstalk_application`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `aws_elastic_beanstalk_application` | `this` | Application named `var.name`. Optional description. |

Provider `hashicorp/aws` `~> 6.0`. A nested `appversion_lifecycle` block is added only when `appversion_lifecycle_service_role` is set. `max_count` / `max_age_in_days` of `0` are omitted inside that block. Tags merge `managed_by=terraform` and `var.tags`.

```
main.tf        # provider, application
variables.tf   # inputs
outputs.tf     # application_name, application_arn
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="snow-beanstalk-app"
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_elastic_beanstalk_application/terraform.tfstate"
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
terraform output -raw application_name
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. |
| `name` | no | `snow-beanstalk-app` | no | Application name. |
| `region` | no | `us-east-1` | no | Region. |
| `description` | no | `""` | no | Optional description. |
| `appversion_lifecycle_service_role` | no | `""` | no | Empty disables the lifecycle block. |
| `appversion_lifecycle_max_count` | no | `0` | no | `0` omits. |
| `appversion_lifecycle_max_age_in_days` | no | `0` | no | `0` omits. |
| `appversion_lifecycle_delete_source_from_s3` | no | `true` | no | Delete S3 source on version delete. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `application_name` | `aws_elastic_beanstalk_application.this.name` | Name (workflow `resource_id`). |
| `application_arn` | `.arn` | ARN. |

## Docs

- [aws_elastic_beanstalk_application](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elastic_beanstalk_application)
