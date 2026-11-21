$ErrorActionPreference = 'Stop'
$RootDir = $PSScriptRoot

Write-Host "==> Deploying DataWeave Playground Pro with Cloudflare Tunnel..."
Set-Location $RootDir

docker compose -f docker-compose.yml -f docker-compose.cloudflared.yml up -d

Write-Host ""
Write-Host "Service started with Cloudflare Tunnel sidecar."
Write-Host "Local URL:  http://localhost:8091"
Write-Host "Tunnel URL: check logs with 'docker logs cloudflared'"
Write-Host "To stop:    docker compose -f docker-compose.yml -f docker-compose.cloudflared.yml down"
