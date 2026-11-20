# 2. Walkthrough

Each heading is one directory in `snow-monkeys-infra/iac-terraform`. The implementation link is the reusable workflow that clones that directory when `type` or `resource` equals the folder name.

## Navigation

### aws

Workflow: [aws-iac main.yml](../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml). Clone action: [server-resource](../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml).

| Project | In `list-of-resources.md` | Files |
| --- | --- | --- |
| `aws/aws_db_instance` | yes | [README_AWS_DB_INSTANCE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/README_AWS_DB_INSTANCE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/variables.tf) |
| `aws/aws_ebs_volume` | yes | [README_AWS_EBS_VOLUME.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/README_AWS_EBS_VOLUME.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/variables.tf) |
| `aws/aws_elastic_beanstalk_application` | yes | [README_AWS_ELASTIC_BEANSTALK_APPLICATION.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/README_AWS_ELASTIC_BEANSTALK_APPLICATION.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/variables.tf) |
| `aws/aws_instance` | yes | [README_AWS_INSTANCE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/README_AWS_INSTANCE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/variables.tf) |
| `aws/aws_lambda_function` | yes | [README_AWS_LAMBDA_FUNCTION.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/README_AWS_LAMBDA_FUNCTION.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/variables.tf) |
| `aws/aws_s3_bucket` | yes | [README_AWS_S3_BUCKET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/README_AWS_S3_BUCKET.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/variables.tf) |

### azure

Workflow: [azure-iac main.yml](../../../../references/snow-monkeys-modules/azure-iac/.github/workflows/main.yml). Clone action: [server-resource](../../../../references/snow-monkeys-modules/azure-iac/.github/actions/server-resource/action.yml).

| Project | In `list-of-resources.md` | Files |
| --- | --- | --- |
| `azure/azurerm_linux_function_app` | yes | [README_AZURERM_LINUX_FUNCTION_APP.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/README_AZURERM_LINUX_FUNCTION_APP.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/variables.tf) |
| `azure/azurerm_linux_web_app` | yes | [README_AZURERM_LINUX_WEB_APP.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/README_AZURERM_LINUX_WEB_APP.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/variables.tf) |
| `azure/azurerm_mssql_database` | yes | [README_AZURERM_MSSQL_DATABASE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/README_AZURERM_MSSQL_DATABASE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/variables.tf) |
| `azure/azurerm_mssql_server` | yes | [README_AZURERM_MSSQL_SERVER.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/README_AZURERM_MSSQL_SERVER.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/variables.tf) |
| `azure/azurerm_mysql_flexible_database` | yes | [README_AZURERM_MYSQL_FLEXIBLE_DATABASE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/README_AZURERM_MYSQL_FLEXIBLE_DATABASE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/variables.tf) |
| `azure/azurerm_mysql_flexible_server` | yes | [README_AZURERM_MYSQL_FLEXIBLE_SERVER.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/README_AZURERM_MYSQL_FLEXIBLE_SERVER.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/variables.tf) |
| `azure/azurerm_postgresql_database` | yes | [README_AZURERM_POSTGRESQL_DATABASE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/README_AZURERM_POSTGRESQL_DATABASE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/variables.tf) |
| `azure/azurerm_postgresql_server` | yes | [README_AZURERM_POSTGRESQL_SERVER.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/README_AZURERM_POSTGRESQL_SERVER.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/variables.tf) |

### civo

Workflow: [civo-iac main.yml](../../../../references/snow-monkeys-modules/civo-iac/.github/workflows/main.yml). Clone action: [server-resource](../../../../references/snow-monkeys-modules/civo-iac/.github/actions/server-resource/action.yml).

| Project | In `list-of-resources.md` | Files |
| --- | --- | --- |
| `civo/bucket` | yes | [README_BUCKET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/README_BUCKET.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/backend.tf), [bucket.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/bucket.tf), [provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/provider.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/variables.tf) |
| `civo/compute` | yes | [README_COMPUTE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/compute/README_COMPUTE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/compute/backend.tf), [provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/compute/provider.tf) |
| `civo/observability` | yes | [README_OBSERVABILITY.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/README_OBSERVABILITY.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/backend.tf), [grafana.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/grafana.tf), [opentelemetry.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/opentelemetry.tf), [prometheus.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/prometheus.tf), [provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/provider.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/variables.tf) |

### cloudflare

Workflow: [cloudflare-iac main.yml](../../../../references/snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml). Clone action: [server-resource](../../../../references/snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml).

| Project | In `list-of-resources.md` | Files |
| --- | --- | --- |
| `cloudflare/cloudflare_d1_database` | yes | [README_CLOUDFLARE_D1_DATABASE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/README_CLOUDFLARE_D1_DATABASE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/variables.tf) |
| `cloudflare/cloudflare_pages_project` | yes | [README_CLOUDFLARE_PAGES_PROJECT.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/README_CLOUDFLARE_PAGES_PROJECT.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/variables.tf) |
| `cloudflare/cloudflare_pipeline_sink` | yes | [README_CLOUDFLARE_PIPELINE_SINK.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/README_CLOUDFLARE_PIPELINE_SINK.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/variables.tf) |
| `cloudflare/cloudflare_r2_bucket` | yes | [README_CLOUDFLARE_R2_BUCKET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/README_CLOUDFLARE_R2_BUCKET.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/variables.tf) |
| `cloudflare/cloudflare_workers_script` | yes | [README_CLOUDFLARE_WORKERS_SCRIPT.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/README_CLOUDFLARE_WORKERS_SCRIPT.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/variables.tf) |
| `cloudflare/dns` | no. Reached only if `resource` is this folder name | [README_DNS.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/README_DNS.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/backend.tf), [cloudflare.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/cloudflare.tf), [provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/provider.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/variables.tf) |

### digitalocean

Workflow: [digital-ocean-iac main.yml](../../../../references/snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml). Clone action: [server-resource](../../../../references/snow-monkeys-modules/digital-ocean-iac/.github/actions/server-resource/action.yml).

| Project | In `list-of-resources.md` | Files |
| --- | --- | --- |
| `digitalocean/digitalocean_droplet` | yes | [README_DIGITALOCEAN_DROPLET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/README_DIGITALOCEAN_DROPLET.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/variables.tf) |
| `digitalocean/digitalocean_droplet_autoscale` | yes | [README_DIGITALOCEAN_DROPLET_AUTOSCALE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/README_DIGITALOCEAN_DROPLET_AUTOSCALE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/variables.tf) |
| `digitalocean/droplet` | no. Reached only if `resource` is this folder name | [README_DROPLET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/README_DROPLET.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/backend.tf), [droplet.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/droplet.tf), [output.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/output.tf), [provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/provider.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/variables.tf) |

### gcp

Workflow: [gcp-iac main.yml](../../../../references/snow-monkeys-modules/gcp-iac/.github/workflows/main.yml). Clone action: [server-resource](../../../../references/snow-monkeys-modules/gcp-iac/.github/actions/server-resource/action.yml).

| Project | In `list-of-resources.md` | Files |
| --- | --- | --- |
| `gcp/compute` | no. Reached only if `resource` is this folder name | [README_COMPUTE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/README_COMPUTE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/backend.tf), [compute-instance.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/compute-instance.tf), [provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/provider.tf) |
| `gcp/google_compute_instance` | yes | [README_GOOGLE_COMPUTE_INSTANCE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/variables.tf) |
| `gcp/google_sql_database_instance` | yes | [README_GOOGLE_SQL_DATABASE_INSTANCE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/README_GOOGLE_SQL_DATABASE_INSTANCE.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/variables.tf) |
| `gcp/google_storage_bucket` | yes | [README_GOOGLE_STORAGE_BUCKET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/README_GOOGLE_STORAGE_BUCKET.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/variables.tf) |
| `gcp/google_storage_bucket_object` | yes | [README_GOOGLE_STORAGE_BUCKET_OBJECT.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/README_GOOGLE_STORAGE_BUCKET_OBJECT.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/variables.tf) |

### hetzner

Workflow: [hetzner-iac main.yml](../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml). Clone action: [server-resource](../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml).

| Project | In `list-of-resources.md` | Files |
| --- | --- | --- |
| `hetzner/hcloud_firewall` | yes | [README_HCLOUD_FIREWALL.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/README_HCLOUD_FIREWALL.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/variables.tf) |
| `hetzner/hcloud_floating_ip` | yes | [README_HCLOUD_FLOATING_IP.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/README_HCLOUD_FLOATING_IP.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/variables.tf) |
| `hetzner/hcloud_network` | yes | [README_HCLOUD_NETWORK.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/README_HCLOUD_NETWORK.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/variables.tf) |
| `hetzner/hcloud_server` | yes | [README_HCLOUD_SERVER.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/README_HCLOUD_SERVER.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/variables.tf) |
| `hetzner/hcloud_volume` | yes | [README_HCLOUD_VOLUME.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/README_HCLOUD_VOLUME.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/variables.tf) |
| `hetzner/hcloud_volume_attachment` | yes | [README_HCLOUD_VOLUME_ATTACHMENT.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/README_HCLOUD_VOLUME_ATTACHMENT.md), [backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/backend.tf), [main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/main.tf), [outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/outputs.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/variables.tf) |

### v1/k8s

Not selected by `server-resource`. Civo `type: kubernetes` uses [deploy-image](../../../../references/snow-monkeys-modules/civo-iac/.github/actions/deploy-image/action.yml).

| Project | Files |
| --- | --- |
| `v1/k8s/civo-traefik/dev` | [README_K8S.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/README_K8S.md), [cermanager.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/cermanager.tf), [civo.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/civo.tf), [data.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/data.tf), [output.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/output.tf), [provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/provider.tf), [traefik.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/traefik.tf), [variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/variables.tf) |

## Code

The source below is the file in `iac-terraform`, unchanged.

### `.`

#### `.gitignore`

File: [.gitignore](../../../../references/snow-monkeys-infra/iac-terraform/.gitignore)

```text
# Local .terraform directories
**/.terraform/*
**/cloudflaretunnel/*
**/not-in-use/*

# .tfstate files
*.tfstate
*.tfstate.*
*.hcl
# mac and editor
.idea
.vscode
.astro
.DS_Store


# Crash log files
crash.log
crash.*.log

# Exclude all .tfvars files, which are likely to contain sensitive data, such as
# password, private keys, and other secrets. These should not be part of version 
# control as they are data points which are potentially sensitive and subject 
# to change depending on the environment.
*.tfvars
*.tfvars.json

# Ignore override files as they are usually used to override resources locally and so
# are not checked in
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# Ignore transient lock info files created by terraform apply
.terraform.tfstate.lock.info

# Include override files you do wish to add to version control using negated pattern
# !example_override.tf

# Include tfplan files to ignore the plan output of command: terraform plan -out=tfplan
# example: *tfplan*

# Ignore CLI configuration files
.terraformrc
terraform.rc
```

#### `README.md`

File: [README.md](../../../../references/snow-monkeys-infra/iac-terraform/README.md)

````markdown
# iac-terraform

Terraform infrastructure for Snow — cloud modules and Kubernetes stacks under `v1/`.

## Docs

- [Project structure](../../../../references/snow-monkeys-infra/iac-terraform/docs/project-structure.md) — layout, conventions, and the full module index
- Each project under `v1/modules/dev/<provider>/<resource>/` has a `README_<RESOURCE>.md` (implementation and usage)
- [Terraform rules](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md) — `TF_VAR_*` inputs, layout, secrets
- [S3 remote state](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md) — bucket bootstrap and `terraform init`
- [Hetzner hcloud_server](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server.md) — extra overview and usage
- [Hetzner inputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/inputs.md) / [outputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/outputs.md)

## Layout (summary)

```
v1/
├── modules/dev/   # reusable modules by provider (civo, hetzner, gcp, …)
├── k8s/           # Kubernetes root stacks (e.g. civo-traefik)
└── not-in-use/    # archived configs
```

## Requirements

- Terraform `>= 1.3`
- Provider credentials via `TF_VAR_*` (not committed)
- Inputs: every variable is set with `TF_VAR_<name>` ([TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md))
- Remote state: apply `v1/modules/dev/aws/aws_s3_bucket` first, then `terraform init` with `-backend-config` for `TF_STATE_BUCKET`, `TF_STATE_KEY_PREFIX`, `TF_STATE_REGION`, and `TF_STATE_ENCRYPT` ([BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md))
````

### `docs/modules`

#### `aws.md`

File: [docs/modules/aws.md](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/aws.md)

```markdown

```

### `docs/modules/hetzner-hcloud-server`

#### `inputs.md`

File: [docs/modules/hetzner-hcloud-server/inputs.md](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/inputs.md)

````markdown
# Inputs — Hetzner server

Module path: [`v1/modules/dev/hetzner/hcloud_server`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server)

Source: [`variables.tf`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/variables.tf)

## Required

| Name | Type | Sensitive | Description |
|---|---|---|---|
| `hcloud_token` | `string` | yes | Hetzner Cloud API token. Set via `TF_VAR_hcloud_token`. |
| `ssh_public_key` | `string` | yes | SSH public key uploaded as `hcloud_ssh_key` and attached to the server. Set via `TF_VAR_ssh_public_key`. |

## Optional

| Name | Type | Default | Sensitive | Description |
|---|---|---|---|---|
| `name` | `string` | `"CX23"` | no | Server name. Also used to name the SSH key as `${name}key`. |
| `server_type` | `string` | `"cx23"` | no | Hetzner server type (e.g. `cx22`, `cx23`, `cx33`). |
| `image` | `string` | `"ubuntu-24.04"` | no | OS image for the server. |
| `location` | `string` | `"hel1"` | no | Datacenter location (e.g. `hel1`, `nbg1`, `fsn1`, `ash`, `hil`). |
| `ipv4_enabled` | `bool` | `true` | no | Enable public IPv4 on the server. |
| `ipv6_enabled` | `bool` | `false` | no | Enable public IPv6 on the server. |

## How to set

### Environment variables

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
export TF_VAR_name="dev-box"
export TF_VAR_server_type="cx23"
export TF_VAR_image="ubuntu-24.04"
export TF_VAR_location="hel1"
export TF_VAR_ipv4_enabled=true
export TF_VAR_ipv6_enabled=false
```

### Module call

```hcl
module "hetzner_server" {
  source = "../../modules/dev/hetzner/hcloud_server"

  hcloud_token   = var.hcloud_token
  ssh_public_key = var.ssh_public_key

  name         = "dev-box"
  server_type  = "cx23"
  image        = "ubuntu-24.04"
  location     = "hel1"
  ipv4_enabled = true
  ipv6_enabled = false
}
```

## Not in use

`ssh_keys` (list of existing Hetzner SSH key IDs) is commented out in `variables.tf`. The module creates a key from `ssh_public_key` instead.

## Related

- [Outputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/outputs.md)
- [Module overview](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server.md)
````

#### `outputs.md`

File: [docs/modules/hetzner-hcloud-server/outputs.md](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/outputs.md)

````markdown
# Outputs — Hetzner server

Module path: [`v1/modules/dev/hetzner/hcloud_server`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server)

Source: [`outputs.tf`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/outputs.tf)

## Outputs

| Name | Type | Sensitive | Source | Description |
|---|---|---|---|---|
| `server_id` | `string` | no | `hcloud_server.cx23.id` | Hetzner Cloud server ID. |
| `server_ipv4` | `string` | no | `hcloud_server.cx23.ipv4_address` | Public IPv4 address. Empty if `ipv4_enabled` is `false`. |
| `server_status` | `string` | no | `hcloud_server.cx23.status` | Server status (e.g. `running`, `off`, `initializing`). |

## How to read

### CLI

```bash
terraform output
terraform output server_id
terraform output -raw server_ipv4
terraform output server_status
```

### SSH after apply

```bash
ssh root@$(terraform output -raw server_ipv4)
```

### From a parent module

```hcl
module "hetzner_server" {
  source = "../../modules/dev/hetzner/hcloud_server"
  # ...
}

output "hetzner_server_id" {
  value = module.hetzner_server.server_id
}

output "hetzner_server_ipv4" {
  value = module.hetzner_server.server_ipv4
}

output "hetzner_server_status" {
  value = module.hetzner_server.server_status
}
```

## Related

- [Inputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/inputs.md)
- [Module overview](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server.md)
````

### `docs/modules`

#### `hetzner-hcloud-server.md`

File: [docs/modules/hetzner-hcloud-server.md](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server.md)

````markdown
# Hetzner server module

Provisions a Hetzner Cloud server and an SSH key for access.

**Path:** [`v1/modules/dev/hetzner/hcloud_server`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server)

## What it creates

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_ssh_key` | `yabin` | Uploads the given public key (`${var.name}key`) |
| `hcloud_server` | `cx23` | Cloud server with public networking and the SSH key attached |

Servers are labeled `managed_by = terraform`.

## Requirements

| Name | Version |
|---|---|
| Terraform | `>= 1.3` |
| `hetznercloud/hcloud` | `~> 1.49` |

## Usage

From the module directory (or reference it as a module from a root stack):

```bash
cd v1/modules/dev/hetzner/hcloud_server

export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
# optional overrides:
# export TF_VAR_name="my-dev"
# export TF_VAR_server_type="cx23"
# export TF_VAR_location="hel1"

terraform init
terraform plan
terraform apply
```

As a child module:

```hcl
module "hetzner_server" {
  source = "../../modules/dev/hetzner/hcloud_server"

  hcloud_token   = var.hcloud_token
  ssh_public_key = var.ssh_public_key

  name        = "dev-box"
  server_type = "cx23"
  image       = "ubuntu-24.04"
  location    = "hel1"
  ipv4_enabled = true
  ipv6_enabled = false
}
```

Do not commit tokens or keys. Set every variable with `TF_VAR_*` ([TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md)).

## Inputs and outputs

| Doc | Contents |
|---|---|
| [Inputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/inputs.md) | Required/optional variables, defaults, how to set them |
| [Outputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/outputs.md) | `server_id`, `server_ipv4`, `server_status`, how to read them |

## Files

```
v1/modules/dev/hetzner/hcloud_server/
├── main.tf        # provider, SSH key, server
├── variables.tf   # inputs
└── outputs.tf     # server_id, server_ipv4, server_status
```

## Notes

- Default location is Helsinki (`hel1`). Other common codes: `nbg1`, `fsn1`, `ash`, `hil`.
- Default type `cx23` is a small shared-vCPU plan; change `server_type` for larger instances.
- IPv6 is off by default; set `ipv6_enabled = true` if needed.
- Destroy with `terraform destroy` from the same directory / state.
````

### `docs`

#### `project-structure.md`

File: [docs/project-structure.md](../../../../references/snow-monkeys-infra/iac-terraform/docs/project-structure.md)

````markdown
# Project structure

Terraform IaC for Snow infrastructure. Layout is versioned under `v1/`, with reusable modules and Kubernetes stacks separated by concern.

```
iac-terraform/
├── README.md
├── docs/
│   ├── project-structure.md
│   └── modules/
│       └── hetzner-hcloud-server.md
└── v1/
    ├── modules/
    │   └── dev/                  # development environment (one root module per resource)
    │       ├── TERRAFORM_RULES.md
    │       ├── BACKEND_S3.md
    │       ├── aws/
    │       ├── azure/
    │       ├── civo/
    │       ├── cloudflare/
    │       ├── digitalocean/
    │       ├── gcp/
    │       └── hetzner/
    ├── k8s/                      # Kubernetes stack root modules
    │   └── civo-traefik/
    └── not-in-use/               # archived / experimental configs (gitignored)
```

Each resource directory has a `README_<RESOURCE>.md` covering implementation (resources, files, provider) and usage (`TF_VAR_*`, init, outputs).

## Conventions

| Path pattern | Purpose |
|---|---|
| `v1/modules/<env>/<provider>/<resource>/` | Root module for a single cloud resource or concern |
| `v1/k8s/<stack>/<env>/` | Root module that composes providers and K8s resources for a stack |
| `v1/not-in-use/` | Legacy experiments; ignored by git |

### Environment

Modules live under `dev/` today. Add sibling folders (`staging/`, `prod/`) when those environments need their own module variants.

### Providers

Each module directory typically owns its provider config and variables:

- `main.tf` / `<resource>.tf` — resources
- `variables.tf` — inputs
- `outputs.tf` — exported values
- `provider.tf` — provider block (when not inlined in `main.tf`)
- `backend.tf` — empty `backend "s3" {}`
- `README_<RESOURCE>.md` — implementation and usage

Sensitive values (`*.tfvars`, tokens, keys) are gitignored. Every variable is set with `TF_VAR_*`. See [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md). Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Apply `aws/aws_s3_bucket` first.

## Modules (dev)

### AWS

| Module | Path | README |
|---|---|---|
| S3 bucket (TF state) | [`v1/modules/dev/aws/aws_s3_bucket`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/README_AWS_S3_BUCKET.md) |
| EC2 instance | [`v1/modules/dev/aws/aws_instance`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/README_AWS_INSTANCE.md) |
| RDS instance | [`v1/modules/dev/aws/aws_db_instance`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/README_AWS_DB_INSTANCE.md) |
| EBS volume | [`v1/modules/dev/aws/aws_ebs_volume`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/README_AWS_EBS_VOLUME.md) |
| Lambda function | [`v1/modules/dev/aws/aws_lambda_function`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/README_AWS_LAMBDA_FUNCTION.md) |
| Elastic Beanstalk app | [`v1/modules/dev/aws/aws_elastic_beanstalk_application`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/README_AWS_ELASTIC_BEANSTALK_APPLICATION.md) |

### Azure

| Module | Path | README |
|---|---|---|
| Linux Web App | [`v1/modules/dev/azure/azurerm_linux_web_app`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/README_AZURERM_LINUX_WEB_APP.md) |
| Linux Function App | [`v1/modules/dev/azure/azurerm_linux_function_app`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/README_AZURERM_LINUX_FUNCTION_APP.md) |
| SQL Server | [`v1/modules/dev/azure/azurerm_mssql_server`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/README_AZURERM_MSSQL_SERVER.md) |
| SQL Database | [`v1/modules/dev/azure/azurerm_mssql_database`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/README_AZURERM_MSSQL_DATABASE.md) |
| MySQL Flexible Server | [`v1/modules/dev/azure/azurerm_mysql_flexible_server`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/README_AZURERM_MYSQL_FLEXIBLE_SERVER.md) |
| MySQL Flexible Database | [`v1/modules/dev/azure/azurerm_mysql_flexible_database`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/README_AZURERM_MYSQL_FLEXIBLE_DATABASE.md) |
| PostgreSQL Flexible Server | [`v1/modules/dev/azure/azurerm_postgresql_server`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/README_AZURERM_POSTGRESQL_SERVER.md) |
| PostgreSQL Flexible Database | [`v1/modules/dev/azure/azurerm_postgresql_database`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/README_AZURERM_POSTGRESQL_DATABASE.md) |

