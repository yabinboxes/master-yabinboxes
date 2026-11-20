Author: Yabin Monroy Mendez
Description: Plan to implement AWS reusable workflows

Notes:
1. Only update if is required
2. Complains @iac-structure/TERRAFORM_COMPLIANCE.md


Prerequisites:
1. Read Terraform registry docs for hetzner https://registry.terraform.io/providers/hashicorp/aws/latest/docs
2. Read guides Terraform:
    https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/tag-policy-compliance 
    https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/custom-service-endpoints
    https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/enhanced-region-support
    https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/resource-tagging
    https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/version-5-upgrade
    https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/continuous-validation-examples
    https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/using-aws-with-awscc-provider
3. Read repository https://github.com/snow-monkeys-infra/iac-terraform/


Tasks:
1. Plan to update/create repositories in https://github.com/orgs/snow-monkeys-infra/repositories:
    1.1 Read AWS list of resources from @list-of-resources with type server and resource, and output result in "aws_resource_list".
    Example ("aws_resource_list"): aws_s3_bucket

    1.2 Match "aws_resource_list" with folders in https://github.com/snow-monkeys-infra/iac-terraform/tree/main/v1/modules/dev/aws and output result if have a match to "aws_resource_list_needs_updates" and if don't have a match to "aws_resource_list_needs_creates" 
    Example ("aws_resource_list_needs_updates"): aws_s3_bucket

    1.3 Print in console list of "aws_resource_list", "aws_resource_list_needs_creates" and "aws_resource_list_needs_updates" 

    1.4 Checkout repository https://github.com/snow-monkeys-infra/iac-terraform/ and change local branch to "updates"

    1.5 Match list "aws_resource_list_needs_updates" with folders in the local repository ./iac-terraform/v1/modules/dev/aws/ and add to list "matched_folders"

    1.6 Read resources in terraform docs https://registry.terraform.io/providers/hashicorp/aws/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/aws/ with only the resources that are in "matched_folders"

    1.7 Console print all the changes

    1.8 Match list "aws_resource_list_needs_creates" with folders in the local repository ./iac-terraform/v1/modules/dev/aws/ and add to list "matched_folders_to_create"

    1.9 Read resources in terraform docs https://registry.terraform.io/providers/hashicorp/aws/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/aws/ with only the resources that are in "matched_folders_to_create"

    1.10 Console print all the changes

    1.11 commit changes in local repository "iac-terraform"

    