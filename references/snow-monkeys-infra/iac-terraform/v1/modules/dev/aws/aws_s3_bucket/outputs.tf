output "bucket_id" {
  value       = aws_s3_bucket.this.id
  description = "Name/ID of the S3 bucket (maps to workflow resource_id)"
}

output "bucket_arn" {
  value       = aws_s3_bucket.this.arn
  description = "ARN of the S3 bucket"
}

output "bucket_region" {
  value       = aws_s3_bucket.this.bucket_region
  description = "AWS region of the S3 bucket"
}
