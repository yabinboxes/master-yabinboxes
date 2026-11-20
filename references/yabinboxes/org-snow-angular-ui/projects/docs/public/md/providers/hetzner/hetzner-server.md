# Hetzner server

Provision a Hetzner Cloud server with `snow-monkeys-modules/hetzner-iac` and bootstrap Docker and Nginx on it.

**Workflow:** `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main`  
**Deployment type:** `hcloud_server`  
**Snow record:** `CLUSTER`

| Section | For |
|---|---|
| [User documentation](#user-documentation) | People creating or operating the server repository |
| [Agent AI documentation](#agent-ai-documentation) | Agents generating or updating that repository |

**Related pages:**

| Page | `type` | Snow record |
|---|---|---|
| This page | `hcloud_server` | `CLUSTER` |
| [Hetzner resource](/docs/provider/hetzner/hetzner-resource) | `hcloud_firewall`, `hcloud_network`, `hcloud_volume`, `hcloud_floating_ip`, `hcloud_volume_attachment` | `RESOURCE` |
| [Hetzner Docker Compose](/docs/provider/hetzner/hetzner-docker-compose) | `docker_compose` | `SERVICE` |
| [Hetzner Docker Compose app](/docs/provider/hetzner/hetzner-docker-compose-app) | `docker_compose_app` | `APPLICATION` |

[All example files](/docs/provider/hetzner/examples)

---

# User documentation

## What this deploys

A push to `main` calls `hetzner-iac`. Terraform, from `snow-monkeys-infra/iac-terraform`, creates the server. The workflow then copies this repository's `infra/` directory to `/tmp/` on the new host and runs `infra/init.sh` as `root`.

`init.sh` installs Docker and starts an Nginx container on port `8080`. `GET /health` returns `{"status":"ok"}`.

The workflow registers the server in Snow as a `CLUSTER`. The public address is the `server_ip` output.

The reference shape is:

| Setting | Value |
|---|---|
| `type` | `hcloud_server` |
| Stateless Snow name | `server-hetzner-stateless` |
| Stateful Snow name | `server-hetzner` |
| `server_type` | `cpx12` |
| `image` | `ubuntu-26.04` |
| `location` | `hel1` |

Later workloads use that Snow name as `host`:

- [Docker Compose service](/docs/provider/hetzner/hetzner-docker-compose) publishes port `8080`
- [Docker Compose application](/docs/provider/hetzner/hetzner-docker-compose-app) publishes port `4321`

## Stateless and stateful

**Stateless** keeps Terraform state on the runner for that job only. Leave `s3_bucket_state` empty. The action deletes `backend.tf`, runs `terraform init`, skips `plan`, and applies. A later workflow run cannot destroy that server from saved state.

**Stateful** stores Terraform state in S3.

1. Call `snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main` with `type: aws_s3_bucket`.
2. Call `hetzner-iac` with `s3_bucket_state` and `state_values`.
3. The server job must `needs` the bucket job.

`state_values` must include `region` and `encrypt` whenever `s3_bucket_state` is set. The examples use:

```yaml
s3_bucket_state: s3-server-state
state_values: |
  bucket_name=s3-server-state
  region=us-east-2
  encrypt=true
```

The state object key is `{name}/{git_type}/{github.actor_id}/{github.sha}`. Create and destroy inside one workflow run share that key. A new push gets a new key. `hetzner-iac` does not delete the S3 bucket. Remove that bucket separately.

## Prerequisites

- A [Hetzner Cloud](https://www.hetzner.com/cloud) project and an API token that can create servers
- An SSH key pair. Add the public key to the Hetzner project
- A Snow pipeline token
- A GitHub token that can clone `snow-monkeys-infra/iac-terraform` when that repository is private
- For stateful runs, AWS credentials that can use the state bucket

Store them as Actions secrets. Map them to the reusable workflow like this:

| GitHub secret | Workflow secret | Used for |
|---|---|---|
| `HETZNER_CLOUD_TOKEN` | `hcloud_token` | Terraform and the Hetzner API |
| `SSH_PUBLIC_KEY_TEST` | `ssh_public_key` | Key installed on the server |
| `SSH_PRIVATE_KEY_TEST` | `ssh_private_key` | SSH from the runner (`ed25519`) |
| `SNOW_TOKEN_PIPELINE` | `snow_token_pipeline` | Snow notify |
| `SNOW_GITHUB_TOKEN` | `snow_github_token` | Clone of the Terraform modules |
| `AWS_ACCESS_KEY_ID` | `aws_access_key_id` | S3 backend, stateful only |
| `AWS_SECRET_ACCESS_KEY` | `aws_secret_access_key` | S3 backend, stateful only |

The reusable workflow also accepts `snow_token`. The examples pass `snow_token_pipeline`.

## Repository layout

Put the workflow at `.github/workflows/` in the caller repository. The copies below live under `examples/` so this site can serve them.

```text
.github/workflows/server-stateless.yml
infra/init.sh
infra/init/setup-docker.sh
infra/init/setup-nginx.sh
infra/init/nginx/docker-compose.yml
infra/init/nginx/default.conf
```

`infra` defaults to `infra`. A combined repository can point at another directory with `infra: server/infra`.

| File | Role |
|---|---|
| [init.sh](/docs/provider/hetzner/examples?file=stateless/server/infra/init.sh) | Runs the two setup scripts |
| [setup-docker.sh](/docs/provider/hetzner/examples?file=stateless/server/infra/init/setup-docker.sh) | Installs Docker CE on Ubuntu. Must run as root |
| [setup-nginx.sh](/docs/provider/hetzner/examples?file=stateless/server/infra/init/setup-nginx.sh) | Starts Nginx from `/tmp/init/nginx` |
| [nginx compose](/docs/provider/hetzner/examples?file=stateless/server/infra/init/nginx/docker-compose.yml) | Container `snow-api`, host port `8080` |
| [default.conf](/docs/provider/hetzner/examples?file=stateless/server/infra/init/nginx/default.conf) | `/health` returns ok. Other paths return 503 |

The copy lands at `/tmp/` (`infra/init/nginx` becomes `/tmp/init/nginx`). SSH bootstrap runs only when `type` is `hcloud_server` and `destroy` is false.

## Stateless workflow

Full file: [server-stateless.yml](/docs/provider/hetzner/examples?file=stateless/server/workflows/server-stateless.yml)

```yaml
name: Hetzner Server Stateless

on:
  push:
    branches: [ "main" ]

jobs:
  create_server_on_hetzner:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner-stateless
      server_type: cpx12
      image: ubuntu-26.04
      location: hel1
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-server:
    needs: create_server_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - run: echo "Url is ${{ needs.create_server_on_hetzner.outputs.server_ip }}"
```

`type_values` is written into the Terraform module `.env` and exported as `TF_VAR_*`. The Terraform step also sets `TF_VAR_server_type`, `TF_VAR_image`, and `TF_VAR_location` from the inputs `server_type`, `image`, and `location`. Those inputs default to `cx23`, `ubuntu-22.04`, and `hel1`. Set them to the same values as `type_values` when the server should be `cpx12` on `ubuntu-26.04`.

## Stateful workflow

Full files:

- [server-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/server/workflows/server-statefull-s3.yml)
- [server-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/server/workflows/server-statefull-s3-destroy.yml)

The create job depends on `create_s3_bucket`. Destroy is a later job in the same workflow, with `destroy: true`, the same `name`, and the same bucket. The destroy example sets `encrypt=false` in `state_values`. Create sets `encrypt=true`.

```yaml
  create_s3_bucket:
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      name: s3-server-state
      type_values: |
        bucket_name=s3-server-state
        region=us-east-2
        versioning=true
        encrypt=true
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  create_server_on_hetzner:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-hetzner
      server_type: cpx12
      image: ubuntu-26.04
      location: hel1
      type_values: |
        server_type=cpx12
        image=ubuntu-26.04
        location=hel1
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

## After the server exists

Deploy from separate repositories when you can. Combined examples keep server, service, and application in one repo and set `infra` to the matching subdirectory:

- [example-1-stateless.yml](/docs/provider/hetzner/examples?file=stateless/combined/workflows/example-1-stateless.yml) — server, then application on port `4321`
- [example-2-stateless.yml](/docs/provider/hetzner/examples?file=stateless/combined/workflows/example-2-stateless.yml) — server, then Postgres
- Stateful create and destroy: [example-1-statefull.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-1-statefull.yml), [example-1-statefull-destroy.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-1-statefull-destroy.yml), [example-2-statefull.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-2-statefull.yml), [example-2-statefull-destroy.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-2-statefull-destroy.yml)

`host` on those follow-up jobs is the server `name` (`server-hetzner-stateless` or `server-example-1-stateless`), not a hardcoded IP.

## Outputs

| Output | Meaning |
|---|---|
| `server_ip` | Public IPv4 from Terraform (`server_ipv4`) |
| `terraform_output` | `terraform output -json` |
| `terraform_vars` | Non-secret `TF_VAR_*` values as JSON |

`address`, `container_name`, `docker_output`, and `docker_vars` stay empty for this type.

## Checks

- The Actions log shows `server_ip`
- `ssh root@<server_ip>` works with the private key
- `curl http://<server_ip>:8080/health` returns `{"status":"ok"}`
- Snow shows a `CLUSTER` whose name matches `name`

---

# Agent AI documentation

Use this section to create or update a repository that provisions a Hetzner server the way the examples do.

## Goal

Create a caller repository that:

1. Calls `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main` with `type: hcloud_server`
2. Ships `infra/init.sh` plus the Docker and Nginx files under `infra/init/`
3. Publishes `server_ip`
4. Uses S3 state only when the user asked for a stateful server, and destroys in the same workflow run

Read the example files instead of inventing a bootstrap:

| Kind | Workflow | Infra |
|---|---|---|
| Stateless | [/md/providers/hetzner/examples/stateless/server/workflows/server-stateless.yml](/md/providers/hetzner/examples/stateless/server/workflows/server-stateless.yml) | [/md/providers/hetzner/examples/stateless/server/infra/](/docs/provider/hetzner/examples) |
| Stateful | [/md/providers/hetzner/examples/stateful/server/workflows/server-statefull-s3.yml](/md/providers/hetzner/examples/stateful/server/workflows/server-statefull-s3.yml) | same bootstrap scripts |
| Stateful destroy | [/md/providers/hetzner/examples/stateful/server/workflows/server-statefull-s3-destroy.yml](/md/providers/hetzner/examples/stateful/server/workflows/server-statefull-s3-destroy.yml) | same bootstrap scripts |

Place workflows at `.github/workflows/` in the caller repository.

## Call contract

```yaml
uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
with:
  type: hcloud_server
  name: server-hetzner-stateless          # stateful example name: server-hetzner
  server_type: cpx12
  image: ubuntu-26.04
  location: hel1
  type_values: |
    server_type=cpx12
    image=ubuntu-26.04
    location=hel1
  # stateful only:
  # s3_bucket_state: s3-server-state
  # state_values: |
  #   bucket_name=s3-server-state
  #   region=us-east-2
  #   encrypt=true
  # destroy: true                         # same workflow run as create
secrets:
  hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
  ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
  ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
  snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
  snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  # stateful only:
  # aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
  # aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

Workflow inputs and secret keys are `snake_case`. GitHub secret names are `SCREAMING_SNAKE_CASE`. Snow query fields (`snowName`, `actorId`, `gitType`) are filled inside `hetzner-iac`. Callers do not send them.

## Rules

- `type` is `hcloud_server`. An empty `resource` input is set to that same value, and Terraform runs in `iac-terraform/v1/modules/dev/hetzner/hcloud_server`.
- Keep `server_type`, `image`, and `location` aligned with `type_values`. The Terraform step exports the discrete inputs as `TF_VAR_server_type`, `TF_VAR_image`, and `TF_VAR_location`. Defaults are `cx23`, `ubuntu-22.04`, and `hel1`.
- Copy every file under `infra/`. The action runs `scp -r ./infra/*` to `/tmp/` and then `cd /tmp && bash init.sh`.
- `init.sh` calls `infra/init/setup-docker.sh` and `infra/init/setup-nginx.sh`. Nginx starts from `/tmp/init/nginx`.
- Bootstrap SSH runs only for `hcloud_server` when `destroy` is false. It connects as `root`.
- Pass `snow_github_token` so the action can clone `snow-monkeys-infra/iac-terraform`.
- Pass tokens only through `secrets:`. Never write a token into the workflow file.
- Stateful create `needs` the `aws-iac` bucket job. `state_values` includes `region` and `encrypt`.
- The state key includes `github.sha`. Put `destroy: true` in the same workflow run as create, with the same `name`, bucket, and `state_values`.
- After success, Snow notify uses `type: CLUSTER`, `url` = `server_ip`, plus `terraform_output` and `terraform_vars`. `actor_id` and `actor_name` come from `github.actor_id` and `github.actor`.
- Follow-up `docker_compose` and `docker_compose_app` jobs set `host` to this server's `name`.

## Prompt

```text
Using https://docs.snow-monkeys.com/md/providers/hetzner/hetzner-server.md
and the example files under https://docs.snow-monkeys.com/md/providers/hetzner/examples/stateless/server/

Add .github/workflows/server-stateless.yml that calls
snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
with type hcloud_server, name server-hetzner-stateless,
server_type cpx12, image ubuntu-26.04, location hel1,
and the same three keys in type_values.

Map hcloud_token, ssh_public_key, ssh_private_key, snow_github_token,
and snow_token_pipeline from GitHub Actions secrets.

Add infra/init.sh, infra/init/setup-docker.sh, infra/init/setup-nginx.sh,
infra/init/nginx/docker-compose.yml, and infra/init/nginx/default.conf
from the example tree. init.sh must run both setup scripts.

Print needs.create_server_on_hetzner.outputs.server_ip in a later job.
For a stateful server, create the S3 bucket with aws-iac first, pass
s3_bucket_state and state_values (region and encrypt), and destroy with
destroy: true in that same workflow run.
```

## Raw documentation URL

```text
https://docs.snow-monkeys.com/md/providers/hetzner/hetzner-server.md
```
