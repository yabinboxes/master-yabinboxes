#!/bin/bash
# Script used by:
#   .github/workflows/example-1-statefull.yml

set -e

bash ./init/setup-docker.sh
bash ./init/setup-nginx.sh