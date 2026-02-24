# Windows Build Troubleshooting Guide

## Common Windows Issues & Solutions

### Issue 1: Build Fails with "exit code 1"

**Symptoms:** `pnpm run build` fails immediately on Windows

**Root Causes:**

- Symlink issues (pnpm creates symlinks in node_modules that Windows can't handle without admin)
- Line ending (CRLF) conflicts in scripts
- Path length issues (Windows has 260-character path limit by default)
- Permission issues with node_modules

**Solutions:**

#### Solution 1A: Enable Symlinks (Recommended)

Run PowerShell **as Administrator**:

```powershell
# For pnpm - enable symlinks in npm
npm config set legacy-peer-deps true

# Enable long paths in Windows (requires admin)
reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f

# Create .npmrc in workspace root
echo "symlink=true" >> .npmrc
echo "strict-peer-dependencies=false" >> .npmrc
```

#### Solution 1B: Clear & Reinstall (If 1A doesn't work)

Run in PowerShell **as Administrator**:

```powershell
# Navigate to workspace
cd "C:\sridhar-local\workspaces\oneui-design-system"

# Remove node_modules and lockfile
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path ".pnpm-store" -Recurse -Force -ErrorAction SilentlyContinue

# Clear pnpm cache
pnpm store prune

# Reinstall with no symlinks if admin permissions fail
pnpm install --no-symlink
```

#### Solution 1C: Use pnpm's Virtual Store (No Symlinks)

Create `.pnpmrc` in workspace root:

```ini
prefer-offline=true
shamefully-hoist=false
use-lockfile=true
strict-peer-dependencies=false
symlink=false
```

Then reinstall:

```powershell
pnpm install
```

---

### Issue 2: "Skipping storybook; dependency is not available"

**Symptoms:** Storybook build skipped, can't run `dev:storybook`

**Root Causes:**

- Incomplete install of workspace dependencies
- Missing dev dependencies
- @functions-oneui packages not properly symlinked

**Solutions:**

#### Solution 2A: Force Install All Dependencies

```powershell
# Deep clean
pnpm store prune
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".pnpm-store" -Recurse -Force -ErrorAction SilentlyContinue

# Reinstall from scratch
pnpm install --force

# Rebuild packages
pnpm run build
```

#### Solution 2B: Install with Exact Versions

```powershell
pnpm install --frozen-lockfile
```

---

### Issue 3: Path or File System Errors

**Symptoms:** "ENOENT", "file not found", or path-related errors

**Solutions:**

#### Solution 3A: Check Node Modules Structure

```powershell
# List workspace packages
pnpm list -r --depth=0

# Check if @functions-oneui packages are present
Get-ChildItem "node_modules/.pnpm" -Filter "*functions-oneui*" | Select-Object Name
```

#### Solution 3B: Fix Path Issues

```powershell
# Set long path support (Windows 10+)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -Force

# Restart terminal or system
```

---

### Issue 4: Husky Git Hooks Failing

**Symptoms:** `prepare` script fails, husky setup errors

**Solutions:**

#### Solution 4A: Skip Husky During Install

```powershell
$env:HUSKY = "0"
pnpm install

# Then run husky setup separately
pnpm prepare
```

#### Solution 4B: Reinstall Husky

```powershell
pnpm remove husky
pnpm add -D husky
pnpm prepare
```

---

### Issue 5: Script Execution Policy

**Symptoms:** Scripts won't run, PowerShell policy errors

**Solutions:**

```powershell
# Check current policy
Get-ExecutionPolicy

# Set to allow scripts (in Admin PowerShell)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or use bypass for single operation
powershell.exe -ExecutionPolicy Bypass -Command "pnpm install"
```

---

## Complete Windows Setup Checklist

Run in this order in **Administrator PowerShell**:

```powershell
# 1. Enable long paths
reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f

# 2. Check Node.js and pnpm versions
node --version
pnpm --version

# 3. Navigate to workspace
cd "C:\sridhar-local\workspaces\oneui-design-system"

# 4. Set environment variables
$env:HUSKY = "0"
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# 5. Clean everything
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".pnpm-store" -Recurse -Force -ErrorAction SilentlyContinue
pnpm store prune

# 6. Install dependencies
pnpm install --force --frozen-lockfile

# 7. Build
pnpm build

# 8. Run tests
pnpm test

# 9. Try Storybook
pnpm dev:storybook
```

---

## If Still Failing: Collect Diagnostics

Run this command and share the output:

```powershell
# Generate diagnostic info
@"
=== SYSTEM INFO ===
OS: $(cmd /c ver)
Node: $(node --version)
pnpm: $(pnpm --version)
npm: $(npm --version)

=== NPM CONFIG ===
$((npm config list) -join "`n")

=== WORKSPACE STATUS ===
Packages in node_modules: $(Get-ChildItem "node_modules" -ErrorAction SilentlyContinue | Measure-Object).Count
"@ | Out-File "diagnostic-report.txt"

# Try build with verbose output
pnpm build --verbose 2>&1 | Tee-Object -FilePath "build-error.log"
```

Share both `diagnostic-report.txt` and `build-error.log` files.

---

## Windows-Specific Best Practices

1. **Always run PowerShell as Administrator** for pnpm operations
2. **Use full paths** in commands (no tilde `~`)
3. **Use backslashes or forward slashes consistently** in paths
4. **Keep node_modules on local drive** (C:\ not network drives)
5. **Disable Windows Defender scanning** of node_modules folder
6. **Use WSL2 or Git Bash** if issues persist with native Windows

---

## Alternative: Use WSL2 (Windows Subsystem for Linux)

If Windows issues persist, use WSL2 which behaves like Linux:

```powershell
# Install WSL2 (in Admin PowerShell)
wsl --install

# In WSL2 terminal
cd /mnt/c/sridhar-local/workspaces/oneui-design-system
pnpm install
pnpm build
```
