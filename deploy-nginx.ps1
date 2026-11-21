$ErrorActionPreference = 'Stop'
$RootDir = $PSScriptRoot

Write-Host "==> Deploying DataWeave Playground Pro with Nginx Spike Guard..."
Set-Location $RootDir

docker compose -f docker-compose.yml -f docker-compose.nginx.yml up -d

Write-Host ""
Write-Host "Service started with Nginx Spike Guard (Rate Limit: 10r/m, Burst: 5)."
Write-Host "Local URL:   http://localhost:8091"
Write-Host "Subpath URL: http://localhost:8091/dataweave-playground-pro/"
Write-Host "To stop:     docker compose -f docker-compose.yml -f docker-compose.nginx.yml down"
