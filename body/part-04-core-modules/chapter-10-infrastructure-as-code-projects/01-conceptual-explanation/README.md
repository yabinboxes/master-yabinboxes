# 1. Conceptual explanation

The Terraform projects live in `snow-monkeys-infra/iac-terraform`. A caller does not run those projects itself. A reusable workflow in `snow-monkeys-modules/<provider>-iac` clones that repository and applies one module.

`master-infra/list-of-resources.md` names the module folder and its type (`cluster, server`, `resource`, `service`, or `application`). `master-infra/iac-structure/FLOW.md` describes the shared checkout. The clone step is in each provider's `server-resource` action, for example `snow-monkeys-modules/hetzner-iac/.github/actions/server-resource/action.yml`.

## How a workflow selects a project

`main.yml` calls `server-resource` when `type` is not `docker_compose` and not `docker_compose_app`. `docker_compose` and `docker_compose_app` deploy with SSH and do not clone Terraform.

Inside `server-resource`:

1. If `resource` is empty, `resource` is set to `type`.
2. The action clones `github.com/snow-monkeys-infra/iac-terraform` with the `snow_github_token` secret.
3. It enters this directory:

```text
iac-terraform/v1/modules/dev/<provider>/<resource>
```

`<provider>` is the folder used by that module's action: `hetzner`, `aws`, `azure`, `cloudflare`, `digitalocean`, `gcp`, or `civo`. The GitHub repository that contains the action is `hetzner-iac`, `aws-iac`, `azure-iac`, `cloudflare-iac`, `digital-ocean-iac`, `gcp-iac`, or `civo-iac`.

4. `type_values`, `state_values`, and `env_values` are written to `.env` in that directory. Each `KEY=VALUE` line is exported as `TF_VAR_KEY`. Provider tokens are also set as `TF_VAR_*` from secrets.
5. If `s3_bucket_state` is empty, `backend.tf` is deleted, then `terraform init` and `terraform apply -auto-approve` run. Plan is skipped.
6. If `s3_bucket_state` is set, `state_values` must include `region` and `encrypt`. `terraform init -reconfigure` uses that bucket, then plan and apply run.
7. If `destroy` is `true`, `terraform destroy -auto-approve` runs twice and apply does not run.

Civo `type: kubernetes`, or an empty Civo `type`, does not use this clone. `civo-iac` runs `.github/actions/deploy-image` instead. There is no `v1/modules/dev/civo/kubernetes` directory.

Some directories exist in `iac-terraform` and are not a `type` name in `list-of-resources.md`: `cloudflare/dns`, `digitalocean/droplet`, `gcp/compute`, and `v1/k8s/civo-traefik`. A workflow reaches one of the module directories only when `resource` is that folder name.
