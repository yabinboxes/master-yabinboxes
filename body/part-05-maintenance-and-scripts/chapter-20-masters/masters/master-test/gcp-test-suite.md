# GCP Test Flow

**Author:** Yabin Monroy Mendez  
**Description:** End-to-end flow for `examples/.github/workflows/test-gcp.yml`.  
**Workflow name:** `Automation test GCP modules` (`name` and `run-name`)

## Purpose

This workflow is the GCP test bed. The master orchestrator starts it
with `automation-gcp-test-event`. It follows
[test-suite-rules.md](test-suite-rules.md) in this order:

1. Provision AWS S3 state storage.
2. Create and destroy one catalog resource in one job.
3. Create a server.
4. Deploy a Docker Compose service on that server.
5. Deploy a Docker Compose application on that server.
6. Destroy the server.

Step 2 uses `google_storage_bucket`. Step 3 uses
`google_compute_instance`.

## GCP resources

Catalog from `snow-monkeys-infra/master-infra/list-of-resources.md`.
Type `server` follows the server path. Type `resource` follows the
resource path.

| Resource | Type | Job in this workflow |
| --- | --- | --- |
| `google_compute_instance` | server | `create_server_on_gcp`, `destroy_server_on_gcp` |
| `google_storage_bucket` | resource | `create_storage_bucket_on_gcp` |
| `google_storage_bucket_object` | resource | — |
| `google_sql_database_instance` | resource | — |

This workflow exercises `google_storage_bucket` as the resource and
`google_compute_instance` as the server. Storage object and Cloud SQL
are in the catalog and have no job here.

## Trigger

```yaml
on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-gcp-test-event ]
```

## Job sequence

### 1. `checkout`

Runs on `ubuntu-22.04` and checks out the `examples` repository with
`actions/checkout@v4`.
