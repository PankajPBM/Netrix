# NETRIX Frontend Architecture Document
**Product:** NETRIX (Remote Desktop & Enterprise Remote Support Platform)  
**Publisher:** PB Tech Zone  
**Tagline:** Connect Beyond Limits.  
**Version:** 1.0.0-alpha  
**Architect:** Principal Frontend Architect & Engineering Lead  

---

## 1. Architectural Vision & Scope

NETRIX is a commercial-grade, multi-tenant enterprise remote access, remote computer support, and device fleet administration platform. The web application (**NETRIX Console**) serves as the mission control center for IT administrators, helpdesk technicians, managed service providers (MSPs), and organization owners.

### Core Ecosystem Components:
1. **NETRIX Remote:** Main native client application for low-latency desktop control and unattended access.
2. **NETRIX Assist:** Quick support tool for on-demand customer assistance without pre-installed agents.
3. **NETRIX Console:** The web-based command center (this frontend architecture) handling fleet management, access authorization, audit logs, licensing, and session initiation.
4. **NETRIX Business:** Multi-organization, team role-based access control (RBAC), technician dispatching, and policy governance.

> **Key Architectural Mandate:**  
> The React web console is an administrative orchestration and session dispatch interface. Native remote control streaming is initiated via registered OS protocol handlers (e.g., `netrix://session/connect?id=...&token=...`) and validated through secure backend handshakes. The web interface provides session diagnostics, live telemetry signals, token exchange, and administrative controls without spoofing an in-browser canvas streaming engine.

---

## 2. Architectural Principles

1. **Feature-Sliced Domain Architecture:**  
   Code is organized by business feature (`features/auth`, `features/devices`, `features/remote-sessions`, etc.), maintaining strict isolation between domain logic, presentation, and data transport.
2. **Deterministic State Partitioning:**  
   - Server state is strictly owned and cached by **RTK Query** (`baseApi` with tag-based cache invalidation).
   - Ephemeral UI state (collapsed sidebar, active table filters, dark/light theme, notification tray) is owned by targeted **Redux Slices**.
   - Component-isolated state (modal openness, form step, hover menus) remains in standard React hooks (`useState`, `useReducer`).
3. **Strict Type Safety & Schema Contracts:**  
   Full TypeScript 5.x coverage in strict mode. All API payloads, models, and form submissions are validated at runtime via **Zod** schemas matching strongly-typed TypeScript interfaces.
4. **Enterprise Design System Foundation:**  
   Built on **Bootstrap 5.3** as a low-level grid and utility engine, completely styled through a bespoke SCSS design token layer (`assets/styles` / `styles/`). Deep indigo (`#1E1B4B`), electric cobalt (`#3B82F6`), slate neutrals, refined elevation shadows, and high-contrast typography eliminate any default template appearance.
5. **Security by Default:**  
   No plaintext credentials, remote computer passwords, or master keys are stored in `localStorage` or `sessionStorage`. Authentication utilizes secure HttpOnly SameSite cookie flows or short-lived memory tokens with automated refresh rotations.

---

## 3. High-Level System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  NETRIX Console                                   |
|                             (React 18/19 + Vite + TS)                             |
+-----------------------------------------------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                   |                                   |
[ UI Presentation Layer ]     [ State Management ]                 [ API & Telemetry ]
  - Netrix Design System        - Redux Toolkit                      - RTK Query BaseApi
  - Bootstrap 5 Grid/Tokens     - Theme & Preferences Slice          - Re-auth Interceptors
  - Reusable Atoms/Molecules    - Active Device / Filters Slice      - Native Client Protocol Handler
  - Responsive App Shell        - Notifications Slice                - WebSocket Telemetry Hook
     |                                   |                                   |
     +-----------------------------------+-----------------------------------+
                                         |
                       +-----------------------------------+
                       |    Core Feature Modules (Sliced)  |
                       +-----------------------------------+
                       | - Auth & MFA                      |
                       | - Fleet & Device Management       |
                       | - Remote Session Dispatcher       |
                       | - NETRIX Assist (Quick Support)   |
                       | - Address Book & Favorites        |
                       | - Organizations & RBAC Teams      |
                       | - Technicians & Dispatching       |
                       | - Audit Logs & Activity Analytics |
                       | - Subscriptions & Licensing       |
                       | - System Administration Console   |
                       +-----------------------------------+
```

---

## 4. Directory & Module Boundaries

The project adopts a structured, maintainable filesystem hierarchy:

```
src/
├── app/                  # Application bootstrap, root store, router, global providers
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx
│   ├── store.ts
│   ├── providers/
│   └── guards/           # AuthGuard, RoleGuard, LicenseGuard
├── assets/               # Brand vectors, logos, illustrations, webfonts
├── components/           # Reusable generic UI components
│   ├── common/           # Avatar, Badge, Spinner, Divider
│   ├── buttons/          # Button, ActionButton, ButtonGroup
│   ├── forms/            # FormInput, FormSelect, FormSwitch, FormSearch
│   ├── feedback/         # Alert, Toast, EmptyState, SkeletonLoader, ConfirmModal
│   ├── overlays/         # Modal, Drawer, Tooltip, DropdownMenu
│   ├── tables/           # TanStack DataTable, TablePagination, FilterBar
│   ├── navigation/       # Tabs, Breadcrumbs, SegmentedControl
│   └── charts/           # MetricAreaChart, StatusDistributionBar, ActivityHeatmap
├── features/             # Business domain feature packages
│   ├── auth/
│   ├── dashboard/
│   ├── devices/
│   ├── remote-sessions/
│   ├── address-book/
│   ├── quick-support/
│   ├── organizations/
│   ├── technicians/
│   ├── licenses/
│   ├── activity/
│   ├── settings/
│   └── admin/
├── services/             # API clients, protocol launcher, storage abstractions
│   ├── api/
│   ├── mock/             # Controlled mock data fixtures & handlers
│   └── protocol/         # Native NETRIX Client URI launcher
├── hooks/                # Global custom React hooks
├── types/                # Global type definitions and contracts
├── utils/                # Pure formatting, date, cryptographic, and network helpers
└── styles/               # SCSS token architecture and Bootstrap overrides
```

---

## 5. Security Architecture

1. **Authentication Tokens:** Short-lived JWT access tokens stored in memory. Refresh tokens held in Secure HttpOnly cookies (in production) or intercepted by the RTK Query `baseQueryWithReauth` wrapper.
2. **Access Control (RBAC):** Hierarchical permissions:
   - `SuperAdmin`: Full platform control & cross-tenant audit.
   - `OrgAdmin`: Full control over specific organization, billing, and teams.
   - `TechnicianLead`: Session dispatch, technician assignments, address books.
   - `Technician`: Assigned remote sessions, address book entries.
   - `Viewer / Audit`: Read-only access to audit logs and device statuses.
3. **Data Sanitization & Injection Defense:** No usage of `dangerouslySetInnerHTML`. Form inputs parsed through Zod. Dynamic URLs validated before protocol launching.
4. **Native Client Handshake:** Remote session requests generate single-use, time-bound (60 seconds) cryptographically signed session tickets (`st_...`). The web application never receives or stores the target machine's operating system credentials.
