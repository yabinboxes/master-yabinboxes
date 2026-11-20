Author: Yabin Monroy Mendez
Description: Plan to implement Azure reusable workflows

Notes:
1. Only update if is required
2. Complains @iac-structure/TERRAFORM_COMPLIANCE.md


Prerequisites:
1. Read Terraform registry docs for Azure https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs
2. Read guides Terraform:
    https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_secret
    https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_oidc
    https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_cli
    https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/managed_service_identity
    https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/features-block
    https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/5.0-upgrade-guide
    https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/migrating-from-deprecated-resources
3. Read repository https://github.com/snow-monkeys-infra/iac-terraform/


Tasks:
1. Plan to update/create repositories in https://github.com/orgs/snow-monkeys-infra/repositories:
    1.1 Read Azure list of resources from @list-of-resources with type server and resource, and output result in "azure_resource_list".
    Example ("azure_resource_list"): azurerm_linux_web_app

    1.2 Match "azure_resource_list" with folders in https://github.com/snow-monkeys-infra/iac-terraform/tree/main/v1/modules/dev/azure and output result if have a match to "azure_resource_list_needs_updates" and if don't have a match to "azure_resource_list_needs_creates"
    Example ("azure_resource_list_needs_updates"): azurerm_linux_web_app

    1.3 Print in console list of "azure_resource_list", "azure_resource_list_needs_creates" and "azure_resource_list_needs_updates"

    1.4 Checkout repository https://github.com/snow-monkeys-infra/iac-terraform/ and change local branch to "updates"

    1.5 Match list "azure_resource_list_needs_updates" with folders in the local repository ./iac-terraform/v1/modules/dev/azure/ and add to list "matched_folders"

    1.6 Read resources in terraform docs https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/azure/ with only the resources that are in "matched_folders"

    1.7 Console print all the changes

    1.8 Match list "azure_resource_list_needs_creates" with folders in the local repository ./iac-terraform/v1/modules/dev/azure/ and add to list "matched_folders_to_create"

    1.9 Read resources in terraform docs https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/azure/ with only the resources that are in "matched_folders_to_create"

    1.10 Console print all the changes

    1.11 commit changes in local repository "iac-terraform"
