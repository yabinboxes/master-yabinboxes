output "sql_instance_id" {
  value       = google_sql_database_instance.this.id
  description = "Cloud SQL instance ID (maps to workflow resource_id)"
}

output "connection_name" {
  value       = google_sql_database_instance.this.connection_name
  description = "Connection name"
}

output "public_ip_address" {
  value       = google_sql_database_instance.this.public_ip_address
  description = "Public IP address when enabled"
}

output "private_ip_address" {
  value       = google_sql_database_instance.this.private_ip_address
  description = "Private IP address when configured"
}
