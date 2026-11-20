Author: Yabin Monroy Mendez
Description: Modules schema


# Caller outputs of the reusable workflows
- @outputs.md

# Reusable workflow: build and push docker image to desired registry
- @master-docker.md

# Reusable workflow: provision AWS servers, resources or deploy Docker Compose services/apps,
# then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call.
- @master-aws.md

# Reusable workflow: provision GCP servers, resources or deploy Docker Compose services/apps,
# then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call.
- @master-gcp.md

# Reusable workflow: provision Azure resources or deploy Docker Compose services/apps,
# then notify Snow (RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call.
- @master-azure.md

# Reusable workflow: provision Hetzner servers, resources or deploy Docker Compose services/apps,
# then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call.
- @master-hetzner.md

# Reusable workflow: provision Digital Ocean droplets, resources or deploy Docker Compose services/apps,
# then notify Snow (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call.
- @master-digital-ocean.md

# Reusable workflow: provision Cloudflare resources or deploy Docker Compose services/apps,
# then notify Snow (RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call.
- @master-cloudflare.md

# Reusable workflow: deploy a container image into Civo Kubernetes, provision Terraform
# (compute / bucket / observability), or deploy Docker Compose, then notify Snow
# (CLUSTER / RESOURCE / SERVICE / APPLICATION). Consumed by caller repos via workflow_call.
- @master-civo.md

# Reusable workflow: publish a deployment to the Snow API or resolve a Snow resource name to a host.
- @master-snow.md
