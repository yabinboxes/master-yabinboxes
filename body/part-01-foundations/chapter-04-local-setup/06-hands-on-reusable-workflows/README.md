# 6. Hands-on Reusable Workflows

> Status: written (pointer). Secrets and toolchain for the callers in Chapter 5.

Before you dispatch Listing 5.2 you need GitHub repository secrets and the tools in [requirements.txt](./requirements.txt).

| Secret | Maps to |
| --- | --- |
| `HETZNER_CLOUD_TOKEN` | `secrets.hcloud_token` |
| `SSH_PUBLIC_KEY`, `SSH_PRIVATE_KEY` | `ssh_public_key`, `ssh_private_key` |
| `SNOW_TOKEN`, `SNOW_TOKEN_PIPELINE` | Snow notify and host resolution |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | AWS types and S3 backends |

> **Warning:** Secrets go under `secrets:`, never under `with:`.

Copy-paste YAML: [Chapter 5](../../../part-02-core-patterns/chapter-05-reusable-workflows/06-hands-on-reusable-workflows/).
