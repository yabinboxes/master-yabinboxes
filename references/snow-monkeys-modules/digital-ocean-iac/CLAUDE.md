# digital-ocean-iac — Claude Code instructions

This repository is a **reusable GitHub Actions workflow** for provisioning Digital Ocean droplets and deploying Docker Compose services and applications. It is consumed by other repositories via `workflow_call`.

External usage reference → [README.md](README.md)

---

## Repository structure

```
.github/
  workflows/
    main.yml                        # Reusable workflow — entry point for all callers
  actions/
    server-resource/action.yml      # Composite: provisions a Digital Ocean droplet/resource via Terraform
    docker-compose/action.yml       # Composite: deploys a Docker Compose service
    docker-compose-app/action.yml   # Composite: deploys a Docker Compose application
docs/
  EXAMPLES.md                       # Full workflow examples for all three deployment types
  FLOW.md                           # Step-by-step logic flow for main.yml
  INPUTS_OUTPUTS.md                 # Inputs, secrets, and outputs reference
  NAMING.md                         # String format conventions
README.md                           # External usage docs
```

---

## Naming conventions

| Layer | Convention | Examples |
|---|---|---|
| Workflow inputs, outputs, secrets | snake_case | `type_values`, `server_ip`, `git_type`, `snow_host_url`, `digitalocean_token` |
| Snow API query params and JSON bodies | camelCase | `snowName`, `actorId`, `gitType`, `healthCheckUrl` |
| `snow-iac` workflow inputs (external) | snake_case | `workflow_type`, `snow_host_url`, `actor_name` — same as this repo |
| Terraform env vars | snake_case (external) | `TF_VAR_server_type`, `server_ipv4` |

Full reference → [docs/NAMING.md](docs/NAMING.md)

Do not rename Terraform or SSH path conventions.

---

## Deployment types

| `type` | Action used | What it does |
|---|---|---|
| `digitalocean_droplet` | `actions/server-resource` | Provisions a Digital Ocean droplet via Terraform; reports `CLUSTER` to Snow |
| `digitalocean_droplet_autoscale` | `actions/server-resource` | Provisions droplet autoscale via Terraform; reports `CLUSTER` to Snow |
| `resource` | `actions/server-resource` | Same Terraform path; reports `RESOURCE` to Snow |
| other non-compose | `actions/server-resource` | Same as `resource` (empty `resource` → copies `type`) |
| `docker_compose` | `actions/docker-compose` | Deploys a Docker Compose service to an existing host |
| `docker_compose_app` | `actions/docker-compose-app` | Same as above + Docker cleanup and log rotation |

After deploy, `main.yml` calls `snow-monkeys-modules/snow-iac` to notify Snow (`CLUSTER` / `RESOURCE` / `SERVICE` / `APPLICATION`). When `health_url` is non-empty on `docker_compose_app`, `snow_livenessprobe_application` queues a liveness probe after notify.

---

## Key rules when editing this repo

- **Never use `docker system prune -af --volumes`** — `-a` removes tagged images needed by running services; `--volumes` destroys persistent data. Use `docker system prune -f` only.
- **Never interpolate `${{ inputs.* }}` or `${{ secrets.* }}` inline inside `run:` blocks** — always move them into `env:` vars at the step level to prevent expression injection.
- **`host` resolution lives in `get_resource_name`** — empty → skip, IP → pass through, name → Snow API with Bearer `snow_token` (`snowName`, `actorId` from `github.actor_id`, `gitType` query params). Do not duplicate elsewhere.
- **`actor_name` and `actor_id` for Snow notify/liveness** come from `github.actor` and `github.actor_id`; do not add caller inputs for them.
- **Bare IP `snow_host_url` values** get `https://` prepended in `get_resource_name` before the API call.
- **`http://` / `https://` prefixes on `host`** are stripped in composite actions (`remove_http_https` step) before SSH.
- **`expected_url` resolution lives in `assign_host_to_expected_url`** — IP host part → unchanged, name host part → replace with resolved host, keep port.
- **Empty `resource` is filled in `assign_resource`** — copies `inputs.type` so they match. Workflow inputs cannot be mutated; use the step output.
- Each deployment type runs in a single job (`implement_digital_ocean_types`). Only one action step runs per call — the `||` on job outputs is intentional.
- **Terraform lives in `iac-terraform/v1/modules/dev/digitalocean/$RESOURCE`**. Destroy and apply must use `$RESOURCE`, not a hardcoded `server` path.
- **When calling `snow-iac`**, use snake_case inputs matching that repo (`workflow_type`, `snow_host_url`, `actor_name`, etc.) and forward `snow_token` via job `secrets:` (not `with:`).

---

## Workflow outputs

Callers receive these outputs from `main.yml`:

| Output | Set when |
|---|---|
| `server_ip` | `type: digitalocean_droplet` or `resource` |
| `terraform_vars` | `type: digitalocean_droplet`, `resource`, or other non-compose |
| `address` | `type: docker_compose` or `docker_compose_app` |
| `container_name` | `type: docker_compose` or `docker_compose_app` |
| `docker_output` | `type: docker_compose` or `docker_compose_app` |
| `docker_vars` | `type: docker_compose` or `docker_compose_app` |

---

## Minimal caller template

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app       # digitalocean_droplet | resource | docker_compose | docker_compose_app
      name: my-service               # Snow resource name
      host: my-server                # IP, hostname, or Snow service name
      snow_host_url: https://snow.internal
      git_type: github
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

For server provisioning, pass module fields in `type_values` and the DigitalOcean token as a secret. `digitalocean_token` and `ssh_public_key` are the only values set directly as `TF_VAR_*`.

```yaml
    with:
      type: digitalocean_droplet
      type_values: |
        name=my-cluster
        server_type=s-2vcpu-4gb      # s-1vcpu-1gb s-2vcpu-2gb s-2vcpu-4gb s-4vcpu-8gb | g-2vcpu-8gb | c-2
        image=ubuntu-22-04-x64       # ubuntu-22-04-x64 ubuntu-24-04-x64 | debian-12-x64
        location=nyc1                # nyc1 nyc3 sfo3 ams3 sgp1 lon1 fra1 tor1 blr1 syd1
    secrets:
      digitalocean_token: ${{ secrets.DIGITALOCEAN_TOKEN }}
```

Optional on `docker_compose_app`:

```yaml
      health_url: https://my-app/health
      expected_url: my-service:3000  # hostname replaced with resolved host; port kept
```

---

## Caller repo requirements

For `docker_compose` and `docker_compose_app`, the calling repository must have:

```
infra/
  init.sh    # runs on the remote host; must print the container name to stdout
```

`infra/` is copied to `/tmp/` on the remote before `init.sh` runs. `mkdir -p /tmp` creates that directory when it does not already exist.

---

## Documentation

- Full examples → [docs/EXAMPLES.md](docs/EXAMPLES.md)
- Workflow logic flow → [docs/FLOW.md](docs/FLOW.md)
- Inputs, secrets, outputs → [docs/INPUTS_OUTPUTS.md](docs/INPUTS_OUTPUTS.md)
- Naming conventions → [docs/NAMING.md](docs/NAMING.md)
- External usage reference → [README.md](README.md)
