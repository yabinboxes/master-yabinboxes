# Examples

## Provisions all Digital Ocean implementation: 
1. Create a CLUSTER (`type: digitalocean_droplet`).
2. Deploy a service (database, message broker, etc...).
3. Deploy an application. 

---

## Prerequisites

Before using this module you need:

- A [DigitalOcean](https://www.digitalocean.com/) account
- A **Digital Ocean API token** with write permission — required for `type: digitalocean_droplet`, `resource`, and other non-compose types (create under *API → Tokens* in the DigitalOcean control panel)
- An **SSH key pair** — both stored as GitHub Actions secrets
- A **Snow token** and **Snow GitHub token** for registering the deployment with Snow Monkeys

Add the following secrets to your GitHub repository (*Settings → Secrets and variables → Actions*):

| Secret | Required for | Description |
|---|---|---|
| `DIGITALOCEAN_TOKEN` | terraform types | Digital Ocean API token |
| `AWS_ACCESS_KEY_ID` | when `s3_bucket_state` is set | AWS access key for the S3 Terraform backend |
| `AWS_SECRET_ACCESS_KEY` | when `s3_bucket_state` is set | AWS secret key for the S3 Terraform backend |
| `SSH_PUBLIC_KEY` | all types | Public SSH key installed on the droplet / used by Terraform |
| `SSH_PRIVATE_KEY` | all types | Private SSH key matching the public key |
| `SNOW_GITHUB_TOKEN` | all types | GitHub token used by Snow Monkeys to access the deployment repository |
| `SNOW_TOKEN` | all types | Snow Monkeys pipeline token |
| `ENV_VALUES` | all types (optional) | Newline-separated `KEY=VALUE` pairs written to `.env` on the remote host before deployment |

---

## Server

Provisions a new Digital Ocean droplet via Terraform and bootstraps it with `infra/init.sh`.

### Available sizes (`server_type`)

> Full specs and pricing at [docs.digitalocean.com/products/droplets](https://docs.digitalocean.com/products/droplets/)

| Series | Examples | Notes |
|---|---|---|
| Basic shared | `s-1vcpu-1gb` `s-1vcpu-2gb` `s-2vcpu-2gb` `s-2vcpu-4gb` `s-4vcpu-8gb` | General-purpose droplets |
| General purpose | `g-2vcpu-8gb` `g-4vcpu-16gb` | Dedicated vCPU |
| CPU-optimized | `c-2` `c-4` `c-8` | Compute-heavy workloads |
| Memory-optimized | `m-2vcpu-16gb` `m-4vcpu-32gb` | Memory-heavy workloads |

### Available images

| Image | Slugs |
|---|---|
| Ubuntu | `ubuntu-22-04-x64` `ubuntu-24-04-x64` |
| Debian | `debian-11-x64` `debian-12-x64` |
| Fedora | `fedora-40-x64` `fedora-41-x64` |
| Rocky Linux | `rockylinux-8-x64` `rockylinux-9-x64` |

### Available regions (`location`)

| Code | City | Country |
|---|---|---|
| `nyc1` `nyc3` | New York | USA |
| `sfo2` `sfo3` | San Francisco | USA |
| `ams3` | Amsterdam | Netherlands |
| `sgp1` | Singapore | Singapore |
| `lon1` | London | UK |
| `fra1` | Frankfurt | Germany |
| `tor1` | Toronto | Canada |
| `blr1` | Bangalore | India |
| `syd1` | Sydney | Australia |

```yaml
# .github/workflows/deploy.yml
name: Deploy server

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: digitalocean_droplet
      name: my-cluster
      snow_host_url: https://snow.internal
      s3_bucket_state: my-tf-state
      type_values: |
        name=my-cluster
        server_type=s-2vcpu-4gb
        image=ubuntu-22-04-x64
        location=nyc1
      state_values: |
        region=us-east-1
    secrets:
      digitalocean_token: ${{ secrets.DIGITALOCEAN_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

**Use the server IP in a later job:**

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: digitalocean_droplet
      name: my-cluster
    secrets: ...

  post-deploy:
    needs: deploy
    runs-on: ubuntu-22.04
    steps:
      - run: echo "Server is at ${{ needs.deploy.outputs.server_ip }}"
```

**Destroy the server:**

```yaml
jobs:
  destroy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: digitalocean_droplet
      name: my-cluster
      destroy: true
    secrets:
      digitalocean_token: ${{ secrets.DIGITALOCEAN_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
```

If `resource` is empty, `assign_resource` copies `type` so they match.

Optional remote state: set `s3_bucket_state`, pass `region` in `state_values`, and pass the AWS key secrets. The state key is `{name}/{git_type}/{actor_id}/{sha}`. `encrypt` is always `true`. Empty `s3_bucket_state` removes `backend.tf` and runs `terraform init`.

---

## Docker Compose — service

Deploys a Docker Compose service to an already-running host. The host can be passed as an IP, a hostname, or a Snow service name.

**Host as a direct IP:**

```yaml
# .github/workflows/deploy.yml
name: Deploy service

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: my-service
      host: 1.2.3.4
      snow_host_url: https://snow.internal
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

**Host as a Snow service name** (resolved to IP via Snow API before deployment):

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: my-service
      host: my-service-name
      snow_host_url: https://snow.internal
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

**With `expected_url`** — used when the host sits behind a proxy and the public URL differs from the SSH target:

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: my-service
      host: my-service-name
      snow_host_url: https://snow.internal
      expected_url: my-service-name:8080   # hostname replaced with resolved host automatically
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

---

## Docker Compose — application

Same as `docker_compose` but also cleans Docker space and rotates logs on the remote host before deploying. Use this type for long-running application servers.

**Host as a direct IP:**

```yaml
# .github/workflows/deploy.yml
name: Deploy application

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-app
      host: 1.2.3.4
      snow_host_url: https://snow.internal
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

**Host as a Snow service name:**

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-app
      host: my-app-server
      snow_host_url: https://snow.internal
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

**With `expected_url` containing a hostname** (hostname is replaced with the resolved host, port is kept):

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-app
      host: my-app-server
      snow_host_url: https://snow.internal
      expected_url: my-app-server:3000
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

**With `expected_url` containing an IP** (left unchanged — no substitution):

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-app
      host: 1.2.3.4
      snow_host_url: https://snow.internal
      expected_url: 1.2.3.4:3000
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

**Using the container name output in a later job:**

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-app
      host: my-app-server
      snow_host_url: https://snow.internal
    secrets: ...

  post-deploy:
    needs: deploy
    runs-on: ubuntu-22.04
    steps:
      - run: |
          echo "Host address: ${{ needs.deploy.outputs.address }}"
          echo "Running container: ${{ needs.deploy.outputs.container_name }}"
```

---

## `env_values` format

All three types accept `env_values` as a secret. Pass it as newline-separated `KEY=VALUE` pairs:

```
DATABASE_URL=postgres://user:pass@host:5432/db
API_KEY=abc123
PORT=3000
NODE_ENV=production
```

The values are written to `/tmp/.env` on the remote host before `init.sh` runs. `mkdir -p /tmp` creates that directory when it does not already exist.
