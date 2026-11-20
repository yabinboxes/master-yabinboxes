Author: Yabin Monroy Mendez
Description: Plan to implement Cloudflare reusable workflows

Notes:
1. Only update if is required
2. Complains @iac-structure/TERRAFORM_COMPLIANCE.md


Prerequisites:
1. Read Terraform registry docs for Cloudflare https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs
2. Read guides Terraform:
    https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/guides/version-5-upgrade
    https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/guides/version-5-migration
    https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/guides/migrating-renamed-resources
3. Read repository https://github.com/snow-monkeys-infra/iac-terraform/


Tasks:
1. Plan to update/create repositories in https://github.com/orgs/snow-monkeys-infra/repositories:
    1.1 Read Cloudflare list of resources from @list-of-resources with type server and resource, and output result in "cloudflare_resource_list".
    Example ("cloudflare_resource_list"): cloudflare_d1_database

    1.2 Match "cloudflare_resource_list" with folders in https://github.com/snow-monkeys-infra/iac-terraform/tree/main/v1/modules/dev/cloudflare and output result if have a match to "cloudflare_resource_list_needs_updates" and if don't have a match to "cloudflare_resource_list_needs_creates"
    Example ("cloudflare_resource_list_needs_updates"): cloudflare_d1_database

    1.3 Print in console list of "cloudflare_resource_list", "cloudflare_resource_list_needs_creates" and "cloudflare_resource_list_needs_updates"

    1.4 Checkout repository https://github.com/snow-monkeys-infra/iac-terraform/ and change local branch to "updates"

    1.5 Match list "cloudflare_resource_list_needs_updates" with folders in the local repository ./iac-terraform/v1/modules/dev/cloudflare/ and add to list "matched_folders"

    1.6 Read resources in terraform docs https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/cloudflare/ with only the resources that are in "matched_folders"

    1.7 Console print all the changes

    1.8 Match list "cloudflare_resource_list_needs_creates" with folders in the local repository ./iac-terraform/v1/modules/dev/cloudflare/ and add to list "matched_folders_to_create"

    1.9 Read resources in terraform docs https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/cloudflare/ with only the resources that are in "matched_folders_to_create"

    1.10 Console print all the changes

    1.11 commit changes in local repository "iac-terraform"
