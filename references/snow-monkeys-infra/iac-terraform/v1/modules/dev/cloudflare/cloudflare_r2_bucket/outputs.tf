output "r2_bucket_id" {
  value       = cloudflare_r2_bucket.this.id
  description = "ID of the R2 bucket (maps to workflow resource_id)"
}

output "r2_bucket_name" {
  value       = cloudflare_r2_bucket.this.name
  description = "Name of the R2 bucket"
}
