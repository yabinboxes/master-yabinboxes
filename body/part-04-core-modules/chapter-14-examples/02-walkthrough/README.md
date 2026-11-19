# 2. Walkthrough

Every file under `yabinboxes/main-examples` is a caller. The `uses:` line is the implementation. `type` selects the action inside that workflow. When `type` is not `docker_compose` or `docker_compose_app`, the action clones `snow-monkeys-infra/iac-terraform` and runs `v1/modules/dev/<provider>/<type>`.

Paths below are from this book file to the workspace.

## Implementation

| `type` | Reusable workflow | Action | Terraform directory |
| --- | --- | --- | --- |
| `hcloud_server`, `hcloud_firewall`, `hcloud_network`, `hcloud_volume`, `hcloud_volume_attachment`, `hcloud_floating_ip` | [hetzner-iac main.yml](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) | `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/<type>` |
| `docker_compose` | [hetzner-iac main.yml](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) | [docker-compose](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) | none |
| `docker_compose_app` | [hetzner-iac main.yml](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) | [docker-compose-app](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) | none |
| `aws_s3_bucket` | [aws-iac main.yml](../../../../../../snow-monkeys-modules/aws-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) | `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket` |
| `cloudflare_pages_project` | [cloudflare-iac main.yml](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) | [server-resource](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml) | `snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project` |

`list-of-resources.md` is the type list: [master-modules/list-of-resources.md](../../../../../../snow-monkeys-modules/master-modules/list-of-resources.md).

## Index

### Hetzner stateless

| Caller | Jobs | Implementation |
| --- | --- | --- |
| [server-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/server/.github/workflows/server-stateless.yml) | `hcloud_server` `server-hetzner-stateless` | [hetzner-iac](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_server](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server) |
| [firewall-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/firewall-stateless.yml) | `hcloud_firewall` `firewall-hetzner` | [hetzner-iac](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_firewall](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall) |
| [network-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/network-stateless.yml) | `hcloud_network` `network-hetzner`, `ip_range=10.0.0.0/16` | [hetzner-iac](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_network](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network) |
| [volume-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/volume-stateless.yml) | `hcloud_volume` `volume-hetzner`, `size=10`, `location=hel1` | [hetzner-iac](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_volume](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume) |
| [volume-attachment-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/volume-attachment-stateless.yml) | `hcloud_volume_attachment` `volume-attachment-hetzner`, `volume_id=0`, `server_id=0`, `automount=false` | [hetzner-iac](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_volume_attachment](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment) |
| [floating-ip-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/floating-ip-stateless.yml) | `hcloud_floating_ip` `floating-ip-hetzner`, `type=ipv4`, `home_location=hel1` | [hetzner-iac](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_floating_ip](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip) |
| [service-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/services/.github/workflows/service-stateless.yml) | `hcloud_server` `server-hetzner-stateless`, then `docker_compose` `service-hetzner-stateless` `host: server-hetzner-stateless` | [server-resource](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml), then [docker-compose](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) |
| [application-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/application/.github/workflows/application-stateless.yml) | `hcloud_server` `server-hetzner-stateless`, then `docker_compose_app` `application-hetzner-stateless` `host: server-hetzner-stateless` `expected_url` port `4321` | [server-resource](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml), then [docker-compose-app](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) |
| [example-1-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/combined/.github/workflows/example-1-stateless.yml) | `hcloud_server` `server-example-1-stateless` `infra: server/infra`, then `docker_compose_app` `host: server-example-1-stateless` `infra: application/infra` | same two Hetzner actions as the application example |
| [example-2-stateless.yml](../../../../../main-examples/hetzner/hetznez%20stateless/combined/.github/workflows/example-2-stateless.yml) | `hcloud_server` `server-example-2-stateless`, then `docker_compose` `host: server-example-2-stateless` `infra: service/infra` `env_values` `DB_USER` and `DB_PASSWORD` | [server-resource](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml), then [docker-compose](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) |

### Hetzner stateful

Each create file calls [aws-iac](../../../../../../snow-monkeys-modules/aws-iac/.github/workflows/main.yml) with `type: aws_s3_bucket` and `name: s3-server-state`, then [hetzner-iac](../../../../../../snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) with `s3_bucket_state: s3-server-state`. The destroy file repeats that and adds one more Hetzner job with `destroy: true` on the `hcloud_*` type. `destroy` is ignored for `docker_compose` and `docker_compose_app`.

