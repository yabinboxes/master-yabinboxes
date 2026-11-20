# 1. Conceptual explanation

A GitHub runner is the machine that executes a GitHub Actions job.

In Snow Monkeys, the caller workflow and the reusable workflow run on a GitHub-hosted runner. The job sets this with `runs-on: ubuntu-22.04`. On that runner the workflow checks out the caller repository, then runs Terraform or connects by SSH to the host that was provisioned.

The runner is not the Hetzner server, the Docker host, or the Snow dashboard. It is only the GitHub machine that runs the workflow.
