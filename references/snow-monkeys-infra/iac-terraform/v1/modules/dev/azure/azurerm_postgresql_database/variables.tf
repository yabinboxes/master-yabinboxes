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
  description = "Name of the PostgreSQL database (set via TF_VAR_name)"
  type        = string
  default     = "snowdb"
}

variable "server_id" {
  description = "PostgreSQL flexible server ID (set via TF_VAR_server_id)"
  type        = string
}

variable "charset" {
  description = "Database charset (set via TF_VAR_charset)"
  type        = string
  default     = "UTF8"
}

variable "collation" {
  description = "Database collation (set via TF_VAR_collation)"
  type        = string
  default     = "en_US.utf8"
}
