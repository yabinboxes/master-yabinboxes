# AWS Lambda function

Creates a Lambda function. If `role_arn` is empty, it also creates an IAM role with `AWSLambdaBasicExecutionRole`.

**Path:** `v1/modules/dev/aws/aws_lambda_function`

## Implementation

| Resource / data | Name | Purpose |
|---|---|---|
| `data.aws_iam_policy_document` | `assume_role` | Lambda assume-role policy. Count is 1 when `role_arn` is empty. |
| `aws_iam_role` | `this` | `${var.name}-lambda-role` when no `role_arn`. |
| `aws_iam_role_policy_attachment` | `basic` | Attaches `AWSLambdaBasicExecutionRole`. |
| `aws_lambda_function` | `this` | Function using `role_arn` or the created role. `depends_on` the IAM attachment. |

Provider `hashicorp/aws` `~> 6.0`. Package can be a local zip (`filename`), an S3 object (`s3_bucket` + `s3_key`), or a container (`image_uri` with `package_type=Image`). Handler and runtime apply only to Zip. Environment variables are a dynamic block when the map is non-empty.

```
main.tf        # provider, optional IAM, Lambda
variables.tf   # inputs
outputs.tf     # id, arn, invoke_arn
backend.tf     # backend "s3" {}
```

No VPC config is set. Supply a zip or image before apply; an empty `filename` with `package_type=Zip` fails at create time.

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="snow-lambda"
export TF_VAR_filename="./function.zip"
export TF_VAR_handler="index.handler"
export TF_VAR_runtime="nodejs20.x"
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_lambda_function/terraform.tfstate"
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
terraform output -raw lambda_function_arn
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. |
| `name` | no | `snow-lambda` | no | Function name. |
| `region` | no | `us-east-1` | no | Region. |
| `role_arn` | no | `""` | no | Empty creates a basic execution role. |
| `handler` | no | `index.handler` | no | Zip handler. |
| `runtime` | no | `nodejs20.x` | no | Zip runtime. |
| `filename` | no | `""` | no | Local zip path. |
| `s3_bucket` | no | `""` | no | S3 package bucket. |
| `s3_key` | no | `""` | no | S3 package key. |
| `image_uri` | no | `""` | no | ECR image URI. |
| `package_type` | no | `Zip` | no | `Zip` or `Image`. |
| `memory_size` | no | `128` | no | MB. |
| `timeout` | no | `3` | no | Seconds. |
| `architectures` | no | `["x86_64"]` | no | JSON list. |
| `source_code_hash` | no | `""` | no | Triggers updates. |
| `environment_variables` | no | `{}` | no | JSON map. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `lambda_function_id` | `aws_lambda_function.this.id` | Name / ID. |
| `lambda_function_arn` | `.arn` | ARN. |
| `invoke_arn` | `.invoke_arn` | API Gateway invoke ARN. |

## Docs

- [aws_lambda_function](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function)
