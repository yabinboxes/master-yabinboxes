variable "project" {
  description = "GCP project ID (set via TF_VAR_project)"
  type        = string
}

variable "region" {
  description = "GCP region (set via TF_VAR_region)"
  type        = string
  default     = "us-central1"
}

variable "credentials" {
  description = "GCP service account JSON (set via TF_VAR_credentials). Empty uses GOOGLE_CREDENTIALS / ADC."
  type        = string
  default     = ""
  sensitive   = true
}

variable "name" {
  description = "Object name/path (set via TF_VAR_name)"
  type        = string
  default     = "hello.txt"
}

variable "bucket" {
  description = "Target bucket name (set via TF_VAR_bucket)"
  type        = string
}

variable "content" {
  description = "Inline object content (set via TF_VAR_content). Conflicts with source."
  type        = string
  default     = "hello from terraform"
}

variable "source" {
  description = "Local file path (set via TF_VAR_source). Empty uses content."
  type        = string
  default     = ""
}

variable "content_type" {
  description = "Content type (set via TF_VAR_content_type). Empty omits."
  type        = string
  default     = "text/plain"
}

variable "cache_control" {
  description = "Cache-Control header (set via TF_VAR_cache_control). Empty omits."
  type        = string
  default     = ""
}
