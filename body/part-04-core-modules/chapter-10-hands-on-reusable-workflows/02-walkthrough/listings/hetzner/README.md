# Hetzner (Listings 10.17–10.21)

> Status: written. Hetzner caller module. The generic contract is Listings 10.1–10.10.

`hetzner-iac` is the reference provider. Callers in `yabinboxes/main-examples/hetzner/` use `uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main`. This folder is a copy-paste runnable set of those callers, with `needs:` and secrets corrected for the book.

Hetzner types:

| `type` | Snow kind | Source example |
| --- | --- | --- |
| `hcloud_server` | CLUSTER | `hetznez stateless/server` |
| `hcloud_firewall` | RESOURCE | `hetznez stateless/resources` |
| `hcloud_network` | RESOURCE | `hetznez stateless/resources` |
| `hcloud_volume` | RESOURCE | `hetznez stateless/resources` |
| `hcloud_volume_attachment` | RESOURCE | `hetznez stateless/resources` |
| `hcloud_floating_ip` | RESOURCE | `hetznez stateless/resources` |
| `docker_compose` | SERVICE | `hetznez stateless/services` |
| `docker_compose_app` | APPLICATION | `hetznez stateless/application` |

Stateful variants live under `yabinboxes/main-examples/hetzner/heztner statefull/` and add `s3_bucket_state` plus `state_values`.

## Requirements

```txt
# requirements.txt
# gh>=2
# docker>=24
# terraform>=1.5
#
# Reusable workflow:
#   snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml
# Caller examples:
#   yabinboxes/main-examples/hetzner/
```

See [requirements.txt](./requirements.txt). Secrets: `HETZNER_CLOUD_TOKEN`, `SSH_PUBLIC_KEY`, `SSH_PRIVATE_KEY`, `SNOW_TOKEN`, `SNOW_TOKEN_PIPELINE`. Stateful Listing 10.21 also needs `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

> **Note:** `type` is `hcloud_server`, not `server`. The Terraform folder is `iac-terraform/hcloud_server`.

## Listing 10.17 — `listing_10_17_server_stateless.yml`

CLUSTER. Full file in this folder. After the run, Snow has a host named `server-hetzner-stateless`.

```yaml
jobs:
  create_server:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner-stateless
      type_values: |
        server_type=cpx11
        image=ubuntu-24.04
        location=hel1
```

```text
Output
Url is 203.0.113.10
```

**Try it yourself:** change `location` to `fsn1` and `server_type` to `cpx21`.

## Listing 10.18 — `listing_10_18_firewall_stateless.yml`

RESOURCE. SSH keys are not required.

```yaml
jobs:
  create_firewall:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_firewall
      name: firewall-hetzner
```

```text
Output
Jobs: create_firewall
Snow notify kind: RESOURCE
```

**Try it yourself:** copy the job and set `type: hcloud_volume` with `type_values` from `iac-terraform/hcloud_volume`.

## Listing 10.19 — `listing_10_19_service_stateless.yml`

SERVICE. `host` is the Snow name from Listing 10.17. Compose files are [infra/docker-compose.yml](./infra/docker-compose.yml) and [infra/init.sh](./infra/init.sh).

```yaml
jobs:
  deploy_service:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: service-hetzner-stateless
      host: server-hetzner-stateless
      expected_url: server-hetzner-stateless:8080
      infra: infra
```

```text
Output
Url is 203.0.113.10
container_name: snow-web
```

## Listing 10.20 — `listing_10_20_application_stateless.yml`

APPLICATION. Same host, different Snow kind.

```yaml
jobs:
  deploy_application:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: application-hetzner-stateless
      host: server-hetzner-stateless
      expected_url: server-hetzner-stateless:8080
      infra: infra
```

```text
Output
Url is 203.0.113.10
```

## Listing 10.21 — `listing_10_21_server_stateful.yml`

S3 RESOURCE, then Hetzner CLUSTER with remote state. `needs: create_s3_bucket`.

```yaml
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
  create_server:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner-stateful
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
```

```text
Output
S3 bucket terraform state is s3-server-state
Url is 203.0.113.10
```

> **Warning:** Combined workflows in `main-examples/.../combined/` exist for tests. Keep CLUSTER, RESOURCE, SERVICE, and APPLICATION in separate repositories in production.

> **Tip:** Destroy with `destroy: true` and the same `s3_bucket_state` (Listing 10.10). Do not delete the S3 bucket first.

The integrated CLUSTER-then-APPLICATION chain is Listing 10.9 (`example-1-stateless.yml`).

## Chapter checklist (this section)

- [x] Complete runnable files in this folder
- [x] File-name headings and Listing 10.17 … 10.21
- [x] Expected Output blocks
- [x] `requirements.txt` at first use
- [x] snake_case listing files
- [x] Note / Warning / Tip callouts
- [x] Try it yourself on Listings 7.1 and 7.2
