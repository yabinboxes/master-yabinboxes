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
  description = "Name of the MSSQL server (set via TF_VAR_name)"
  type        = string
  default     = "snow-mssql-server"
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

variable "server_version" {
  description = "MSSQL server version (set via TF_VAR_server_version)"
  type        = string
  default     = "12.0"
}

variable "administrator_login" {
  description = "Administrator login (set via TF_VAR_administrator_login)"
  type        = string
  default     = "snowadmin"
}

variable "administrator_login_password" {
  description = "Administrator password (set via TF_VAR_administrator_login_password)"
  type        = string
  sensitive   = true
}

variable "minimum_tls_version" {
  description = "Minimum TLS version (set via TF_VAR_minimum_tls_version)"
  type        = string
  default     = "1.2"
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
