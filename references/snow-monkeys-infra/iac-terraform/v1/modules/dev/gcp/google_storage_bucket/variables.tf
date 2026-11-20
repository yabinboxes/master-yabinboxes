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
  description = "Bucket name (set via TF_VAR_name). Must be globally unique."
  type        = string
  default     = "snow-gcs-bucket"
}

variable "location" {
  description = "Bucket location (set via TF_VAR_location)"
  type        = string
  default     = "US"
}

variable "force_destroy" {
  description = "Allow destroy with objects (set via TF_VAR_force_destroy)"
  type        = bool
  default     = false
}

variable "uniform_bucket_level_access" {
  description = "Enable uniform bucket-level access (set via TF_VAR_uniform_bucket_level_access)"
  type        = bool
  default     = true
}

variable "storage_class" {
  description = "Storage class (set via TF_VAR_storage_class)"
  type        = string
  default     = "STANDARD"
}

variable "labels" {
  description = "Labels (set via TF_VAR_labels as JSON)"
  type        = map(string)
  default     = {}
}
