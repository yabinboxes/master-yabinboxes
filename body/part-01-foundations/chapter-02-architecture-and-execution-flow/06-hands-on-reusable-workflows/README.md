# 6. Hands-on Reusable Workflows

> Status: written (pointer). Execution flow of a caller job is Chapter 5.

Flow for one `uses:` job:

1. Caller passes `type`, `type_values`, `name`, secrets.
2. Called `main.yml` checks out the caller, copies `type` into `resource` when empty, and runs one composite action.
3. Terraform types apply `iac-terraform/<type>/`. Compose types copy `infra/` and run `init.sh` on the host resolved from `host`.
4. `snow-iac` notifies CLUSTER, RESOURCE, SERVICE, or APPLICATION.
5. Caller jobs read `server_ip`, `address`, or `container_name`.

Runnable YAML: [Chapter 5, Listings 5.1–5.10](../../../part-02-core-patterns/chapter-05-reusable-workflows/06-hands-on-reusable-workflows/).
