# GCP Cloud SQL instance

Creates a Cloud SQL instance (default PostgreSQL 15). It does not create databases or users.

**Path:** `v1/modules/dev/gcp/google_sql_database_instance`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_sql_database_instance` | `this` | Cloud SQL instance. Settings: `tier`, `availability_type`, disk, public IPv4. |

Provider `hashicorp/google` `~> 8.0`. `credentials` empty uses ADC. Default tier `db-f1-micro`, availability `ZONAL`, disk 10 GB `PD_SSD`. `deletion_protection` defaults to `false`. Labels go to `user_labels` merged with `managed_by=terraform`.

```
main.tf        # provider, SQL instance
variables.tf   # inputs
outputs.tf     # sql_instance_id, connection_name, public/private IPs
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_project="your-gcp-project"
export TF_VAR_name="snow-sql"
export TF_VAR_database_version="POSTGRES_15"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/google_sql_database_instance/terraform.tfstate"
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
terraform output -raw connection_name
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `project` | yes | — | no | GCP project ID. |
| `credentials` | no | `""` | yes | SA JSON. Empty uses ADC. |
| `name` | no | `snow-sql` | no | Instance name. |
| `region` | no | `us-central1` | no | Region. |
| `database_version` | no | `POSTGRES_15` | no | Engine version. |
| `tier` | no | `db-f1-micro` | no | Machine tier. |
| `availability_type` | no | `ZONAL` | no | `ZONAL` or `REGIONAL`. |
| `disk_size` | no | `10` | no | Disk GB. |
| `disk_type` | no | `PD_SSD` | no | Disk type. |
| `ipv4_enabled` | no | `true` | no | Public IPv4. |
| `deletion_protection` | no | `false` | no | Deletion protection. |
| `labels` | no | `{}` | no | Extra user labels. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `sql_instance_id` | `google_sql_database_instance.this.id` | Instance ID. |
| `connection_name` | `.connection_name` | `project:region:instance`. |
| `public_ip_address` | `.public_ip_address` | Public IP. |
| `private_ip_address` | `.private_ip_address` | Private IP. |

## Docs

- [google_sql_database_instance](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database_instance)
