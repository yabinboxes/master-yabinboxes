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
  description = "D1 database name (set via TF_VAR_name)"
  type        = string
  default     = "snow-d1"
}

variable "jurisdiction" {
  description = "Jurisdiction (set via TF_VAR_jurisdiction). Empty omits."
  type        = string
  default     = ""
}

variable "primary_location_hint" {
  description = "Primary location hint (set via TF_VAR_primary_location_hint). Empty omits."
  type        = string
  default     = ""
}
