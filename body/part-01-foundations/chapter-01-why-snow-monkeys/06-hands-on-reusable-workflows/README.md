# 6. Hands-on Reusable Workflows

> Status: written (pointer). Runnable callers live in Chapter 5.

Snow Monkeys exists so a caller repository can provision CLUSTER, RESOURCE, SERVICE, or APPLICATION without copying Terraform. The first runnable job is Chapter 5, Listing 5.1.

```yaml
# snippet — full file: Chapter 5, listing_5_1_caller_skeleton.yml
jobs:
  provision:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: hcloud_server
      name: example-cluster
```

```text
Output
Jobs: provision (reusable workflow)
Snow notify kind: CLUSTER
```

See [Chapter 5 — Hands-on](../../../part-02-core-patterns/chapter-05-reusable-workflows/06-hands-on-reusable-workflows/).
