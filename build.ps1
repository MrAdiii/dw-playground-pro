$ErrorActionPreference = 'Stop'
$RootDir = $PSScriptRoot

Write-Host "==> Validating Mule runtime..."
if (-not (Test-Path "$RootDir\mule-runtime\bin\mule")) {
    Write-Host ""
    Write-Host "ERROR: mule-runtime\bin\mule not found."
    Write-Host "  Extract your Mule runtime into mule-runtime\ so that mule-runtime\bin\mule exists."
    exit 1
}

Write-Host "==> Building Mule application..."
Set-Location $RootDir
mvn clean package
if (-not $?) { exit 1 }

Write-Host "==> Copying jar to apps\..."
Copy-Item "$RootDir\target\*-mule-application.jar" -Destination "$RootDir\apps\dw-playground-pro.jar"

Write-Host "==> Building Docker image..."
docker build -t dw-playground-pro .
if (-not $?) { exit 1 }

Write-Host ""
Write-Host "Image built: dw-playground-pro"
Write-Host "Run it with:  docker-compose up -d"
Write-Host "Open:         http://localhost:8081"
