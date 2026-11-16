# 6. Hands-on Reusable Workflows

> Status: written (pointer). `type_values` is how callers feed Terraform.

The reusable workflow does not take one input per variable. It takes a `KEY=VALUE` block. The composite action writes `.env` and exports `TF_VAR_<key>`. Remote state uses `s3_bucket_state` plus `state_values`.

```yaml
# snippet — Chapter 5, Listing 5.6
type_values: |
  server_type=cpx11
  image=ubuntu-24.04
  location=hel1
s3_bucket_state: s3-server-state
state_values: |
  bucket_name=s3-server-state
  region=us-east-2
  encrypt=true
```

```text
Output
TF_VAR_server_type=cpx11
backend: s3 bucket s3-server-state
```

Full files: [Chapter 5, Listing 5.6](../chapter-05-reusable-workflows/06-hands-on-reusable-workflows/listing_5_6_stateful_s3.yml) and [Chapter 9, Listing 9.1](../chapter-09-cloud-provider-modules/06-hands-on-reusable-workflows/listing_9_1_aws_s3_bucket.yml).
