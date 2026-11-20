output "mssql_server_id" {
  value       = azurerm_mssql_server.this.id
  description = "ID of the MSSQL server (maps to workflow resource_id)"
}

output "fully_qualified_domain_name" {
  value       = azurerm_mssql_server.this.fully_qualified_domain_name
  description = "FQDN of the MSSQL server"
}
