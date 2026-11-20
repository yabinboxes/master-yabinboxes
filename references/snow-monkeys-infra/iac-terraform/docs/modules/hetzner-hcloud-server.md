# Hetzner server module

Provisions a Hetzner Cloud server and an SSH key for access.

**Path:** [`v1/modules/dev/hetzner/hcloud_server`](../../v1/modules/dev/hetzner/hcloud_server)

## What it creates

| Resource | Name | Purpose |
|---|---|---|
| `hcloud_ssh_key` | `yabin` | Uploads the given public key (`${var.name}key`) |
| `hcloud_server` | `cx23` | Cloud server with public networking and the SSH key attached |

Servers are labeled `managed_by = terraform`.

## Requirements

| Name | Version |
|---|---|
| Terraform | `>= 1.3` |
| `hetznercloud/hcloud` | `~> 1.49` |

## Usage

From the module directory (or reference it as a module from a root stack):

```bash
cd v1/modules/dev/hetzner/hcloud_server

export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
# optional overrides:
# export TF_VAR_name="my-dev"
# export TF_VAR_server_type="cx23"
# export TF_VAR_location="hel1"

terraform init
terraform plan
terraform apply
```

As a child module:

```hcl
module "hetzner_server" {
  source = "../../modules/dev/hetzner/hcloud_server"

  hcloud_token   = var.hcloud_token
  ssh_public_key = var.ssh_public_key

  name        = "dev-box"
  server_type = "cx23"
  image       = "ubuntu-24.04"
  location    = "hel1"
  ipv4_enabled = true
  ipv6_enabled = false
}
```

Do not commit tokens or keys. Set every variable with `TF_VAR_*` ([TERRAFORM_RULES.md](../../v1/modules/dev/TERRAFORM_RULES.md)).

## Inputs and outputs

| Doc | Contents |
|---|---|
| [Inputs](hetzner-hcloud-server/inputs.md) | Required/optional variables, defaults, how to set them |
| [Outputs](hetzner-hcloud-server/outputs.md) | `server_id`, `server_ipv4`, `server_status`, how to read them |

## Files

```
v1/modules/dev/hetzner/hcloud_server/
├── main.tf        # provider, SSH key, server
├── variables.tf   # inputs
└── outputs.tf     # server_id, server_ipv4, server_status
```

## Notes

- Default location is Helsinki (`hel1`). Other common codes: `nbg1`, `fsn1`, `ash`, `hil`.
- Default type `cx23` is a small shared-vCPU plan; change `server_type` for larger instances.
- IPv6 is off by default; set `ipv6_enabled = true` if needed.
- Destroy with `terraform destroy` from the same directory / state.
