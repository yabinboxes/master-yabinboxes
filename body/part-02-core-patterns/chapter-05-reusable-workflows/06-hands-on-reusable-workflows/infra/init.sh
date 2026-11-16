#!/usr/bin/env bash
# listing_5_8_init_sh
# Runs on the remote host after the reusable workflow copies `infra/`.
# Print the container name on the last line — snow-iac uses it for notify.

set -euo pipefail
cd "$(dirname "$0")"
docker compose up -d
docker compose ps --format '{{.Name}}' | head -n 1
