# Appendix — Setup and environment

> Status: stub — write after TOC approval.

Local and production environment notes. Expand from `yabinboxes/org-master/local-setup/` and each chapter's maintainer scripts.

## Local Mac mini stack

- Docker
- Cloudflare tunnels
- Firebase service account
- Postgres (`org-snow-postgresdb-docker-compose`)
- Publish API (`org-snow-publish-java`)
- Dashboard and docs UI (`org-snow-angular-ui`)

## Workspace roots

- `snow-monkeys-infra/` — Terraform generation
- `snow-monkeys-modules/` — reusable workflow modules
- `test-snow-monkeys/` — automation tests and examples
- `yabinboxes/` — org services, dashboard, and this book
