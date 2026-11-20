# 2. Walkthrough

Every file under `yabinboxes/main-examples` is a caller. The `uses:` line is the implementation. `type` selects the action inside that workflow. When `type` is not `docker_compose` or `docker_compose_app`, the action clones `snow-monkeys-infra/iac-terraform` and runs `v1/modules/dev/<provider>/<type>`.

Paths below are from this book file to the workspace.

## Implementation

| `type` | Reusable workflow | Action | Terraform directory |
| --- | --- | --- | --- |
| `hcloud_server`, `hcloud_firewall`, `hcloud_network`, `hcloud_volume`, `hcloud_volume_attachment`, `hcloud_floating_ip` | [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) | [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) | `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/<type>` |
| `docker_compose` | [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) | [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) | none |
| `docker_compose_app` | [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) | [docker-compose-app](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) | none |
| `aws_s3_bucket` | [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) | [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) | `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket` |
| `cloudflare_pages_project` | [cloudflare-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) | [server-resource](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml) | `snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project` |

`list-of-resources.md` is the type list: [master-modules/list-of-resources.md](../../../../../../../../../references/snow-monkeys-modules/master-modules/list-of-resources.md).

## Index

### Hetzner stateless

| Caller | Jobs | Implementation |
| --- | --- | --- |
| [server-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/server/.github/workflows/server-stateless.yml) | `hcloud_server` `server-hetzner-stateless` | [hetzner-iac](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_server](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server) |
| [firewall-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/firewall-stateless.yml) | `hcloud_firewall` `firewall-hetzner` | [hetzner-iac](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_firewall](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall) |
| [network-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/network-stateless.yml) | `hcloud_network` `network-hetzner`, `ip_range=10.0.0.0/16` | [hetzner-iac](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_network](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network) |
| [volume-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/volume-stateless.yml) | `hcloud_volume` `volume-hetzner`, `size=10`, `location=hel1` | [hetzner-iac](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_volume](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume) |
| [volume-attachment-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/volume-attachment-stateless.yml) | `hcloud_volume_attachment` `volume-attachment-hetzner`, `volume_id=0`, `server_id=0`, `automount=false` | [hetzner-iac](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_volume_attachment](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment) |
| [floating-ip-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/floating-ip-stateless.yml) | `hcloud_floating_ip` `floating-ip-hetzner`, `type=ipv4`, `home_location=hel1` | [hetzner-iac](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [hcloud_floating_ip](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip) |
| [service-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/services/.github/workflows/service-stateless.yml) | `hcloud_server` `server-hetzner-stateless`, then `docker_compose` `service-hetzner-stateless` `host: server-hetzner-stateless` | [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml), then [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) |
| [application-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/application/.github/workflows/application-stateless.yml) | `hcloud_server` `server-hetzner-stateless`, then `docker_compose_app` `application-hetzner-stateless` `host: server-hetzner-stateless` `expected_url` port `4321` | [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml), then [docker-compose-app](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) |
| [example-1-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/combined/.github/workflows/example-1-stateless.yml) | `hcloud_server` `server-example-1-stateless` `infra: server/infra`, then `docker_compose_app` `host: server-example-1-stateless` `infra: application/infra` | same two Hetzner actions as the application example |
| [example-2-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/combined/.github/workflows/example-2-stateless.yml) | `hcloud_server` `server-example-2-stateless`, then `docker_compose` `host: server-example-2-stateless` `infra: service/infra` `env_values` `DB_USER` and `DB_PASSWORD` | [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml), then [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) |

### Hetzner stateful

Each create file calls [aws-iac](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) with `type: aws_s3_bucket` and `name: s3-server-state`, then [hetzner-iac](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) with `s3_bucket_state: s3-server-state`. The destroy file repeats that and adds one more Hetzner job with `destroy: true` on the `hcloud_*` type. `destroy` is ignored for `docker_compose` and `docker_compose_app`.

| Create | Destroy | Hetzner `type` |
| --- | --- | --- |
| [server-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/server/.github/workflows/server-statefull-s3.yml) | [server-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/server/.github/workflows/server-statefull-s3-destroy.yml) | `hcloud_server` `server-hetzner`. Create job id `create_server_on_hetzner` sets `needs: create_server_on_hetzner`. The bucket job id is `create_s3_bucket`. |
| [firewall-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/firewall-statefull-s3.yml) | [firewall-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/firewall-statefull-s3-destroy.yml) | `hcloud_firewall` `firewall-hetzner` |
| [network-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/network-statefull-s3.yml) | [network-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/network-statefull-s3-destroy.yml) | `hcloud_network` `network-hetzner` |
| [volume-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-statefull-s3.yml) | [volume-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-statefull-s3-destroy.yml) | `hcloud_volume` `volume-hetzner` |
| [volume-attachment-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-attachment-statefull-s3.yml) | [volume-attachment-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-attachment-statefull-s3-destroy.yml) | `hcloud_volume_attachment` `volume-attachment-hetzner` |
| [floating-ip-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/floating-ip-statefull-s3.yml) | [floating-ip-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/floating-ip-statefull-s3-destroy.yml) | `hcloud_floating_ip` `floating-ip-hetzner` |
| [service-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/services/.github/workflows/service-statefull-s3.yml) | [service-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/services/.github/workflows/service-statefull-s3-destroy.yml) | `hcloud_server` `server-hetzner`, then `docker_compose` `service-hetzner` `host: server-hetzner`. Destroy sets `destroy: true` on `hcloud_server`. |
| [application-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/application/.github/workflows/application-statefull-s3.yml) | [application-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/application/.github/workflows/application-statefull-s3-destroy.yml) | `hcloud_server` `server-hetzner`, then `docker_compose_app` `application-hetzner` `host: server-hetzner`. Destroy sets `destroy: true` on `hcloud_server`. |
| [example-1-statefull.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-1-statefull.yml) | [example-1-statefull-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-1-statefull-destroy.yml) | `hcloud_server` then `docker_compose_app`, both named `server-example-1-statefull` |
| [example-2-statefull.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-2-statefull.yml) | [example-2-statefull-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-2-statefull-destroy.yml) | `hcloud_server` then `docker_compose`, name `server-example-1-statefull`, `expected_url: jdbc:postgresql://localhost:5432/postgres` |

S3 backend implementation for every `s3_bucket_state` row: [aws `aws_s3_bucket`](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket) on create of the bucket, then the Hetzner [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) `terraform init -reconfigure` against that bucket.

### AWS

| Caller | `name` / `bucket_name` | Implementation |
| --- | --- | --- |
| [s3-bucket.yml](../../../../../../../../../references/yabinboxes/main-examples/aws/aws%20stateless/resources/.github/workflows/s3-bucket.yml) | `s3-snow-monkeys-20261` | [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [aws_s3_bucket](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket) |
| [s3-bucket-terraform-state.yml](../../../../../../../../../references/yabinboxes/main-examples/aws/aws%20stateless/resources/.github/workflows/s3-bucket-terraform-state.yml) | `s3-terraform-state-snow-monkeys-20261` | same workflow and Terraform directory |

Both set `region=us-east-2`, `versioning=true`, `encrypt=true`. The follow-up job prints `outputs.bucket_name`. The comment in both files says this resource has to be removed manually in AWS.

### Cloudflare

| Caller | Jobs | Implementation |
| --- | --- | --- |
| [pages-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/cloudflare/cloudflare%20stateless/resources/.github/workflows/pages-stateless.yml) | `cloudflare_pages_project` `pages-cloudflare`, `resource: cloudflare_pages_project`, `production_branch=main`, `infra: infra` | [cloudflare-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) → [cloudflare_pages_project](../../../../../../../../../references/snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project) |
| [pages-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/cloudflare/cloudflare%20statefull/resources/.github/workflows/pages-statefull-s3.yml) | `aws_s3_bucket`, then `cloudflare_pages_project` with `s3_bucket_state` | [aws-iac](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml), then [cloudflare-iac](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) |
| [pages-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/cloudflare/cloudflare%20statefull/resources/.github/workflows/pages-statefull-s3-destroy.yml) | same create jobs, then `cloudflare_pages_project` with `destroy: true` | same two workflows. Destroy is handled in [cloudflare server-resource](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml) |

## What each caller job does

1. `uses` loads `main.yml` of the provider module.
2. `type` selects one action. `hcloud_*`, `aws_s3_bucket`, and `cloudflare_pages_project` select `server-resource`. `docker_compose` and `docker_compose_app` select the compose actions.
3. `server-resource` clones `iac-terraform` and enters `v1/modules/dev/<provider>/<type>`.
4. The follow-up job in the caller prints `server_ip`, `address`, or `bucket_name`.

## Examples

The workflow file is reproduced below the index entry. The implementation links are the `uses:` targets and the action or Terraform directory selected by `type`.

### s3-bucket-terraform-state

Caller: [s3-bucket-terraform-state.yml](../../../../../../../../../references/yabinboxes/main-examples/aws/aws%20stateless/resources/.github/workflows/s3-bucket-terraform-state.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`

```yaml
# create aws s3 to store terraform state for aws
name: S3 Bucket Terraform State


on:
  push:
    branches: [ "main" ]


jobs:

  # this is the only resource that has to be removed manually in AWS
  create_s3_bucket_terraform_state:
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-terraform-state-snow-monkeys-20261
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-terraform-state-snow-monkeys-20261
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline



  use-output-create_s3_bucket_terraform_state:
    needs: create_s3_bucket_terraform_state
    continue-on-error: true
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "S3 bucket terraform state is ${{ needs.create_s3_bucket_terraform_state.outputs.bucket_name }}"
    
```

### s3-bucket

Caller: [s3-bucket.yml](../../../../../../../../../references/yabinboxes/main-examples/aws/aws%20stateless/resources/.github/workflows/s3-bucket.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`

```yaml
# create aws s3 to store terraform state for aws
name: S3 Bucket Terraform State


on:
  push:
    branches: [ "main" ]


jobs:

  # this is the only resource that has to be removed manually in AWS
  create_s3_bucket_terraform_state:
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-snow-monkeys-20261
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-snow-monkeys-20261
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}



  use-output-create_s3_bucket_terraform_state:
    needs: create_s3_bucket_terraform_state
    continue-on-error: true
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "S3 bucket terraform state is ${{ needs.create_s3_bucket_terraform_state.outputs.bucket_name }}"
    
```

### pages-statefull-s3-destroy

Caller: [pages-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/cloudflare/cloudflare%20statefull/resources/.github/workflows/pages-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [cloudflare-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project`

```yaml
name: Pages Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for cloudflare
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create pages project (resource) on cloudflare, then deploy infra/
  create_pages_project_on_cloudflare:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      resource: cloudflare_pages_project
      name: pages-cloudflare
      infra: infra
      type_values: |
        production_branch=main
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }} # TODO: add cloudflare token
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }} # TODO: add cloudflare account id
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-pages-project:
    needs: create_pages_project_on_cloudflare
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Pages URL is ${{ needs.create_pages_project_on_cloudflare.outputs.server_ip }}"

      - run: sleep 5

  destroy_pages_project_on_cloudflare:
    needs: use-output-pages-project
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      resource: cloudflare_pages_project
      name: pages-cloudflare
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
      destroy: true
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }} # TODO: add cloudflare token
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }} # TODO: add cloudflare account id
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
```

### pages-statefull-s3

Caller: [pages-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/cloudflare/cloudflare%20statefull/resources/.github/workflows/pages-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [cloudflare-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project`

