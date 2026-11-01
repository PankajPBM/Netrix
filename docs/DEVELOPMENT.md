# NETRIX Development & Operations Guide
**Product:** NETRIX | **Publisher:** PB Tech Zone  

---

## 1. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ LTS recommended, verified on v24)
- **Package Manager:** npm (v9+) or pnpm
- **Supported Operating Systems:** Windows 10/11, macOS Sonoma/Sequoia, Ubuntu 22.04+ LTS

---

## 2. Environment Variables

Configure `.env` in the project root:

```ini
# Application Metadata
VITE_APP_NAME=NETRIX
VITE_APP_VERSION=1.0.0
VITE_APP_TAGLINE="Connect Beyond Limits."
VITE_APP_COMPANY="PB Tech Zone"

# API & Gateway Configuration
VITE_API_BASE_URL=https://api.netrix.pbtechzone.com/v1
VITE_API_TIMEOUT=15000

# Mock Development Flag
# Set to 'true' to use the realistic NETRIX in-memory mock engine with zero backend dependency
VITE_ENABLE_MOCK_API=true

# Native Client Protocol
VITE_PROTOCOL_SCHEME=netrix
VITE_CLIENT_DOWNLOAD_URL=https://get.netrix.pbtechzone.com/download
```

---

## 3. Project Setup & Execution Commands

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts the Vite dev server with Hot Module Replacement (HMR) at `http://localhost:5173/`.

### Production Build
```bash
npm run build
```
Type checks the codebase (`tsc -b`) and generates optimized production artifacts in `dist/`.

### Preview Production Build
```bash
npm run preview
```

### Automated Testing
```bash
# Run Vitest unit & integration test suites
npm run test

# Run tests with interactive UI
npm run test:ui

# Run tests with test coverage reporting
npm run test:coverage
```

### Code Quality & Formatting
```bash
# Lint with ESLint
npm run lint

# Format check with Prettier
npm run format:check

# Auto-format
npm run format
```

---

## 4. Branching & Commit Conventions

- `main`: Production-ready release branch.
- `develop`: Integration branch for sprint deliverables.
- `feat/feature-name`: New capabilities.
- `fix/issue-description`: Bug fixes.

Commit messages must adhere to Conventional Commits:
- `feat(devices): add bulk group assignment modal`
- `fix(auth): resolve token refresh loop on expired refresh token`
- `docs(api): update session initiation ticket schema`
- `refactor(table): extract reusable DataTableToolbar component`
