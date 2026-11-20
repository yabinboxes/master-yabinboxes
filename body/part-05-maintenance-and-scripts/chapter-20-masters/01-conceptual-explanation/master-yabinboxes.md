# master-yabinboxes

Chapter 3 says `master-yabinboxes` is the book, and that the book includes every repository in `yabinboxes`, plus the repositories in `test-snow-monkeys`, `snow-monkeys-modules`, and `snow-monkeys-infra`.

`yabinboxes/master-yabinboxes/main.md` is the authoring spec. The book that implements it is the `front-matter`, `body`, and `back-matter` directories beside that file. This chapter is `body/part-05-maintenance-and-scripts/chapter-20-masters`.

The other three organizations are implemented by their own masters:

- [master-modules](./master-modules.md) for `snow-monkeys-modules`
- [master-infra](./master-infra.md) for `snow-monkeys-infra`
- [master-test](./master-test.md) for `test-snow-monkeys`

Inside `yabinboxes`, the repositories next to the book are the implementation of "all repositories in yabinboxes".

| Directory | What it implements |
| --- | --- |
| `master-yabinboxes` | This book, from `main.md` |
| `org-master` | The service list and the Mac mini local setup. See [org-master](./org-master.md) |
| `org-snow-angular-ui` | Dashboard and docs UI |
| `org-snow-angular-ui-selfhosted` | Angular workspace. The README title is Snow Angular UI, same words as `org-snow-angular-ui` |
| `org-snow-publish-java` | Publish API, Java 21 |
| `org-snow-publish-java-selfhosted` | Selfhosted publish API |
| `org-snow-cron-bun` | Liveness probe service |
| `org-snow-postgresdb-docker-compose` | Postgres compose for the Snow database |
| `org-snow-server-hetzner` | Hetzner workflow for the Snow host. It calls `hetzner-iac` with `type: server` |
| `org-snow-websocket-bun` | WebSocket service |
| `org-snow-test-playwright` | Playwright tests for the connector |
| `main-examples` | Caller workflows. Chapter 15 is that set |
| `main-configure-secrets` | `configure-secrets.yml` runs on `push`. It authenticates with `gh` and sets organization secrets on `test-snow-monkeys`, `snow-monkeys-org`, `snow-monkeys-modules`, and `snow-monkeys-infra`. A later step echoes `password rotation with Vault` |
| `helm-template-public-img-nginx` | An Argo CD `Application` whose source path is `myapp-helm` |
| `helm-template-public-img-traefik` | An Argo CD `Application` with the same source shape |

`org-master` names the seven services. The selfhosted pair, `main-examples`, `main-configure-secrets`, and the two Helm templates are repositories in `yabinboxes` and are part of this book master for that reason.
