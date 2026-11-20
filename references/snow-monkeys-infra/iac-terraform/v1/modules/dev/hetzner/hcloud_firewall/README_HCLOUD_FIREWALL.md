# Hetzner Cloud firewall

Creates a Hetzner Cloud firewall with inbound ICMP, SSH, HTTP, and HTTPS open by default.

**Path:** `v1/modules/dev/hetzner/hcloud_firewall`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_firewall` | `this` | Firewall named `var.name`. Dynamic `rule` from `var.rules`. Dynamic `apply_to` from `var.apply_to`. |

Provider `hetznercloud/hcloud` `~> 1.68`. Token: `TF_VAR_hcloud_token`. Optional rule fields (`port`, `source_ips`, `destination_ips`, `description`) use `try()`. Default rules allow ICMP plus TCP 22/80/443 from `0.0.0.0/0` and `::/0`. `apply_to` defaults to empty, so the firewall exists but is not attached until you pass servers or a label selector.

```
main.tf        # provider, firewall
variables.tf   # inputs
outputs.tf     # firewall_id, firewall_name, firewall_rules
backend.tf     # backend "s3" {}
```

## Usage

Remote state: [BACKEND_S3.md](../../BACKEND_S3.md). Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md). Lists and objects are JSON in the env var.

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="snow-firewall"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/hetzner/hcloud_firewall/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
terraform apply
```

Attach to a server after `hcloud_server` exists:

```bash
export TF_VAR_apply_to="[{\"server\": $(terraform -chdir=../hcloud_server output -raw server_id)}]"
terraform apply
```

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `hcloud_token` | yes | — | yes | API token. |
| `name` | no | `snow-firewall` | no | Firewall name. |
| `labels` | no | `{ managed_by = "terraform" }` | no | Labels. |
| `rules` | no | ICMP + TCP 22/80/443 from anywhere | no | Rule list. |
| `apply_to` | no | `[]` | no | `{ server }` and/or `{ label_selector }`. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `firewall_id` | `hcloud_firewall.this.id` | Firewall ID. |
| `firewall_name` | `.name` | Name. |
| `firewall_rules` | `.rule` | Applied rules. |

## Docs

- [hcloud_firewall](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs/resources/firewall)
