# 2. Walkthrough

Line-by-line of the caller contract. Full files: [listings](./listings/). Conceptual map: [conceptual explanation](../01-conceptual-explanation/).

This walkthrough uses Hetzner as the reference module because `main-examples/hetzner/` covers CLUSTER, RESOURCE, SERVICE, APPLICATION, and stateful S3. Other providers keep the same YAML shape; only `uses:` and CLUSTER `type` change.

## Listing 10.1 — caller skeleton

File: `listing_10_1_caller_skeleton.yml`.

```yaml
name: Caller skeleton

on:
  workflow_dispatch:
```

`name:` is the GitHub Actions workflow title in the Actions tab. `workflow_dispatch` is enough to run by hand. `main-examples` also uses `push` and `repository_dispatch` for automation tests; those triggers do not change the `uses:` job.

```yaml
jobs:
  provision:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
```

`provision` is **your** job id. It is not a job inside the module. `uses:` is the whole implementation: Terraform, compose, and Snow notify. `@main` is the module ref; pin a tag when the caller is production.

Retarget another cloud by changing only this line, for example `snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main`.

```yaml
    with:
      type: hcloud_server
      name: example-cluster
      type_values: |
        server_type=cpx11
        image=ubuntu-24.04
        location=hel1
```

`type: hcloud_server` selects Terraform folder `iac-terraform/hcloud_server` and Snow kind CLUSTER. `name` is the Snow identity, not the Hetzner hostname field. `server_type`, `image`, and `location` are Terraform variables. They travel as `type_values` because they are not `workflow_call` inputs.

```yaml
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

Left side: secret **names the module declares**. Right side: secret **names in your repository**. They can differ. Never put tokens under `with:`.

```text
Output
Jobs: provision (reusable workflow) → implement_hetzner_types
Snow notify kind: CLUSTER
```

The inner job name `implement_hetzner_types` is module-private. Callers read outputs from **`provision`** (this listing) or **`create_server`** (Listing 10.2).

## Listing 10.2 — read CLUSTER output

Pattern: `yabinboxes/main-examples/hetzner/hetznez stateless/server`.

```yaml
  create_server:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: server-stateless
```

`create_server` is the job id later jobs must use in `needs:` and `needs.create_server.outputs`.

```yaml
  print_server_ip:
    needs: create_server
    runs-on: ubuntu-22.04
    steps:
      - name: Server IP from reusable workflow
        run: echo "${{ needs.create_server.outputs.server_ip }}"
```

`needs:` waits for the reusable workflow to finish. `outputs.server_ip` is a **workflow output** from `main.yml`, not a step output from your runner. Compose jobs usually skip this print job and pass `host: server-stateless` instead of the IP.

```text
Output
Url is 203.0.113.10
```

RESOURCE types (Listing 10.3, `hcloud_firewall`) use the same `uses:` line. Only `type` changes. Azure and Cloudflare stop at RESOURCE; they have no VM CLUSTER type.

## Listings 10.4–10.5 — compose SERVICE and APPLICATION

Both copy the caller `infra/` directory (default name `infra`) to the host and run `init.sh`. Difference is Snow kind and extra APPLICATION steps (Docker cleanup, optional `health_url`).

```yaml
      type: docker_compose          # SERVICE
      host: server-stateless
      infra: infra
```

```yaml
      type: docker_compose_app      # APPLICATION
      name: growing-gravity
      host: server-stateless
```

`host` is the CLUSTER Snow `name` from Listing 10.2. The module resolves it through Snow before SSH. Listing 10.7 is the compose file; Listing 10.8 is `init.sh`. The last line `init.sh` prints becomes `container_name`.

## Listing 10.6 — remote state

Pattern: `yabinboxes/main-examples/hetzner/heztner statefull/`.

Two reusable-workflow jobs, two modules:

1. `aws-iac` with `type: aws_s3_bucket` creates the backend bucket.
2. `hetzner-iac` with `s3_bucket_state` and `state_values` stores CLUSTER state in that bucket.

```yaml
  create_server:
    needs: create_s3_bucket
```

`needs:` must point at the S3 job id. A copy-paste bug in some `main-examples` stateful files points `needs:` at the Hetzner job itself; do not copy that. The book listing is the corrected form.

`state_values` must include `region`. Empty `s3_bucket_state` means local state (`backend.tf` removed).

## Listing 10.9 — CLUSTER then APPLICATION

Pattern: `yabinboxes/main-examples/hetzner/hetznez stateless/combined/example-1-stateless.yml`.

```yaml
  create_server:
    with:
      type: hcloud_server
      name: server-example-1-stateless
  deploy_application:
    needs:
      - create_server
      - print_server_ip
    with:
      type: docker_compose_app
      name: growing-gravity
      host: server-example-1-stateless
      expected_url: server-example-1-stateless:8080
      infra: infra
