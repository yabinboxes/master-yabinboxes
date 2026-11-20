variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "volume_id" {
  description = "ID of the volume to attach (set via TF_VAR_volume_id)"
  type        = number
}

variable "server_id" {
  description = "ID of the server to attach to (set via TF_VAR_server_id)"
  type        = number
}

variable "automount" {
  description = "Automount the volume upon attaching (set via TF_VAR_automount)"
  type        = bool
  default     = false
}
