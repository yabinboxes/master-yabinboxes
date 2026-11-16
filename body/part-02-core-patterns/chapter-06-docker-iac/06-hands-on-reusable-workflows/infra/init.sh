#!/usr/bin/env bash
# listing_6_6_init_sh
set -euo pipefail
cd "$(dirname "$0")"
docker compose pull
docker compose up -d
docker compose ps --format '{{.Name}}' | head -n 1
