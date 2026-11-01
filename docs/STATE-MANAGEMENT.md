# NETRIX State Management Architecture
**Framework:** Redux Toolkit (RTK) & RTK Query  
**Product:** NETRIX Console  

---

## 1. Principles of State Segregation

NETRIX enforces a three-tier separation of concerns for application state:

1. **Server-Owned Data Cache (RTK Query):**  
   All entity data fetched from the API (Devices, Sessions, Organizations, Licenses, Technicians, Activity Logs) is stored and synchronized using RTK Query services. Cache lifetime, automated re-fetching on mutations, polling for live metrics, and optimistic updates are governed by RTK Query tag invalidation.
2. **Global Client State (Redux Slices):**  
   State that needs to be shared across disjointed layout components and survives route transitions:
   - User authentication credentials, session token, and active user profile.
   - User interface preferences (Theme: light/dark/system, collapsed/expanded sidebar).
   - Global active device selection for batch operations.
   - Real-time notification tray queue & unread count badge.
   - Active quick connection modal and launch status.
3. **Local Component State (React useState / useReducer):**  
   State that only matters to a single component or sub-tree (e.g., dropdown open/close, multi-step modal wizard index, local search debounce).

---

## 2. Redux Store Slices

| Slice Name | Path | Responsibilities |
|---|---|---|
| `auth` | `src/features/auth/authSlice.ts` | Current authenticated user, JWT access token, isAuthenticated flag, roles, permissions. |
| `preferences` | `src/app/store/preferencesSlice.ts` | Active theme (`dark` / `light` / `system`), collapsed sidebar toggle, sound alerts. |
| `devicesUi` | `src/features/devices/devicesUiSlice.ts` | Selected device IDs for bulk operations, active view mode (grid vs. table), quick filter drawer. |
| `sessionUi` | `src/features/remote-sessions/sessionUiSlice.ts` | Active connection modal target, protocol launch status (`idle`, `generating_ticket`, `launching_client`, `ready`). |
| `notifications` | `src/features/notifications/notificationSlice.ts` | Active toast notifications, notification drawer visibility, unread count. |

---

## 3. RTK Query API Services

All endpoints extend the central `baseApi`:
```
src/services/api/baseApi.ts
```
Features define domain endpoints utilizing `injectEndpoints`:
- `authApi.ts`: Login, 2FA verify, refresh, logout, password recovery.
- `deviceApi.ts`: Device queries, registration, tagging, wake-on-LAN, restart signal, deletion.
- `sessionApi.ts`: Session ticket dispatch, active session monitor, session termination, session audit.
- `organizationApi.ts`: Organization hierarchy, member roles, invite generation.
- `technicianApi.ts`: Technician rosters, workload metrics, queue assignments.
- `licenseApi.ts`: License keys, seat allocations, billing tier details.
- `activityApi.ts`: System audit trail, authentication logs, filtering, CSV export.
- `adminApi.ts`: Tenant-wide telemetry, global node status, license pool overrides.

---

## 4. Cache Tags & Invalidation Matrix

| Tag Type | Produced By | Invalidated By |
|---|---|---|
| `Devices` | `getDevices`, `getDeviceById` | `registerDevice`, `updateDevice`, `deleteDevice`, `bulkUpdateDevices` |
| `Sessions` | `getActiveSessions`, `getSessionHistory` | `initiateSession`, `terminateSession` |
| `Organizations` | `getOrganizations`, `getMembers` | `createOrganization`, `inviteMember`, `updateMemberRole` |
| `Licenses` | `getCurrentLicense`, `getActivations` | `activateLicenseKey`, `deactivateSeat` |
| `Technicians` | `getTechnicians` | `updateTechnicianStatus`, `assignSession` |
| `Activity` | `getActivityLogs` | Session events, device actions, member changes |
