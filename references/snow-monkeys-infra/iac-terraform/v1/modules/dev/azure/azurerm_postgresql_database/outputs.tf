output "postgresql_database_id" {
  value       = azurerm_postgresql_flexible_server_database.this.id
  description = "ID of the PostgreSQL database (maps to workflow resource_id)"
}

output "postgresql_database_name" {
  value       = azurerm_postgresql_flexible_server_database.this.name
  description = "Name of the PostgreSQL database"
}
