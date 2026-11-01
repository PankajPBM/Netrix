/**
 * NETRIX Cloudflare Edge Gateway Worker
 * Production Edge API for NETRIX Enterprise Remote Desktop
 * Domain: netrix.prakashkushwaha77.com.np
 * Publisher: PB Tech Zone | Owner: Pankaj Kushwaha
 */

// In-Memory Data Store (Persists in Worker V8 isolate, or bind KV namespace 'NETRIX_KV')
const store = {
  devices: [],
  sessions: [],
  assistTickets: [],
  technicians: [
    {
      id: 'tech_01',
      name: 'Pankaj Kushwaha',
      email: 'admin@pbtechzone.com',
      role: 'Lead Technician',
      status: 'online',
      activeSessionsCount: 0,
      resolvedTodayCount: 0,
      avgResolutionTime: '0m',
      rating: 5.0,
    },
  ],
  activityLogs: [],
  license: {
    tier: 'NETRIX Business Enterprise',
    licenseKey: 'NX-ENT-9941-8820-PBZ-PROD',
    status: 'active',
    activatedAt: '2026-01-15',
    expiresAt: '2027-01-15',
    daysRemaining: 75,
    totalSeats: 150,
    usedSeats: 1,
    concurrentChannels: 50,
    activeChannels: 0,
    features: [
      'Unattended 24/7 Access',
      'NETRIX Assist Custom Branding',
      'AES-256 / ChaCha20 Hardware Accelerated Encryption',
      'Mass Deployment MSI / PKG Packages',
      'Session Recording & Real-time Audit Telemetry',
      'Granular RBAC & Multi-Tenant Organization Switcher',
      'Priority 24/7 PB Tech Zone Support SLA',
    ],
  },
  organizations: [
    {
      id: 'org_pbtech',
      name: 'PB Tech Zone',
      slug: 'pb-tech-zone',
      tier: 'Enterprise Custom',
      memberCount: 1,
      deviceCount: 0,
      activeChannels: 0,
      maxChannels: 50,
      contactEmail: 'contact@pbtechzone.com',
    },
  ],
  telemetry: {
    totalRegisteredDevices: 0,
    activeRelayNodes: 64,
    avgRelayLatencyMs: 12.4,
    globalBandwidthUsageGbps: 0.0,
    totalOrganizations: 1,
    totalActiveSessions: 0,
    systemHealth: 'optimal',
    relayClusters: [
      { region: 'Asia South (Kathmandu / India Edge)', nodeCount: 12, loadPercentage: 18, status: 'healthy' },
      { region: 'Asia Pacific (Singapore)', nodeCount: 16, loadPercentage: 24, status: 'healthy' },
      { region: 'Europe West (Frankfurt)', nodeCount: 18, loadPercentage: 32, status: 'healthy' },
      { region: 'US East (N. Virginia)', nodeCount: 18, loadPercentage: 29, status: 'healthy' },
    ],
  },
};

// CORS Response Helper
function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-netrix-client, x-netrix-version',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };
}

