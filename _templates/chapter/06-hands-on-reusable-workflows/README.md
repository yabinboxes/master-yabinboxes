# 6. Hands-on Reusable Workflows

> Status: template. For provider chapters, copy the runnable listings from Chapter 5 and retarget `uses:` / `type`.

A reusable workflow is `on: workflow_call` in `snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml`. Callers in `yabinboxes/main-examples/` pass `type`, `type_values`, `name`, and secrets.

Canonical how-to and listings: [Chapter 5 — Hands-on Reusable Workflows](../../../body/part-02-core-patterns/chapter-05-reusable-workflows/06-hands-on-reusable-workflows/).

Docker image builds: [Chapter 6](../../../body/part-02-core-patterns/chapter-06-docker-iac/06-hands-on-reusable-workflows/).

Put complete YAML in this folder. Number listings as **Listing N.M**. Show expected `Output`. List dependencies in [requirements.txt](./requirements.txt) at first use.
