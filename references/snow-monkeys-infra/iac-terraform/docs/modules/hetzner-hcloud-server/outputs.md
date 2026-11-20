# Outputs — Hetzner server

Module path: [`v1/modules/dev/hetzner/hcloud_server`](../../../v1/modules/dev/hetzner/hcloud_server)

Source: [`outputs.tf`](../../../v1/modules/dev/hetzner/hcloud_server/outputs.tf)

## Outputs

| Name | Type | Sensitive | Source | Description |
|---|---|---|---|---|
| `server_id` | `string` | no | `hcloud_server.cx23.id` | Hetzner Cloud server ID. |
| `server_ipv4` | `string` | no | `hcloud_server.cx23.ipv4_address` | Public IPv4 address. Empty if `ipv4_enabled` is `false`. |
| `server_status` | `string` | no | `hcloud_server.cx23.status` | Server status (e.g. `running`, `off`, `initializing`). |

## How to read

### CLI

```bash
terraform output
terraform output server_id
terraform output -raw server_ipv4
terraform output server_status
```

### SSH after apply

```bash
ssh root@$(terraform output -raw server_ipv4)
```

### From a parent module

```hcl
module "hetzner_server" {
  source = "../../modules/dev/hetzner/hcloud_server"
  # ...
}

output "hetzner_server_id" {
  value = module.hetzner_server.server_id
}

output "hetzner_server_ipv4" {
  value = module.hetzner_server.server_ipv4
}

output "hetzner_server_status" {
  value = module.hetzner_server.server_status
}
```

## Related

- [Inputs](inputs.md)
- [Module overview](../hetzner-hcloud-server.md)
