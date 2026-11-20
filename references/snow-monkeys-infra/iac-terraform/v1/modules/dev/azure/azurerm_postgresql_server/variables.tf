variable "subscription_id" {
  description = "Azure subscription ID (set via TF_VAR_subscription_id)"
  type        = string
}

variable "tenant_id" {
  description = "Azure tenant ID (set via TF_VAR_tenant_id)"
  type        = string
}

variable "client_id" {
  description = "Azure service principal client ID (set via TF_VAR_client_id)"
  type        = string
}

variable "client_secret" {
  description = "Azure service principal client secret (set via TF_VAR_client_secret)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the PostgreSQL flexible server (set via TF_VAR_name)"
  type        = string
  default     = "snow-pg-server"
}

variable "resource_group_name" {
  description = "Resource group name (set via TF_VAR_resource_group_name)"
  type        = string
}

variable "location" {
  description = "Azure region (set via TF_VAR_location)"
  type        = string
  default     = "westeurope"
}

variable "postgres_version" {
  description = "PostgreSQL version (set via TF_VAR_postgres_version)"
  type        = string
  default     = "14"
}

variable "administrator_login" {
  description = "Administrator login (set via TF_VAR_administrator_login)"
  type        = string
  default     = "snowadmin"
}

variable "administrator_password" {
  description = "Administrator password (set via TF_VAR_administrator_password)"
  type        = string
  sensitive   = true
}

variable "sku_name" {
  description = "SKU name (set via TF_VAR_sku_name)"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "storage_mb" {
  description = "Storage in MB (set via TF_VAR_storage_mb)"
  type        = number
  default     = 32768
}

variable "zone" {
  description = "Availability zone (set via TF_VAR_zone). Empty omits."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
