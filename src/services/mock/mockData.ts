// NETRIX Realistic Enterprise Mock Data Fixtures
// Publisher: PB Tech Zone

export interface MockDevice {
  id: string;
  netrixId: string;
  name: string;
  alias: string;
  os: string;
  osType: 'windows' | 'mac' | 'linux' | 'android';
  version: string;
  status: 'online' | 'offline' | 'busy';
  ipAddress: string;
  publicIp: string;
  group: string;
  location: string;
  lastSeen: string;
  uptime: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  unattendedAccess: boolean;
  isFavorite: boolean;
  assignedTechnician?: string;
}

export const MOCK_DEVICES: MockDevice[] = [
  {
    id: 'dev_001',
    netrixId: '942 810 503',
    name: 'NYC-FIN-SRV01',
    alias: 'Primary Financial Ledger',
    os: 'Windows Server 2025 Datacenter',
    osType: 'windows',
    version: 'NETRIX Host 3.2.0-rc4',
    status: 'online',
    ipAddress: '10.240.12.18',
    publicIp: '198.51.100.42',
    group: 'Financial Services',
    location: 'New York DC-01',
    lastSeen: 'Live Now',
    uptime: '42d 18h 12m',
    cpuUsage: 14,
    ramUsage: 48,
    diskUsage: 64,
    unattendedAccess: true,
    isFavorite: true,
    assignedTechnician: 'Alex Patel',
  },
  {
    id: 'dev_002',
    netrixId: '715 204 991',
    name: 'LDN-ENG-WKST04',
    alias: 'Lead CAD Station',
    os: 'Windows 11 Pro Enterprise (24H2)',
    osType: 'windows',
    version: 'NETRIX Host 3.2.0',
    status: 'busy',
    ipAddress: '10.120.4.92',
    publicIp: '203.0.113.19',
    group: 'Engineering Core',
    location: 'London Office (Canary Wharf)',
    lastSeen: 'In Session (Alex Patel)',
    uptime: '14d 06h 44m',
    cpuUsage: 78,
    ramUsage: 82,
    diskUsage: 51,
    unattendedAccess: true,
    isFavorite: true,
    assignedTechnician: 'Alex Patel',
  },
  {
    id: 'dev_003',
    netrixId: '381 905 114',
    name: 'SGP-PROD-DB01',
    alias: 'PostgreSQL Primary Node',
    os: 'Ubuntu 24.04 LTS (Kernel 6.8)',
    osType: 'linux',
    version: 'NETRIX Host Linux 3.1.8',
    status: 'online',
    ipAddress: '10.180.8.201',
    publicIp: '198.51.100.88',
    group: 'Database Infrastructure',
    location: 'Singapore Central DC',
    lastSeen: 'Live Now',
    uptime: '118d 02h 19m',
    cpuUsage: 28,
    ramUsage: 67,
    diskUsage: 84,
    unattendedAccess: true,
    isFavorite: false,
  },
  {
    id: 'dev_004',
    netrixId: '550 192 783',
    name: 'TKO-MAC-DEV03',
    alias: 'iOS CI Build Runner',
    os: 'macOS Sequoia 15.1 (Apple Silicon M3 Max)',
    osType: 'mac',
    version: 'NETRIX Host macOS 3.2.0',
    status: 'online',
    ipAddress: '192.168.80.14',
    publicIp: '192.0.2.77',
    group: 'Mobile Development',
    location: 'Tokyo Shibuya Lab',
    lastSeen: 'Live Now',
    uptime: '8d 14h 50m',
    cpuUsage: 9,
    ramUsage: 38,
    diskUsage: 45,
    unattendedAccess: true,
    isFavorite: true,
    assignedTechnician: 'Emi Tanaka',
  },
  {
    id: 'dev_005',
    netrixId: '812 603 449',
    name: 'BER-EXEC-LAPTOP',
    alias: 'VP Regional Operations',
    os: 'Windows 11 Enterprise',
    osType: 'windows',
    version: 'NETRIX Host 3.1.9',
    status: 'offline',
    ipAddress: '10.10.140.22',
    publicIp: '203.0.113.104',
    group: 'Executive Suite',
    location: 'Berlin HQ',
    lastSeen: '3 hours ago',
    uptime: '0m',
    cpuUsage: 0,
    ramUsage: 0,
    diskUsage: 39,
    unattendedAccess: false,
    isFavorite: false,
  },
  {
    id: 'dev_006',
    netrixId: '629 441 802',
    name: 'SFO-AI-TRAIN02',
    alias: 'Dual RTX 6000 Ada Rig',
    os: 'Red Hat Enterprise Linux 9.4',
    osType: 'linux',
    version: 'NETRIX Host Linux 3.2.0',
    status: 'online',
    ipAddress: '172.24.8.50',
    publicIp: '198.51.100.150',
    group: 'AI Research',
    location: 'San Francisco Bay DC',
    lastSeen: 'Live Now',
    uptime: '64d 21h 05m',
    cpuUsage: 86,
    ramUsage: 91,
    diskUsage: 73,
    unattendedAccess: true,
    isFavorite: true,
  },
  {
    id: 'dev_007',
    netrixId: '401 772 995',
    name: 'SYD-KIOSK-08',
    alias: 'Airport Terminal Information Kiosk',
    os: 'Windows 10 IoT Enterprise LTSC',
    osType: 'windows',
    version: 'NETRIX Host 3.1.6',
    status: 'online',
    ipAddress: '10.50.2.112',
    publicIp: '203.0.113.88',
    group: 'Retail & Kiosks',
    location: 'Sydney T2 Terminal',
    lastSeen: 'Live Now',
    uptime: '89d 11h 03m',
    cpuUsage: 6,
    ramUsage: 24,
    diskUsage: 22,
    unattendedAccess: true,
    isFavorite: false,
  },
  {
    id: 'dev_008',
    netrixId: '294 810 338',
    name: 'DXB-POS-STN01',
    alias: 'Downtown Flagship Terminal',
    os: 'Android 14 Enterprise (POS)',
    osType: 'android',
    version: 'NETRIX Assist Agent 2.4.0',
    status: 'offline',
    ipAddress: '10.99.1.5',
    publicIp: '192.0.2.99',
    group: 'Retail & Kiosks',
    location: 'Dubai Mall Flagship',
    lastSeen: 'Yesterday at 22:45',
    uptime: '0m',
    cpuUsage: 0,
    ramUsage: 0,
    diskUsage: 31,
    unattendedAccess: false,
    isFavorite: false,
  },
];

