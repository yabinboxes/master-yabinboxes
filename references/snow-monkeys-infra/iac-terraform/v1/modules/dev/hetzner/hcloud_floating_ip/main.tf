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
