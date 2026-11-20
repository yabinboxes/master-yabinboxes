# GCP Compute Engine instance (legacy demo)

Older hardcoded Compute Engine demo. Prefer [`google_compute_instance`](../google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md) for parameterized usage.

**Path:** `v1/modules/dev/gcp/compute`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_compute_instance` | `default` | VM named `my-vm`, type `n1-standard-1`, zone `us-central1-a`. |

Provider `hashicorp/google` `6.36.1` (pinned). Project, region, and zone are **hardcoded** in `provider.tf` (`udemyiactraining`, `us-central1`, `us-central1-c`). There is no credentials variable; the provider uses ADC / environment credentials. There are no `variables.tf` or `outputs.tf`.

Boot disk image is `ubuntu-minimal-2210-kinetic-amd64-v20230126`. Network is `default` with an empty `access_config` (ephemeral public IP). Metadata `startup-script-url` points at `../scripts/init-script.sh`.

```
provider.tf           # google provider, hardcoded project
compute-instance.tf   # instance
backend.tf            # backend "s3" {}
```

The provider zone (`us-central1-c`) does not match the instance zone (`us-central1-a`). Terraform `required_version` is `>= 0.13.0`, unlike the `>= 1.3` modules.

## Usage

This project cannot be configured with `TF_VAR_*` resource inputs. It always creates `my-vm` in the hardcoded project.

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md).

```bash
# ADC or GOOGLE_APPLICATION_CREDENTIALS must point at a SA for project udemyiactraining
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/compute/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

There are no outputs. Inspect with `terraform state show google_compute_instance.default`.

## Inputs

None.

## Outputs

None.

## Docs

- [google_compute_instance](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance)
- Parameterized replacement: [google_compute_instance](../google_compute_instance/README_GOOGLE_COMPUTE_INSTANCE.md)
