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
