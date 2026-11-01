-- NETRIX Production D1 Database Schema Migration
-- Migration: 0001_initial_schema.sql

-- 1. Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'Enterprise Custom',
  contact_email TEXT NOT NULL,
  max_channels INTEGER NOT NULL DEFAULT 50,
  max_seats INTEGER NOT NULL DEFAULT 150,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL COLLATE NOCASE,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'SuperAdmin',
  two_factor_enabled INTEGER NOT NULL DEFAULT 0,
  two_factor_secret TEXT,
  recovery_codes_json TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 3. User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT UNIQUE NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  is_revoked INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(refresh_token_hash);

-- 4. Devices
CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  netrix_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  alias TEXT,
  os_name TEXT NOT NULL,
  os_type TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline',
  ip_address TEXT,
  public_ip TEXT,
  group_name TEXT DEFAULT 'Default Fleet',
  location TEXT,
  last_seen_at TEXT,
  unattended_access INTEGER NOT NULL DEFAULT 1,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_devices_org ON devices(organization_id);
CREATE INDEX IF NOT EXISTS idx_devices_netrix_id ON devices(netrix_id);

-- 5. Remote Sessions
CREATE TABLE IF NOT EXISTS remote_sessions (
  id TEXT PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  target_netrix_id TEXT NOT NULL,
  target_device_name TEXT NOT NULL,
  technician_id TEXT NOT NULL REFERENCES users(id),
  technician_name TEXT NOT NULL,
  technician_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  bandwidth_mbps REAL NOT NULL DEFAULT 0.0,
  fps INTEGER NOT NULL DEFAULT 60,
  latency_ms INTEGER NOT NULL DEFAULT 14,
  encryption TEXT NOT NULL DEFAULT 'ChaCha20-Poly1305 / AES-256-GCM',
  access_type TEXT NOT NULL DEFAULT 'unattended',
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_remote_sessions_org ON remote_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_remote_sessions_status ON remote_sessions(status);

-- 6. Session Tickets (One-Time Cryptographically Bound Tickets)
CREATE TABLE IF NOT EXISTS session_tickets (
  id TEXT PRIMARY KEY,
  ticket_hash TEXT UNIQUE NOT NULL,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  target_netrix_id TEXT NOT NULL,
  permissions_json TEXT NOT NULL,
  access_type TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  is_consumed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tickets_hash ON session_tickets(ticket_hash);

-- 7. Quick Support Requests (NETRIX Assist)
CREATE TABLE IF NOT EXISTS quick_support_requests (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  pin_code TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'waiting',
  assigned_technician_id TEXT,
  assigned_technician_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_quick_support_pin ON quick_support_requests(pin_code);

-- 8. Technicians
CREATE TABLE IF NOT EXISTS technicians (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Lead Technician',
  status TEXT NOT NULL DEFAULT 'online',
  active_sessions_count INTEGER NOT NULL DEFAULT 0,
  resolved_count INTEGER NOT NULL DEFAULT 0,
  rating REAL NOT NULL DEFAULT 5.0
);

-- 9. Enterprise Licenses
CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY,
  organization_id TEXT UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'NETRIX Business Enterprise',
  license_key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  activated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 150,
  used_seats INTEGER NOT NULL DEFAULT 1,
  concurrent_channels INTEGER NOT NULL DEFAULT 50,
  active_channels INTEGER NOT NULL DEFAULT 0,
  features_json TEXT NOT NULL
);

-- 10. Audit & Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  category TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_activity_org ON activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at);

-- 11. Revoked Tokens
CREATE TABLE IF NOT EXISTS revoked_tokens (
  token_id TEXT PRIMARY KEY,
  revoked_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires ON revoked_tokens(expires_at);

-- Initial Bootstrap Data (PB Tech Zone & Pankaj Kushwaha Administrator)
INSERT OR IGNORE INTO organizations (id, name, slug, tier, contact_email, max_channels, max_seats)
VALUES ('org_pbtech', 'PB Tech Zone', 'pb-tech-zone', 'Enterprise Custom', 'contact@pbtechzone.com', 50, 150);

-- Initial License
INSERT OR IGNORE INTO licenses (id, organization_id, tier, license_key, status, activated_at, expires_at, total_seats, used_seats, concurrent_channels, active_channels, features_json)
VALUES (
  'lic_pbtech_01',
  'org_pbtech',
  'NETRIX Business Enterprise',
  'NX-ENT-9941-8820-PBZ-PROD',
  'active',
  '2026-01-15',
  '2027-01-15',
  150,
  1,
  50,
  0,
  '["Unattended 24/7 Access","NETRIX Assist Custom Branding","AES-256 / ChaCha20 Hardware Accelerated Encryption","Mass Deployment MSI / PKG Packages","Session Recording & Real-time Audit Telemetry","Granular RBAC & Multi-Tenant Organization Switcher","Priority 24/7 PB Tech Zone Support SLA"]'
);

