# 6. Hands-on Reusable Workflows

> Status: written. Runnable YAML lives in this folder. Copy a listing into `.github/workflows/` of a caller repository.

A **reusable workflow** is a GitHub Actions file that declares `on: workflow_call`. Caller repositories do not copy Terraform or composite actions. They `uses:` the workflow in `snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml@main` and pass `type`, `type_values`, `name`, and secrets.

This section is the contract for every provider chapter. Implementations live in `snow-monkeys-modules/`. Caller patterns live in `yabinboxes/main-examples/`. Provider-specific listings continue in Chapter 6 (Docker), Chapter 7 (Hetzner), Chapter 8 (Cloudflare), and Chapter 9 (AWS and the other clouds).

## Requirements

List dependencies at first use. These listings are GitHub Actions YAML, not Python.

```txt
# requirements.txt
# gh>=2
# docker>=24
# terraform>=1.5
#
# Reusable workflows (implementation):
#   snow-monkeys-modules/*-iac/.github/workflows/main.yml
# Caller examples:
#   yabinboxes/main-examples/
```

See [requirements.txt](./requirements.txt).

Repository secrets the listings expect:

| Secret | Used by |
| --- | --- |
| `HETZNER_CLOUD_TOKEN` | Hetzner Terraform types (`hcloud_token` input) |
| `SSH_PUBLIC_KEY`, `SSH_PRIVATE_KEY` | CLUSTER create and remote compose |
| `SNOW_TOKEN`, `SNOW_TOKEN_PIPELINE` | Snow notify and host resolution |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | AWS types and S3 Terraform backends |

> **Note:** Secrets must sit under `secrets:`, never under `with:`. GitHub rejects secret values on `workflow_call` inputs.

## How a caller job is shaped

Every caller job has four parts:

1. **`uses:`** — org/repo path to `main.yml` plus a ref (`@main` or a tag).
2. **`with:`** — public inputs. `type` selects CLUSTER, RESOURCE, SERVICE, or APPLICATION.
3. **`secrets:`** — provider tokens and Snow tokens, mapped from repository secrets.
4. **`needs:` + `outputs`** — later jobs read `server_ip`, `address`, `container_name`, or provider-specific outputs.

`type` is a snake_case folder name under `iac-terraform/` for Terraform paths, or one of `docker_compose` / `docker_compose_app` for compose. If `resource` is empty, the workflow copies `type` into `resource`.

| `type` | Snow kind | What the module runs | Example in this folder |
| --- | --- | --- | --- |
| `hcloud_server` | CLUSTER | Terraform `iac-terraform/hcloud_server` | Listing 5.2 |
| `hcloud_firewall` | RESOURCE | Terraform `iac-terraform/hcloud_firewall` | Listing 5.3 |
| `docker_compose` | SERVICE | Compose on a Snow host | Listing 5.4 |
| `docker_compose_app` | APPLICATION | Compose stack on a Snow host | Listing 5.5 |
| `aws_s3_bucket` | RESOURCE | Terraform `iac-terraform/aws_s3_bucket` | Listing 5.6 |
| `build_and_push_image` | image | `docker-iac` buildx push | Chapter 6, Listing 6.1 |

CLUSTER types for the other clouds are `aws_instance`, `google_compute_instance`, `digitalocean_droplet` (and `digitalocean_droplet_autoscale`), and Civo `compute`. Azure and Cloudflare have no VM type; they are RESOURCE-only plus compose.

`type_values` is a newline-separated `KEY=VALUE` block. The composite action writes it to `.env` and exports `TF_VAR_<key>`. `state_values` does the same for the S3 backend (`region`, `encrypt`, `bucket_name`). `s3_bucket_state` turns remote state on.

> **Warning:** `type: server` is not a folder. Hetzner CLUSTER is `hcloud_server`. Passing a type that does not exist under `iac-terraform/` fails checkout of that module.

## Listing 5.1 — `listing_5_1_caller_skeleton.yml`

Minimal caller. Change `uses:`, `type`, `type_values`, and secrets to retarget another provider.

