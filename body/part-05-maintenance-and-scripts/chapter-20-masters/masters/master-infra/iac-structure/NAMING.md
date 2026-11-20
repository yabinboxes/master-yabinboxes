# Naming conventions

String formats used across `*-iac` workflows, **iac-terraform** modules (any provider), and Snow integrations. Different layers use different conventions on purpose — match the layer you are editing, not a single global style.

---

## Format reference

| Format | Pattern | Example |
|---|---|---|
| **snake_case** | lowercase words joined with `_` | `server_type`, `health_url`, `hcloud_token` |
| **kebab-case** | lowercase words joined with `-` | `docker-compose`, `ubuntu-24.04` |
| **camelCase** | first word lowercase, rest capitalized | `snowName`, `actorId` |
| **SCREAMING_SNAKE_CASE** | uppercase words joined with `_` | `SNOW_HOST_URL`, `TF_VAR_server_type` |
| **UPPERCASE** | single token, all caps | `CLUSTER`, `SERVICE`, `APPLICATION` |
| **lowercase** | single word, no separators | `server`, `hetzner`, `aws` |

---

## Convention by layer

| Layer | Convention | Examples |
|---|---|---|
| Workflow inputs, outputs, secrets | snake_case | `snow_host_url`, `server_ip`, `resource_id`, `env_values` |
| Job IDs and step IDs | snake_case | `implement_types`, `get_resource_name` |
| Deployment type values (`inputs.type`) | snake_case | `server`, `resource`, `docker_compose`, `docker_compose_app` |
| Provider values (`inputs.provider`) | lowercase | `hetzner`, `aws`, `cloudflare`, `civo`, `gcp`, `digitalocean` |
| Resource folder (`inputs.resource`) | lowercase or Terraform slug | `hcloud_server`, `hcloud_firewall`, `dns`, `aws_s3_bucket` |
| Composite action **directory paths** | kebab-case | `.github/actions/docker-compose/` |
| Terraform variables / outputs | snake_case | `hcloud_token`, `ssh_public_key`, `server_ipv4` |
| Terraform env overrides | `TF_VAR_` + snake_case | `TF_VAR_hcloud_token`, `TF_VAR_image` |
| Terraform module folders | `v1/modules/<env>/<provider>/<resource>/` | `v1/modules/dev/hetzner/hcloud_server` |
| Terraform resource addresses | provider prefix + local name | `hcloud_server.cx23`, `aws_s3_bucket.this`, `cloudflare_record.x` |
| Shell `env:` variables in `run:` steps | SCREAMING_SNAKE_CASE | `HOST`, `SNOW_HOST_URL`, `PROVIDER` |
| Snow API query parameters | camelCase | `snowName`, `actorId`, `gitType` |
| Snow API JSON request bodies | camelCase | `healthUrl`, `snowHostUrl`, `healthCheckUrl` |
| Snow resource types (notify payload) | UPPERCASE | `CLUSTER`, `SERVICE`, `APPLICATION` |
| `snow-iac` workflow inputs | snake_case | `workflow_type`, `actor_name`, `health_url` |
| Cloud image / SKU slugs | provider-specific | `ubuntu-24.04`, `cx23`, `s-1vcpu-1gb`, `n1-standard-1` |

---

## Rules of thumb

### Use snake_case for anything callers pass in YAML

Workflow inputs, outputs, secrets, job IDs, step IDs, and deployment type strings should all be snake_case. Callers should never need kebab-case keys.

```yaml
with:
  provider: hetzner
  type: docker_compose_app
  resource: hcloud_server
  snow_host_url: https://snow.internal
  health_url: https://my-app/health
secrets:
  ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
  snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
```

`provider` and `resource` are lowercase folder names, not kebab-case (`digitalocean`, not `digital-ocean`).

### Use camelCase only at the Snow API boundary

```bash
.../get-snow-url?snowName=$HOST&actorId=$ACTOR_ID&gitType=$GIT_TYPE
```

### Use kebab-case for filesystem action paths, not workflow keys

```yaml
uses: snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose@main
```

