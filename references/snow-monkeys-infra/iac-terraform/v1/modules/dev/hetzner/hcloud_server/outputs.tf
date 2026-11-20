output "server_id" {
  value = hcloud_server.cx23.id
}

output "server_ipv4" {
  value = hcloud_server.cx23.ipv4_address
}

output "server_status" {
  value = hcloud_server.cx23.status
}