export interface MockSession {
  id: string;
  sessionId: string;
  targetNetrixId: string;
  targetDeviceName: string;
  technicianName: string;
  technicianEmail: string;
  status: 'active' | 'reconnecting' | 'terminated';
  duration: string;
  startedAt: string;
  bandwidthMbps: number;
  fps: number;
  latencyMs: number;
  encryption: 'AES-256-GCM / ChaCha20-Poly1305' | 'AES-128-GCM';
  accessType: 'unattended' | 'interactive' | 'quick_assist';
}

export const MOCK_ACTIVE_SESSIONS: MockSession[] = [
  {
    id: 'ses_101',
    sessionId: 'NX-99201-LDN',
    targetNetrixId: '715 204 991',
    targetDeviceName: 'LDN-ENG-WKST04',
    technicianName: 'Alex Patel',
    technicianEmail: 'alex.patel@pbtechzone.com',
    status: 'active',
    duration: '00:24:18',
    startedAt: '2026-11-01T08:14:00Z',
    bandwidthMbps: 4.8,
    fps: 60,
    latencyMs: 14,
    encryption: 'AES-256-GCM / ChaCha20-Poly1305',
    accessType: 'unattended',
  },
  {
    id: 'ses_102',
    sessionId: 'NX-99205-NYC',
    targetNetrixId: '942 810 503',
    targetDeviceName: 'NYC-FIN-SRV01',
    technicianName: 'Pankaj Sharma',
    technicianEmail: 'admin@pbtechzone.com',
    status: 'active',
    duration: '00:08:42',
    startedAt: '2026-11-01T08:29:40Z',
    bandwidthMbps: 2.1,
    fps: 30,
    latencyMs: 8,
    encryption: 'AES-256-GCM / ChaCha20-Poly1305',
    accessType: 'unattended',
  },
];

export interface MockAssistTicket {
  id: string;
  pinCode: string;
  clientName: string;
  clientEmail: string;
  summary: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'expired';
  createdAt: string;
  assignedTechnician: string;
}

export const MOCK_ASSIST_TICKETS: MockAssistTicket[] = [
  {
    id: 'ast_901',
    pinCode: '840 291',
    clientName: 'Margaret Reynolds',
    clientEmail: 'm.reynolds@acmeglobal.com',
    summary: 'ERP client authentication certificate handshake failure',
    status: 'waiting',
    createdAt: '8 minutes ago',
    assignedTechnician: 'Sarah Connor',
  },
  {
    id: 'ast_902',
    pinCode: '619 402',
    clientName: 'David Kim',
    clientEmail: 'dkim@fintechventures.io',
    summary: 'Multi-monitor scaling misalignment on dual 4K displays',
    status: 'in_progress',
    createdAt: '19 minutes ago',
    assignedTechnician: 'Alex Patel',
  },
  {
    id: 'ast_903',
    pinCode: '315 994',
    clientName: 'Chloe Bennett',
    clientEmail: 'c.bennett@designstudio.uk',
    summary: 'Printer spooler crash on remote desktop session redirection',
    status: 'completed',
    createdAt: '2 hours ago',
    assignedTechnician: 'Emi Tanaka',
  },
];

