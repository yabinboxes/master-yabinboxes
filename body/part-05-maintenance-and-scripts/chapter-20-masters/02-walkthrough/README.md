# 2. Walkthrough

Paths below are from this file to the workspace. Chapter 3 states what each master is. The tables here are the file that implements each rule.

## master-modules → snow-monkeys-modules

Rule index: [master-modules/main.md](../../../../../../snow-monkeys-modules/master-modules/main.md). Type catalog: [list-of-resources.md](../../../../../../snow-monkeys-modules/master-modules/list-of-resources.md). Output contract: [outputs.md](../../../../../../snow-monkeys-modules/master-modules/outputs.md).

| Schema | Workflow | Actions | `CLUSTER` when `type` is |
| --- | --- | --- | --- |
| [master-hetzner.md](../../../../../../snow-monkeys-modules/master-modules/master-hetzner.md) | [hetzner-iac main.yml](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml), [docker-compose](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml), [docker-compose-app](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) | `hcloud_server` |
| [master-aws.md](../../../../../../snow-monkeys-modules/master-modules/master-aws.md) | [aws-iac main.yml](../../../../../../snow-monkeys-modules/aws-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml), [docker-compose](../../../../../../snow-monkeys-modules/aws-iac/.github/actions/docker-compose/action.yml), [docker-compose-app](../../../../../../snow-monkeys-modules/aws-iac/.github/actions/docker-compose-app/action.yml) | `aws_instance` |
| [master-gcp.md](../../../../../../snow-monkeys-modules/master-modules/master-gcp.md) | [gcp-iac main.yml](../../../../../../snow-monkeys-modules/gcp-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/gcp-iac/.github/actions/server-resource/action.yml), [docker-compose](../../../../../../snow-monkeys-modules/gcp-iac/.github/actions/docker-compose/action.yml), [docker-compose-app](../../../../../../snow-monkeys-modules/gcp-iac/.github/actions/docker-compose-app/action.yml) | `google_compute_instance` |
| [master-azure.md](../../../../../../snow-monkeys-modules/master-modules/master-azure.md) | [azure-iac main.yml](../../../../../../snow-monkeys-modules/azure-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/azure-iac/.github/actions/server-resource/action.yml), [docker-compose](../../../../../../snow-monkeys-modules/azure-iac/.github/actions/docker-compose/action.yml), [docker-compose-app](../../../../../../snow-monkeys-modules/azure-iac/.github/actions/docker-compose-app/action.yml) | the server job condition is `false` |
| [master-digital-ocean.md](../../../../../../snow-monkeys-modules/master-modules/master-digital-ocean.md) | [digital-ocean-iac main.yml](../../../../../../snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/digital-ocean-iac/.github/actions/server-resource/action.yml), [docker-compose](../../../../../../snow-monkeys-modules/digital-ocean-iac/.github/actions/docker-compose/action.yml), [docker-compose-app](../../../../../../snow-monkeys-modules/digital-ocean-iac/.github/actions/docker-compose-app/action.yml) | `digitalocean_droplet` or `digitalocean_droplet_autoscale` |
| [master-cloudflare.md](../../../../../../snow-monkeys-modules/master-modules/master-cloudflare.md) | [cloudflare-iac main.yml](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml), [docker-compose](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/actions/docker-compose/action.yml), [docker-compose-app](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/actions/docker-compose-app/action.yml) | the server job condition is `false` |
| [master-civo.md](../../../../../../snow-monkeys-modules/master-modules/master-civo.md) | [civo-iac main.yml](../../../../../../snow-monkeys-modules/civo-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/civo-iac/.github/actions/server-resource/action.yml), [docker-compose](../../../../../../snow-monkeys-modules/civo-iac/.github/actions/docker-compose/action.yml), [docker-compose-app](../../../../../../snow-monkeys-modules/civo-iac/.github/actions/docker-compose-app/action.yml). Empty `type` or `kubernetes` calls `snow-monkeys-modules/deployment-image/.github/actions/civo@main` | `compute` |
| [master-docker.md](../../../../../../snow-monkeys-modules/master-modules/master-docker.md) | [docker-iac main.yml](../../../../../../snow-monkeys-modules/docker-iac/.github/workflows/main.yml) | [build-and-push-image-to-registry](../../../../../../snow-monkeys-modules/docker-iac/.github/actions/build-and-push-image-to-registry/action.yml) | none. Job `notify_snow_monkeys_dashboard` runs when `type` is `build_and_push_image` |
| [master-snow.md](../../../../../../snow-monkeys-modules/master-modules/master-snow.md) | [snow-iac main.yml](../../../../../../snow-monkeys-modules/snow-iac/.github/workflows/main.yml) | [notify](../../../../../../snow-monkeys-modules/snow-iac/.github/actions/notify/action.yml) when `workflow_type` is `notify`. [get-resources](../../../../../../snow-monkeys-modules/snow-iac/.github/actions/get-resources/action.yml) when `workflow_type` is `get_resources` | none. This workflow is the notify the other modules call |

