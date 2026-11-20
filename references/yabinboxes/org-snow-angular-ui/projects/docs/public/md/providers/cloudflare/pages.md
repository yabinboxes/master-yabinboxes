# Cloudflare Pages

Create a Cloudflare Pages project and upload a static site from the caller repository.

**Workflow:** `snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main`  
**Deployment type:** `cloudflare_pages_project`  
**Snow record:** `RESOURCE`

| Section | For |
|---|---|
| [User documentation](#user-documentation) | People creating or operating the Pages repository |
| [Agent AI documentation](#agent-ai-documentation) | Agents generating or updating that repository |

[All example files](/docs/provider/cloudflare/examples)

---

# User documentation

## What this deploys

A push to `main` calls `cloudflare-iac`. Terraform, from `snow-monkeys-infra/iac-terraform`, creates a Pages project named `pages-cloudflare`. Wrangler then uploads the repository's `infra/` directory to that project on the `main` branch.

The example site is a single `infra/index.html` page titled "Cloudflare Pages test".

The public address is the `server_ip` output. For this type that value is the Pages URL: the `https://` link printed by Wrangler, or `https://` plus the Terraform output `pages_project_subdomain` when Wrangler does not print a URL.

Snow stores that URL on a `RESOURCE` record named `pages-cloudflare`.

| Setting | Value |
|---|---|
| `type` | `cloudflare_pages_project` |
| `resource` | `cloudflare_pages_project` |
| `name` | `pages-cloudflare` |
| `infra` | `infra` |
| `production_branch` | `main` |

## Stateless and stateful

**Stateless** keeps Terraform state on the runner for that job only. Leave `s3_bucket_state` empty. The action deletes `backend.tf`, runs `terraform init`, skips `plan`, and applies. A later workflow run cannot destroy that project from saved state.

**Stateful** stores Terraform state in S3.

1. Call `snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main` with `type: aws_s3_bucket`.
2. Call `cloudflare-iac` with `s3_bucket_state` and `state_values`.
3. The Pages job must `needs` the bucket job.

`state_values` must include `region` and `encrypt` whenever `s3_bucket_state` is set. The examples use:

```yaml
s3_bucket_state: s3-server-state
state_values: |
  bucket_name=s3-server-state
  region=us-east-2
  encrypt=true
```

The state object key is `{name}/{git_type}/{github.actor_id}/{github.sha}`. Create and destroy inside one workflow run share that key. A new push gets a new key. `cloudflare-iac` does not delete the S3 bucket. Remove that bucket separately.

## Prerequisites

- A [Cloudflare](https://dash.cloudflare.com/) account
- An API token that can edit Cloudflare Pages
- The account ID from the dashboard sidebar, or from the URL after `/accounts/`
- A Snow pipeline token
- A GitHub token that can clone `snow-monkeys-infra/iac-terraform` when that repository is private
- For stateful runs, AWS credentials that can use the state bucket

Store them as Actions secrets. Map them to the reusable workflow like this:

| GitHub secret | Workflow secret | Used for |
|---|---|---|
| `CLOUDFLARE_TOKEN` | `cloudflare_token` | Terraform and Wrangler |
| `CLOUDFLARE_ACCOUNT_ID` | `cloudflare_account_id` | Cloudflare account |
| `SNOW_GITHUB_TOKEN` | `snow_github_token` | Clone of the Terraform modules |
| `SNOW_TOKEN_PIPELINE` | `snow_token_pipeline` | Snow notify |
| `AWS_ACCESS_KEY_ID` | `aws_access_key_id` | S3 backend, stateful only |
| `AWS_SECRET_ACCESS_KEY` | `aws_secret_access_key` | S3 backend, stateful only |

The reusable workflow also accepts `snow_token`. The examples pass `snow_token_pipeline`.

To create the API token: open the Cloudflare dashboard, choose your profile, open **API Tokens**, and create a token with **Cloudflare Pages: Edit**. The token is shown once. Save it as `CLOUDFLARE_TOKEN`.

## Repository layout

Put the workflow at `.github/workflows/` in the caller repository. The copies below live under `examples/` so this site can serve them.

```text
.github/workflows/pages-stateless.yml
infra/index.html
```

`infra` defaults to `infra`. Wrangler uploads that directory with `npx wrangler@3 pages deploy`. The directory must exist. The example contains only `index.html`. Add the rest of the static site in that same directory.

| File | Role |
|---|---|
| [pages-stateless.yml](/docs/provider/cloudflare/examples?file=stateless/pages/workflows/pages-stateless.yml) | Stateless create |
| [index.html](/docs/provider/cloudflare/examples?file=stateless/pages/infra/index.html) | Page uploaded to the project |
| [pages-statefull-s3.yml](/docs/provider/cloudflare/examples?file=stateful/pages/workflows/pages-statefull-s3.yml) | S3 bucket, then create |
| [pages-statefull-s3-destroy.yml](/docs/provider/cloudflare/examples?file=stateful/pages/workflows/pages-statefull-s3-destroy.yml) | Same, then `destroy: true` |

Pages upload does not use SSH and does not run `init.sh`. SSH bootstrap in this workflow runs only for `type: cloudflare_server`.

## Stateless workflow

Full file: [pages-stateless.yml](/docs/provider/cloudflare/examples?file=stateless/pages/workflows/pages-stateless.yml)

```yaml
name: Pages Stateless

on:
  push:
    branches: [ "main" ]

jobs:
  create_pages_project_on_cloudflare:
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      resource: cloudflare_pages_project
      name: pages-cloudflare
      infra: infra
      type_values: |
        production_branch=main
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }}
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  use-output-pages-project:
    needs: create_pages_project_on_cloudflare
    runs-on: ubuntu-22.04
    steps:
      - run: echo "Pages URL is ${{ needs.create_pages_project_on_cloudflare.outputs.server_ip }}"
```

`type_values` is written into the Terraform module `.env` and exported as `TF_VAR_*`. `production_branch=main` becomes `TF_VAR_production_branch`. Wrangler deploys to that branch, and uses `main` when the value is empty.

Terraform also receives `TF_VAR_cloudflare_token`, `TF_VAR_cloudflare_api_token`, `TF_VAR_cloudflare_account_id`, `TF_VAR_account_id`, and `TF_VAR_name`.

## Stateful workflow

Full files:

- [pages-statefull-s3.yml](/docs/provider/cloudflare/examples?file=stateful/pages/workflows/pages-statefull-s3.yml)
- [pages-statefull-s3-destroy.yml](/docs/provider/cloudflare/examples?file=stateful/pages/workflows/pages-statefull-s3-destroy.yml)

The Pages job depends on `create_s3_bucket`. Destroy is a later job in the same workflow, with `destroy: true`, the same `name`, the same bucket, and `state_values` that include `region=us-east-2` and `encrypt=true`.

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
        encrypt=false
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}

  create_pages_project_on_cloudflare:
    needs: create_s3_bucket
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      type: cloudflare_pages_project
      resource: cloudflare_pages_project
      name: pages-cloudflare
      infra: infra
      type_values: |
        production_branch=main
      s3_bucket_state: s3-server-state
      state_values: |
        bucket_name=s3-server-state
        region=us-east-2
        encrypt=true
    secrets:
      cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }}
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

