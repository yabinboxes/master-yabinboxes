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
  description = "Cloud SQL instance name (set via TF_VAR_name)"
  type        = string
  default     = "snow-sql"
}

variable "database_version" {
  description = "Database version (set via TF_VAR_database_version)"
  type        = string
  default     = "POSTGRES_15"
}

variable "tier" {
  description = "Machine tier (set via TF_VAR_tier)"
  type        = string
  default     = "db-f1-micro"
}

variable "availability_type" {
  description = "ZONAL or REGIONAL (set via TF_VAR_availability_type)"
  type        = string
  default     = "ZONAL"
}

variable "disk_size" {
  description = "Disk size in GB (set via TF_VAR_disk_size)"
  type        = number
  default     = 10
}

variable "disk_type" {
  description = "Disk type (set via TF_VAR_disk_type)"
  type        = string
  default     = "PD_SSD"
}

variable "ipv4_enabled" {
  description = "Enable public IPv4 (set via TF_VAR_ipv4_enabled)"
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Enable deletion protection (set via TF_VAR_deletion_protection)"
  type        = bool
  default     = false
}

variable "labels" {
  description = "User labels (set via TF_VAR_labels as JSON)"
  type        = map(string)
  default     = {}
}
