variable "digitalocean_token" {
  description = "DigitalOcean API token (set via TF_VAR_digitalocean_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Autoscale pool name (set via TF_VAR_name)"
  type        = string
  default     = "snow-autoscale"
}

variable "min_instances" {
  description = "Minimum instances (set via TF_VAR_min_instances)"
  type        = number
  default     = 1
}

variable "max_instances" {
  description = "Maximum instances (set via TF_VAR_max_instances)"
  type        = number
  default     = 3
}

variable "target_cpu_utilization" {
  description = "Target CPU utilization 0-1 (set via TF_VAR_target_cpu_utilization)"
  type        = number
  default     = 0.5
}

variable "target_memory_utilization" {
  description = "Target memory utilization 0-1 (set via TF_VAR_target_memory_utilization)"
  type        = number
  default     = 0.5
}

variable "cooldown_minutes" {
  description = "Cooldown minutes (set via TF_VAR_cooldown_minutes)"
  type        = number
  default     = 5
}

variable "server_type" {
  description = "Droplet size slug (set via TF_VAR_server_type)"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "region" {
  description = "DigitalOcean region (set via TF_VAR_region)"
  type        = string
  default     = "nyc3"
}

variable "image" {
  description = "Droplet image slug (set via TF_VAR_image)"
  type        = string
  default     = "ubuntu-24-04-x64"
}

variable "ssh_public_key" {
  description = "SSH public key (set via TF_VAR_ssh_public_key). Empty skips key creation."
  type        = string
  default     = ""
  sensitive   = true
}

variable "ssh_keys" {
  description = "Existing SSH key fingerprints (set via TF_VAR_ssh_keys as JSON)"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Droplet tags (set via TF_VAR_tags as JSON)"
  type        = list(string)
  default     = ["managed_by:terraform"]
}

variable "ipv6" {
  description = "Enable IPv6 (set via TF_VAR_ipv6)"
  type        = bool
  default     = false
}

variable "with_droplet_agent" {
  description = "Install droplet agent (set via TF_VAR_with_droplet_agent)"
  type        = bool
  default     = true
}

variable "user_data" {
  description = "Cloud-init user data (set via TF_VAR_user_data). Empty omits."
  type        = string
  default     = ""
}
