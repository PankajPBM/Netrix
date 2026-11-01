import React from 'react';
import {
  Monitor,
  Radio,
  Cast,
  KeyRound,
  Zap,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MetricCard } from '@/components/common/MetricCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGetDevicesQuery } from '@/services/api/deviceApi';
import { useGetActiveSessionsQuery } from '@/services/api/sessionApi';
import { useGetActivityLogsQuery } from '@/services/api/activityApi';
import { useGetCurrentLicenseQuery } from '@/services/api/licenseApi';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { openQuickConnectModal } from '@/features/remote-sessions/sessionUiSlice';
import { Link } from 'react-router-dom';

const connectionTrendData = [
  { time: '02:00', sessions: 8, bandwidth: 18 },
  { time: '04:00', sessions: 5, bandwidth: 12 },
  { time: '06:00', sessions: 14, bandwidth: 32 },
  { time: '08:00', sessions: 39, bandwidth: 84 },
  { time: '10:00', sessions: 52, bandwidth: 114 },
  { time: '12:00', sessions: 48, bandwidth: 96 },
  { time: '14:00', sessions: 61, bandwidth: 142 },
  { time: '16:00', sessions: 54, bandwidth: 122 },
  { time: '18:00', sessions: 31, bandwidth: 68 },
  { time: '20:00', sessions: 22, bandwidth: 44 },
  { time: '22:00', sessions: 15, bandwidth: 28 },
];

