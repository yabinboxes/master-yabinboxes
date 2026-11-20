output "firewall_id" {
  value       = hcloud_firewall.this.id
  description = "Hetzner Cloud firewall ID"
}

output "firewall_name" {
  value       = hcloud_firewall.this.name
  description = "Name of the firewall"
}

output "firewall_rules" {
  value       = hcloud_firewall.this.rule
  description = "Configured firewall rules"
}
