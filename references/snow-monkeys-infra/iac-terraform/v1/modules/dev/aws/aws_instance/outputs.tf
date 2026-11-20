output "instance_id" {
  value       = aws_instance.this.id
  description = "EC2 instance ID"
}

output "public_ip" {
  value       = aws_instance.this.public_ip
  description = "Public IP address (maps to workflow server_ip)"
}

output "server_ipv4" {
  value       = aws_instance.this.public_ip
  description = "Alias of public_ip for the Snow workflow server_ip contract"
}

output "private_ip" {
  value       = aws_instance.this.private_ip
  description = "Private IP address"
}

output "instance_state" {
  value       = aws_instance.this.instance_state
  description = "State of the instance"
}
