# Infrastructure

Infrastructure refers to servers/clusters and cloud resources. The caller passes Terraform fields in `type_values` as `KEY=VALUE` lines. The module writes those lines as `TF_VAR_*`. Tokens stay under `secrets:`.

The Hetzner module is `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml`. When `resource` is empty, that workflow sets `resource` to `type` and clones `snow-monkeys-infra/iac-terraform` at `v1/modules/dev/hetzner/<type>`.

## Virtual instance (server)

File: `yabinboxes/main-examples/hetzner/hetznez stateless/server/.github/workflows/server-stateless.yml`

```yaml
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
    hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
    ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
    ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
    snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

`name` is the Snow name. Later service and application examples pass this same string as `host`. The next job prints `needs.create_server_on_hetzner.outputs.server_ip`. In `hetzner-iac`, `server_ip` is `terraform output -raw server_ipv4` from `hcloud_server`.

## Firewall (resource)

File: `yabinboxes/main-examples/hetzner/hetznez stateless/resources/.github/workflows/firewall-stateless.yml`

`type` is `hcloud_firewall`. `name` is `firewall-hetzner`. There is no `type_values` block. The secret is `hcloud_token` and `snow_token_pipeline`. The follow-up job prints `outputs.server_ip`.

The same caller shape, with a different `type` and `type_values`, is used for the other stateless Hetzner resources:

| File | `type` | `name` | `type_values` |
| --- | --- | --- | --- |
| `network-stateless.yml` | `hcloud_network` | `network-hetzner` | `ip_range=10.0.0.0/16` |
| `volume-stateless.yml` | `hcloud_volume` | `volume-hetzner` | `size=10`, `location=hel1` |
| `volume-attachment-stateless.yml` | `hcloud_volume_attachment` | `volume-attachment-hetzner` | `volume_id=0`, `server_id=0`, `automount=false` |
| `floating-ip-stateless.yml` | `hcloud_floating_ip` | `floating-ip-hetzner` | `type=ipv4`, `home_location=hel1` |

## Bucket (resource)

Files under `yabinboxes/main-examples/aws/aws stateless/resources/.github/workflows/`.

Both call `snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main` with `type: aws_s3_bucket`.

| File | `name` | `bucket_name` in `type_values` |
| --- | --- | --- |
| `s3-bucket.yml` | `s3-snow-monkeys-20261` | `s3-snow-monkeys-20261` |
| `s3-bucket-terraform-state.yml` | `s3-terraform-state-snow-monkeys-20261` | `s3-terraform-state-snow-monkeys-20261` |

Both also set `region=us-east-2`, `versioning=true`, and `encrypt=true`. Secrets are `aws_access_key_id`, `aws_secret_access_key`, and `snow_token_pipeline`. The comment in both files says this resource has to be removed manually in AWS. The follow-up job prints `outputs.bucket_name`.

## Cloudflare Pages (resource)

File: `yabinboxes/main-examples/cloudflare/cloudflare stateless/resources/.github/workflows/pages-stateless.yml`

```yaml
create_pages_project_on_cloudflare:
  uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
  with:
    type: cloudflare_pages_project
    resource: cloudflare_pages_project
    name: pages-cloudflare
    infra: infra
    type_values: |
      production_branch=main
  secrets:
    cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }}
    cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
    snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

`list-of-resources.md` maps `cloudflare_pages_project` to RESOURCE. The follow-up job prints `outputs.server_ip` as the Pages URL.
