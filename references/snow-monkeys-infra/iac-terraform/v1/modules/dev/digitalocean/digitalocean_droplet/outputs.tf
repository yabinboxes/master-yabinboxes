output "droplet_id" {
  value       = digitalocean_droplet.this.id
  description = "Droplet ID"
}

output "droplet_ip" {
  value       = digitalocean_droplet.this.ipv4_address
  description = "Public IPv4 address (maps to workflow server_ip)"
}

output "server_ipv4" {
  value       = digitalocean_droplet.this.ipv4_address
  description = "Alias of droplet_ip for the Snow workflow server_ip contract"
}

output "droplet_status" {
  value       = digitalocean_droplet.this.status
  description = "Droplet status"
}
