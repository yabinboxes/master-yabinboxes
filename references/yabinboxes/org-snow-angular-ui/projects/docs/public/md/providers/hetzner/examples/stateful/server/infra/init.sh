#!/bin/bash
# Script used by:
#   .github/workflows/server-statefull-s3.yml
#   .github/workflows/server-statefull-s3-destroy.yml

set -e

bash ./init/setup-docker.sh
bash ./init/setup-nginx.sh