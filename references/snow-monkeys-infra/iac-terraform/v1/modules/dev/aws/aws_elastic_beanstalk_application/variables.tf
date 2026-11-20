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
  description = "Elastic Beanstalk application name (set via TF_VAR_name)"
  type        = string
  default     = "snow-beanstalk-app"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "description" {
  description = "Optional application description (set via TF_VAR_description)"
  type        = string
  default     = ""
}

variable "appversion_lifecycle_service_role" {
  description = "IAM service role ARN for app version lifecycle (set via TF_VAR_appversion_lifecycle_service_role). Empty disables lifecycle block."
  type        = string
  default     = ""
}

variable "appversion_lifecycle_max_count" {
  description = "Max application versions to retain (set via TF_VAR_appversion_lifecycle_max_count). 0 omits."
  type        = number
  default     = 0
}

variable "appversion_lifecycle_max_age_in_days" {
  description = "Max age in days for versions (set via TF_VAR_appversion_lifecycle_max_age_in_days). 0 omits."
  type        = number
  default     = 0
}

variable "appversion_lifecycle_delete_source_from_s3" {
  description = "Delete source bundle from S3 when version is deleted (set via TF_VAR_appversion_lifecycle_delete_source_from_s3)"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