```yaml
name: Pages Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for cloudflare
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create pages project (resource) on cloudflare, then deploy infra/
  create_pages_project_on_cloudflare:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      resource: cloudflare_pages_project
      name: pages-cloudflare
      infra: infra
      type_values: |
        production_branch=main
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }} # TODO: add cloudflare token
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }} # TODO: add cloudflare account id
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-pages-project:
    needs: create_pages_project_on_cloudflare
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Pages URL is ${{ needs.create_pages_project_on_cloudflare.outputs.server_ip }}"
```

### pages-stateless

Caller: [pages-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/cloudflare/cloudflare%20stateless/resources/.github/workflows/pages-stateless.yml)

Implementation:

- [cloudflare-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/cloudflare-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project`

```yaml
name: Pages Stateless

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create pages project (resource) on cloudflare, then deploy infra/
  create_pages_project_on_cloudflare:
    needs: checkout
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      resource: cloudflare_pages_project
      name: pages-cloudflare
      infra: infra
      type_values: |
        production_branch=main
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }} # TODO: add cloudflare token
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }} # TODO: add cloudflare account id
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }} # TODO: add snow github token
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-pages-project:
    needs: create_pages_project_on_cloudflare
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Pages URL is ${{ needs.create_pages_project_on_cloudflare.outputs.server_ip }}"

      - run: sleep 5
