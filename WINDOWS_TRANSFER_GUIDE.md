# Windows Transfer Guide - OneUI Design System

## ✅ Verification Status

The OneUI Design System workspace on macOS is **fully working and verified**:

- ✅ Build: **PASSED** (12 tasks successful)
- ✅ TypeScript: **PASSED** (no type errors)
- ✅ ESLint: **PASSED** (all rules satisfied)
- ✅ Tests: **PASSED** (24 tests passed)
- ✅ Storybook: **BUILT SUCCESSFULLY**

**Status: Ready for Windows transfer ✅**

---

## Transfer to Windows - Step by Step

### Option 1: Zip & Transfer (Recommended for Initial Setup)

#### On macOS:

1. **Clean unnecessary files** (reduce zip size):

   ```bash
   cd "/Users/sridhar/codex workspaces/oneui-design-system"

   # Remove node_modules (will be reinstalled on Windows)
   rm -rf node_modules

   # Remove build artifacts
   rm -rf apps/storybook/storybook-static
   find packages -name dist -type d -exec rm -rf {} + 2>/dev/null || true

   # Keep pnpm-lock.yaml (IMPORTANT!)
   ls -la pnpm-lock.yaml  # Verify it exists
   ```

2. **Create zip file**:

   ```bash
   cd /Users/sridhar/codex\ workspaces
   zip -r oneui-design-system.zip oneui-design-system \
     -x "oneui-design-system/node_modules/*" \
     -x "oneui-design-system/.pnpm-store/*" \
     -x "oneui-design-system/apps/storybook/storybook-static/*" \
     -x "oneui-design-system/packages/*/dist/*"

   # Check zip size
   ls -lh oneui-design-system.zip
   ```

3. **Transfer zip to Windows**:
   - Via email, OneDrive, USB, or cloud storage
   - Recommended: Direct copy if accessible via network

#### On Windows:

1. **Extract zip**:
   - Right-click → "Extract All..."
   - Or use: `Expand-Archive oneui-design-system.zip -DestinationPath .`

2. **Open PowerShell as Administrator**:

   ```powershell
   cd "C:\path\to\oneui-design-system"
   ```

3. **Run setup script**:

   ```powershell
   .\windows-setup.ps1 -Force
   ```

   **OR** use batch file:

   ```cmd
   windows-setup.bat
   ```

4. **Wait for completion** (5-10 minutes)

5. **Verify**:
   ```powershell
   pnpm build
   pnpm test
   pnpm dev:storybook
   ```

---

### Option 2: Git Clone (If Using Git Repository)

#### On Windows:

```powershell
# Clone the repository
git clone <your-repo-url> oneui-design-system

# Or if already cloned, pull latest
cd oneui-design-system
git pull

# Run setup
.\windows-setup.ps1 -Force
```

---

### Option 3: Network Share (If On Same Network)

If computers are on same network:

#### On macOS:

```bash
# Enable file sharing (if not already enabled)
# System Preferences → Sharing → File Sharing
# Add the oneui-design-system folder
```

#### On Windows:

```powershell
# Map network drive to Mac
$map = "\\<mac-ip>\oneui-design-system"
New-PSDrive -Name Z -PSProvider FileSystem -Root $map

# Or just copy via Explorer
cd Z:\
Copy-Item -Path "." -Destination "C:\oneui-design-system" -Recurse
```

---

## Important: Do NOT Zip These Folders

❌ **EXCLUDE from zip** (huge and auto-generated):

- `node_modules/` (reinstalled by `pnpm install`)
- `.pnpm-store/` (pnpm internal cache)
- `apps/storybook/storybook-static/` (rebuilt by `pnpm build`)
- `packages/*/dist/` (rebuilt by `pnpm build`)

✅ **INCLUDE in zip** (essential):

- `pnpm-lock.yaml` (CRITICAL - ensures exact versions)
- `package.json` files
- Source code in `src/` folders
- Configuration files (`.npmrc`, `tsconfig.json`, etc.)
- Setup scripts (`windows-setup.ps1`, `windows-setup.bat`)

---

## Zip File Size Estimates

| Size     | Content                                    |
| -------- | ------------------------------------------ |
| ~50 MB   | With pnpm-lock.yaml, source code, configs  |
| ~300+ MB | If node_modules included (NOT recommended) |

**Use ~50 MB zip** for fastest transfer!

---

## Potential Issues & Solutions

### Issue: Line Endings (CRLF vs LF)

Windows and macOS use different line endings. The zip should preserve them correctly, but if scripts fail:

```powershell
# On Windows, run this to fix line endings
git config core.autocrlf true
git checkout --force

# Or for all files
Get-ChildItem -Recurse -Include "*.ps1", "*.mjs", "*.cjs" | ForEach-Object {
    $content = Get-Content $_.FullName
    $content | Set-Content $_.FullName -Encoding UTF8
}
```

