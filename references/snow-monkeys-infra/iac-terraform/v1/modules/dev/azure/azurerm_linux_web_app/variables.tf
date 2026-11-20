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
  description = "Name of the Linux Web App (set via TF_VAR_name)"
  type        = string
  default     = "snow-linux-web-app"
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

variable "service_plan_id" {
  description = "App Service Plan ID (set via TF_VAR_service_plan_id)"
  type        = string
}

variable "always_on" {
  description = "Keep the app always on (set via TF_VAR_always_on)"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