```

### application-stateless

Caller: [application-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/application/.github/workflows/application-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose-app](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) (`type: docker_compose_app`)

```yaml
name: Hetzner Application Stateless


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
  
  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner-stateless
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
  


  # deploy application (docker compose app) on the stateless hetzner server
  # host is the Snow name of the server created by server-stateless.yml
  deploy_application_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: application-hetzner-stateless
      host: server-hetzner-stateless
      expected_url: server-hetzner-stateless:4321
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-application:
    needs: deploy_application_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.deploy_application_on_hetzner.outputs.address }}"
```

### example-1-stateless

Caller: [example-1-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/combined/.github/workflows/example-1-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose-app](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) (`type: docker_compose_app`)

```yaml
#
# This workflow is used to test the stateless example 1
# It creates a server and an application
# It uses the hetzner-iac module to create the server and the application
#
# Note: Is good practice to save each server, service,
#       resource, and application by separate in his own repository and not
#       combine them in the same repository like this example.
#


name: Example 1 Stateless

on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-hetzner-test-event ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-1-stateless
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      infra: server/infra
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"

      - run: sleep 5

  # create docker compose app (resource) on hetzner
  deploy-application-astro:
    needs:
      - create_server_on_hetzner
      - use-output-server
    if: always() && needs.create_server_on_hetzner.result == 'success'
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: server-example-1-stateless     # same name because is same repository
      host: server-example-1-stateless
      expected_url: server-example-1-stateless:4321
      infra: application/infra
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-deploy-app:
    needs: deploy-application-astro
    if: always() && needs.deploy-application-astro.result != 'skipped'
    continue-on-error: true
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Astro app connection address is ${{ needs.deploy-application-astro.outputs.address }}"

      - run: sleep 5
