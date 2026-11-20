output "floating_ip_id" {
  value       = hcloud_floating_ip.this.id
  description = "Hetzner Cloud Floating IP ID (maps to workflow resource_id)"
}

output "ip_address" {
  value       = hcloud_floating_ip.this.ip_address
  description = "IP address of the Floating IP"
}

output "floating_ip_name" {
  value       = hcloud_floating_ip.this.name
  description = "Name of the Floating IP"
}

output "home_location" {
  value       = hcloud_floating_ip.this.home_location
  description = "Home location of the Floating IP"
}
