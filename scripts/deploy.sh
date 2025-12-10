#!/bin/bash
set -e
VPS_HOST="188.245.166.93"
VPS_USER="root"
APP_DIR="/opt/toolradar"
echo "=== Deploying Toolradar ==="
ssh $VPS_USER@$VPS_HOST "cd $APP_DIR && git pull origin main"
ssh $VPS_USER@$VPS_HOST "cd $APP_DIR && docker compose build app && docker compose up -d"
ssh $VPS_USER@$VPS_HOST "cd $APP_DIR && docker compose exec app npx prisma migrate deploy"
echo "=== Done ==="