```

### example-2-stateless

Caller: [example-2-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/combined/.github/workflows/example-2-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) (`type: docker_compose`)

```yaml
#
# This workflow is used to test the stateless example 2
# It creates a server and a postgres service
# It uses the hetzner-iac module to create the server and the service
#
# Note: Is good practice to save each server, service,
#       resource, and application by separate in his own repository and not
#       combine them in the same repository like this example.
#


name: Example 2 Stateless

on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-hetzner-test-event ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-2-stateless
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      infra: server/infra
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"

      - run: sleep 5

  # create postgres db (service) on hetzner
  create-postgres-db-on-hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: server-example-2-stateless
      host: server-example-2-stateless
      expected_url: jdbc:postgresql://localhost:5432/postgres
      infra: service/infra
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
      env_values: |
        DB_USER=postgres
        DB_PASSWORD=admin

  use-output-postgres-db:
    needs: create-postgres-db-on-hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "DB connection address is ${{ needs.create-postgres-db-on-hetzner.outputs.address }}"
```

### firewall-stateless

Caller: [firewall-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/firewall-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall`

```yaml
name: Firewall Stateless

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create firewall (resource) on hetzner
  create_firewall_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_firewall
      name: firewall-hetzner
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-firewall:
    needs: create_firewall_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_firewall_on_hetzner.outputs.server_ip }}"
      
      - run: sleep 5
```

### floating-ip-stateless

Caller: [floating-ip-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/floating-ip-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip`

```yaml
name: Floating IP Stateless

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create floating ip (resource) on hetzner
  create_floating_ip_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_floating_ip
      name: floating-ip-hetzner
      type_values: |
        type=ipv4
        home_location=hel1
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-floating-ip:
    needs: create_floating_ip_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_floating_ip_on_hetzner.outputs.server_ip }}"

      - run: sleep 5
```

### network-stateless

Caller: [network-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/network-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network`

```yaml
name: Network Stateless

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create network (resource) on hetzner
  create_network_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_network
      name: network-hetzner
      type_values: |
        ip_range=10.0.0.0/16
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-network:
    needs: create_network_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_network_on_hetzner.outputs.server_ip }}"

      - run: sleep 5
```

### volume-attachment-stateless

