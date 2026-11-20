# Terraform rules

Rules for every project under `v1/modules/dev/<provider>/<resource>/`. Remote state is documented in [BACKEND_S3.md](BACKEND_S3.md).

## Variables

Every input is a `variable` in `variables.tf`. Terraform reads it from the environment variable `TF_VAR_<name>` (`variable "name"` ← `TF_VAR_name`).

```bash
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_name="dev-box"
export TF_VAR_ipv4_enabled=true
terraform apply
```

- Set the value with `TF_VAR_*` before `plan` or `apply`. Do not pass `-var` or `-var-file`, and do not commit `terraform.tfvars`. `*.tfvars` and `*.tfvars.json` are gitignored.
- Names are `snake_case` so they are valid env vars. `TF_VAR_civo-token` is not a valid shell variable; use `civo_token`.
- Each `description` says the value is set via `TF_VAR_<name>`.
- Secrets (tokens, access keys, private material) are `sensitive = true` and have no `default`.
- A non-secret variable may have a `default`. `TF_VAR_*` overrides that default. If the variable has no default and `TF_VAR_*` is unset, Terraform prompts or fails — do not rely on the prompt.
- Lists, maps, and objects are JSON in the env var: `export TF_VAR_tags='{"env":"dev"}'`.

Provider blocks take credentials from those variables (`access_key = var.aws_access_key_id`), not from literals in `.tf` files.

## Backend

`backend "s3" {}` stays empty. Bucket, key, region, and encrypt are `TF_STATE_*` values passed at `terraform init -backend-config`. Terraform cannot read variables or env vars inside a `backend` block.

The S3 backend authenticates with `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, not `TF_VAR_*`. When the same keys are also provider inputs, export both:

```bash
export TF_VAR_aws_access_key_id="..."
export TF_VAR_aws_secret_access_key="..."
export AWS_ACCESS_KEY_ID="$TF_VAR_aws_access_key_id"
export AWS_SECRET_ACCESS_KEY="$TF_VAR_aws_secret_access_key"
```

One state object per project. `TF_STATE_KEY_PREFIX` is `v1/modules/dev/<provider>/<resource>/terraform.tfstate`.

## Project layout

Each directory is its own root module:

- `variables.tf` — inputs
- `main.tf` or `<resource>.tf` — resources; provider block may live here or in `provider.tf`
- `outputs.tf` — values other workflows need (ids, addresses). Do not output secrets.
- `backend.tf` — empty `backend "s3" {}` plus the init comment from [BACKEND_S3.md](BACKEND_S3.md)
- `README_<RESOURCE>.md` — how the project is implemented (resources, files, provider) and how to use it (`TF_VAR_*` init/apply, inputs, outputs)

`required_version` is `>= 1.3`. Pin the provider with `required_providers`.

Do not commit `.terraform/`, `*.tfstate`, credentials, or `*.tfvars`.