### Civo

| Module | Path | README |
|---|---|---|
| Object store | [`v1/modules/dev/civo/bucket`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/README_BUCKET.md) |
| Compute (stub) | [`v1/modules/dev/civo/compute`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/compute) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/compute/README_COMPUTE.md) |
| Observability (incomplete) | [`v1/modules/dev/civo/observability`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/README_OBSERVABILITY.md) |

### Cloudflare

| Module | Path | README |
|---|---|---|
| D1 database | [`v1/modules/dev/cloudflare/cloudflare_d1_database`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/README_CLOUDFLARE_D1_DATABASE.md) |
| R2 bucket | [`v1/modules/dev/cloudflare/cloudflare_r2_bucket`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/README_CLOUDFLARE_R2_BUCKET.md) |
| Workers script | [`v1/modules/dev/cloudflare/cloudflare_workers_script`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/README_CLOUDFLARE_WORKERS_SCRIPT.md) |
| Pipeline sink | [`v1/modules/dev/cloudflare/cloudflare_pipeline_sink`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/README_CLOUDFLARE_PIPELINE_SINK.md) |
| DNS (incomplete) | [`v1/modules/dev/cloudflare/dns`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/README_DNS.md) |

### DigitalOcean

| Module | Path | README |
|---|---|---|
| Droplet | [`v1/modules/dev/digitalocean/digitalocean_droplet`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/README_DIGITALOCEAN_DROPLET.md) |
| Droplet autoscale | [`v1/modules/dev/digitalocean/digitalocean_droplet_autoscale`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/README_DIGITALOCEAN_DROPLET_AUTOSCALE.md) |
| Droplet (legacy) | [`v1/modules/dev/digitalocean/droplet`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/README_DROPLET.md) |

### GCP

| Module | Path | README |
|---|---|---|
| Compute Engine instance | [`v1/modules/dev/gcp/google_compute_instance`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md) |
| Cloud SQL instance | [`v1/modules/dev/gcp/google_sql_database_instance`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/README_GOOGLE_SQL_DATABASE_INSTANCE.md) |
| Cloud Storage bucket | [`v1/modules/dev/gcp/google_storage_bucket`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/README_GOOGLE_STORAGE_BUCKET.md) |
| Cloud Storage object | [`v1/modules/dev/gcp/google_storage_bucket_object`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/README_GOOGLE_STORAGE_BUCKET_OBJECT.md) |
| Compute Engine (legacy demo) | [`v1/modules/dev/gcp/compute`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/README_COMPUTE.md) |

### Hetzner

| Module | Path | README |
|---|---|---|
| Cloud server | [`v1/modules/dev/hetzner/hcloud_server`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/README_HCLOUD_SERVER.md) |
| Firewall | [`v1/modules/dev/hetzner/hcloud_firewall`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/README_HCLOUD_FIREWALL.md) |
| Network | [`v1/modules/dev/hetzner/hcloud_network`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/README_HCLOUD_NETWORK.md) |
| Floating IP | [`v1/modules/dev/hetzner/hcloud_floating_ip`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/README_HCLOUD_FLOATING_IP.md) |
| Volume | [`v1/modules/dev/hetzner/hcloud_volume`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/README_HCLOUD_VOLUME.md) |
| Volume attachment | [`v1/modules/dev/hetzner/hcloud_volume_attachment`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment) | [README](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/README_HCLOUD_VOLUME_ATTACHMENT.md) |

## Kubernetes stacks

| Stack | Path | Description |
|---|---|---|
| Civo Traefik | `v1/k8s/civo-traefik/dev` | Civo cluster wiring for Traefik and cert-manager |

## Docs map

| Doc | Covers |
|---|---|
| [Terraform rules](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md) | `TF_VAR_*` inputs, layout, secrets |
| [S3 remote state](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md) | Bucket bootstrap and `terraform init` |
| Per-project `README_<RESOURCE>.md` | Implementation and usage for that module |
| [Hetzner hcloud_server](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server.md) | Extra overview (inputs/outputs split) |
| [Hetzner inputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/inputs.md) | Module variables |
| [Hetzner outputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/outputs.md) | Module outputs |
````

### `v1/k8s/civo-traefik/dev`

#### `README_K8S.md`

File: [v1/k8s/civo-traefik/dev/README_K8S.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/README_K8S.md)

```markdown

```

#### `cermanager.tf`

File: [v1/k8s/civo-traefik/dev/cermanager.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/cermanager.tf)

```hcl
resource "kubernetes_namespace" "certmanager" {

  depends_on = [
    time_sleep.wait_for_kubernetes
  ]

  metadata {
    name = "certmanager"
  }

}

resource "helm_release" "certmanager" {

  depends_on = [
    kubernetes_namespace.certmanager
  ]

  name      = "certmanager"
  namespace = "certmanager"

  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"

  # Install Kubernetes CRDs
  set {
    name  = "installCRDs"
    value = "true"
  }
}

resource "time_sleep" "wait_for_certmanager" {

  depends_on = [
    helm_release.certmanager
  ]

  create_duration = "40s"
}

# Create a ClusterIssuer

resource "kubectl_manifest" "cloudflare_prod" {

  depends_on = [
    time_sleep.wait_for_certmanager
  ]

  # TODO: add your mail address according to your configuration and API authentication settings!
  # ---
  yaml_body = <<YAML
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: cloudflare-prod
spec:
  acme:
    email: yabin.monroy.1@gmail.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: cloudflare-prod-account-key
    solvers:
    - dns01:
        cloudflare:
          email: yabin.monroy.1@gmail.com
          apiKeySecretRef:
            name: cloudflare-api-key-secret
            key: api-key
    YAML
}

resource "time_sleep" "wait_for_clusterissuer" {

  depends_on = [
    kubectl_manifest.cloudflare_prod
  ]

  create_duration = "30s"
}
```

#### `civo.tf`

File: [v1/k8s/civo-traefik/dev/civo.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/civo.tf)

```hcl
# Kubernetes Cluster

data "civo_size" "medium" {

  # TODO: (optional): change the values according to your desired instance image sizing
  # ---
  filter {
    key      = "name"
    values   = [ var.node-size ]
    match_by = "re"
  }
}

resource "civo_kubernetes_cluster" "k8s_demo_1" {

  name         = var.name
  applications = "argocd"
  firewall_id  = civo_firewall.fw_demo_1.id

  pools {
    size       = element(data.civo_size.medium.sizes, 0).name
    node_count = var.node-count
  }
}

resource "civo_firewall" "fw_demo_1" {
  name                 = "fw_demo_1-firewall"
  create_default_rules = false

  ingress_rule {
    label      = "kubernetes_http"
    protocol   = "tcp"
    port_range = "80"
    cidr       = ["0.0.0.0/0"]
    action     = "allow"
  }

  ingress_rule {
    label      = "kubernetes_https"
    protocol   = "tcp"
    port_range = "443"
    cidr       = ["0.0.0.0/0"]
    action     = "allow"
  }

  ingress_rule {
    label      = "kubernetes_api"
    protocol   = "tcp"
    port_range = "6443"
    cidr       = ["0.0.0.0/0"]
    action     = "allow"
  }
}

resource "time_sleep" "wait_for_kubernetes" {

  depends_on = [
    civo_kubernetes_cluster.k8s_demo_1
  ]

  create_duration = "20s"
}
```

#### `data.tf`

File: [v1/k8s/civo-traefik/dev/data.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/data.tf)

```hcl
data "civo_loadbalancer" "traefik_lb" {

  depends_on = [
    helm_release.traefik
  ]

  name = "k8s_demo_1-traefik-traefik"
}
```

#### `output.tf`

File: [v1/k8s/civo-traefik/dev/output.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/output.tf)

```hcl
output "load_balancer_ip" {
  value = data.civo_loadbalancer.traefik_lb.public_ip
  //value = civo_loadbalancer.traefik_lb.ip_address
  description = "The IP address of the load balancer for the Traefik ingress controller."
}
```

#### `provider.tf`

File: [v1/k8s/civo-traefik/dev/provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/provider.tf)

```hcl
terraform {

  required_version = ">= 0.13.0"

  required_providers {
    civo = {
      source  = "civo/civo"
      version = "~> 1.1.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "2.16.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.33.0"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "1.14.0"
    }
  }
}

data "civo_kubernetes_cluster" "k8s_demo_1" {
  depends_on = [
    civo_kubernetes_cluster.k8s_demo_1
  ]
  name = "k8s_demo_1"
}


provider "civo" {
  token = var.civo-token
  region = var.region
}

provider "helm" {
  kubernetes {
    host                   = yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.server
    client_certificate     = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-certificate-data)
    client_key             = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-key-data)
    cluster_ca_certificate = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.certificate-authority-data)
  }
}

provider "kubernetes" {
  host                   = yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.server
  client_certificate     = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-certificate-data)
  client_key             = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-key-data)
  cluster_ca_certificate = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.certificate-authority-data)
}

provider "kubectl" {
  host                   = yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.server
  client_certificate     = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-certificate-data)
  client_key             = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-key-data)
  cluster_ca_certificate = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.certificate-authority-data)
  load_config_file       = false
}
```

#### `traefik.tf`

File: [v1/k8s/civo-traefik/dev/traefik.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/traefik.tf)

```hcl
# Traefik Deployment

resource "kubernetes_namespace" "traefik" {
    
    depends_on = [
        time_sleep.wait_for_kubernetes
    ]

    metadata {
        name = "traefik"
    }
}

resource "helm_release" "traefik" {
    depends_on = [
        kubernetes_namespace.traefik
    ]

    name = "traefik"
    namespace = "traefik"

    repository = "https://helm.traefik.io/traefik"
    chart = "traefik"

    # Set Traefik as the Default Ingress Controller
    set {
        name  = "ingressClass.enabled"
        value = "true"
    }
    set {
        name  = "ingressClass.isDefaultClass"
        value = "true"
    }
    
    # Default Redirect
    /*set {
        name  = "ports.web.redirectTo"
        value = "websecure"
    }*/

    # Enable TLS on Websecure
    set {
        name  = "ports.websecure.tls.enabled"
        value = "true"
    }
}
```

#### `variables.tf`

File: [v1/k8s/civo-traefik/dev/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik/dev/variables.tf)

```hcl
variable "civo-token" {
  type = string
  sensitive = true
}

variable "name" {
  type = string
  default = "k8s_demo_1"
}

variable "node-count" {
  type = number
  default = 2
}

variable "node-size" {
  type = string
  default = "g4s.kube.medium"
}

/*variable "organization" {
  type = string
  default = "k8s-civo"
}

variable "workspaces" {
  type = string
  default = "k8s-civo"
}*/

variable "region" {
  type = string
  default = "NYC1"
}
```

### `v1/modules/dev`

#### `BACKEND_S3.md`

File: [v1/modules/dev/BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md)

````markdown
# S3 remote state

Every project under `v1/modules/dev/` stores Terraform state in the bucket created by `aws/aws_s3_bucket`. Bucket, key, region, and encrypt are **not** hardcoded. Terraform cannot read env vars inside a `backend` block, so pass them at init:

```bash
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/<provider>/<resource>/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"
terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

- `TF_STATE_BUCKET` must match the name used when applying `aws/aws_s3_bucket` (`TF_VAR_name`).
- `TF_STATE_KEY_PREFIX` is the S3 object key for this project's state. Use a unique value per project so states do not overwrite each other.
- `TF_STATE_REGION` must match the bucket region (`TF_VAR_region` on the S3 module).
- `TF_STATE_ENCRYPT` is `true` or `false`.

## Bootstrap

1. Create the bucket (local state, once):

```bash
cd v1/modules/dev/aws/aws_s3_bucket
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="your-bucket-name"
export TF_VAR_region="us-east-1"
export TF_STATE_BUCKET="$TF_VAR_name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_s3_bucket/terraform.tfstate"
export TF_STATE_REGION="$TF_VAR_region"
export TF_STATE_ENCRYPT="true"

terraform init -backend=false
terraform apply
terraform init -migrate-state \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

2. Init any other module:

```bash
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/<provider>/<resource>/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"
cd v1/modules/dev/<provider>/<resource>
terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

If any of these env vars is unset, `terraform init` fails or prompts — there are no defaults in `backend.tf`.
````

#### `TERRAFORM_RULES.md`

File: [v1/modules/dev/TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md)

````markdown
# Terraform rules

Rules for every project under `v1/modules/dev/<provider>/<resource>/`. Remote state is documented in [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md).

## Variables

Every input is a `variable` in `variables.tf`. Terraform reads it from the environment variable `TF_VAR_<name>` (`variable "name"` ← `TF_VAR_name`).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="dev-box"
export TF_VAR_ipv4_enabled=true
terraform apply
```

- Set the value with `TF_VAR_*` before `plan` or `apply`. Do not pass `-var` or `-var-file`, and do not commit `terraform.tfvars`. `*.tfvars` and `*.tfvars.json` are gitignored.
- Names are `snake_case` so they are valid env vars. `TF_VAR_civo-token` is not a valid shell variable; use `civo_token`.
- Each `description` says the value is set via `TF_VAR_<name>`.
- Secrets (tokens, access keys, private material) are `sensitive = true` and have no `default`.
- A non-secret variable may have a `default`. `TF_VAR_*` overrides that default. If the variable has no default and `TF_VAR_*` is unset, Terraform prompts or fails — do not rely on the prompt.
- Lists, maps, and objects are JSON in the env var: `export TF_VAR_tags='{"env":"dev"}'`.

Provider blocks take credentials from those variables (`access_key = var.aws_access_key_id`), not from literals in `.tf` files.

## Backend

`backend "s3" {}` stays empty. Bucket, key, region, and encrypt are `TF_STATE_*` values passed at `terraform init -backend-config`. Terraform cannot read variables or env vars inside a `backend` block.

The S3 backend authenticates with `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, not `TF_VAR_*`. When the same keys are also provider inputs, export both:

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
```

One state object per project. `TF_STATE_KEY_PREFIX` is `v1/modules/dev/<provider>/<resource>/terraform.tfstate`.

## Project layout

Each directory is its own root module:

- `variables.tf` — inputs
- `main.tf` or `<resource>.tf` — resources; provider block may live here or in `provider.tf`
- `outputs.tf` — values other workflows need (ids, addresses). Do not output secrets.
- `backend.tf` — empty `backend "s3" {}` plus the init comment from [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md)
- `README_<RESOURCE>.md` — how the project is implemented (resources, files, provider) and how to use it (`TF_VAR_*` init/apply, inputs, outputs)

`required_version` is `>= 1.3`. Pin the provider with `required_providers`.

Do not commit `.terraform/`, `*.tfstate`, credentials, or `*.tfvars`.
````

### `v1/modules/dev/aws/aws_db_instance`

#### `README_AWS_DB_INSTANCE.md`

File: [v1/modules/dev/aws/aws_db_instance/README_AWS_DB_INSTANCE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/README_AWS_DB_INSTANCE.md)

````markdown
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

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

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
````

#### `backend.tf`

File: [v1/modules/dev/aws/aws_db_instance/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/aws/aws_db_instance/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/main.tf)

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.3"
}

provider "aws" {
  region     = var.region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

resource "aws_db_instance" "this" {
  identifier              = var.name
  allocated_storage       = var.allocated_storage
  engine                  = var.engine
  engine_version          = var.engine_version == "" ? null : var.engine_version
  instance_class          = var.instance_class
  db_name                 = var.db_name == "" ? null : var.db_name
  username                = var.username
  password                = var.manage_master_user_password ? null : var.password
  manage_master_user_password = var.manage_master_user_password
  parameter_group_name    = var.parameter_group_name == "" ? null : var.parameter_group_name
  db_subnet_group_name    = var.db_subnet_group_name == "" ? null : var.db_subnet_group_name
  vpc_security_group_ids  = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : null
  publicly_accessible     = var.publicly_accessible
  multi_az                = var.multi_az
  storage_encrypted       = var.storage_encrypted
  skip_final_snapshot     = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : (var.final_snapshot_identifier != "" ? var.final_snapshot_identifier : "${var.name}-final")
  backup_retention_period = var.backup_retention_period
  deletion_protection     = var.deletion_protection
  port                    = var.port > 0 ? var.port : null

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/aws/aws_db_instance/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/outputs.tf)

```hcl
output "db_instance_id" {
  value       = aws_db_instance.this.id
  description = "RDS instance ID (maps to workflow resource_id)"
}

output "db_instance_arn" {
  value       = aws_db_instance.this.arn
  description = "ARN of the RDS instance"
}

output "db_instance_endpoint" {
  value       = aws_db_instance.this.endpoint
  description = "Connection endpoint (address:port)"
}

output "db_instance_address" {
  value       = aws_db_instance.this.address
  description = "Hostname of the RDS instance"
}
```

#### `variables.tf`

File: [v1/modules/dev/aws/aws_db_instance/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_db_instance/variables.tf)

```hcl
variable "aws_access_key_id" {
  description = "AWS access key ID (set via TF_VAR_aws_access_key_id)"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key (set via TF_VAR_aws_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "RDS instance identifier (set via TF_VAR_name)"
  type        = string
  default     = "snow-db"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "allocated_storage" {
  description = "Allocated storage in GiB (set via TF_VAR_allocated_storage)"
  type        = number
  default     = 20
}

variable "engine" {
  description = "Database engine (set via TF_VAR_engine)"
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "Engine version (set via TF_VAR_engine_version). Empty uses AWS default."
  type        = string
  default     = ""
}

variable "instance_class" {
  description = "RDS instance class (set via TF_VAR_instance_class)"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Optional initial database name (set via TF_VAR_db_name)"
  type        = string
  default     = ""
}

variable "username" {
  description = "Master username (set via TF_VAR_username)"
  type        = string
  default     = "snowadmin"
}

variable "password" {
  description = "Master password (set via TF_VAR_password). Required unless manage_master_user_password is true."
  type        = string
  default     = ""
  sensitive   = true
}

variable "manage_master_user_password" {
  description = "Let RDS manage the master password in Secrets Manager (set via TF_VAR_manage_master_user_password)"
  type        = bool
  default     = true
}

variable "parameter_group_name" {
  description = "Optional parameter group name (set via TF_VAR_parameter_group_name)"
  type        = string
  default     = ""
}

variable "db_subnet_group_name" {
  description = "Optional DB subnet group (set via TF_VAR_db_subnet_group_name)"
  type        = string
  default     = ""
}

variable "vpc_security_group_ids" {
  description = "Security group IDs (set via TF_VAR_vpc_security_group_ids as JSON)"
  type        = list(string)
  default     = []
}

variable "publicly_accessible" {
  description = "Whether the DB is publicly accessible (set via TF_VAR_publicly_accessible)"
  type        = bool
  default     = false
}

variable "multi_az" {
  description = "Multi-AZ deployment (set via TF_VAR_multi_az)"
  type        = bool
  default     = false
}

variable "storage_encrypted" {
  description = "Encrypt storage (set via TF_VAR_storage_encrypted)"
  type        = bool
  default     = true
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot on destroy (set via TF_VAR_skip_final_snapshot)"
  type        = bool
  default     = true
}

variable "final_snapshot_identifier" {
  description = "Final snapshot id when skip_final_snapshot is false (set via TF_VAR_final_snapshot_identifier)"
  type        = string
  default     = ""
}

variable "backup_retention_period" {
  description = "Backup retention days (set via TF_VAR_backup_retention_period)"
  type        = number
  default     = 0
}

variable "deletion_protection" {
  description = "Enable deletion protection (set via TF_VAR_deletion_protection)"
  type        = bool
  default     = false
}

variable "port" {
  description = "Database port (set via TF_VAR_port). 0 uses engine default."
  type        = number
  default     = 0
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/aws/aws_ebs_volume`

#### `README_AWS_EBS_VOLUME.md`

File: [v1/modules/dev/aws/aws_ebs_volume/README_AWS_EBS_VOLUME.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/README_AWS_EBS_VOLUME.md)

````markdown
# AWS EBS volume

Creates a standalone EBS volume. It does not attach the volume to an instance.

**Path:** `v1/modules/dev/aws/aws_ebs_volume`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `aws_ebs_volume` | `this` | Volume in `availability_zone`, size `size` GiB, type `volume_type`. |

Provider `hashicorp/aws` `~> 6.0`. Encryption is on by default. `iops`, `throughput`, `snapshot_id`, and `kms_key_id` are omitted when they are `0` or empty. Tags merge `managed_by=terraform`, `Name`, and `var.tags`.

```
main.tf        # provider, volume
variables.tf   # inputs
outputs.tf     # volume_id, volume_arn, availability_zone
backend.tf     # backend "s3" {}
```

`availability_zone` has no default; it must match the AZ of any instance you attach later.

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="snow-ebs"
export TF_VAR_availability_zone="us-east-1a"
export TF_VAR_size=20
export TF_VAR_volume_type="gp3"
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_ebs_volume/terraform.tfstate"
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
terraform output -raw volume_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. |
| `availability_zone` | yes | — | no | AZ, e.g. `us-east-1a`. |
| `name` | no | `snow-ebs` | no | Name tag. |
| `region` | no | `us-east-1` | no | Region. |
| `size` | no | `20` | no | Size GiB. |
| `volume_type` | no | `gp3` | no | Volume type. |
| `encrypted` | no | `true` | no | Encrypt the volume. |
| `iops` | no | `0` | no | `0` omits. |
| `throughput` | no | `0` | no | `0` omits (gp3). |
| `snapshot_id` | no | `""` | no | Optional snapshot. |
| `kms_key_id` | no | `""` | no | Optional KMS key. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `volume_id` | `aws_ebs_volume.this.id` | Volume ID. |
| `volume_arn` | `.arn` | ARN. |
| `availability_zone` | `.availability_zone` | AZ. |

## Docs

- [aws_ebs_volume](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ebs_volume)
````

#### `backend.tf`

File: [v1/modules/dev/aws/aws_ebs_volume/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/aws/aws_ebs_volume/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/main.tf)

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.3"
}

