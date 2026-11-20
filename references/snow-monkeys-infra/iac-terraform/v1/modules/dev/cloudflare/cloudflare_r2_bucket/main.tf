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

resource "cloudflare_r2_bucket" "this" {
  account_id   = var.account_id
  name         = var.name
  location     = var.location == "" ? null : var.location
  storage_class = var.storage_class
}
