/**
 * NETRIX Enterprise Production Domain Models
 * Strongly-typed domain interfaces for API payloads, entities, and state
 */

export interface Device {
  id: string;
  netrixId: string;
  name: string;
  alias: string;
  os: string;
  osType: 'windows' | 'mac' | 'linux' | 'android';
  version: string;
  status: 'online' | 'busy' | 'offline';
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
  notes?: string;
  // Fallbacks for snake_case D1 columns
  organization_id?: string;
  netrix_id?: string;
  os_name?: string;
  os_type?: string;
  ip_address?: string;
  public_ip?: string;
  group_name?: string;
  last_seen_at?: string;
  unattended_access?: number;
  is_favorite?: number;
  created_at?: string;
}

export interface RemoteSession {
  id: string;
  sessionId: string;
  targetNetrixId: string;
  targetDeviceName: string;
  technicianName: string;
  technicianEmail: string;
  status: 'active' | 'reconnecting' | 'paused' | 'ended' | 'terminated';
  duration: string;
  durationSeconds?: number;
  startedAt: string;
  bandwidthMbps: number;
  fps: number;
  latencyMs: number;
  encryption: string;
  accessType: 'unattended' | 'interactive';
  // Fallbacks for snake_case D1 columns
  session_id?: string;
  target_netrix_id?: string;
  target_device_name?: string;
  technician_name?: string;
  technician_email?: string;
  duration_seconds?: number;
  bandwidth_mbps?: number;
  latency_ms?: number;
  access_type?: string;
  started_at?: string;
  ended_at?: string;
}

export interface AssistTicket {
  id: string;
  pinCode: string;
  clientName: string;
  clientEmail: string;
  summary: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'resolved' | 'expired' | 'cancelled';
  createdAt: string;
  assignedTechnician: string;
  // Fallbacks for snake_case D1 columns
  pin_code?: string;
  client_name?: string;
  client_email?: string;
  assigned_technician_name?: string;
  created_at?: string;
  resolved_at?: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  activeSessionsCount: number;
  resolvedTodayCount: number;
  avgResolutionTime: string;
  rating: number;
  avatarUrl?: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: 'session' | 'device' | 'auth' | 'settings' | 'license';
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
  // Fallbacks for snake_case D1 columns
  actor_name?: string;
  ip_address?: string;
  created_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: string;
  memberCount: number;
  deviceCount: number;
  activeChannels: number;
  maxChannels: number;
  contactEmail: string;
}

export interface License {
  id?: string;
  tier: string;
  licenseKey: string;
  status: 'active' | 'expiring' | 'expired' | 'suspended';
  activatedAt: string;
  expiresAt: string;
  daysRemaining: number;
  totalSeats: number;
  usedSeats: number;
  concurrentChannels: number;
  activeChannels: number;
  features: string[];
}

export interface AdminTelemetry {
  totalRegisteredDevices: number;
  activeRelayNodes: number;
  avgRelayLatencyMs: number;
  globalBandwidthUsageGbps: number;
  totalOrganizations: number;
  totalActiveSessions: number;
  systemHealth: 'optimal' | 'degraded' | 'warning';
  relayClusters: Array<{
    region: string;
    nodeCount: number;
    loadPercentage: number;
    status: string;
  }>;
}