provider "aws" {
  region     = var.region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

resource "aws_ebs_volume" "this" {
  availability_zone = var.availability_zone
  size              = var.size
  type              = var.volume_type
  encrypted         = var.encrypted
  iops              = var.iops > 0 ? var.iops : null
  throughput        = var.throughput > 0 ? var.throughput : null
  snapshot_id       = var.snapshot_id != "" ? var.snapshot_id : null
  kms_key_id        = var.kms_key_id != "" ? var.kms_key_id : null

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/aws/aws_ebs_volume/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/outputs.tf)

```hcl
output "volume_id" {
  value       = aws_ebs_volume.this.id
  description = "EBS volume ID (maps to workflow resource_id)"
}

output "volume_arn" {
  value       = aws_ebs_volume.this.arn
  description = "ARN of the EBS volume"
}

output "availability_zone" {
  value       = aws_ebs_volume.this.availability_zone
  description = "Availability zone of the volume"
}
```

#### `variables.tf`

File: [v1/modules/dev/aws/aws_ebs_volume/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_ebs_volume/variables.tf)

```hcl
variable "aws_access_key_id" {
  description = "AWS access key ID (set via TF_VAR_aws_access_key_id)"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key (set via TF_VAR_aws_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name tag for the volume (set via TF_VAR_name)"
  type        = string
  default     = "snow-ebs"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "availability_zone" {
  description = "AZ for the volume (set via TF_VAR_availability_zone)"
  type        = string
}

variable "size" {
  description = "Size in GiB (set via TF_VAR_size)"
  type        = number
  default     = 20
}

variable "volume_type" {
  description = "Volume type e.g. gp3, io2 (set via TF_VAR_volume_type)"
  type        = string
  default     = "gp3"
}

variable "encrypted" {
  description = "Encrypt the volume (set via TF_VAR_encrypted)"
  type        = bool
  default     = true
}

variable "iops" {
  description = "IOPS when supported (set via TF_VAR_iops). 0 omits the attribute."
  type        = number
  default     = 0
}

variable "throughput" {
  description = "Throughput in MiB/s for gp3 (set via TF_VAR_throughput). 0 omits the attribute."
  type        = number
  default     = 0
}

variable "snapshot_id" {
  description = "Optional snapshot ID (set via TF_VAR_snapshot_id)"
  type        = string
  default     = ""
}

variable "kms_key_id" {
  description = "Optional KMS key ID/ARN (set via TF_VAR_kms_key_id)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/aws/aws_elastic_beanstalk_application`

#### `README_AWS_ELASTIC_BEANSTALK_APPLICATION.md`

File: [v1/modules/dev/aws/aws_elastic_beanstalk_application/README_AWS_ELASTIC_BEANSTALK_APPLICATION.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/README_AWS_ELASTIC_BEANSTALK_APPLICATION.md)

````markdown
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

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

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
````

#### `backend.tf`

File: [v1/modules/dev/aws/aws_elastic_beanstalk_application/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/aws/aws_elastic_beanstalk_application/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/main.tf)

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.3"
}