## Outputs

| Output | Meaning |
|---|---|
| `server_ip` | Pages URL for this type |
| `terraform_output` | `terraform output -json` |
| `terraform_vars` | Non-secret `TF_VAR_*` values as JSON |

`address`, `container_name`, `docker_output`, and `docker_vars` stay empty for this type. Those outputs belong to `docker_compose` and `docker_compose_app`. The Pages examples do not use those types.

## Checks

- The Actions log prints a Pages URL in `server_ip`
- The URL serves `infra/index.html`
- Cloudflare **Workers & Pages** shows the project `pages-cloudflare`
- Snow shows a `RESOURCE` whose name is `pages-cloudflare` and whose provider is `cloudflare`

---

# Agent AI documentation

Use this section to create or update a repository that deploys Cloudflare Pages the way the examples do.

## Goal

Create a caller repository that:

1. Calls `snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main` with `type: cloudflare_pages_project`
2. Ships a static site in `infra/`, starting from `infra/index.html`
3. Publishes `server_ip` as the Pages URL
4. Uses S3 state only when the user asked for a stateful project, and destroys in the same workflow run

Read the example files instead of inventing a build pipeline:

| Kind | Workflow | Site |
|---|---|---|
| Stateless | [/md/providers/cloudflare/examples/stateless/pages/workflows/pages-stateless.yml](/md/providers/cloudflare/examples/stateless/pages/workflows/pages-stateless.yml) | [/md/providers/cloudflare/examples/stateless/pages/infra/index.html](/md/providers/cloudflare/examples/stateless/pages/infra/index.html) |
| Stateful | [/md/providers/cloudflare/examples/stateful/pages/workflows/pages-statefull-s3.yml](/md/providers/cloudflare/examples/stateful/pages/workflows/pages-statefull-s3.yml) | [/md/providers/cloudflare/examples/stateful/pages/infra/index.html](/md/providers/cloudflare/examples/stateful/pages/infra/index.html) |
| Stateful destroy | [/md/providers/cloudflare/examples/stateful/pages/workflows/pages-statefull-s3-destroy.yml](/md/providers/cloudflare/examples/stateful/pages/workflows/pages-statefull-s3-destroy.yml) | same `infra/` |

