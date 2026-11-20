# Hetzner resource

Provision Hetzner Cloud resources other than the server: firewall, network, volume, floating IP, and volume attachment.

**Workflow:** `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main`  
**Snow record:** `RESOURCE`

| Section | For |
|---|---|
| [User documentation](#user-documentation) | People creating or operating a resource repository |
| [Agent AI documentation](#agent-ai-documentation) | Agents generating or updating that repository |

These calls do not SSH and do not need an `infra/` directory. Server bootstrap is documented on [Hetzner server](/docs/provider/hetzner/hetzner-server).

[All example files](/docs/provider/hetzner/examples)

---

# User documentation

## Resource types

Any `type` other than `hcloud_server`, `docker_compose`, and `docker_compose_app` runs the Terraform action and notifies Snow as `RESOURCE`. The examples use these types:

| `type` | Snow `name` | `type_values` | Stateless workflow | Stateful workflow |
|---|---|---|---|---|
| `hcloud_firewall` | `firewall-hetzner` | none | [firewall-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/firewall-stateless.yml) | [firewall-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/firewall-statefull-s3.yml) |
| `hcloud_network` | `network-hetzner` | `ip_range=10.0.0.0/16` | [network-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/network-stateless.yml) | [network-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/network-statefull-s3.yml) |
| `hcloud_volume` | `volume-hetzner` | `size=10`, `location=hel1` | [volume-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/volume-stateless.yml) | [volume-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/volume-statefull-s3.yml) |
| `hcloud_floating_ip` | `floating-ip-hetzner` | `type=ipv4`, `home_location=hel1` | [floating-ip-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/floating-ip-stateless.yml) | [floating-ip-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/floating-ip-statefull-s3.yml) |
| `hcloud_volume_attachment` | `volume-attachment-hetzner` | `volume_id`, `server_id`, `automount=false` | [volume-attachment-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/volume-attachment-stateless.yml) | [volume-attachment-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/volume-attachment-statefull-s3.yml) |

`type` selects the Terraform module directory `iac-terraform/v1/modules/dev/hetzner/<type>`. Leave `resource` empty. The workflow copies `type` into `resource`.

Volume attachment has no default ids. Replace `volume_id=0` and `server_id=0` with ids from an existing volume and server before you run it.

## Stateless and stateful

Stateless runs have no `s3_bucket_state`. Terraform state stays on that job's runner. The action removes `backend.tf`, runs `terraform init`, skips `plan`, and applies.

Stateful runs create an S3 bucket first with `snow-monkeys-modules/aws-iac`, then pass the bucket into `hetzner-iac`. The resource job `needs` the bucket job.

```yaml
s3_bucket_state: s3-server-state
state_values: |
  bucket_name=s3-server-state
  region=us-east-2
  encrypt=true
```

`region` and `encrypt` are required when the bucket name is set. The state object key is `{name}/{git_type}/{github.actor_id}/{github.sha}`. Destroy with `destroy: true` in the same workflow run so the key still matches. The S3 bucket itself stays behind. Remove it separately.

Stateful destroy files:

- [firewall-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/firewall-statefull-s3-destroy.yml)
- [network-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/network-statefull-s3-destroy.yml)
- [volume-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/volume-statefull-s3-destroy.yml)
- [floating-ip-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/floating-ip-statefull-s3-destroy.yml)
- [volume-attachment-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/resources/workflows/volume-attachment-statefull-s3-destroy.yml)

## Prerequisites

| GitHub secret | Workflow secret | Used for |
|---|---|---|
| `HETZNER_CLOUD_TOKEN` | `hcloud_token` | Terraform and the Hetzner API |
| `SNOW_TOKEN_PIPELINE` | `snow_token_pipeline` | Snow notify |
| `SNOW_GITHUB_TOKEN` | `snow_github_token` | Clone of `snow-monkeys-infra/iac-terraform` |
| `AWS_ACCESS_KEY_ID` | `aws_access_key_id` | S3 backend, stateful only |
| `AWS_SECRET_ACCESS_KEY` | `aws_secret_access_key` | S3 backend, stateful only |

The resource examples do not pass SSH keys. SSH bootstrap runs only for `type: hcloud_server`.

## Firewall workflow

Full file: [firewall-stateless.yml](/docs/provider/hetzner/examples?file=stateless/resources/workflows/firewall-stateless.yml)

```yaml
name: Firewall Stateless

on:
  push:
    branches: [ "main" ]

jobs:
  create_firewall_on_hetzner:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_firewall
      name: firewall-hetzner
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-firewall:
    needs: create_firewall_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - run: echo "Url is ${{ needs.create_firewall_on_hetzner.outputs.server_ip }}"
```

Network, volume, and floating IP use the same shape and add `type_values`. Volume attachment adds `volume_id`, `server_id`, and `automount`.

## Outputs

| Output | Meaning |
|---|---|
| `server_ip` | Terraform `server_ipv4` when that output exists |
| `terraform_output` | `terraform output -json` |
| `terraform_vars` | Non-secret `TF_VAR_*` values as JSON |

Snow stores `server_ip` on the `RESOURCE` record as `url`. Firewall, network, volume, and floating IP modules may leave `server_ipv4` empty. Use `terraform_output` for the resource id and other attributes.

## Checks

- The Terraform apply step succeeds
- Snow shows a `RESOURCE` whose name matches `name` and whose provider is `hetzner`
- A volume attachment uses real `volume_id` and `server_id` values
- A stateful destroy job is in the same workflow run as create

---

# Agent AI documentation

Use this section to add a Hetzner resource workflow. For a VM, use [hetzner-server.md](/docs/provider/hetzner/hetzner-server).

## Goal

Create one workflow per resource. Pick the `type` and `type_values` from the table in the user section. Copy the matching example file into `.github/workflows/`.

Example tree:

- Stateless: [/md/providers/hetzner/examples/stateless/resources/workflows/](/docs/provider/hetzner/examples)
- Stateful: [/md/providers/hetzner/examples/stateful/resources/workflows/](/docs/provider/hetzner/examples)

## Call contract

```yaml
uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
with:
  type: hcloud_network                    # hcloud_firewall | hcloud_network | hcloud_volume | hcloud_floating_ip | hcloud_volume_attachment
  name: network-hetzner
  type_values: |
    ip_range=10.0.0.0/16
  # stateful only:
  # s3_bucket_state: s3-server-state
  # state_values: |
  #   bucket_name=s3-server-state
  #   region=us-east-2
  #   encrypt=true
secrets:
  hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
  snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
  snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

`type_values` by type:

| `type` | `type_values` |
|---|---|
| `hcloud_firewall` | omit |
| `hcloud_network` | `ip_range=10.0.0.0/16` |
| `hcloud_volume` | `size=10` and `location=hel1` |
| `hcloud_floating_ip` | `type=ipv4` and `home_location=hel1` |
| `hcloud_volume_attachment` | `volume_id=<id>`, `server_id=<id>`, `automount=false` |

## Rules

- Leave `resource` empty so it becomes the same value as `type`.
- Do not add `infra/`, SSH keys, `host`, `expected_url`, or `health_url` for these types.
- Pass `hcloud_token`, `snow_token_pipeline`, and `snow_github_token`. The action clones `snow-monkeys-infra/iac-terraform` with the GitHub token.
- Keep tokens in the `secrets:` block.
- Inputs and workflow secret keys are `snake_case`.
- Stateful jobs `needs` the `aws-iac` bucket job. `state_values` contains `region` and `encrypt`.
- `destroy: true` belongs in the same workflow run as create. The state key includes `github.sha`.
- Snow notify uses `type: RESOURCE` and `url` = `server_ip`. Also forward `terraform_output` and `terraform_vars`. The workflow does this. Callers only pass `name`.
- Read `terraform_output` when `server_ip` is empty. The output is still named `server_ip` for every Terraform type.

## Prompt

```text
Using https://docs.snow-monkeys.com/md/providers/hetzner/hetzner-resource.md
and the matching file under
https://docs.snow-monkeys.com/md/providers/hetzner/examples/stateless/resources/workflows/

Add one GitHub Actions workflow that calls
snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main.

Set type to one of hcloud_firewall, hcloud_network, hcloud_volume,
hcloud_floating_ip, or hcloud_volume_attachment.
Set name and type_values to the values in that example.
For volume attachment, replace volume_id=0 and server_id=0 with real ids.

Map hcloud_token, snow_github_token, and snow_token_pipeline from secrets.
Do not add an infra directory or SSH keys.

Echo needs.<job>.outputs.server_ip and tell the operator to read
terraform_output when that address is empty.

For a stateful resource, create the S3 bucket with aws-iac first and
destroy with destroy: true in the same workflow run.
```

## Raw documentation URL

```text
https://docs.snow-monkeys.com/md/providers/hetzner/hetzner-resource.md
```
