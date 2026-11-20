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

resource "hcloud_volume_attachment" "this" {
  volume_id = var.volume_id
  server_id = var.server_id
  automount = var.automount
}
