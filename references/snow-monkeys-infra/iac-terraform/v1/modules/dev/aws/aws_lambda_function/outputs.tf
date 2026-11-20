output "lambda_function_id" {
  value       = aws_lambda_function.this.id
  description = "Lambda function name/ID (maps to workflow resource_id)"
}

output "lambda_function_arn" {
  value       = aws_lambda_function.this.arn
  description = "ARN of the Lambda function"
}

output "invoke_arn" {
  value       = aws_lambda_function.this.invoke_arn
  description = "Invoke ARN for API Gateway integrations"
}
