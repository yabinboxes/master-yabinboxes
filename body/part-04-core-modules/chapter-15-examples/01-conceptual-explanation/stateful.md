# Stateful create and destroy

Stateless examples do not set `s3_bucket_state`. Terraform state stays on the runner. Stateful examples under `yabinboxes/main-examples/hetzner/heztner statefull/` first call `aws-iac` with `type: aws_s3_bucket`, then call `hetzner-iac` with the same bucket name in `s3_bucket_state` and `state_values`.

`hetzner-iac` uses `state_values` for the S3 backend. `region` and `encrypt` must both be present when `s3_bucket_state` is set. The backend key is `{name}/{git_type}/{github.actor_id}/{github.sha}`.

Server create file: `heztner statefull/server/.github/workflows/server-statefull-s3.yml`

```yaml
create_s3_bucket:
  uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
  with:
    type: aws_s3_bucket
    name: s3-server-state
    type_values: |
      bucket_name=s3-server-state
      region=us-east-2
      versioning=true
      encrypt=true

create_server_on_hetzner:
  needs: create_server_on_hetzner
  uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
  with:
    type: hcloud_server
    name: server-hetzner
    s3_bucket_state: s3-server-state
    state_values: |
      bucket_name=s3-server-state
      region=us-east-2
      encrypt=true
```

`type_values` on the server job is `server_type=cpx12`, `image=ubuntu-26.04`, `location=hel1`. Secrets add `aws_access_key_id` and `aws_secret_access_key` next to `hcloud_token`, the SSH keys, and `snow_token_pipeline`.

In this file, `create_server_on_hetzner` sets `needs: create_server_on_hetzner`. That name is the Hetzner job itself. The bucket job id is `create_s3_bucket`.

The same bucket-then-Hetzner order is repeated for:

| Directory | `type` | `name` |
| --- | --- | --- |
| `server/` | `hcloud_server` | `server-hetzner` |
| `recources/` | `hcloud_firewall` | `firewall-hetzner` |
| `recources/` | `hcloud_network` | `network-hetzner` |
| `recources/` | `hcloud_volume` | `volume-hetzner` |
| `recources/` | `hcloud_volume_attachment` | `volume-attachment-hetzner` |
| `recources/` | `hcloud_floating_ip` | `floating-ip-hetzner` |
| `services/` | `hcloud_server`, then `docker_compose` with `host: server-hetzner` | server `server-hetzner`, service `service-hetzner` |
| `application/` | `hcloud_server`, then `docker_compose_app` with `host: server-hetzner` | server `server-hetzner`, application `application-hetzner` |
| `combined/example-1-statefull.yml` | `hcloud_server`, then `docker_compose_app` | `server-example-1-statefull` |
| `combined/example-2-statefull.yml` | `hcloud_server`, then `docker_compose` | `server-example-1-statefull` |

Destroy files are the `*-destroy.yml` next to those workflows. They call the same module with `destroy: true`, the same `type`, the same `name`, and the same `s3_bucket_state`. `server-statefull-s3-destroy.yml` sets `state_values` `encrypt=false` on the destroy job. `hetzner-iac` ignores `destroy` when `type` is `docker_compose` or `docker_compose_app`; the destroy workflows destroy the `hcloud_*` resource, not the compose deployment.

Cloudflare stateful Pages is `yabinboxes/main-examples/cloudflare/cloudflare statefull/resources/.github/workflows/pages-statefull-s3.yml`, with `pages-statefull-s3-destroy.yml` beside it.
