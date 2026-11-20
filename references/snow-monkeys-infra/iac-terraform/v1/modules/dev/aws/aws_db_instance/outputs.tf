output "db_instance_id" {
  value       = aws_db_instance.this.id
  description = "RDS instance ID (maps to workflow resource_id)"
}

output "db_instance_arn" {
  value       = aws_db_instance.this.arn
  description = "ARN of the RDS instance"
}

output "db_instance_endpoint" {
  value       = aws_db_instance.this.endpoint
  description = "Connection endpoint (address:port)"
}

output "db_instance_address" {
  value       = aws_db_instance.this.address
  description = "Hostname of the RDS instance"
}