Caller: [volume-attachment-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/volume-attachment-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment`

```yaml
name: Volume Attachment Stateless

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # attach an existing volume to an existing server on hetzner
  # volume_id and server_id have no module defaults; replace 0 with real ids
  create_volume_attachment_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_volume_attachment
      name: volume-attachment-hetzner
      type_values: |
        volume_id=0
        server_id=0
        automount=false
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-volume-attachment:
    needs: create_volume_attachment_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_volume_attachment_on_hetzner.outputs.server_ip }}"

      - run: sleep 5
```

### volume-stateless

Caller: [volume-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/resources/.github/workflows/volume-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume`

```yaml
name: Volume Stateless

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create volume (resource) on hetzner
  create_volume_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_volume
      name: volume-hetzner
      type_values: |
        size=10
        location=hel1
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-volume:
    needs: create_volume_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_volume_on_hetzner.outputs.server_ip }}"

      - run: sleep 5
```

### server-stateless

Caller: [server-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/server/.github/workflows/server-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`

```yaml
name: Hetzner Server Stateless


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner-stateless
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
  
  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"
      
```

### service-stateless

Caller: [service-stateless.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/hetznez%20stateless/services/.github/workflows/service-stateless.yml)

Implementation:

- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) (`type: docker_compose`)

```yaml
name: Hetzner Service Stateless


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: checkout
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner-stateless
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  # deploy service (docker compose) on the stateless hetzner server
  # host is the Snow name of the server created above
  deploy_service_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: service-hetzner-stateless
      host: server-hetzner-stateless
      expected_url: server-hetzner-stateless:8080
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-service:
    needs: deploy_service_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.deploy_service_on_hetzner.outputs.address }}"
```

### application-statefull-s3-destroy

Caller: [application-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/application/.github/workflows/application-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose-app](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) (`type: docker_compose_app`)

```yaml
name: Hetzner Application Statefull with S3 and Destroy


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline



  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  # deploy application (docker compose app) on the statefull hetzner server
  # host is the Snow name of the server created above
  deploy_application_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: application-hetzner
      host: server-hetzner
      expected_url: server-hetzner:4321
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-application:
    needs: deploy_application_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.deploy_application_on_hetzner.outputs.address }}"

      - run: sleep 5

  # destroy server (server) on hetzner
  # destroying the server also removes the application running on it
  destroy_server_on_hetzner:
    needs: use-output-application
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=false
      destroy: true   # destroy is used to destroy the server in a separate workflow taking the state from the s3 bucket
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
```

### application-statefull-s3

Caller: [application-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/application/.github/workflows/application-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose-app](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) (`type: docker_compose_app`)

```yaml
name: Hetzner Application Statefull with S3


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline



  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  # deploy application (docker compose app) on the statefull hetzner server
  # host is the Snow name of the server created above
  deploy_application_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: application-hetzner
      host: server-hetzner
      expected_url: server-hetzner:4321
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-application:
    needs: deploy_application_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.deploy_application_on_hetzner.outputs.address }}"
```

### example-1-statefull-destroy

Caller: [example-1-statefull-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-1-statefull-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose-app](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) (`type: docker_compose_app`)

```yaml
#
# This workflow is used to test the statefull example 1
# It creates a server and an application
# It then destroys the server and the application
# It uses the hetzner-iac module to create and destroy the resources
# It uses the aws-iac module to create the s3 bucket
# It uses the hetzner-iac module to create the server and the application
# It uses the hetzner-iac module to destroy the server and the application
#
# Note: Is good practice to save each server,service, 
#       resource, and application by separate in his own repository and not 
#       combine them in the same repository like this example.
#


name: Example 1 Statefull Destroy

