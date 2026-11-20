output "volume_attachment_id" {
  value       = hcloud_volume_attachment.this.id
  description = "Hetzner Cloud volume attachment ID (maps to workflow resource_id)"
}

output "volume_id" {
  value       = hcloud_volume_attachment.this.volume_id
  description = "ID of the attached volume"
}

output "server_id" {
  value       = hcloud_volume_attachment.this.server_id
  description = "ID of the server the volume is attached to"
}
