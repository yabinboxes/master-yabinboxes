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
  description = "Name tag for the instance (set via TF_VAR_name)"
  type        = string
  default     = "snow-server"
}

variable "region" {
  description = "AWS region (set via TF_VAR_region)"
  type        = string
  default     = "us-east-1"
}

variable "ami" {
  description = "AMI ID for the instance (set via TF_VAR_ami). Alias of workflow image input."
  type        = string
}

variable "server_type" {
  description = "EC2 instance type (set via TF_VAR_server_type)"
  type        = string
  default     = "t3.micro"
}

variable "subnet_id" {
  description = "VPC subnet ID to launch in (set via TF_VAR_subnet_id). Empty uses default VPC behavior."
  type        = string
  default     = ""
}

variable "vpc_security_group_ids" {
  description = "List of security group IDs (set via TF_VAR_vpc_security_group_ids as JSON)"
  type        = list(string)
  default     = []
}

variable "associate_public_ip_address" {
  description = "Associate a public IP (set via TF_VAR_associate_public_ip_address)"
  type        = bool
  default     = true
}

variable "ssh_public_key" {
  description = "SSH public key to create an aws_key_pair (set via TF_VAR_ssh_public_key). Empty skips key creation."
  type        = string
  default     = ""
  sensitive   = true
}

variable "key_name" {
  description = "Existing EC2 key pair name when ssh_public_key is empty (set via TF_VAR_key_name)"
  type        = string
  default     = ""
}

variable "user_data" {
  description = "User data script (set via TF_VAR_user_data)"
  type        = string
  default     = ""
}

variable "availability_zone" {
  description = "Optional AZ (set via TF_VAR_availability_zone)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags (set via TF_VAR_tags as JSON)"
  type        = map(string)
  default     = {}
}
