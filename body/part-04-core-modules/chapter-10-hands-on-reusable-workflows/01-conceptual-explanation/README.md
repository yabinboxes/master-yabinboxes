# 1. Conceptual explanation

This chapter is a **caller** chapter. You do not edit Terraform inside `snow-monkeys-modules/`. You write a GitHub Actions file in your repository that **calls** a module, the same way `yabinboxes/main-examples/` does.

## Why reusable workflows are used

Each `*-iac` repository in `snow-monkeys-modules/` is one **implementation**: Terraform folders, compose composite actions, Snow notify, and host resolution. Caller repositories are **consumers**. They stay thin so that:

- Terraform and notify logic live in one place per provider. A fix in `hetzner-iac` reaches every Hetzner caller that pins that module ref.
- The job shape is the same on Hetzner, AWS, GCP, Azure, DigitalOcean, Cloudflare, and Civo: `uses:` + `with:` + `secrets:`. Swap the module and the CLUSTER `type`; keep the rest of the YAML.
- The Snow dashboard can show CLUSTER, RESOURCE, SERVICE, and APPLICATION without each caller talking to the Snow API. The module calls `snow-iac` after it provisions or deploys.
- Secrets stay in GitHub repository secrets. Public Terraform variables travel as `type_values`. GitHub rejects secret values on `workflow_call` inputs.

Without the modules, every app repo would copy Terraform, SSH, compose copy, and notify. Those copies drift. The reusable workflow is the contract that stops that drift.

> **Note:** Combined workflows in `main-examples` (server + app in one file) exist so tests can run end to end. In production, keep CLUSTER, RESOURCE, SERVICE, and APPLICATION in separate repositories.

## What a reusable workflow is

A **reusable workflow** is a GitHub Actions file that declares `on: workflow_call`. The implementation path is always:

```text
snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml
```

Call it with a ref (`@main` or a tag):

```yaml
uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
```

`docker-iac` is the image builder (`type: build_and_push_image`). `snow-iac` is the notify/resolve helper that the provider modules already call; application callers do not call `snow-iac` directly.

## How a call moves through the module

Text diagram of one job (from `hetzner-iac/docs/FLOW.md`):

```text
Caller repository
  .github/workflows/*.yml
        |
        |  uses: .../<provider>-iac/.github/workflows/main.yml@<ref>
        |  with:   type, name, type_values, host, s3_bucket_state, ...
        |  secrets: provider token, ssh keys, snow_token, snow_token_pipeline
        v
┌──────────────────────────────────────────────────────────┐
│  main.yml  (workflow_call)                               │
│                                                          │
│  Job 1  implement_*_types                                │
│    checkout → assign resource folder → optional host     │
│    resolution → one deployment action:                   │
│      Terraform  (CLUSTER / RESOURCE types)               │
│      docker_compose          (SERVICE)                   │
│      docker_compose_app      (APPLICATION)               │
│                                                          │
│  Job 2  snow_notify_*   (one of CLUSTER / RESOURCE /     │
│                          SERVICE / APPLICATION)          │
│  Job 3  liveness probe  (docker_compose_app + health_url)│
└──────────────────────────────────────────────────────────┘
        |
        v
Caller job outputs: server_ip | address | container_name | ...
```

The caller never names those inner jobs. It only `uses:` the workflow and later reads `needs.<job_id>.outputs.*`.

## How to use an implementation

Do this in order. Runnable YAML for each step is in [the listings](../02-walkthrough/listings/).

1. **Pick the module** that matches the cloud or the image build (table below).
2. **Pick `type`**. CLUSTER and RESOURCE types are snake_case Terraform folder names (`hcloud_server`, `aws_instance`, `cloudflare_pages_project`). Compose types are `docker_compose` (SERVICE) and `docker_compose_app` (APPLICATION). Docker image builds use `build_and_push_image`.
3. **Set `name`**. That string is the Snow resource name. Later compose jobs pass the CLUSTER name as `host` so Snow can resolve SSH.
4. **Pass public variables in `type_values`**. Newline-separated `KEY=VALUE`. The module writes `.env` and exports `TF_VAR_*`. Server size, image, and region are not top-level workflow inputs.
5. **Map secrets under `secrets:`**. Provider tokens, SSH keys, Snow tokens, and (when remote state is on) AWS keys for the S3 backend.
6. **Read outputs** from a follow-up job, or chain compose with `needs:` and `host:`.
7. **For remote Terraform state**, set `s3_bucket_state` and `state_values` (`region` is required). Create the bucket first (Listing 10.6).
8. **To tear down**, call the same module with the same `type`, `name`, `type_values`, and backend, plus `destroy: true` (Listing 10.10). Do not delete the state bucket first.

If `resource` is empty, the workflow copies `type` into `resource`. That is how `type: hcloud_firewall` finds `iac-terraform/hcloud_firewall` without a second input.

### Caller job shape

Every caller job has four parts:

