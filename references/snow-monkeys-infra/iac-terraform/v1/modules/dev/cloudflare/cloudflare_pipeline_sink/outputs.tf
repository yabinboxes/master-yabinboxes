output "pipeline_sink_id" {
  value       = cloudflare_pipeline_sink.this.id
  description = "ID of the pipeline sink (maps to workflow resource_id)"
}

output "pipeline_sink_name" {
  value       = cloudflare_pipeline_sink.this.name
  description = "Name of the pipeline sink"
}