provider "aws" {
  region     = var.region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

resource "aws_elastic_beanstalk_application" "this" {
  name        = var.name
  description = var.description == "" ? null : var.description

  dynamic "appversion_lifecycle" {
    for_each = var.appversion_lifecycle_service_role != "" ? [1] : []
    content {
      service_role          = var.appversion_lifecycle_service_role
      max_count             = var.appversion_lifecycle_max_count > 0 ? var.appversion_lifecycle_max_count : null
      max_age_in_days       = var.appversion_lifecycle_max_age_in_days > 0 ? var.appversion_lifecycle_max_age_in_days : null
      delete_source_from_s3 = var.appversion_lifecycle_delete_source_from_s3
    }
  }

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/aws/aws_elastic_beanstalk_application/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/outputs.tf)

```hcl
output "application_name" {
  value       = aws_elastic_beanstalk_application.this.name
  description = "Elastic Beanstalk application name (maps to workflow resource_id)"
}

output "application_arn" {
  value       = aws_elastic_beanstalk_application.this.arn
  description = "ARN of the Elastic Beanstalk application"
}
```

#### `variables.tf`

File: [v1/modules/dev/aws/aws_elastic_beanstalk_application/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_elastic_beanstalk_application/variables.tf)

```hcl
variable "aws_access_key_id" {
  description = "AWS access key ID (set via TF_VAR_aws_access_key_id)"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key (set via TF_VAR_aws_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Elastic Beanstalk application name (set via TF_VAR_name)"
  type        = string
  default     = "snow-beanstalk-app"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "description" {
  description = "Optional application description (set via TF_VAR_description)"
  type        = string
  default     = ""
}

variable "appversion_lifecycle_service_role" {
  description = "IAM service role ARN for app version lifecycle (set via TF_VAR_appversion_lifecycle_service_role). Empty disables lifecycle block."
  type        = string
  default     = ""
}

variable "appversion_lifecycle_max_count" {
  description = "Max application versions to retain (set via TF_VAR_appversion_lifecycle_max_count). 0 omits."
  type        = number
  default     = 0
}

variable "appversion_lifecycle_max_age_in_days" {
  description = "Max age in days for versions (set via TF_VAR_appversion_lifecycle_max_age_in_days). 0 omits."
  type        = number
  default     = 0
}

variable "appversion_lifecycle_delete_source_from_s3" {
  description = "Delete source bundle from S3 when version is deleted (set via TF_VAR_appversion_lifecycle_delete_source_from_s3)"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/aws/aws_instance`

#### `README_AWS_INSTANCE.md`

File: [v1/modules/dev/aws/aws_instance/README_AWS_INSTANCE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/README_AWS_INSTANCE.md)

````markdown
# AWS EC2 instance

Creates an EC2 instance (`aws_instance`). If `ssh_public_key` is set, also creates an `aws_key_pair` and attaches it.

**Path:** `v1/modules/dev/aws/aws_instance`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `aws_key_pair` | `this` | Created only when `ssh_public_key` is non-empty. Named `${var.name}-key`. |
| `aws_instance` | `this` | EC2 VM. Key is the new pair, else `key_name`, else none. |

Provider `hashicorp/aws` `~> 6.0`. Credentials from `TF_VAR_aws_access_key_id` / `TF_VAR_aws_secret_access_key`. Empty `subnet_id` or security-group list leaves default-VPC behavior. Tags merge `managed_by=terraform`, `Name`, and `var.tags`.

SSH key selection: new key pair if `ssh_public_key` is set, otherwise existing `key_name`, otherwise no key.

```
main.tf        # provider, optional key pair, instance
variables.tf   # inputs
outputs.tf     # instance_id, public_ip, private_ip, instance_state
backend.tf     # backend "s3" {}
```

This module does not create a VPC, security group, or EBS volume.

## Usage

Remote state is the bucket from `aws/aws_s3_bucket` ([BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md)). Set inputs with `TF_VAR_*` ([TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md)).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="snow-server"
export TF_VAR_ami="ami-xxxxxxxx"
export TF_VAR_server_type="t3.micro"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_instance/terraform.tfstate"
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
terraform output -raw public_ip
ssh ubuntu@$(terraform output -raw public_ip)
```

Destroy with `terraform destroy` from this directory.

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. |
| `ami` | yes | — | no | AMI ID. |
| `name` | no | `snow-server` | no | Name tag and key-pair prefix. |
| `region` | no | `us-east-1` | no | Region. |
| `server_type` | no | `t3.micro` | no | Instance type. |
| `subnet_id` | no | `""` | no | Empty uses default VPC. |
| `vpc_security_group_ids` | no | `[]` | no | Security groups. JSON list in the env var. |
| `associate_public_ip_address` | no | `true` | no | Assign a public IP. |
| `ssh_public_key` | no | `""` | yes | Creates a key pair when set. |
| `key_name` | no | `""` | no | Existing key if no public key. |
| `user_data` | no | `""` | no | Cloud-init / user data. |
| `availability_zone` | no | `""` | no | Optional AZ. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `instance_id` | `aws_instance.this.id` | Instance ID. |
| `public_ip` | `.public_ip` | Public IPv4 (workflow `server_ip`). |
| `private_ip` | `.private_ip` | Private IPv4. |
| `instance_state` | `.instance_state` | Instance state. |

## Docs

- [aws_instance](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance)
- [aws_key_pair](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/key_pair)
````

#### `backend.tf`

File: [v1/modules/dev/aws/aws_instance/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/aws/aws_instance/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/main.tf)

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.3"
}

provider "aws" {
  region     = var.region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

resource "aws_key_pair" "this" {
  count      = var.ssh_public_key != "" ? 1 : 0
  key_name   = "${var.name}-key"
  public_key = var.ssh_public_key

  tags = merge(
    {
      managed_by = "terraform"
      Name       = "${var.name}-key"
    },
    var.tags,
  )
}

resource "aws_instance" "this" {
  ami                         = var.ami
  instance_type               = var.server_type
  subnet_id                   = var.subnet_id == "" ? null : var.subnet_id
  vpc_security_group_ids      = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : null
  associate_public_ip_address = var.associate_public_ip_address
  key_name                    = var.ssh_public_key != "" ? aws_key_pair.this[0].key_name : (var.key_name == "" ? null : var.key_name)
  user_data                   = var.user_data == "" ? null : var.user_data
  availability_zone           = var.availability_zone == "" ? null : var.availability_zone

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/aws/aws_instance/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/outputs.tf)

```hcl
output "instance_id" {
  value       = aws_instance.this.id
  description = "EC2 instance ID"
}

output "public_ip" {
  value       = aws_instance.this.public_ip
  description = "Public IP address (maps to workflow server_ip)"
}

output "server_ipv4" {
  value       = aws_instance.this.public_ip
  description = "Alias of public_ip for the Snow workflow server_ip contract"
}

output "private_ip" {
  value       = aws_instance.this.private_ip
  description = "Private IP address"
}

output "instance_state" {
  value       = aws_instance.this.instance_state
  description = "State of the instance"
}
```

#### `variables.tf`

File: [v1/modules/dev/aws/aws_instance/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_instance/variables.tf)

```hcl
variable "aws_access_key_id" {
  description = "AWS access key ID (set via TF_VAR_aws_access_key_id)"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key (set via TF_VAR_aws_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name tag for the instance (set via TF_VAR_name)"
  type        = string
  default     = "snow-server"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "ami" {
  description = "AMI ID for the instance (set via TF_VAR_ami). Alias of workflow image input."
  type        = string
}

variable "server_type" {
  description = "EC2 instance type (set via TF_VAR_server_type)"
  type        = string
  default     = "t3.micro"
}

variable "subnet_id" {
  description = "VPC subnet ID to launch in (set via TF_VAR_subnet_id). Empty uses default VPC behavior."
  type        = string
  default     = ""
}

variable "vpc_security_group_ids" {
  description = "List of security group IDs (set via TF_VAR_vpc_security_group_ids as JSON)"
  type        = list(string)
  default     = []
}

variable "associate_public_ip_address" {
  description = "Associate a public IP (set via TF_VAR_associate_public_ip_address)"
  type        = bool
  default     = true
}

variable "ssh_public_key" {
  description = "SSH public key to create an aws_key_pair (set via TF_VAR_ssh_public_key). Empty skips key creation."
  type        = string
  default     = ""
  sensitive   = true
}

variable "key_name" {
  description = "Existing EC2 key pair name when ssh_public_key is empty (set via TF_VAR_key_name)"
  type        = string
  default     = ""
}

variable "user_data" {
  description = "User data script (set via TF_VAR_user_data)"
  type        = string
  default     = ""
}

variable "availability_zone" {
  description = "Optional AZ (set via TF_VAR_availability_zone)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/aws/aws_lambda_function`

#### `README_AWS_LAMBDA_FUNCTION.md`

File: [v1/modules/dev/aws/aws_lambda_function/README_AWS_LAMBDA_FUNCTION.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/README_AWS_LAMBDA_FUNCTION.md)

````markdown
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

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

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
````

#### `backend.tf`

File: [v1/modules/dev/aws/aws_lambda_function/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/aws/aws_lambda_function/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/main.tf)

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.3"
}

provider "aws" {
  region     = var.region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

data "aws_iam_policy_document" "assume_role" {
  count = var.role_arn == "" ? 1 : 0

  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "this" {
  count              = var.role_arn == "" ? 1 : 0
  name               = "${var.name}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role[0].json

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}

resource "aws_iam_role_policy_attachment" "basic" {
  count      = var.role_arn == "" ? 1 : 0
  role       = aws_iam_role.this[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "this" {
  function_name = var.name
  role          = var.role_arn != "" ? var.role_arn : aws_iam_role.this[0].arn
  handler       = var.package_type == "Zip" ? var.handler : null
  runtime       = var.package_type == "Zip" ? var.runtime : null
  filename      = var.filename != "" ? var.filename : null
  s3_bucket     = var.s3_bucket != "" ? var.s3_bucket : null
  s3_key        = var.s3_key != "" ? var.s3_key : null
  image_uri     = var.image_uri != "" ? var.image_uri : null
  package_type  = var.package_type
  memory_size   = var.memory_size
  timeout       = var.timeout
  architectures = var.architectures
  source_code_hash = var.source_code_hash != "" ? var.source_code_hash : null

  dynamic "environment" {
    for_each = length(var.environment_variables) > 0 ? [1] : []
    content {
      variables = var.environment_variables
    }
  }

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )

  depends_on = [aws_iam_role_policy_attachment.basic]
}
```

#### `outputs.tf`

File: [v1/modules/dev/aws/aws_lambda_function/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/outputs.tf)

```hcl
output "lambda_function_id" {
  value       = aws_lambda_function.this.id
  description = "Lambda function name/ID (maps to workflow resource_id)"
}

output "lambda_function_arn" {
  value       = aws_lambda_function.this.arn
  description = "ARN of the Lambda function"
}

output "invoke_arn" {
  value       = aws_lambda_function.this.invoke_arn
  description = "Invoke ARN for API Gateway integrations"
}
```

#### `variables.tf`

File: [v1/modules/dev/aws/aws_lambda_function/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_lambda_function/variables.tf)

```hcl
variable "aws_access_key_id" {
  description = "AWS access key ID (set via TF_VAR_aws_access_key_id)"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key (set via TF_VAR_aws_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Lambda function name (set via TF_VAR_name)"
  type        = string
  default     = "snow-lambda"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "role_arn" {
  description = "Existing IAM role ARN (set via TF_VAR_role_arn). Empty creates a basic execution role."
  type        = string
  default     = ""
}

variable "handler" {
  description = "Lambda handler for Zip packages (set via TF_VAR_handler)"
  type        = string
  default     = "index.handler"
}

variable "runtime" {
  description = "Lambda runtime (set via TF_VAR_runtime)"
  type        = string
  default     = "nodejs20.x"
}

variable "filename" {
  description = "Local path to deployment zip (set via TF_VAR_filename). Conflicts with s3_bucket/image_uri."
  type        = string
  default     = ""
}

variable "s3_bucket" {
  description = "S3 bucket with deployment package (set via TF_VAR_s3_bucket)"
  type        = string
  default     = ""
}

variable "s3_key" {
  description = "S3 key of deployment package (set via TF_VAR_s3_key)"
  type        = string
  default     = ""
}

variable "image_uri" {
  description = "ECR image URI for Image package type (set via TF_VAR_image_uri)"
  type        = string
  default     = ""
}

variable "package_type" {
  description = "Zip or Image (set via TF_VAR_package_type)"
  type        = string
  default     = "Zip"
}

variable "memory_size" {
  description = "Memory in MB (set via TF_VAR_memory_size)"
  type        = number
  default     = 128
}

variable "timeout" {
  description = "Timeout in seconds (set via TF_VAR_timeout)"
  type        = number
  default     = 3
}

variable "architectures" {
  description = "Instruction set architectures (set via TF_VAR_architectures as JSON)"
  type        = list(string)
  default     = ["x86_64"]
}

variable "source_code_hash" {
  description = "Optional hash to trigger updates (set via TF_VAR_source_code_hash)"
  type        = string
  default     = ""
}

variable "environment_variables" {
  description = "Environment variables map (set via TF_VAR_environment_variables as JSON)"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/aws/aws_s3_bucket`

#### `README_AWS_S3_BUCKET.md`

File: [v1/modules/dev/aws/aws_s3_bucket/README_AWS_S3_BUCKET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/README_AWS_S3_BUCKET.md)

````markdown
# AWS S3 bucket

Creates the Amazon S3 bucket used as remote Terraform state for every project under `v1/modules/dev/`. Also enables versioning, AES256 encryption, and a public-access block.

**Path:** `v1/modules/dev/aws/aws_s3_bucket`

Apply this project first (local state), then migrate it into itself. Other modules init against this bucket. See [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md).

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `aws_s3_bucket` | `this` | Bucket named `var.name`. Tagged `managed_by=terraform` and `purpose=terraform-state`. |
| `aws_s3_bucket_versioning` | `this` | Versioning `Enabled` so state history is kept. |
| `aws_s3_bucket_server_side_encryption_configuration` | `this` | SSE-S3 (`AES256`). |
| `aws_s3_bucket_public_access_block` | `this` | All four public-access blocks on. |

Provider `hashicorp/aws` `~> 6.0`. Credentials: `TF_VAR_aws_access_key_id` / `TF_VAR_aws_secret_access_key`. Region: `TF_VAR_region`. The S3 backend block in `backend.tf` is empty and is filled at init.

```
main.tf        # provider, bucket, versioning, encryption, public-access block
variables.tf   # inputs
outputs.tf     # bucket_id, bucket_arn, bucket_region
backend.tf     # backend "s3" {}
```

`force_destroy` defaults to `false`. This module does not add a bucket policy or lifecycle rules.

## Usage

Do not pass `-var` or commit `terraform.tfvars`. Set inputs with `TF_VAR_*` ([TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md)).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="my-unique-bucket"
export TF_VAR_region="us-east-1"
export TF_STATE_BUCKET="$TF_VAR_name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_s3_bucket/terraform.tfstate"
export TF_STATE_REGION="$TF_VAR_region"
export TF_STATE_ENCRYPT="true"

terraform init -backend=false
terraform apply
terraform init -migrate-state \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

Then init other modules with the same `TF_STATE_BUCKET` / `TF_STATE_REGION` and a unique `TF_STATE_KEY_PREFIX` per project.

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. `TF_VAR_aws_access_key_id`. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. `TF_VAR_aws_secret_access_key`. |
| `name` | no | `snow-backup` | no | Globally unique bucket name. |
| `region` | no | `us-east-1` | no | Bucket region. Must match `TF_STATE_REGION`. |
| `force_destroy` | no | `false` | no | Allow destroy when the bucket is not empty. |
| `tags` | no | `{}` | no | Extra tags (JSON in the env var). |

## Outputs

| Name | Source | Description |
|---|---|---|
| `bucket_id` | `aws_s3_bucket.this.id` | Bucket name (workflow `resource_id`). |
| `bucket_arn` | `.arn` | Bucket ARN. |
| `bucket_region` | `.bucket_region` | Region. |

```bash
terraform output -raw bucket_id
```

## Docs

- [aws_s3_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)
- [S3 remote state](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md)
````

#### `backend.tf`

File: [v1/modules/dev/aws/aws_s3_bucket/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/backend.tf)

```hcl
# Bootstrap: first apply this module with local state
#   terraform init -backend=false && terraform apply
# Then migrate:
#   terraform init -migrate-state \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
#
# Bucket: TF_STATE_BUCKET. Key: TF_STATE_KEY_PREFIX.
# Region: TF_STATE_REGION. Encrypt: TF_STATE_ENCRYPT.
# Terraform cannot interpolate env vars in backend blocks.
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (not TF_VAR_*).
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/aws/aws_s3_bucket/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/main.tf)

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.3"
}

provider "aws" {
  region     = var.region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

resource "aws_s3_bucket" "this" {
  bucket        = var.name
  force_destroy = var.force_destroy

  tags = merge(
    {
      managed_by = "terraform"
      purpose    = "terraform-state"
    },
    var.tags,
  )
}

resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

#### `outputs.tf`

File: [v1/modules/dev/aws/aws_s3_bucket/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/outputs.tf)

```hcl
output "bucket_id" {
  value       = aws_s3_bucket.this.id
  description = "Name/ID of the S3 bucket (maps to workflow resource_id)"
}

output "bucket_arn" {
  value       = aws_s3_bucket.this.arn
  description = "ARN of the S3 bucket"
}

output "bucket_region" {
  value       = aws_s3_bucket.this.bucket_region
  description = "AWS region of the S3 bucket"
}
```

#### `variables.tf`

File: [v1/modules/dev/aws/aws_s3_bucket/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket/variables.tf)

```hcl
variable "aws_access_key_id" {
  description = "AWS access key ID (set via TF_VAR_aws_access_key_id)"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key (set via TF_VAR_aws_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the S3 bucket (set via TF_VAR_name). Must be globally unique."
  type        = string
  default     = "snow-backup"
}

variable "region" {
  description = "AWS region for the bucket (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "force_destroy" {
  description = "Allow terraform destroy to delete all objects in the bucket"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Additional tags to assign to the bucket"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/azure/azurerm_linux_function_app`

#### `README_AZURERM_LINUX_FUNCTION_APP.md`

File: [v1/modules/dev/azure/azurerm_linux_function_app/README_AZURERM_LINUX_FUNCTION_APP.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/README_AZURERM_LINUX_FUNCTION_APP.md)

````markdown
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

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

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
````

#### `backend.tf`

File: [v1/modules/dev/azure/azurerm_linux_function_app/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/azure/azurerm_linux_function_app/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/main.tf)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

resource "azurerm_linux_function_app" "this" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = var.service_plan_id

  storage_account_name       = var.storage_account_name
  storage_account_access_key = var.storage_account_access_key

  site_config {}

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/azure/azurerm_linux_function_app/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/outputs.tf)

```hcl
output "linux_function_app_id" {
  value       = azurerm_linux_function_app.this.id
  description = "ID of the Linux Function App (maps to workflow resource_id)"
}

output "default_hostname" {
  value       = azurerm_linux_function_app.this.default_hostname
  description = "Default hostname of the Linux Function App"
}
```

#### `variables.tf`

File: [v1/modules/dev/azure/azurerm_linux_function_app/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_function_app/variables.tf)

```hcl
variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the Linux Function App (set via TF_VAR_name)"
  type        = string
  default     = "snow-linux-function-app"
}

variable "resource_group_name" {
  description = "Resource group name (set via TF_VAR_resource_group_name)"
  type        = string
}

variable "location" {
  description = "Azure region (set via TF_VAR_location)"
  type        = string
  default     = "westeurope"
}

variable "service_plan_id" {
  description = "App Service Plan ID (set via TF_VAR_service_plan_id)"
  type        = string
}

variable "storage_account_name" {
  description = "Storage account name for the function app (set via TF_VAR_storage_account_name)"
  type        = string
}

variable "storage_account_access_key" {
  description = "Storage account access key (set via TF_VAR_storage_account_access_key)"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/azure/azurerm_linux_web_app`

#### `README_AZURERM_LINUX_WEB_APP.md`

File: [v1/modules/dev/azure/azurerm_linux_web_app/README_AZURERM_LINUX_WEB_APP.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/README_AZURERM_LINUX_WEB_APP.md)

````markdown
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

Remote state uses AWS S3 ([BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md)). Azure credentials are `TF_VAR_*`; S3 backend credentials are `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`. Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

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
````

#### `backend.tf`

File: [v1/modules/dev/azure/azurerm_linux_web_app/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/azure/azurerm_linux_web_app/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/main.tf)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

resource "azurerm_linux_web_app" "this" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = var.service_plan_id

  site_config {
    always_on = var.always_on
  }

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/azure/azurerm_linux_web_app/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/outputs.tf)

```hcl
output "linux_web_app_id" {
  value       = azurerm_linux_web_app.this.id
  description = "ID of the Linux Web App (maps to workflow resource_id)"
}

output "default_hostname" {
  value       = azurerm_linux_web_app.this.default_hostname
  description = "Default hostname of the Linux Web App"
}
```

#### `variables.tf`

File: [v1/modules/dev/azure/azurerm_linux_web_app/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_linux_web_app/variables.tf)

```hcl
variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the Linux Web App (set via TF_VAR_name)"
  type        = string
  default     = "snow-linux-web-app"
}

variable "resource_group_name" {
  description = "Resource group name (set via TF_VAR_resource_group_name)"
  type        = string
}

variable "location" {
  description = "Azure region (set via TF_VAR_location)"
  type        = string
  default     = "westeurope"
}

variable "service_plan_id" {
  description = "App Service Plan ID (set via TF_VAR_service_plan_id)"
  type        = string
}

variable "always_on" {
  description = "Keep the app always on (set via TF_VAR_always_on)"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/azure/azurerm_mssql_database`

#### `README_AZURERM_MSSQL_DATABASE.md`

File: [v1/modules/dev/azure/azurerm_mssql_database/README_AZURERM_MSSQL_DATABASE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/README_AZURERM_MSSQL_DATABASE.md)

````markdown
# Azure SQL Database

Creates an Azure SQL database on an existing MSSQL server.

**Path:** `v1/modules/dev/azure/azurerm_mssql_database`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_mssql_database` | `this` | Database on `server_id`. SKU default `S0`. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. Empty `license_type` and `max_size_gb` of `0` become `null`. Collation defaults to `SQL_Latin1_General_CP1_CI_AS`. Apply `azurerm_mssql_server` first and pass `mssql_server_id` as `TF_VAR_server_id`.

```
main.tf        # provider, database
variables.tf   # inputs
outputs.tf     # mssql_database_id, mssql_database_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snow-mssql-db"
export TF_VAR_server_id="$(terraform -chdir=../azurerm_mssql_server output -raw mssql_server_id)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_mssql_database/terraform.tfstate"
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
terraform output -raw mssql_database_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `server_id` | yes | — | no | Existing MSSQL server ID. |
| `name` | no | `snow-mssql-db` | no | Database name. |
| `collation` | no | `SQL_Latin1_General_CP1_CI_AS` | no | Collation. |
| `license_type` | no | `""` | no | Empty omits. |
| `max_size_gb` | no | `2` | no | `0` omits. |
| `sku_name` | no | `S0` | no | SKU. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `mssql_database_id` | `azurerm_mssql_database.this.id` | ID (workflow `resource_id`). |
| `mssql_database_name` | `.name` | Database name. |

## Docs

- [azurerm_mssql_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mssql_database)
````

#### `backend.tf`

File: [v1/modules/dev/azure/azurerm_mssql_database/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/azure/azurerm_mssql_database/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/main.tf)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

resource "azurerm_mssql_database" "this" {
  name           = var.name
  server_id      = var.server_id
  collation      = var.collation
  license_type   = var.license_type == "" ? null : var.license_type
  max_size_gb    = var.max_size_gb > 0 ? var.max_size_gb : null
  sku_name       = var.sku_name

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/azure/azurerm_mssql_database/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/outputs.tf)

```hcl
output "mssql_database_id" {
  value       = azurerm_mssql_database.this.id
  description = "ID of the MSSQL database (maps to workflow resource_id)"
}

output "mssql_database_name" {
  value       = azurerm_mssql_database.this.name
  description = "Name of the MSSQL database"
}
```

#### `variables.tf`

File: [v1/modules/dev/azure/azurerm_mssql_database/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_database/variables.tf)

```hcl
variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the MSSQL database (set via TF_VAR_name)"
  type        = string
  default     = "snow-mssql-db"
}

variable "server_id" {
  description = "MSSQL server ID (set via TF_VAR_server_id)"
  type        = string
}

variable "collation" {
  description = "Database collation (set via TF_VAR_collation)"
  type        = string
  default     = "SQL_Latin1_General_CP1_CI_AS"
}

variable "license_type" {
  description = "License type (set via TF_VAR_license_type). Empty omits."
  type        = string
  default     = ""
}

variable "max_size_gb" {
  description = "Max size in GB (set via TF_VAR_max_size_gb). 0 omits."
  type        = number
  default     = 2
}

variable "sku_name" {
  description = "SKU name (set via TF_VAR_sku_name)"
  type        = string
  default     = "S0"
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/azure/azurerm_mssql_server`

#### `README_AZURERM_MSSQL_SERVER.md`

File: [v1/modules/dev/azure/azurerm_mssql_server/README_AZURERM_MSSQL_SERVER.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/README_AZURERM_MSSQL_SERVER.md)

````markdown
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

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

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
````

#### `backend.tf`

File: [v1/modules/dev/azure/azurerm_mssql_server/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/azure/azurerm_mssql_server/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/main.tf)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

resource "azurerm_mssql_server" "this" {
  name                         = var.name
  resource_group_name          = var.resource_group_name
  location                     = var.location
  version                      = var.server_version
  administrator_login          = var.administrator_login
  administrator_login_password = var.administrator_login_password
  minimum_tls_version          = var.minimum_tls_version

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/azure/azurerm_mssql_server/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/outputs.tf)

```hcl
output "mssql_server_id" {
  value       = azurerm_mssql_server.this.id
  description = "ID of the MSSQL server (maps to workflow resource_id)"
}

output "fully_qualified_domain_name" {
  value       = azurerm_mssql_server.this.fully_qualified_domain_name
  description = "FQDN of the MSSQL server"
}
```

#### `variables.tf`

File: [v1/modules/dev/azure/azurerm_mssql_server/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mssql_server/variables.tf)

```hcl
variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the MSSQL server (set via TF_VAR_name)"
  type        = string
  default     = "snow-mssql-server"
}

variable "resource_group_name" {
  description = "Resource group name (set via TF_VAR_resource_group_name)"
  type        = string
}

variable "location" {
  description = "Azure region (set via TF_VAR_location)"
  type        = string
  default     = "westeurope"
}

variable "server_version" {
  description = "MSSQL server version (set via TF_VAR_server_version)"
  type        = string
  default     = "12.0"
}

variable "administrator_login" {
  description = "Administrator login (set via TF_VAR_administrator_login)"
  type        = string
  default     = "snowadmin"
}

variable "administrator_login_password" {
  description = "Administrator password (set via TF_VAR_administrator_login_password)"
  type        = string
  sensitive   = true
}

variable "minimum_tls_version" {
  description = "Minimum TLS version (set via TF_VAR_minimum_tls_version)"
  type        = string
  default     = "1.2"
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/azure/azurerm_mysql_flexible_database`

#### `README_AZURERM_MYSQL_FLEXIBLE_DATABASE.md`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_database/README_AZURERM_MYSQL_FLEXIBLE_DATABASE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/README_AZURERM_MYSQL_FLEXIBLE_DATABASE.md)

````markdown
# Azure MySQL Flexible Database

Creates a database on an existing MySQL flexible server.

**Path:** `v1/modules/dev/azure/azurerm_mysql_flexible_database`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_mysql_flexible_database` | `this` | Database on `server_name` in `resource_group_name`. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. Parent is linked by **server name**, not ID. Charset default `utf8`, collation `utf8_unicode_ci`. This resource has no tags argument.

```
main.tf        # provider, database
variables.tf   # inputs
outputs.tf     # mysql_flexible_database_id, mysql_flexible_database_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snowdb"
export TF_VAR_resource_group_name="my-rg"
export TF_VAR_server_name="snow-mysql-server"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_mysql_flexible_database/terraform.tfstate"
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
terraform output -raw mysql_flexible_database_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `resource_group_name` | yes | — | no | Existing resource group. |
| `server_name` | yes | — | no | Existing MySQL flexible server name. |
| `name` | no | `snowdb` | no | Database name. |
| `charset` | no | `utf8` | no | Charset. |
| `collation` | no | `utf8_unicode_ci` | no | Collation. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `mysql_flexible_database_id` | `azurerm_mysql_flexible_database.this.id` | ID (workflow `resource_id`). |
| `mysql_flexible_database_name` | `.name` | Database name. |

## Docs

- [azurerm_mysql_flexible_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_database)
````

#### `backend.tf`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_database/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_database/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/main.tf)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

resource "azurerm_mysql_flexible_database" "this" {
  name                = var.name
  resource_group_name = var.resource_group_name
  server_name         = var.server_name
  charset             = var.charset
  collation           = var.collation
}
```

#### `outputs.tf`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_database/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/outputs.tf)

```hcl
output "mysql_flexible_database_id" {
  value       = azurerm_mysql_flexible_database.this.id
  description = "ID of the MySQL flexible database (maps to workflow resource_id)"
}

output "mysql_flexible_database_name" {
  value       = azurerm_mysql_flexible_database.this.name
  description = "Name of the MySQL flexible database"
}
```

#### `variables.tf`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_database/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_database/variables.tf)

```hcl
variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the MySQL database (set via TF_VAR_name)"
  type        = string
  default     = "snowdb"
}

variable "resource_group_name" {
  description = "Resource group name (set via TF_VAR_resource_group_name)"
  type        = string
}

variable "server_name" {
  description = "MySQL flexible server name (set via TF_VAR_server_name)"
  type        = string
}

variable "charset" {
  description = "Database charset (set via TF_VAR_charset)"
  type        = string
  default     = "utf8"
}

variable "collation" {
  description = "Database collation (set via TF_VAR_collation)"
  type        = string
  default     = "utf8_unicode_ci"
}
```

### `v1/modules/dev/azure/azurerm_mysql_flexible_server`

#### `README_AZURERM_MYSQL_FLEXIBLE_SERVER.md`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_server/README_AZURERM_MYSQL_FLEXIBLE_SERVER.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/README_AZURERM_MYSQL_FLEXIBLE_SERVER.md)

````markdown
# Azure MySQL Flexible Server

Creates an Azure Database for MySQL flexible server.

**Path:** `v1/modules/dev/azure/azurerm_mysql_flexible_server`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_mysql_flexible_server` | `this` | Flexible server. SKU default `B_Standard_B1ms`. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. Empty `mysql_version` and `zone` become `null` (provider defaults). Admin login defaults to `snowadmin`; password is required. Backup retention defaults to 7 days. Create databases with `azurerm_mysql_flexible_database` using this server's **name**.

```
main.tf        # provider, flexible server
variables.tf   # inputs
outputs.tf     # mysql_flexible_server_id, fqdn
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snow-mysql-server"
export TF_VAR_resource_group_name="my-rg"
export TF_VAR_administrator_password="..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_mysql_flexible_server/terraform.tfstate"
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
terraform output -raw fqdn
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `resource_group_name` | yes | — | no | Existing resource group. |
| `administrator_password` | yes | — | yes | Admin password. |
| `name` | no | `snow-mysql-server` | no | Server name. |
| `location` | no | `westeurope` | no | Azure region. |
| `administrator_login` | no | `snowadmin` | no | Admin login. |
| `sku_name` | no | `B_Standard_B1ms` | no | SKU. |
| `mysql_version` | no | `""` | no | Empty = provider default. |
| `zone` | no | `""` | no | Empty omits. |
| `backup_retention_days` | no | `7` | no | Backup days. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `mysql_flexible_server_id` | `azurerm_mysql_flexible_server.this.id` | ID (workflow `resource_id`). |
| `fqdn` | `.fqdn` | FQDN. |

## Docs

- [azurerm_mysql_flexible_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_server)
````

#### `backend.tf`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_server/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_server/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/main.tf)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

resource "azurerm_mysql_flexible_server" "this" {
  name                   = var.name
  resource_group_name    = var.resource_group_name
  location               = var.location
  administrator_login    = var.administrator_login
  administrator_password = var.administrator_password
  sku_name               = var.sku_name
  version                = var.mysql_version == "" ? null : var.mysql_version
  zone                   = var.zone == "" ? null : var.zone
  backup_retention_days  = var.backup_retention_days

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_server/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/outputs.tf)

```hcl
output "mysql_flexible_server_id" {
  value       = azurerm_mysql_flexible_server.this.id
  description = "ID of the MySQL flexible server (maps to workflow resource_id)"
}

output "fqdn" {
  value       = azurerm_mysql_flexible_server.this.fqdn
  description = "FQDN of the MySQL flexible server"
}
```

#### `variables.tf`

File: [v1/modules/dev/azure/azurerm_mysql_flexible_server/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_mysql_flexible_server/variables.tf)

```hcl
variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the MySQL flexible server (set via TF_VAR_name)"
  type        = string
  default     = "snow-mysql-server"
}

variable "resource_group_name" {
  description = "Resource group name (set via TF_VAR_resource_group_name)"
  type        = string
}

variable "location" {
  description = "Azure region (set via TF_VAR_location)"
  type        = string
  default     = "westeurope"
}

variable "administrator_login" {
  description = "Administrator login (set via TF_VAR_administrator_login)"
  type        = string
  default     = "snowadmin"
}

variable "administrator_password" {
  description = "Administrator password (set via TF_VAR_administrator_password)"
  type        = string
  sensitive   = true
}

variable "sku_name" {
  description = "SKU name (set via TF_VAR_sku_name)"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "mysql_version" {
  description = "MySQL version (set via TF_VAR_mysql_version). Empty uses provider default."
  type        = string
  default     = ""
}

variable "zone" {
  description = "Availability zone (set via TF_VAR_zone). Empty omits."
  type        = string
  default     = ""
}

variable "backup_retention_days" {
  description = "Backup retention days (set via TF_VAR_backup_retention_days)"
  type        = number
  default     = 7
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/azure/azurerm_postgresql_database`

#### `README_AZURERM_POSTGRESQL_DATABASE.md`

File: [v1/modules/dev/azure/azurerm_postgresql_database/README_AZURERM_POSTGRESQL_DATABASE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/README_AZURERM_POSTGRESQL_DATABASE.md)

````markdown
# Azure PostgreSQL Flexible Database

Creates a database on an existing PostgreSQL flexible server. The directory is named `azurerm_postgresql_database`; the resource is `azurerm_postgresql_flexible_server_database` because the classic resource was removed in azurerm 4+/5+.

**Path:** `v1/modules/dev/azure/azurerm_postgresql_database`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_postgresql_flexible_server_database` | `this` | Database on `server_id`. |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. Charset default `UTF8`, collation `en_US.utf8`. No tags argument. Apply `azurerm_postgresql_server` first and pass `postgresql_server_id` as `TF_VAR_server_id`.

```
main.tf        # provider, database
variables.tf   # inputs
outputs.tf     # postgresql_database_id, postgresql_database_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snowdb"
export TF_VAR_server_id="$(terraform -chdir=../azurerm_postgresql_server output -raw postgresql_server_id)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_postgresql_database/terraform.tfstate"
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
terraform output -raw postgresql_database_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `server_id` | yes | — | no | Existing PostgreSQL flexible server ID. |
| `name` | no | `snowdb` | no | Database name. |
| `charset` | no | `UTF8` | no | Charset. |
| `collation` | no | `en_US.utf8` | no | Collation. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `postgresql_database_id` | `azurerm_postgresql_flexible_server_database.this.id` | ID (workflow `resource_id`). |
| `postgresql_database_name` | `.name` | Database name. |

## Docs

- [azurerm_postgresql_flexible_server_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server_database)
````

#### `backend.tf`

File: [v1/modules/dev/azure/azurerm_postgresql_database/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/azure/azurerm_postgresql_database/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/main.tf)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

# Classic azurerm_postgresql_database was removed in azurerm 4+/5+.
# This module uses azurerm_postgresql_flexible_server_database.
resource "azurerm_postgresql_flexible_server_database" "this" {
  name      = var.name
  server_id = var.server_id
  charset   = var.charset
  collation = var.collation
}
```

#### `outputs.tf`

File: [v1/modules/dev/azure/azurerm_postgresql_database/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/outputs.tf)

```hcl
output "postgresql_database_id" {
  value       = azurerm_postgresql_flexible_server_database.this.id
  description = "ID of the PostgreSQL database (maps to workflow resource_id)"
}

output "postgresql_database_name" {
  value       = azurerm_postgresql_flexible_server_database.this.name
  description = "Name of the PostgreSQL database"
}
```

#### `variables.tf`

File: [v1/modules/dev/azure/azurerm_postgresql_database/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_database/variables.tf)

```hcl
variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the PostgreSQL database (set via TF_VAR_name)"
  type        = string
  default     = "snowdb"
}

variable "server_id" {
  description = "PostgreSQL flexible server ID (set via TF_VAR_server_id)"
  type        = string
}

variable "charset" {
  description = "Database charset (set via TF_VAR_charset)"
  type        = string
  default     = "UTF8"
}

variable "collation" {
  description = "Database collation (set via TF_VAR_collation)"
  type        = string
  default     = "en_US.utf8"
}
```

### `v1/modules/dev/azure/azurerm_postgresql_server`

#### `README_AZURERM_POSTGRESQL_SERVER.md`

File: [v1/modules/dev/azure/azurerm_postgresql_server/README_AZURERM_POSTGRESQL_SERVER.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/README_AZURERM_POSTGRESQL_SERVER.md)

````markdown
# Azure PostgreSQL Flexible Server

Creates an Azure Database for PostgreSQL flexible server. The directory is named `azurerm_postgresql_server`; the resource is `azurerm_postgresql_flexible_server` because the classic resource was removed in azurerm 4+/5+.

**Path:** `v1/modules/dev/azure/azurerm_postgresql_server`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `azurerm_postgresql_flexible_server` | `this` | Flexible server. Version `var.postgres_version` (default `14`). |

Provider `hashicorp/azurerm` `~> 5.0` with a service principal. SKU default `B_Standard_B1ms`, storage `32768` MB. Empty `zone` becomes `null`. Admin login defaults to `snowadmin`; password is required. Create databases with `azurerm_postgresql_database` using `postgresql_server_id`.

```
main.tf        # provider, flexible server
variables.tf   # inputs
outputs.tf     # postgresql_server_id, fqdn
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_subscription_id="..."
export TF_VAR_tenant_id="..."
export TF_VAR_client_id="..."
export TF_VAR_client_secret="..."
export TF_VAR_name="snow-pg-server"
export TF_VAR_resource_group_name="my-rg"
export TF_VAR_administrator_password="..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/azure/azurerm_postgresql_server/terraform.tfstate"
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
terraform output -raw fqdn
terraform output -raw postgresql_server_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `subscription_id` | yes | — | no | Azure subscription ID. |
| `tenant_id` | yes | — | no | Azure tenant ID. |
| `client_id` | yes | — | no | Service principal client ID. |
| `client_secret` | yes | — | yes | Service principal secret. |
| `resource_group_name` | yes | — | no | Existing resource group. |
| `administrator_password` | yes | — | yes | Admin password. |
| `name` | no | `snow-pg-server` | no | Server name. |
| `location` | no | `westeurope` | no | Azure region. |
| `postgres_version` | no | `14` | no | PostgreSQL version. |
| `administrator_login` | no | `snowadmin` | no | Admin login. |
| `sku_name` | no | `B_Standard_B1ms` | no | SKU. |
| `storage_mb` | no | `32768` | no | Storage MB. |
| `zone` | no | `""` | no | Empty omits. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `postgresql_server_id` | `azurerm_postgresql_flexible_server.this.id` | ID (workflow `resource_id`). |
| `fqdn` | `.fqdn` | FQDN. |

## Docs

- [azurerm_postgresql_flexible_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server)
````

#### `backend.tf`

File: [v1/modules/dev/azure/azurerm_postgresql_server/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/azure/azurerm_postgresql_server/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/main.tf)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

# Classic azurerm_postgresql_server was removed in azurerm 4+/5+.
# This module uses azurerm_postgresql_flexible_server per the 5.0 upgrade guide.
resource "azurerm_postgresql_flexible_server" "this" {
  name                   = var.name
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = var.postgres_version
  administrator_login    = var.administrator_login
  administrator_password = var.administrator_password
  sku_name               = var.sku_name
  storage_mb             = var.storage_mb
  zone                   = var.zone == "" ? null : var.zone

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/azure/azurerm_postgresql_server/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/outputs.tf)

```hcl
output "postgresql_server_id" {
  value       = azurerm_postgresql_flexible_server.this.id
  description = "ID of the PostgreSQL flexible server (maps to workflow resource_id)"
}

output "fqdn" {
  value       = azurerm_postgresql_flexible_server.this.fqdn
  description = "FQDN of the PostgreSQL flexible server"
}
```

#### `variables.tf`

File: [v1/modules/dev/azure/azurerm_postgresql_server/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure/azurerm_postgresql_server/variables.tf)

```hcl
variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the PostgreSQL flexible server (set via TF_VAR_name)"
  type        = string
  default     = "snow-pg-server"
}

variable "resource_group_name" {
  description = "Resource group name (set via TF_VAR_resource_group_name)"
  type        = string
}

variable "location" {
  description = "Azure region (set via TF_VAR_location)"
  type        = string
  default     = "westeurope"
}

variable "postgres_version" {
  description = "PostgreSQL version (set via TF_VAR_postgres_version)"
  type        = string
  default     = "14"
}

variable "administrator_login" {
  description = "Administrator login (set via TF_VAR_administrator_login)"
  type        = string
  default     = "snowadmin"
}

variable "administrator_password" {
  description = "Administrator password (set via TF_VAR_administrator_password)"
  type        = string
  sensitive   = true
}

variable "sku_name" {
  description = "SKU name (set via TF_VAR_sku_name)"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "storage_mb" {
  description = "Storage in MB (set via TF_VAR_storage_mb)"
  type        = number
  default     = 32768
}

variable "zone" {
  description = "Availability zone (set via TF_VAR_zone). Empty omits."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/civo/bucket`

#### `README_BUCKET.md`

File: [v1/modules/dev/civo/bucket/README_BUCKET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/README_BUCKET.md)

````markdown
# Civo object store

Creates a Civo object-store bucket named `snowmonkeysbackup` and reads its credentials.

**Path:** `v1/modules/dev/civo/bucket`

## Implementation

| Resource / data | Name | Purpose |
|---|---|---|
| `civo_object_store` | `snowmonkeysbackup` | Bucket `snowmonkeysbackup`, 500 GB, region **hardcoded** `LON1`. |
| `data.civo_object_store_credential` | `snowmonkeysbackup` | Reads access credentials from `access_key_id`. |

Provider `civo/civo` `~> 1.1.0`. Token is variable `civo-token` (hyphen). Provider region is `var.region` (default `NYC1`), which does **not** match the resource region `LON1`.

`civo_UUID`, `name`, `node-count`, and `node-size` are unused leftovers from a Kubernetes module. There is no `outputs.tf`. Terraform `required_version` is `>= 0.13.0`.

```
provider.tf    # civo provider
bucket.tf      # object store + credential data
variables.tf   # inputs (several unused)
backend.tf     # backend "s3" {}
```

`civo-token` is not a valid shell identifier, so `export TF_VAR_civo-token=...` fails. Pass it with `env`:

```bash
env TF_VAR_civo-token="..." terraform apply
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Other inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_region="LON1"
export TF_VAR_civo_UUID="unused-but-required"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/civo/bucket/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
env TF_VAR_civo-token="..." terraform apply
```

`civo_UUID` has no default and is unused, but Terraform still requires it. There are no outputs; inspect with `terraform state show civo_object_store.snowmonkeysbackup`.

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `civo-token` | yes | — | yes | Civo API token. Set with `env TF_VAR_civo-token=...`. |
| `civo_UUID` | yes | — | yes | Unused; still required. |
| `name` | no | `k8s_demo_1` | no | Unused. |
| `node-count` | no | `2` | no | Unused. Hyphenated name. |
| `node-size` | no | `g4s.kube.medium` | no | Unused. Hyphenated name. |
| `region` | no | `NYC1` | no | Provider region. Resource still uses `LON1`. |

## Outputs

None.

## Docs

- [civo_object_store](https://registry.terraform.io/providers/civo/civo/latest/docs/resources/object_store)
````

#### `backend.tf`

File: [v1/modules/dev/civo/bucket/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `bucket.tf`

File: [v1/modules/dev/civo/bucket/bucket.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/bucket.tf)

```hcl
resource "civo_object_store" "snowmonkeysbackup" {
    name = "snowmonkeysbackup"
    max_size_gb = 500
    region = "LON1"
}

# If you create the bucket without credentials, you can read the credentials in this way
data "civo_object_store_credential" "snowmonkeysbackup" {
    id = civo_object_store.snowmonkeysbackup.access_key_id
}
```

#### `provider.tf`

File: [v1/modules/dev/civo/bucket/provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/provider.tf)

```hcl
terraform {

  required_version = ">= 0.13.0"

  required_providers {
    civo = {
      source  = "civo/civo"
      version = "~> 1.1.0"
    }
  }
}


provider "civo" {
  token = var.civo-token
  region = var.region
}
```

#### `variables.tf`

File: [v1/modules/dev/civo/bucket/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/bucket/variables.tf)

```hcl
variable "civo-token" {
  type = string
  sensitive = true
}

variable "civo_UUID" {
  type = string
  sensitive = true
}

variable "name" {
  type = string
  default = "k8s_demo_1"
}

variable "node-count" {
  type = number
  default = 2
}

variable "node-size" {
  type = string
  default = "g4s.kube.medium"
}

/*variable "organization" {
  type = string
  default = "k8s-civo"
}

variable "workspaces" {
  type = string
  default = "k8s-civo"
}*/

variable "region" {
  type = string
  default = "NYC1"
}
```

### `v1/modules/dev/civo/compute`

#### `README_COMPUTE.md`

File: [v1/modules/dev/civo/compute/README_COMPUTE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/compute/README_COMPUTE.md)

````markdown
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

Init still needs remote state ([BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md)):

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
````

#### `backend.tf`

File: [v1/modules/dev/civo/compute/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/compute/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `provider.tf`

File: [v1/modules/dev/civo/compute/provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/compute/provider.tf)

```hcl
terraform {

  required_version = ">= 0.13.0"

  required_providers {
     civo = {
      source  = "civo/civo"
      version = "~> 1.1.0"
    }
  }
}
```

### `v1/modules/dev/civo/observability`

#### `README_OBSERVABILITY.md`

File: [v1/modules/dev/civo/observability/README_OBSERVABILITY.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/README_OBSERVABILITY.md)

````markdown
# Civo observability (incomplete)

Intended to install a Helm chart (filename says OpenTelemetry) into a Civo Kubernetes cluster. **This project will not apply as-is** because it depends on a cluster resource that is not defined here.

**Path:** `v1/modules/dev/civo/observability`

## Implementation

| Resource / data | Name | Purpose |
|---|---|---|
| `data.civo_kubernetes_cluster` | `k8s_demo_1` | Looks up cluster `k8s_demo_1`. `depends_on` `civo_kubernetes_cluster.k8s_demo_1`, which **does not exist** in this module. |
| `kubernetes_namespace` | `helmnamespace` | Namespace `var.namespace`. |
| `helm_release` | `helmrelease` | Installs `var.chart` from `var.repository` with `var.values`. |

Providers: `civo/civo` `~> 1.1.0`, `hashicorp/helm` `2.16.0`, `hashicorp/kubernetes` `2.33.0`, `gavinbunney/kubectl` `1.14.0`. Helm, Kubernetes, and kubectl authenticate from the cluster kubeconfig. The `kubectl` provider is unused. Terraform `required_version` is `>= 0.13.0`. No `outputs.tf`.

```
provider.tf        # providers + broken cluster data source
opentelemetry.tf   # namespace + generic helm_release
variables.tf       # helm inputs + civo_token
backend.tf         # backend "s3" {}
```

`civo_token` is not marked `sensitive`. Default chart/name/repository values (`default` / `no-name`) are placeholders, not an OpenTelemetry chart.

## Usage

Do not apply until a `civo_kubernetes_cluster.k8s_demo_1` resource exists in this root module (or the data source is rewritten to look up an existing cluster without `depends_on` that resource).

When that is fixed:

```bash
export TF_VAR_civo_token="..."
export TF_VAR_namespace="observability"
export TF_VAR_name="opentelemetry"
export TF_VAR_repository="https://open-telemetry.github.io/opentelemetry-helm-charts"
export TF_VAR_chart="opentelemetry-collector"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/civo/observability/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md). Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md).

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `civo_token` | yes | — | no (not marked) | Civo API token. |
| `namespace` | no | `default` | no | Kubernetes namespace. |
| `name` | no | `no-name` | no | Helm release name. |
| `repository` | no | `default` | no | Helm repo URL. |
| `chart` | no | `default` | no | Chart name. |
| `values` | no | `""` | no | Helm values YAML string. |

## Outputs

None.

## Docs

- [helm_release](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release)
- [civo_kubernetes_cluster](https://registry.terraform.io/providers/civo/civo/latest/docs/resources/kubernetes_cluster)
````

#### `backend.tf`

File: [v1/modules/dev/civo/observability/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `grafana.tf`

File: [v1/modules/dev/civo/observability/grafana.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/grafana.tf)

```hcl

```

#### `opentelemetry.tf`

File: [v1/modules/dev/civo/observability/opentelemetry.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/opentelemetry.tf)

```hcl
resource "kubernetes_namespace" "helmnamespace" {

  metadata {
    name = var.namespace
  }

}

resource "helm_release" "helmrelease" {
    depends_on = [
        kubernetes_namespace.helmnamespace
    ]
    
    name      = var.name
    namespace = var.namespace
    
    repository = var.repository
    chart      = var.chart
    
    values = [ var.values ]
  
}
```

#### `prometheus.tf`

File: [v1/modules/dev/civo/observability/prometheus.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/prometheus.tf)

```hcl

```

#### `provider.tf`

File: [v1/modules/dev/civo/observability/provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/provider.tf)

```hcl
terraform {

  required_version = ">= 0.13.0"

  required_providers {
    civo = {
      source  = "civo/civo"
      version = "~> 1.1.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "2.16.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.33.0"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "1.14.0"
    }
  }
}

data "civo_kubernetes_cluster" "k8s_demo_1" {
  depends_on = [
    civo_kubernetes_cluster.k8s_demo_1
  ]
  name = "k8s_demo_1"
}


provider "civo" {
  token = var.civo_token

  # TODO: (optional) change region to your desired datacenter location
  # ---
  # region = "FRA1"
}

provider "helm" {
  kubernetes {
    host                   = yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.server
    client_certificate     = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-certificate-data)
    client_key             = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-key-data)
    cluster_ca_certificate = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.certificate-authority-data)
  }
}

provider "kubernetes" {
  host                   = yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.server
  client_certificate     = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-certificate-data)
  client_key             = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-key-data)
  cluster_ca_certificate = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.certificate-authority-data)
}

provider "kubectl" {
  host                   = yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.server
  client_certificate     = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-certificate-data)
  client_key             = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).users.0.user.client-key-data)
  cluster_ca_certificate = base64decode(yamldecode(data.civo_kubernetes_cluster.k8s_demo_1.kubeconfig).clusters.0.cluster.certificate-authority-data)
  load_config_file       = false
}
```

#### `variables.tf`

File: [v1/modules/dev/civo/observability/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo/observability/variables.tf)

```hcl
variable "namespace" {
  type = string
  default = "default"
}

variable "name" {
  type = string
  default = "no-name"
  
}

variable "repository" {
  type = string
  default = "default"
}

variable "chart" {
  type = string
  default = "default"
}

variable "values" {
  type = string
  default = ""
}

variable "civo_token" {
  type = string
  //sensitive = true
}
```

### `v1/modules/dev/cloudflare/cloudflare_d1_database`

#### `README_CLOUDFLARE_D1_DATABASE.md`

File: [v1/modules/dev/cloudflare/cloudflare_d1_database/README_CLOUDFLARE_D1_DATABASE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/README_CLOUDFLARE_D1_DATABASE.md)

````markdown
# Cloudflare D1 database

Creates a Cloudflare D1 SQLite database.

**Path:** `v1/modules/dev/cloudflare/cloudflare_d1_database`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `cloudflare_d1_database` | `this` | D1 database named `var.name` in `account_id`. |

Provider `cloudflare/cloudflare` `~> 5.0`. Auth is `TF_VAR_cloudflare_api_token`. Empty `jurisdiction` and `primary_location_hint` become `null`.

```
main.tf        # provider, D1 database
variables.tf   # inputs
outputs.tf     # d1_database_id, d1_database_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_account_id="..."
export TF_VAR_name="snow-d1"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/cloudflare_d1_database/terraform.tfstate"
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
terraform output -raw d1_database_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_api_token` | yes | — | yes | API token. |
| `account_id` | yes | — | no | Cloudflare account ID. |
| `name` | no | `snow-d1` | no | Database name. |
| `jurisdiction` | no | `""` | no | Empty omits. |
| `primary_location_hint` | no | `""` | no | Empty omits. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `d1_database_id` | `cloudflare_d1_database.this.id` | ID (workflow `resource_id`). |
| `d1_database_name` | `.name` | Name. |

## Docs

- [cloudflare_d1_database](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/d1_database)
````

#### `backend.tf`

File: [v1/modules/dev/cloudflare/cloudflare_d1_database/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/cloudflare/cloudflare_d1_database/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/main.tf)

```hcl
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_d1_database" "this" {
  account_id            = var.account_id
  name                  = var.name
  jurisdiction          = var.jurisdiction == "" ? null : var.jurisdiction
  primary_location_hint = var.primary_location_hint == "" ? null : var.primary_location_hint
}
```

#### `outputs.tf`

File: [v1/modules/dev/cloudflare/cloudflare_d1_database/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/outputs.tf)

```hcl
output "d1_database_id" {
  value       = cloudflare_d1_database.this.id
  description = "ID of the D1 database (maps to workflow resource_id)"
}

output "d1_database_name" {
  value       = cloudflare_d1_database.this.name
  description = "Name of the D1 database"
}
```

#### `variables.tf`

File: [v1/modules/dev/cloudflare/cloudflare_d1_database/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_d1_database/variables.tf)

```hcl
variable "cloudflare_api_token" {
  description = "Cloudflare API token (set via TF_VAR_cloudflare_api_token)"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID (set via TF_VAR_account_id)"
  type        = string
}

variable "name" {
  description = "D1 database name (set via TF_VAR_name)"
  type        = string
  default     = "snow-d1"
}

variable "jurisdiction" {
  description = "Jurisdiction (set via TF_VAR_jurisdiction). Empty omits."
  type        = string
  default     = ""
}

variable "primary_location_hint" {
  description = "Primary location hint (set via TF_VAR_primary_location_hint). Empty omits."
  type        = string
  default     = ""
}
```

### `v1/modules/dev/cloudflare/cloudflare_pages_project`

#### `README_CLOUDFLARE_PAGES_PROJECT.md`

File: [v1/modules/dev/cloudflare/cloudflare_pages_project/README_CLOUDFLARE_PAGES_PROJECT.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/README_CLOUDFLARE_PAGES_PROJECT.md)

````markdown
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
````

#### `backend.tf`

File: [v1/modules/dev/cloudflare/cloudflare_pages_project/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/cloudflare/cloudflare_pages_project/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/main.tf)

```hcl
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_pages_project" "this" {
  account_id        = var.account_id
  name              = var.name
  production_branch = var.production_branch
}
```

#### `outputs.tf`

File: [v1/modules/dev/cloudflare/cloudflare_pages_project/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/outputs.tf)

```hcl
output "pages_project_id" {
  value       = cloudflare_pages_project.this.id
  description = "ID of the Pages project (maps to workflow resource_id)"
}

output "pages_project_name" {
  value       = cloudflare_pages_project.this.name
  description = "Name of the Pages project"
}

output "pages_project_subdomain" {
  value       = cloudflare_pages_project.this.subdomain
  description = "Cloudflare subdomain associated with the project"
}
```

#### `variables.tf`

File: [v1/modules/dev/cloudflare/cloudflare_pages_project/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project/variables.tf)

```hcl
variable "cloudflare_api_token" {
  description = "Cloudflare API token (set via TF_VAR_cloudflare_api_token)"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID (set via TF_VAR_account_id)"
  type        = string
}

variable "name" {
  description = "Pages project name (set via TF_VAR_name). Lowercase letters, digits, and hyphens only."
  type        = string
  default     = "snow-pages"
}

variable "production_branch" {
  description = "Production branch of the project (set via TF_VAR_production_branch)"
  type        = string
  default     = "main"
}
```

### `v1/modules/dev/cloudflare/cloudflare_pipeline_sink`

#### `README_CLOUDFLARE_PIPELINE_SINK.md`

File: [v1/modules/dev/cloudflare/cloudflare_pipeline_sink/README_CLOUDFLARE_PIPELINE_SINK.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/README_CLOUDFLARE_PIPELINE_SINK.md)

````markdown
# Cloudflare Pipeline sink

Creates a Cloudflare Pipelines sink, defaulting to R2 with JSON format.

**Path:** `v1/modules/dev/cloudflare/cloudflare_pipeline_sink`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `cloudflare_pipeline_sink` | `this` | Sink named `var.name`. `type` is `sink_type` (default `r2`). |

Provider `cloudflare/cloudflare` `~> 5.0`. Auth is `TF_VAR_cloudflare_api_token`. `config` includes account (falls back to `account_id` if `config_account_id` is empty), R2 `bucket`, and R2 access keys. Optional `path` prefix. `format.type` defaults to `json`.

Create the R2 bucket with `cloudflare_r2_bucket` first. R2 API tokens are separate from the Cloudflare API token.

```
main.tf        # provider, pipeline sink
variables.tf   # inputs
outputs.tf     # pipeline_sink_id, pipeline_sink_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_account_id="..."
export TF_VAR_name="snow_sink"
export TF_VAR_bucket="snow-r2-bucket"
export TF_VAR_r2_access_key_id="..."
export TF_VAR_r2_secret_access_key="..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/cloudflare_pipeline_sink/terraform.tfstate"
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
terraform output -raw pipeline_sink_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_api_token` | yes | — | yes | Cloudflare API token. |
| `account_id` | yes | — | no | Cloudflare account ID. |
| `bucket` | yes | — | no | R2 bucket name. |
| `r2_access_key_id` | yes | — | yes | R2 access key. |
| `r2_secret_access_key` | yes | — | yes | R2 secret. |
| `name` | no | `snow_sink` | no | Sink name. |
| `sink_type` | no | `r2` | no | Sink type. |
| `config_account_id` | no | `""` | no | Empty uses `account_id`. |
| `path` | no | `""` | no | Optional prefix. |
| `format_type` | no | `json` | no | Format type. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `pipeline_sink_id` | `cloudflare_pipeline_sink.this.id` | ID (workflow `resource_id`). |
| `pipeline_sink_name` | `.name` | Name. |

## Docs

- [cloudflare_pipeline_sink](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/pipeline_sink)
````

#### `backend.tf`

File: [v1/modules/dev/cloudflare/cloudflare_pipeline_sink/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/cloudflare/cloudflare_pipeline_sink/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/main.tf)

```hcl
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_pipeline_sink" "this" {
  account_id = var.account_id
  name       = var.name
  type       = var.sink_type

  config = {
    account_id = var.config_account_id != "" ? var.config_account_id : var.account_id
    bucket     = var.bucket
    credentials = {
      access_key_id     = var.r2_access_key_id
      secret_access_key = var.r2_secret_access_key
    }
    path = var.path == "" ? null : var.path
  }

  format = {
    type = var.format_type
  }
}
```

#### `outputs.tf`

File: [v1/modules/dev/cloudflare/cloudflare_pipeline_sink/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/outputs.tf)

```hcl
output "pipeline_sink_id" {
  value       = cloudflare_pipeline_sink.this.id
  description = "ID of the pipeline sink (maps to workflow resource_id)"
}

output "pipeline_sink_name" {
  value       = cloudflare_pipeline_sink.this.name
  description = "Name of the pipeline sink"
}
```

#### `variables.tf`

File: [v1/modules/dev/cloudflare/cloudflare_pipeline_sink/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pipeline_sink/variables.tf)

```hcl
variable "cloudflare_api_token" {
  description = "Cloudflare API token (set via TF_VAR_cloudflare_api_token)"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID (set via TF_VAR_account_id)"
  type        = string
}

variable "name" {
  description = "Pipeline sink name (set via TF_VAR_name)"
  type        = string
  default     = "snow_sink"
}

variable "sink_type" {
  description = "Sink type (set via TF_VAR_sink_type)"
  type        = string
  default     = "r2"
}

variable "config_account_id" {
  description = "Account ID inside sink config (set via TF_VAR_config_account_id). Defaults to account_id."
  type        = string
  default     = ""
}

variable "bucket" {
  description = "R2 bucket name for the sink (set via TF_VAR_bucket)"
  type        = string
}

variable "r2_access_key_id" {
  description = "R2 access key ID (set via TF_VAR_r2_access_key_id)"
  type        = string
  sensitive   = true
}

variable "r2_secret_access_key" {
  description = "R2 secret access key (set via TF_VAR_r2_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "path" {
  description = "Optional object path prefix (set via TF_VAR_path)"
  type        = string
  default     = ""
}

variable "format_type" {
  description = "Sink format type (set via TF_VAR_format_type)"
  type        = string
  default     = "json"
}
```

### `v1/modules/dev/cloudflare/cloudflare_r2_bucket`

#### `README_CLOUDFLARE_R2_BUCKET.md`

File: [v1/modules/dev/cloudflare/cloudflare_r2_bucket/README_CLOUDFLARE_R2_BUCKET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/README_CLOUDFLARE_R2_BUCKET.md)

````markdown
# Cloudflare R2 bucket

Creates a Cloudflare R2 object-storage bucket.

**Path:** `v1/modules/dev/cloudflare/cloudflare_r2_bucket`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `cloudflare_r2_bucket` | `this` | R2 bucket named `var.name` in `account_id`. |

Provider `cloudflare/cloudflare` `~> 5.0`. Auth is `TF_VAR_cloudflare_api_token`. Empty `location` becomes `null`. Storage class default `Standard`. Use this bucket name as `TF_VAR_bucket` for `cloudflare_pipeline_sink`.

```
main.tf        # provider, R2 bucket
variables.tf   # inputs
outputs.tf     # r2_bucket_id, r2_bucket_name
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_cloudflare_api_token="..."
export TF_VAR_account_id="..."
export TF_VAR_name="snow-r2-bucket"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/cloudflare_r2_bucket/terraform.tfstate"
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
terraform output -raw r2_bucket_name
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_api_token` | yes | — | yes | API token. |
| `account_id` | yes | — | no | Cloudflare account ID. |
| `name` | no | `snow-r2-bucket` | no | Bucket name. |
| `location` | no | `""` | no | Empty omits. |
| `storage_class` | no | `Standard` | no | Storage class. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `r2_bucket_id` | `cloudflare_r2_bucket.this.id` | ID (workflow `resource_id`). |
| `r2_bucket_name` | `.name` | Name. |

## Docs

- [cloudflare_r2_bucket](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/r2_bucket)
````

#### `backend.tf`

File: [v1/modules/dev/cloudflare/cloudflare_r2_bucket/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/cloudflare/cloudflare_r2_bucket/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/main.tf)

```hcl
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_r2_bucket" "this" {
  account_id   = var.account_id
  name         = var.name
  location     = var.location == "" ? null : var.location
  storage_class = var.storage_class
}
```

#### `outputs.tf`

File: [v1/modules/dev/cloudflare/cloudflare_r2_bucket/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/outputs.tf)

```hcl
output "r2_bucket_id" {
  value       = cloudflare_r2_bucket.this.id
  description = "ID of the R2 bucket (maps to workflow resource_id)"
}

output "r2_bucket_name" {
  value       = cloudflare_r2_bucket.this.name
  description = "Name of the R2 bucket"
}
```

#### `variables.tf`

File: [v1/modules/dev/cloudflare/cloudflare_r2_bucket/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_r2_bucket/variables.tf)

```hcl
variable "cloudflare_api_token" {
  description = "Cloudflare API token (set via TF_VAR_cloudflare_api_token)"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID (set via TF_VAR_account_id)"
  type        = string
}

variable "name" {
  description = "R2 bucket name (set via TF_VAR_name)"
  type        = string
  default     = "snow-r2-bucket"
}

variable "location" {
  description = "R2 location hint (set via TF_VAR_location). Empty omits."
  type        = string
  default     = ""
}

variable "storage_class" {
  description = "Storage class (set via TF_VAR_storage_class)"
  type        = string
  default     = "Standard"
}
```

### `v1/modules/dev/cloudflare/cloudflare_workers_script`

#### `README_CLOUDFLARE_WORKERS_SCRIPT.md`

File: [v1/modules/dev/cloudflare/cloudflare_workers_script/README_CLOUDFLARE_WORKERS_SCRIPT.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/README_CLOUDFLARE_WORKERS_SCRIPT.md)

````markdown
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

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

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
````

#### `backend.tf`

File: [v1/modules/dev/cloudflare/cloudflare_workers_script/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/cloudflare/cloudflare_workers_script/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/main.tf)

```hcl
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_workers_script" "this" {
  account_id  = var.account_id
  script_name = var.name
  content     = var.content
  main_module = var.main_module == "" ? null : var.main_module
}
```

#### `outputs.tf`

File: [v1/modules/dev/cloudflare/cloudflare_workers_script/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/outputs.tf)

```hcl
output "workers_script_id" {
  value       = cloudflare_workers_script.this.id
  description = "ID of the Workers script (maps to workflow resource_id)"
}

output "workers_script_name" {
  value       = cloudflare_workers_script.this.script_name
  description = "Name of the Workers script"
}
```

#### `variables.tf`

File: [v1/modules/dev/cloudflare/cloudflare_workers_script/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_workers_script/variables.tf)

```hcl
variable "cloudflare_api_token" {
  description = "Cloudflare API token (set via TF_VAR_cloudflare_api_token)"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID (set via TF_VAR_account_id)"
  type        = string
}

variable "name" {
  description = "Workers script name (set via TF_VAR_name)"
  type        = string
  default     = "snow-worker"
}

variable "content" {
  description = "Worker script content (set via TF_VAR_content)"
  type        = string
  default     = <<-EOT
    export default {
      async fetch(request, env, ctx) {
        return new Response("Hello from snow-worker");
      },
    };
  EOT
}

variable "main_module" {
  description = "Main module filename for module syntax (set via TF_VAR_main_module). Empty omits."
  type        = string
  default     = "worker.js"
}
```

### `v1/modules/dev/cloudflare/dns`

#### `README_DNS.md`

File: [v1/modules/dev/cloudflare/dns/README_DNS.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/README_DNS.md)

````markdown
# Cloudflare DNS (incomplete)

Intended to create a Cloudflare A record for a Civo Traefik load balancer and a Kubernetes secret for cert-manager. **This project is not self-contained** and will not apply as-is.

**Path:** `v1/modules/dev/cloudflare/dns`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `kubernetes_secret` | `cloudflare_api_key_secret` | Opaque secret `cloudflare-api-key-secret` in namespace `certmanager`. |
| `cloudflare_record` | `clcreative-all-cluster` | A record. Value is `data.civo_loadbalancer.traefik_lb.public_ip`. |

Provider `cloudflare/cloudflare` `~> 4.0` (older than the other Cloudflare projects, which use `~> 5.0`). Auth is email + global API key (`TF_VAR_cloudflare_email`, `TF_VAR_cloudflare_api_key`), not an API token.

Missing pieces:

- No `kubernetes` or `civo` `required_providers` / provider blocks.
- `depends_on = [kubernetes_namespace.certmanager]` but that namespace is not in this directory.
- `data.civo_loadbalancer.traefik_lb` is not defined.

```
provider.tf    # cloudflare provider (email + api_key)
cloudflare.tf  # kubernetes secret + DNS record
variables.tf   # inputs
backend.tf     # backend "s3" {}
```

There is no `outputs.tf`. Terraform `required_version` is `>= 0.13.0`.

## Usage

Do not apply until the Civo load balancer data source and cert-manager namespace exist in this root module (or are composed from another stack). When that is fixed:

```bash
export TF_VAR_cloudflare_email="you@example.com"
export TF_VAR_cloudflare_api_key="..."
export TF_VAR_cloudflare_zone_id="..."
export TF_VAR_cloudflare_record_name="*.connectorsapp.com"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/dns/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md). Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md).

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_email` | yes | — | no | Account email. |
| `cloudflare_api_key` | yes | — | no (not marked) | Global API key. |
| `cloudflare_zone_id` | yes | — | no | Zone ID. |
| `cloudflare_record_name` | no | `*.connectorsapp.com` | no | Record name. |

## Outputs

None.

## Docs

- [cloudflare_record](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/record)
````

#### `backend.tf`

File: [v1/modules/dev/cloudflare/dns/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `cloudflare.tf`

File: [v1/modules/dev/cloudflare/dns/cloudflare.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/cloudflare.tf)

```hcl
# Cloudflare DNS records and API Secret

resource "kubernetes_secret" "cloudflare_api_key_secret" {

    depends_on = [
        kubernetes_namespace.certmanager
    ]

    metadata {
        name = "cloudflare-api-key-secret"
        namespace = "certmanager"
    }

    data = {
        api-key = var.cloudflare_api_key
    }

    type = "Opaque"
}


resource "cloudflare_record" "clcreative-all-cluster" {
    zone_id = var.cloudflare_zone_id
    name = var.cloudflare_record_name
    value =  data.civo_loadbalancer.traefik_lb.public_ip
    type = "A"
    proxied = false
}
```

#### `provider.tf`

File: [v1/modules/dev/cloudflare/dns/provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/provider.tf)

```hcl
terraform {

  required_version = ">= 0.13.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  email   = var.cloudflare_email
  api_key = var.cloudflare_api_key
}
```

#### `variables.tf`

File: [v1/modules/dev/cloudflare/dns/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/dns/variables.tf)

```hcl
variable "cloudflare_email" {
  type = string
  //sensitive = false
}

variable "cloudflare_api_key" {
  type = string
  //sensitive = true
}

variable "cloudflare_zone_id" {
  type = string 
}

variable "cloudflare_record_name" {
  type = string
  default = "*.connectorsapp.com"
}
```

### `v1/modules/dev/digitalocean/digitalocean_droplet`

#### `README_DIGITALOCEAN_DROPLET.md`

File: [v1/modules/dev/digitalocean/digitalocean_droplet/README_DIGITALOCEAN_DROPLET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/README_DIGITALOCEAN_DROPLET.md)

````markdown
# DigitalOcean droplet

Creates a Droplet and, when `ssh_public_key` is set, an SSH key.

**Path:** `v1/modules/dev/digitalocean/digitalocean_droplet`

Prefer this project over the older [`droplet`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/README_DROPLET.md) demo.

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `digitalocean_ssh_key` | `this` | Created when `ssh_public_key` is non-empty. Named `${var.name}-key`. |
| `digitalocean_droplet` | `this` | Droplet. Size is `server_type`. SSH keys are the new key and/or `var.ssh_keys`. |

Provider `digitalocean/digitalocean` `~> 2.0`. Token: `TF_VAR_digitalocean_token`. Default image `ubuntu-24-04-x64`, size `s-1vcpu-1gb`, region `nyc3`. IPv6 off. Empty `user_data` is omitted. Tags default `["managed_by:terraform"]`.

```
main.tf        # provider, optional SSH key, droplet
variables.tf   # inputs
outputs.tf     # droplet_id, droplet_ip, droplet_status
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_digitalocean_token="..."
export TF_VAR_name="snow-droplet"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/digitalocean/digitalocean_droplet/terraform.tfstate"
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
ssh root@$(terraform output -raw droplet_ip)
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `digitalocean_token` | yes | — | yes | API token. |
| `name` | no | `snow-droplet` | no | Droplet name. |
| `region` | no | `nyc3` | no | Region. |
| `server_type` | no | `s-1vcpu-1gb` | no | Size slug. |
| `image` | no | `ubuntu-24-04-x64` | no | Image slug. |
| `ssh_public_key` | no | `""` | yes | Creates a key when set. |
| `ssh_keys` | no | `[]` | no | Existing key IDs / fingerprints. |
| `ipv6` | no | `false` | no | Enable IPv6. |
| `user_data` | no | `""` | no | Cloud-init. Empty omits. |
| `tags` | no | `["managed_by:terraform"]` | no | Tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `droplet_id` | `digitalocean_droplet.this.id` | Droplet ID. |
| `droplet_ip` | `.ipv4_address` | Public IPv4 (workflow `server_ip`). |
| `droplet_status` | `.status` | Status. |

## Docs

- [digitalocean_droplet](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet)
````

#### `backend.tf`

File: [v1/modules/dev/digitalocean/digitalocean_droplet/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/digitalocean/digitalocean_droplet/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/main.tf)

```hcl
terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
  required_version = ">= 1.3"
}

provider "digitalocean" {
  token = var.digitalocean_token
}

resource "digitalocean_ssh_key" "this" {
  count      = var.ssh_public_key != "" ? 1 : 0
  name       = "${var.name}-key"
  public_key = var.ssh_public_key
}

resource "digitalocean_droplet" "this" {
  image    = var.image
  name     = var.name
  region   = var.region
  size     = var.server_type
  ssh_keys = var.ssh_public_key != "" ? [digitalocean_ssh_key.this[0].id] : var.ssh_keys
  ipv6     = var.ipv6
  tags     = var.tags

  user_data = var.user_data == "" ? null : var.user_data
}
```

#### `outputs.tf`

File: [v1/modules/dev/digitalocean/digitalocean_droplet/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/outputs.tf)

```hcl
output "droplet_id" {
  value       = digitalocean_droplet.this.id
  description = "Droplet ID"
}

output "droplet_ip" {
  value       = digitalocean_droplet.this.ipv4_address
  description = "Public IPv4 address (maps to workflow server_ip)"
}

output "server_ipv4" {
  value       = digitalocean_droplet.this.ipv4_address
  description = "Alias of droplet_ip for the Snow workflow server_ip contract"
}

output "droplet_status" {
  value       = digitalocean_droplet.this.status
  description = "Droplet status"
}
```

#### `variables.tf`

File: [v1/modules/dev/digitalocean/digitalocean_droplet/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/variables.tf)

```hcl
variable "digitalocean_token" {
  description = "DigitalOcean API token (set via TF_VAR_digitalocean_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Droplet name (set via TF_VAR_name)"
  type        = string
  default     = "snow-droplet"
}

variable "region" {
  description = "DigitalOcean region (set via TF_VAR_region)"
  type        = string
  default     = "nyc3"
}

variable "server_type" {
  description = "Droplet size slug (set via TF_VAR_server_type)"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "image" {
  description = "Droplet image slug (set via TF_VAR_image)"
  type        = string
  default     = "ubuntu-24-04-x64"
}

variable "ssh_public_key" {
  description = "SSH public key to create and attach (set via TF_VAR_ssh_public_key). Empty skips key creation."
  type        = string
  default     = ""
  sensitive   = true
}

variable "ssh_keys" {
  description = "Existing SSH key IDs/fingerprints (set via TF_VAR_ssh_keys as JSON)"
  type        = list(string)
  default     = []
}

variable "ipv6" {
  description = "Enable IPv6 (set via TF_VAR_ipv6)"
  type        = bool
  default     = false
}

variable "user_data" {
  description = "Cloud-init user data (set via TF_VAR_user_data). Empty omits."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags (set via TF_VAR_tags as JSON)"
  type        = list(string)
  default     = ["managed_by:terraform"]
}
```

### `v1/modules/dev/digitalocean/digitalocean_droplet_autoscale`

#### `README_DIGITALOCEAN_DROPLET_AUTOSCALE.md`

File: [v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/README_DIGITALOCEAN_DROPLET_AUTOSCALE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/README_DIGITALOCEAN_DROPLET_AUTOSCALE.md)

````markdown
# DigitalOcean droplet autoscale pool

Creates a Droplet autoscale pool from a template (size, region, image, SSH keys).

**Path:** `v1/modules/dev/digitalocean/digitalocean_droplet_autoscale`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `digitalocean_ssh_key` | `this` | Created when `ssh_public_key` is non-empty. |
| `digitalocean_droplet_autoscale` | `this` | Pool with min/max instances and CPU/memory targets. |

Provider `digitalocean/digitalocean` `~> 2.0`. Token: `TF_VAR_digitalocean_token`. `config` holds `min_instances` (1), `max_instances` (3), utilization targets `0.5`, and `cooldown_minutes` (5). `droplet_template` uses `server_type`, `region`, `image`, SSH fingerprints, tags, IPv6, droplet agent, and optional user_data.

```
main.tf        # provider, optional SSH key, autoscale pool
variables.tf   # inputs
outputs.tf     # droplet_autoscale_id, droplet_autoscale_status
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_digitalocean_token="..."
export TF_VAR_name="snow-autoscale"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
export TF_VAR_min_instances=1
export TF_VAR_max_instances=3
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/terraform.tfstate"
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
terraform output droplet_autoscale_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `digitalocean_token` | yes | — | yes | API token. |
| `name` | no | `snow-autoscale` | no | Pool name. |
| `min_instances` | no | `1` | no | Minimum Droplets. |
| `max_instances` | no | `3` | no | Maximum Droplets. |
| `target_cpu_utilization` | no | `0.5` | no | Target CPU 0–1. |
| `target_memory_utilization` | no | `0.5` | no | Target memory 0–1. |
| `cooldown_minutes` | no | `5` | no | Scale cooldown. |
| `server_type` | no | `s-1vcpu-1gb` | no | Size slug. |
| `region` | no | `nyc3` | no | Region. |
| `image` | no | `ubuntu-24-04-x64` | no | Image slug. |
| `ssh_public_key` | no | `""` | yes | Creates a key when set. |
| `ssh_keys` | no | `[]` | no | Existing fingerprints. |
| `tags` | no | `["managed_by:terraform"]` | no | Tags. |
| `ipv6` | no | `false` | no | Enable IPv6. |
| `with_droplet_agent` | no | `true` | no | Install the Droplet agent. |
| `user_data` | no | `""` | no | Cloud-init. Empty omits. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `droplet_autoscale_id` | `digitalocean_droplet_autoscale.this.id` | Pool ID (workflow `resource_id`). |
| `droplet_autoscale_status` | `.status` | Status when the API returns it. |

## Docs

- [digitalocean_droplet_autoscale](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet_autoscale)
````

#### `backend.tf`

File: [v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/main.tf)

```hcl
terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
  required_version = ">= 1.3"
}

provider "digitalocean" {
  token = var.digitalocean_token
}

resource "digitalocean_ssh_key" "this" {
  count      = var.ssh_public_key != "" ? 1 : 0
  name       = "${var.name}-key"
  public_key = var.ssh_public_key
}

resource "digitalocean_droplet_autoscale" "this" {
  name = var.name

  config {
    min_instances             = var.min_instances
    max_instances             = var.max_instances
    target_cpu_utilization    = var.target_cpu_utilization
    target_memory_utilization = var.target_memory_utilization
    cooldown_minutes          = var.cooldown_minutes
  }

  droplet_template {
    size               = var.server_type
    region             = var.region
    image              = var.image
    ssh_keys           = var.ssh_public_key != "" ? [digitalocean_ssh_key.this[0].fingerprint] : var.ssh_keys
    tags               = var.tags
    ipv6               = var.ipv6
    with_droplet_agent = var.with_droplet_agent
    user_data          = var.user_data == "" ? null : var.user_data
  }
}
```

#### `outputs.tf`

File: [v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/outputs.tf)

```hcl
output "droplet_autoscale_id" {
  value       = digitalocean_droplet_autoscale.this.id
  description = "Autoscale pool ID (maps to workflow resource_id / server identity)"
}

output "droplet_autoscale_status" {
  value       = try(digitalocean_droplet_autoscale.this.status, null)
  description = "Autoscale pool status when available"
}
```

#### `variables.tf`

File: [v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/variables.tf)

```hcl
variable "digitalocean_token" {
  description = "DigitalOcean API token (set via TF_VAR_digitalocean_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Autoscale pool name (set via TF_VAR_name)"
  type        = string
  default     = "snow-autoscale"
}

variable "min_instances" {
  description = "Minimum instances (set via TF_VAR_min_instances)"
  type        = number
  default     = 1
}

variable "max_instances" {
  description = "Maximum instances (set via TF_VAR_max_instances)"
  type        = number
  default     = 3
}

variable "target_cpu_utilization" {
  description = "Target CPU utilization 0-1 (set via TF_VAR_target_cpu_utilization)"
  type        = number
  default     = 0.5
}

variable "target_memory_utilization" {
  description = "Target memory utilization 0-1 (set via TF_VAR_target_memory_utilization)"
  type        = number
  default     = 0.5
}

variable "cooldown_minutes" {
  description = "Cooldown minutes (set via TF_VAR_cooldown_minutes)"
  type        = number
  default     = 5
}

variable "server_type" {
  description = "Droplet size slug (set via TF_VAR_server_type)"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "region" {
  description = "DigitalOcean region (set via TF_VAR_region)"
  type        = string
  default     = "nyc3"
}

variable "image" {
  description = "Droplet image slug (set via TF_VAR_image)"
  type        = string
  default     = "ubuntu-24-04-x64"
}

variable "ssh_public_key" {
  description = "SSH public key (set via TF_VAR_ssh_public_key). Empty skips key creation."
  type        = string
  default     = ""
  sensitive   = true
}

variable "ssh_keys" {
  description = "Existing SSH key fingerprints (set via TF_VAR_ssh_keys as JSON)"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Droplet tags (set via TF_VAR_tags as JSON)"
  type        = list(string)
  default     = ["managed_by:terraform"]
}

variable "ipv6" {
  description = "Enable IPv6 (set via TF_VAR_ipv6)"
  type        = bool
  default     = false
}

variable "with_droplet_agent" {
  description = "Install droplet agent (set via TF_VAR_with_droplet_agent)"
  type        = bool
  default     = true
}

variable "user_data" {
  description = "Cloud-init user data (set via TF_VAR_user_data). Empty omits."
  type        = string
  default     = ""
}
```

### `v1/modules/dev/digitalocean/droplet`

#### `README_DROPLET.md`

File: [v1/modules/dev/digitalocean/droplet/README_DROPLET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/README_DROPLET.md)

````markdown
# DigitalOcean droplet (legacy)

Older Droplet project with fewer options. Prefer [`digitalocean_droplet`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/digitalocean_droplet/README_DIGITALOCEAN_DROPLET.md).

**Path:** `v1/modules/dev/digitalocean/droplet`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `digitalocean_droplet` | `web` | Droplet named `var.droplet_name`. |

Provider `digitalocean/digitalocean` `2.54.0` (pinned). Token: `TF_VAR_digitalocean_token`. No SSH key, tags, IPv6, or user_data. Default image `ubuntu-22-04-x64`. Outputs live in `output.tf` (singular). Terraform `required_version` is `>= 0.13.0`.

```
provider.tf    # digitalocean provider
droplet.tf     # droplet
variables.tf   # inputs
output.tf      # droplet_ip
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_digitalocean_token="..."
export TF_VAR_droplet_name="web-server"
export TF_VAR_region="nyc3"
export TF_VAR_droplet_size="s-1vcpu-1gb"
export TF_VAR_droplet_image="ubuntu-22-04-x64"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/digitalocean/droplet/terraform.tfstate"
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
terraform output -raw droplet_ip
```

Without an SSH key this Droplet is only reachable if you add a key in the DigitalOcean account or console.

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `digitalocean_token` | yes | — | yes | API token. |
| `region` | no | `nyc3` | no | Region. |
| `droplet_name` | no | `web-server` | no | Droplet name. |
| `droplet_size` | no | `s-1vcpu-1gb` | no | Size slug. |
| `droplet_image` | no | `ubuntu-22-04-x64` | no | Image slug. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `droplet_ip` | `digitalocean_droplet.web.ipv4_address` | Public IPv4. |

## Docs

- [digitalocean_droplet](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet)
````

#### `backend.tf`

File: [v1/modules/dev/digitalocean/droplet/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `droplet.tf`

File: [v1/modules/dev/digitalocean/droplet/droplet.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/droplet.tf)

```hcl
# Create a new Web Droplet in the nyc2 region
resource "digitalocean_droplet" "web" {
  image    = var.droplet_image
  name     = var.droplet_name
  region   = var.region
  size     = var.droplet_size
}
```

#### `output.tf`

File: [v1/modules/dev/digitalocean/droplet/output.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/output.tf)

```hcl
output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}
```

#### `provider.tf`

File: [v1/modules/dev/digitalocean/droplet/provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/provider.tf)

```hcl
terraform {

  required_version = ">= 0.13.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.54.0"
    }
  }


}

provider "digitalocean" {
  # Configuration options
  token = var.digitalocean_token
}
```

#### `variables.tf`

File: [v1/modules/dev/digitalocean/droplet/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean/droplet/variables.tf)

```hcl
variable "digitalocean_token" {
  type      = string
  sensitive = true
}

variable "region" {
  description = "The region to create resources in"
  type        = string
  default     = "nyc3"
}

variable "droplet_name" {
  description = "Name of the droplet"
  type        = string
  default     = "web-server"
}

variable "droplet_size" {
  description = "Droplet size slug"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "droplet_image" {
  description = "Droplet image slug"
  type        = string
  default     = "ubuntu-22-04-x64"
}
```

### `v1/modules/dev/gcp/compute`

#### `README_COMPUTE.md`

File: [v1/modules/dev/gcp/compute/README_COMPUTE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/README_COMPUTE.md)

````markdown
# GCP Compute Engine instance (legacy demo)

Older hardcoded Compute Engine demo. Prefer [`google_compute_instance`](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md) for parameterized usage.

**Path:** `v1/modules/dev/gcp/compute`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_compute_instance` | `default` | VM named `my-vm`, type `n1-standard-1`, zone `us-central1-a`. |

Provider `hashicorp/google` `6.36.1` (pinned). Project, region, and zone are **hardcoded** in `provider.tf` (`udemyiactraining`, `us-central1`, `us-central1-c`). There is no credentials variable; the provider uses ADC / environment credentials. There are no `variables.tf` or `outputs.tf`.

Boot disk image is `ubuntu-minimal-2210-kinetic-amd64-v20230126`. Network is `default` with an empty `access_config` (ephemeral public IP). Metadata `startup-script-url` points at `../scripts/init-script.sh`.

```
provider.tf           # google provider, hardcoded project
compute-instance.tf   # instance
backend.tf            # backend "s3" {}
```

The provider zone (`us-central1-c`) does not match the instance zone (`us-central1-a`). Terraform `required_version` is `>= 0.13.0`, unlike the `>= 1.3` modules.

## Usage

This project cannot be configured with `TF_VAR_*` resource inputs. It always creates `my-vm` in the hardcoded project.

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md).

```bash
# ADC or GOOGLE_APPLICATION_CREDENTIALS must point at a SA for project udemyiactraining
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/compute/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

There are no outputs. Inspect with `terraform state show google_compute_instance.default`.

## Inputs

None.

## Outputs

None.

## Docs

- [google_compute_instance](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance)
- Parameterized replacement: [google_compute_instance](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md)
````

#### `backend.tf`

File: [v1/modules/dev/gcp/compute/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `compute-instance.tf`

File: [v1/modules/dev/gcp/compute/compute-instance.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/compute-instance.tf)

```hcl
resource "google_compute_instance" "default" {
  name         = "my-vm"
  machine_type = "n1-standard-1"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-minimal-2210-kinetic-amd64-v20230126"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata = {
    startup-script-url        = "../scripts/init-script.sh"
  }
}
```

#### `provider.tf`

File: [v1/modules/dev/gcp/compute/provider.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/compute/provider.tf)

```hcl
terraform {

  required_version = ">= 0.13.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.36.1"
    }
  }
}

provider "google" {
  project = "udemyiactraining"
  region  = "us-central1"
  zone    = "us-central1-c"
}
```

### `v1/modules/dev/gcp/google_compute_instance`

#### `README_GOOGLE_COMPUTE_INSTANCE.md`

File: [v1/modules/dev/gcp/google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md)

````markdown
# GCP Compute Engine instance

Creates a Compute Engine VM with an optional public IP and SSH metadata.

**Path:** `v1/modules/dev/gcp/google_compute_instance`

Prefer this project over the older `gcp/compute` demo, which hardcodes names and has no variables.

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_compute_instance` | `this` | VM. Machine type is `server_type`. Boot disk from `image` / `disk_size_gb`. |

Provider `hashicorp/google` `~> 8.0`. Project is required. `credentials` is service-account JSON; empty uses Application Default Credentials. Public IP is an ephemeral `access_config` when `associate_public_ip` is true. If `ssh_public_key` is set, metadata is only `ssh-keys` (`ssh_user:key`) and `var.metadata` is ignored.

```
main.tf        # provider, instance
variables.tf   # inputs
outputs.tf     # instance_id, instance_name, public_ip, private_ip
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_project="your-gcp-project"
export TF_VAR_name="snow-vm"
export TF_VAR_server_type="e2-micro"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
# optional: export TF_VAR_credentials="$(cat ./sa.json)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/google_compute_instance/terraform.tfstate"
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
terraform output -raw public_ip
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `project` | yes | — | no | GCP project ID. |
| `credentials` | no | `""` | yes | SA JSON. Empty uses ADC. |
| `name` | no | `snow-vm` | no | Instance name. |
| `region` | no | `us-central1` | no | Provider region. |
| `server_type` | no | `e2-micro` | no | Machine type. |
| `zone` | no | `us-central1-a` | no | Zone. |
| `image` | no | `debian-cloud/debian-12` | no | Boot image. |
| `disk_size_gb` | no | `20` | no | Boot disk GB. |
| `network` | no | `default` | no | VPC. |
| `subnetwork` | no | `""` | no | Empty omits. |
| `associate_public_ip` | no | `true` | no | Ephemeral public IP. |
| `ssh_user` | no | `snow` | no | SSH username. |
| `ssh_public_key` | no | `""` | yes | Empty skips ssh-keys metadata. |
| `metadata` | no | `{}` | no | Used when no SSH key. |
| `labels` | no | `{}` | no | Labels (merged with `managed_by=terraform`). |
| `tags` | no | `[]` | no | Network tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `instance_id` | `google_compute_instance.this.id` | Instance ID. |
| `instance_name` | `.name` | Name. |
| `public_ip` | `access_config[0].nat_ip` | Public IP, or null. |
| `private_ip` | `.network_interface[0].network_ip` | Private IP. |

## Docs

- [google_compute_instance](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance)
````

#### `backend.tf`

File: [v1/modules/dev/gcp/google_compute_instance/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/gcp/google_compute_instance/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/main.tf)

```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.0"
    }
  }
  required_version = ">= 1.3"
}

provider "google" {
  project     = var.project
  region      = var.region
  credentials = var.credentials == "" ? null : var.credentials
}

resource "google_compute_instance" "this" {
  name         = var.name
  machine_type = var.server_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = var.image
      size  = var.disk_size_gb
    }
  }

  network_interface {
    network    = var.network
    subnetwork = var.subnetwork == "" ? null : var.subnetwork

    dynamic "access_config" {
      for_each = var.associate_public_ip ? [1] : []
      content {}
    }
  }

  metadata = var.ssh_public_key != "" ? {
    ssh-keys = "${var.ssh_user}:${var.ssh_public_key}"
  } : var.metadata

  labels = merge(
    {
      managed_by = "terraform"
    },
    var.labels,
  )

  tags = var.tags
}
```

#### `outputs.tf`

File: [v1/modules/dev/gcp/google_compute_instance/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/outputs.tf)

```hcl
output "instance_id" {
  value       = google_compute_instance.this.id
  description = "Compute instance ID"
}

output "instance_name" {
  value       = google_compute_instance.this.name
  description = "Compute instance name"
}

output "public_ip" {
  value = try(
    google_compute_instance.this.network_interface[0].access_config[0].nat_ip,
    null,
  )
  description = "Public IPv4 address (maps to workflow server_ip)"
}

output "server_ipv4" {
  value = try(
    google_compute_instance.this.network_interface[0].access_config[0].nat_ip,
    null,
  )
  description = "Alias of public_ip for the Snow workflow server_ip contract"
}

output "private_ip" {
  value       = google_compute_instance.this.network_interface[0].network_ip
  description = "Private IPv4 address"
}
```

#### `variables.tf`

File: [v1/modules/dev/gcp/google_compute_instance/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_compute_instance/variables.tf)

```hcl
variable "project" {
  description = "GCP project ID (set via TF_VAR_project)"
  type        = string
}

variable "region" {
  description = "GCP region (set via TF_VAR_region)"
  type        = string
  default     = "us-central1"
}

variable "credentials" {
  description = "GCP service account JSON (set via TF_VAR_credentials). Empty uses GOOGLE_CREDENTIALS / ADC."
  type        = string
  default     = ""
  sensitive   = true
}

variable "name" {
  description = "Compute instance name (set via TF_VAR_name)"
  type        = string
  default     = "snow-vm"
}

variable "server_type" {
  description = "Machine type (set via TF_VAR_server_type)"
  type        = string
  default     = "e2-micro"
}

variable "zone" {
  description = "GCP zone (set via TF_VAR_zone)"
  type        = string
  default     = "us-central1-a"
}

variable "image" {
  description = "Boot disk image (set via TF_VAR_image)"
  type        = string
  default     = "debian-cloud/debian-12"
}

variable "disk_size_gb" {
  description = "Boot disk size in GB (set via TF_VAR_disk_size_gb)"
  type        = number
  default     = 20
}

variable "network" {
  description = "VPC network (set via TF_VAR_network)"
  type        = string
  default     = "default"
}

variable "subnetwork" {
  description = "Subnetwork self link or name (set via TF_VAR_subnetwork). Empty omits."
  type        = string
  default     = ""
}

variable "associate_public_ip" {
  description = "Assign an ephemeral public IP (set via TF_VAR_associate_public_ip)"
  type        = bool
  default     = true
}

variable "ssh_user" {
  description = "SSH username for metadata ssh-keys (set via TF_VAR_ssh_user)"
  type        = string
  default     = "snow"
}

variable "ssh_public_key" {
  description = "SSH public key (set via TF_VAR_ssh_public_key). Empty skips metadata ssh-keys."
  type        = string
  default     = ""
  sensitive   = true
}

variable "metadata" {
  description = "Instance metadata map when ssh_public_key is empty (set via TF_VAR_metadata as JSON)"
  type        = map(string)
  default     = {}
}

variable "labels" {
  description = "Labels (set via TF_VAR_labels as JSON)"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Network tags (set via TF_VAR_tags as JSON)"
  type        = list(string)
  default     = []
}
```

### `v1/modules/dev/gcp/google_sql_database_instance`

#### `README_GOOGLE_SQL_DATABASE_INSTANCE.md`

File: [v1/modules/dev/gcp/google_sql_database_instance/README_GOOGLE_SQL_DATABASE_INSTANCE.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/README_GOOGLE_SQL_DATABASE_INSTANCE.md)

````markdown
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

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

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
````

#### `backend.tf`

File: [v1/modules/dev/gcp/google_sql_database_instance/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/gcp/google_sql_database_instance/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/main.tf)

```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.0"
    }
  }
  required_version = ">= 1.3"
}

provider "google" {
  project     = var.project
  region      = var.region
  credentials = var.credentials == "" ? null : var.credentials
}

resource "google_sql_database_instance" "this" {
  name             = var.name
  database_version = var.database_version
  region           = var.region
  deletion_protection = var.deletion_protection

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_size         = var.disk_size
    disk_type         = var.disk_type

    ip_configuration {
      ipv4_enabled = var.ipv4_enabled
    }

    user_labels = merge(
      {
        managed_by = "terraform"
      },
      var.labels,
    )
  }
}
```

#### `outputs.tf`

File: [v1/modules/dev/gcp/google_sql_database_instance/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/outputs.tf)

```hcl
output "sql_instance_id" {
  value       = google_sql_database_instance.this.id
  description = "Cloud SQL instance ID (maps to workflow resource_id)"
}

output "connection_name" {
  value       = google_sql_database_instance.this.connection_name
  description = "Connection name"
}

output "public_ip_address" {
  value       = google_sql_database_instance.this.public_ip_address
  description = "Public IP address when enabled"
}

output "private_ip_address" {
  value       = google_sql_database_instance.this.private_ip_address
  description = "Private IP address when configured"
}
```

#### `variables.tf`

File: [v1/modules/dev/gcp/google_sql_database_instance/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_sql_database_instance/variables.tf)

```hcl
variable "project" {
  description = "GCP project ID (set via TF_VAR_project)"
  type        = string
}

variable "region" {
  description = "GCP region (set via TF_VAR_region)"
  type        = string
  default     = "us-central1"
}

variable "credentials" {
  description = "GCP service account JSON (set via TF_VAR_credentials). Empty uses GOOGLE_CREDENTIALS / ADC."
  type        = string
  default     = ""
  sensitive   = true
}

variable "name" {
  description = "Cloud SQL instance name (set via TF_VAR_name)"
  type        = string
  default     = "snow-sql"
}

variable "database_version" {
  description = "Database version (set via TF_VAR_database_version)"
  type        = string
  default     = "POSTGRES_15"
}

variable "tier" {
  description = "Machine tier (set via TF_VAR_tier)"
  type        = string
  default     = "db-f1-micro"
}

variable "availability_type" {
  description = "ZONAL or REGIONAL (set via TF_VAR_availability_type)"
  type        = string
  default     = "ZONAL"
}

variable "disk_size" {
  description = "Disk size in GB (set via TF_VAR_disk_size)"
  type        = number
  default     = 10
}

variable "disk_type" {
  description = "Disk type (set via TF_VAR_disk_type)"
  type        = string
  default     = "PD_SSD"
}

variable "ipv4_enabled" {
  description = "Enable public IPv4 (set via TF_VAR_ipv4_enabled)"
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Enable deletion protection (set via TF_VAR_deletion_protection)"
  type        = bool
  default     = false
}

variable "labels" {
  description = "User labels (set via TF_VAR_labels as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/gcp/google_storage_bucket`

#### `README_GOOGLE_STORAGE_BUCKET.md`

File: [v1/modules/dev/gcp/google_storage_bucket/README_GOOGLE_STORAGE_BUCKET.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/README_GOOGLE_STORAGE_BUCKET.md)

````markdown
# GCP Cloud Storage bucket

Creates a Cloud Storage bucket with uniform bucket-level access on by default.

**Path:** `v1/modules/dev/gcp/google_storage_bucket`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_storage_bucket` | `this` | Bucket named `var.name` (globally unique). |

Provider `hashicorp/google` `~> 8.0`. Provider `region` is separate from bucket `location` (default `US`). Storage class default `STANDARD`. `force_destroy` defaults to `false`. Labels merge `managed_by=terraform`.

```
main.tf        # provider, bucket
variables.tf   # inputs
outputs.tf     # bucket_id, bucket_name, bucket_url
backend.tf     # backend "s3" {}
```

Upload objects with `google_storage_bucket_object`.

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_project="your-gcp-project"
export TF_VAR_name="snow-gcs-bucket"
export TF_VAR_location="US"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/google_storage_bucket/terraform.tfstate"
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
terraform output -raw bucket_name
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `project` | yes | — | no | GCP project ID. |
| `credentials` | no | `""` | yes | SA JSON. Empty uses ADC. |
| `name` | no | `snow-gcs-bucket` | no | Globally unique bucket name. |
| `region` | no | `us-central1` | no | Provider region. |
| `location` | no | `US` | no | Bucket location. |
| `force_destroy` | no | `false` | no | Destroy with objects. |
| `uniform_bucket_level_access` | no | `true` | no | UBLA. |
| `storage_class` | no | `STANDARD` | no | Storage class. |
| `labels` | no | `{}` | no | Extra labels. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `bucket_id` | `google_storage_bucket.this.id` | Bucket ID. |
| `bucket_name` | `.name` | Name. |
| `bucket_url` | `.url` | `gs://` URL. |

## Docs

- [google_storage_bucket](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket)
````

#### `backend.tf`

File: [v1/modules/dev/gcp/google_storage_bucket/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/gcp/google_storage_bucket/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/main.tf)

```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.0"
    }
  }
  required_version = ">= 1.3"
}

provider "google" {
  project     = var.project
  region      = var.region
  credentials = var.credentials == "" ? null : var.credentials
}

resource "google_storage_bucket" "this" {
  name                        = var.name
  location                    = var.location
  force_destroy               = var.force_destroy
  uniform_bucket_level_access = var.uniform_bucket_level_access
  storage_class               = var.storage_class

  labels = merge(
    {
      managed_by = "terraform"
    },
    var.labels,
  )
}
```

#### `outputs.tf`

File: [v1/modules/dev/gcp/google_storage_bucket/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/outputs.tf)

```hcl
output "bucket_id" {
  value       = google_storage_bucket.this.id
  description = "Bucket ID (maps to workflow resource_id)"
}

output "bucket_name" {
  value       = google_storage_bucket.this.name
  description = "Bucket name"
}

output "bucket_url" {
  value       = google_storage_bucket.this.url
  description = "Bucket URL"
}
```

#### `variables.tf`

File: [v1/modules/dev/gcp/google_storage_bucket/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket/variables.tf)

```hcl
variable "project" {
  description = "GCP project ID (set via TF_VAR_project)"
  type        = string
}

variable "region" {
  description = "GCP region (set via TF_VAR_region)"
  type        = string
  default     = "us-central1"
}

variable "credentials" {
  description = "GCP service account JSON (set via TF_VAR_credentials). Empty uses GOOGLE_CREDENTIALS / ADC."
  type        = string
  default     = ""
  sensitive   = true
}

variable "name" {
  description = "Bucket name (set via TF_VAR_name). Must be globally unique."
  type        = string
  default     = "snow-gcs-bucket"
}

variable "location" {
  description = "Bucket location (set via TF_VAR_location)"
  type        = string
  default     = "US"
}

variable "force_destroy" {
  description = "Allow destroy with objects (set via TF_VAR_force_destroy)"
  type        = bool
  default     = false
}

variable "uniform_bucket_level_access" {
  description = "Enable uniform bucket-level access (set via TF_VAR_uniform_bucket_level_access)"
  type        = bool
  default     = true
}

variable "storage_class" {
  description = "Storage class (set via TF_VAR_storage_class)"
  type        = string
  default     = "STANDARD"
}

variable "labels" {
  description = "Labels (set via TF_VAR_labels as JSON)"
  type        = map(string)
  default     = {}
}
```

### `v1/modules/dev/gcp/google_storage_bucket_object`

#### `README_GOOGLE_STORAGE_BUCKET_OBJECT.md`

File: [v1/modules/dev/gcp/google_storage_bucket_object/README_GOOGLE_STORAGE_BUCKET_OBJECT.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/README_GOOGLE_STORAGE_BUCKET_OBJECT.md)

````markdown
# GCP Cloud Storage object

Uploads an object into an existing Cloud Storage bucket.

**Path:** `v1/modules/dev/gcp/google_storage_bucket_object`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_storage_bucket_object` | `this` | Object `name` in `bucket`. |

Provider `hashicorp/google` `~> 8.0`. The bucket is referenced by name only (create it with `google_storage_bucket`). Default content is the string `hello from terraform`. If `source` is set, that local file is uploaded and `content` should be left empty. Empty `content_type` / `cache_control` become `null`.

```
main.tf        # provider, object
variables.tf   # inputs
outputs.tf     # object_id, object_name, media_link
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_project="your-gcp-project"
export TF_VAR_bucket="snow-gcs-bucket"
export TF_VAR_name="hello.txt"
export TF_VAR_content="hello from terraform"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/google_storage_bucket_object/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

Upload a file instead of inline content:

```bash
export TF_VAR_content=""
export TF_VAR_source="./local-file.txt"
export TF_VAR_content_type="text/plain"
```

```bash
terraform output -raw media_link
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `project` | yes | — | no | GCP project ID. |
| `bucket` | yes | — | no | Existing bucket name. |
| `credentials` | no | `""` | yes | SA JSON. Empty uses ADC. |
| `name` | no | `hello.txt` | no | Object path. |
| `region` | no | `us-central1` | no | Provider region. |
| `content` | no | `hello from terraform` | no | Inline body. Conflicts with `source`. |
| `source` | no | `""` | no | Local file path. |
| `content_type` | no | `text/plain` | no | Empty omits. |
| `cache_control` | no | `""` | no | Empty omits. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `object_id` | `google_storage_bucket_object.this.id` | Object ID. |
| `object_name` | `.name` | Name. |
| `media_link` | `.media_link` | Download URL. |

## Docs

- [google_storage_bucket_object](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket_object)
````

#### `backend.tf`

File: [v1/modules/dev/gcp/google_storage_bucket_object/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/gcp/google_storage_bucket_object/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/main.tf)

```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.0"
    }
  }
  required_version = ">= 1.3"
}

provider "google" {
  project     = var.project
  region      = var.region
  credentials = var.credentials == "" ? null : var.credentials
}

resource "google_storage_bucket_object" "this" {
  name         = var.name
  bucket       = var.bucket
  content      = var.content != "" ? var.content : null
  source       = var.source != "" ? var.source : null
  content_type = var.content_type == "" ? null : var.content_type
  cache_control = var.cache_control == "" ? null : var.cache_control
}
```

#### `outputs.tf`

File: [v1/modules/dev/gcp/google_storage_bucket_object/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/outputs.tf)

```hcl
output "object_id" {
  value       = google_storage_bucket_object.this.id
  description = "Object ID (maps to workflow resource_id)"
}

output "object_name" {
  value       = google_storage_bucket_object.this.name
  description = "Object name"
}

output "media_link" {
  value       = google_storage_bucket_object.this.media_link
  description = "Media download link"
}
```

#### `variables.tf`

File: [v1/modules/dev/gcp/google_storage_bucket_object/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp/google_storage_bucket_object/variables.tf)

```hcl
variable "project" {
  description = "GCP project ID (set via TF_VAR_project)"
  type        = string
}

variable "region" {
  description = "GCP region (set via TF_VAR_region)"
  type        = string
  default     = "us-central1"
}

variable "credentials" {
  description = "GCP service account JSON (set via TF_VAR_credentials). Empty uses GOOGLE_CREDENTIALS / ADC."
  type        = string
  default     = ""
  sensitive   = true
}

variable "name" {
  description = "Object name/path (set via TF_VAR_name)"
  type        = string
  default     = "hello.txt"
}

variable "bucket" {
  description = "Target bucket name (set via TF_VAR_bucket)"
  type        = string
}

variable "content" {
  description = "Inline object content (set via TF_VAR_content). Conflicts with source."
  type        = string
  default     = "hello from terraform"
}

variable "source" {
  description = "Local file path (set via TF_VAR_source). Empty uses content."
  type        = string
  default     = ""
}

variable "content_type" {
  description = "Content type (set via TF_VAR_content_type). Empty omits."
  type        = string
  default     = "text/plain"
}

variable "cache_control" {
  description = "Cache-Control header (set via TF_VAR_cache_control). Empty omits."
  type        = string
  default     = ""
}
```

### `v1/modules/dev/hetzner/hcloud_firewall`

#### `README_HCLOUD_FIREWALL.md`

File: [v1/modules/dev/hetzner/hcloud_firewall/README_HCLOUD_FIREWALL.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/README_HCLOUD_FIREWALL.md)

````markdown
# Hetzner Cloud firewall

Creates a Hetzner Cloud firewall with inbound ICMP, SSH, HTTP, and HTTPS open by default.

**Path:** `v1/modules/dev/hetzner/hcloud_firewall`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_firewall` | `this` | Firewall named `var.name`. Dynamic `rule` from `var.rules`. Dynamic `apply_to` from `var.apply_to`. |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. Optional rule fields (`port`, `source_ips`, `destination_ips`, `description`) use `try()`. Default rules allow ICMP plus TCP 22/80/443 from `0.0.0.0/0` and `::/0`. `apply_to` defaults to empty, so the firewall exists but is not attached until you pass servers or a label selector.

```
main.tf        # provider, firewall
variables.tf   # inputs
outputs.tf     # firewall_id, firewall_name, firewall_rules
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md). Lists and objects are JSON in the env var.

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="snow-firewall"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_firewall/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

Attach to a server after `hcloud_server` exists:

```bash
export TF_VAR_apply_to="[{\"server\": $(terraform -chdir=../hcloud_server output -raw server_id)}]"
terraform apply
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `name` | no | `snow-firewall` | no | Firewall name. |
| `labels` | no | `{ managed_by = "terraform" }` | no | Labels. |
| `rules` | no | ICMP + TCP 22/80/443 from anywhere | no | Rule list. |
| `apply_to` | no | `[]` | no | `{ server }` and/or `{ label_selector }`. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `firewall_id` | `hcloud_firewall.this.id` | Firewall ID. |
| `firewall_name` | `.name` | Name. |
| `firewall_rules` | `.rule` | Applied rules. |

## Docs

- [hcloud_firewall](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/firewall)
````

#### `backend.tf`

File: [v1/modules/dev/hetzner/hcloud_firewall/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/hetzner/hcloud_firewall/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/main.tf)

```hcl
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.68"
    }
  }
  required_version = ">= 1.3"
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_firewall" "this" {
  name   = var.name
  labels = var.labels

  dynamic "rule" {
    for_each = var.rules
    content {
      direction       = rule.value.direction
      protocol        = rule.value.protocol
      port            = try(rule.value.port, null)
      source_ips      = try(rule.value.source_ips, null)
      destination_ips = try(rule.value.destination_ips, null)
      description     = try(rule.value.description, null)
    }
  }

  dynamic "apply_to" {
    for_each = var.apply_to
    content {
      server         = try(apply_to.value.server, null)
      label_selector = try(apply_to.value.label_selector, null)
    }
  }
}
```

#### `outputs.tf`

File: [v1/modules/dev/hetzner/hcloud_firewall/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/outputs.tf)

```hcl
output "firewall_id" {
  value       = hcloud_firewall.this.id
  description = "Hetzner Cloud firewall ID"
}

output "firewall_name" {
  value       = hcloud_firewall.this.name
  description = "Name of the firewall"
}

output "firewall_rules" {
  value       = hcloud_firewall.this.rule
  description = "Configured firewall rules"
}
```

#### `variables.tf`

File: [v1/modules/dev/hetzner/hcloud_firewall/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall/variables.tf)

```hcl
variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the firewall (set via TF_VAR_name)"
  type        = string
  default     = "snow-firewall"
}

variable "labels" {
  description = "User-defined labels for the firewall (set via TF_VAR_labels)"
  type        = map(string)
  default = {
    managed_by = "terraform"
  }
}

variable "rules" {
  description = "Firewall rules (set via TF_VAR_rules): direction, protocol, optional port / source_ips / destination_ips / description"
  type = list(object({
    direction       = string
    protocol        = string
    port            = optional(string)
    source_ips      = optional(list(string))
    destination_ips = optional(list(string))
    description     = optional(string)
  }))
  default = [
    {
      direction = "in"
      protocol  = "icmp"
      source_ips = [
        "0.0.0.0/0",
        "::/0",
      ]
      description = "Allow ICMP"
    },
    {
      direction = "in"
      protocol  = "tcp"
      port      = "22"
      source_ips = [
        "0.0.0.0/0",
        "::/0",
      ]
      description = "Allow SSH"
    },
    {
      direction = "in"
      protocol  = "tcp"
      port      = "80"
      source_ips = [
        "0.0.0.0/0",
        "::/0",
      ]
      description = "Allow HTTP"
    },
    {
      direction = "in"
      protocol  = "tcp"
      port      = "443"
      source_ips = [
        "0.0.0.0/0",
        "::/0",
      ]
      description = "Allow HTTPS"
    },
  ]
}

variable "apply_to" {
  description = "Optional apply_to blocks (set via TF_VAR_apply_to): server id and/or label_selector"
  type = list(object({
    server         = optional(number)
    label_selector = optional(string)
  }))
  default = []
}
```

### `v1/modules/dev/hetzner/hcloud_floating_ip`

#### `README_HCLOUD_FLOATING_IP.md`

File: [v1/modules/dev/hetzner/hcloud_floating_ip/README_HCLOUD_FLOATING_IP.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/README_HCLOUD_FLOATING_IP.md)

````markdown
# Hetzner Cloud floating IP

Creates a Hetzner Cloud floating IP. Optionally assigns it to a server on create.

**Path:** `v1/modules/dev/hetzner/hcloud_floating_ip`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_floating_ip` | `this` | Floating IP of `type` (`ipv4` or `ipv6`). |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. If `server_id` is set, the IP is assigned to that server and `home_location` is omitted. If `server_id` is null, `home_location` is used (default `hel1`). Empty `description` becomes `null`.

```
main.tf        # provider, floating IP
variables.tf   # inputs
outputs.tf     # floating_ip_id, ip_address, floating_ip_name, home_location
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="snow-floating-ip"
export TF_VAR_type="ipv4"
export TF_VAR_home_location="hel1"
# optional assign:
# export TF_VAR_server_id="$(terraform -chdir=../hcloud_server output -raw server_id)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_floating_ip/terraform.tfstate"
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
terraform output -raw ip_address
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `type` | no | `ipv4` | no | `ipv4` or `ipv6`. |
| `name` | no | `snow-floating-ip` | no | Name. |
| `home_location` | no | `hel1` | no | Used when `server_id` is unset. |
| `server_id` | no | `null` | no | Assign on create. |
| `description` | no | `""` | no | Empty omits. |
| `labels` | no | `{ managed_by = "terraform" }` | no | Labels. |
| `delete_protection` | no | `false` | no | Block delete in the API. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `floating_ip_id` | `hcloud_floating_ip.this.id` | ID. |
| `ip_address` | `.ip_address` | Address. |
| `floating_ip_name` | `.name` | Name. |
| `home_location` | `.home_location` | Home location. |

## Docs

- [hcloud_floating_ip](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/floating_ip)
````

#### `backend.tf`

File: [v1/modules/dev/hetzner/hcloud_floating_ip/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/hetzner/hcloud_floating_ip/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/main.tf)

```hcl
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.68"
    }
  }
  required_version = ">= 1.3"
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_floating_ip" "this" {
  type              = var.type
  name              = var.name
  home_location     = var.server_id == null ? var.home_location : null
  server_id         = var.server_id
  description       = var.description == "" ? null : var.description
  labels            = var.labels
  delete_protection = var.delete_protection
}
```

#### `outputs.tf`

File: [v1/modules/dev/hetzner/hcloud_floating_ip/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/outputs.tf)

```hcl
output "floating_ip_id" {
  value       = hcloud_floating_ip.this.id
  description = "Hetzner Cloud Floating IP ID (maps to workflow resource_id)"
}

output "ip_address" {
  value       = hcloud_floating_ip.this.ip_address
  description = "IP address of the Floating IP"
}

output "floating_ip_name" {
  value       = hcloud_floating_ip.this.name
  description = "Name of the Floating IP"
}

output "home_location" {
  value       = hcloud_floating_ip.this.home_location
  description = "Home location of the Floating IP"
}
```

#### `variables.tf`

File: [v1/modules/dev/hetzner/hcloud_floating_ip/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip/variables.tf)

```hcl
variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "type" {
  description = "Type of the Floating IP: ipv4 or ipv6 (set via TF_VAR_type)"
  type        = string
  default     = "ipv4"
}

variable "name" {
  description = "Name of the Floating IP (set via TF_VAR_name)"
  type        = string
  default     = "snow-floating-ip"
}

variable "home_location" {
  description = "Home location when not assigning via server_id (set via TF_VAR_home_location). Conflicts with server_id."
  type        = string
  default     = "hel1"
}

variable "server_id" {
  description = "Optional server ID to assign on create (set via TF_VAR_server_id). Null uses home_location instead."
  type        = number
  default     = null
}

variable "description" {
  description = "Optional description (set via TF_VAR_description). Empty omits."
  type        = string
  default     = ""
}

variable "labels" {
  description = "User-defined labels (set via TF_VAR_labels)"
  type        = map(string)
  default = {
    managed_by = "terraform"
  }
}

variable "delete_protection" {
  description = "Enable delete protection (set via TF_VAR_delete_protection)"
  type        = bool
  default     = false
}
```

### `v1/modules/dev/hetzner/hcloud_network`

#### `README_HCLOUD_NETWORK.md`

File: [v1/modules/dev/hetzner/hcloud_network/README_HCLOUD_NETWORK.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/README_HCLOUD_NETWORK.md)

````markdown
# Hetzner Cloud network

Creates a private Hetzner Cloud network. It does not create a subnet.

**Path:** `v1/modules/dev/hetzner/hcloud_network`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_network` | `this` | Private network with `ip_range` (default `10.0.0.0/16`). |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. Labels default to `{ managed_by = "terraform" }`. `delete_protection` and `expose_routes_to_vswitch` default to `false`.

```
main.tf        # provider, network
variables.tf   # inputs
outputs.tf     # network_id, network_name, ip_range
backend.tf     # backend "s3" {}
```

Add a subnet in Hetzner (or another module) before attaching servers.

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="snow-network"
export TF_VAR_ip_range="10.0.0.0/16"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_network/terraform.tfstate"
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
terraform output -raw network_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `name` | no | `snow-network` | no | Network name. |
| `ip_range` | no | `10.0.0.0/16` | no | RFC1918 CIDR. |
| `labels` | no | `{ managed_by = "terraform" }` | no | Labels. |
| `delete_protection` | no | `false` | no | Block delete in the API. |
| `expose_routes_to_vswitch` | no | `false` | no | Expose routes to a vSwitch. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `network_id` | `hcloud_network.this.id` | Network ID. |
| `network_name` | `.name` | Name. |
| `ip_range` | `.ip_range` | CIDR. |

## Docs

- [hcloud_network](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/network)
````

#### `backend.tf`

File: [v1/modules/dev/hetzner/hcloud_network/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/hetzner/hcloud_network/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/main.tf)

```hcl
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.68"
    }
  }
  required_version = ">= 1.3"
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_network" "this" {
  name                     = var.name
  ip_range                 = var.ip_range
  labels                   = var.labels
  delete_protection        = var.delete_protection
  expose_routes_to_vswitch = var.expose_routes_to_vswitch
}
```

#### `outputs.tf`

File: [v1/modules/dev/hetzner/hcloud_network/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/outputs.tf)

```hcl
output "network_id" {
  value       = hcloud_network.this.id
  description = "Hetzner Cloud network ID (maps to workflow resource_id)"
}

output "network_name" {
  value       = hcloud_network.this.name
  description = "Name of the network"
}

output "ip_range" {
  value       = hcloud_network.this.ip_range
  description = "IPv4 prefix of the network"
}
```

#### `variables.tf`

File: [v1/modules/dev/hetzner/hcloud_network/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network/variables.tf)

```hcl
variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the network (set via TF_VAR_name)"
  type        = string
  default     = "snow-network"
}

variable "ip_range" {
  description = "IP range of the whole network, RFC1918 (set via TF_VAR_ip_range)"
  type        = string
  default     = "10.0.0.0/16"
}

variable "labels" {
  description = "User-defined labels (set via TF_VAR_labels)"
  type        = map(string)
  default = {
    managed_by = "terraform"
  }
}

variable "delete_protection" {
  description = "Enable delete protection (set via TF_VAR_delete_protection)"
  type        = bool
  default     = false
}

variable "expose_routes_to_vswitch" {
  description = "Expose routes to vSwitch connection (set via TF_VAR_expose_routes_to_vswitch)"
  type        = bool
  default     = false
}
```

### `v1/modules/dev/hetzner/hcloud_server`

#### `README_HCLOUD_SERVER.md`

File: [v1/modules/dev/hetzner/hcloud_server/README_HCLOUD_SERVER.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/README_HCLOUD_SERVER.md)

````markdown
# Hetzner Cloud server

Creates a Hetzner Cloud server and uploads an SSH public key for access.

**Path:** `v1/modules/dev/hetzner/hcloud_server`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_ssh_key` | `yabin` | Uploads `ssh_public_key`. Named `${var.name}key`. |
| `hcloud_server` | `cx23` | Server with public networking and that SSH key attached. |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. Labels are hardcoded `{ managed_by = "terraform" }`. Public IPv4 is on by default; IPv6 is off. The resource local name `cx23` is fixed even if `server_type` changes.

```
main.tf        # provider, SSH key, server
variables.tf   # inputs
outputs.tf     # server_id, server_ipv4, server_status
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md) (AWS keys for S3, Hetzner token for the provider). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
# optional:
# export TF_VAR_name="dev-box"
# export TF_VAR_server_type="cx23"
# export TF_VAR_location="hel1"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_server/terraform.tfstate"
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
ssh root@$(terraform output -raw server_ipv4)
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | Hetzner Cloud API token. |
| `ssh_public_key` | yes | — | yes | Public key uploaded and attached. |
| `name` | no | `CX23` | no | Server name. SSH key is `${name}key`. |
| `server_type` | no | `cx23` | no | Plan, e.g. `cx22`, `cx23`, `cx33`. |
| `image` | no | `ubuntu-24.04` | no | OS image. |
| `location` | no | `hel1` | no | Datacenter (`hel1`, `nbg1`, `fsn1`, `ash`, `hil`). |
| `ipv4_enabled` | no | `true` | no | Public IPv4. |
| `ipv6_enabled` | no | `false` | no | Public IPv6. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `server_id` | `hcloud_server.cx23.id` | Server ID. |
| `server_ipv4` | `.ipv4_address` | Public IPv4. Empty if IPv4 is off. |
| `server_status` | `.status` | Status (`running`, `off`, …). |

## Docs

- [hcloud_server](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/server)
- [hcloud_ssh_key](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/ssh_key)
- [Overview](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server.md)
- [Inputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/inputs.md)
- [Outputs](../../../../references/snow-monkeys-infra/iac-terraform/docs/modules/hetzner-hcloud-server/outputs.md)
````

#### `backend.tf`

File: [v1/modules/dev/hetzner/hcloud_server/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/hetzner/hcloud_server/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/main.tf)

```hcl
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.68"
    }
  }
  required_version = ">= 1.3"
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_ssh_key" "yabin" {
  name       = "${var.name}key"
  public_key = var.ssh_public_key
}

