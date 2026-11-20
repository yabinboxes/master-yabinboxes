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

resource "cloudflare_pipeline_sink" "this" {
  account_id = var.account_id
  name       = var.name
  type       = var.sink_type

  config = {
    account_id = var.config_account_id != "" ? var.config_account_id : var.account_id
    bucket     = var.bucket
    credentials = {
      access_key_id     = var.r2_access_key_id
      secret_access_key = var.r2_secret_access_key
    }
    path = var.path == "" ? null : var.path
  }

  format = {
    type = var.format_type
  }
}
