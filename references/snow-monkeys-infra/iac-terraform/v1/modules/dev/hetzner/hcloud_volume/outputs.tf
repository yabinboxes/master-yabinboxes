output "volume_id" {
  value       = hcloud_volume.this.id
  description = "Hetzner Cloud volume ID (maps to workflow resource_id)"
}

output "volume_name" {
  value       = hcloud_volume.this.name
  description = "Name of the volume"
}

output "linux_device" {
  value       = hcloud_volume.this.linux_device
  description = "Device path on the filesystem for the volume"
}

output "location" {
  value       = hcloud_volume.this.location
  description = "Location of the volume"
}
