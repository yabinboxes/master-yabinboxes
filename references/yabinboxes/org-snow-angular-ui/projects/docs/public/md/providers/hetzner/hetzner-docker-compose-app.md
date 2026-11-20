# Hetzner Docker Compose app

Deploy a Docker Compose application onto a Hetzner server that already exists. This path also reclaims Docker disk and turns on log rotation before the deploy.

**Workflow:** `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main`  
**Deployment type:** `docker_compose_app`  
**Snow record:** `APPLICATION`

| Section | For |
|---|---|
| [User documentation](#user-documentation) | People deploying an application onto a server |
| [Agent AI documentation](#agent-ai-documentation) | Agents generating or updating that repository |

The server is [Hetzner server](/docs/provider/hetzner/hetzner-server). A backing service such as Nginx or Postgres is [Hetzner Docker Compose](/docs/provider/hetzner/hetzner-docker-compose).

[All example files](/docs/provider/hetzner/examples)

---

# User documentation

## What this deploys

`hetzner-iac` resolves `host`, prepares Docker on that host, copies `infra/` to `/tmp/`, writes `env_values` to `/tmp/.env`, and runs `bash init.sh`. Snow receives an `APPLICATION` record. When `health_url` is set, Snow also queues a liveness probe. The examples leave `health_url` empty, so the probe is skipped.

The reference application is `growing-gravity`:

| Setting | Value |
|---|---|
| `type` | `docker_compose_app` |
| Stateless `name` | `application-hetzner-stateless` |
| Stateful `name` | `application-hetzner` |
| `host` | Snow name of the server |
| `expected_url` | `<server name>:4321` |
| Image | `yabinm/growing-gravity:latest` |
| Container | `growing-gravity` |
| Port | `4321` |

Before the copy, the app action on the remote host:

1. Merges a json-file log limit into `/etc/docker/daemon.json` (`max-size` `10m`, `max-file` `3`) and reloads Docker
2. Truncates existing container json logs in place
3. Runs `docker system prune -f`

That prune does not use `-a` or `--volumes`, so tagged images and named volumes stay.

## Host and expected URL

`host` is an IP, or a Snow name. The examples pass the server `name`. Snow resolves the name before SSH. `http://` and `https://` are stripped before the connection.

`expected_url` is `hostname:port`. A hostname is replaced with the resolved address and the port stays. An IPv4 host part is left unchanged. Snow stores `address` as the application URL, and uses `expected_url` when address is empty.

## Stateless and stateful

The application job does not take `s3_bucket_state`. Remote state belongs to the server workflow.

Standalone workflows create the server, then deploy:

- [application-stateless.yml](/docs/provider/hetzner/examples?file=stateless/application/workflows/application-stateless.yml)
- [application-statefull-s3.yml](/docs/provider/hetzner/examples?file=stateful/application/workflows/application-statefull-s3.yml)
- [application-statefull-s3-destroy.yml](/docs/provider/hetzner/examples?file=stateful/application/workflows/application-statefull-s3-destroy.yml) destroys the server with `destroy: true` in the same run

Once the server exists, put the application in its own repository, set `host` to the server Snow name, and drop the server job.

Combined example 1 deploys this app from `application/infra` in the same repository as the server:

- [example-1-stateless.yml](/docs/provider/hetzner/examples?file=stateless/combined/workflows/example-1-stateless.yml)
- [example-1-statefull.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-1-statefull.yml)
- [example-1-statefull-destroy.yml](/docs/provider/hetzner/examples?file=stateful/combined/workflows/example-1-statefull-destroy.yml)

Those workflows set `infra: application/infra` and use the server name for both `name` and `host` (`server-example-1-stateless` or `server-example-1-statefull`).

## Prerequisites

| GitHub secret | Workflow secret | Used for |
|---|---|---|
| `SSH_PUBLIC_KEY_TEST` | `ssh_public_key` | Key registered for the connection |
| `SSH_PRIVATE_KEY_TEST` | `ssh_private_key` | SSH as `root` |
| `SNOW_TOKEN_PIPELINE` | `snow_token_pipeline` | Host lookup, notify, and the optional health check |
| `ENV_VALUES` | `env_values` | Optional `.env` written to `/tmp/.env` |

The server half also needs `HETZNER_CLOUD_TOKEN`, `SNOW_GITHUB_TOKEN`, and, when stateful, the AWS keys for the state bucket. See [Hetzner server](/docs/provider/hetzner/hetzner-server).

## Repository layout

```text
.github/workflows/application-stateless.yml
infra/init.sh
infra/docker-compose.yml
infra/deployment/deploy-in-hetzner.sh
infra/Dockerfile
```

| File | Role |
|---|---|
| [init.sh](/docs/provider/hetzner/examples?file=stateless/application/infra/init.sh) | Runs `deployment/deploy-in-hetzner.sh` |
| [deploy-in-hetzner.sh](/docs/provider/hetzner/examples?file=stateless/application/infra/deployment/deploy-in-hetzner.sh) | `cd /tmp` and `docker compose up -d` |
| [docker-compose.yml](/docs/provider/hetzner/examples?file=stateless/application/infra/docker-compose.yml) | Builds `.` and runs `growing-gravity` on port `4321` |

The compose file sets `build.context` to `.` and `dockerfile: Dockerfile`. The example tree does not include that Dockerfile. Add it next to `docker-compose.yml`, or remove the `build` block and rely on `image: yabinm/growing-gravity:latest`.

`init.sh` stdout is the container name. The example script prints `containers=<image>`. A new application should print only `growing-gravity` and send progress logs to stderr, so `docker logs` reads the right container.

## Application workflow

Full file: [application-stateless.yml](/docs/provider/hetzner/examples?file=stateless/application/workflows/application-stateless.yml)

```yaml
  deploy_application_on_hetzner:
    needs: create_server_on_hetzner
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: application-hetzner-stateless
      host: server-hetzner-stateless
      expected_url: server-hetzner-stateless:4321
      # health_url: http://server-hetzner-stateless:4321/health
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-application:
    needs: deploy_application_on_hetzner
    runs-on: ubuntu-22.04
    steps:
      - run: echo "Url is ${{ needs.deploy_application_on_hetzner.outputs.address }}"
```

The stateful names are `application-hetzner` and `server-hetzner`, with `expected_url: server-hetzner:4321`.

Set `health_url` only when Snow should probe the app after notify. An empty value skips that job. The examples leave it unset.

## Outputs

| Output | Meaning |
|---|---|
| `address` | SSH host after name resolution |
| `container_name` | First stdout line from `init.sh` |
| `docker_output` | JSON `{"container_name","logs"}` |
| `docker_vars` | Compose service fields as JSON. Secret env names are omitted |

## Checks

- `address` is the resolved server IP
- `docker ps` on the server shows `growing-gravity`
- The app answers on `http://<address>:4321`
- Snow shows an `APPLICATION` with this `name`
- With `health_url` set, the liveness job runs after notify

---

# Agent AI documentation

Use this section to deploy a Compose application. For databases and other backing services, use `docker_compose` on the [service page](/docs/provider/hetzner/hetzner-docker-compose).

## Goal

Create a caller repository whose `infra/init.sh` starts the app, and whose workflow calls `hetzner-iac` with `type: docker_compose_app`.

Copy:

| Kind | Workflow | Infra |
|---|---|---|
| Stateless | [application-stateless.yml](/md/providers/hetzner/examples/stateless/application/workflows/application-stateless.yml) | [infra/](/docs/provider/hetzner/examples?file=stateless/application/infra/docker-compose.yml) |
| Stateful server plus app | [application-statefull-s3.yml](/md/providers/hetzner/examples/stateful/application/workflows/application-statefull-s3.yml) | [infra/](/docs/provider/hetzner/examples?file=stateful/application/infra/init.sh) |
| Combined with the server | [example-1-stateless.yml](/md/providers/hetzner/examples/stateless/combined/workflows/example-1-stateless.yml) | `infra: application/infra` |

Place the workflow at `.github/workflows/` in the caller repository.

## Call contract

```yaml
uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
with:
  type: docker_compose_app
  name: application-hetzner-stateless
  host: server-hetzner-stateless
  expected_url: server-hetzner-stateless:4321
  health_url: ''                          # set a URL to queue a Snow liveness probe
  infra: infra                            # combined example uses application/infra
secrets:
  ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
  ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
  snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  env_values: ${{ secrets.ENV_VALUES }}
```

## Rules

- `type` is `docker_compose_app`. The action prunes with `docker system prune -f` only. It does not pass `-a` or `--volumes`.
- Log rotation is json-file, `max-size` `10m`, `max-file` `3`. Existing logs are truncated, not deleted.
- `host` is the server Snow `name` or an IPv4 address. `expected_url` keeps the port and replaces a hostname with the resolved host.
- `infra/init.sh` is required. Files are copied to `/tmp/` and the script runs there.
- Print the compose `container_name` (`growing-gravity`) as the first stdout line. Other output goes to stderr.
- The example compose file builds `Dockerfile` from the same directory and also sets `image: yabinm/growing-gravity:latest`. Include the Dockerfile, or remove `build` and use the image.
- The app listens on `4321`. The server bootstrap Nginx listens on `8080`. They are different ports.
- `health_url` empty skips `snow_livenessprobe_application`. A non-empty value queues it after the `APPLICATION` notify.
- Pass SSH keys and `snow_token_pipeline`. Pass `hcloud_token` on the server job, not as a requirement of the app deploy.
- Snow notify uses `type: APPLICATION`, `url` = `address` (fallback `expected_url`), `image` = `container_name`, plus `docker_output` and `docker_vars`.
- A workflow that also creates the server makes the app job `needs` the server job. Stateful destroy uses `destroy: true` on the server in that same run, because the Terraform state key includes `github.sha`.

## Prompt

```text
Using https://docs.snow-monkeys.com/md/providers/hetzner/hetzner-docker-compose-app.md
and https://docs.snow-monkeys.com/md/providers/hetzner/examples/stateless/application/

Add a workflow that calls
snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
with type docker_compose_app, name application-hetzner-stateless,
host server-hetzner-stateless, and expected_url server-hetzner-stateless:4321.
Leave health_url empty unless a probe URL was requested.

Map ssh_public_key, ssh_private_key, and snow_token_pipeline from secrets.

Add infra/init.sh, infra/deployment/deploy-in-hetzner.sh, and
infra/docker-compose.yml from the example. Add infra/Dockerfile when the
compose build block stays. init.sh must print growing-gravity as its
first stdout line.

The app job needs the server job when this workflow also creates the server.
Echo needs.deploy_application_on_hetzner.outputs.address.
```

## Raw documentation URL

```text
https://docs.snow-monkeys.com/md/providers/hetzner/hetzner-docker-compose-app.md
```
