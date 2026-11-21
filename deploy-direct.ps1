$ErrorActionPreference = 'Stop'
$RootDir = $PSScriptRoot

Write-Host "==> Deploying DataWeave Playground Pro (Direct / No Nginx)..."
Set-Location $RootDir

docker compose -f docker-compose.yml up -d

Write-Host ""
Write-Host "Service started directly without Nginx."
Write-Host "Access URL: http://localhost:8091"
Write-Host "To stop:    docker compose -f docker-compose.yml down"
