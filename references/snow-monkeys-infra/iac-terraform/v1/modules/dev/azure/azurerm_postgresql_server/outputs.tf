output "postgresql_server_id" {
  value       = azurerm_postgresql_flexible_server.this.id
  description = "ID of the PostgreSQL flexible server (maps to workflow resource_id)"
}

output "fqdn" {
  value       = azurerm_postgresql_flexible_server.this.fqdn
  description = "FQDN of the PostgreSQL flexible server"
}
