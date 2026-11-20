output "linux_web_app_id" {
  value       = azurerm_linux_web_app.this.id
  description = "ID of the Linux Web App (maps to workflow resource_id)"
}

output "default_hostname" {
  value       = azurerm_linux_web_app.this.default_hostname
  description = "Default hostname of the Linux Web App"
}
