@echo off
REM OneUI Design System - Windows Quick Setup
REM Run this script as Administrator

cls
echo.
echo =====================================
echo OneUI Design System - Windows Setup
echo =====================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click cmd.exe and select "Run as administrator"
    pause
    exit /b 1
)

echo.
echo Step 1: Setting environment variables...
set HUSKY=0
set NODE_OPTIONS=--max-old-space-size=4096
echo HUSKY=0
echo NODE_OPTIONS=--max-old-space-size=4096
echo.

echo Step 2: Checking Node.js and pnpm versions...
node --version
pnpm --version
echo.

echo Step 3: Enabling long paths in Windows registry...
reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f
if %errorLevel% neq 0 (
    echo WARNING: Could not enable long paths. Continuing anyway...
) else (
    echo Long paths enabled.
)
echo.

echo Step 4: Cleaning old builds...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist .pnpm-store (
    echo Removing .pnpm-store...
    rmdir /s /q .pnpm-store
)
pnpm store prune
echo.

echo Step 5: Installing dependencies...
pnpm install --force --frozen-lockfile
if %errorLevel% neq 0 (
    echo ERROR: Installation failed!
    pause
    exit /b 1
)
echo.

echo Step 6: Building packages...
pnpm build
if %errorLevel% neq 0 (
    echo ERROR: Build failed!
    echo Trying alternative build approach...
    pnpm install --no-symlink
    pnpm build
    if %errorLevel% neq 0 (
        echo ERROR: Build failed twice. Please check WINDOWS_TROUBLESHOOTING.md
        pause
        exit /b 1
    )
)
echo.

echo Step 7: Running tests...
pnpm test
echo.

echo.
echo =====================================
echo Setup Complete!
echo =====================================
echo.
echo Your workspace is ready to use.
echo.
echo Quick commands:
echo   pnpm dev:storybook   - Start Storybook development server
echo   pnpm dev:api         - Start mock API server
echo   pnpm lint            - Run linter
echo   pnpm typecheck       - Check TypeScript
echo.
pause
