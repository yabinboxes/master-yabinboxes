# Docker Test Flow

**Author:** Yabin Monroy Mendez  
**Description:** End-to-end flow for `examples/.github/workflows/test-docker.yml`.  
**Workflow name:** `Automation test Docker modules` (`name` and `run-name`)

## Exception

This suite does not follow [test-suite-rules.md](test-suite-rules.md).
It does not provision S3 state, a catalog resource, a server,
`docker_compose`, or `docker_compose_app`, and it does not destroy a
server.

After `checkout`, the only provision job builds an image and pushes it
to the registry.

## Purpose

This workflow is the Docker test bed. The master orchestrator starts it
with `automation-docker-test-event`. It calls
`snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main`
with `type: build_and_push_image`.

`build_and_push_image` does not depend on `checkout`. The reusable
workflow checks out the caller repository itself. The two jobs can run
at the same time. A failed `checkout` does not skip the build.

## Docker resources

Catalog from `snow-monkeys-infra/master-infra/list-of-resources.md`.
This entry has no `server` or `resource` type.

| Resource | Job in this workflow |
| --- | --- |
| `build_and_push_image` | `build_and_push_image` |

## Trigger

```yaml
on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-docker-test-event ]
```

The master orchestrator in `automation-test-snow` starts it by posting:

```text
event_type: automation-docker-test-event
```

See [testflow.md](testflow.md) for the dispatch path.

## Components

- **Workflow:** `examples/.github/workflows/test-docker.yml`
- **Reusable Docker IAC:** `snow-monkeys-modules/docker-iac`
- **Image context:** `examples/test-docker/growing-gravity`
- **Result collector:** `examples/.github/workflows/automation-test.yml`

## Job map

| Job | Needs | `continue-on-error` |
| --- | --- | --- |
| `checkout` | — | No |
| `build_and_push_image` | — | No |

## Job sequence

### 1. `checkout`

Runs on `ubuntu-22.04` and checks out the `examples` repository with
`actions/checkout@v4`. The build job does not reuse this workspace.

### 2. `build_and_push_image`

Calls the Docker IAC reusable workflow. Does not continue on fail.

| Input | Value |
| --- | --- |
| `type` | `build_and_push_image` |
| Image name | `yabinm/growing-gravity` |
| Tag | `latest` |
| Infra path | `test-docker/growing-gravity` |
| `test_flag` | `true` |

`registry` is omitted, so login uses Docker Hub. The context is the
Astro app in `test-docker/growing-gravity` (`node:22-alpine`, port
`4321`). The pushed reference is `yabinm/growing-gravity:latest`.

`test_flag` is forwarded. The Docker module accepts it and does not use
it in the build steps.

## Secrets

| Secret | Workflow secret |
| --- | --- |
| `GLOBAL_DOCKERHUB_USERNAME` | `registry_user` |
| `GLOBAL_DOCKERHUB_TOKEN` | `registry_token` |
| `SNOW_TOKEN` | `snow_token` |

## Result collection

When this workflow finishes, `automation-test.yml` runs because it
listens for:

```text
Automation test Docker modules
```

It then prints a Docker success or failure notification from
`github.event.workflow_run.conclusion`.

## Failure behavior

- If `build_and_push_image` fails, the workflow fails.
- If `checkout` fails, `build_and_push_image` still runs.
- A failure here does not fail the master orchestrator. Dispatch is asynchronous. See [testflow.md](testflow.md).