```

`host` equals the CLUSTER `name`, not the APPLICATION `name`. `expected_url` keeps port `8080`; the module rewrites the hostname to the resolved IP before Snow notify.

`infra: infra` is the path **inside the caller repo**. Combined `main-examples` use `infra: application/infra` because several stacks share one repository. Split repos keep the default `infra`.

**Try it yourself:** add a SERVICE job between CLUSTER and APPLICATION (`type: docker_compose`), matching `example-2-stateless.yml`.

## Listing 10.10 — destroy

```yaml
      type: hcloud_server
      name: server-stateful
      destroy: true
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
```

`destroy` is ignored for `docker_compose` and `docker_compose_app`. For Terraform types it must see the **same** backend as create, or Terraform has no state to destroy.

> **Warning:** Destroy compute first. Deleting the S3 bucket first leaves the CLUSTER unmanageable from the module.

## Listing 10.11 — docker-iac

Image builds use a different module and a different `type`. They do not take `hcloud_token` or `type_values`.

```yaml
    uses: snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main
    with:
      type: build_and_push_image
      registry: ghcr.io
      name: snow-monkeys/growing-gravity
      tag: latest
      docker_file: Dockerfile
      infra: .
```

`infra:` here is the **build context** (repository root if `.`). Output is `container_name`, which a later compose job can pin in `docker-compose.yml`.

## Listing 10.30 — copy a listing into a caller

`copy_listing.sh` copies one YAML file into `.github/workflows/` of a caller repo. It does not vendor `snow-monkeys-modules`.

```bash
./copy_listing.sh listing_10_2_cluster_hcloud_server.yml /path/to/your-repo
```

```text
Output
copied listing_10_2_cluster_hcloud_server.yml -> /path/to/your-repo/.github/workflows/listing_10_2_cluster_hcloud_server.yml
```

Then set the repository secrets from the table in [listings](./listings/) and run **Actions → workflow_dispatch**.

## Swap provider, keep the job

Hetzner CLUSTER (`hcloud_server`) becomes AWS CLUSTER (`aws_instance`) by changing `uses:` and `type`. Secrets switch from `hcloud_token` to `aws_access_key_id` / `aws_secret_access_key`. Compose jobs stay `docker_compose` / `docker_compose_app` on every provider module.

See [Chapter 11](../../chapter-11-walkthrough/) for the book-level walkthrough of the same listings, and [Chapter 12](../../chapter-12-common-pitfalls/) for `type: server`, secrets under `with:`, and destroy-bucket-first.

# Summary

Caller repositories use `snow-monkeys-modules` so Terraform, compose deploy, and Snow notify live in one implementation per provider. Your YAML only selects the module, the `type`, public `type_values`, and secrets.

How to use a module:

1. `uses: snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml@<ref>`
2. Set `type` (`hcloud_server`, `aws_instance`, `docker_compose`, `docker_compose_app`, `build_and_push_image`, …).
3. Set Snow `name`. Compose jobs pass that CLUSTER name as `host`.
4. Pass Terraform variables in `type_values`. Put tokens under `secrets:`.
5. Read `needs.<job>.outputs.server_ip` (or `address`, `container_name`).
6. For state, create an S3 bucket first, then set `s3_bucket_state`. Destroy compute with `destroy: true` before deleting the bucket.

`yabinboxes/main-examples/` is the caller catalog this chapter copies. Runnable files are Listings 10.1–10.29 plus `copy_listing.sh` (Listing 10.30).

# Further reading

- `snow-monkeys-modules/master-modules/list-of-resources.md` — type catalog per provider
- `snow-monkeys-modules/hetzner-iac/README.md` — caller contract for the reference provider
- `snow-monkeys-modules/hetzner-iac/docs/INPUTS_OUTPUTS.md` — inputs, secrets, outputs
- `snow-monkeys-modules/hetzner-iac/docs/FLOW.md` — jobs inside `main.yml`
- `snow-monkeys-modules/hetzner-iac/docs/EXAMPLES.md` — module-side caller snippets
- `snow-monkeys-modules/docker-iac/.github/workflows/main.yml` — `build_and_push_image`
- `yabinboxes/main-examples/hetzner/` — stateless and stateful callers
- `yabinboxes/main-examples/cloudflare/` — Pages RESOURCE callers
- `yabinboxes/main-examples/aws/` — S3 state-bucket callers
- Chapter 11 — book-level walkthrough of these listings
- Chapter 12 — common pitfalls (`type: server`, secrets under `with:`, destroy order)
