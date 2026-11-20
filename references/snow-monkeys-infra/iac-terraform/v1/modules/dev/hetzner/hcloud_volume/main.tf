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
