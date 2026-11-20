variable "digitalocean_token" {
  description = "DigitalOcean API token (set via TF_VAR_digitalocean_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Droplet name (set via TF_VAR_name)"
  type        = string
  default     = "snow-droplet"
}

variable "region" {
  description = "DigitalOcean region (set via TF_VAR_region)"
  type        = string
  default     = "nyc3"
}

variable "server_type" {
  description = "Droplet size slug (set via TF_VAR_server_type)"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "image" {
  description = "Droplet image slug (set via TF_VAR_image)"
  type        = string
  default     = "ubuntu-24-04-x64"
}

variable "ssh_public_key" {
  description = "SSH public key to create and attach (set via TF_VAR_ssh_public_key). Empty skips key creation."
  type        = string
  default     = ""
  sensitive   = true
}

variable "ssh_keys" {
  description = "Existing SSH key IDs/fingerprints (set via TF_VAR_ssh_keys as JSON)"
  type        = list(string)
  default     = []
}

variable "ipv6" {
  description = "Enable IPv6 (set via TF_VAR_ipv6)"
  type        = bool
  default     = false
}

variable "user_data" {
  description = "Cloud-init user data (set via TF_VAR_user_data). Empty omits."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags (set via TF_VAR_tags as JSON)"
  type        = list(string)
  default     = ["managed_by:terraform"]
}
