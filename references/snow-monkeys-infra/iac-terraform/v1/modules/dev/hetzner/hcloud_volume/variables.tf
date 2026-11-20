variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the volume (set via TF_VAR_name)"
  type        = string
  default     = "snow-volume"
}

variable "size" {
  description = "Size of the volume in GB (set via TF_VAR_size)"
  type        = number
  default     = 10
}

variable "location" {
  description = "Location when not attaching via server_id (set via TF_VAR_location). Conflicts with server_id."
  type        = string
  default     = "hel1"
}

variable "server_id" {
  description = "Optional server ID to attach on create (set via TF_VAR_server_id). Null uses location instead."
  type        = number
  default     = null
}

variable "automount" {
  description = "Automount when server_id is set (set via TF_VAR_automount)"
  type        = bool
  default     = false
}

variable "format" {
  description = "Optional format after creation: xfs or ext4 (set via TF_VAR_format). Empty skips formatting."
  type        = string
  default     = ""
}

variable "labels" {
  description = "User-defined labels (set via TF_VAR_labels)"
  type        = map(string)
  default = {
    managed_by = "terraform"
  }
}

variable "delete_protection" {
  description = "Enable delete protection (set via TF_VAR_delete_protection)"
  type        = bool
  default     = false
}
