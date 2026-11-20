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
