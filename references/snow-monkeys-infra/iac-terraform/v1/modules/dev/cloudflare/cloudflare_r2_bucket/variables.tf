variable "cloudflare_api_token" {
  description = "Cloudflare API token (set via TF_VAR_cloudflare_api_token)"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID (set via TF_VAR_account_id)"
  type        = string
}

variable "name" {
  description = "R2 bucket name (set via TF_VAR_name)"
  type        = string
  default     = "snow-r2-bucket"
}

variable "location" {
  description = "R2 location hint (set via TF_VAR_location). Empty omits."
  type        = string
  default     = ""
}

variable "storage_class" {
  description = "Storage class (set via TF_VAR_storage_class)"
  type        = string
  default     = "Standard"
}
