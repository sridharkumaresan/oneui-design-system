# Quick Windows Transfer Checklist

## ✅ Current macOS Status

- Build: ✅ PASSED
- Tests: ✅ PASSED (24/24)
- TypeScript: ✅ PASSED
- Linting: ✅ PASSED
- Storybook: ✅ BUILT

**Ready to transfer!**

---

## Step 1: Prepare on macOS (5 minutes)

```bash
cd "/Users/sridhar/codex workspaces/oneui-design-system"

# Clean large auto-generated folders
rm -rf node_modules
rm -rf .pnpm-store
find packages -name dist -type d 2>/dev/null | xargs rm -rf
rm -rf apps/storybook/storybook-static

# Verify essential files exist
ls pnpm-lock.yaml package.json pnpm-workspace.yaml .npmrc

# Create zip
cd ..
zip -r oneui-design-system.zip oneui-design-system \
  -x "*/node_modules/*" "*/.pnpm-store/*" "*/dist/*" "*/storybook-static/*"

ls -lh oneui-design-system.zip
```

Expected zip size: **~50 MB**

---

## Step 2: Transfer to Windows

Choose one:

- Email the zip
- OneDrive/Google Drive
- USB drive
- Cloud storage
- Network share

---

## Step 3: On Windows Laptop (10 minutes)

```powershell
# Open PowerShell as Administrator

# Extract zip
Expand-Archive oneui-design-system.zip -DestinationPath C:\workspaces

# Navigate
cd C:\workspaces\oneui-design-system

# Run setup
.\windows-setup.ps1 -Force

# Wait for completion...
```

---

## Step 4: Verify on Windows

```powershell
# Test build
pnpm build

# Test tests
pnpm test

# Test Storybook
pnpm dev:storybook

# Open browser: http://localhost:6006
```

---

## What You'll Get

✅ Identical working codebase on Windows
✅ All packages installed and built
✅ Ready for development
✅ Storybook running on localhost:6006

---

## If Issues on Windows

Refer to:

- [WINDOWS_BUILD_RESOLUTION.md](./WINDOWS_BUILD_RESOLUTION.md) - Quick fixes
- [WINDOWS_TROUBLESHOOTING.md](./WINDOWS_TROUBLESHOOTING.md) - Detailed solutions
- [WINDOWS_DIAGNOSTICS.md](./WINDOWS_DIAGNOSTICS.md) - Diagnostic tools

---

**Time Estimate:**

- macOS prep: 5 minutes
- Transfer: 5-30 minutes (depends on file size/connection)
- Windows setup: 5-10 minutes
- Testing: 5 minutes

**Total: ~20-55 minutes**

---

## Yes/No Questions

**Q: Can I just zip and unzip?**
A: ✅ **YES** - Use the prepared guides and scripts

**Q: Do I need to include node_modules?**
A: ❌ **NO** - Setup script will install them

**Q: Will it work exactly like macOS?**
A: ✅ **YES** - Same code, same versions (pnpm-lock.yaml ensures it)

**Q: What if Windows setup fails?**
A: See [WINDOWS_TROUBLESHOOTING.md](./WINDOWS_TROUBLESHOOTING.md) - comprehensive solutions included
