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
