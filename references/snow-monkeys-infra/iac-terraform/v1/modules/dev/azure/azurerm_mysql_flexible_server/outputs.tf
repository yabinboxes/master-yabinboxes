output "mysql_flexible_server_id" {
  value       = azurerm_mysql_flexible_server.this.id
  description = "ID of the MySQL flexible server (maps to workflow resource_id)"
}

output "fqdn" {
  value       = azurerm_mysql_flexible_server.this.fqdn
  description = "FQDN of the MySQL flexible server"
}
