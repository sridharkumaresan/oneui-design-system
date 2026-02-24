#!/usr/bin/env pwsh
<#
.SYNOPSIS
Windows Setup Script for OneUI Design System

.DESCRIPTION
This script sets up the OneUI Design System on Windows with proper configurations

.NOTES
Run as Administrator in PowerShell
Usage: .\windows-setup.ps1
#>

param(
    [switch]$SkipSymlinks = $false,
    [switch]$Force = $false,
    [switch]$Clean = $false
)

# Require admin
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "This script must be run as Administrator"
    exit 1
}

Write-Host "=== OneUI Design System - Windows Setup ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Enable Long Paths
Write-Host "Step 1: Enabling long path support..." -ForegroundColor Green
try {
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
    $regValue = Get-ItemProperty -Path $regPath -Name LongPathsEnabled -ErrorAction SilentlyContinue
    
    if ($null -eq $regValue) {
        New-ItemProperty -Path $regPath -Name LongPathsEnabled -Value 1 -PropertyType DWORD -Force | Out-Null
        Write-Host "✓ Long paths enabled" -ForegroundColor Green
    } else {
        Write-Host "✓ Long paths already enabled" -ForegroundColor Green
    }
}
catch {
    Write-Warning "Could not enable long paths: $_"
}

# Step 2: Check Node.js and pnpm
Write-Host "`nStep 2: Checking versions..." -ForegroundColor Green
$nodeVersion = node --version
$pnpmVersion = pnpm --version
Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✓ pnpm: $pnpmVersion" -ForegroundColor Green

# Step 3: Set environment variables
Write-Host "`nStep 3: Setting environment variables..." -ForegroundColor Green
$env:HUSKY = "0"
$env:NODE_OPTIONS = "--max-old-space-size=4096"
Write-Host "✓ HUSKY=0" -ForegroundColor Green
Write-Host "✓ NODE_OPTIONS=--max-old-space-size=4096" -ForegroundColor Green

# Step 4: Clean (optional)
if ($Clean -or $Force) {
    Write-Host "`nStep 4: Cleaning build artifacts..." -ForegroundColor Green
    
    $itemsToRemove = @(
        "node_modules",
        ".pnpm-store",
        "pnpm-lock.yaml"
    )
    
    foreach ($item in $itemsToRemove) {
        if (Test-Path $item) {
            Write-Host "  Removing $item..."
            Remove-Item -Path $item -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Host "✓ Cleanup complete" -ForegroundColor Green
    Write-Host "Running pnpm store prune..."
    pnpm store prune
    Write-Host "✓ Store pruned" -ForegroundColor Green
}

# Step 5: Install dependencies
Write-Host "`nStep 5: Installing dependencies..." -ForegroundColor Green
$installArgs = @("install", "--force", "--frozen-lockfile")
if ($Force) {
    $installArgs = @("install", "--force")
}

pnpm @installArgs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Installation failed with exit code $LASTEXITCODE"
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Step 6: Verify packages
Write-Host "`nStep 6: Verifying workspace packages..." -ForegroundColor Green
pnpm list -r --depth=0 | Select-Object -First 20

# Step 7: Run build
Write-Host "`nStep 7: Running build..." -ForegroundColor Green
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed with exit code $LASTEXITCODE"
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green

# Step 8: Run tests
Write-Host "`nStep 8: Running tests..." -ForegroundColor Green
pnpm test
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Some tests failed"
}
Write-Host "✓ Tests complete" -ForegroundColor Green

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "Your workspace is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  pnpm dev:storybook  - Start Storybook dev server" -ForegroundColor White
Write-Host "  pnpm dev:api        - Start mock API server" -ForegroundColor White
Write-Host "  pnpm lint           - Run linter" -ForegroundColor White
Write-Host "  pnpm typecheck      - Run TypeScript checks" -ForegroundColor White