resource "hcloud_server" "cx23" {
  name        = var.name
  server_type = var.server_type
  image       = var.image
  location    = var.location

  ssh_keys = [hcloud_ssh_key.yabin.id]

  public_net {
    ipv4_enabled = var.ipv4_enabled
    ipv6_enabled = var.ipv6_enabled
  }

  labels = {
    managed_by = "terraform"
  }
}
```

#### `outputs.tf`

File: [v1/modules/dev/hetzner/hcloud_server/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/outputs.tf)

```hcl
output "server_id" {
  value = hcloud_server.cx23.id
}

output "server_ipv4" {
  value = hcloud_server.cx23.ipv4_address
}

output "server_status" {
  value = hcloud_server.cx23.status
}
```

#### `variables.tf`

File: [v1/modules/dev/hetzner/hcloud_server/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server/variables.tf)

```hcl
variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "The name of the server (set via TF_VAR_name)"
  type        = string
  default     = "CX23"
}

variable "server_type" {
  description = "Type of the server (set via TF_VAR_server_type)"
  type        = string
  default     = "cx23"
}

variable "image" {
  description = "Image for the server (set via TF_VAR_image)"
  type        = string
  default     = "ubuntu-24.04"
}

variable "location" {
  description = "Location of the server (set via TF_VAR_location)"
  type        = string
  default     = "hel1"
}