on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-hetzner-test-event ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  # only resource that has to be removed manually is this s3 bucket state storage
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}


  

  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-1-statefull
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      infra: server/infra
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  
  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"
      
      - run: sleep 5


  # create docker compose app (resource) on hetzner
  # Downstream always() conditions keep server cleanup running after failure.
  deploy-application-astro:
    needs:
      - create_server_on_hetzner
      - use-output-server
    if: always() && needs.create_server_on_hetzner.result == 'success'
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: server-example-1-statefull     # same name because is same repository
      host: server-example-1-statefull
      expected_url: server-example-1-statefull:4321
      infra: application/infra
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-deploy-app:
    needs: deploy-application-astro
    if: always() && needs.deploy-application-astro.result != 'skipped'
    continue-on-error: true
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Astro app connection address is ${{ needs.deploy-application-astro.outputs.address }}"

      - run: sleep 5

  # destroy server (server) on hetzner
  # destroying the server also removes the application running on it
  destroy_server_on_hetzner:
    needs: use-output-deploy-app
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-1-statefull
      infra: server/infra
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=false
      destroy: true   # destroy is used to destroy the server in a separate workflow taking the state from the s3 bucket
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  
```

### example-1-statefull

Caller: [example-1-statefull.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-1-statefull.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose-app](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app/action.yml) (`type: docker_compose_app`)

```yaml
#
# This workflow is used to test the statefull example 1
# It creates a server and an application
# It then destroys the server and the application
# It uses the hetzner-iac module to create and destroy the resources
# It uses the aws-iac module to create the s3 bucket
# It uses the hetzner-iac module to create the server and the application
# It uses the hetzner-iac module to destroy the server and the application
#
# Note: Is good practice to save each server,service, 
#       resource, and application by separate in his own repository and not 
#       combine them in the same repository like this example.
#


name: Example 1 Statefull

on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-hetzner-test-event ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  # only resource that has to be removed manually is this s3 bucket state storage
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}


  

  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-1-statefull
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      infra: server/infra
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  
  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"
      
      - run: sleep 5


  # create docker compose app (resource) on hetzner
  # Downstream always() conditions keep server cleanup running after failure.
  deploy-application-astro:
    needs:
      - create_server_on_hetzner
      - use-output-server
    if: always() && needs.create_server_on_hetzner.result == 'success'
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: server-example-1-statefull     # same name because is same repository
      host: server-example-1-statefull
      expected_url: server-example-1-statefull:4321
      infra: application/infra
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-deploy-app:
    needs: deploy-application-astro
    if: always() && needs.deploy-application-astro.result != 'skipped'
    continue-on-error: true
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Astro app connection address is ${{ needs.deploy-application-astro.outputs.address }}"
    
      - run: sleep 5

  
```

### example-2-statefull-destroy

Caller: [example-2-statefull-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-2-statefull-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) (`type: docker_compose`)

```yaml
#
# This workflow is used to test the statefull example 2
# It creates a server and a postgres service
# It then destroys the server and the service
# It uses the hetzner-iac module to create and destroy the resources
# It uses the aws-iac module to create the s3 bucket
# It uses the hetzner-iac module to create the server and the service
# It uses the hetzner-iac module to destroy the server and the service
#
# Note: Is good practice to save each server, service, 
#       resource, and application by separate in his own repository and not 
#       combine them in the same repository like this example.
#


name: Example 2 Statefull Destroy

on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-hetzner-test-event ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  # only resource that has to be removed manually is this s3 bucket state storage
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}


  

  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-1-statefull
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      infra: server/infra
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  
  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"
      
      - run: sleep 5


  # create postgres db (service) on hetzner
  create-postgres-db-on-hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: server-example-1-statefull
      host: server-example-1-statefull
      expected_url: jdbc:postgresql://localhost:5432/postgres
      infra: service/infra
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
      env_values: |
        DB_USER=postgres
        DB_PASSWORD=admin

  use-output-postgres-db:
    needs: create-postgres-db-on-hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "DB connection address is ${{ needs.create-postgres-db-on-hetzner.outputs.address }}"

      - run: sleep 5

  # destroy server (server) on hetzner
  # destroying the server also removes the service running on it
  destroy_server_on_hetzner:
    needs: use-output-postgres-db
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-1-statefull
      infra: server/infra
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=false
      destroy: true   # destroy is used to destroy the server in a separate workflow taking the state from the s3 bucket
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
 
```

### example-2-statefull

Caller: [example-2-statefull.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/combined/.github/workflows/example-2-statefull.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) (`type: docker_compose`)

```yaml
#
# This workflow is used to test the statefull example 1
# It creates a server and an application
# It then destroys the server and the application
# It uses the hetzner-iac module to create and destroy the resources
# It uses the aws-iac module to create the s3 bucket
# It uses the hetzner-iac module to create the server and the application
# It uses the hetzner-iac module to destroy the server and the application
#
# Note: Is good practice to save each server, service, 
#       resource, and application by separate in his own repository and not 
#       combine them in the same repository like this example.
#


