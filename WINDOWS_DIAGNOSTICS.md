# Windows Build Diagnostics

## Quick Diagnostic Checklist

Run these commands in PowerShell (as Administrator) to diagnose issues:

```powershell
# 1. Check system info
Write-Host "=== System Information ===" -ForegroundColor Cyan
$os = Get-WmiObject -Class Win32_OperatingSystem
Write-Host "OS: $($os.Caption)"
Write-Host "Version: $($os.Version)"
Write-Host "Architecture: $([Environment]::Is64BitOperatingSystem ? '64-bit' : '32-bit')"
Write-Host ""

# 2. Check Node.js and pnpm
Write-Host "=== Node.js & pnpm ===" -ForegroundColor Cyan
Write-Host "Node version: $(node --version)"
Write-Host "npm version: $(npm --version)"
Write-Host "pnpm version: $(pnpm --version)"
Write-Host ""

# 3. Check npm config
Write-Host "=== npm Configuration ===" -ForegroundColor Cyan
npm config list | Select-Object -First 20
Write-Host ""

# 4. Check long paths registry
Write-Host "=== Windows Long Paths ===" -ForegroundColor Cyan
$longPaths = Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name LongPathsEnabled -ErrorAction SilentlyContinue
if ($longPaths) {
    Write-Host "Long paths: Enabled ($($longPaths.LongPathsEnabled))" -ForegroundColor Green
} else {
    Write-Host "Long paths: NOT ENABLED" -ForegroundColor Red
    Write-Host "  Run: reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f"
}
Write-Host ""

# 5. Check workspace structure
Write-Host "=== Workspace Structure ===" -ForegroundColor Cyan
Write-Host "node_modules exists: $(Test-Path 'node_modules')"
Write-Host "node_modules size: $(if (Test-Path 'node_modules') { "{0:N2} MB" -f ((Get-ChildItem -Path node_modules -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB) } else { 'N/A' })"
Write-Host "pnpm-lock.yaml exists: $(Test-Path 'pnpm-lock.yaml')"
Write-Host "pnpm-workspace.yaml exists: $(Test-Path 'pnpm-workspace.yaml')"
Write-Host ""

# 6. Check workspace packages
Write-Host "=== Workspace Packages ===" -ForegroundColor Cyan
if (Test-Path 'node_modules/.pnpm') {
    $pkgs = Get-ChildItem "node_modules/.pnpm" | Measure-Object
    Write-Host "Packages in store: $($pkgs.Count)"

    $workspacePackages = Get-ChildItem "node_modules/.pnpm" | Where-Object { $_.Name -match '@functions-oneui' }
    Write-Host "Workspace packages found:"
    $workspacePackages | ForEach-Object { Write-Host "  - $($_.Name)" }
} else {
    Write-Host "No node_modules/.pnpm directory found!" -ForegroundColor Red
}
Write-Host ""

# 7. Check build output
Write-Host "=== Build Artifacts ===" -ForegroundColor Cyan
$packages = @("packages/atoms", "packages/tokens", "packages/theme", "packages/utils", "packages/organisms/action-panel", "packages/organisms/smart-section")
foreach ($pkg in $packages) {
    $distPath = Join-Path $pkg "dist"
    $hasDist = Test-Path $distPath
    $status = $hasDist ? "✓" : "✗"
    Write-Host "$status $pkg/dist"
}
Write-Host ""

# 8. Check for common issues
Write-Host "=== Common Issues Check ===" -ForegroundColor Cyan

# Check if running in PowerShell ISE (which has issues with pnpm)
if ($psISE) {
    Write-Host "⚠️  Running in PowerShell ISE - known to cause issues" -ForegroundColor Yellow
    Write-Host "   Use PowerShell console instead (not ISE)" -ForegroundColor Yellow
}

# Check if running under WSL/Git Bash
if ($env:WSL_DISTRO_NAME) {
    Write-Host "✓ Running in WSL - should work fine" -ForegroundColor Green
}

if (Test-Path "node_modules" -PathType Container) {
    $symlinks = Get-ChildItem -Path "node_modules" -ErrorAction SilentlyContinue | Where-Object { $_.Attributes -match 'ReparsePoint' } | Measure-Object
    Write-Host "Symlinks in node_modules: $($symlinks.Count)"
}

Write-Host ""
```

## If Build Still Fails

Run this to collect detailed error information:

```powershell
# Create diagnostic report
$report = @"
=== OneUI Design System - Windows Diagnostic Report ===
Date: $(Get-Date)
Computer: $env:COMPUTERNAME
User: $env:USERNAME

=== Environment ===
OS: $(Get-WmiObject -Class Win32_OperatingSystem | Select-Object -ExpandProperty Caption)
PowerShell Version: $($PSVersionTable.PSVersion)
Node: $(node --version)
npm: $(npm --version)
pnpm: $(pnpm --version)

=== Configuration ===
npm config:
$(npm config list)

=== Workspace State ===
node_modules exists: $(Test-Path node_modules)
node_modules size: $(if (Test-Path node_modules) { "{0:N2} MB" -f ((Get-ChildItem -Path node_modules -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB) } else { 'N/A' })
pnpm-lock.yaml exists: $(Test-Path pnpm-lock.yaml)

=== Build Error Output ===
"@

# Run build with verbose output
Write-Host "Running build with verbose output, please wait..."
$buildOutput = pnpm build 2>&1
$report += "`n$buildOutput"

# Save report
$reportFile = "windows-diagnostic-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').txt"
$report | Out-File -FilePath $reportFile -Encoding UTF8

Write-Host ""
Write-Host "Diagnostic report saved to: $reportFile" -ForegroundColor Green
Write-Host "Please share this file with the development team." -ForegroundColor Yellow
```

## Windows-Specific Issues

### Issue: "pnpm: The term 'pnpm' is not recognized"

Solution: Install pnpm globally

```powershell
npm install -g pnpm
```

### Issue: Permission denied when accessing node_modules

Solution: Check file permissions

```powershell
icacls node_modules /grant:r %username%:F /T /C
```

### Issue: Antivirus blocking node_modules

Solution: Exclude from Windows Defender

```powershell
Add-MpPreference -ExclusionPath $(Resolve-Path node_modules)
```

### Issue: Path too long errors

Solution: Enable long paths

```powershell
reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f
# Then restart computer
```

### Issue: "Cannot find module" in certain node_modules packages

Solution: Verify pnpm-lock.yaml integrity

```powershell
# Remove lock file and reinstall
Remove-Item pnpm-lock.yaml
pnpm install
```

## Performance Tips for Windows

1. **Increase Node.js memory limit:**

```powershell
$env:NODE_OPTIONS = "--max-old-space-size=8192"
```

2. **Disable Windows Defender scanning for development:**

```powershell
# Add workspace to exclusions
Add-MpPreference -ExclusionPath (Resolve-Path ".")
```

3. **Use SSD for workspace** (much faster than HDD)

4. **Keep workspace path short** (avoid deep nested directories)

5. **Use WSL2 for best performance** (Linux-like behavior on Windows)
