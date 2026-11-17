# 4. Walkthrough

Line-by-line of Listing 6.1, `listing_6_1_caller_skeleton.yml`. Full files: [03-hands-on-example](../03-hands-on-example/).

## Listing 6.1

```yaml
jobs:
  provision:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
```

`uses:` points at the reusable workflow, not at a copy of Terraform. The `@main` ref is the module branch; pin a tag in production.

```yaml
    with:
      type: hcloud_server
      name: example-cluster
      type_values: |
        server_type=cpx11
        image=ubuntu-24.04
        location=hel1
```

`type` selects the Terraform folder `iac-terraform/hcloud_server` and the Snow notify kind CLUSTER. `name` is the Snow resource name later compose jobs pass as `host`. `type_values` become `TF_VAR_*`.

```yaml
    secrets:
      hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

Tokens are GitHub secrets mapped onto the workflow’s secret names. They never appear under `with:`.

Listing 6.2 adds a follow-up job that prints `needs.create_server.outputs.server_ip`. Listing 6.9 sets `host:` on `docker_compose_app` to that same Snow name. Listing 6.10 passes `destroy: true` with the same `s3_bucket_state` as the create run.