name: Example 1 Statefull

on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-hetzner-test-event ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  # only resource that has to be removed manually is this s3 bucket state storage
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}


  

  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-example-1-statefull
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      infra: server/infra
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  
  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"
      
      - run: sleep 5


  # create postgres db (service) on hetzner
  create-postgres-db-on-hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: server-example-1-statefull
      host: server-example-1-statefull
      expected_url: jdbc:postgresql://localhost:5432/postgres
      infra: service/infra
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
      env_values: |
        DB_USER=postgres
        DB_PASSWORD=admin

  use-output-postgres-db:
    needs: create-postgres-db-on-hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "DB connection address is ${{ needs.create-postgres-db-on-hetzner.outputs.address }}"
        
```

### firewall-statefull-s3-destroy

Caller: [firewall-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/firewall-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall`

```yaml
name: Firewall Stateless

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create firewall (resource) on hetzner
  create_firewall_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_firewall
      name: firewall-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-firewall:
    needs: create_firewall_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_firewall_on_hetzner.outputs.server_ip }}"
      
      - run: sleep 5
  
  destroy_firewall_on_hetzner:
    needs: use-output-firewall
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_firewall
      name: firewall-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
      destroy: true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

 
```

### firewall-statefull-s3

Caller: [firewall-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/firewall-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_firewall`

```yaml
name: Firewall Stateless

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create firewall (resource) on hetzner
  create_firewall_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_firewall
      name: firewall-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-firewall:
    needs: create_firewall_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_firewall_on_hetzner.outputs.server_ip }}"
```

### floating-ip-statefull-s3-destroy

Caller: [floating-ip-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/floating-ip-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip`

```yaml
name: Floating IP Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create floating ip (resource) on hetzner
  create_floating_ip_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_floating_ip
      name: floating-ip-hetzner
      type_values: |
        type=ipv4
        home_location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-floating-ip:
    needs: create_floating_ip_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_floating_ip_on_hetzner.outputs.server_ip }}"

      - run: sleep 5

  destroy_floating_ip_on_hetzner:
    needs: use-output-floating-ip
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_floating_ip
      name: floating-ip-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
      destroy: true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
```

### floating-ip-statefull-s3

Caller: [floating-ip-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/floating-ip-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_floating_ip`

```yaml
name: Floating IP Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create floating ip (resource) on hetzner
  create_floating_ip_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_floating_ip
      name: floating-ip-hetzner
      type_values: |
        type=ipv4
        home_location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-floating-ip:
    needs: create_floating_ip_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_floating_ip_on_hetzner.outputs.server_ip }}"
```

### network-statefull-s3-destroy

Caller: [network-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/network-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network`

```yaml
name: Network Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create network (resource) on hetzner
  create_network_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_network
      name: network-hetzner
      type_values: |
        ip_range=10.0.0.0/16
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-network:
    needs: create_network_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_network_on_hetzner.outputs.server_ip }}"

      - run: sleep 5

  destroy_network_on_hetzner:
    needs: use-output-network
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_network
      name: network-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
      destroy: true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
```

### network-statefull-s3

Caller: [network-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/network-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_network`

```yaml
name: Network Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create network (resource) on hetzner
  create_network_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_network
      name: network-hetzner
      type_values: |
        ip_range=10.0.0.0/16
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-network:
    needs: create_network_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_network_on_hetzner.outputs.server_ip }}"
```

### volume-attachment-statefull-s3-destroy

Caller: [volume-attachment-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-attachment-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment`

```yaml
name: Volume Attachment Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # attach an existing volume to an existing server on hetzner
  # volume_id and server_id have no module defaults; replace 0 with real ids
  create_volume_attachment_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_volume_attachment
      name: volume-attachment-hetzner
      type_values: |
        volume_id=0
        server_id=0
        automount=false
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-volume-attachment:
    needs: create_volume_attachment_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_volume_attachment_on_hetzner.outputs.server_ip }}"

      - run: sleep 5

  destroy_volume_attachment_on_hetzner:
    needs: use-output-volume-attachment
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_volume_attachment
      name: volume-attachment-hetzner
      type_values: |
        volume_id=0
        server_id=0
        automount=false
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
      destroy: true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
```

