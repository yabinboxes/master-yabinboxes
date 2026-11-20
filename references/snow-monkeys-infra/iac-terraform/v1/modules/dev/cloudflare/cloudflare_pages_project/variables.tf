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
  description = "Pages project name (set via TF_VAR_name). Lowercase letters, digits, and hyphens only."
  type        = string
  default     = "snow-pages"
}

variable "production_branch" {
  description = "Production branch of the project (set via TF_VAR_production_branch)"
  type        = string
  default     = "main"
}
