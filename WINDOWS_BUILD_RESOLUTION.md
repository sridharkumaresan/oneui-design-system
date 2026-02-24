# Windows Build Issues - Complete Resolution Guide

## What Was Wrong

From your screenshot, the Windows laptop is experiencing:

1. **Build failures** (`pnpm run build` exits with code 1)
2. **Missing dependencies** (Storybook shows "dependency is not available")
3. **Workspace resolution issues** (packages not properly linked)

These are **common Windows pnpm issues** caused by:

- File system symlink limitations
- Path length restrictions (260 character limit)
- Line ending (CRLF) conflicts
- Missing admin permissions
- Incomplete dependency installation

---

## Quick Fix (Try This First)

### On Your Windows Laptop:

1. **Open PowerShell as Administrator**
   - Right-click PowerShell → "Run as administrator"

2. **Navigate to workspace:**

   ```powershell
   cd "C:\sridhar-local\workspaces\oneui-design-system"
   ```

3. **Run the setup script:**

   ```powershell
   .\windows-setup.ps1 -Force
   ```

   OR use the batch file:

   ```cmd
   windows-setup.bat
   ```

4. **Wait for completion** (5-10 minutes)

---

## If Quick Fix Doesn't Work

### Follow These Steps in Order:

#### Step 1: Enable Long Paths

```powershell
# In PowerShell as Administrator
reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f
```

Then **restart your computer**.

#### Step 2: Deep Clean

```powershell
cd "C:\sridhar-local\workspaces\oneui-design-system"

# Set environment
$env:HUSKY = "0"

# Remove everything
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".pnpm-store" -Recurse -Force -ErrorAction SilentlyContinue

# Prune pnpm store
pnpm store prune
```

#### Step 3: Fresh Install

```powershell
pnpm install --force --frozen-lockfile
```

#### Step 4: Build

```powershell
pnpm build
```

#### Step 5: Test

```powershell
pnpm test
```

---

## Detailed Troubleshooting

### Issue: "pnpm install" still fails

**Try without symlinks:**

```powershell
# Delete node_modules again
Remove-Item -Path "node_modules" -Recurse -Force

# Install without symlinks
pnpm install --no-symlink
```

### Issue: "Cannot find module" errors

**Verify workspace structure:**

```powershell
# Check packages are installed
pnpm list -r --depth=0

# Check @functions-oneui packages
Get-ChildItem "node_modules/.pnpm" -Filter "*functions-oneui*"
```

If empty, reinstall with verbose output:

```powershell
pnpm install --verbose
```

### Issue: Build fails with "exit code 1"

**Get detailed error:**

```powershell
pnpm build --verbose 2>&1 | Tee-Object -FilePath "build-error.txt"
```

Share the `build-error.txt` file.

### Issue: Storybook "dependency not available"

**Force rebuild:**

```powershell
# Clean everything
pnpm run build --force

# Rebuild storybook specifically
pnpm --filter @functions-oneui/storybook run build
```

---

## Windows-Specific Configurations

### .npmrc (Already Updated)

The `.npmrc` file now includes Windows-friendly settings:

- `symlink=false` - Disables symlinks
- `fetch-timeout=60000` - Increases timeouts
- `shamefully-hoist=false` - Better module resolution

### Updated Workspace Files

- `SETUP.md` - Quick start guide
- `WINDOWS_TROUBLESHOOTING.md` - Detailed troubleshooting
- `WINDOWS_DIAGNOSTICS.md` - Diagnostic scripts
- `windows-setup.ps1` - PowerShell setup script
- `windows-setup.bat` - Batch setup script

---

## Diagnostic Commands

Run these in PowerShell **as Administrator** to check your system:

```powershell
# Check versions
Write-Host "Node: $(node --version)"
Write-Host "pnpm: $(pnpm --version)"
Write-Host "npm: $(npm --version)"

# Check long paths
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name LongPathsEnabled

# Check workspace
Write-Host "node_modules: $(Test-Path 'node_modules')"
Write-Host "pnpm-lock.yaml: $(Test-Path 'pnpm-lock.yaml')"

# List packages
pnpm list -r --depth=0 | Select-Object -First 20
```

---

## What These Files Do

| File                         | Purpose                                 |
| ---------------------------- | --------------------------------------- |
| `SETUP.md`                   | Quick start guide with commands         |
| `WINDOWS_TROUBLESHOOTING.md` | Detailed issue-by-issue solutions       |
| `WINDOWS_DIAGNOSTICS.md`     | Diagnostic scripts and performance tips |
| `windows-setup.ps1`          | Automated PowerShell setup              |
| `windows-setup.bat`          | Automated batch setup                   |
| `.npmrc`                     | Updated with Windows-friendly settings  |

---

## Common Windows Issues & Quick Fixes

| Issue                     | Solution                                       |
| ------------------------- | ---------------------------------------------- |
| "pnpm: command not found" | `npm install -g pnpm`                          |
| "Permission denied"       | Run PowerShell as Administrator                |
| "Path too long"           | Enable long paths (see Step 1 above)           |
| Build slow                | Disable Windows Defender scanning of workspace |
| Node modules huge         | Use `symlink=false` in .npmrc                  |
| Lockfile conflicts        | Delete `pnpm-lock.yaml` and reinstall          |

---

## Performance Tips

1. **Keep workspace on SSD** (not network drive)
2. **Exclude from antivirus:**
   ```powershell
   Add-MpPreference -ExclusionPath (Resolve-Path "node_modules")
   ```
3. **Increase Node memory:**
   ```powershell
   $env:NODE_OPTIONS = "--max-old-space-size=8192"
   ```
4. **Use WSL2** if issues persist (Linux environment on Windows)

---

## Next Steps

1. **Choose one:**
   - Option A: Run `.\windows-setup.ps1 -Force` (automatic)
   - Option B: Follow "Quick Fix" section manually
   - Option C: Follow "If Quick Fix Doesn't Work" in detail

2. **After setup succeeds:**

   ```powershell
   pnpm dev:storybook  # Start development
   ```

3. **If still failing:**
   - Run diagnostic commands (see above)
   - Share output of `build-error.txt`
   - Check [WINDOWS_TROUBLESHOOTING.md](./WINDOWS_TROUBLESHOOTING.md)

---

## Files Added/Modified for Windows Support

✅ **Created:**

- `WINDOWS_TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `WINDOWS_DIAGNOSTICS.md` - Diagnostic scripts
- `SETUP.md` - Quick start guide
- `windows-setup.ps1` - PowerShell setup script
- `windows-setup.bat` - Batch setup script

✅ **Modified:**

- `.npmrc` - Added Windows-friendly configuration

---

## Support

If you still have issues:

1. Run diagnostic commands and save output
2. Check `WINDOWS_TROUBLESHOOTING.md` for your specific error
3. Try WSL2 as fallback (Linux on Windows)
4. Share diagnostic output for team assistance

---

**Created: February 24, 2026**
**For: OneUI Design System - Windows Development Setup**
