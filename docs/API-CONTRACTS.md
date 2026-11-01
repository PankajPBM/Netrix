# NETRIX API Contracts & Endpoint Specifications
**Protocol:** RESTful HTTPS + JSON / WebSockets for Live Signals  
**Base URL:** `VITE_API_BASE_URL` (e.g. `https://api.netrix.pbtechzone.com/v1`)  
**Publisher:** PB Tech Zone  

---

## 1. Authentication & Identity Endpoints

### `POST /v1/auth/login`
Authenticates a user with email and password.
- **Request Body:**
  ```json
  {
    "email": "admin@pbtechzone.com",
    "password": "StrongPassword123!"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "usr_991823",
        "email": "admin@pbtechzone.com",
        "name": "Pankaj Sharma",
        "role": "SuperAdmin",
        "organizationId": "org_pbtech_01",
        "organizationName": "PB Tech Zone Global",
        "avatarUrl": null,
        "twoFactorRequired": false
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
      "expiresIn": 3600
    }
  }
  ```
- **Two-Factor Required Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "twoFactorRequired": true,
      "twoFactorToken": "2fa_temp_token_xyz"
    }
  }
  ```

### `POST /v1/auth/2fa/verify`
- **Request Body:**
  ```json
  {
    "twoFactorToken": "2fa_temp_token_xyz",
    "code": "849201"
  }
  ```

### `POST /v1/auth/refresh`
Refreshes the access token via secure cookie or refresh token header.

### `POST /v1/auth/logout`
Terminates active session and blacklists refresh token.

---

## 2. Device Fleet Management Endpoints

### `GET /v1/devices`
Fetches paginated device fleet.
- **Query Params:** `page`, `limit`, `search`, `status` (`online`|`offline`|`busy`), `group`, `os`, `sortBy`, `sortOrder`.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "dev_001",
          "netrixId": "942 810 503",
          "name": "NYC-FIN-SRV01",
          "alias": "Primary Accounting Server",
          "os": "Windows Server 2025",
          "osType": "windows",
          "version": "NETRIX Host 3.2.0",
          "status": "online",
          "ipAddress": "192.168.10.45",
          "publicIp": "198.51.100.22",
          "group": "Infrastructure / Finance",
          "lastSeen": "2026-11-01T08:35:00Z",
          "cpuUsage": 18,
          "ramUsage": 44,
          "diskUsage": 62,
          "unattendedAccess": true,
          "permissions": ["control", "file_transfer", "restart", "terminal"]
        }
      ],
      "total": 142,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
  ```

### `POST /v1/devices/register`
Registers a new device via deployment token.

### `PATCH /v1/devices/:id`
Updates device alias, group, notes, or unattended access policies.

### `DELETE /v1/devices/:id`
Removes device from organization fleet.

---

## 3. Remote Session & Dispatch Endpoints

### `POST /v1/sessions/dispatch`
Generates a cryptographically signed, single-use ticket to launch a remote desktop session.
- **Request Body:**
  ```json
  {
    "targetNetrixId": "942 810 503",
    "accessType": "unattended",
    "requestedPermissions": ["view", "control", "audio", "clipboard", "file_transfer"]
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "sessionId": "ses_7729104",
      "sessionTicket": "st_987af7e9c8b74610a",
      "protocolLaunchUri": "netrix://connect?ticket=st_987af7e9c8b74610a&target=942810503",
      "expiresAt": "2026-11-01T08:41:00Z",
      "targetDevice": {
        "netrixId": "942 810 503",
        "name": "NYC-FIN-SRV01",
        "status": "online"
      }
    }
  }
  ```

### `GET /v1/sessions/active`
Lists all currently active sessions across the organization.

### `POST /v1/sessions/:id/terminate`
Allows an administrator to immediately sever an active connection.

---

## 4. NETRIX Assist (Quick Support) Endpoints

### `POST /v1/assist/invitations`
Generates a customer one-click support invitation link and 6-digit access code.
- **Request Body:**
  ```json
  {
    "customerName": "Robert Chen",
    "customerEmail": "robert@acmecorp.com",
    "issueSummary": "Outlook crashing on PDF attachment launch",
    "assignedTechnicianId": "usr_technician_04"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "invitationId": "ast_440192",
      "accessCode": "830 192",
      "directLink": "https://assist.netrix.pbtechzone.com/join/830192",
      "status": "waiting_for_client",
      "createdAt": "2026-11-01T08:37:00Z",
      "expiresAt": "2026-11-01T09:37:00Z"
    }
  }
  ```

---

## 5. Organization, Licensing & Activity Endpoints

- `GET /v1/organizations/current`
- `GET /v1/organizations/members`
- `POST /v1/organizations/members/invite`
- `GET /v1/licenses/current`
- `POST /v1/licenses/activate`
- `GET /v1/activity/logs`
- `GET /v1/admin/telemetry`