### volume-attachment-statefull-s3

Caller: [volume-attachment-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-attachment-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume_attachment`

```yaml
name: Volume Attachment Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # attach an existing volume to an existing server on hetzner
  # volume_id and server_id have no module defaults; replace 0 with real ids
  create_volume_attachment_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_volume_attachment
      name: volume-attachment-hetzner
      type_values: |
        volume_id=0
        server_id=0
        automount=false
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-volume-attachment:
    needs: create_volume_attachment_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_volume_attachment_on_hetzner.outputs.server_ip }}"
```

### volume-statefull-s3-destroy

Caller: [volume-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume`

```yaml
name: Volume Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create volume (resource) on hetzner
  create_volume_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_volume
      name: volume-hetzner
      type_values: |
        size=10
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-volume:
    needs: create_volume_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_volume_on_hetzner.outputs.server_ip }}"

      - run: sleep 5

  destroy_volume_on_hetzner:
    needs: use-output-volume
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_volume
      name: volume-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
      destroy: true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
```

### volume-statefull-s3

Caller: [volume-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/recources/.github/workflows/volume-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_volume`

```yaml
name: Volume Statefull

on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=false
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline


  # create volume (resource) on hetzner
  create_volume_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_volume
      name: volume-hetzner
      type_values: |
        size=10
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-volume:
    needs: create_volume_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_volume_on_hetzner.outputs.server_ip }}"
```

### server-statefull-s3-destroy

Caller: [server-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/server/.github/workflows/server-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`

```yaml
name: Hetzner Server Statefull


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline



  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id 
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
  
  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"
      
      

  # destroy server (server) on hetzner
  destroy_server_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=false
      destroy: true   # destroy is used to destroy the server in a separate workflow taking the state from the s3 bucket
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
```

### server-statefull-s3

Caller: [server-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/server/.github/workflows/server-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`

```yaml
name: Hetzner Server Statefull


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline



  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id 
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
  
  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"
      
      
```

### service-statefull-s3-destroy

Caller: [service-statefull-s3-destroy.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/services/.github/workflows/service-statefull-s3-destroy.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) (`type: docker_compose`)

```yaml
name: Hetzner Service Statefull with S3 and Destroy


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline



  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  # deploy service (docker compose) on the statefull hetzner server
  # host is the Snow name of the server created above
  deploy_service_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: service-hetzner
      host: server-hetzner
      expected_url: server-hetzner:8080
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-service:
    needs: deploy_service_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.deploy_service_on_hetzner.outputs.address }}"

      - run: sleep 5

  # destroy server (server) on hetzner
  # destroying the server also removes the service running on it
  destroy_server_on_hetzner:
    needs: use-output-service
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=false
      destroy: true   # destroy is used to destroy the server in a separate workflow taking the state from the s3 bucket
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline
```

### service-statefull-s3

Caller: [service-statefull-s3.yml](../../../../../../../../../references/yabinboxes/main-examples/hetzner/heztner%20statefull/services/.github/workflows/service-statefull-s3.yml)

Implementation:

- [aws-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/aws-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/aws/aws_s3_bucket`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [server-resource](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml) → `snow-monkeys-infra/iac-terraform/v1/modules/dev/hetzner/hcloud_server`
- [hetzner-iac main.yml](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml) → [docker-compose](../../../../../../../../../references/snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose/action.yml) (`type: docker_compose`)

```yaml
name: Hetzner Service Statefull with S3


on:
  push:
    branches: [ "main" ]


jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

  # create aws s3 to store terraform state for hetzner
  create_s3_bucket:
    needs: checkout
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
      name: s3-server-state
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline



  # create server (server) on hetzner
  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }} # TODO: add aws access key id
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # TODO: add aws secret access key
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  # deploy service (docker compose) on the statefull hetzner server
  # host is the Snow name of the server created above
  deploy_service_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: service-hetzner
      host: server-hetzner
      expected_url: server-hetzner:8080
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }} # TODO: add hcloud token
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }} # TODO: add ssh public key
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }} # TODO: add ssh private key
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }} # TODO: add snow token pipeline

  use-output-service:
    needs: deploy_service_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - name: Use output
        run: echo "Url is ${{ needs.deploy_service_on_hetzner.outputs.address }}"
```
