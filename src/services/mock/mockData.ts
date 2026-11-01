// NETRIX Data Layer
// Publisher: PB Tech Zone | Owner: Pankaj Kushwaha

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

// Clean, zero fake data - starts empty for real fleet enrollment
export const MOCK_DEVICES: MockDevice[] = [];

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

export const MOCK_ACTIVE_SESSIONS: MockSession[] = [];

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

export const MOCK_ASSIST_TICKETS: MockAssistTicket[] = [];

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
    name: 'Pankaj Kushwaha',
    email: 'admin@pbtechzone.com',
    role: 'Lead Technician',
    status: 'online',
    activeSessionsCount: 0,
    resolvedTodayCount: 0,
    avgResolutionTime: '0m',
    rating: 5.0,
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

export const MOCK_ACTIVITY_LOGS: MockActivityLog[] = [];

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
];
