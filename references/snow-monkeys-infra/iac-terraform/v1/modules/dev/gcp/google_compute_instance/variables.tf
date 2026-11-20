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
  description = "Compute instance name (set via TF_VAR_name)"
  type        = string
  default     = "snow-vm"
}

variable "server_type" {
  description = "Machine type (set via TF_VAR_server_type)"
  type        = string
  default     = "e2-micro"
}

variable "zone" {
  description = "GCP zone (set via TF_VAR_zone)"
  type        = string
  default     = "us-central1-a"
}

variable "image" {
  description = "Boot disk image (set via TF_VAR_image)"
  type        = string
  default     = "debian-cloud/debian-12"
}

variable "disk_size_gb" {
  description = "Boot disk size in GB (set via TF_VAR_disk_size_gb)"
  type        = number
  default     = 20
}

variable "network" {
  description = "VPC network (set via TF_VAR_network)"
  type        = string
  default     = "default"
}

variable "subnetwork" {
  description = "Subnetwork self link or name (set via TF_VAR_subnetwork). Empty omits."
  type        = string
  default     = ""
}

variable "associate_public_ip" {
  description = "Assign an ephemeral public IP (set via TF_VAR_associate_public_ip)"
  type        = bool
  default     = true
}

variable "ssh_user" {
  description = "SSH username for metadata ssh-keys (set via TF_VAR_ssh_user)"
  type        = string
  default     = "snow"
}

variable "ssh_public_key" {
  description = "SSH public key (set via TF_VAR_ssh_public_key). Empty skips metadata ssh-keys."
  type        = string
  default     = ""
  sensitive   = true
}

variable "metadata" {
  description = "Instance metadata map when ssh_public_key is empty (set via TF_VAR_metadata as JSON)"
  type        = map(string)
  default     = {}
}

variable "labels" {
  description = "Labels (set via TF_VAR_labels as JSON)"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Network tags (set via TF_VAR_tags as JSON)"
  type        = list(string)
  default     = []
}
