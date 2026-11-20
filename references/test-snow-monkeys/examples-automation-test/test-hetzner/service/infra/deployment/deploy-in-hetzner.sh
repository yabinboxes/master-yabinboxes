#!/bin/bash

set -e  # exit on error

cd /tmp/

echo "Docker compose up..." >&2
docker compose up -d 2>&1 | tee /dev/stderr > /dev/null

# stdout is the container name. The workflow reads that line for docker logs.
container_name=$(docker ps -l --format '{{.Names}}')
printf '%s\n' "$container_name"