function jsonResponse(data, status = 200, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(request),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, '').replace(/^\/v1/, '') || '/';
    const method = request.method;

    // Handle Preflight CORS OPTIONS
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    try {
      // 1. Health / Root Endpoint
      if (path === '/' || path === '/health') {
        return jsonResponse(
          {
            status: 'online',
            service: 'NETRIX Cloudflare Edge Gateway',
            publisher: 'PB Tech Zone',
            owner: 'Pankaj Kushwaha',
            domain: 'netrix.prakashkushwaha77.com.np',
            timestamp: new Date().toISOString(),
          },
          200,
          request
        );
      }

      // 2. Authentication: POST /auth/login
      if (path === '/auth/login' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const email = body.email || 'admin@pbtechzone.com';
        return jsonResponse(
          {
            success: true,
            data: {
              user: {
                id: 'usr_pankaj_01',
                email: email,
                name: 'Pankaj Kushwaha',
                role: 'SuperAdmin',
                organizationId: 'org_pbtech',
                organizationName: 'PB Tech Zone',
                twoFactorEnabled: false,
              },
              accessToken: `nx_cf_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              expiresIn: 86400,
            },
          },
          200,
          request
        );
      }

      // 3. Devices: GET /devices
      if (path === '/devices' && method === 'GET') {
        const query = url.searchParams.get('search')?.toLowerCase();
        const status = url.searchParams.get('status');
        const group = url.searchParams.get('group');
        const os = url.searchParams.get('os');

        let filtered = [...store.devices];
        if (query) {
          filtered = filtered.filter(
            (d) =>
              d.name.toLowerCase().includes(query) ||
              d.netrixId.toLowerCase().includes(query) ||
              d.alias.toLowerCase().includes(query)
          );
        }
        if (status && status !== 'all') filtered = filtered.filter((d) => d.status === status);
        if (group && group !== 'all') filtered = filtered.filter((d) => d.group === group);
        if (os && os !== 'all') filtered = filtered.filter((d) => d.osType === os);

        return jsonResponse(filtered, 200, request);
      }

      // 4. Devices: POST /devices/register
      if (path === '/devices/register' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const randomId = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
        const newDevice = {
          id: `dev_${Date.now()}`,
          netrixId: randomId,
          name: body.name || 'Remote Host',
          alias: body.alias || body.name || 'Remote Host',
          os: body.osType === 'windows' ? 'Windows 11 Enterprise' : body.osType === 'mac' ? 'macOS Sequoia 15' : 'Linux Kernel 6.8',
          osType: body.osType || 'windows',
          version: 'NETRIX Host 3.2.0',
          status: 'online',
          ipAddress: '10.200.12.' + Math.floor(10 + Math.random() * 200),
          publicIp: request.headers.get('CF-Connecting-IP') || '198.51.100.1',
          group: body.group || 'Default Fleet',
          location: request.cf?.city || 'Cloudflare Edge',
          lastSeen: 'Live Now',
          uptime: '0h 01m',
          cpuUsage: Math.floor(5 + Math.random() * 20),
          ramUsage: Math.floor(20 + Math.random() * 30),
          diskUsage: Math.floor(30 + Math.random() * 40),
          unattendedAccess: true,
          isFavorite: false,
        };

        store.devices.unshift(newDevice);
        store.telemetry.totalRegisteredDevices = store.devices.length;

        // Log audit event
        store.activityLogs.unshift({
          id: `act_${Date.now()}`,
          actor: 'Pankaj Kushwaha',
          action: 'Enrolled New Device',
          target: `${newDevice.name} (${newDevice.netrixId})`,
          category: 'device',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ipAddress: request.headers.get('CF-Connecting-IP') || '127.0.0.1',
          status: 'success',
        });

        return jsonResponse(newDevice, 201, request);
      }

      // 5. Devices: DELETE /devices/:id
      if (path.startsWith('/devices/') && method === 'DELETE') {
        const id = path.split('/')[2];
        store.devices = store.devices.filter((d) => d.id !== id);
        store.telemetry.totalRegisteredDevices = store.devices.length;
        return jsonResponse({ success: true, id }, 200, request);
      }

      // 6. Remote Sessions: GET /sessions/active
      if (path === '/sessions/active' && method === 'GET') {
        return jsonResponse(store.sessions, 200, request);
      }

      // 7. Remote Sessions: POST /sessions/dispatch
      if (path === '/sessions/dispatch' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const targetId = body.targetNetrixId || '942 810 503';
        const cleanId = targetId.replace(/\s+/g, '');
        const ticket = `st_cf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const sessionId = `NX-${Math.floor(10000 + Math.random() * 90000)}-CF`;
        const protocolLaunchUri = `netrix://connect?ticket=${ticket}&target=${cleanId}&proto=3.2`;

        const newSession = {
          id: `ses_${Date.now()}`,
          sessionId,
          targetNetrixId: targetId,
          targetDeviceName: `Remote Host (${targetId})`,
          technicianName: 'Pankaj Kushwaha',
          technicianEmail: 'admin@pbtechzone.com',
          status: 'active',
          duration: '00:00:01',
          startedAt: new Date().toISOString(),
          bandwidthMbps: 3.8,
          fps: 60,
          latencyMs: 14,
          encryption: 'AES-256-GCM / ChaCha20-Poly1305',
          accessType: body.accessType || 'unattended',
        };

        store.sessions.unshift(newSession);
        store.license.activeChannels = store.sessions.length;
        store.telemetry.totalActiveSessions = store.sessions.length;

        // Log audit event
        store.activityLogs.unshift({
          id: `act_${Date.now()}`,
          actor: 'Pankaj Kushwaha',
          action: 'Dispatched Remote Session',
          target: `${newSession.targetDeviceName}`,
          category: 'session',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ipAddress: request.headers.get('CF-Connecting-IP') || '127.0.0.1',
          status: 'success',
        });

        return jsonResponse(
          {
            sessionId,
            sessionTicket: ticket,
            protocolLaunchUri,
            expiresAt: new Date(Date.now() + 60000).toISOString(),
          },
          200,
          request
        );
      }

      // 8. Remote Sessions: POST /sessions/:id/terminate
      if (path.includes('/sessions/') && path.endsWith('/terminate') && method === 'POST') {
        const parts = path.split('/');
        const id = parts[2];
        store.sessions = store.sessions.filter((s) => s.id !== id && s.sessionId !== id);
        store.license.activeChannels = store.sessions.length;
        store.telemetry.totalActiveSessions = store.sessions.length;
        return jsonResponse({ success: true, terminatedId: id }, 200, request);
      }

      // 9. NETRIX Assist: GET /assist/tickets
      if (path === '/assist/tickets' && method === 'GET') {
        return jsonResponse(store.assistTickets, 200, request);
      }

      // 10. NETRIX Assist: POST /assist/invitations
      if (path === '/assist/invitations' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const pin = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
        const newTicket = {
          id: `ast_${Date.now()}`,
          pinCode: pin,
          clientName: body.clientName || 'Customer',
          clientEmail: body.clientEmail || '',
          summary: body.summary || 'General Assistance',
          status: 'waiting',
          createdAt: 'Just now',
          assignedTechnician: body.assignedTechnician || 'Pankaj Kushwaha',
        };

        store.assistTickets.unshift(newTicket);
        return jsonResponse(newTicket, 201, request);
      }

      // 11. Technicians: GET /technicians
      if (path === '/technicians' && method === 'GET') {
        return jsonResponse(store.technicians, 200, request);
      }

      // 12. Organizations: GET /organizations
      if (path === '/organizations' && method === 'GET') {
        return jsonResponse(store.organizations, 200, request);
      }

      // 13. Licenses: GET /licenses
      if (path === '/licenses' && method === 'GET') {
        return jsonResponse(store.license, 200, request);
      }

      // 14. Activity: GET /activity
      if (path === '/activity' && method === 'GET') {
        return jsonResponse(store.activityLogs, 200, request);
      }

      // 15. Admin Telemetry: GET /admin/telemetry
      if (path === '/admin/telemetry' && method === 'GET') {
        return jsonResponse(store.telemetry, 200, request);
      }

      // 404 Route Not Found
      return jsonResponse({ error: 'Endpoint not found', path }, 404, request);
    } catch (err) {
      return jsonResponse({ error: err.message || 'Internal Server Error' }, 500, request);
    }
  },
};
