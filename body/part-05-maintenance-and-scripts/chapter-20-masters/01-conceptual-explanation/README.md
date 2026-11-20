# 1. Conceptual explanation

A master file states the rule. The repository named after the arrow is the implementation. Chapter 3 names these five masters. The tables under each heading are the index: every file in the master, the copy of that file in this chapter, then the file or directory that implements it. The copies are the folders under [masters](../masters). The full text of every file is also in the [walkthrough](../02-walkthrough/README.md#masters).

## Index

### [master-modules](./master-modules.md)

`snow-monkeys-modules/master-modules` → `snow-monkeys-modules`

| Master file | Copy | Implementation |
| --- | --- | --- |
| [main.md](../../../../references/snow-monkeys-modules/master-modules/main.md) | [main.md](../masters/master-modules/main.md) | The module repositories in this table |
| [master-hetzner.md](../../../../references/snow-monkeys-modules/master-modules/master-hetzner.md) | [master-hetzner.md](../masters/master-modules/master-hetzner.md) | [hetzner-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) |
| [master-aws.md](../../../../references/snow-monkeys-modules/master-modules/master-aws.md) | [master-aws.md](../masters/master-modules/master-aws.md) | [aws-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) |
| [master-gcp.md](../../../../references/snow-monkeys-modules/master-modules/master-gcp.md) | [master-gcp.md](../masters/master-modules/master-gcp.md) | [gcp-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/gcp-iac/.github/workflows/main.yml) |
| [master-azure.md](../../../../references/snow-monkeys-modules/master-modules/master-azure.md) | [master-azure.md](../masters/master-modules/master-azure.md) | [azure-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/azure-iac/.github/workflows/main.yml) |
| [master-digital-ocean.md](../../../../references/snow-monkeys-modules/master-modules/master-digital-ocean.md) | [master-digital-ocean.md](../masters/master-modules/master-digital-ocean.md) | [digital-ocean-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml) |
| [master-cloudflare.md](../../../../references/snow-monkeys-modules/master-modules/master-cloudflare.md) | [master-cloudflare.md](../masters/master-modules/master-cloudflare.md) | [cloudflare-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) |
| [master-civo.md](../../../../references/snow-monkeys-modules/master-modules/master-civo.md) | [master-civo.md](../masters/master-modules/master-civo.md) | [civo-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/civo-iac/.github/workflows/main.yml) |
| [master-docker.md](../../../../references/snow-monkeys-modules/master-modules/master-docker.md) | [master-docker.md](../masters/master-modules/master-docker.md) | [docker-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/docker-iac/.github/workflows/main.yml) |
| [master-snow.md](../../../../references/snow-monkeys-modules/master-modules/master-snow.md) | [master-snow.md](../masters/master-modules/master-snow.md) | [snow-iac/.github/workflows/main.yml](../../../../references/snow-monkeys-modules/snow-iac/.github/workflows/main.yml) |
| [list-of-resources.md](../../../../references/snow-monkeys-modules/master-modules/list-of-resources.md) | [list-of-resources.md](../masters/master-modules/list-of-resources.md) | `type` selected by the workflows in the rows above |
| [outputs.md](../../../../references/snow-monkeys-modules/master-modules/outputs.md) | [outputs.md](../masters/master-modules/outputs.md) | `on.workflow_call.outputs` in those same workflows |
| [.gitignore](../../../../references/snow-monkeys-modules/master-modules/.gitignore) | [.gitignore](../masters/master-modules/.gitignore) | Ignore list for `master-modules` |

### [master-infra](./master-infra.md)

`snow-monkeys-infra/master-infra` → `snow-monkeys-infra`

| Master file | Copy | Implementation |
| --- | --- | --- |
| [main.md](../../../../references/snow-monkeys-infra/master-infra/main.md) | [main.md](../masters/master-infra/main.md) | [master.md](../../../../references/snow-monkeys-infra/master-infra/master.md) |
| [master.md](../../../../references/snow-monkeys-infra/master-infra/master.md) | [master.md](../masters/master-infra/master.md) | [monthly-master.yml](../../../../references/snow-monkeys-infra/master-infra/.github/workflows/monthly-master.yml) runs that plan against [iac-terraform](../../../../references/snow-monkeys-infra/iac-terraform) |
| [master-hetzner.md](../../../../references/snow-monkeys-infra/master-infra/master-hetzner.md) | [master-hetzner.md](../masters/master-infra/master-hetzner.md) | [iac-terraform/v1/modules/dev/hetzner](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner) |
| [master-aws.md](../../../../references/snow-monkeys-infra/master-infra/master-aws.md) | [master-aws.md](../masters/master-infra/master-aws.md) | [iac-terraform/v1/modules/dev/aws](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws) |
| [master-azure.md](../../../../references/snow-monkeys-infra/master-infra/master-azure.md) | [master-azure.md](../masters/master-infra/master-azure.md) | [iac-terraform/v1/modules/dev/azure](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/azure) |
| [master-cloudflare.md](../../../../references/snow-monkeys-infra/master-infra/master-cloudflare.md) | [master-cloudflare.md](../masters/master-infra/master-cloudflare.md) | [iac-terraform/v1/modules/dev/cloudflare](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare) |
| [master-digitalocean.md](../../../../references/snow-monkeys-infra/master-infra/master-digitalocean.md) | [master-digitalocean.md](../masters/master-infra/master-digitalocean.md) | [iac-terraform/v1/modules/dev/digitalocean](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean) |
| [master-gcp.md](../../../../references/snow-monkeys-infra/master-infra/master-gcp.md) | [master-gcp.md](../masters/master-infra/master-gcp.md) | [iac-terraform/v1/modules/dev/gcp](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp) |
| [master-civo.md](../../../../references/snow-monkeys-infra/master-infra/master-civo.md) | [master-civo.md](../masters/master-infra/master-civo.md) | [iac-terraform/v1/modules/dev/civo](../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/civo). The plan text is `Tasks: Nothing to do...` |
| [list-of-resources.md](../../../../references/snow-monkeys-infra/master-infra/list-of-resources.md) | [list-of-resources.md](../masters/master-infra/list-of-resources.md) | Folder names the provider plans match under `iac-terraform/v1/modules/dev` |
| [iac-structure/TERRAFORM_COMPLIANCE.md](../../../../references/snow-monkeys-infra/master-infra/iac-structure/TERRAFORM_COMPLIANCE.md) | [iac-structure/TERRAFORM_COMPLIANCE.md](../masters/master-infra/iac-structure/TERRAFORM_COMPLIANCE.md) | Rules the provider plans apply to [iac-terraform](../../../../references/snow-monkeys-infra/iac-terraform) |
| [iac-structure/FLOW.md](../../../../references/snow-monkeys-infra/master-infra/iac-structure/FLOW.md) | [iac-structure/FLOW.md](../masters/master-infra/iac-structure/FLOW.md) | Same tree |
| [iac-structure/INPUTS_OUTPUTS.md](../../../../references/snow-monkeys-infra/master-infra/iac-structure/INPUTS_OUTPUTS.md) | [iac-structure/INPUTS_OUTPUTS.md](../masters/master-infra/iac-structure/INPUTS_OUTPUTS.md) | Same tree |
| [iac-structure/NAMING.md](../../../../references/snow-monkeys-infra/master-infra/iac-structure/NAMING.md) | [iac-structure/NAMING.md](../masters/master-infra/iac-structure/NAMING.md) | Same tree |
| [iac-structure/INTERNAL.md](../../../../references/snow-monkeys-infra/master-infra/iac-structure/INTERNAL.md) | [iac-structure/INTERNAL.md](../masters/master-infra/iac-structure/INTERNAL.md) | Same tree |
| [iac-structure/EXAMPLES.md](../../../../references/snow-monkeys-infra/master-infra/iac-structure/EXAMPLES.md) | [iac-structure/EXAMPLES.md](../masters/master-infra/iac-structure/EXAMPLES.md) | Same tree |
| [iac-structure/iac-terraform.code-workspace](../../../../references/snow-monkeys-infra/master-infra/iac-structure/iac-terraform.code-workspace) | [iac-structure/iac-terraform.code-workspace](../masters/master-infra/iac-structure/iac-terraform.code-workspace) | Workspace file for `iac-terraform` |
| [temporal-notes.txt](../../../../references/snow-monkeys-infra/master-infra/temporal-notes.txt) | [temporal-notes.txt](../masters/master-infra/temporal-notes.txt) | Notes file in `master-infra`. `monthly-master.yml` reads `main.md` and `master.md` |
| [.github/workflows/monthly-master.yml](../../../../references/snow-monkeys-infra/master-infra/.github/workflows/monthly-master.yml) | [.github/workflows/monthly-master.yml](../masters/master-infra/.github/workflows/monthly-master.yml) | The workflow that executes the plan. Trigger is `workflow_dispatch` |
| [.gitignore](../../../../references/snow-monkeys-infra/master-infra/.gitignore) | [.gitignore](../masters/master-infra/.gitignore) | Ignore list for `master-infra` |

### [master-test](./master-test.md)

`test-snow-monkeys/master-test` → `test-snow-monkeys`

| Master file | Copy | Implementation |
| --- | --- | --- |
| [main.md](../../../../references/test-snow-monkeys/master-test/main.md) | [main.md](../masters/master-test/main.md) | [automation-test-snow/.github/workflows/main-automation-test.yml](../../../../references/test-snow-monkeys/automation-test-snow/.github/workflows/main-automation-test.yml) |
| [testflow.md](../../../../references/test-snow-monkeys/master-test/testflow.md) | [testflow.md](../masters/master-test/testflow.md) | Same dispatcher. `testflow.md` calls that file `main.yml` |
| [test-suite-rules.md](../../../../references/test-snow-monkeys/master-test/test-suite-rules.md) | [test-suite-rules.md](../masters/master-test/test-suite-rules.md) | [test-hetzner.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-hetzner.yml). The rules file writes the path as `examples/.github/workflows/test-hetzner.yml` |
| [snowmonkeys-test-suite.md](../../../../references/test-snow-monkeys/master-test/snowmonkeys-test-suite.md) | [snowmonkeys-test-suite.md](../masters/master-test/snowmonkeys-test-suite.md) | [test-snowmonkeys.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-snowmonkeys.yml) |
| [docker-test-suite.md](../../../../references/test-snow-monkeys/master-test/docker-test-suite.md) | [docker-test-suite.md](../masters/master-test/docker-test-suite.md) | [test-docker.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-docker.yml) |
| [hetzner-test-suite.md](../../../../references/test-snow-monkeys/master-test/hetzner-test-suite.md) | [hetzner-test-suite.md](../masters/master-test/hetzner-test-suite.md) | [test-hetzner.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-hetzner.yml) |
| [aws-test-suite.md](../../../../references/test-snow-monkeys/master-test/aws-test-suite.md) | [aws-test-suite.md](../masters/master-test/aws-test-suite.md) | [test-aws.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-aws.yml) |
| [azure-test-suite.md](../../../../references/test-snow-monkeys/master-test/azure-test-suite.md) | [azure-test-suite.md](../masters/master-test/azure-test-suite.md) | [test-azure.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-azure.yml) |
| [gcp-test-suite.md](../../../../references/test-snow-monkeys/master-test/gcp-test-suite.md) | [gcp-test-suite.md](../masters/master-test/gcp-test-suite.md) | [test-gcp.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-gcp.yml) |
| [digitalocean-test-suite.md](../../../../references/test-snow-monkeys/master-test/digitalocean-test-suite.md) | [digitalocean-test-suite.md](../masters/master-test/digitalocean-test-suite.md) | [test-digitalocean.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-digitalocean.yml) |
| `cloudflare-test-suite.md`, named from [main.md](../../../../references/test-snow-monkeys/master-test/main.md) | [main.md](../masters/master-test/main.md) | [test-cloudflare.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/test-cloudflare.yml). `master-test` has no `cloudflare-test-suite.md` |
| Result collector named in [main.md](../../../../references/test-snow-monkeys/master-test/main.md) | [main.md](../masters/master-test/main.md) | [automation-test.yml](../../../../references/test-snow-monkeys/examples-automation-test/.github/workflows/automation-test.yml) |
| [.gitignore](../../../../references/test-snow-monkeys/master-test/.gitignore) | [.gitignore](../masters/master-test/.gitignore) | Ignore list for `master-test` |

### [org-master](./org-master.md)

`yabinboxes/org-master` → `yabinboxes`

| Master file | Copy | Implementation |
| --- | --- | --- |
| [main.md](../../../../references/yabinboxes/org-master/main.md) | [main.md](../masters/org-master/main.md) | The service directories below, plus the runs described in [master-infra](./master-infra.md), [master-modules](./master-modules.md), and [master-test](./master-test.md) |
| snow-angular-ui |  | [org-snow-angular-ui](../../../../references/yabinboxes/org-snow-angular-ui) |
| snow-publish-java |  | [org-snow-publish-java](../../../../references/yabinboxes/org-snow-publish-java) |
| snow-cron-bun |  | [org-snow-cron-bun](../../../../references/yabinboxes/org-snow-cron-bun) |
| snow-postgresdb-docker-compose |  | [org-snow-postgresdb-docker-compose](../../../../references/yabinboxes/org-snow-postgresdb-docker-compose) |
| snow-server-hetzner |  | [org-snow-server-hetzner](../../../../references/yabinboxes/org-snow-server-hetzner) |
| snow-websocket-bun |  | [org-snow-websocket-bun](../../../../references/yabinboxes/org-snow-websocket-bun) |
| snow-test-playwright |  | [org-snow-test-playwright](../../../../references/yabinboxes/org-snow-test-playwright) |
| [local-setup/macmini.md](../../../../references/yabinboxes/org-master/local-setup/macmini.md) | [local-setup/macmini.md](../masters/org-master/local-setup/macmini.md) | Local order: postgres compose, `snow-publish-java`, angular compose, Cloudflare tunnels |
| [local-setup/docker-services/snow-postgresdb-docker-compose/docker-compose.yml](../../../../references/yabinboxes/org-master/local-setup/docker-services/snow-postgresdb-docker-compose/docker-compose.yml) | [local-setup/docker-services/snow-postgresdb-docker-compose/docker-compose.yml](../masters/org-master/local-setup/docker-services/snow-postgresdb-docker-compose/docker-compose.yml) | Local Postgres. Service repo: [org-snow-postgresdb-docker-compose](../../../../references/yabinboxes/org-snow-postgresdb-docker-compose) |
| [local-setup/docker-services/snow-postgresdb-docker-compose/init/init-db.sql](../../../../references/yabinboxes/org-master/local-setup/docker-services/snow-postgresdb-docker-compose/init/init-db.sql) | [local-setup/docker-services/snow-postgresdb-docker-compose/init/init-db.sql](../masters/org-master/local-setup/docker-services/snow-postgresdb-docker-compose/init/init-db.sql) | Init SQL for that local compose |
| [local-setup/docker-services/snow-angular-ui/docker-compose.yml](../../../../references/yabinboxes/org-master/local-setup/docker-services/snow-angular-ui/docker-compose.yml) | [local-setup/docker-services/snow-angular-ui/docker-compose.yml](../masters/org-master/local-setup/docker-services/snow-angular-ui/docker-compose.yml) | Local dashboard compose. Service repo: [org-snow-angular-ui](../../../../references/yabinboxes/org-snow-angular-ui) |
| [.gitignore](../../../../references/yabinboxes/org-master/.gitignore) | [.gitignore](../masters/org-master/.gitignore) | Ignore list for `org-master` |

### [master-yabinboxes](./master-yabinboxes.md)

`yabinboxes/master-yabinboxes` → `yabinboxes`

| Master file | Copy | Implementation |
| --- | --- | --- |
| [main.md](../../../../main.md) | [main.md](../masters/master-yabinboxes/main.md) | This book, and every repository in `yabinboxes` listed below |
| [README.md](../../../../README.md) | [README.md](../masters/master-yabinboxes/README.md) | Book workspace layout |
| [toc.md](../../../../toc.md) | [toc.md](../masters/master-yabinboxes/toc.md) | [front-matter/table-of-contents.md](../../../../front-matter/table-of-contents.md) |
| [org-master](../../../../references/yabinboxes/org-master) | [org-master](../masters/org-master) | Service list and local setup |
| [org-snow-angular-ui](../../../../references/yabinboxes/org-snow-angular-ui) |  | Dashboard and docs UI |
| [org-snow-angular-ui-selfhosted](../../../../references/yabinboxes/org-snow-angular-ui-selfhosted) |  | Angular workspace beside the hosted UI |
| [org-snow-publish-java](../../../../references/yabinboxes/org-snow-publish-java) |  | Publish API, Java 21 |
| [org-snow-publish-java-selfhosted](../../../../references/yabinboxes/org-snow-publish-java-selfhosted) |  | Publish API artifact `snow-publish-java-selfhosted` |
| [org-snow-cron-bun](../../../../references/yabinboxes/org-snow-cron-bun) |  | Liveness probe service |
| [org-snow-postgresdb-docker-compose](../../../../references/yabinboxes/org-snow-postgresdb-docker-compose) |  | Postgres compose |
| [org-snow-server-hetzner](../../../../references/yabinboxes/org-snow-server-hetzner) |  | Hetzner workflow for the Snow host |
| [org-snow-websocket-bun](../../../../references/yabinboxes/org-snow-websocket-bun) |  | WebSocket service |
| [org-snow-test-playwright](../../../../references/yabinboxes/org-snow-test-playwright) |  | Playwright tests |
| [main-examples](../../../../references/yabinboxes/main-examples) |  | Caller workflows. Chapter 15 |
| [main-configure-secrets](../../../../references/yabinboxes/main-configure-secrets) |  | [configure-secrets.yml](../../../../references/yabinboxes/main-configure-secrets/.github/workflows/configure-secrets.yml) |
| [helm-template-public-img-nginx](../../../../references/yabinboxes/helm-template-public-img-nginx) |  | [application.yaml](../../../../references/yabinboxes/helm-template-public-img-nginx/application.yaml) |
| [helm-template-public-img-traefik](../../../../references/yabinboxes/helm-template-public-img-traefik) |  | [application.yaml](../../../../references/yabinboxes/helm-template-public-img-traefik/application.yaml) |

`org-master` and `master-yabinboxes` both point at `yabinboxes`. `org-master` is the service list. `master-yabinboxes` is this book, and Chapter 3 says the book includes every repository in `yabinboxes`.

The [walkthrough](../02-walkthrough/) follows each row into the workflow jobs and Terraform directories.
