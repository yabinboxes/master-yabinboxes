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
  description = "RDS instance identifier (set via TF_VAR_name)"
  type        = string
  default     = "snow-db"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "allocated_storage" {
  description = "Allocated storage in GiB (set via TF_VAR_allocated_storage)"
  type        = number
  default     = 20
}

variable "engine" {
  description = "Database engine (set via TF_VAR_engine)"
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "Engine version (set via TF_VAR_engine_version). Empty uses AWS default."
  type        = string
  default     = ""
}

variable "instance_class" {
  description = "RDS instance class (set via TF_VAR_instance_class)"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Optional initial database name (set via TF_VAR_db_name)"
  type        = string
  default     = ""
}

variable "username" {
  description = "Master username (set via TF_VAR_username)"
  type        = string
  default     = "snowadmin"
}

variable "password" {
  description = "Master password (set via TF_VAR_password). Required unless manage_master_user_password is true."
  type        = string
  default     = ""
  sensitive   = true
}

variable "manage_master_user_password" {
  description = "Let RDS manage the master password in Secrets Manager (set via TF_VAR_manage_master_user_password)"
  type        = bool
  default     = true
}

variable "parameter_group_name" {
  description = "Optional parameter group name (set via TF_VAR_parameter_group_name)"
  type        = string
  default     = ""
}

variable "db_subnet_group_name" {
  description = "Optional DB subnet group (set via TF_VAR_db_subnet_group_name)"
  type        = string
  default     = ""
}

variable "vpc_security_group_ids" {
  description = "Security group IDs (set via TF_VAR_vpc_security_group_ids as JSON)"
  type        = list(string)
  default     = []
}

variable "publicly_accessible" {
  description = "Whether the DB is publicly accessible (set via TF_VAR_publicly_accessible)"
  type        = bool
  default     = false
}

variable "multi_az" {
  description = "Multi-AZ deployment (set via TF_VAR_multi_az)"
  type        = bool
  default     = false
}

variable "storage_encrypted" {
  description = "Encrypt storage (set via TF_VAR_storage_encrypted)"
  type        = bool
  default     = true
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot on destroy (set via TF_VAR_skip_final_snapshot)"
  type        = bool
  default     = true
}

variable "final_snapshot_identifier" {
  description = "Final snapshot id when skip_final_snapshot is false (set via TF_VAR_final_snapshot_identifier)"
  type        = string
  default     = ""
}

variable "backup_retention_period" {
  description = "Backup retention days (set via TF_VAR_backup_retention_period)"
  type        = number
  default     = 0
}

variable "deletion_protection" {
  description = "Enable deletion protection (set via TF_VAR_deletion_protection)"
  type        = bool
  default     = false
}

variable "port" {
  description = "Database port (set via TF_VAR_port). 0 uses engine default."
  type        = number
  default     = 0
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
