output "droplet_autoscale_id" {
  value       = digitalocean_droplet_autoscale.this.id
  description = "Autoscale pool ID (maps to workflow resource_id / server identity)"
}

output "droplet_autoscale_status" {
  value       = try(digitalocean_droplet_autoscale.this.status, null)
  description = "Autoscale pool status when available"
}
