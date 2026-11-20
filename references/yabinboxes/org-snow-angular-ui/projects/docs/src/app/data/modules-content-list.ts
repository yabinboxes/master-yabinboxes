export const modules = [
   /* {
        "id": 11,
        "provider": "snow",
        "name": "Get resources from Snow",
        "type": "service",
        "link": "internal",
        "page": "/docs/provider/snow/get-resources",
        "description": "Get resources from Snow - internal"
    },
    {
        "id": 12,
        "provider": "snow",
        "name": "Health check",
        "type": "service",
        "link": "internal",
        "page": "/docs/provider/snow/health-check",
        "description": "Health chech"
    },
    {
        "id": 13,
        "provider": "snow",
        "name": "Notify",
        "type": "service",
        "link": "internal",
        "page": "/docs/provider/snow/notify",
        "description": "Notify for Snow - internal"
    },
    {
        "id": 21,
        "provider": "docker",
        "name": "Build and push image to registry",
        "type": "service",
        "link": "https://hub.docker.com",
        "page": "/docs/provider/docker/build-and-push-image",
        "description": "Docker Hub is a registry for storing application images for future uses and deployments."
    },
    {
        "id": 31,
        "provider": "civo",
        "name": "Create Kubernetes cluster",
        "type": "cluster",
        "link": "https://www.civo.com/docs/kubernetes",
        "page": "/docs/provider/civo/create-kubernetes-cluster",
        "description": "Managed Kubernetes is one of the core Civo services. You can create Kubernetes clusters in all Civo regions. Civo Kubernetes is fully compatible with the wider cloud-native ecosystem, and is certified CNCF conformant."
    },
    {
        "id": 32,
        "provider": "civo",
        "name": "Deploy application to Kubernetes cluster",
        "type": "application",
        "link": "https://www.civo.com/docs/kubernetes",
        "page": "/docs/provider/civo/deploy-application",
        "description": "Managed Kubernetes is one of the core Civo services. You can create Kubernetes clusters in all Civo regions. Civo Kubernetes is fully compatible with the wider cloud-native ecosystem, and is certified CNCF conformant."
    }, */
    {
        "id": 41,
        "provider": "cloudflare",
        "name": "Cloudflare pages",
        "type": "service",
        "link": "https://developers.cloudflare.com/pages",
        "page": "/docs/provider/cloudflare/pages",
        "description": "Create a Cloudflare Pages project with Terraform and upload the infra directory with Wrangler."
    },
    {
        "id": 51,
        "provider": "hetzner",
        "name": "Hetzner server",
        "type": "cluster",
        "link": "https://www.hetzner.com/cloud",
        "page": "/docs/provider/hetzner/hetzner-server",
        "description": "Provision a Hetzner Cloud server with Terraform, then bootstrap Docker and Nginx over SSH."
    },
    {
        "id": 52,
        "provider": "hetzner",
        "name": "Hetzner resource",
        "type": "resource",
        "link": "https://www.hetzner.com/cloud",
        "page": "/docs/provider/hetzner/hetzner-resource",
        "description": "Provision Hetzner firewalls, networks, volumes, floating IPs, and volume attachments."
    },
    {
        "id": 53,
        "provider": "hetzner",
        "name": "Hetzner docker compose",
        "type": "service",
        "link": "https://www.hetzner.com/cloud",
        "page": "/docs/provider/hetzner/hetzner-docker-compose",
        "description": "Deploy a Docker Compose service onto an existing Hetzner server and register it in Snow."
    },
    {
        "id": 54,
        "provider": "hetzner",
        "name": "Hetzner docker compose app",
        "type": "application",
        "link": "https://www.hetzner.com/cloud",
        "page": "/docs/provider/hetzner/hetzner-docker-compose-app",
        "description": "Deploy a Docker Compose application onto an existing Hetzner server, with Docker cleanup and log rotation."
    },
    /*{
        "id": 61,
        "provider": "digitalocean",
        "name": "Stateless Droplet",
        "type": "service",
        "link": "https://docs.digitalocean.com/products/droplets",
        "page": "/provider/digitalocean/droplet-terraform",
        "description": "DigitalOcean Droplets are Linux-based virtual machines (VMs) that run on top of virtualized hardware. Each Droplet you create is a new server you can use, either standalone or as part of a larger, cloud-based infrastructure."
    },*/
    /*{
        "id": 51,
        "provider": "digitalocean",
        "title": "Stateless Droplet",
        "type": "service",
        "link": "https://docs.digitalocean.com/products/droplets",
        "page": "/provider/digitalocean/droplet-terraform",
        "description": "DigitalOcean Droplets are Linux-based virtual machines (VMs) that run on top of virtualized hardware. Each Droplet you create is a new server you can use, either standalone or as part of a larger, cloud-based infrastructure."
    },*/
    /*{
        "id": 52,
        "provider": "digitalocean",
        "name": "Statefull Droplet",
        "type": "service",
        "link": "https://docs.digitalocean.com/products/droplets",
        "page": "/provider/digitalocean/droplet-pulumi",
        "description": "DigitalOcean Droplets are Linux-based virtual machines (VMs) that run on top of virtualized hardware. Each Droplet you create is a new server you can use, either standalone or as part of a larger, cloud-based infrastructure."
    },
    {
        "id": 31,
        "provider": "civo",
        "name": "Stateless Kubernetes Cluster (Terraform)",
        "type": "cluster",
        "link": "https://www.civo.com/docs/kubernetes",
        "page": "/provider/civo/k8s-terraform",
        "description": "Managed Kubernetes is one of the core Civo services. You can create Kubernetes clusters in all Civo regions. Civo Kubernetes is fully compatible with the wider cloud-native ecosystem, and is certified CNCF conformant."
    },
    {
        "id": 32,
        "provider": "civo",
        "title": "Statefull Kubernetes Cluster (Pulumi)",
        "type": "cluster",
        "link": "https://www.civo.com/docs/kubernetes",
        "page": "/provider/civo/k8s-pulumi",
        "description": "Managed Kubernetes is one of the core Civo services. You can create Kubernetes clusters in all Civo regions. Civo Kubernetes is fully compatible with the wider cloud-native ecosystem, and is certified CNCF conformant."
    },
    {
        "id": 33,
        "provider": "civo",
        "title": "Stateless Bucket (Terraform)",
        "type": "service",
        "link": "https://www.civo.com/docs/object-stores",
        "page": "/provider/civo/bucket-terraform",
        "description": "The Civo object store is a managed service that allows you to upload unstructured data in an S3-compatible system."
    },
    {
        "id": 34,
        "provider": "civo",
        "title": "Statefull Bucket (Pulumi)",
        "type": "service",
        "link": "https://www.civo.com/docs/kubernetes",
        "page": "/provider/civo/bucket-pulumi",
        "description": "The Civo object store is a managed service that allows you to upload unstructured data in an S3-compatible system."
    },
    {
        "id": 35,
        "provider": "civo",
        "title": "Kubernetes application deployment",
        "type": "application",
        "link": "",
        "page": "/provider/civo/helm-application",
        "description": "Helm helps you manage Kubernetes applications — Helm Charts help you define, install, and upgrade even the most complex Kubernetes application."
    },*/
    /*{
        "id": 41,
        "provider": "cloudflare",
        "name": "Cloudflare Pages",
        "type": "service",
        "link": "https://developers.cloudflare.com/pages",
        "page": "/provider/cloudflare/pages",
        "description": "Managed Kubernetes is one of the core Civo services. You can create Kubernetes clusters in all Civo regions. Civo Kubernetes is fully compatible with the wider cloud-native ecosystem, and is certified CNCF conformant."
    },*/
    /*{
        "id": 42,
        "provider": "cloudflare",
        "title": "Cloudflare DNS",
        "type": "service",
        "link": "https://developers.cloudflare.com/dns",
        "page": "/provider/cloudflare/dns",
        "description": "Cloudflare DNS is a fast, resilient and easy-to-manage authoritative DNS service. It delivers excellent performance and reliability to your domain while also protecting your business from DDoS attacks ↗ and route leaks and hijacking."
    },
    {
        "id": 71,
        "provider": "others",
        "title": "Build and push image",
        "type": "not-a-service",
        "link": "",
        "page": "/provider/others/build-and-push-image",
        "description": "Build and push image in registry for the github repository that is defined."
    }*/
];