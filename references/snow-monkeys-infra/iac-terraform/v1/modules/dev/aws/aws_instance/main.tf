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

resource "aws_key_pair" "this" {
  count      = var.ssh_public_key != "" ? 1 : 0
  key_name   = "${var.name}-key"
  public_key = var.ssh_public_key

  tags = merge(
    {
      managed_by = "terraform"
      Name       = "${var.name}-key"
    },
    var.tags,
  )
}

resource "aws_instance" "this" {
  ami                         = var.ami
  instance_type               = var.server_type
  subnet_id                   = var.subnet_id == "" ? null : var.subnet_id
  vpc_security_group_ids      = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : null
  associate_public_ip_address = var.associate_public_ip_address
  key_name                    = var.ssh_public_key != "" ? aws_key_pair.this[0].key_name : (var.key_name == "" ? null : var.key_name)
  user_data                   = var.user_data == "" ? null : var.user_data
  availability_zone           = var.availability_zone == "" ? null : var.availability_zone

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )
}
