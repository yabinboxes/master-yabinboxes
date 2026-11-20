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

# Classic azurerm_postgresql_database was removed in azurerm 4+/5+.
# This module uses azurerm_postgresql_flexible_server_database.
resource "azurerm_postgresql_flexible_server_database" "this" {
  name      = var.name
  server_id = var.server_id
  charset   = var.charset
  collation = var.collation
}
