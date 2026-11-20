Author: Yabin Monroy Mendez
Description: Plan to implement GCP reusable workflows

Notes:
1. Only update if is required
2. Complains @iac-structure/TERRAFORM_COMPLIANCE.md


Prerequisites:
1. Read Terraform registry docs for GCP https://registry.terraform.io/providers/hashicorp/google/latest/docs
2. Read guides Terraform:
    https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/getting_started
    https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference
    https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_versions
    https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/version_8_upgrade
    https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/google_project_service
    https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/sql_instance_switchover
3. Read repository https://github.com/snow-monkeys-infra/iac-terraform/


Tasks:
1. Plan to update/create repositories in https://github.com/orgs/snow-monkeys-infra/repositories:
    1.1 Read GCP (Google Cloud Platform) list of resources from @list-of-resources with type server and resource, and output result in "gcp_resource_list".
    Example ("gcp_resource_list"): google_compute_instance

    1.2 Match "gcp_resource_list" with folders in https://github.com/snow-monkeys-infra/iac-terraform/tree/main/v1/modules/dev/gcp and output result if have a match to "gcp_resource_list_needs_updates" and if don't have a match to "gcp_resource_list_needs_creates"
    Example ("gcp_resource_list_needs_updates"): google_compute_instance

    1.3 Print in console list of "gcp_resource_list", "gcp_resource_list_needs_creates" and "gcp_resource_list_needs_updates"

    1.4 Checkout repository https://github.com/snow-monkeys-infra/iac-terraform/ and change local branch to "updates"

    1.5 Match list "gcp_resource_list_needs_updates" with folders in the local repository ./iac-terraform/v1/modules/dev/gcp/ and add to list "matched_folders"

    1.6 Read resources in terraform docs https://registry.terraform.io/providers/hashicorp/google/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/gcp/ with only the resources that are in "matched_folders"

    1.7 Console print all the changes

    1.8 Match list "gcp_resource_list_needs_creates" with folders in the local repository ./iac-terraform/v1/modules/dev/gcp/ and add to list "matched_folders_to_create"

    1.9 Read resources in terraform docs https://registry.terraform.io/providers/hashicorp/google/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/gcp/ with only the resources that are in "matched_folders_to_create"

    1.10 Console print all the changes

    1.11 commit changes in local repository "iac-terraform"
