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

resource "aws_ebs_volume" "this" {
  availability_zone = var.availability_zone
  size              = var.size
  type              = var.volume_type
  encrypted         = var.encrypted
  iops              = var.iops > 0 ? var.iops : null
  throughput        = var.throughput > 0 ? var.throughput : null
  snapshot_id       = var.snapshot_id != "" ? var.snapshot_id : null
  kms_key_id        = var.kms_key_id != "" ? var.kms_key_id : null

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )
}
