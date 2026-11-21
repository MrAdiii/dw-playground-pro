#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "==> Deploying DataWeave Playground Pro with Nginx Spike Guard..."
docker compose -f docker-compose.yml -f docker-compose.nginx.yml up -d

echo ""
echo "Service started with Nginx Spike Guard (Rate Limit: ${RATE_LIMIT_RPS:-10r/m}, Burst: ${RATE_LIMIT_BURST:-5})."
echo "Local URL:   http://localhost:8091"
echo "Subpath URL: http://localhost:8091/dataweave-playground-pro/"
echo "To stop:     docker compose -f docker-compose.yml -f docker-compose.nginx.yml down"
