# 1. Conceptual explanation

`yabinboxes/main-examples` is the set of caller workflows. A caller does not contain the Terraform or the compose actions. Each caller job calls a reusable workflow in `snow-monkeys-modules`:

```yaml
uses: snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml@main
```

`type` is a name from `snow-monkeys-modules/master-modules/list-of-resources.md`. That file is the rule set kept by `master-modules` (Chapter 3). The implementation of each `type` is the provider module, for example `snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml`.

Chapter 1 states the goal: a dashboard to visualize deployment activity, and reusable workflows to integrate automated deployment. These examples are the caller side of those workflows. Chapter 2 names the deployment types used below: Infrastructure, Services, and Applications.

| Chapter 2 deployment type | `type` in `main-examples` | Snow notify, from `list-of-resources.md` |
| --- | --- | --- |
| Infrastructure, virtual instance (server) | `hcloud_server` | `CLUSTER` |
| Infrastructure, firewall, network, volume, volume attachment, floating IP | `hcloud_firewall`, `hcloud_network`, `hcloud_volume`, `hcloud_volume_attachment`, `hcloud_floating_ip` | `RESOURCE` |
| Infrastructure, bucket | `aws_s3_bucket` | `RESOURCE` |
| Infrastructure, Cloudflare Pages project | `cloudflare_pages_project` | `RESOURCE` |
| Services | `docker_compose` | `SERVICE` |
| Applications | `docker_compose_app` | `APPLICATION` |

`main-examples` has callers for Hetzner, AWS, and Cloud Flare. Chapter 2 also lists Local Mac computer, Azure, Google Cloud, Digital Ocean, and Civo. Those providers are not given a caller workflow in `main-examples`. Their `type` names, where a module exists, are in `list-of-resources.md`.

- [Infrastructure](./infrastructure.md)
- [Services](./services.md)
- [Applications](./applications.md)
- [Stateful create and destroy](./stateful.md)
