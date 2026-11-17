# Summary

Caller repositories use `snow-monkeys-modules` so Terraform, compose deploy, and Snow notify live in one implementation per provider. Your YAML only selects the module, the `type`, public `type_values`, and secrets.

How to use a module:

1. `uses: snow-monkeys-modules/<provider>-iac/.github/workflows/main.yml@<ref>`
2. Set `type` (`hcloud_server`, `aws_instance`, `docker_compose`, `docker_compose_app`, `build_and_push_image`, …).
3. Set Snow `name`. Compose jobs pass that CLUSTER name as `host`.
4. Pass Terraform variables in `type_values`. Put tokens under `secrets:`.
5. Read `needs.<job>.outputs.server_ip` (or `address`, `container_name`).
6. For state, create an S3 bucket first, then set `s3_bucket_state`. Destroy compute with `destroy: true` before deleting the bucket.

`yabinboxes/main-examples/` is the caller catalog this chapter copies. Runnable files are Listings 6.1–6.29 plus `copy_listing.sh` (Listing 6.30).
