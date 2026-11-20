# GCP Compute Engine instance

Creates a Compute Engine VM with an optional public IP and SSH metadata.

**Path:** `v1/modules/dev/gcp/google_compute_instance`

Prefer this project over the older `gcp/compute` demo, which hardcodes names and has no variables.

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `google_compute_instance` | `this` | VM. Machine type is `server_type`. Boot disk from `image` / `disk_size_gb`. |

Provider `hashicorp/google` `~> 8.0`. Project is required. `credentials` is service-account JSON; empty uses Application Default Credentials. Public IP is an ephemeral `access_config` when `associate_public_ip` is true. If `ssh_public_key` is set, metadata is only `ssh-keys` (`ssh_user:key`) and `var.metadata` is ignored.

```
main.tf        # provider, instance
variables.tf   # inputs
outputs.tf     # instance_id, instance_name, public_ip, private_ip
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md).

```bash
export TF_VAR_project="your-gcp-project"
export TF_VAR_name="snow-vm"
export TF_VAR_server_type="e2-micro"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
# optional: export TF_VAR_credentials="$(cat ./sa.json)"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/gcp/google_compute_instance/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

```bash
terraform output -raw public_ip
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `project` | yes | — | no | GCP project ID. |
| `credentials` | no | `""` | yes | SA JSON. Empty uses ADC. |
| `name` | no | `snow-vm` | no | Instance name. |
| `region` | no | `us-central1` | no | Provider region. |
| `server_type` | no | `e2-micro` | no | Machine type. |
| `zone` | no | `us-central1-a` | no | Zone. |
| `image` | no | `debian-cloud/debian-12` | no | Boot image. |
| `disk_size_gb` | no | `20` | no | Boot disk GB. |
| `network` | no | `default` | no | VPC. |
| `subnetwork` | no | `""` | no | Empty omits. |
| `associate_public_ip` | no | `true` | no | Ephemeral public IP. |
| `ssh_user` | no | `snow` | no | SSH username. |
| `ssh_public_key` | no | `""` | yes | Empty skips ssh-keys metadata. |
| `metadata` | no | `{}` | no | Used when no SSH key. |
| `labels` | no | `{}` | no | Labels (merged with `managed_by=terraform`). |
| `tags` | no | `[]` | no | Network tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `instance_id` | `google_compute_instance.this.id` | Instance ID. |
| `instance_name` | `.name` | Name. |
| `public_ip` | `access_config[0].nat_ip` | Public IP, or null. |
| `private_ip` | `.network_interface[0].network_ip` | Private IP. |

## Docs

- [google_compute_instance](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance)
