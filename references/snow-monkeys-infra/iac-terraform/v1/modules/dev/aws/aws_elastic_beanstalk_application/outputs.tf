output "application_name" {
  value       = aws_elastic_beanstalk_application.this.name
  description = "Elastic Beanstalk application name (maps to workflow resource_id)"
}

output "application_arn" {
  value       = aws_elastic_beanstalk_application.this.arn
  description = "ARN of the Elastic Beanstalk application"
}
