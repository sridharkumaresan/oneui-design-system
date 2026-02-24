# OneUI Design System - Quick Start Guide

## Setup Instructions

### macOS / Linux

```bash
pnpm install
pnpm build
pnpm test
pnpm dev:storybook
```

### Windows

**If you're having build issues on Windows, follow these steps:**

1. **Run Windows Setup Script (Recommended)**

   ```powershell
   # As Administrator, run:
   .\windows-setup.ps1 -Force

   # Or use the batch file:
   windows-setup.bat
   ```

2. **Manual Setup**
   ```powershell
   # Run PowerShell as Administrator and execute:
   $env:HUSKY = "0"
   $env:NODE_OPTIONS = "--max-old-space-size=4096"
   pnpm install --force --frozen-lockfile
   pnpm build
   pnpm test
   ```

### Troubleshooting

- **See [WINDOWS_TROUBLESHOOTING.md](./WINDOWS_TROUBLESHOOTING.md)** for common Windows issues
- **See [WINDOWS_DIAGNOSTICS.md](./WINDOWS_DIAGNOSTICS.md)** for diagnostic commands

## Available Commands

```bash
# Development
pnpm dev:storybook          # Start Storybook on http://localhost:6006
pnpm dev:api               # Start mock API server

# Building
pnpm build                 # Build all packages
pnpm build:watch          # Build in watch mode

# Quality Assurance
pnpm lint                 # Run ESLint
pnpm typecheck           # Run TypeScript checks
pnpm test                # Run unit tests
pnpm verify              # Run checks on changed packages only

# Code Formatting
pnpm format              # Check code formatting
pnpm format:write        # Fix code formatting

# Releases
pnpm changeset          # Create changeset for release
pnpm version-packages   # Bump versions
pnpm release           # Publish to npm
```

## Project Structure

```
packages/
  ├── tokens/              # Design tokens
  ├── theme/               # Fluent UI theming
  ├── standards/           # Coding standards
  ├── utils/               # Utility functions
  ├── react-utils/         # React utility hooks
  ├── testing/             # Testing utilities
  ├── atoms/               # Base components
  └── organisms/           # Complex components
        ├── action-panel/
        └── smart-section/

apps/
  ├── storybook/          # Component documentation
  ├── mock-api/           # Mock API server
  └── playground/         # Development playground
```

## System Requirements

- **Node.js**: 18.x or higher
- **pnpm**: 10.x
- **Windows**: Windows 10 or later (if using Windows)

## Windows-Specific Notes

- Enable Admin mode for `pnpm install`
- Use PowerShell or Command Prompt (not PowerShell ISE)
- Ensure long paths are enabled (see [WINDOWS_TROUBLESHOOTING.md](./WINDOWS_TROUBLESHOOTING.md))
- Antivirus may slow down builds - consider excluding the workspace folder
