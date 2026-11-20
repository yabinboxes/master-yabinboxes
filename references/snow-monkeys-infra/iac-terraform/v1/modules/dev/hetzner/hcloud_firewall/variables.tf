variable "hcloud_token" {
  description = "Hetzner Cloud API token (set via TF_VAR_hcloud_token)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name of the firewall (set via TF_VAR_name)"
  type        = string
  default     = "snow-firewall"
}

variable "labels" {
  description = "User-defined labels for the firewall (set via TF_VAR_labels)"
  type        = map(string)
  default = {
    managed_by = "terraform"
  }
}

variable "rules" {
  description = "Firewall rules (set via TF_VAR_rules): direction, protocol, optional port / source_ips / destination_ips / description"
  type = list(object({
    direction       = string
    protocol        = string
    port            = optional(string)
    source_ips      = optional(list(string))
    destination_ips = optional(list(string))
    description     = optional(string)
  }))
  default = [
    {
      direction = "in"
      protocol  = "icmp"
      source_ips = [
        "0.0.0.0/0",
        "::/0",
      ]
      description = "Allow ICMP"
    },
    {
      direction = "in"
      protocol  = "tcp"
      port      = "22"
      source_ips = [
        "0.0.0.0/0",
        "::/0",
      ]
      description = "Allow SSH"
    },
    {
      direction = "in"
      protocol  = "tcp"
      port      = "80"
      source_ips = [
        "0.0.0.0/0",
        "::/0",
      ]
      description = "Allow HTTP"
    },
    {
      direction = "in"
      protocol  = "tcp"
      port      = "443"
      source_ips = [
        "0.0.0.0/0",
        "::/0",
      ]
      description = "Allow HTTPS"
    },
  ]
}

variable "apply_to" {
  description = "Optional apply_to blocks (set via TF_VAR_apply_to): server id and/or label_selector"
  type = list(object({
    server         = optional(number)
    label_selector = optional(string)
  }))
  default = []
}
