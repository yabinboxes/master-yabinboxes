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
  description = "Name of the MySQL database (set via TF_VAR_name)"
  type        = string
  default     = "snowdb"
}

variable "resource_group_name" {
  description = "Resource group name (set via TF_VAR_resource_group_name)"
  type        = string
}

variable "server_name" {
  description = "MySQL flexible server name (set via TF_VAR_server_name)"
  type        = string
}

variable "charset" {
  description = "Database charset (set via TF_VAR_charset)"
  type        = string
  default     = "utf8"
}

variable "collation" {
  description = "Database collation (set via TF_VAR_collation)"
  type        = string
  default     = "utf8_unicode_ci"
}
