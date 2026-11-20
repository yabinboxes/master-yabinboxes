variable "aws_access_key_id" {
  description = "AWS access key ID (set via TF_VAR_aws_access_key_id)"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key (set via TF_VAR_aws_secret_access_key)"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Lambda function name (set via TF_VAR_name)"
  type        = string
  default     = "snow-lambda"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "role_arn" {
  description = "Existing IAM role ARN (set via TF_VAR_role_arn). Empty creates a basic execution role."
  type        = string
  default     = ""
}

variable "handler" {
  description = "Lambda handler for Zip packages (set via TF_VAR_handler)"
  type        = string
  default     = "index.handler"
}

variable "runtime" {
  description = "Lambda runtime (set via TF_VAR_runtime)"
  type        = string
  default     = "nodejs20.x"
}

variable "filename" {
  description = "Local path to deployment zip (set via TF_VAR_filename). Conflicts with s3_bucket/image_uri."
  type        = string
  default     = ""
}

variable "s3_bucket" {
  description = "S3 bucket with deployment package (set via TF_VAR_s3_bucket)"
  type        = string
  default     = ""
}

variable "s3_key" {
  description = "S3 key of deployment package (set via TF_VAR_s3_key)"
  type        = string
  default     = ""
}

variable "image_uri" {
  description = "ECR image URI for Image package type (set via TF_VAR_image_uri)"
  type        = string
  default     = ""
}

variable "package_type" {
  description = "Zip or Image (set via TF_VAR_package_type)"
  type        = string
  default     = "Zip"
}

variable "memory_size" {
  description = "Memory in MB (set via TF_VAR_memory_size)"
  type        = number
  default     = 128
}

variable "timeout" {
  description = "Timeout in seconds (set via TF_VAR_timeout)"
  type        = number
  default     = 3
}

variable "architectures" {
  description = "Instruction set architectures (set via TF_VAR_architectures as JSON)"
  type        = list(string)
  default     = ["x86_64"]
}

variable "source_code_hash" {
  description = "Optional hash to trigger updates (set via TF_VAR_source_code_hash)"
  type        = string
  default     = ""
}

variable "environment_variables" {
  description = "Environment variables map (set via TF_VAR_environment_variables as JSON)"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
