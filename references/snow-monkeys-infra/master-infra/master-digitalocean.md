Author: Yabin Monroy Mendez
Description: Plan to implement DigitalOcean reusable workflows

Notes:
1. Only update if is required
2. Complains @iac-structure/TERRAFORM_COMPLIANCE.md


Prerequisites:
1. Read Terraform registry docs for DigitalOcean https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs
2. The DigitalOcean provider publishes no guides under /docs/guides. Use the provider docs above.
3. Read repository https://github.com/snow-monkeys-infra/iac-terraform/


Tasks:
1. Plan to update/create repositories in https://github.com/orgs/snow-monkeys-infra/repositories:
    1.1 Read Digital Ocean list of resources from @list-of-resources with type server and resource, and output result in "digitalocean_resource_list".
    Example ("digitalocean_resource_list"): digitalocean_droplet

    1.2 Match "digitalocean_resource_list" with folders in https://github.com/snow-monkeys-infra/iac-terraform/tree/main/v1/modules/dev/digitalocean and output result if have a match to "digitalocean_resource_list_needs_updates" and if don't have a match to "digitalocean_resource_list_needs_creates"
    Example ("digitalocean_resource_list_needs_updates"): digitalocean_droplet

    1.3 Print in console list of "digitalocean_resource_list", "digitalocean_resource_list_needs_creates" and "digitalocean_resource_list_needs_updates"

    1.4 Checkout repository https://github.com/snow-monkeys-infra/iac-terraform/ and change local branch to "updates"

    1.5 Match list "digitalocean_resource_list_needs_updates" with folders in the local repository ./iac-terraform/v1/modules/dev/digitalocean/ and add to list "matched_folders"

    1.6 Read resources in terraform docs https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/digitalocean/ with only the resources that are in "matched_folders"

    1.7 Console print all the changes

    1.8 Match list "digitalocean_resource_list_needs_creates" with folders in the local repository ./iac-terraform/v1/modules/dev/digitalocean/ and add to list "matched_folders_to_create"

    1.9 Read resources in terraform docs https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs and update folders in local repository ./iac-terraform/v1/modules/dev/digitalocean/ with only the resources that are in "matched_folders_to_create"

    1.10 Console print all the changes

    1.11 commit changes in local repository "iac-terraform"
