#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "==> Deploying DataWeave Playground Pro (Direct / No Nginx)..."
docker compose -f docker-compose.yml up -d

echo ""
echo "Service started directly without Nginx."
echo "Access URL: http://localhost:8091"
echo "To stop:    docker compose -f docker-compose.yml down"