#variable "ssh_keys" {
#  description = "List of SSH key IDs to be added to the server"
#  type        = list(string)
#  default     = []
#}

variable "ssh_public_key" {
  description = "SSH public key (set via TF_VAR_ssh_public_key)"
  type        = string
  sensitive   = true
}

variable "ipv4_enabled" {
  description = "Enable public IPv4 (set via TF_VAR_ipv4_enabled)"
  type        = bool
  default     = true
}

variable "ipv6_enabled" {
  description = "Enable public IPv6 (set via TF_VAR_ipv6_enabled)"
  type        = bool
  default     = false
}
```

### `v1/modules/dev/hetzner/hcloud_volume`

#### `README_HCLOUD_VOLUME.md`

File: [v1/modules/dev/hetzner/hcloud_volume/README_HCLOUD_VOLUME.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/README_HCLOUD_VOLUME.md)

````markdown
# Hetzner Cloud volume

Creates a Hetzner Cloud block volume. Optionally attaches it to a server on create.

**Path:** `v1/modules/dev/hetzner/hcloud_volume`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_volume` | `this` | Volume of `size` GB. |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. If `server_id` is set, the volume is created attached and `location` is omitted (it must match the server). If `server_id` is null, `location` is used (default `hel1`). Empty `format` skips formatting. For attach-after-create, use `hcloud_volume_attachment` instead.

