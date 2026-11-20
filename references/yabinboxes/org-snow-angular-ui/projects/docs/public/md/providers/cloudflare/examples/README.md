# Cloudflare examples

Caller repositories for `snow-monkeys-modules/cloudflare-iac`. Each workflow file belongs at `.github/workflows/` in that repository. Wrangler uploads `infra/` to the Pages project.

| Guide | `type` | Audience sections |
|---|---|---|
| [Cloudflare Pages](/docs/provider/cloudflare/pages) | `cloudflare_pages_project` | User documentation, Agent AI documentation |

Stateless workflows keep Terraform state on the runner. Stateful workflows create an S3 bucket with `aws-iac`, then pass `s3_bucket_state` and `state_values` (`region`, `encrypt`). Destroy jobs set `destroy: true` in the same workflow run.

The Pages job in the stateful workflows depends on `create_s3_bucket`.

## Stateless

| File | What it is |
|---|---|
| [pages-stateless.yml](/docs/provider/cloudflare/examples?file=stateless/pages/workflows/pages-stateless.yml) | Create project `pages-cloudflare` and upload `infra/` |
| [index.html](/docs/provider/cloudflare/examples?file=stateless/pages/infra/index.html) | Static page |

## Stateful

| File | What it is |
|---|---|
| [pages-statefull-s3.yml](/docs/provider/cloudflare/examples?file=stateful/pages/workflows/pages-statefull-s3.yml) | S3 bucket, then the Pages project |
| [pages-statefull-s3-destroy.yml](/docs/provider/cloudflare/examples?file=stateful/pages/workflows/pages-statefull-s3-destroy.yml) | Same, then `destroy: true` |
| [index.html](/docs/provider/cloudflare/examples?file=stateful/pages/infra/index.html) | Same static page |
