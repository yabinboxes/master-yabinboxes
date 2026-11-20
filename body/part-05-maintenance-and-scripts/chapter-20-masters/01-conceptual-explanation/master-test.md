# master-test

`test-snow-monkeys/master-test/main.md` describes a manual run of `automation-test-snow` that dispatches test beds in `examples`, then `automation-test.yml` collects success and failure.

Two repositories implement that description:

- `test-snow-monkeys/automation-test-snow` is the dispatcher.
- `test-snow-monkeys/examples-automation-test` is the test bed and the result collector.

The workflow file is `automation-test-snow/.github/workflows/main-automation-test.yml`. `testflow.md` names that file `main.yml`. The `on` trigger is `workflow_dispatch`.

The workflow posts `repository_dispatch` to `https://api.github.com/repos/test-snow-monkeys/examples-automation-test/dispatches`. `main.md` and `testflow.md` name the repository `examples`. The directory in this workspace is `examples-automation-test`.

## Flags and job order

The workflow `env` block sets:

| Flag | Value in the file |
| --- | --- |
| `FEATURE_FLAG_TEST_ALL_MODULES` | `false` |
| `FEATURE_FLAG_TEST_SNOW_MONKEY` | `false` |
| `FEATURE_FLAG_TEST_DOCKER` | `false` |
| `FEATURE_FLAG_TEST_HETZNER` | `true` |
| `FEATURE_FLAG_TEST_CLOUDFLARE` | `false` |
| `FEATURE_FLAG_TEST_AWS` | `false` |
| `FEATURE_FLAG_TEST_AZURE` | `false` |
| `FEATURE_FLAG_TEST_GCP` | `false` |
| `FEATURE_FLAG_TEST_DIGITALOCEAN` | `false` |

`FEATURE_FLAG_TEST_SNOW_MONKEY` is in the workflow. The flag list in `main.md` and `testflow.md` does not include it.

`test-snow-monkeys-modules` and `test-docker-modules` have no `needs`. They start together. Each of `test-hetzner-modules`, `test-cloudflare-modules`, `test-aws-modules`, `test-azure-modules`, `test-gcp-modules`, and `test-digitalocean-modules` needs both of those jobs, and runs when neither was cancelled and each result is `success` or `skipped`. The dispatch step inside a job runs when that module flag is `true` or `FEATURE_FLAG_TEST_ALL_MODULES` is `true`. With the values above, the Hetzner dispatch step is the one that runs. The Cloudflare step name in the workflow is `Test Hetzner Modules if FEATURE_FLAG_TEST_CLOUDFLARE is enabled`. The echo and the event type in that step are the Cloudflare ones.

## Test beds

Each test workflow accepts `workflow_dispatch` and one `repository_dispatch` type. `test-suite-rules.md` states the provider order: checkout, S3 state, one resource, one server, `docker_compose`, `docker_compose_app`, destroy the server. It names the reference file `examples/.github/workflows/test-hetzner.yml`. The file on disk is `examples-automation-test/.github/workflows/test-hetzner.yml`, and that file uses `hcloud_firewall` and `hcloud_server`.

`main.md` names `cloudflare-test-suite.md`. That file is not in `master-test`. The Cloudflare workflow is `examples-automation-test/.github/workflows/test-cloudflare.yml`.

`automation-test.yml` runs on `workflow_run` after a workflow with one of these names completes: Automation test Snow Monkeys modules, Docker, Hetzner, Cloudflare, AWS, Azure, GCP, DigitalOcean. The job `test-results` echoes a success line or a failure line for that name. The AWS success step echoes `notify hetzner success`. The AWS failure step echoes `notify aws failure`.

Fixture directories present under `examples-automation-test` are `test-hetzner`, `test-docker`, and `test-cloudflare`. The AWS, Azure, GCP, and DigitalOcean workflows set `infra` to `test-aws/server/infra`, `test-azure/server/infra`, `test-gcp/server/infra`, and `test-digitalocean/server/infra`. Those four directories are not in this workspace.