`server-resource` enters `iac-terraform/v1/modules/dev/<provider>/<resource>`. Chapter 10 is that tree.

## master-infra → snow-monkeys-infra

| Rule | Implementation |
| --- | --- |
| [main.md](../../../../../../snow-monkeys-infra/master-infra/main.md) | one task: implement [master.md](../../../../../../snow-monkeys-infra/master-infra/master.md) |
| [monthly-master.yml](../../../../../../snow-monkeys-infra/master-infra/.github/workflows/monthly-master.yml) | `workflow_dispatch` job `master` runs `cursor-agent` with a prompt to read `main.md` and `master.md` |
| [list-of-resources.md](../../../../../../snow-monkeys-infra/master-infra/list-of-resources.md) | the type names the provider plans match to folders |
| [iac-structure](../../../../../../snow-monkeys-infra/master-infra/iac-structure/TERRAFORM_COMPLIANCE.md) | `TERRAFORM_COMPLIANCE.md`, `FLOW.md`, `INPUTS_OUTPUTS.md`, `NAMING.md`, `INTERNAL.md`, `EXAMPLES.md` |

| Plan | Directory the plan updates | Folders named by `list-of-resources.md` | Other folders in that directory |
| --- | --- | --- | --- |
| [master-hetzner.md](../../../../../../snow-monkeys-infra/master-infra/master-hetzner.md) | [hetzner](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner) | `hcloud_server`, `hcloud_firewall`, `hcloud_network`, `hcloud_volume`, `hcloud_volume_attachment`, `hcloud_floating_ip` | none |
| [master-aws.md](../../../../../../snow-monkeys-infra/master-infra/master-aws.md) | [aws](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/aws) | `aws_instance`, `aws_s3_bucket`, `aws_lambda_function`, `aws_elastic_beanstalk_application`, `aws_ebs_volume`, `aws_db_instance` | none |
| [master-azure.md](../../../../../../snow-monkeys-infra/master-infra/master-azure.md) | [azure](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/azure) | `azurerm_linux_web_app`, `azurerm_linux_function_app`, `azurerm_mssql_server`, `azurerm_mssql_database`, `azurerm_postgresql_server`, `azurerm_postgresql_database`, `azurerm_mysql_flexible_server`, `azurerm_mysql_flexible_database` | none |
| [master-cloudflare.md](../../../../../../snow-monkeys-infra/master-infra/master-cloudflare.md) | [cloudflare](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare) | `cloudflare_pages_project`, `cloudflare_d1_database`, `cloudflare_r2_bucket`, `cloudflare_workers_script`, `cloudflare_pipeline_sink` | `dns` |
| [master-digitalocean.md](../../../../../../snow-monkeys-infra/master-infra/master-digitalocean.md) | [digitalocean](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/digitalocean) | `digitalocean_droplet`, `digitalocean_droplet_autoscale` | `droplet` |
| [master-gcp.md](../../../../../../snow-monkeys-infra/master-infra/master-gcp.md) | [gcp](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/gcp) | `google_compute_instance`, `google_storage_bucket`, `google_storage_bucket_object`, `google_sql_database_instance` | `compute` |
| [master-civo.md](../../../../../../snow-monkeys-infra/master-infra/master-civo.md) | [civo](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/civo) | the plan says nothing to do. Folders present: `bucket`, `compute`, `observability`. `kubernetes` is not a folder | [v1/k8s/civo-traefik](../../../../../../snow-monkeys-infra/iac-terraform/v1/k8s/civo-traefik) sits outside `v1/modules/dev/civo` |

`docker_compose` and `docker_compose_app` stay in the module actions from the master-modules table. They have no folder in this table.

## master-test → test-snow-monkeys

| Rule | Implementation |
| --- | --- |
| [main.md](../../../../../../test-snow-monkeys/master-test/main.md) | [main-automation-test.yml](../../../../../../test-snow-monkeys/automation-test-snow/.github/workflows/main-automation-test.yml) |
| [testflow.md](../../../../../../test-snow-monkeys/master-test/testflow.md) | same workflow. `testflow.md` calls the file `main.yml` |
| [test-suite-rules.md](../../../../../../test-snow-monkeys/master-test/test-suite-rules.md) | order implemented by the provider workflows below. The reference path in the rules file is `examples/.github/workflows/test-hetzner.yml` |