Place workflows at `.github/workflows/` in the caller repository.

## Call contract

```yaml
uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
with:
  type: cloudflare_pages_project
  resource: cloudflare_pages_project
  name: pages-cloudflare
  infra: infra
  type_values: |
    production_branch=main
  # stateful only:
  # s3_bucket_state: s3-server-state
  # state_values: |
  #   bucket_name=s3-server-state
  #   region=us-east-2
  #   encrypt=true
  # destroy: true
secrets:
  cloudflare_token: ${{ secrets.CLOUDFLARE_TOKEN }}
  cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
  snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
  snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  # stateful only:
  # aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
  # aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

Workflow inputs and secret keys are `snake_case`. GitHub secret names are `SCREAMING_SNAKE_CASE`. Snow query fields are filled inside `cloudflare-iac`. Callers do not send them.

## Rules

- Call `snow-monkeys-modules/cloudflare-iac`. The live examples do not call `cloudflare-static-website`, and they do not pass `framework`, `project-name`, `build-directory`, or `build-command`.
- `type` and `resource` are both `cloudflare_pages_project`. An empty `resource` is copied from `type`. Terraform runs in `iac-terraform/v1/modules/dev/cloudflare/cloudflare_pages_project`.
- `name` is the Pages project name and the Snow resource name. Wrangler deploys with `--project-name` set to `name`.
- `infra/` must exist in the caller repository. The action runs `npx --yes wrangler@3 pages deploy <infra> --project-name <name> --branch <production_branch> --commit-dirty=true`.
- Put `production_branch=main` in `type_values`. Wrangler reads `TF_VAR_production_branch` and falls back to `main`.
- Pass `cloudflare_token`, `cloudflare_account_id`, `snow_github_token`, and `snow_token_pipeline`. The action clones `snow-monkeys-infra/iac-terraform` with the GitHub token.
- Pass tokens only through `secrets:`.
- Pages jobs do not need SSH keys or `init.sh`.
- After a successful deploy, the workflow output `server_ip` is the Wrangler `pages_url`, or the Terraform subdomain URL when Wrangler prints no `https://` link.
- Snow notify uses `type: RESOURCE` and `url` = `server_ip`, plus `terraform_output` and `terraform_vars`. `actor_id` and `actor_name` come from `github.actor_id` and `github.actor`.
- Stateful create `needs` the `aws-iac` bucket job. `state_values` includes `region` and `encrypt`.
- The state key includes `github.sha`. Put `destroy: true` in the same workflow run as create, with the same `name`, bucket, and `state_values`.
- `cloudflare_server` is the only type that SSHes and runs `init.sh`. `docker_compose` and `docker_compose_app` are separate types and are not part of these Pages examples.

## Prompt

```text
Using https://docs.snow-monkeys.com/md/providers/cloudflare/pages.md
and the example files under https://docs.snow-monkeys.com/md/providers/cloudflare/examples/stateless/pages/

Add .github/workflows/pages-stateless.yml that calls
snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
with type cloudflare_pages_project, resource cloudflare_pages_project,
name pages-cloudflare, infra infra, and type_values production_branch=main.

Map cloudflare_token, cloudflare_account_id, snow_github_token, and
snow_token_pipeline from GitHub Actions secrets.

Add infra/index.html from the example. Do not add a framework build step.

Print needs.create_pages_project_on_cloudflare.outputs.server_ip in a later job.
For a stateful project, create the S3 bucket with aws-iac first, pass
s3_bucket_state and state_values (region and encrypt), and destroy with
destroy: true in that same workflow run.
```

## Raw documentation URL

```text
https://docs.snow-monkeys.com/md/providers/cloudflare/pages.md
```
