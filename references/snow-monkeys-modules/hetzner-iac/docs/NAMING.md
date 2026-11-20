# Naming conventions

This document defines the string formats used across **hetzner-iac** and related Snow integrations. Different layers use different conventions on purpose — match the layer you are editing, not a single global style.

---

## Format reference

| Format | Pattern | Example |
|---|---|---|
| **snake_case** | lowercase words joined with `_` | `type_values`, `health_url` |
| **kebab-case** | lowercase words joined with `-` | `docker-compose`, `ubuntu-22.04` |
| **camelCase** | first word lowercase, rest capitalized | `snowName`, `actorId` |
| **SCREAMING_SNAKE_CASE** | uppercase words joined with `_` | `SNOW_HOST_URL`, `GIT_TYPE` |
| **UPPERCASE** | single token, all caps | `CLUSTER`, `SERVICE`, `APPLICATION` |
| **lowercase** | single word, no separators | `hel1`, `cx23` |

---

## Convention by layer

| Layer | Convention | Examples |
|---|---|---|
| Workflow inputs, outputs, secrets | snake_case | `snow_host_url`, `server_ip`, `s3_bucket_state`, `state_values` |
| Job IDs and step IDs | snake_case | `implement_hetzner_types`, `get_resource_name` |
| Deployment type values (`inputs.type`) | snake_case | `hcloud_server`, `resource`, `docker_compose`, `docker_compose_app` |
| Composite action **directory paths** | kebab-case | `.github/actions/docker-compose/` |
| Shell `env:` variables in `run:` steps | SCREAMING_SNAKE_CASE | `HOST`, `SNOW_HOST_URL`, `ACTOR_ID` |
| Snow API query parameters | camelCase | `snowName`, `actorId`, `gitType` |
| Snow API JSON request bodies | camelCase | `healthUrl`, `snowHostUrl`, `healthCheckUrl` |
| Snow resource types (notify payload) | UPPERCASE | `CLUSTER`, `RESOURCE`, `SERVICE`, `APPLICATION` |
| `snow-iac` workflow inputs | snake_case | `workflow_type`, `actor_name`, `health_url` |
| Hetzner / OS image defaults | provider-specific (often kebab-case) | `ubuntu-22.04`, `debian-12` |
| Hetzner server/location codes | lowercase | `cx23`, `hel1`, `fsn1` |

---

## Rules of thumb

### Use snake_case for anything callers pass in YAML

Workflow inputs, outputs, secrets, job IDs, step IDs, and deployment type strings should all be snake_case. Callers of this reusable workflow should never need kebab-case keys.

```yaml
with:
  type: docker_compose_app
  snow_host_url: https://snow.internal
  health_url: https://my-app/health
secrets:
  ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
  snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
```

### Use camelCase only at the Snow API boundary

When building query strings or JSON bodies for Snow connectors, convert to camelCase. Do not expose camelCase as workflow input names in this repo.

```bash
# Query params
.../get-snow-url?snowName=$HOST&actorId=$ACTOR_ID&gitType=$GIT_TYPE

# JSON body
{ "healthUrl": "...", "snowHostUrl": "...", "snowName": "...", "actorId": "...", "gitType": "..." }
```

### Use kebab-case for filesystem paths, not workflow keys

Action folders live under `.github/actions/` and use kebab-case because that is the existing directory layout and GitHub `uses:` path:

```yaml
uses: snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose@main
uses: snow-monkeys-modules/hetzner-iac/.github/actions/docker-compose-app@main
uses: snow-monkeys-modules/hetzner-iac/.github/actions/server-resource@main
```

The **`type` value** passed by callers is still snake_case (`docker_compose`), even though the action path is kebab-case (`docker-compose`).

### Use SCREAMING_SNAKE_CASE inside shell steps

Never interpolate `${{ inputs.* }}` or `${{ secrets.* }}` directly inside `run:` blocks. Map them to step-level `env:` vars first:

```yaml
env:
  HOST: ${{ inputs.host }}
  SNOW_HOST_URL: ${{ inputs.snow_host_url }}
  ACTOR_ID: ${{ github.actor_id }}
  GIT_TYPE: ${{ inputs.git_type }}
  SNOW_TOKEN: ${{ secrets.snow_token }}
run: |
  curl -H "Authorization: Bearer $SNOW_TOKEN" "...?snowName=$HOST&actorId=$ACTOR_ID&gitType=$GIT_TYPE"
```

### Do not rename external conventions

Leave these as their upstream format:

| Source | Keep as |
|---|---|
| Terraform variables / outputs | snake_case (`TF_VAR_server_type`, `server_ipv4`) |
| Terraform S3 backend env | SCREAMING_SNAKE_CASE (`TF_STATE_BUCKET`, `TF_STATE_KEY_PREFIX`, `AWS_ACCESS_KEY_ID`, `AWS_REGION`) |
| GitHub context | dotted lowercase (`github.actor`, `github.actor_id`) |
| Hetzner image slugs | kebab-case (`ubuntu-22.04`) |
| GitHub Actions keywords | hyphenated YAML keys (`runs-on`, `continue-on-error`) |

---

## Deployment types

| `type` value | Action path | Snow notify job | Snow `type` |
|---|---|---|---|
| `hcloud_server` | `actions/server-resource` | `snow_notify_server` | `CLUSTER` |
| `resource` or other non-compose | `actions/server-resource` | `snow_notify_resource` | `RESOURCE` |
| `docker_compose` | `actions/docker-compose` | `snow_notify_service` | `SERVICE` |
| `docker_compose_app` | `actions/docker-compose-app` | `snow_notify_application` | `APPLICATION` |

Only one deployment action runs per workflow call. Job output merging (`||` between step outputs) relies on this. When `health_url` is set on `docker_compose_app`, `snow_livenessprobe_application` runs after notify.

---

## Common mistakes

| Wrong | Right | Why |
|---|---|---|
| `snow-host-url` | `snow_host_url` | Workflow inputs are snake_case |
| `docker-compose-app` as `type` | `docker_compose_app` | Type values are snake_case |
| `snow_name` in Snow API query | `snowName` | Snow API uses camelCase |
| `${{ inputs.host }}` inside `run:` | `HOST: ${{ inputs.host }}` in `env:` | Prevents expression injection |
| `snow_token` in `with:` when calling `snow-iac` | `secrets: snow_token:` on the job | Reusable workflows require secrets via `secrets:` |
| Renaming `actions/docker-compose/` to snake_case | Keep kebab-case path | Breaks `uses:` references for all callers |

---

## Related docs

- [README.md](../README.md) — external usage reference
- [INPUTS_OUTPUTS.md](INPUTS_OUTPUTS.md) — inputs, secrets, and outputs reference
- [FLOW.md](FLOW.md) — step-by-step logic flow for `main.yml`
- [EXAMPLES.md](EXAMPLES.md) — full caller workflow examples
- [CLAUDE.md](../CLAUDE.md) — maintainer rules and repository structure