```
main.tf        # provider, volume
variables.tf   # inputs
outputs.tf     # volume_id, volume_name, linux_device, location
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="snow-volume"
export TF_VAR_size=10
export TF_VAR_location="hel1"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_volume/terraform.tfstate"
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
terraform output -raw volume_id
terraform output -raw linux_device
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `name` | no | `snow-volume` | no | Volume name. |
| `size` | no | `10` | no | Size in GB. |
| `location` | no | `hel1` | no | Used when `server_id` is unset. |
| `server_id` | no | `null` | no | Attach on create. |
| `automount` | no | `false` | no | Automount when attached. |
| `format` | no | `""` | no | `xfs` or `ext4`. Empty skips format. |
| `labels` | no | `{ managed_by = "terraform" }` | no | Labels. |
| `delete_protection` | no | `false` | no | Block delete in the API. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `volume_id` | `hcloud_volume.this.id` | Volume ID. |
| `volume_name` | `.name` | Name. |
| `linux_device` | `.linux_device` | Device path on the server. |
| `location` | `.location` | Location. |

## Docs

- [hcloud_volume](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/volume)
````

#### `backend.tf`

File: [v1/modules/dev/hetzner/hcloud_volume/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/hetzner/hcloud_volume/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/main.tf)

```hcl
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.68"
    }
  }
  required_version = ">= 1.3"
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_volume" "this" {
  name              = var.name
  size              = var.size
  location          = var.server_id == null ? var.location : null
  server_id         = var.server_id
  automount         = var.automount
  format            = var.format == "" ? null : var.format
  labels            = var.labels
  delete_protection = var.delete_protection
}
```

#### `outputs.tf`

File: [v1/modules/dev/hetzner/hcloud_volume/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/outputs.tf)

```hcl
output "volume_id" {
  value       = hcloud_volume.this.id
  description = "Hetzner Cloud volume ID (maps to workflow resource_id)"
}

