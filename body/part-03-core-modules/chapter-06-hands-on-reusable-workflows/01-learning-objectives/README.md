# 1. Learning objectives

After this chapter you will be able to:

- Explain why a caller repository uses `snow-monkeys-modules` instead of copying Terraform or compose actions
- Call a provider module with `uses:`, `with:`, and `secrets:` from a GitHub Actions workflow
- Choose `type` for CLUSTER, RESOURCE, SERVICE, APPLICATION, or `build_and_push_image`, and pass `type_values` without putting secrets under `with:`
- Chain a CLUSTER job to compose SERVICE or APPLICATION jobs using the Snow `name` as `host`, reading `server_ip` / `address` from job outputs
- Destroy a stateful stack with `destroy: true` while keeping the S3 backend until compute is gone
