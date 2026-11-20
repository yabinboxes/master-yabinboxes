Hetzner
Reusable workflow: provision Hetzner servers, resources or deploy Docker Compose services/apps, then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call. @master-hetzner.md
- hcloud_server (type -> cluster, server)
- hcloud_firewall (type -> resource)
- hcloud_network (type -> resource)
- hcloud_volume (type -> resource)
- hcloud_volume_attachment (type -> resource)
- hcloud_floating_ip (type -> resource)
- docker_compose (type -> service)
- docker_compose_app (type -> application)
AWS
Reusable workflow: provision AWS servers, resources or deploy Docker Compose services/apps, then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call. @master-aws.md
- aws_instance (type -> cluster, server)
- aws_s3_bucket (type -> resource)
- aws_lambda_function (type -> resource)
- aws_elastic_beanstalk_application (type -> resource)
- aws_ebs_volume (type -> resource)
- aws_db_instance (type -> resource)
- docker_compose (type -> service)
- docker_compose_app (type -> application)
Azure
Reusable workflow: provision Azure resources or deploy Docker Compose services/apps, then notify Snow (RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call. @master-azure.md
- azurerm_linux_web_app (type -> resource)
- azurerm_linux_function_app (type -> resource)
- azurerm_mssql_server (type -> resource)
- azurerm_mssql_database (type -> resource)
- azurerm_postgresql_server (type -> resource)
- azurerm_postgresql_database (type -> resource)
- azurerm_mysql_flexible_server (type -> resource)
- azurerm_mysql_flexible_database (type -> resource)
- docker_compose (type -> service)
- docker_compose_app (type -> application)
Cloudflare
Reusable workflow: provision Cloudflare resources or deploy Docker Compose services/apps, then notify Snow (RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call. @master-cloudflare.md
- cloudflare_pages_project (type -> resource)
- cloudflare_d1_database (type -> resource)
- cloudflare_r2_bucket (type -> resource)
- cloudflare_workers_script (type -> resource)
- cloudflare_pipeline_sink (type -> resource)
- docker_compose (type -> service)
- docker_compose_app (type -> application)
Digital Ocean
Reusable workflow: provision Digital Ocean droplets, resources or deploy Docker Compose services/apps, then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call. @master-digital-ocean.md
- digitalocean_droplet (type -> cluster, server)
- digitalocean_droplet_autoscale (type -> cluster, server)
- docker_compose (type -> service)
- docker_compose_app (type -> application)
GCP (Google Cloud Platform)
Reusable workflow: provision GCP servers, resources or deploy Docker Compose services/apps, then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call. @master-gcp.md
- google_compute_instance (type -> cluster, server)
- google_storage_bucket (type -> resource)
- google_storage_bucket_object (type -> resource)
- google_sql_database_instance (type -> resource)
- docker_compose (type -> service)
- docker_compose_app (type -> application)
Civo
Reusable workflow: deploy a container image into Civo Kubernetes, provision Terraform (compute / bucket / observability), or deploy Docker Compose, then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call. @master-civo.md
- compute (type -> cluster)
- bucket (type -> resource)
- observability (type -> resource)
- kubernetes (type -> application)
- docker_compose (type -> service)
- docker_compose_app (type -> application)
Docker
Reusable workflow: build and push docker image to desired registry. @master-docker.md
- build_and_push_image
Snowmonkeys
Reusable workflow: publish a deployment to the Snow API or resolve a Snow resource name to a host. @master-snow.md
- notify
- get_resources
