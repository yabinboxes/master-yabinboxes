output "network_id" {
  value       = hcloud_network.this.id
  description = "Hetzner Cloud network ID (maps to workflow resource_id)"
}

output "network_name" {
  value       = hcloud_network.this.name
  description = "Name of the network"
}

output "ip_range" {
  value       = hcloud_network.this.ip_range
  description = "IPv4 prefix of the network"
}
