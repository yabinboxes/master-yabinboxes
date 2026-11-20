# DigitalOcean Test Flow

**Author:** Yabin Monroy Mendez  
**Description:** End-to-end flow for `examples/.github/workflows/test-digitalocean.yml`.  
**Workflow name:** `Automation test DigitalOcean modules` (`name` and `run-name`)

## Purpose

This workflow is the DigitalOcean test bed. The master orchestrator
starts it with `automation-digitalocean-test-event`. It follows
[test-suite-rules.md](test-suite-rules.md) in this order:

1. Provision AWS S3 state storage.
2. Create and destroy one catalog resource in one job.
3. Create a server.
4. Deploy a Docker Compose service on that server.
5. Deploy a Docker Compose application on that server.
6. Destroy the server.

The catalog has no type `resource`, so step 2 calls DigitalOcean IAC
with `type: resource` and leaves `resource` empty. Step 3 uses
`digitalocean_droplet`.

## DigitalOcean resources

Catalog from `snow-monkeys-infra/master-infra/list-of-resources.md`.
Both resources use type `server`.

| Resource | Type | Job in this workflow |
| --- | --- | --- |
| `digitalocean_droplet` | server | `create_server_on_digitalocean`, `destroy_server_on_digitalocean` |
| `digitalocean_droplet_autoscale` | server | — |

This workflow exercises `digitalocean_droplet` as the server. Droplet
autoscale is in the catalog and has no job here.

## Trigger

```yaml
on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-digitalocean-test-event ]
```

## Job sequence

### 1. `checkout`

Runs on `ubuntu-22.04` and checks out the `examples` repository with
`actions/checkout@v4`.
