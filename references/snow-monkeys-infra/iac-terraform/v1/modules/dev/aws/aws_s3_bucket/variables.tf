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
  description = "Name of the S3 bucket (set via TF_VAR_name). Must be globally unique."
  type        = string
  default     = "snow-backup"
}

variable "region" {
  description = "AWS region for the bucket (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "force_destroy" {
  description = "Allow terraform destroy to delete all objects in the bucket"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Additional tags to assign to the bucket"
  type        = map(string)
  default     = {}
}
