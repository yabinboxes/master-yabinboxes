output "instance_id" {
  value       = google_compute_instance.this.id
  description = "Compute instance ID"
}

output "instance_name" {
  value       = google_compute_instance.this.name
  description = "Compute instance name"
}

output "public_ip" {
  value = try(
    google_compute_instance.this.network_interface[0].access_config[0].nat_ip,
    null,
  )
  description = "Public IPv4 address (maps to workflow server_ip)"
}

output "server_ipv4" {
  value = try(
    google_compute_instance.this.network_interface[0].access_config[0].nat_ip,
    null,
  )
  description = "Alias of public_ip for the Snow workflow server_ip contract"
}

output "private_ip" {
  value       = google_compute_instance.this.network_interface[0].network_ip
  description = "Private IPv4 address"
}
