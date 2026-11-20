# org-master

`yabinboxes/org-master/main.md` has two parts: the execution process, and the services.

## Execution process

The file lists three steps.

1. `snow-monkeys-infra` runs `monthly-master.yml`. That implementation is [master-infra](./master-infra.md). The file says the output is Terraform for `iac-terraform` on branch `updates`, and that `master-modules` describes the flow. The provider plans that perform the update live in `master-infra`, and they read `list-of-resources.md`. The reusable workflows that call those Terraform projects live in `snow-monkeys-modules`, which is [master-modules](./master-modules.md).
2. `snow-monkeys-modules` adds one module repository per provider. `master-modules/main.md` is the list of those modules.
3. `test-snow-monkeys` runs `automation-test-snow`, and the feature flags select which example workflows run. That implementation is [master-test](./master-test.md). The sentence in `org-master/main.md` stops at "master-test describe the flow in how".

## Services

`org-master` names each service without the `org-` prefix and points the group at `https://github.com/snow-monkeys-org`. The implementation directories in this workspace use the `org-` prefix.

| Service in `org-master/main.md` | Directory |
| --- | --- |
| snow-angular-ui | `yabinboxes/org-snow-angular-ui` |
| snow-publish-java | `yabinboxes/org-snow-publish-java` |
| snow-cron-bun | `yabinboxes/org-snow-cron-bun` |
| snow-postgresdb-docker-compose | `yabinboxes/org-snow-postgresdb-docker-compose` |
| snow-server-hetzner | `yabinboxes/org-snow-server-hetzner` |
| snow-websocket-bun | `yabinboxes/org-snow-websocket-bun` |
| snow-test-playwright | `yabinboxes/org-snow-test-playwright` |

`org-snow-angular-ui` is the Angular workspace. Its README names the package `snow-angular-ui` and describes the dashboard, docs, and Firebase authentication. `org-snow-publish-java` is a Spring Boot project. `pom.xml` sets `java.version` to `21` and the artifact `snow-publish-java`. `org-snow-cron-bun` is the Bun service whose README title is `health-cron-bun`: it registers liveness probes, checks them on a 10 minute schedule, and stores state in PostgreSQL. `org-snow-websocket-bun` is the Bun WebSocket server in `index.ts`. `org-snow-test-playwright` is the Playwright project whose README says it tests the Snow deployment connector API and UI.

Two more service directories sit beside those and are not numbered in the `org-master` service list: `org-snow-angular-ui-selfhosted` and `org-snow-publish-java-selfhosted`.

GitHub Actions runs a file named `.yml`. Several service workflows are stored as `.yml.og`, so Actions does not run them.

| Directory | Workflow file Actions runs |
| --- | --- |
| `org-snow-cron-bun` | `build-and-push-image.yml` calls `docker-iac` with `type: build_and_push_image` and image `yabinm/health-cron-bun`. `deploy-application.yml` runs after that workflow succeeds and calls `hetzner-iac` with `type: docker_compose_app`, `name: health-cron-bun`, `host: 62.238.50.36`. |
| `org-snow-postgresdb-docker-compose` | `postgres-hetzner.yml` calls `hetzner-iac` with `type: docker_compose`, `name: snow-postgres-db`, `host: 62.238.50.36`. The compose files are under `infra/`. |
| `org-snow-server-hetzner` | `hetzner-server-dev.yml` calls `hetzner-iac` with `type: server`, `name: snow-server`, and the keys `server_type`, `image`, and `location`. `hetzner-iac` notifies `CLUSTER` when `type` is `hcloud_server`. This workflow sends `type: server`. `hetzner-iac` declares no inputs named `server_type`, `image`, or `location`. |
| `org-snow-test-playwright` | `playwright.yml` checks out the repository. The setup-node, `npm ci`, Playwright install, and `npx playwright test` steps are comments. |

`org-snow-angular-ui`, `org-snow-angular-ui-selfhosted`, and `org-snow-publish-java` keep `build-and-push-image.yml.og` and `deploy-application.yml.og`. The Angular deploy file calls `hetzner-iac` with `type: docker_compose_app`. The publish-java build file calls `docker-iac` with image `yabinm/snow-publish-java`. `org-snow-publish-java-selfhosted` has the same two `.yml.og` names. `org-snow-websocket-bun` keeps `build-and-push-image.yml.og`, and that file calls `snow-monkeys-modules/build-and-push-image/.github/workflows/main.yml@main`. `build-and-push-image` is not a directory under `snow-monkeys-modules` in this workspace. The Docker module that is present is `docker-iac`.

## Local setup

`org-master/local-setup/macmini.md` is the local run on the Mac mini. The order in that file is: start `snow-postgresdb-docker-compose` with `docker compose up -d`, copy the Firebase service account into `snow-publish-java`, run `snow-publish-java`, start `snow-angular-ui` with `docker compose up -d`, then open Cloudflare tunnels to ports `8080`, `4200`, and `4201`.

The compose files for that local run are in `org-master/local-setup/docker-services/snow-postgresdb-docker-compose` and `org-master/local-setup/docker-services/snow-angular-ui`.
