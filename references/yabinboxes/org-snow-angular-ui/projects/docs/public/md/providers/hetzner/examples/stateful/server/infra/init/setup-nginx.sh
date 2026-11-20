#!/bin/bash

set -e

cd /tmp/init/nginx

echo "Starting API service on port 8080..."
docker compose up -d
