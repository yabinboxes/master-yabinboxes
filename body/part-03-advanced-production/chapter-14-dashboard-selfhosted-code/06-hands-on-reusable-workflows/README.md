# 6. Hands-on Reusable Workflows

> Status: written (pointer). Self-hosted dashboard uses the same notify contract.

Set `snow_host_url` on any Chapter 5 caller to the self-hosted API. Default is `https://api.snow-monkeys.com`.

```yaml
# snippet
with:
  snow_host_url: https://snow.internal
  type: hcloud_server
  name: server-stateless
```

Full callers: [Chapter 5](../../../part-02-core-patterns/chapter-05-reusable-workflows/06-hands-on-reusable-workflows/).
