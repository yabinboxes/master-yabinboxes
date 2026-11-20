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

Sensitive values (`*.tfvars`, tokens, keys) are gitignored. Every variable is set with `TF_VAR_*`. See [TERRAFORM_RULES.md](../v1/modules/dev/TERRAFORM_RULES.md). Remote state: [BACKEND_S3.md](../v1/modules/dev/BACKEND_S3.md). Apply `aws/aws_s3_bucket` first.

## Modules (dev)

### AWS

| Module | Path | README |
|---|---|---|
| S3 bucket (TF state) | [`v1/modules/dev/aws/aws_s3_bucket`](../v1/modules/dev/aws/aws_s3_bucket) | [README](../v1/modules/dev/aws/aws_s3_bucket/README_AWS_S3_BUCKET.md) |
| EC2 instance | [`v1/modules/dev/aws/aws_instance`](../v1/modules/dev/aws/aws_instance) | [README](../v1/modules/dev/aws/aws_instance/README_AWS_INSTANCE.md) |
| RDS instance | [`v1/modules/dev/aws/aws_db_instance`](../v1/modules/dev/aws/aws_db_instance) | [README](../v1/modules/dev/aws/aws_db_instance/README_AWS_DB_INSTANCE.md) |
| EBS volume | [`v1/modules/dev/aws/aws_ebs_volume`](../v1/modules/dev/aws/aws_ebs_volume) | [README](../v1/modules/dev/aws/aws_ebs_volume/README_AWS_EBS_VOLUME.md) |
| Lambda function | [`v1/modules/dev/aws/aws_lambda_function`](../v1/modules/dev/aws/aws_lambda_function) | [README](../v1/modules/dev/aws/aws_lambda_function/README_AWS_LAMBDA_FUNCTION.md) |
| Elastic Beanstalk app | [`v1/modules/dev/aws/aws_elastic_beanstalk_application`](../v1/modules/dev/aws/aws_elastic_beanstalk_application) | [README](../v1/modules/dev/aws/aws_elastic_beanstalk_application/README_AWS_ELASTIC_BEANSTALK_APPLICATION.md) |

### Azure

| Module | Path | README |
|---|---|---|
| Linux Web App | [`v1/modules/dev/azure/azurerm_linux_web_app`](../v1/modules/dev/azure/azurerm_linux_web_app) | [README](../v1/modules/dev/azure/azurerm_linux_web_app/README_AZURERM_LINUX_WEB_APP.md) |
| Linux Function App | [`v1/modules/dev/azure/azurerm_linux_function_app`](../v1/modules/dev/azure/azurerm_linux_function_app) | [README](../v1/modules/dev/azure/azurerm_linux_function_app/README_AZURERM_LINUX_FUNCTION_APP.md) |
| SQL Server | [`v1/modules/dev/azure/azurerm_mssql_server`](../v1/modules/dev/azure/azurerm_mssql_server) | [README](../v1/modules/dev/azure/azurerm_mssql_server/README_AZURERM_MSSQL_SERVER.md) |
| SQL Database | [`v1/modules/dev/azure/azurerm_mssql_database`](../v1/modules/dev/azure/azurerm_mssql_database) | [README](../v1/modules/dev/azure/azurerm_mssql_database/README_AZURERM_MSSQL_DATABASE.md) |
| MySQL Flexible Server | [`v1/modules/dev/azure/azurerm_mysql_flexible_server`](../v1/modules/dev/azure/azurerm_mysql_flexible_server) | [README](../v1/modules/dev/azure/azurerm_mysql_flexible_server/README_AZURERM_MYSQL_FLEXIBLE_SERVER.md) |
| MySQL Flexible Database | [`v1/modules/dev/azure/azurerm_mysql_flexible_database`](../v1/modules/dev/azure/azurerm_mysql_flexible_database) | [README](../v1/modules/dev/azure/azurerm_mysql_flexible_database/README_AZURERM_MYSQL_FLEXIBLE_DATABASE.md) |
| PostgreSQL Flexible Server | [`v1/modules/dev/azure/azurerm_postgresql_server`](../v1/modules/dev/azure/azurerm_postgresql_server) | [README](../v1/modules/dev/azure/azurerm_postgresql_server/README_AZURERM_POSTGRESQL_SERVER.md) |
| PostgreSQL Flexible Database | [`v1/modules/dev/azure/azurerm_postgresql_database`](../v1/modules/dev/azure/azurerm_postgresql_database) | [README](../v1/modules/dev/azure/azurerm_postgresql_database/README_AZURERM_POSTGRESQL_DATABASE.md) |