const osDistributionData = [
  { name: 'Windows', value: 68, color: '#3B82F6' },
  { name: 'Linux', value: 20, color: '#10B981' },
  { name: 'macOS', value: 8, color: '#F59E0B' },
  { name: 'Android', value: 4, color: '#8B5CF6' },
];

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { data: devices, isLoading: isDevicesLoading, refetch: refetchDevices } = useGetDevicesQuery();
  const { data: activeSessions, isLoading: isSessionsLoading } = useGetActiveSessionsQuery();
  const { data: activityLogs } = useGetActivityLogsQuery();
  const { data: license } = useGetCurrentLicenseQuery();

  const totalDevices = devices?.length || 0;
  const onlineDevices = devices?.filter((d) => d.status === 'online').length || 0;
  const offlineDevices = devices?.filter((d) => d.status === 'offline').length || 0;
  const inSessionCount = activeSessions?.length || 0;

  if (isDevicesLoading || isSessionsLoading) {
    return <LoadingSpinner message="Synchronizing enterprise fleet telemetry..." />;
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* Welcome Banner */}
      <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="card-body p-4 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary-subtle text-primary d-inline-flex align-items-center gap-1">
                <Sparkles size={12} />
                <span>NETRIX Console 1.0</span>
              </span>
              <span className="text-muted small">&bull;</span>
              <span className="text-muted small">{user?.organizationName || 'PB Tech Zone Enterprise'}</span>
            </div>
            <h1 className="h3 fw-bold text-white mb-1">
              Welcome, {user?.name || 'Administrator'}
            </h1>
            <p className="text-muted m-0 small" style={{ maxWidth: '640px' }}>
              All remote relays and encryption nodes operating at optimal latency. Ready to initiate unattended sessions or on-demand support assistance.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => refetchDevices()}
              className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
            >
              <RefreshCw size={14} />
              <span>Refresh Telemetry</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch(openQuickConnectModal())}
              className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm"
            >
              <Zap size={14} fill="currentColor" />
              <span>Connect to Remote Device</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Fleet Metrics Grid */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Managed Fleet"
            value={totalDevices}
            subtitle={`${onlineDevices} online now`}
            icon={Monitor}
            variant="primary"
            trend={{ value: '+4 this week', isPositive: true }}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Active Sessions"
            value={inSessionCount}
            subtitle="Low-latency streams"
            icon={Cast}
            variant="success"
            trend={{ value: '14ms avg ping', isPositive: true }}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Offline Endpoints"
            value={offlineDevices}
            subtitle="Require inspection"
            icon={Radio}
            variant="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Channel Quota"
            value={`${license?.activeChannels || 2} / ${license?.concurrentChannels || 50}`}
            subtitle="Concurrent capacity"
            icon={KeyRound}
            variant="info"
          />
        </div>
      </div>

      {/* Charts & Graphs Row */}
      <div className="row g-3">
        {/* Main Connection Activity Area Chart */}
        <div className="col-12 col-xl-8">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-transparent d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-bold text-white fs-6">Connection Volume & Throughput</div>
                <div className="text-muted small">Real-time remote stream concurrent channels (past 24h)</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-secondary-subtle text-secondary small">
                  Peak: 61 concurrent
                </span>
              </div>
            </div>
            <div className="card-body p-3">
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={connectionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderColor: '#334155',
                        borderRadius: '6px',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      name="Active Streams"
                      stroke="#3B82F6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorSessions)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Operating System Fleet Breakdown */}
        <div className="col-12 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-transparent">
              <div className="fw-bold text-white fs-6">Fleet OS Distribution</div>
              <div className="text-muted small">Managed operating systems</div>
            </div>
            <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center">
              <div style={{ width: '100%', height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={osDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={4}
                    >
                      {osDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderColor: '#334155',
                        borderRadius: '6px',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-100 mt-2">
                <div className="row g-2">
                  {osDistributionData.map((item) => (
                    <div key={item.name} className="col-6">
                      <div className="d-flex align-items-center gap-2 p-1 rounded-1" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)' }}>
                        <span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: item.color }} />
                        <span className="text-secondary small">{item.name}</span>
                        <span className="text-white fw-semibold ms-auto small">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions & Priority Devices */}
      <div className="row g-3">
        {/* Active Remote Sessions Table */}
        <div className="col-12 col-xl-7">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-transparent d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Cast size={18} className="text-primary" />
                <span className="fw-bold text-white fs-6">Live Remote Sessions</span>
              </div>
              <Link to="/sessions" className="btn btn-ghost btn-sm text-primary d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <span>View all sessions</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Target Endpoint</th>
                      <th>Operator</th>
                      <th>Duration</th>
                      <th>Bitrate</th>
                      <th>Encryption</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions && activeSessions.length > 0 ? (
                      activeSessions.map((session) => (
                        <tr key={session.id}>
                          <td>
                            <div className="fw-semibold text-white">{session.targetDeviceName}</div>
                            <div className="font-mono text-muted small">{session.targetNetrixId}</div>
                          </td>
                          <td>
                            <div className="small text-white">{session.technicianName}</div>
                          </td>
                          <td>
                            <span className="badge bg-secondary-subtle font-mono text-white">
                              {session.duration}
                            </span>
                          </td>
                          <td>
                            <span className="small text-muted">{session.bandwidthMbps} Mbps</span>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success small" style={{ fontSize: '0.6875rem' }}>
                              E2EE
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              onClick={() => dispatch(openQuickConnectModal(session.targetNetrixId))}
                              className="btn btn-outline-primary btn-sm py-1 px-2"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Join
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted small">
                          No active remote streaming sessions.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Audit & System Activity */}
        <div className="col-12 col-xl-5">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-transparent d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span className="fw-bold text-white fs-6">Recent System Activity</span>
              </div>
              <Link to="/activity" className="btn btn-ghost btn-sm text-primary d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <span>Audit Log</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="card-body p-3">
              <div className="d-flex flex-column gap-3">
                {activityLogs?.slice(0, 4).map((log) => (
                  <div key={log.id} className="d-flex align-items-start gap-2 pb-2 border-bottom border-secondary border-opacity-10">
                    <div className="mt-1">
                      <span
                        className={`rounded-circle d-inline-block ${log.status === 'success' ? 'bg-success' : log.status === 'warning' ? 'bg-warning' : 'bg-danger'}`}
                        style={{ width: 8, height: 8 }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-white small text-truncate">{log.action}</span>
                        <span className="text-muted font-mono" style={{ fontSize: '0.6875rem' }}>{log.timestamp.slice(11, 16)}</span>
                      </div>
                      <div className="text-muted small text-truncate">{log.target} &bull; {log.actor}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Support Assist CTA Box */}
              <div className="mt-3 p-3 rounded-2" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fw-semibold text-white small">NETRIX Assist On-Demand</span>
                  <StatusBadge status="online" label="Queue Ready" />
                </div>
                <p className="text-muted small mb-2">
                  Generate instant 6-digit access codes for customers requiring live desktop assistance.
                </p>
                <Link to="/assist" className="btn btn-outline-primary btn-sm w-100 py-1">
                  Open Quick Support Queue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
