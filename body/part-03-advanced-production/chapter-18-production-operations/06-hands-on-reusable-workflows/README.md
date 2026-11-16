# 6. Hands-on Reusable Workflows

> Status: written (pointer). Production destroy and state hygiene.

- Keep CLUSTER, RESOURCE, SERVICE, and APPLICATION in separate repositories.
- Stateful stacks pass `s3_bucket_state` (Chapter 5, Listing 5.6).
- Destroy compute with `destroy: true` before deleting the state bucket (Listing 5.10).
- Pin `tag` on `docker-iac` image builds (Chapter 6, Listing 6.1).

```yaml
# snippet — Chapter 5, listing_5_10_destroy.yml
with:
  type: hcloud_server
  name: server-stateful
  destroy: true
  s3_bucket_state: s3-server-state
```

```text
Output
terraform destroy: 1 destroyed
```

> **Warning:** Deleting the S3 state bucket first leaves Terraform with no state.

Full files: [Chapter 5](../../../part-02-core-patterns/chapter-05-reusable-workflows/06-hands-on-reusable-workflows/).
