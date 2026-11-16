# 6. Hands-on Reusable Workflows

> Status: written (pointer). Type catalog is exercised in Chapters 5–9.

`type` is a snake_case Terraform folder or `docker_compose` / `docker_compose_app`. Empty `resource` copies `type`. Full table: Chapter 5. Provider listings: Chapters 6–9. Catalog file: `snow-monkeys-modules/master-modules/list-of-resources.md`.

```yaml
# snippet
with:
  type: hcloud_server   # CLUSTER — Chapter 7
  # type: aws_s3_bucket # RESOURCE — Chapter 9, Listing 9.1
  # type: build_and_push_image  # Chapter 6, Listing 6.1
```

See [Chapter 5 — Hands-on](../../../part-02-core-patterns/chapter-05-reusable-workflows/06-hands-on-reusable-workflows/).
