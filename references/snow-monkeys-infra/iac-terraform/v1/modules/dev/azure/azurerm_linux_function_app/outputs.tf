output "linux_function_app_id" {
  value       = azurerm_linux_function_app.this.id
  description = "ID of the Linux Function App (maps to workflow resource_id)"
}

output "default_hostname" {
  value       = azurerm_linux_function_app.this.default_hostname
  description = "Default hostname of the Linux Function App"
}
