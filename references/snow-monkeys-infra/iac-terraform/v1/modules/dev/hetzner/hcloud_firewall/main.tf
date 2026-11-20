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

resource "hcloud_firewall" "this" {
  name   = var.name
  labels = var.labels

  dynamic "rule" {
    for_each = var.rules
    content {
      direction       = rule.value.direction
      protocol        = rule.value.protocol
      port            = try(rule.value.port, null)
      source_ips      = try(rule.value.source_ips, null)
      destination_ips = try(rule.value.destination_ips, null)
      description     = try(rule.value.description, null)
    }
  }

  dynamic "apply_to" {
    for_each = var.apply_to
    content {
      server         = try(apply_to.value.server, null)
      label_selector = try(apply_to.value.label_selector, null)
    }
  }
}
