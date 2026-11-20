variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "The name of the server (set via TF_VAR_name)"
  type        = string
  default     = "CX23"
}

variable "server_type" {
  description = "Type of the server (set via TF_VAR_server_type)"
  type        = string
  default     = "cx23"
}

variable "image" {
  description = "Image for the server (set via TF_VAR_image)"
  type        = string
  default     = "ubuntu-24.04"
}

variable "location" {
  description = "Location of the server (set via TF_VAR_location)"
  type        = string
  default     = "hel1"
}

#variable "ssh_keys" {
#  description = "List of SSH key IDs to be added to the server"
#  type        = list(string)
#  default     = []
#}

variable "ssh_public_key" {
  description = "SSH public key (set via TF_VAR_ssh_public_key)"
  type        = string
  sensitive   = true
}

variable "ipv4_enabled" {
  description = "Enable public IPv4 (set via TF_VAR_ipv4_enabled)"
  type        = bool
  default     = true
}

variable "ipv6_enabled" {
  description = "Enable public IPv6 (set via TF_VAR_ipv6_enabled)"
  type        = bool
  default     = false
}
