#!/bin/bash

set -e  # exit on error

cd /tmp/

echo "Docker compose up..." >&2
docker compose up -d 2>&1 | tee /dev/stderr > /dev/null

containers=$(docker ps -l --format '{{.Image}}' 2>/dev/null)
echo "containers=$containers"
