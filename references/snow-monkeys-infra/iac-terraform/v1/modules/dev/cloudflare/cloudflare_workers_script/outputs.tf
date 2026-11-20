output "workers_script_id" {
  value       = cloudflare_workers_script.this.id
  description = "ID of the Workers script (maps to workflow resource_id)"
}

output "workers_script_name" {
  value       = cloudflare_workers_script.this.script_name
  description = "Name of the Workers script"
}
