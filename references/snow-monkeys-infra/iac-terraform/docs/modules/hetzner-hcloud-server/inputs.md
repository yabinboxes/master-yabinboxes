# Inputs — Hetzner server

Module path: [`v1/modules/dev/hetzner/hcloud_server`](../../../v1/modules/dev/hetzner/hcloud_server)

Source: [`variables.tf`](../../../v1/modules/dev/hetzner/hcloud_server/variables.tf)

## Required

| Name | Type | Sensitive | Description |
|---|---|---|---|
| `hcloud_token` | `string` | yes | Hetzner Cloud API token. Set via `TF_VAR_hcloud_token`. |
| `ssh_public_key` | `string` | yes | SSH public key uploaded as `hcloud_ssh_key` and attached to the server. Set via `TF_VAR_ssh_public_key`. |

## Optional

| Name | Type | Default | Sensitive | Description |
|---|---|---|---|---|
| `name` | `string` | `"CX23"` | no | Server name. Also used to name the SSH key as `${name}key`. |
| `server_type` | `string` | `"cx23"` | no | Hetzner server type (e.g. `cx22`, `cx23`, `cx33`). |
| `image` | `string` | `"ubuntu-24.04"` | no | OS image for the server. |
| `location` | `string` | `"hel1"` | no | Datacenter location (e.g. `hel1`, `nbg1`, `fsn1`, `ash`, `hil`). |
| `ipv4_enabled` | `bool` | `true` | no | Enable public IPv4 on the server. |
| `ipv6_enabled` | `bool` | `false` | no | Enable public IPv6 on the server. |

## How to set

### Environment variables

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
export TF_VAR_name="dev-box"
export TF_VAR_server_type="cx23"
export TF_VAR_image="ubuntu-24.04"
export TF_VAR_location="hel1"
export TF_VAR_ipv4_enabled=true
export TF_VAR_ipv6_enabled=false
```

### Module call

```hcl
module "hetzner_server" {
  source = "../../modules/dev/hetzner/hcloud_server"

  hcloud_token   = var.hcloud_token
  ssh_public_key = var.ssh_public_key

  name         = "dev-box"
  server_type  = "cx23"
  image        = "ubuntu-24.04"
  location     = "hel1"
  ipv4_enabled = true
  ipv6_enabled = false
}
```

## Not in use

`ssh_keys` (list of existing Hetzner SSH key IDs) is commented out in `variables.tf`. The module creates a key from `ssh_public_key` instead.

## Related

- [Outputs](outputs.md)
- [Module overview](../hetzner-hcloud-server.md)
