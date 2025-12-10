#!/bin/bash
set -e
DOMAIN="toolradar.com"
EMAIL="admin@toolradar.com"
docker compose down 2>/dev/null || true
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email
mkdir -p certbot/conf certbot/www
cp -rL /etc/letsencrypt/* certbot/conf/
echo "=== SSL setup complete ==="
