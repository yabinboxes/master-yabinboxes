terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_d1_database" "this" {
  account_id            = var.account_id
  name                  = var.name
  jurisdiction          = var.jurisdiction == "" ? null : var.jurisdiction
  primary_location_hint = var.primary_location_hint == "" ? null : var.primary_location_hint
}
