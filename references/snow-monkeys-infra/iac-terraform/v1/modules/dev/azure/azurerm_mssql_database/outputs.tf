output "mssql_database_id" {
  value       = azurerm_mssql_database.this.id
  description = "ID of the MSSQL database (maps to workflow resource_id)"
}

output "mssql_database_name" {
  value       = azurerm_mssql_database.this.name
  description = "Name of the MSSQL database"
}
