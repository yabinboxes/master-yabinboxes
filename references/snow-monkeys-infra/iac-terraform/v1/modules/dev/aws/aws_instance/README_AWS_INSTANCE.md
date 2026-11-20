# AWS EC2 instance

Creates an EC2 instance (`aws_instance`). If `ssh_public_key` is set, also creates an `aws_key_pair` and attaches it.

**Path:** `v1/modules/dev/aws/aws_instance`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `aws_key_pair` | `this` | Created only when `ssh_public_key` is non-empty. Named `${var.name}-key`. |
| `aws_instance` | `this` | EC2 VM. Key is the new pair, else `key_name`, else none. |

Provider `hashicorp/aws` `~> 6.0`. Credentials from `TF_VAR_aws_access_key_id` / `TF_VAR_aws_secret_access_key`. Empty `subnet_id` or security-group list leaves default-VPC behavior. Tags merge `managed_by=terraform`, `Name`, and `var.tags`.

SSH key selection: new key pair if `ssh_public_key` is set, otherwise existing `key_name`, otherwise no key.

```
main.tf        # provider, optional key pair, instance
variables.tf   # inputs
outputs.tf     # instance_id, public_ip, private_ip, instance_state
backend.tf     # backend "s3" {}
```

This module does not create a VPC, security group, or EBS volume.

## Usage

Remote state is the bucket from `aws/aws_s3_bucket` ([BACKEND_S3.md](../../BACKEND_S3.md)). Set inputs with `TF_VAR_*` ([TERRAFORM_RULES.md](../../TERRAFORM_RULES.md)).

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
export TF_VAR_name="snow-server"
export TF_VAR_ami="ami-xxxxxxxx"
export TF_VAR_server_type="t3.micro"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/aws/aws_instance/terraform.tfstate"
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
ssh ubuntu@$(terraform output -raw public_ip)
```

Destroy with `terraform destroy` from this directory.

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `aws_access_key_id` | yes | — | yes | AWS access key. |
| `aws_secret_access_key` | yes | — | yes | AWS secret key. |
| `ami` | yes | — | no | AMI ID. |
| `name` | no | `snow-server` | no | Name tag and key-pair prefix. |
| `region` | no | `us-east-1` | no | Region. |
| `server_type` | no | `t3.micro` | no | Instance type. |
| `subnet_id` | no | `""` | no | Empty uses default VPC. |
| `vpc_security_group_ids` | no | `[]` | no | Security groups. JSON list in the env var. |
| `associate_public_ip_address` | no | `true` | no | Assign a public IP. |
| `ssh_public_key` | no | `""` | yes | Creates a key pair when set. |
| `key_name` | no | `""` | no | Existing key if no public key. |
| `user_data` | no | `""` | no | Cloud-init / user data. |
| `availability_zone` | no | `""` | no | Optional AZ. |
| `tags` | no | `{}` | no | Extra tags. |

## Outputs

| Name | Source | Description |
|---|---|---|
| `instance_id` | `aws_instance.this.id` | Instance ID. |
| `public_ip` | `.public_ip` | Public IPv4 (workflow `server_ip`). |
| `private_ip` | `.private_ip` | Private IPv4. |
| `instance_state` | `.instance_state` | Instance state. |

## Docs

- [aws_instance](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance)
- [aws_key_pair](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/key_pair)
