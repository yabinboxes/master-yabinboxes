output "volume_id" {
  value       = aws_ebs_volume.this.id
  description = "EBS volume ID (maps to workflow resource_id)"
}

output "volume_arn" {
  value       = aws_ebs_volume.this.arn
  description = "ARN of the EBS volume"
}

output "availability_zone" {
  value       = aws_ebs_volume.this.availability_zone
  description = "Availability zone of the volume"
}
