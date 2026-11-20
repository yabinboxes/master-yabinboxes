# iac-terraform

Terraform infrastructure for Snow — cloud modules and Kubernetes stacks under `v1/`.

## Docs

- [Project structure](docs/project-structure.md) — layout, conventions, and the full module index
- Each project under `v1/modules/dev/<provider>/<resource>/` has a `README_<RESOURCE>.md` (implementation and usage)
- [Terraform rules](v1/modules/dev/TERRAFORM_RULES.md) — `TF_VAR_*` inputs, layout, secrets
- [S3 remote state](v1/modules/dev/BACKEND_S3.md) — bucket bootstrap and `terraform init`
- [Hetzner hcloud_server](docs/modules/hetzner-hcloud-server.md) — extra overview and usage
- [Hetzner inputs](docs/modules/hetzner-hcloud-server/inputs.md) / [outputs](docs/modules/hetzner-hcloud-server/outputs.md)

## Layout (summary)

```
v1/
├── modules/dev/   # reusable modules by provider (civo, hetzner, gcp, …)
├── k8s/           # Kubernetes root stacks (e.g. civo-traefik)
└── not-in-use/    # archived configs
```

## Requirements

- Terraform `>= 1.3`
- Provider credentials via `TF_VAR_*` (not committed)
- Inputs: every variable is set with `TF_VAR_<name>` ([TERRAFORM_RULES.md](v1/modules/dev/TERRAFORM_RULES.md))
- Remote state: apply `v1/modules/dev/aws/aws_s3_bucket` first, then `terraform init` with `-backend-config` for `TF_STATE_BUCKET`, `TF_STATE_KEY_PREFIX`, `TF_STATE_REGION`, and `TF_STATE_ENCRYPT` ([BACKEND_S3.md](v1/modules/dev/BACKEND_S3.md))
