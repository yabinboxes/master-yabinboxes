# 1. Learning objectives

After this chapter you will be able to:

- Call a `snow-monkeys-modules` reusable workflow from a caller repository with `uses:`, `with:`, and `secrets:`
- Choose `type` for CLUSTER, RESOURCE, SERVICE, APPLICATION, or `build_and_push_image`
- Pass `type_values`, `s3_bucket_state`, and `state_values` without putting secrets under `with:`
- Chain a CLUSTER job to a compose APPLICATION using the Snow `name` / `host`
- Destroy a stateful stack with `destroy: true` without deleting the S3 backend first