### Civo

| Module | Path | README |
|---|---|---|
| Object store | [`v1/modules/dev/civo/bucket`](../v1/modules/dev/civo/bucket) | [README](../v1/modules/dev/civo/bucket/README_BUCKET.md) |
| Compute (stub) | [`v1/modules/dev/civo/compute`](../v1/modules/dev/civo/compute) | [README](../v1/modules/dev/civo/compute/README_COMPUTE.md) |
| Observability (incomplete) | [`v1/modules/dev/civo/observability`](../v1/modules/dev/civo/observability) | [README](../v1/modules/dev/civo/observability/README_OBSERVABILITY.md) |

### Cloudflare

| Module | Path | README |
|---|---|---|
| D1 database | [`v1/modules/dev/cloudflare/cloudflare_d1_database`](../v1/modules/dev/cloudflare/cloudflare_d1_database) | [README](../v1/modules/dev/cloudflare/cloudflare_d1_database/README_CLOUDFLARE_D1_DATABASE.md) |
| R2 bucket | [`v1/modules/dev/cloudflare/cloudflare_r2_bucket`](../v1/modules/dev/cloudflare/cloudflare_r2_bucket) | [README](../v1/modules/dev/cloudflare/cloudflare_r2_bucket/README_CLOUDFLARE_R2_BUCKET.md) |
| Workers script | [`v1/modules/dev/cloudflare/cloudflare_workers_script`](../v1/modules/dev/cloudflare/cloudflare_workers_script) | [README](../v1/modules/dev/cloudflare/cloudflare_workers_script/README_CLOUDFLARE_WORKERS_SCRIPT.md) |
| Pipeline sink | [`v1/modules/dev/cloudflare/cloudflare_pipeline_sink`](../v1/modules/dev/cloudflare/cloudflare_pipeline_sink) | [README](../v1/modules/dev/cloudflare/cloudflare_pipeline_sink/README_CLOUDFLARE_PIPELINE_SINK.md) |
| DNS (incomplete) | [`v1/modules/dev/cloudflare/dns`](../v1/modules/dev/cloudflare/dns) | [README](../v1/modules/dev/cloudflare/dns/README_DNS.md) |

### DigitalOcean

| Module | Path | README |
|---|---|---|
| Droplet | [`v1/modules/dev/digitalocean/digitalocean_droplet`](../v1/modules/dev/digitalocean/digitalocean_droplet) | [README](../v1/modules/dev/digitalocean/digitalocean_droplet/README_DIGITALOCEAN_DROPLET.md) |
| Droplet autoscale | [`v1/modules/dev/digitalocean/digitalocean_droplet_autoscale`](../v1/modules/dev/digitalocean/digitalocean_droplet_autoscale) | [README](../v1/modules/dev/digitalocean/digitalocean_droplet_autoscale/README_DIGITALOCEAN_DROPLET_AUTOSCALE.md) |
| Droplet (legacy) | [`v1/modules/dev/digitalocean/droplet`](../v1/modules/dev/digitalocean/droplet) | [README](../v1/modules/dev/digitalocean/droplet/README_DROPLET.md) |

### GCP