| Create | Destroy | Hetzner `type` |
| --- | --- | --- |
| [server-statefull-s3.yml](../../../../../main-examples/hetzner/heztner%20statefull/server/.github/workflows/server-statefull-s3.yml) | [server-statefull-s3-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/server/.github/workflows/server-statefull-s3-destroy.yml) | `hcloud_server` `server-hetzner`. Create job id `create_server_on_hetzner` sets `needs: create_server_on_hetzner`. The bucket job id is `create_s3_bucket`. |
| [firewall-statefull-s3.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/firewall-statefull-s3.yml) | [firewall-statefull-s3-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/firewall-statefull-s3-destroy.yml) | `hcloud_firewall` `firewall-hetzner` |
| [network-statefull-s3.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/network-statefull-s3.yml) | [network-statefull-s3-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/network-statefull-s3-destroy.yml) | `hcloud_network` `network-hetzner` |
| [volume-statefull-s3.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-statefull-s3.yml) | [volume-statefull-s3-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-statefull-s3-destroy.yml) | `hcloud_volume` `volume-hetzner` |
| [volume-attachment-statefull-s3.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-attachment-statefull-s3.yml) | [volume-attachment-statefull-s3-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-attachment-statefull-s3-destroy.yml) | `hcloud_volume_attachment` `volume-attachment-hetzner` |
| [floating-ip-statefull-s3.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/floating-ip-statefull-s3.yml) | [floating-ip-statefull-s3-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/recources/.github/workflows/floating-ip-statefull-s3-destroy.yml) | `hcloud_floating_ip` `floating-ip-hetzner` |
| [service-statefull-s3.yml](../../../../../main-examples/hetzner/heztner%20statefull/services/.github/workflows/service-statefull-s3.yml) | [service-statefull-s3-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/services/.github/workflows/service-statefull-s3-destroy.yml) | `hcloud_server` `server-hetzner`, then `docker_compose` `service-hetzner` `host: server-hetzner`. Destroy sets `destroy: true` on `hcloud_server`. |
| [application-statefull-s3.yml](../../../../../main-examples/hetzner/heztner%20statefull/application/.github/workflows/application-statefull-s3.yml) | [application-statefull-s3-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/application/.github/workflows/application-statefull-s3-destroy.yml) | `hcloud_server` `server-hetzner`, then `docker_compose_app` `application-hetzner` `host: server-hetzner`. Destroy sets `destroy: true` on `hcloud_server`. |
| [example-1-statefull.yml](../../../../../main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-1-statefull.yml) | [example-1-statefull-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-1-statefull-destroy.yml) | `hcloud_server` then `docker_compose_app`, both named `server-example-1-statefull` |
| [example-2-statefull.yml](../../../../../main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-2-statefull.yml) | [example-2-statefull-destroy.yml](../../../../../main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-2-statefull-destroy.yml) | `hcloud_server` then `docker_compose`, name `server-example-1-statefull`, `expected_url: jdbc:postgresql://localhost:5432/postgres` |

S3 backend implementation for every `s3_bucket_state` row: [aws `aws_s3_bucket`](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket) on create of the bucket, then the Hetzner [server-resource](../../../../../../snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) `terraform init -reconfigure` against that bucket.

### AWS

| Caller | `name` / `bucket_name` | Implementation |
| --- | --- | --- |
| [s3-bucket.yml](../../../../../main-examples/aws/aws%20stateless/resources/.github/workflows/s3-bucket.yml) | `s3-snow-monkeys-20261` | [aws-iac main.yml](../../../../../../snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [aws_s3_bucket](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket) |
| [s3-bucket-terraform-state.yml](../../../../../main-examples/aws/aws%20stateless/resources/.github/workflows/s3-bucket-terraform-state.yml) | `s3-terraform-state-snow-monkeys-20261` | same workflow and Terraform directory |

Both set `region=us-east-2`, `versioning=true`, `encrypt=true`. The follow-up job prints `outputs.bucket_name`. The comment in both files says this resource has to be removed manually in AWS.

### Cloudflare

| Caller | Jobs | Implementation |
| --- | --- | --- |
| [pages-stateless.yml](../../../../../main-examples/cloudflare/cloudflare%20stateless/resources/.github/workflows/pages-stateless.yml) | `cloudflare_pages_project` `pages-cloudflare`, `resource: cloudflare_pages_project`, `production_branch=main`, `infra: infra` | [cloudflare-iac main.yml](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) → [cloudflare_pages_project](../../../../../../snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project) |
| [pages-statefull-s3.yml](../../../../../main-examples/cloudflare/cloudflare%20statefull/resources/.github/workflows/pages-statefull-s3.yml) | `aws_s3_bucket`, then `cloudflare_pages_project` with `s3_bucket_state` | [aws-iac](../../../../../../snow-monkeys-modules/aws-iac/.github/workflows/main.yml), then [cloudflare-iac](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) |
| [pages-statefull-s3-destroy.yml](../../../../../main-examples/cloudflare/cloudflare%20statefull/resources/.github/workflows/pages-statefull-s3-destroy.yml) | same create jobs, then `cloudflare_pages_project` with `destroy: true` | same two workflows. Destroy is handled in [cloudflare server-resource](../../../../../../snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml) |

## What each caller job does

1. `uses` loads `main.yml` of the provider module.
2. `type` selects one action. `hcloud_*`, `aws_s3_bucket`, and `cloudflare_pages_project` select `server-resource`. `docker_compose` and `docker_compose_app` select the compose actions.
3. `server-resource` clones `iac-terraform` and enters `v1/modules/dev/<provider>/<type>`.
4. The follow-up job in the caller prints `server_ip`, `address`, or `bucket_name`.
