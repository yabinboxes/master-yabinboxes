terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
  client_id       = var.client_id
  client_secret   = var.client_secret
}

resource "azurerm_mssql_database" "this" {
  name           = var.name
  server_id      = var.server_id
  collation      = var.collation
  license_type   = var.license_type == "" ? null : var.license_type
  max_size_gb    = var.max_size_gb > 0 ? var.max_size_gb : null
  sku_name       = var.sku_name

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}
