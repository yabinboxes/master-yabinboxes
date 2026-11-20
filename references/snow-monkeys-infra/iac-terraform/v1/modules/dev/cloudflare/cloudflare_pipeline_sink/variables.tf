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
  description = "Pipeline sink name (set via TF_VAR_name)"
  type        = string
  default     = "snow_sink"
}

variable "sink_type" {
  description = "Sink type (set via TF_VAR_sink_type)"
  type        = string
  default     = "r2"
}

variable "config_account_id" {
  description = "Account ID inside sink config (set via TF_VAR_config_account_id). Defaults to account_id."
  type        = string
  default     = ""
}

variable "bucket" {
  description = "R2 bucket name for the sink (set via TF_VAR_bucket)"
  type        = string
}

variable "r2_access_key_id" {
  description = "R2 access key ID (set via TF_VAR_r2_access_key_id)"
  type        = string
  sensitive   = true
}

variable "r2_secret_access_key" {
  description = "R2 secret access key (set via TF_VAR_r2_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "path" {
  description = "Optional object path prefix (set via TF_VAR_path)"
  type        = string
  default     = ""
}

variable "format_type" {
  description = "Sink format type (set via TF_VAR_format_type)"
  type        = string
  default     = "json"
}