1. **`uses:`** — org/repo path to `main.yml` plus a ref.
2. **`with:`** — public inputs.
3. **`secrets:`** — mapped from repository secrets.
4. **`needs:` + `outputs`** — later jobs read `server_ip`, `address`, `container_name`, or provider-specific outputs.

> **Warning:** `type: server` is not a folder. Hetzner CLUSTER is `hcloud_server`. A type that does not exist under `iac-terraform/` fails checkout of that module.

> **Warning:** Secrets must sit under `secrets:`, never under `with:`.

### Which module to call

| Caller needs | `uses:` | Default CLUSTER / RESOURCE `type` |
| --- | --- | --- |
| Hetzner VM, firewall, volume, compose | `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main` | `hcloud_server` |
| AWS instance, S3, RDS, compose | `snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main` | `aws_instance` |
| GCP instance, GCS, Cloud SQL, compose | `snow-monkeys-modules/gcp-iac/.github/workflows/main.yml@main` | `google_compute_instance` |
| DigitalOcean droplet, compose | `snow-monkeys-modules/digital-ocean-iac/.github/workflows/main.yml@main` | `digitalocean_droplet` |
| Civo compute / k8s / compose | `snow-monkeys-modules/civo-iac/.github/workflows/main.yml@main` | `compute` |
| Azure web app, SQL, compose (no VM type) | `snow-monkeys-modules/azure-iac/.github/workflows/main.yml@main` | `azurerm_linux_web_app` (RESOURCE) |
| Cloudflare Pages, R2, Workers (no VM type) | `snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main` | `cloudflare_pages_project` (RESOURCE) |
| Build and push an image | `snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main` | `build_and_push_image` |

The type catalog is `snow-monkeys-modules/master-modules/list-of-resources.md`. Azure and Cloudflare have no CLUSTER VM type; they are RESOURCE plus compose.

### `type` → Snow kind

| `type` | Snow kind | What the module runs |
| --- | --- | --- |
| `hcloud_server`, `aws_instance`, `google_compute_instance`, `digitalocean_droplet`, Civo `compute` | CLUSTER | Terraform VM / compute |
| `hcloud_firewall`, `aws_s3_bucket`, `cloudflare_pages_project`, … | RESOURCE | Terraform resource folder |
| `docker_compose` | SERVICE | Copy `infra/` and run `init.sh` on a Snow host |
| `docker_compose_app` | APPLICATION | Same copy; extra Docker cleanup and optional `health_url` |
| `build_and_push_image` | image | `docker-iac` buildx push |

### Host resolution (compose only)

`host` on `docker_compose` / `docker_compose_app`:

- Empty — resolution skipped.
- IPv4 — used as SSH target.
- Snow name — `GET {snow_host_url}/connectors/get-snow-url?snowName={host}&actorId={github.actor_id}&gitType={git_type}` with Bearer `snow_token`.

That is why Listing 10.9 sets `host: server-example-1-stateless` after a CLUSTER job whose `name` is the same string. You do not have to paste the IP into the compose job.

`expected_url` is `hostname:port`. The module replaces a hostname with the resolved host and keeps the port.

### Where `main-examples` fits

`yabinboxes/main-examples/` is the set of **known-good callers**. This chapter copies their job shape into Listings 10.1–10.29 with secrets and `needs:` corrected for the book.

| Example tree | What it teaches |
| --- | --- |
| `hetzner/hetznez stateless/server` | CLUSTER `hcloud_server` + print `server_ip` |
| `hetzner/hetznez stateless/resources` | RESOURCE types (`hcloud_firewall`, …) |
| `hetzner/hetznez stateless/services` | SERVICE `docker_compose` |
| `hetzner/hetznez stateless/application` | APPLICATION `docker_compose_app` |
| `hetzner/hetznez stateless/combined` | CLUSTER then APPLICATION in one workflow |
| `hetzner/heztner statefull/` | same types with `s3_bucket_state` |
| `cloudflare/` | RESOURCE `cloudflare_pages_project` |
| `aws/` | RESOURCE `aws_s3_bucket` (state bucket) |

Copy a listing into `.github/workflows/` of your repo, set repository secrets, and dispatch. Do not vendor the module.

> **Tip:** Pin a tag (`@v1.2.3`) in production. `@main` tracks the module branch and can change under you.

## What you will be able to do

After this chapter you will be able to:

- Explain why a caller repository uses `snow-monkeys-modules` instead of copying Terraform or compose actions
- Call a provider module with `uses:`, `with:`, and `secrets:` from a GitHub Actions workflow
- Choose `type` for CLUSTER, RESOURCE, SERVICE, APPLICATION, or `build_and_push_image`, and pass `type_values` without putting secrets under `with:`
- Chain a CLUSTER job to compose SERVICE or APPLICATION jobs using the Snow `name` as `host`, reading `server_ip` / `address` from job outputs
- Destroy a stateful stack with `destroy: true` while keeping the S3 backend until compute is gone
