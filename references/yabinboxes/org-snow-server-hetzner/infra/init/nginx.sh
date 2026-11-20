#!/bin/bash

set -e

DOMAINS=(
    "snow-monkeys.com"
    "www.snow-monkeys.com"
    "api.snow-monkeys.com"
    "health.snow-monkeys.com"
    "docs.snow-monkeys.com"
)

echo "Updating system..."
sudo apt update

echo "Installing Nginx..."
sudo apt install -y nginx

echo "Creating nginx configuration..."

sudo tee /etc/nginx/sites-available/snow-monkeys >/dev/null <<'EOF'

# API Backend
server {
    listen 80;
    server_name api.snow-monkeys.com;

    location / {
        proxy_pass http://127.0.0.1:8080;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}


# Health Application
server {
    listen 80;
    server_name health.snow-monkeys.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}


# Main Website
server {
    listen 80;
    server_name snow-monkeys.com www.snow-monkeys.com;

    location / {
        proxy_pass http://127.0.0.1:4200;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}


# Documentation Website
server {
    listen 80;
    server_name docs.snow-monkeys.com;

    location / {
        proxy_pass http://127.0.0.1:4201;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

EOF


echo "Enabling nginx site..."

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/snow-monkeys /etc/nginx/sites-enabled/snow-monkeys


echo "Testing nginx configuration..."

sudo nginx -t


echo "Restarting nginx..."

sudo systemctl enable nginx
sudo systemctl restart nginx


echo "Installing Certbot..."

sudo apt install -y certbot python3-certbot-nginx


echo "Checking DNS and requesting SSL certificates..."

sudo certbot --nginx \
    -d snow-monkeys.com \
    -d www.snow-monkeys.com \
    -d api.snow-monkeys.com \
    -d health.snow-monkeys.com \
    -d docs.snow-monkeys.com \
    --non-interactive \
    --agree-tos \
    --redirect \
    -m admin@snow-monkeys.com


echo "Testing certificate renewal..."

sudo certbot renew --dry-run


echo ""
echo "============================================"
echo "Snow Monkeys deployment complete!"
echo ""
echo "HTTPS routes:"
echo "https://api.snow-monkeys.com       -> localhost:8080"
echo "https://health.snow-monkeys.com    -> localhost:3000"
echo "https://snow-monkeys.com           -> localhost:4200"
echo "https://docs.snow-monkeys.com      -> localhost:4201"
echo ""
echo "SSL certificates installed and auto-renewal enabled"
echo "============================================"