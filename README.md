# NETRIX — Premium Enterprise Remote Desktop & Remote Support Platform

<div align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="NETRIX Logo" />
  <h3>Connect Beyond Limits.</h3>
  <p><strong>Publisher: PB Tech Zone</strong></p>
</div>

---

## 1. Product Overview

**NETRIX** is a modern, enterprise-grade remote desktop access, IT fleet administration, and customer technical support platform. It delivers commercial-grade reliability, low-latency stream dispatching, cryptographic access authorization, and multi-tenant organization governance.

### Core Ecosystem
- **NETRIX Remote:** Main native client application for low-latency desktop control and unattended access.
- **NETRIX Assist:** Quick support tool for on-demand customer assistance via 6-digit one-time PINs without pre-installed agents.
- **NETRIX Console (This Repository):** Command center web application for fleet monitoring, session initiation, audit trails, licensing, and administration.
- **NETRIX Business:** Multi-organization, team role-based access control (RBAC), technician dispatching, and policy governance.

---

## 2. Technology Stack

- **Core Framework:** React 18.3, Vite 6, TypeScript 5.6 (strict mode enabled).
- **UI & Design System:** Bootstrap 5.3 with custom NETRIX SCSS design token layer, Lucide React icons, JetBrains Mono for cryptographic identifiers.
- **State Management:** Redux Toolkit (RTK) & RTK Query.
  - *RTK Query:* Server entity cache with tag-based cache invalidation.
  - *Redux Slices:* Auth credentials, UI preferences (theme, sidebar), notification drawer, session dispatch UI.
- **Routing & Navigation:** React Router v6 (Protected routes, Role-based route guards, Error boundaries).
- **Forms & Validation:** React Hook Form + Zod runtime schemas + `@hookform/resolvers`.
- **Charts & Telemetry:** Recharts (Connection volume area charts, OS distribution breakdown).
- **Testing Suite:** Vitest, React Testing Library, JSDOM (`npm run test`).

---

## 3. Architecture & Directory Structure

```
NETRIX/
├── docs/                      # Architectural specifications & plans
│   ├── ARCHITECTURE.md        # System boundaries & communication flow
│   ├── DEVELOPMENT.md         # Developer runbook & operational guide
│   ├── DESIGN-SYSTEM.md       # Color tokens, typography, radii, dark/light themes
│   ├── STATE-MANAGEMENT.md    # Redux slices & RTK Query cache invalidation
│   ├── API-CONTRACTS.md       # RESTful payload specifications
│   └── IMPLEMENTATION-PLAN.md # Delivery roadmap
├── public/                    # Favicon and branding assets
├── src/
│   ├── app/                   # App bootstrap, Redux store, router, guards
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── router.tsx
│   │   ├── store.ts
│   │   ├── guards/            # AuthGuard, RoleGuard
│   │   └── store/             # preferencesSlice
│   ├── components/            # Reusable UI components
│   │   ├── common/            # NetrixLogo, StatusBadge, MetricCard, EmptyState, LoadingSpinner
│   │   └── feedback/          # NotFoundPage
│   ├── features/              # Feature-sliced domain modules
│   │   ├── auth/              # Sign in, 2FA, Forgot/Reset password, Register, 403, 401
│   │   ├── dashboard/         # Command center overview, telemetry charts, active stream roster
│   │   ├── devices/           # Fleet management, hardware metrics, detail drawer, mass enrollment
│   │   ├── address-book/      # Contact favorites, group filters, quick dial
│   │   ├── remote-sessions/   # Connection dispatcher, active streams, termination kill-switch
│   │   ├── quick-support/     # NETRIX Assist 6-digit PIN generator & customer queue
│   │   ├── organizations/     # Multi-tenancy, member roster, role matrix
│   │   ├── technicians/       # Support roster, availability switches, performance CSAT
│   │   ├── activity/          # Audit logs, category filters, CSV export
│   │   ├── licenses/          # Commercial license keys, channel quotas, seat allocations
│   │   ├── settings/          # Operator profiles, TOTP toggle, themes, client profile policies
│   │   └── admin/             # Root platform console, global relay nodes, cluster health
│   ├── layouts/               # Responsive application shell
│   │   ├── AppLayout.tsx      # Sidebar, Header, QuickConnectModal, NotificationDrawer
│   │   ├── AuthLayout.tsx     # Centered branded authentication container
│   │   └── components/
│   ├── services/              # API and client protocol layers
│   │   ├── api/               # RTK Query baseApi and injected feature endpoints
│   │   ├── mock/              # Realistic in-memory development fixtures
│   │   └── protocol/          # Native netrix:// client URI dispatcher
│   ├── styles/                # Bespoke SCSS design token architecture
│   └── test/                  # Vitest unit & integration test suites
├── .env.example               # Environment template
├── package.json
├── tsconfig.json              # Strict TypeScript configuration
├── vite.config.ts             # Optimized vendor chunk splitting
└── vitest.config.ts           # Test environment runner
```

---

## 4. Getting Started

### Prerequisites
- Node.js v18.0.0+ (Tested and verified on Node.js v24)
- npm v9+

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts Vite development server at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Executes TypeScript type check (`tsc -b`) and generates optimized, chunk-split production assets in `dist/`.

### Run Automated Tests
```bash
npm run test
```
Executes all unit and integration test suites via Vitest.

---

## 5. Native Client Integration & Protocol Handling

The NETRIX Web Console is an **administrative orchestration and dispatch interface**. It does not spoof an in-browser remote streaming engine; instead, it establishes an authorized single-use handshake with the native **NETRIX Remote** client via registered OS protocol handlers:

```
netrix://connect?ticket=st_987af7e9c8b74610a&target=942810503&proto=3.2
```

1. Technician inputs or selects target device (e.g., `942 810 503`).
2. Web Console negotiates a 60-second time-bound ticket (`st_...`) with the gateway via `sessionApi.dispatchSession`.
3. OS registered URI handler launches the local native desktop client.
4. Fallback manual copy of tickets and instructions is presented if the native client is not detected.

---

## 6. Environment Configuration

| Variable | Description | Default |
|---|---|---|
| `VITE_APP_NAME` | Application name | `NETRIX` |
| `VITE_APP_TAGLINE` | Brand tagline | `Connect Beyond Limits.` |
| `VITE_APP_COMPANY` | Publisher | `PB Tech Zone` |
| `VITE_API_BASE_URL` | REST API gateway | `https://api.netrix.pbtechzone.com/v1` |
| `VITE_ENABLE_MOCK_API` | Controlled offline mock mode | `true` |
| `VITE_PROTOCOL_SCHEME` | Registered URI scheme | `netrix` |

---

## 7. Role-Based Access Control (RBAC)

- **SuperAdmin:** Unrestricted platform administration, global relay monitoring (`/admin`), cross-tenant audit.
- **OrgAdmin:** Full organizational management, device enrollment, team invites, billing & licenses.
- **TechnicianLead:** Queue dispatch, technician workload management, address book assignments.
- **Technician:** Active remote support sessions, customer PIN handling, assigned device control.
- **Viewer:** Read-only access to audit logs and telemetry metrics.

---

## 8. License

Copyright &copy; 2026 PB Tech Zone. Commercial Enterprise Software.