```yaml
name: Caller skeleton

on:
  workflow_dispatch:

jobs:
  provision:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: example-cluster
      type_values: |
        server_type=cpx11
        image=ubuntu-24.04
        location=hel1
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

```text
Output
Jobs: provision (reusable workflow) → implement_hetzner_types
Snow notify kind: CLUSTER
```

**Try it yourself:** swap `uses:` to `snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main`, set `type: aws_instance`, and map `aws_access_key_id` / `aws_secret_access_key` instead of `hcloud_token`.

## Listing 5.2 — `listing_5_2_cluster_hcloud_server.yml`

CLUSTER path from `yabinboxes/main-examples/hetzner/hetznez stateless/server`. A follow-up job prints `server_ip`.

```yaml
name: Cluster hcloud_server

on:
  workflow_dispatch:

jobs:
  create_server:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-stateless
      type_values: |
        server_type=cpx11
        image=ubuntu-24.04
        location=hel1
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  print_server_ip:
    needs: create_server
    runs-on: ubuntu-22.04
    steps:
      - name: Server IP from reusable workflow
        run: echo "${{ needs.create_server.outputs.server_ip }}"
```

```text
Output
Url is 203.0.113.10
```

The called workflow exposes `server_ip` (and aliases `server_ipv4` in Terraform outputs). RESOURCE types leave `server_ip` empty on purpose.

> **Tip:** `name` is the Snow resource name. Later SERVICE and APPLICATION jobs set `host:` to this same string so `snow-iac` can resolve the IP.

## Listing 5.3 — `listing_5_3_resource_hcloud_firewall.yml`

RESOURCE path from `yabinboxes/main-examples/hetzner/hetznez stateless/resources`. Terraform folder `iac-terraform/hcloud_firewall`. Snow notify kind is RESOURCE.

```yaml
name: Resource hcloud_firewall

on:
  workflow_dispatch:

jobs:
  create_firewall:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_firewall
      name: firewall-stateless
      type_values: |
        name=firewall-stateless
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

```text
Output
Jobs: create_firewall → implement_hetzner_types
Snow notify kind: RESOURCE
```

**Try it yourself:** change `type` to `hcloud_volume` or `hcloud_network` and pass the matching `type_values` from that folder's `variables.tf`.

## Listing 5.4 — `listing_5_4_service_docker_compose.yml`

SERVICE path. `host` is the Snow name of an existing CLUSTER. The workflow copies `infra/` to the host and runs `init.sh`.

```yaml
name: Service docker_compose

on:
  workflow_dispatch:

jobs:
  deploy_service:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: nginx-service
      host: server-stateless
      infra: infra
    secrets:
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

```text
Output
address: 203.0.113.10
container_name: snow-web
```

## Listing 5.5 — `listing_5_5_application_docker_compose_app.yml`

APPLICATION path. Same compose copy as SERVICE; Snow notify kind is APPLICATION. Pattern from `yabinboxes/main-examples/hetzner/hetznez stateless/application`.

```yaml
name: Application docker_compose_app

on:
  workflow_dispatch:

jobs:
  deploy_application:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: growing-gravity
      host: server-stateless
      infra: infra
    secrets:
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

```text
Output
address: 203.0.113.10
container_name: snow-web
```

> **Note:** `expected_url` is `hostname:port`. The module replaces the hostname with the resolved host before notify. `health_url` on `docker_compose_app` queues a liveness probe.

## Listing 5.6 — `listing_5_6_stateful_s3.yml`

Stateful CLUSTER. AWS `aws_s3_bucket` holds Terraform state; Hetzner applies with `s3_bucket_state`. Pattern from `yabinboxes/main-examples/hetzner/heztner statefull`.

The S3 job must finish before the CLUSTER job. `needs:` is the S3 job id, not the Hetzner job id.

```yaml
name: Stateful cluster with S3 backend

on:
  workflow_dispatch:

jobs:
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
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  create_server:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-stateful
      type_values: |
        server_type=cpx11
        image=ubuntu-24.04
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  print_server_ip:
    needs: create_server
    runs-on: ubuntu-22.04
    steps:
      - name: Server IP from reusable workflow
        run: echo "${{ needs.create_server.outputs.server_ip }}"
```

