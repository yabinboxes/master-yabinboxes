# master-modules

`snow-monkeys-modules/master-modules/main.md` points at one schema file per reusable workflow. Each schema is implemented by one repository next to `master-modules`. A caller starts that repository with `workflow_call` on `.github/workflows/main.yml`.

| Schema | Repository |
| --- | --- |
| `master-hetzner.md` | `hetzner-iac` |
| `master-aws.md` | `aws-iac` |
| `master-gcp.md` | `gcp-iac` |
| `master-azure.md` | `azure-iac` |
| `master-digital-ocean.md` | `digital-ocean-iac` |
| `master-cloudflare.md` | `cloudflare-iac` |
| `master-civo.md` | `civo-iac` |
| `master-docker.md` | `docker-iac` |
| `master-snow.md` | `snow-iac` |

`list-of-resources.md` is the type catalog those workflows select from. `outputs.md` is the contract for `workflow_call` outputs.

## Provider workflows

Hetzner, AWS, GCP, Azure, Digital Ocean, and Cloudflare share one job order:

1. `get_resource_name` runs when `type` is `docker_compose` or `docker_compose_app` and `host` is set. It calls `snow-iac` with `workflow_type: get_resources`.
2. `implement_<provider>_types` checks out the caller. An empty `resource` is set to `type`. `server-resource` runs for every type other than the two compose types. `docker-compose` runs for `docker_compose`. `docker-compose-app` runs for `docker_compose_app`.
3. One Snow notify job runs after that job succeeds. `docker_compose` notifies `SERVICE`. `docker_compose_app` notifies `APPLICATION`, and `snow_livenessprobe_application` runs when `health_url` is set.

`server-resource` clones `snow-monkeys-infra/iac-terraform` and enters `v1/modules/dev/<provider>/<resource>`. Chapter 10 documents that clone and apply. The provider folder names in the actions are `hetzner`, `aws`, `azure`, `cloudflare`, `digitalocean`, `gcp`, and `civo`.

The `CLUSTER` notify is the `snow_notify_server` job. Its `if` is a specific `type`:

| Workflow | `snow_notify_server` runs when `type` is |
| --- | --- |
| `hetzner-iac` | `hcloud_server` |
| `aws-iac` | `aws_instance` |
| `gcp-iac` | `google_compute_instance` |
| `digital-ocean-iac` | `digitalocean_droplet` or `digitalocean_droplet_autoscale` |
| `azure-iac` | the condition is `false` |
| `cloudflare-iac` | the condition is `false` |

Any other non-compose `type` takes `snow_notify_resource` and notifies `RESOURCE`. Azure and Cloudflare send every non-compose `type` to that resource job.

## Civo

`civo-iac/.github/workflows/main.yml` splits on `type`.

Empty `type`, or `type: kubernetes`, runs `deploy-civo-with-image`. That job calls `snow-monkeys-modules/deployment-image/.github/actions/civo@main` when `provider` is `civo`, then `snow_notify` with `type: APPLICATION`. `deployment-image` is not a directory under `snow-monkeys-modules` in this workspace. `civo-iac/.github/actions/deploy-image` is on disk, and `main.yml` does not call it.

Any other `type` follows the provider job order above. `type: compute` notifies `CLUSTER`. `bucket`, `observability`, and any other non-compose type notify `RESOURCE`.

## Docker

`docker-iac/.github/workflows/main.yml` is `Docker Snow Provider`. The job `notify_snow_monkeys_dashboard` checks out the caller and runs `build-and-push-image-to-registry` when `type` is `build_and_push_image`. The job output name is `container_name`. The workflow has no `workflow_call.outputs` block, which is the Docker row in `outputs.md`. `snow_token` is an input of the action. The action file declares that input and has no step that reads it.

## Snow

`snow-iac/.github/workflows/main.yml` is `Notify`. `workflow_type: notify` runs `notify_snow`, which calls `.github/actions/notify`. `workflow_type: get_resources` runs `get_resources_snow`, which calls `.github/actions/get-resources` and returns the output `response`. Provider workflows call this same file for host lookup and for the CLUSTER, RESOURCE, SERVICE, and APPLICATION notify.