### Issue: pnpm-lock.yaml Out of Sync

If you get version mismatch errors:

```powershell
# Delete lock file and reinstall (ONLY if absolutely necessary)
Remove-Item pnpm-lock.yaml
pnpm install
```

⚠️ **WARNING:** This may install different versions than macOS.

### Issue: Git Credentials

If repo is private, configure Git on Windows first:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"
git config --global credential.helper "wincred"
```

---

## After Successful Transfer

### Verify Everything Works

```powershell
# Build
pnpm build

# Test
pnpm test

# Start Storybook
pnpm dev:storybook

# Should see: "Storybook started on http://localhost:6006"
```

### Keep Workspace Updated

On macOS, when making changes:

```bash
# After changes
pnpm build
pnpm test

# When ready to sync to Windows
# Option 1: Re-zip and transfer
# Option 2: Use Git push/pull
```

---

## Recommended Setup Order

1. ✅ **Verify on macOS** (already done)
2. 🚀 **Zip on macOS**
3. 📥 **Transfer to Windows**
4. 📤 **Extract on Windows**
5. 🔧 **Run windows-setup.ps1**
6. ✅ **Test on Windows**

---

## Quick Reference Commands

### macOS (Before Zipping)

```bash
# Remove large auto-generated folders
rm -rf node_modules .pnpm-store
find . -path ./packages -name dist -type d -delete
find . -path ./apps -name storybook-static -type d -delete

# Create zip
cd ..
zip -r oneui-design-system.zip oneui-design-system -x "*/node_modules/*" "*/dist/*" "*/.pnpm-store/*"
```

### Windows (After Extracting)

```powershell
# Run setup
.\windows-setup.ps1 -Force

# Or manual
$env:HUSKY = "0"
pnpm install --force --frozen-lockfile
pnpm build
```

---

## File Checklist Before Zipping

Use this to verify everything needed is in the zip:

```bash
# On macOS, run this script:
cat > check-zip-contents.sh << 'EOF'
#!/bin/bash
echo "=== Checking zip contents ==="
echo "✓ pnpm-lock.yaml: $([ -f pnpm-lock.yaml ] && echo 'YES' || echo 'NO')"
echo "✓ package.json: $([ -f package.json ] && echo 'YES' || echo 'NO')"
echo "✓ pnpm-workspace.yaml: $([ -f pnpm-workspace.yaml ] && echo 'YES' || echo 'NO')"
echo "✓ .npmrc: $([ -f .npmrc ] && echo 'YES' || echo 'NO')"
echo "✓ windows-setup.ps1: $([ -f windows-setup.ps1 ] && echo 'YES' || echo 'NO')"
echo "✓ windows-setup.bat: $([ -f windows-setup.bat ] && echo 'YES' || echo 'NO')"
echo "✓ WINDOWS_BUILD_RESOLUTION.md: $([ -f WINDOWS_BUILD_RESOLUTION.md ] && echo 'YES' || echo 'NO')"
echo ""
echo "✗ node_modules exists: $([ -d node_modules ] && echo 'YES (remove!)' || echo 'NO (good)')"
echo "✗ .pnpm-store exists: $([ -d .pnpm-store ] && echo 'YES (remove!)' || echo 'NO (good)')"
echo ""
echo "Source code:"
ls packages/*/src 2>/dev/null | wc -l | xargs echo "  Packages with source:"
echo ""
echo "Ready to zip!"
EOF

chmod +x check-zip-contents.sh
./check-zip-contents.sh
```

---

## Windows Laptop Test Checklist

After extracting and running setup, verify:

- [ ] PowerShell runs as Administrator
- [ ] `pnpm install` completes successfully
- [ ] `pnpm build` produces no errors
- [ ] `pnpm test` shows all tests passing
- [ ] `pnpm dev:storybook` starts without dependency errors
- [ ] Open http://localhost:6006 in browser - Storybook displays
- [ ] All components visible in Storybook

---

## Troubleshooting Transfer Issues

### "Zip file is corrupted"

- Use Windows built-in extractor or 7-Zip
- Try re-transferring file

### "pnpm-lock.yaml missing"

- CRITICAL - must be in zip
- Regenerate from macOS: `pnpm install`

### "Scripts won't execute"

- Check PowerShell execution policy: `Get-ExecutionPolicy`
- Fix with: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`

### "Different versions installed"

- Ensure `pnpm-lock.yaml` is present
- Delete lock file and regenerate: `pnpm install --frozen-lockfile`

---

## Summary

✅ **Current Status**: Workspace verified and working on macOS
📦 **Next Step**: Zip (excluding node_modules) and transfer
🖥️ **On Windows**: Extract → Run setup script → Test

**Expected Result**: Identical working environment on Windows laptop