The **`type` value** is still snake_case (`docker_compose`), even though the action path is kebab-case (`docker-compose`).

Workflow repos are `snow-monkeys-modules/<provider>-iac` (kebab around `iac`). The `<provider>` token matches `inputs.provider`.

### Use SCREAMING_SNAKE_CASE inside shell steps

Never interpolate `${{ inputs.* }}` or `${{ secrets.* }}` directly inside `run:` blocks.

```yaml
env:
  PROVIDER: ${{ inputs.provider }}
  HOST: ${{ inputs.host }}
  SNOW_HOST_URL: ${{ inputs.snow_host_url }}
  SNOW_TOKEN: ${{ secrets.snow_token }}
```

Terraform variables use the same values via `TF_VAR_*`:

```bash
export TF_VAR_hcloud_token="..."          # hetzner
export TF_VAR_digitalocean_token="..."    # digitalocean
export TF_VAR_cloudflare_api_key="..."    # cloudflare
```

### Do not rename external conventions

| Source | Keep as |
|---|---|
| Terraform variables / outputs | snake_case (`TF_VAR_server_type`, `server_ipv4`) |
| GitHub context | dotted lowercase (`github.actor`, `github.actor_id`) |
| Provider image / SKU slugs | whatever the vendor uses (`ubuntu-24.04`, `ubuntu-22-04-x64`) |
| GitHub Actions keywords | hyphenated YAML keys (`runs-on`, `continue-on-error`) |
| iac-terraform module paths | `v1/modules/<env>/<provider>/<resource>/` |

---

## Deployment types

| `type` value | Action path | Terraform module | Snow notify job | Snow `type` |
|---|---|---|---|---|
| `server` | `.github/actions/server` | `v1/modules/dev/<provider>/<resource>` | `snow_notify_server_or_resource` | `CLUSTER` |
| `resource` | `.github/actions/server` | `v1/modules/dev/<provider>/<resource>` | `snow_notify_server_or_resource` | `CLUSTER` |
| `docker_compose` | `.github/actions/docker-compose` | — | `snow_notify_service` | `SERVICE` |
| `docker_compose_app` | `.github/actions/docker-compose-app` | — | `snow_notify_application` | `APPLICATION` |

Four `type` values, three actions. `server` and `resource` share the Terraform action. Compose types do not use `iac-terraform`.

Workflow `server_ip` is the module’s public address output. Workflow `resource_id` is the module’s primary id output.

---

## Common mistakes

| Wrong | Right | Why |
|---|---|---|
| `snow-host-url` | `snow_host_url` | Workflow inputs are snake_case |
| `docker-compose-app` as `type` | `docker_compose_app` | Type values are snake_case |
| `digital-ocean` as `provider` | `digitalocean` | Provider is the module folder name |
| `snow_name` in Snow API query | `snowName` | Snow API uses camelCase |
| `${{ inputs.host }}` inside `run:` | `HOST: ${{ inputs.host }}` in `env:` | Prevents expression injection |
| `snow_token` in `with:` when calling `snow-iac` | `secrets: snow_token:` on the job | Reusable workflows require secrets via `secrets:` |
| Hard-coding `v1/modules/dev/hetzner/hcloud_server` for every type | Resolve from `provider` + `resource` | Same workflow contract for all clouds |
| Clone `snow-monkeys-modules/iac-terraform` | `snow-monkeys-infra/iac-terraform` | Terraform lives in seal 0 |
| Workflow output `server_ipv4` / `firewall_id` | `server_ip` / `resource_id` | Callers see the generic names |
| Job id `implement_hetzner_types` on a new workflow | `implement_types` | Keep Job 1 generic |

---

## Related docs

- [FLOW.md](FLOW.md) — step-by-step logic flow
- [EXAMPLES.md](EXAMPLES.md) — caller workflow and local Terraform examples
- [INTERNAL.md](INTERNAL.md) — implementation details and module layout
- [INPUTS_OUTPUTS.md](INPUTS_OUTPUTS.md) — workflow and Terraform inputs/outputs
- [TERRAFORM_COMPLIANCE.md](TERRAFORM_COMPLIANCE.md) — checkout vs this spec
