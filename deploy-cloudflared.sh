#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "==> Deploying DataWeave Playground Pro with Cloudflare Tunnel..."
docker compose -f docker-compose.yml -f docker-compose.cloudflared.yml up -d

echo ""
echo "Service started with Cloudflare Tunnel sidecar."
echo "Local URL:  http://localhost:8091"
echo "Tunnel URL: check logs with 'docker logs cloudflared'"
echo "To stop:    docker compose -f docker-compose.yml -f docker-compose.cloudflared.yml down"
