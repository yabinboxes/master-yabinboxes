# Azure Test Flow

**Author:** Yabin Monroy Mendez  
**Description:** End-to-end flow for `examples/.github/workflows/test-azure.yml`.  
**Workflow name:** `Automation test Azure modules` (`name` and `run-name`)

## Purpose

This workflow is the Azure test bed. The master orchestrator starts it
with `automation-azure-test-event`. It follows
[test-suite-rules.md](test-suite-rules.md) in this order:

1. Provision AWS S3 state storage.
2. Create and destroy one catalog resource in one job.
3. Create a server.
4. Deploy a Docker Compose service on that server.
5. Deploy a Docker Compose application on that server.
6. Destroy the server.

Step 2 uses `azurerm_linux_web_app`. The catalog has no type `server`,
so steps 3 and 6 call Azure IAC with `type: server` and leave `resource`
empty.

## Azure resources

Catalog from `snow-monkeys-infra/master-infra/list-of-resources.md`.
Every resource in this catalog uses type `resource`.

| Resource | Type | Job in this workflow |
| --- | --- | --- |
| `azurerm_linux_web_app` | resource | `create_web_app_on_azure` |
| `azurerm_linux_function_app` | resource | — |
| `azurerm_mssql_server` | resource | — |
| `azurerm_mssql_database` | resource | — |
| `azurerm_postgresql_server` | resource | — |
| `azurerm_postgresql_database` | resource | — |
| `azurerm_mysql_flexible_server` | resource | — |
| `azurerm_mysql_flexible_database` | resource | — |

This workflow exercises `azurerm_linux_web_app`. Function app, SQL,
PostgreSQL, and MySQL entries are in the catalog and have no job here.

## Trigger

```yaml
on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-azure-test-event ]
```

## Job sequence

### 1. `checkout`

Runs on `ubuntu-22.04` and checks out the `examples` repository with
`actions/checkout@v4`.
