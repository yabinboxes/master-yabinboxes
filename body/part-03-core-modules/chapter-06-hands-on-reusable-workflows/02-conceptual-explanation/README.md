# 2. Conceptual explanation

A **reusable workflow** is a GitHub Actions file that declares `on: workflow_call`. Caller repositories do not copy Terraform or composite actions. They `uses:` the workflow in `snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml@main` and pass `type`, `type_values`, `name`, and secrets.

Implementations live in `snow-monkeys-modules/`. Caller patterns live in `yabinboxes/main-examples/`.

## How a caller job is shaped

Every caller job has four parts:

1. **`uses:`** — org/repo path to `main.yml` plus a ref (`@main` or a tag).
2. **`with:`** — public inputs. `type` selects CLUSTER, RESOURCE, SERVICE, or APPLICATION.
3. **`secrets:`** — provider tokens and Snow tokens, mapped from repository secrets.
4. **`needs:` + `outputs`** — later jobs read `server_ip`, `address`, `container_name`, or provider-specific outputs.

`type` is a snake_case folder name under `iac-terraform/` for Terraform paths, or one of `docker_compose` / `docker_compose_app` for compose. If `resource` is empty, the workflow copies `type` into `resource`.

`type_values` is a newline-separated `KEY=VALUE` block. The composite action writes it to `.env` and exports `TF_VAR_<key>`. `state_values` does the same for the S3 backend (`region`, `encrypt`, `bucket_name`). `s3_bucket_state` turns remote state on.

> **Note:** Secrets must sit under `secrets:`, never under `with:`. GitHub rejects secret values on `workflow_call` inputs.

> **Warning:** `type: server` is not a folder. Hetzner CLUSTER is `hcloud_server`. Passing a type that does not exist under `iac-terraform/` fails checkout of that module.

Runnable listings are in [03-hands-on-example](../03-hands-on-example/).
