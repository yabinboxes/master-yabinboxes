# 1. Conceptual explanation

A GitHub local runner is a self-hosted GitHub Actions runner installed on your own computer. GitHub sends the job to that computer instead of to a GitHub-hosted machine. The workflow selects it when `runs-on` matches a label configured on that runner, usually `self-hosted`.

On Ubuntu, the runner is the official Linux runner installed on that Ubuntu machine. Checkout, Terraform, and SSH then run on that Ubuntu computer. The label `ubuntu-22.04` selects a GitHub-hosted Ubuntu runner. It does not select the local Ubuntu computer unless that local runner is also given the label used in `runs-on`.

On Mac, the runner is the official macOS runner installed on that Mac. The job runs on the Mac only when `runs-on` matches the Mac runner's labels, such as `self-hosted` and `macOS`. A job set to `runs-on: ubuntu-22.04` does not run on the Mac.

Snow Monkeys reusable workflows in this book set `runs-on: ubuntu-22.04`, so they use a GitHub-hosted Ubuntu runner. They do not target a local Ubuntu runner or a local Mac runner.
