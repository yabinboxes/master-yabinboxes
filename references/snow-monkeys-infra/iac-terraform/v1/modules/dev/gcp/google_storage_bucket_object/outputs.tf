output "object_id" {
  value       = google_storage_bucket_object.this.id
  description = "Object ID (maps to workflow resource_id)"
}

output "object_name" {
  value       = google_storage_bucket_object.this.name
  description = "Object name"
}

output "media_link" {
  value       = google_storage_bucket_object.this.media_link
  description = "Media download link"
}
