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
  description = "Name tag for the volume (set via TF_VAR_name)"
  type        = string
  default     = "snow-ebs"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "availability_zone" {
  description = "AZ for the volume (set via TF_VAR_availability_zone)"
  type        = string
}

variable "size" {
  description = "Size in GiB (set via TF_VAR_size)"
  type        = number
  default     = 20
}

variable "volume_type" {
  description = "Volume type e.g. gp3, io2 (set via TF_VAR_volume_type)"
  type        = string
  default     = "gp3"
}

variable "encrypted" {
  description = "Encrypt the volume (set via TF_VAR_encrypted)"
  type        = bool
  default     = true
}

variable "iops" {
  description = "IOPS when supported (set via TF_VAR_iops). 0 omits the attribute."
  type        = number
  default     = 0
}

variable "throughput" {
  description = "Throughput in MiB/s for gp3 (set via TF_VAR_throughput). 0 omits the attribute."
  type        = number
  default     = 0
}

variable "snapshot_id" {
  description = "Optional snapshot ID (set via TF_VAR_snapshot_id)"
  type        = string
  default     = ""
}

variable "kms_key_id" {
  description = "Optional KMS key ID/ARN (set via TF_VAR_kms_key_id)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
