#!/bin/bash
set -e

bash ./init/init-hetzner.sh
bash ./init/nginx.sh
#bash ./init/grafana-loki.sh