output "volume_name" {
  value       = hcloud_volume.this.name
  description = "Name of the volume"
}

output "linux_device" {
  value       = hcloud_volume.this.linux_device
  description = "Device path on the filesystem for the volume"
}

output "location" {
  value       = hcloud_volume.this.location
  description = "Location of the volume"
}
```

#### `variables.tf`

File: [v1/modules/dev/hetzner/hcloud_volume/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume/variables.tf)

```hcl
variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the volume (set via TF_VAR_name)"
  type        = string
  default     = "snow-volume"
}

variable "size" {
  description = "Size of the volume in GB (set via TF_VAR_size)"
  type        = number
  default     = 10
}

variable "location" {
  description = "Location when not attaching via server_id (set via TF_VAR_location). Conflicts with server_id."
  type        = string
  default     = "hel1"
}

variable "server_id" {
  description = "Optional server ID to attach on create (set via TF_VAR_server_id). Null uses location instead."
  type        = number
  default     = null
}

variable "automount" {
  description = "Automount when server_id is set (set via TF_VAR_automount)"
  type        = bool
  default     = false
}

variable "format" {
  description = "Optional format after creation: xfs or ext4 (set via TF_VAR_format). Empty skips formatting."
  type        = string
  default     = ""
}

variable "labels" {
  description = "User-defined labels (set via TF_VAR_labels)"
  type        = map(string)
  default = {
    managed_by = "terraform"
  }
}

variable "delete_protection" {
  description = "Enable delete protection (set via TF_VAR_delete_protection)"
  type        = bool
  default     = false
}
```

### `v1/modules/dev/hetzner/hcloud_volume_attachment`

#### `README_HCLOUD_VOLUME_ATTACHMENT.md`

File: [v1/modules/dev/hetzner/hcloud_volume_attachment/README_HCLOUD_VOLUME_ATTACHMENT.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/README_HCLOUD_VOLUME_ATTACHMENT.md)

````markdown
# Hetzner Cloud volume attachment

Attaches an existing Hetzner volume to an existing server.

**Path:** `v1/modules/dev/hetzner/hcloud_volume_attachment`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_volume_attachment` | `this` | Links `volume_id` to `server_id`. |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. Both IDs are required numbers with no defaults. The volume and server must already exist (typically from `hcloud_volume` and `hcloud_server`) and share a location.

```
main.tf        # provider, attachment
variables.tf   # inputs
outputs.tf     # volume_attachment_id, volume_id, server_id
backend.tf     # backend "s3" {}
```

Use this when the volume was created without `server_id`. Creating a volume with `server_id` already attaches it.

## Usage

Remote state: [BACKEND_S3.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/TERRAFORM_RULES.md).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_volume_id="$(terraform -chdir=../hcloud_volume output -raw volume_id)"
export TF_VAR_server_id="$(terraform -chdir=../hcloud_server output -raw server_id)"
export TF_VAR_automount=false
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_volume_attachment/terraform.tfstate"
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
terraform output volume_attachment_id
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `volume_id` | yes | — | no | Volume to attach. |
| `server_id` | yes | — | no | Server to attach to. |
| `automount` | no | `false` | no | Automount on attach. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `volume_attachment_id` | `hcloud_volume_attachment.this.id` | Attachment ID. |
| `volume_id` | `.volume_id` | Volume ID. |
| `server_id` | `.server_id` | Server ID. |

## Docs

- [hcloud_volume_attachment](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/volume_attachment)
````

#### `backend.tf`

File: [v1/modules/dev/hetzner/hcloud_volume_attachment/backend.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/backend.tf)

```hcl
# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}
```

#### `main.tf`

File: [v1/modules/dev/hetzner/hcloud_volume_attachment/main.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/main.tf)

```hcl
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.68"
    }
  }
  required_version = ">= 1.3"
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_volume_attachment" "this" {
  volume_id = var.volume_id
  server_id = var.server_id
  automount = var.automount
}
```

#### `outputs.tf`

File: [v1/modules/dev/hetzner/hcloud_volume_attachment/outputs.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/outputs.tf)

```hcl
output "volume_attachment_id" {
  value       = hcloud_volume_attachment.this.id
  description = "Hetzner Cloud volume attachment ID (maps to workflow resource_id)"
}

output "volume_id" {
  value       = hcloud_volume_attachment.this.volume_id
  description = "ID of the attached volume"
}

output "server_id" {
  value       = hcloud_volume_attachment.this.server_id
  description = "ID of the server the volume is attached to"
}
```

#### `variables.tf`

File: [v1/modules/dev/hetzner/hcloud_volume_attachment/variables.tf](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment/variables.tf)

```hcl
variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "volume_id" {
  description = "ID of the volume to attach (set via TF_VAR_volume_id)"
  type        = number
}

variable "server_id" {
  description = "ID of the server to attach to (set via TF_VAR_server_id)"
  type        = number
}

variable "automount" {
  description = "Automount the volume upon attaching (set via TF_VAR_automount)"
  type        = bool
  default     = false
}
```