export interface MockTechnician {
  id: string;
  name: string;
  email: string;
  role: 'Lead Technician' | 'Senior Support Engineer' | 'Security Analyst' | 'Field Engineer';
  status: 'online' | 'busy' | 'offline';
  activeSessionsCount: number;
  resolvedTodayCount: number;
  avgResolutionTime: string;
  rating: number;
}

export const MOCK_TECHNICIANS: MockTechnician[] = [
  {
    id: 'tech_01',
    name: 'Alex Patel',
    email: 'alex.patel@pbtechzone.com',
    role: 'Senior Support Engineer',
    status: 'busy',
    activeSessionsCount: 1,
    resolvedTodayCount: 6,
    avgResolutionTime: '11m 40s',
    rating: 4.95,
  },
  {
    id: 'tech_02',
    name: 'Sarah Connor',
    email: 'sarah.connor@pbtechzone.com',
    role: 'Lead Technician',
    status: 'online',
    activeSessionsCount: 0,
    resolvedTodayCount: 9,
    avgResolutionTime: '8m 15s',
    rating: 4.98,
  },
  {
    id: 'tech_03',
    name: 'Emi Tanaka',
    email: 'emi.tanaka@pbtechzone.com',
    role: 'Security Analyst',
    status: 'online',
    activeSessionsCount: 0,
    resolvedTodayCount: 4,
    avgResolutionTime: '15m 20s',
    rating: 4.92,
  },
  {
    id: 'tech_04',
    name: 'Marcus Vance',
    email: 'marcus.vance@pbtechzone.com',
    role: 'Field Engineer',
    status: 'offline',
    activeSessionsCount: 0,
    resolvedTodayCount: 3,
    avgResolutionTime: '22m 10s',
    rating: 4.88,
  },
];

export interface MockActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: 'session' | 'auth' | 'device' | 'license' | 'admin';
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'failure';
}

export const MOCK_ACTIVITY_LOGS: MockActivityLog[] = [
  {
    id: 'act_01',
    actor: 'Pankaj Sharma',
    action: 'Initiated Remote Session',
    target: 'NYC-FIN-SRV01 (942 810 503)',
    category: 'session',
    timestamp: '2026-11-01 08:29:40',
    ipAddress: '198.51.100.12',
    status: 'success',
  },
  {
    id: 'act_02',
    actor: 'Alex Patel',
    action: 'Accepted NETRIX Assist Request',
    target: 'Pin #619 402 (David Kim)',
    category: 'session',
    timestamp: '2026-11-01 08:14:00',
    ipAddress: '203.0.113.19',
    status: 'success',
  },
  {
    id: 'act_03',
    actor: 'System Daemon',
    action: 'Unattended Device Ping Timeout',
    target: 'BER-EXEC-LAPTOP (812 603 449)',
    category: 'device',
    timestamp: '2026-11-01 05:30:11',
    ipAddress: '10.10.140.22',
    status: 'warning',
  },
  {
    id: 'act_04',
    actor: 'admin@pbtechzone.com',
    action: 'Two-Factor Authentication Succeeded',
    target: 'Web Console Session',
    category: 'auth',
    timestamp: '2026-11-01 04:12:00',
    ipAddress: '198.51.100.12',
    status: 'success',
  },
  {
    id: 'act_05',
    actor: 'SuperAdmin',
    action: 'Allocated 10 Concurrent Channels',
    target: 'Finance Division Pool',
    category: 'license',
    timestamp: '2026-10-31 16:45:00',
    ipAddress: '198.51.100.12',
    status: 'success',
  },
];

export interface MockOrganization {
  id: string;
  name: string;
  slug: string;
  tier: 'Enterprise Custom' | 'Business Professional' | 'Standard Team';
  memberCount: number;
  deviceCount: number;
  activeChannels: number;
  maxChannels: number;
  contactEmail: string;
}

export const MOCK_ORGANIZATIONS: MockOrganization[] = [
  {
    id: 'org_001',
    name: 'PB Tech Zone Enterprise',
    slug: 'pb-tech-zone',
    tier: 'Enterprise Custom',
    memberCount: 38,
    deviceCount: 142,
    activeChannels: 2,
    maxChannels: 50,
    contactEmail: 'enterprise@pbtechzone.com',
  },
  {
    id: 'org_002',
    name: 'Acme Global Infrastructure',
    slug: 'acme-global',
    tier: 'Business Professional',
    memberCount: 14,
    deviceCount: 45,
    activeChannels: 0,
    maxChannels: 15,
    contactEmail: 'it@acmeglobal.com',
  },
  {
    id: 'org_003',
    name: 'FinTech Cloud Technologies',
    slug: 'fintech-cloud',
    tier: 'Business Professional',
    memberCount: 22,
    deviceCount: 88,
    activeChannels: 1,
    maxChannels: 25,
    contactEmail: 'ops@fintechcloud.io',
  },
];