| Module | Path | README |
|---|---|---|
| Compute Engine instance | [`v1/modules/dev/gcp/google_compute_instance`](../v1/modules/dev/gcp/google_compute_instance) | [README](../v1/modules/dev/gcp/google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md) |
| Cloud SQL instance | [`v1/modules/dev/gcp/google_sql_database_instance`](../v1/modules/dev/gcp/google_sql_database_instance) | [README](../v1/modules/dev/gcp/google_sql_database_instance/README_GOOGLE_SQL_DATABASE_INSTANCE.md) |
| Cloud Storage bucket | [`v1/modules/dev/gcp/google_storage_bucket`](../v1/modules/dev/gcp/google_storage_bucket) | [README](../v1/modules/dev/gcp/google_storage_bucket/README_GOOGLE_STORAGE_BUCKET.md) |
| Cloud Storage object | [`v1/modules/dev/gcp/google_storage_bucket_object`](../v1/modules/dev/gcp/google_storage_bucket_object) | [README](../v1/modules/dev/gcp/google_storage_bucket_object/README_GOOGLE_STORAGE_BUCKET_OBJECT.md) |
| Compute Engine (legacy demo) | [`v1/modules/dev/gcp/compute`](../v1/modules/dev/gcp/compute) | [README](../v1/modules/dev/gcp/compute/README_COMPUTE.md) |

### Hetzner

| Module | Path | README |
|---|---|---|
| Cloud server | [`v1/modules/dev/hetzner/hcloud_server`](../v1/modules/dev/hetzner/hcloud_server) | [README](../v1/modules/dev/hetzner/hcloud_server/README_HCLOUD_SERVER.md) |
| Firewall | [`v1/modules/dev/hetzner/hcloud_firewall`](../v1/modules/dev/hetzner/hcloud_firewall) | [README](../v1/modules/dev/hetzner/hcloud_firewall/README_HCLOUD_FIREWALL.md) |
| Network | [`v1/modules/dev/hetzner/hcloud_network`](../v1/modules/dev/hetzner/hcloud_network) | [README](../v1/modules/dev/hetzner/hcloud_network/README_HCLOUD_NETWORK.md) |
| Floating IP | [`v1/modules/dev/hetzner/hcloud_floating_ip`](../v1/modules/dev/hetzner/hcloud_floating_ip) | [README](../v1/modules/dev/hetzner/hcloud_floating_ip/README_HCLOUD_FLOATING_IP.md) |
| Volume | [`v1/modules/dev/hetzner/hcloud_volume`](../v1/modules/dev/hetzner/hcloud_volume) | [README](../v1/modules/dev/hetzner/hcloud_volume/README_HCLOUD_VOLUME.md) |
| Volume attachment | [`v1/modules/dev/hetzner/hcloud_volume_attachment`](../v1/modules/dev/hetzner/hcloud_volume_attachment) | [README](../v1/modules/dev/hetzner/hcloud_volume_attachment/README_HCLOUD_VOLUME_ATTACHMENT.md) |

## Kubernetes stacks

| Stack | Path | Description |
|---|---|---|
| Civo Traefik | `v1/k8s/civo-traefik/dev` | Civo cluster wiring for Traefik and cert-manager |

## Docs map

| Doc | Covers |
|---|---|
| [Terraform rules](../v1/modules/dev/TERRAFORM_RULES.md) | `TF_VAR_*` inputs, layout, secrets |
| [S3 remote state](../v1/modules/dev/BACKEND_S3.md) | Bucket bootstrap and `terraform init` |
| Per-project `README_<RESOURCE>.md` | Implementation and usage for that module |
| [Hetzner hcloud_server](modules/hetzner-hcloud-server.md) | Extra overview (inputs/outputs split) |
| [Hetzner inputs](modules/hetzner-hcloud-server/inputs.md) | Module variables |
| [Hetzner outputs](modules/hetzner-hcloud-server/outputs.md) | Module outputs |
