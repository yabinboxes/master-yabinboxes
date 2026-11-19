# Docker (Listings 10.11–10.16)

> Status: written. Runnable Docker IaC module. Caller contract is Listings 10.1–10.5.

`docker-iac` is the image pipeline. It does not provision VMs. Callers `uses: snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main` with `type: build_and_push_image`, then a provider module (`hetzner-iac`, `aws-iac`, …) deploys the image with `docker_compose` or `docker_compose_app`.

How to shape `uses` / `with` / `secrets` is Listings 10.1–10.5. This folder is the Docker-specific runnable module.

## Requirements

```txt
# requirements.txt
# gh>=2
# docker>=24
#
# Reusable workflow:
#   snow-monkeys-modules/docker-iac/.github/workflows/main.yml
```

See [requirements.txt](./requirements.txt).

| Secret | Maps to workflow secret | Used for |
| --- | --- | --- |
| `REGISTRY_USER` | `registry_user` | Registry login, or AWS access key for ECR |
| `REGISTRY_TOKEN` | `registry_token` | Registry password, AWS secret key, or GCP service-account JSON |
| `SNOW_TOKEN` | `snow_token` | Snow API Bearer token |

| Input | Default | Meaning |
| --- | --- | --- |
| `type` | `build_and_push_image` | Only Docker type |
| `registry` | `docker.io` | `ghcr.io`, `*.azurecr.io`, ECR, GCR, Artifact Registry |
| `name` | empty | Image name without tag |
| `tag` | `latest` | Image tag |
| `platforms` | `linux/amd64,linux/arm64,linux/arm64/v8` | Buildx platforms |
| `docker_file` | `Dockerfile` | Filename inside the build context |
| `infra` | empty | Build context directory; empty is repo root |
| `test_container` | `false` | Build a local image and `docker run` it |

The called workflow exposes `container_name`.

## Listing 10.11 — `listing_10_11_build_and_push.yml`

Minimal image build. Copy to `.github/workflows/` in a repository that has `Dockerfile` at the root (Listing 10.12).

```yaml
name: Build and push image

on:
  workflow_dispatch:

jobs:
  build_and_push:
    uses: snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main
    with:
      type: build_and_push_image
      registry: ghcr.io
      name: snow-monkeys/growing-gravity
      tag: latest
      platforms: linux/amd64,linux/arm64
      docker_file: Dockerfile
      infra: .
    secrets:
      registry_user: ${{ secrets.REGISTRY_USER }}
      registry_token: ${{ secrets.REGISTRY_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}

  print_container_name:
    needs: build_and_push
    runs-on: ubuntu-22.04
    steps:
      - name: Image name from reusable workflow
        run: echo "${{ needs.build_and_push.outputs.container_name }}"
```

```text
Output
ghcr.io/snow-monkeys/growing-gravity:latest
```

**Try it yourself:** set `registry: docker.io` and `name: your-dockerhub-user/growing-gravity`. Keep `REGISTRY_USER` / `REGISTRY_TOKEN` as Docker Hub credentials.

## Listing 10.12 — `listing_10_12_dockerfile` (saved as `Dockerfile`)

```dockerfile
FROM nginx:1.28-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

The runnable copy in this folder is [Dockerfile](./Dockerfile).

## Listing 10.13 — `listing_10_13_default_conf` (saved as `default.conf`)

```nginx
server {
    listen 80;
    location / {
        return 200 'growing-gravity\n';
        add_header Content-Type text/plain;
    }
}
```

```text
Output
growing-gravity
```

## Listing 10.14 — `listing_10_14_build_then_compose.yml`

Integrated example: push the image, then deploy it onto a CLUSTER that already exists in Snow (Listing 10.2 or [hetzner/](../hetzner/)).

`test_container: true` builds a local image and runs it on the GitHub runner before push.

```yaml
jobs:
  build_and_push:
    uses: snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main
    with:
      type: build_and_push_image
      registry: ghcr.io
      name: snow-monkeys/growing-gravity
      tag: latest
      platforms: linux/amd64
      docker_file: Dockerfile
      infra: .
      test_container: true
    secrets:
      registry_user: ${{ secrets.REGISTRY_USER }}
      registry_token: ${{ secrets.REGISTRY_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}

  deploy_application:
    needs: build_and_push
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: growing-gravity
      host: server-stateless
      expected_url: server-stateless:8080
      infra: infra
    secrets:
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

```text
Output
ghcr.io/snow-monkeys/growing-gravity:latest
address: 203.0.113.10
container_name: growing-gravity
```

> **Note:** Compose still goes through a *provider* module (`hetzner-iac` here). `docker-iac` only builds and pushes.

> **Tip:** Pin `tag` to a git sha in production. `latest` is for this module so a first run is obvious.

## Listing 10.15 — `infra/docker-compose.yml`

```yaml
services:
  web:
    image: ghcr.io/snow-monkeys/growing-gravity:latest
    container_name: growing-gravity
    ports:
      - "8080:80"
    restart: unless-stopped
```

## Listing 10.16 — `infra/init.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
docker compose pull
docker compose up -d
docker compose ps --format '{{.Name}}' | head -n 1
```

```text
Output
growing-gravity
```

> **Warning:** `infra:` on `docker-iac` is the *build context*. `infra:` on `hetzner-iac` / `aws-iac` is the *compose directory copied to the host*. They are different directories with the same input name.

## Chapter checklist (this section)

- [x] Complete runnable files in this folder
- [x] File-name headings and Listing 10.11 … 10.16
- [x] Expected Output blocks
- [x] `requirements.txt` at first use
- [x] snake_case listing files
- [x] Note / Warning / Tip callouts
- [x] Try it yourself on Listing 10.11
