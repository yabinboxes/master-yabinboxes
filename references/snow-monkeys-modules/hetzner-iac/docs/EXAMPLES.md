# Examples

## Provisions all Hetzners implementation: 
1. Create a CLUSTER (`type: hcloud_server`).
2. Deploy a service (database, message broker, etc...).
3. Deploy an application. 

---

## Prerequisites

Before using this module you need:

- A [Hetzner Cloud](https://www.hetzner.com/cloud) account and project
- A **Hetzner API token** with read/write permissions — required for terraform types (create under *Security → API Tokens* in the Hetzner Cloud Console)
- An **SSH key pair** — the public key added to your Hetzner project (*Security → SSH Keys*), both stored as GitHub Actions secrets
- A **Snow token** and **Snow GitHub token** for registering the deployment with Snow Monkeys

Add the following secrets to your GitHub repository (*Settings → Secrets and variables → Actions*):

| Secret | Required for | Description |
|---|---|---|
| `HCLOUD_TOKEN` | terraform types | Hetzner Cloud API token |
| `SSH_PUBLIC_KEY` | all types | Public SSH key added to your Hetzner project |
| `SSH_PRIVATE_KEY` | all types | Private SSH key matching the key added to your Hetzner project |
| `SNOW_GITHUB_TOKEN` | all types | GitHub token used by Snow Monkeys to access the deployment repository |
| `SNOW_TOKEN` | all types | Snow Monkeys pipeline token |
| `ENV_VALUES` | all types (optional) | Newline-separated `KEY=VALUE` pairs written to `.env` on the remote host before deployment |

---

## Server

Provisions a new Hetzner Cloud server via Terraform and bootstraps it with `infra/init.sh`.

### Available server types

> Full specs and pricing at [hetzner.com/cloud](https://www.hetzner.com/cloud/)

| Series | Type | Resources | Notes |
|---|---|---|---|
| Shared Intel | `cx22` `cx32` `cx42` `cx52` | 2–16 vCPU / 4–32 GB RAM | General-purpose, cost-effective |
| Shared AMD | `cpx11` `cpx21` `cpx31` `cpx41` `cpx51` | 2–16 vCPU / 2–32 GB RAM | Cost-optimised |
| Dedicated AMD | `ccx13` `ccx23` `ccx33` `ccx43` `ccx53` `ccx63` | 2–32 vCPU / 8–128 GB RAM | Constant high CPU workloads |
| Arm64 (Ampere) | `cax11` `cax21` `cax31` `cax41` | 2–16 vCPU / 4–32 GB RAM | Best price/performance ratio |

### Available images

| Image | Versions |
|---|---|
| Ubuntu | `ubuntu-20.04` `ubuntu-22.04` `ubuntu-24.04` |
| Debian | `debian-11` `debian-12` |
| Fedora | `fedora-40` `fedora-41` |
| Rocky Linux | `rocky-8` `rocky-9` |
| AlmaLinux | `almalinux-8` `almalinux-9` |
| CentOS | `centos-stream-9` |

### Available locations

| Code | City | Country | Network zone |
|---|---|---|---|
| `fsn1` | Falkenstein | Germany | eu-central |
| `nbg1` | Nuremberg | Germany | eu-central |
| `hel1` | Helsinki | Finland | eu-central |
| `ash` | Ashburn, VA | USA | us-east |
| `hil` | Hillsboro, OR | USA | us-west |
| `sin` | Singapore | Singapore | ap-southeast |

```yaml
# .github/workflows/deploy.yml
name: Deploy server

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: my-cluster
      snow_host_url: https://snow.internal
      s3_bucket_state: my-tf-state
      type_values: |
        name=my-cluster
        server_type=cx23
        image=ubuntu-22.04
        location=hel1
      state_values: |
        region=us-east-1
    secrets:
      hcloud_token: ${{ secrets.HCLOUD_TOKEN }}
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: my-cluster
      destroy: true
    secrets:
      hcloud_token: ${{ secrets.HCLOUD_TOKEN }}
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
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