| Suite | Workflow | `repository_dispatch` type | Jobs that call a module |
| --- | --- | --- | --- |
| [snowmonkeys-test-suite.md](../../../../../../test-snow-monkeys/master-test/snowmonkeys-test-suite.md) | [test-snowmonkeys.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/test-snowmonkeys.yml) | `automation-snow-monkey-test-event` | `snow_notify_server` calls [snow-iac](../../../../../../snow-monkeys-modules/snow-iac/.github/workflows/main.yml) with `workflow_type: notify` and `type: CLUSTER`, name `test-snowmonkeys-server`. `snow_get_url` calls the same workflow with `workflow_type: get_resources` and `resource_name: test-snowmonkeys-server` |
| [docker-test-suite.md](../../../../../../test-snow-monkeys/master-test/docker-test-suite.md) | [test-docker.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/test-docker.yml) | `automation-docker-test-event` | `build_and_push_image` calls [docker-iac](../../../../../../snow-monkeys-modules/docker-iac/.github/workflows/main.yml) with `type: build_and_push_image`. Fixture: [test-docker/growing-gravity](../../../../../../test-snow-monkeys/examples-automation-test/test-docker/growing-gravity) |
| [hetzner-test-suite.md](../../../../../../test-snow-monkeys/master-test/hetzner-test-suite.md) | [test-hetzner.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/test-hetzner.yml) | `automation-hetzner-test-event` | `create_s3_bucket` `type: aws_s3_bucket` on [aws-iac](../../../../../../snow-monkeys-modules/aws-iac/.github/workflows/main.yml). Then [hetzner-iac](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml): `hcloud_firewall`, `hcloud_server`, `docker_compose` with `infra: test-hetzner/service/infra`, `docker_compose_app`, and `hcloud_server` with `destroy: true`. Fixture: [test-hetzner](../../../../../../test-snow-monkeys/examples-automation-test/test-hetzner) |
| `cloudflare-test-suite.md`, named in [main.md](../../../../../../test-snow-monkeys/master-test/main.md). That file is not in `master-test` | [test-cloudflare.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/test-cloudflare.yml) | `automation-cloudflare-test-event` | The live job is `create_pages_project_on_cloudflare`, `type: cloudflare_pages_project`, `infra: test-cloudflare/pages`. The S3, server, compose, application, and destroy jobs are comments. Fixture: [test-cloudflare/pages](../../../../../../test-snow-monkeys/examples-automation-test/test-cloudflare/pages) |
| [aws-test-suite.md](../../../../../../test-snow-monkeys/master-test/aws-test-suite.md) | [test-aws.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/test-aws.yml) | `automation-aws-test-event` | `aws_s3_bucket`, then `type: resource` with `resource: aws_lambda_function`, then `type: server` with `resource: aws_instance`, then `docker_compose`, `docker_compose_app`, and destroy with `type: server` |
| [azure-test-suite.md](../../../../../../test-snow-monkeys/master-test/azure-test-suite.md) | [test-azure.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/test-azure.yml) | `automation-azure-test-event` | `aws_s3_bucket`, then `type: resource` with `resource: azurerm_linux_web_app`, then `type: server` with no `resource` key, then compose, application, and destroy with `type: server` |
| [gcp-test-suite.md](../../../../../../test-snow-monkeys/master-test/gcp-test-suite.md) | [test-gcp.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/test-gcp.yml) | `automation-gcp-test-event` | `aws_s3_bucket`, then `type: resource` with `resource: google_storage_bucket`, then `type: server` with `resource: google_compute_instance`, then compose, application, and destroy with `type: server` |
| [digitalocean-test-suite.md](../../../../../../test-snow-monkeys/master-test/digitalocean-test-suite.md) | [test-digitalocean.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/test-digitalocean.yml) | `automation-digitalocean-test-event` | `aws_s3_bucket`, then `type: resource` with no `resource` key, then `type: server` with `resource: digitalocean_droplet` and the keys `server_type`, `image`, and `location`, then compose, application, and destroy with `type: server` |
| result collector, named in [main.md](../../../../../../test-snow-monkeys/master-test/main.md) | [automation-test.yml](../../../../../../test-snow-monkeys/examples-automation-test/.github/workflows/automation-test.yml) | `workflow_run` on the eight workflow names | `test-results` echoes success or failure. The AWS success echo is `notify hetzner success` |

`gcp-iac` notifies `CLUSTER` when `type` is `google_compute_instance`. The GCP test sends `type: server` and `resource: google_compute_instance`. `aws-iac` notifies `CLUSTER` when `type` is `aws_instance`. The AWS test sends `type: server` and `resource: aws_instance`. `digital-ocean-iac` notifies `CLUSTER` when `type` is `digitalocean_droplet` or `digitalocean_droplet_autoscale`. The DigitalOcean test sends `type: server` and `resource: digitalocean_droplet`. `digital-ocean-iac` does not declare inputs named `server_type`, `image`, or `location`.

## org-master → yabinboxes

