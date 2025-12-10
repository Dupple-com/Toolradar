#!/bin/bash
set -e
echo "=== Updating system ==="
apt update && apt upgrade -y
echo "=== Installing Docker ==="
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh
echo "=== Installing Docker Compose ==="
apt install -y docker-compose-plugin git
echo "=== Creating app directory ==="
mkdir -p /opt/toolradar
echo "=== Installing Certbot ==="
apt install -y certbot
echo "=== Setup complete ==="
