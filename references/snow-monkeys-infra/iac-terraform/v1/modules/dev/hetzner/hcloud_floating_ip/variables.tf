variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "type" {
  description = "Type of the Floating IP: ipv4 or ipv6 (set via TF_VAR_type)"
  type        = string
  default     = "ipv4"
}

variable "name" {
  description = "Name of the Floating IP (set via TF_VAR_name)"
  type        = string
  default     = "snow-floating-ip"
}

variable "home_location" {
  description = "Home location when not assigning via server_id (set via TF_VAR_home_location). Conflicts with server_id."
  type        = string
  default     = "hel1"
}

variable "server_id" {
  description = "Optional server ID to assign on create (set via TF_VAR_server_id). Null uses home_location instead."
  type        = number
  default     = null
}

variable "description" {
  description = "Optional description (set via TF_VAR_description). Empty omits."
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
