output "bucket_id" {
  value       = google_storage_bucket.this.id
  description = "Bucket ID (maps to workflow resource_id)"
}

output "bucket_name" {
  value       = google_storage_bucket.this.name
  description = "Bucket name"
}

output "bucket_url" {
  value       = google_storage_bucket.this.url
  description = "Bucket URL"
}
