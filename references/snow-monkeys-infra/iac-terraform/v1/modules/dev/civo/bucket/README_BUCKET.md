# Civo object store

Creates a Civo object-store bucket named `snowmonkeysbackup` and reads its credentials.

**Path:** `v1/modules/dev/civo/bucket`

## Implementation

| Resource / data | Name | Purpose |
|---|---|---|
| `civo_object_store` | `snowmonkeysbackup` | Bucket `snowmonkeysbackup`, 500 GB, region **hardcoded** `LON1`. |
| `data.civo_object_store_credential` | `snowmonkeysbackup` | Reads access credentials from `access_key_id`. |

Provider `civo/civo` `~> 1.1.0`. Token is variable `civo-token` (hyphen). Provider region is `var.region` (default `NYC1`), which does **not** match the resource region `LON1`.

`civo_UUID`, `name`, `node-count`, and `node-size` are unused leftovers from a Kubernetes module. There is no `outputs.tf`. Terraform `required_version` is `>= 0.13.0`.

```
provider.tf    # civo provider
bucket.tf      # object store + credential data
variables.tf   # inputs (several unused)
backend.tf     # backend "s3" {}
```

`civo-token` is not a valid shell identifier, so `export TF_VAR_civo-token=...` fails. Pass it with `env`:

```bash
env TF_VAR_civo-token="..." terraform apply
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Other inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_region="LON1"
export TF_VAR_civo_UUID="unused-but-required"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/civo/bucket/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
env TF_VAR_civo-token="..." terraform apply
```

`civo_UUID` has no default and is unused, but Terraform still requires it. There are no outputs; inspect with `terraform state show civo_object_store.snowmonkeysbackup`.

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `civo-token` | yes | — | yes | Civo API token. Set with `env TF_VAR_civo-token=...`. |
| `civo_UUID` | yes | — | yes | Unused; still required. |
| `name` | no | `k8s_demo_1` | no | Unused. |
| `node-count` | no | `2` | no | Unused. Hyphenated name. |
| `node-size` | no | `g4s.kube.medium` | no | Unused. Hyphenated name. |
| `region` | no | `NYC1` | no | Provider region. Resource still uses `LON1`. |

## Outputs

None.

## Docs

- [civo_object_store](https://registry.terraform.io/providers/civo/civo/latest/docs/resources/object_store)
