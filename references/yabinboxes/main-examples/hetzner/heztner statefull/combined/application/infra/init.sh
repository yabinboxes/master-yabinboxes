#!/bin/bash
# Script used by:
#   .github/workflows/example-1-statefull.yml
#   .github/workflows/example-2-statefull.yml
set -e

bash ./deployment/deploy-in-hetzner.sh
