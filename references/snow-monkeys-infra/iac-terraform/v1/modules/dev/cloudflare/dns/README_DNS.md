# Cloudflare DNS (incomplete)

Intended to create a Cloudflare A record for a Civo Traefik load balancer and a Kubernetes secret for cert-manager. **This project is not self-contained** and will not apply as-is.

**Path:** `v1/modules/dev/cloudflare/dns`

## Implementation

| Resource | Name | Purpose |
|---|---|---|
| `kubernetes_secret` | `cloudflare_api_key_secret` | Opaque secret `cloudflare-api-key-secret` in namespace `certmanager`. |
| `cloudflare_record` | `clcreative-all-cluster` | A record. Value is `data.civo_loadbalancer.traefik_lb.public_ip`. |

Provider `cloudflare/cloudflare` `~> 4.0` (older than the other Cloudflare projects, which use `~> 5.0`). Auth is email + global API key (`TF_VAR_cloudflare_email`, `TF_VAR_cloudflare_api_key`), not an API token.

Missing pieces:

- No `kubernetes` or `civo` `required_providers` / provider blocks.
- `depends_on = [kubernetes_namespace.certmanager]` but that namespace is not in this directory.
- `data.civo_loadbalancer.traefik_lb` is not defined.

```
provider.tf    # cloudflare provider (email + api_key)
cloudflare.tf  # kubernetes secret + DNS record
variables.tf   # inputs
backend.tf     # backend "s3" {}
```

There is no `outputs.tf`. Terraform `required_version` is `>= 0.13.0`.

## Usage

Do not apply until the Civo load balancer data source and cert-manager namespace exist in this root module (or are composed from another stack). When that is fixed:

```bash
export TF_VAR_cloudflare_email="you@example.com"
export TF_VAR_cloudflare_api_key="..."
export TF_VAR_cloudflare_zone_id="..."
export TF_VAR_cloudflare_record_name="*.connectorsapp.com"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/cloudflare/dns/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md). Remote state: [BACKEND_S3.md](../../BACKEND_S3.md).

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `cloudflare_email` | yes | — | no | Account email. |
| `cloudflare_api_key` | yes | — | no (not marked) | Global API key. |
| `cloudflare_zone_id` | yes | — | no | Zone ID. |
| `cloudflare_record_name` | no | `*.connectorsapp.com` | no | Record name. |

## Outputs

None.

## Docs

- [cloudflare_record](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/record)
