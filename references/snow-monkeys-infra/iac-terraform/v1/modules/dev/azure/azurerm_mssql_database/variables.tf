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
  description = "Name of the MSSQL database (set via TF_VAR_name)"
  type        = string
  default     = "snow-mssql-db"
}

variable "server_id" {
  description = "MSSQL server ID (set via TF_VAR_server_id)"
  type        = string
}

variable "collation" {
  description = "Database collation (set via TF_VAR_collation)"
  type        = string
  default     = "SQL_Latin1_General_CP1_CI_AS"
}

variable "license_type" {
  description = "License type (set via TF_VAR_license_type). Empty omits."
  type        = string
  default     = ""
}

variable "max_size_gb" {
  description = "Max size in GB (set via TF_VAR_max_size_gb). 0 omits."
  type        = number
  default     = 2
}

variable "sku_name" {
  description = "SKU name (set via TF_VAR_sku_name)"
  type        = string
  default     = "S0"
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
