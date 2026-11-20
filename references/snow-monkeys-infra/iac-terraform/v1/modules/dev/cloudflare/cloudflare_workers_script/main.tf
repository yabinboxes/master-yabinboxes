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

resource "cloudflare_workers_script" "this" {
  account_id  = var.account_id
  script_name = var.name
  content     = var.content
  main_module = var.main_module == "" ? null : var.main_module
}
