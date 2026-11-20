output "mysql_flexible_database_id" {
  value       = azurerm_mysql_flexible_database.this.id
  description = "ID of the MySQL flexible database (maps to workflow resource_id)"
}

output "mysql_flexible_database_name" {
  value       = azurerm_mysql_flexible_database.this.name
  description = "Name of the MySQL flexible database"
}
