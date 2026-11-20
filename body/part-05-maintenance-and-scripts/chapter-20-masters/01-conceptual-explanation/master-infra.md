# master-infra

`snow-monkeys-infra/master-infra/main.md` has one task: call and implement `master.md`.

`master.md` tells the run to create branch `updates` on `github.com/snow-monkeys-infra/iac-terraform` when that branch is missing, read the Terraform registry, and implement the provider plans:

- `master-hetzner.md`
- `master-aws.md`
- `master-azure.md`
- `master-cloudflare.md`
- `master-digitalocean.md`
- `master-gcp.md`

Each of those plans reads the server and resource rows of `list-of-resources.md`, matches them to folders under `iac-terraform/v1/modules/dev/<provider>`, updates a folder that already exists, creates a folder that does not, and commits on the local `iac-terraform` checkout. Each plan points at `iac-structure/TERRAFORM_COMPLIANCE.md`. The other files in `iac-structure` are `FLOW.md`, `INPUTS_OUTPUTS.md`, `NAMING.md`, `INTERNAL.md`, and `EXAMPLES.md`.

`master-civo.md` says `Tasks: Nothing to do...`. The monthly plan does not update Civo from that file. The directories `v1/modules/dev/civo/bucket`, `compute`, and `observability` are already in `iac-terraform`. `kubernetes` is a `type` in `list-of-resources.md` and is not a directory there. Civo Kubernetes is implemented in `civo-iac`, described in [master-modules](./master-modules.md).

`docker_compose` and `docker_compose_app` are types in `list-of-resources.md`. They are not Terraform directories. Their implementation is the compose actions in `snow-monkeys-modules`.

## monthly-master.yml

The file is `master-infra/.github/workflows/monthly-master.yml`. The workflow `name` is `Weekly Master Run`. The `schedule` cron is commented out. The trigger that runs is `workflow_dispatch`.

The job `master` checks out this repository, installs the Cursor CLI, authenticates `gh` with `SNOW_GITHUB_TOKEN`, and runs `cursor-agent` with a prompt that says to read `main.md` and `master.md` and execute the plan. The workflow steps do not clone `iac-terraform`. The checkout of `iac-terraform` and the branch name `updates` are steps inside `master.md` and the provider plans, which that prompt tells the agent to execute.

`org-master/main.md` describes this file as the monthly run that writes Terraform into branch `updates`. The workflow file above is the implementation of that sentence.

Chapter 10 is the source of the Terraform projects this plan maintains. The walkthrough lists which plan owns which directory.
