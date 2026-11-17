# Other clouds (Listings 6.24–6.29)

> Status: written. AWS, GCP, Azure, DigitalOcean, and Civo callers. The generic contract is Listings 6.1–6.10.

Swap the module path and the `type` string. Keep the same `with:` / `secrets:` job shape as Listing 6.1. Implementations live in `snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml`. The AWS S3 caller in `yabinboxes/main-examples/aws/` is Listing 6.24.

| Provider | `uses:` | CLUSTER `type` | Default / notes |
| --- | --- | --- | --- |
| AWS | `aws-iac` | `aws_instance` | RESOURCE includes `aws_s3_bucket` |
| GCP | `gcp-iac` | `google_compute_instance` | Secret `gcp_credentials` |
| Azure | `azure-iac` | none | Default `azurerm_linux_web_app` (RESOURCE) |
| DigitalOcean | `digital-ocean-iac` | `digitalocean_droplet` | Autoscale is also CLUSTER |
| Civo | `civo-iac` | `compute` | Empty `type` or `kubernetes` is the k8s image path |
| Cloudflare | Listings 6.22–6.23 | none | RESOURCE-only |
| Hetzner | Listings 6.17–6.21 | `hcloud_server` | Reference provider |
| Docker | Listings 6.11–6.16 | n/a | `build_and_push_image` |

Catalog: `snow-monkeys-modules/master-modules/list-of-resources.md`.

## Requirements

```txt
# requirements.txt
# gh>=2
# terraform>=1.5
#
# Reusable workflows:
#   snow-monkeys-modules/{aws,gcp,azure,digital-ocean,civo}-iac/.github/workflows/main.yml
# Caller examples:
#   yabinboxes/main-examples/aws/
```

See [requirements.txt](./requirements.txt).

> **Warning:** `yabinboxes/main-examples/aws/.../s3-bucket.yml` prints `needs.*.outputs.bucket_name`. That output is not declared on `aws-iac`. Listing 6.24 prints `terraform_output` instead.

## Listing 6.24 — `listing_6_24_aws_s3_bucket.yml`

RESOURCE. Pattern from `yabinboxes/main-examples/aws/aws stateless/resources`. This is the bucket later CLUSTER jobs pass as `s3_bucket_state` (Listing 6.6).

```yaml
jobs:
  create_s3_bucket:
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      name: s3-snow-monkeys-state
      type_values: |
        bucket_name=s3-snow-monkeys-state
        region=us-east-2
        versioning=true
        encrypt=true
```

```text
Output
{"bucket_name":"s3-snow-monkeys-state"}
Snow notify kind: RESOURCE
```

**Try it yourself:** point a Hetzner CLUSTER at this bucket with `s3_bucket_state` and `state_values` from Listing 6.6.

## Listing 6.25 — `listing_6_25_aws_instance.yml`

CLUSTER. `type_values` hold `instance_type` and `region`.

```yaml
jobs:
  create_instance:
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_instance
      name: server-aws-stateless
      type_values: |
        instance_type=t3.micro
        region=us-east-2
```

```text
Output
Url is 203.0.113.10
Snow notify kind: CLUSTER
```

## Listing 6.26 — `listing_6_26_google_compute_instance.yml`

```yaml
jobs:
  create_instance:
    uses: snow-monkeys-modules/gcp-iac/.github/workflows/main.yml@main
    with:
      type: google_compute_instance
      name: server-gcp-stateless
      type_values: |
        machine_type=e2-micro
        zone=us-central1-a
        project=my-gcp-project
    secrets:
      gcp_credentials: ${{ secrets.GCP_CREDENTIALS }}
```

```text
Output
Url is 203.0.113.10
```

## Listing 6.27 — `listing_6_27_digitalocean_droplet.yml`

```yaml
jobs:
  create_droplet:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: digitalocean_droplet
      name: server-do-stateless
      type_values: |
        server_type=s-1vcpu-1gb
        image=ubuntu-24-04-x64
        location=nyc3
    secrets:
      digitalocean_token: ${{ secrets.DIGITALOCEAN_TOKEN }}
```

```text
Output
Url is 203.0.113.10
```

**Try it yourself:** set `type: digitalocean_droplet_autoscale`. That type is also CLUSTER.

## Listing 6.28 — `listing_6_28_azurerm_linux_web_app.yml`

RESOURCE. Azure has no VM.

```yaml
jobs:
  create_web_app:
    uses: snow-monkeys-modules/azure-iac/.github/workflows/main.yml@main
    with:
      type: azurerm_linux_web_app
      name: app-azure-stateless
      type_values: |
        location=eastus
        resource_group_name=snow-rg
    secrets:
      azure_client_id: ${{ secrets.AZURE_CLIENT_ID }}
      azure_client_secret: ${{ secrets.AZURE_CLIENT_SECRET }}
      azure_subscription_id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      azure_tenant_id: ${{ secrets.AZURE_TENANT_ID }}
```

```text
Output
Snow notify kind: RESOURCE
```

## Listing 6.29 — `listing_6_29_civo_compute.yml`

Terraform CLUSTER. `name` is required on this workflow.

```yaml
jobs:
  create_compute:
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
    with:
      type: compute
      name: server-civo-stateless
      type_values: |
        size=g4s.kube.small
        region=LON1
    secrets:
      civo_token: ${{ secrets.CIVO_TOKEN }}
```

```text
Output
Url is 203.0.113.10
```

> **Note:** Civo Kubernetes uses empty `type` or `type: kubernetes` and kebab-case secrets (`civo-token`, `snow-token`). Terraform `compute` uses snake_case (`civo_token`, `snow_token`).

> **Tip:** Compose (`docker_compose` / `docker_compose_app`) is identical on every provider module. Copy Listings 6.4 and 6.5, and change only `uses:`.

## Chapter checklist (this section)

- [x] Complete runnable files in this folder
- [x] File-name headings and Listing 6.24 … 6.29
- [x] Expected Output blocks
- [x] `requirements.txt` at first use
- [x] snake_case listing files
- [x] Note / Warning / Tip callouts
- [x] Try it yourself on Listings 9.1 and 9.4
