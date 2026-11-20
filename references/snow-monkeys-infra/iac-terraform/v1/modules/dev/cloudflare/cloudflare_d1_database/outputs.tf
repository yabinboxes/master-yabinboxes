output "d1_database_id" {
  value       = cloudflare_d1_database.this.id
  description = "ID of the D1 database (maps to workflow resource_id)"
}

output "d1_database_name" {
  value       = cloudflare_d1_database.this.name
  description = "Name of the D1 database"
}