```text
Output
S3 bucket terraform state is s3-server-state
Url is 203.0.113.10
```

> **Warning:** Do not point `needs:` of the Hetzner job at itself. The create-server job depends on `create_s3_bucket`. Leave the S3 bucket in place if later destroy runs need the same backend.

## Listing 5.7 — `infra/docker-compose.yml`

Compose file copied to the remote host when `infra:` points at this directory.

```yaml
services:
  web:
    image: nginx:1.28-alpine
    container_name: snow-web
    ports:
      - "8080:80"
    restart: unless-stopped
```

```text
Output
NAME      IMAGE              STATUS
snow-web  nginx:1.28-alpine  Up
```

## Listing 5.8 — `infra/init.sh`

Runs on the remote host after the copy. The last printed line is the container name `snow-iac` reports.

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
docker compose up -d
docker compose ps --format '{{.Name}}' | head -n 1
```

```text
Output
snow-web
```

Make the script executable in the caller repo: `chmod +x infra/init.sh`.

## Listing 5.9 — `listing_5_9_cluster_then_app.yml`

Integrated example. CLUSTER, then APPLICATION with `host` equal to the server Snow name. Pattern from `yabinboxes/main-examples/hetzner/hetznez stateless/combined`.

Keep CLUSTER, RESOURCE, SERVICE, and APPLICATION in separate repositories in production. Combined workflows are for tests and this book.

```yaml
# snippet — full file is listing_5_9_cluster_then_app.yml
jobs:
  create_server:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-1-stateless
      # ...
  deploy_application:
    needs: [create_server, print_server_ip]
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: growing-gravity
      host: server-example-1-stateless
      expected_url: server-example-1-stateless:8080
      infra: infra
```

```text
Output
Url is 203.0.113.10
Astro app connection address is 203.0.113.10
```

**Try it yourself:** insert a SERVICE job (`type: docker_compose`, `expected_url: server-example-1-stateless:8080`) between CLUSTER and APPLICATION, matching `example-2-stateless.yml` in `main-examples`.

## Listing 5.10 — `listing_5_10_destroy.yml`

Destroy a stateful CLUSTER. Pass `destroy: true` with the same `type`, `name`, `type_values`, and `s3_bucket_state` as the create run.

```yaml
# snippet — full file is listing_5_10_destroy.yml
jobs:
  destroy_server:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-stateful
      destroy: true
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
```

```text
Output
terraform destroy: 1 destroyed
```

> **Warning:** Destroying the S3 state bucket before the CLUSTER destroy leaves Terraform with no state. Destroy compute first; delete the bucket last, by hand if other stacks still use it.

## Implementation map

| Layer | Path |
| --- | --- |
| Reusable workflow | `snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml` |
| Composite actions | `snow-monkeys-modules/<provider>-iac/.github/actions/` |
| Terraform types | `snow-monkeys-modules/<provider>-iac/iac-terraform/<type>/` |
| Compose copy | caller `infra/` (`docker-compose.yml` + `init.sh`) |
| Caller examples | `yabinboxes/main-examples/` |
| Type catalog | `snow-monkeys-modules/master-modules/list-of-resources.md` |

Swap the module, keep the job shape:

```yaml
# snippet
uses: snow-monkeys-modules/gcp-iac/.github/workflows/main.yml@main
with:
  type: google_compute_instance
```

```yaml
# snippet
uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
with:
  type: digitalocean_droplet
```

```yaml
# snippet
uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
with:
  type: cloudflare_pages_project
```

```yaml
# snippet
uses: snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main
with:
  type: build_and_push_image
  registry: ghcr.io
  name: org/app
  tag: latest
```

Docker image builds are Chapter 6. Hetzner listings continue in Chapter 7. Cloudflare Pages is Chapter 8. AWS S3 and the other CLUSTER types are Chapter 9.

## Chapter checklist (this section)

- [x] Complete runnable files in this folder
- [x] File-name headings and Listing 5.1 … 5.10
- [x] Expected Output blocks
- [x] `requirements.txt` at first use
- [x] snake_case file names
- [x] Note / Warning / Tip callouts
- [x] Try it yourself on Listings 5.1, 5.3, and 5.9
