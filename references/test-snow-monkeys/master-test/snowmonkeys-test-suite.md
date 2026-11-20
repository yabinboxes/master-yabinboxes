# Snow Monkeys Test Flow

**Author:** Yabin Monroy Mendez  
**Description:** End-to-end flow for `examples/.github/workflows/test-snowmonkeys.yml`.  
**Workflow name:** `Automation test Snow Monkeys modules` (`name` and `run-name`)

## Exception

This suite does not follow [test-suite-rules.md](test-suite-rules.md).
It does not provision S3 state, a catalog resource, a server,
`docker_compose`, or `docker_compose_app`, and it does not destroy a
server.

After `checkout`, it reports a cluster to the Snow API and then resolves
that name back to a host.

## Purpose

This workflow is the Snow Monkeys test bed. The master orchestrator
starts it with `automation-snow-monkey-test-event`. Both provision jobs
call `snow-monkeys-modules/snow-iac/.github/workflows/main.yml@main`.
`workflow_type` selects the Snow job.

`snow_notify_server` depends on `checkout`. `snow_get_url` depends on
`snow_notify_server`. A failed notify skips the lookup. Neither job
continues on fail.

## Snow Monkeys resources

Catalog from `snow-monkeys-infra/master-infra/list-of-resources.md`.
These entries have no `server` or `resource` type.

| Resource | Job in this workflow |
| --- | --- |
| `notify` | `snow_notify_server` |
| `get_resources` | `snow_get_url` |

## Trigger

```yaml
on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-snow-monkey-test-event ]
```

The master orchestrator in `automation-test-snow` starts it by posting:

```text
event_type: automation-snow-monkey-test-event
```

See [testflow.md](testflow.md) for the dispatch path.

## Components

- **Workflow:** `examples/.github/workflows/test-snowmonkeys.yml`
- **Reusable Snow IAC:** `snow-monkeys-modules/snow-iac`
- **Result collector:** `examples/.github/workflows/automation-test.yml`

## Job map

| Job | Needs | `workflow_type` | `continue-on-error` |
| --- | --- | --- | --- |
| `checkout` | — | — | No |
| `snow_notify_server` | `checkout` | `notify` | No |
| `snow_get_url` | `snow_notify_server` | `get_resources` | No |

## Job sequence

### 1. `checkout`

Runs on `ubuntu-22.04` and checks out the `examples` repository with
`actions/checkout@v4`. Later jobs call the reusable workflow and do not
reuse this workspace.

### 2. `snow_notify_server`

Depends on `checkout`. Catalog entry `notify`. Posts a cluster record
to `https://api.snow-monkeys.com`.

| Input | Value |
| --- | --- |
| `workflow_type` | `notify` |
| `provider` | `test-snowmonkeys-provider` |
| `name` | `test-snowmonkeys-server` |
| `type` | `CLUSTER` |
| `url` | `127.0.0.1` |
| `git_type` | `github` |
| `actor_id` | `github.actor_id` |
| `actor_name` | `github.actor` |

### 3. `snow_get_url`

Depends on `snow_notify_server`. Catalog entry `get_resources`. Resolves
`test-snowmonkeys-server` to a host. The reusable workflow sets output
`response`.

| Input | Value |
| --- | --- |
| `workflow_type` | `get_resources` |
| `resource_name` | `test-snowmonkeys-server` |
| `git_type` | `github` |
| `actor_id` | `github.actor_id` |

The workflow file ends with the comment `# Get url by repository`.
That comment has no job.

## Secrets

| Secret | Used by |
| --- | --- |
| `SNOW_TOKEN_PIPELINE` | `snow_notify_server`, `snow_get_url` |

## Result collection

When this workflow finishes, `automation-test.yml` runs because it
listens for:

```text
Automation test Snow Monkeys modules
```

It then prints a Snow Monkeys success or failure notification from
`github.event.workflow_run.conclusion`.

## Failure behavior

- If `checkout` fails, `snow_notify_server` and `snow_get_url` are skipped.
- If `snow_notify_server` fails, `snow_get_url` is skipped and the workflow fails.
- If `snow_get_url` fails, the workflow fails.
- A failure here does not fail the master orchestrator. Dispatch is asynchronous. See [testflow.md](testflow.md).
