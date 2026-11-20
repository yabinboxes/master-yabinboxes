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
