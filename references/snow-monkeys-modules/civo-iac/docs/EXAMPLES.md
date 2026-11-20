# Examples

## Provisions all Civo implementation:
1. Deploy a Kubernetes application (empty `type` or `type: kubernetes`).
2. Provision Terraform (`compute` CLUSTER, `bucket` / `observability` RESOURCE).
3. Deploy a compose service or application.

---

## Prerequisites

Before using this module you need:

- A [Civo](https://www.civo.com/) account
- A **Civo API token** — `CIVO_TOKEN` for Terraform (`civo_token`) and Kubernetes (`civo-token`)
- An **SSH key pair** — both stored as GitHub Actions secrets (Terraform compute and compose)
- A **Snow token** and **Snow GitHub token** for registering the deployment with Snow Monkeys

Add the following secrets to your GitHub repository (*Settings → Secrets and variables → Actions*):

| Secret | Required for | Description |
|---|---|---|
| `CIVO_TOKEN` | terraform types / Kubernetes | Civo API token |
| `AWS_ACCESS_KEY_ID` | when `s3_bucket_state` is set | AWS access key for the S3 Terraform backend |
| `AWS_SECRET_ACCESS_KEY` | when `s3_bucket_state` is set | AWS secret key for the S3 Terraform backend |
| `SSH_PUBLIC_KEY` | terraform compute / compose | Public SSH key installed on the host / used by Terraform |
| `SSH_PRIVATE_KEY` | terraform compute / compose | Private SSH key matching the public key |
| `SNOW_GITHUB_TOKEN` | all types | GitHub token used by Snow Monkeys to access the deployment repository |
| `SNOW_TOKEN` | all types | Snow Monkeys pipeline token |
| `ENV_VALUES` | terraform / compose (optional) | Newline-separated `KEY=VALUE` pairs written to `.env` |

---

## Kubernetes

Empty `type` or `type: kubernetes` deploys a container image into Civo Kubernetes. Secrets stay kebab-case.

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
    with:
      provider: civo
      name: my-app
      url: localhost
      url-path: /
      port: 80
      image: ghcr.io/example/my-app
      image-tag: latest
      replicas: 1
    secrets:
      civo-token: ${{ secrets.CIVO_TOKEN }}
      snow-github-token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow-token: ${{ secrets.SNOW_TOKEN }}
      snow-token-pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

---

## Compute

Provisions a Civo instance via Terraform (`iac-terraform/v1/modules/dev/civo/compute`) and bootstraps it with `infra/init.sh`.

Size and region go in `type_values`, not as dedicated workflow inputs.

```yaml
# .github/workflows/deploy.yml
name: Deploy server

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
    with:
      type: compute
      name: my-cluster
      provider: civo
      snow_host_url: https://snow.internal
      s3_bucket_state: my-tf-state
      type_values: |
        size=g4s.kube.small
        region=LON1
      state_values: |
        region=us-east-1
        encrypt=true
    secrets:
      civo_token: ${{ secrets.CIVO_TOKEN }}
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
    with:
      type: compute
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
    with:
      type: compute
      name: my-cluster
      destroy: true
    secrets:
      civo_token: ${{ secrets.CIVO_TOKEN }}
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
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
    uses: snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main
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
