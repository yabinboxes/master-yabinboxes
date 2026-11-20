# Remote state in the bucket created by v1/modules/dev/aws/aws_s3_bucket.
# Terraform cannot interpolate env vars in backend blocks. Pass at init:
#   terraform init \
#     -backend-config="bucket=${TF_STATE_BUCKET}" \
#     -backend-config="key=${TF_STATE_KEY_PREFIX}" \
#     -backend-config="region=${TF_STATE_REGION}" \
#     -backend-config="encrypt=${TF_STATE_ENCRYPT}"
# Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
terraform {
  backend "s3" {}
}

