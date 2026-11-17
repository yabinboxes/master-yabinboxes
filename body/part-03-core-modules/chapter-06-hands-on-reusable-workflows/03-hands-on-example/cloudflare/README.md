# Cloudflare (Listings 6.22–6.23)

> Status: written. Cloudflare caller module. The generic contract is Listings 6.1–6.10.

Cloudflare is RESOURCE-only plus compose. There is no VM CLUSTER type. Callers use `uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main`. Examples live in `yabinboxes/main-examples/cloudflare/`.

| `type` | Snow kind | Source example |
| --- | --- | --- |
| `cloudflare_pages_project` | RESOURCE | `cloudflare stateless/resources` |
| `cloudflare_d1_database` | RESOURCE | module catalog |
| `cloudflare_r2_bucket` | RESOURCE | module catalog |
| `cloudflare_workers_script` | RESOURCE | module catalog |
| `cloudflare_pipeline_sink` | RESOURCE | module catalog |
| `docker_compose` | SERVICE | same compose path as Listings 6.4–6.5 |
| `docker_compose_app` | APPLICATION | same compose path as Listings 6.4–6.5 |

Default `type` on the reusable workflow is `cloudflare_pages_project`. Empty `resource` copies `type`.

## Requirements

```txt
# requirements.txt
# gh>=2
# terraform>=1.5
#
# Reusable workflow:
#   snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml
# Caller examples:
#   yabinboxes/main-examples/cloudflare/
```

See [requirements.txt](./requirements.txt). Secrets: `CLOUDFLARE_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `SNOW_TOKEN`, `SNOW_TOKEN_PIPELINE`. Listing 6.23 also needs AWS keys for the state bucket.

## Listing 6.22 — `listing_6_22_pages_stateless.yml`

Minimal Pages project. Pattern from `pages-stateless.yml`.

```yaml
jobs:
  create_pages_project:
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      name: pages-cloudflare
      type_values: |
        production_branch=main
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }}
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

```text
Output
Pages URL is <empty or project identifier>
Snow notify kind: RESOURCE
```

`server_ip` is the shared output name on every provider workflow. Cloudflare has no VM, so treat it as an opaque identifier, not a public IP.

**Try it yourself:** set `type: cloudflare_r2_bucket` and pass `type_values` from `iac-terraform/cloudflare_r2_bucket`.

## Listing 6.23 — `listing_6_23_pages_stateful.yml`

S3 backend, then Pages. `needs: create_s3_bucket`. Pattern from `pages-statefull-s3.yml`.

```yaml
jobs:
  create_s3_bucket:
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_s3_bucket
      name: s3-cloudflare-state
  create_pages_project:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      name: pages-cloudflare
      s3_bucket_state: s3-cloudflare-state
      state_values: |
        bucket_name=s3-cloudflare-state
        region=us-east-2
        encrypt=true
```

```text
Output
Pages URL is <empty or project identifier>
```

> **Note:** `encrypt` in `type_values` for the bucket and `encrypt` in `state_values` for the backend should match. Listing 6.23 sets both to `true`.

> **Warning:** Do not invent a Cloudflare CLUSTER type. Compose (`docker_compose` / `docker_compose_app`) still needs a host registered by another provider (Listings 6.17–6.21).

> **Tip:** `resource:` can be omitted. The workflow copies `type` when `resource` is empty.

## Chapter checklist (this section)

- [x] Complete runnable files in this folder
- [x] File-name headings and Listing 6.22 … 6.23
- [x] Expected Output blocks
- [x] `requirements.txt` at first use
- [x] snake_case listing files
- [x] Note / Warning / Tip callouts
- [x] Try it yourself on Listing 6.22
