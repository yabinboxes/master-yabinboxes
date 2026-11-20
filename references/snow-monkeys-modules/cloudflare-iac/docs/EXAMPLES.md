# Examples

## Provisions all Cloudflare implementation:
1. Create a Cloudflare Pages project (RESOURCE).
2. Deploy a service (database, message broker, etc...).
3. Deploy an application.

---

## Prerequisites

Before using this module you need:

- A [Cloudflare](https://dash.cloudflare.com/) account
- A **Cloudflare API token** and **account ID** with permission to manage the Terraform resources — required for `type: cloudflare_pages_project`, `resource`, and other non-compose types
- An **SSH key pair** — both stored as GitHub Actions secrets
- A **Snow token** and **Snow GitHub token** for registering the deployment with Snow Monkeys

Add the following secrets to your GitHub repository (*Settings → Secrets and variables → Actions*):

| Secret | Required for | Description |
|---|---|---|
| `CLOUDFLARE_TOKEN` | terraform types | Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` | terraform types | Cloudflare account ID |
| `SSH_PUBLIC_KEY` | all types | Public SSH key installed on the host / used by Terraform |
| `SSH_PRIVATE_KEY` | all types | Private SSH key matching the public key |
| `SNOW_GITHUB_TOKEN` | all types | GitHub token used by Snow Monkeys to access the deployment repository |
| `SNOW_TOKEN` | all types | Snow Monkeys pipeline token |
| `ENV_VALUES` | all types (optional) | Newline-separated `KEY=VALUE` pairs written to `.env` on the remote host before deployment |

---

## Pages project

Provisions Cloudflare Pages via Terraform, then Wrangler uploads `$INFRA` (`iac-terraform/v1/modules/dev/cloudflare/$RESOURCE`).

Module vars are passed as `type_values`, not as dedicated workflow inputs.

```yaml
# .github/workflows/deploy.yml
name: Deploy pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      name: my-cluster
      provider: cloudflare
      snow_host_url: https://snow.internal
      s3_bucket_state: my-tf-state
      type_values: |
        account_id=abc123
        project_name=my-pages
      state_values: |
        region=us-east-1
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }}
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      name: my-cluster
      destroy: true
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }}
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
```

If `resource` is empty, `assign_resource` copies `type` so they match.

Optional remote state: set `s3_bucket_state` and pass `region` in `state_values`. The state key is `{name}/{git_type}/{actor_id}/{sha}`. `encrypt` is always `true`. Empty `s3_bucket_state` removes `backend.tf` and runs `terraform init`.

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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
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

All types accept `env_values` as a secret. Pass it as newline-separated `KEY=VALUE` pairs:

```
DATABASE_URL=postgres://user:pass@host:5432/db
API_KEY=abc123
PORT=3000
NODE_ENV=production
```

The values are written to `/tmp/.env` on the remote host before `init.sh` runs. `mkdir -p /tmp` creates that directory when it does not already exist.
