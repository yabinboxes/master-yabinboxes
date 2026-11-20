variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the network (set via TF_VAR_name)"
  type        = string
  default     = "snow-network"
}

variable "ip_range" {
  description = "IP range of the whole network, RFC1918 (set via TF_VAR_ip_range)"
  type        = string
  default     = "10.0.0.0/16"
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

variable "expose_routes_to_vswitch" {
  description = "Expose routes to vSwitch connection (set via TF_VAR_expose_routes_to_vswitch)"
  type        = bool
  default     = false
}
