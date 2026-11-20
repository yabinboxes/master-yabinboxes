# AWS RDS instance

Creates a managed RDS instance (`aws_db_instance`). Default engine is PostgreSQL on `db.t3.micro`.

**Path:** `v1/modules/dev/aws/aws_db_instance`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `aws_db_instance` | `this` | RDS identifier `var.name`. Optional fields that are empty or `0` are passed as `null` so AWS can use engine defaults. |

Provider `hashicorp/aws` `~> 6.0`. Master password is managed in Secrets Manager when `manage_master_user_password` is `true` (default); then `password` is ignored. Storage is encrypted by default. Public access, Multi-AZ, and deletion protection default off. `skip_final_snapshot` defaults to `true`; if you turn that off, the snapshot id is `var.final_snapshot_identifier` or `${var.name}-final`.

Tags merge `managed_by=terraform`, `Name`, and `var.tags`.

```
main.tf        # provider, RDS instance
variables.tf   # inputs
outputs.tf     # id, arn, endpoint, address
backend.tf     # backend "s3" {}
```

This module does not create a subnet group, parameter group, or security group. Pass existing names/IDs when you need them.

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="snow-db"
export TF_VAR_engine="postgres"
export TF_VAR_instance_class="db.t3.micro"
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_db_instance/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

If you set `TF_VAR_manage_master_user_password=false`, you must also set `TF_VAR_password`.

```bash
terraform output -raw db_instance_endpoint
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. |
| `name` | no | `snow-db` | no | RDS identifier. |
| `region` | no | `us-east-1` | no | Region. |
| `allocated_storage` | no | `20` | no | Storage GiB. |
| `engine` | no | `postgres` | no | Engine. |
| `engine_version` | no | `""` | no | Empty = AWS default. |
| `instance_class` | no | `db.t3.micro` | no | Instance class. |
| `db_name` | no | `""` | no | Optional initial database. |
| `username` | no | `snowadmin` | no | Master username. |
| `password` | no | `""` | yes | Used when Secrets Manager is off. |
| `manage_master_user_password` | no | `true` | no | Store the password in Secrets Manager. |
| `parameter_group_name` | no | `""` | no | Optional. |
| `db_subnet_group_name` | no | `""` | no | Optional. |
| `vpc_security_group_ids` | no | `[]` | no | Empty omits. |
| `publicly_accessible` | no | `false` | no | Public access. |
| `multi_az` | no | `false` | no | Multi-AZ. |
| `storage_encrypted` | no | `true` | no | Storage encryption. |
| `skip_final_snapshot` | no | `true` | no | Skip snapshot on destroy. |
| `final_snapshot_identifier` | no | `""` | no | Used when not skipping. |
| `backup_retention_period` | no | `0` | no | Backup days. |
| `deletion_protection` | no | `false` | no | Deletion protection. |
| `port` | no | `0` | no | `0` = engine default. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `db_instance_id` | `aws_db_instance.this.id` | ID (workflow `resource_id`). |
| `db_instance_arn` | `.arn` | ARN. |
| `db_instance_endpoint` | `.endpoint` | `host:port`. |
| `db_instance_address` | `.address` | Hostname. |

## Docs

- [aws_db_instance](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_instance)