| Rule in [org-master/main.md](../../../../../org-master/main.md) | Implementation |
| --- | --- |
| snow-monkeys-infra monthly run | [monthly-master.yml](../../../../../../snow-monkeys-infra/master-infra/.github/workflows/monthly-master.yml) |
| snow-monkeys-modules, one module per provider | the master-modules table |
| test-snow-monkeys automation | [main-automation-test.yml](../../../../../../test-snow-monkeys/automation-test-snow/.github/workflows/main-automation-test.yml) |
| snow-angular-ui | [org-snow-angular-ui](../../../../../org-snow-angular-ui). Workflows on disk: [build-and-push-image.yml.og](../../../../../org-snow-angular-ui/.github/workflows/build-and-push-image.yml.og), [deploy-application.yml.og](../../../../../org-snow-angular-ui/.github/workflows/deploy-application.yml.og) |
| snow-publish-java | [org-snow-publish-java](../../../../../org-snow-publish-java). [pom.xml](../../../../../org-snow-publish-java/pom.xml) sets Java 21. Workflows: [build-and-push-image.yml.og](../../../../../org-snow-publish-java/.github/workflows/build-and-push-image.yml.og), [deploy-application.yml.og](../../../../../org-snow-publish-java/.github/workflows/deploy-application.yml.og) |
| snow-cron-bun | [org-snow-cron-bun](../../../../../org-snow-cron-bun). [build-and-push-image.yml](../../../../../org-snow-cron-bun/.github/workflows/build-and-push-image.yml), [deploy-application.yml](../../../../../org-snow-cron-bun/.github/workflows/deploy-application.yml) |
| snow-postgresdb-docker-compose | [org-snow-postgresdb-docker-compose](../../../../../org-snow-postgresdb-docker-compose). [postgres-hetzner.yml](../../../../../org-snow-postgresdb-docker-compose/.github/workflows/postgres-hetzner.yml), compose under [infra](../../../../../org-snow-postgresdb-docker-compose/infra) |
| snow-server-hetzner | [org-snow-server-hetzner](../../../../../org-snow-server-hetzner). [hetzner-server-dev.yml](../../../../../org-snow-server-hetzner/.github/workflows/hetzner-server-dev.yml) |
| snow-websocket-bun | [org-snow-websocket-bun](../../../../../org-snow-websocket-bun). [build-and-push-image.yml.og](../../../../../org-snow-websocket-bun/.github/workflows/build-and-push-image.yml.og) |
| snow-test-playwright | [org-snow-test-playwright](../../../../../org-snow-test-playwright). [playwright.yml](../../../../../org-snow-test-playwright/.github/workflows/playwright.yml) |
| Local setup | [macmini.md](../../../../../org-master/local-setup/macmini.md), [postgres compose](../../../../../org-master/local-setup/docker-services/snow-postgresdb-docker-compose/docker-compose.yml), [angular compose](../../../../../org-master/local-setup/docker-services/snow-angular-ui/docker-compose.yml) |

## master-yabinboxes → yabinboxes

The book spec is [main.md](../../../../main.md). The chapters that implement it are under [body](../../../../body).

| Directory in `yabinboxes` | Entry |
| --- | --- |
| `master-yabinboxes` | [main.md](../../../../main.md) |
| `org-master` | [main.md](../../../../../org-master/main.md) |
| `org-snow-angular-ui` | [README.md](../../../../../org-snow-angular-ui/README.md) |
| `org-snow-angular-ui-selfhosted` | [README.md](../../../../../org-snow-angular-ui-selfhosted/README.md) |
| `org-snow-publish-java` | [pom.xml](../../../../../org-snow-publish-java/pom.xml) |
| `org-snow-publish-java-selfhosted` | [pom.xml](../../../../../org-snow-publish-java-selfhosted/pom.xml) |
| `org-snow-cron-bun` | [README.md](../../../../../org-snow-cron-bun/README.md) |
| `org-snow-postgresdb-docker-compose` | [postgres-hetzner.yml](../../../../../org-snow-postgresdb-docker-compose/.github/workflows/postgres-hetzner.yml) |
| `org-snow-server-hetzner` | [hetzner-server-dev.yml](../../../../../org-snow-server-hetzner/.github/workflows/hetzner-server-dev.yml) |
| `org-snow-websocket-bun` | [README.md](../../../../../org-snow-websocket-bun/README.md) |
| `org-snow-test-playwright` | [README.md](../../../../../org-snow-test-playwright/README.md) |
| `main-examples` | [Chapter 15](../../../part-04-core-modules/chapter-15-examples/) |
| `main-configure-secrets` | [configure-secrets.yml](../../../../../main-configure-secrets/.github/workflows/configure-secrets.yml) |
| `helm-template-public-img-nginx` | [application.yaml](../../../../../helm-template-public-img-nginx/application.yaml) |
| `helm-template-public-img-traefik` | [application.yaml](../../../../../helm-template-public-img-traefik/application.yaml) |
