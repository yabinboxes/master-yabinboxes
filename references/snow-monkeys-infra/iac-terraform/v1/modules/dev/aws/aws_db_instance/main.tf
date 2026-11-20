terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.3"
}

provider "aws" {
  region     = var.region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

resource "aws_db_instance" "this" {
  identifier              = var.name
  allocated_storage       = var.allocated_storage
  engine                  = var.engine
  engine_version          = var.engine_version == "" ? null : var.engine_version
  instance_class          = var.instance_class
  db_name                 = var.db_name == "" ? null : var.db_name
  username                = var.username
  password                = var.manage_master_user_password ? null : var.password
  manage_master_user_password = var.manage_master_user_password
  parameter_group_name    = var.parameter_group_name == "" ? null : var.parameter_group_name
  db_subnet_group_name    = var.db_subnet_group_name == "" ? null : var.db_subnet_group_name
  vpc_security_group_ids  = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : null
  publicly_accessible     = var.publicly_accessible
  multi_az                = var.multi_az
  storage_encrypted       = var.storage_encrypted
  skip_final_snapshot     = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : (var.final_snapshot_identifier != "" ? var.final_snapshot_identifier : "${var.name}-final")
  backup_retention_period = var.backup_retention_period
  deletion_protection     = var.deletion_protection
  port                    = var.port > 0 ? var.port : null

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )
}
