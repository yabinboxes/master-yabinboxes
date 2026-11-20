output "pages_project_id" {
  value       = cloudflare_pages_project.this.id
  description = "ID of the Pages project (maps to workflow resource_id)"
}

output "pages_project_name" {
  value       = cloudflare_pages_project.this.name
  description = "Name of the Pages project"
}

output "pages_project_subdomain" {
  value       = cloudflare_pages_project.this.subdomain
  description = "Cloudflare subdomain associated with the project"
}
