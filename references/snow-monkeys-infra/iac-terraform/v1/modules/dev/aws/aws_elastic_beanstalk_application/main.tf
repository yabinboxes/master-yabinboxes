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

resource "aws_elastic_beanstalk_application" "this" {
  name        = var.name
  description = var.description == "" ? null : var.description

  dynamic "appversion_lifecycle" {
    for_each = var.appversion_lifecycle_service_role != "" ? [1] : []
    content {
      service_role          = var.appversion_lifecycle_service_role
      max_count             = var.appversion_lifecycle_max_count > 0 ? var.appversion_lifecycle_max_count : null
      max_age_in_days       = var.appversion_lifecycle_max_age_in_days > 0 ? var.appversion_lifecycle_max_age_in_days : null
      delete_source_from_s3 = var.appversion_lifecycle_delete_source_from_s3
    }
  }

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )
}
