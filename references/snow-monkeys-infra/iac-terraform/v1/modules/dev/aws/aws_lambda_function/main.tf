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

data "aws_iam_policy_document" "assume_role" {
  count = var.role_arn == "" ? 1 : 0

  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "this" {
  count              = var.role_arn == "" ? 1 : 0
  name               = "${var.name}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role[0].json

  tags = merge(
    {
      managed_by = "terraform"
    },
    var.tags,
  )
}

resource "aws_iam_role_policy_attachment" "basic" {
  count      = var.role_arn == "" ? 1 : 0
  role       = aws_iam_role.this[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "this" {
  function_name = var.name
  role          = var.role_arn != "" ? var.role_arn : aws_iam_role.this[0].arn
  handler       = var.package_type == "Zip" ? var.handler : null
  runtime       = var.package_type == "Zip" ? var.runtime : null
  filename      = var.filename != "" ? var.filename : null
  s3_bucket     = var.s3_bucket != "" ? var.s3_bucket : null
  s3_key        = var.s3_key != "" ? var.s3_key : null
  image_uri     = var.image_uri != "" ? var.image_uri : null
  package_type  = var.package_type
  memory_size   = var.memory_size
  timeout       = var.timeout
  architectures = var.architectures
  source_code_hash = var.source_code_hash != "" ? var.source_code_hash : null

  dynamic "environment" {
    for_each = length(var.environment_variables) > 0 ? [1] : []
    content {
      variables = var.environment_variables
    }
  }

  tags = merge(
    {
      managed_by = "terraform"
      Name       = var.name
    },
    var.tags,
  )

  depends_on = [aws_iam_role_policy_attachment.basic]
}
