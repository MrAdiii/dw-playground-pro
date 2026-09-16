#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Validating Mule runtime..."
if [ ! -f "$ROOT_DIR/mule-runtime/bin/mule" ]; then
  echo ""
  echo "ERROR: mule-runtime/bin/mule not found."
  echo "  Extract your Mule runtime into mule-runtime/ so that mule-runtime/bin/mule exists."
  exit 1
fi

echo "==> Building Mule application..."
cd "$ROOT_DIR"
mvn clean package

echo "==> Copying jar to apps/..."
cp target/*-mule-application.jar apps/dw-playground-pro.jar

echo "==> Building Docker image..."
docker build -t dw-playground-pro .

echo ""
echo "Image built: dw-playground-pro"
echo "Run it with:  docker-compose up -d"
echo "Open:         http://localhost:8091"
