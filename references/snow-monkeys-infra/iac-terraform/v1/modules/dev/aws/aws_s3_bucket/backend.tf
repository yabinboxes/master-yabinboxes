# Bootstrap: first apply this module with local state
#   terraform init -backend=false && terraform apply
# Then migrate:
#   terraform init -migrate-state \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
#
# Bucket: TF_STATE_BUCKET. Key: TF_STATE_KEY_PREFIX.
# Region: TF_STATE_REGION. Encrypt: TF_STATE_ENCRYPT.
# Terraform cannot interpolate env vars in backend blocks.
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (not TF_VAR_*).
terraform {
  backend "s3" {}
}
