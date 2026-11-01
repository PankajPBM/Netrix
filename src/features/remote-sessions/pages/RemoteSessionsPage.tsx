import React, { useState } from 'react';
import {
  Cast,
  Zap,
  PowerOff,
  History,
  Copy,
  Check,
} from 'lucide-react';
import {
  useGetActiveSessionsQuery,
  useTerminateSessionMutation,
} from '@/services/api/sessionApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useAppDispatch } from '@/app/store';
import { openQuickConnectModal } from '../sessionUiSlice';

export const RemoteSessionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: activeSessions, isLoading } = useGetActiveSessionsQuery();
  const [terminateSession, { isLoading: isTerminating }] = useTerminateSessionMutation();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [targetIdInput, setTargetIdInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingSpinner message="Checking active remote sessions..." />;
  }

  const handleQuickConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetIdInput.trim()) {
      dispatch(openQuickConnectModal(targetIdInput.trim()));
      setTargetIdInput('');
    }
  };

  const handleTerminate = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to immediately terminate this remote desktop stream?')) {
      await terminateSession(sessionId);
    }
  };

  const copySessionId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Remote Sessions & Dispatcher</h1>
          <p className="page-subtitle">
            Initiate, audit, and administer active low-latency remote desktop streams
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            onClick={() => dispatch(openQuickConnectModal())}
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          >
            <Zap size={15} fill="currentColor" />
            <span>Launch New Session</span>
          </button>
        </div>
      </div>

      {/* Connection Dispatch Banner */}
      <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary-subtle text-primary">Direct Protocol Dispatch</span>
                <span className="text-muted small">&bull;</span>
                <span className="text-muted small">AES-256-GCM Hardware Encrypted</span>
              </div>
              <h4 className="fw-bold text-white mb-2">Connect to Remote Machine</h4>
              <p className="text-muted small mb-0">
                Enter the target device's 9-digit NETRIX ID to generate an authorized session ticket and launch your native NETRIX Remote desktop client.
              </p>
            </div>

            <div className="col-12 col-lg-5">
              <form onSubmit={handleQuickConnectSubmit} className="d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text font-monospace text-primary">#</span>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    placeholder="e.g. 942 810 503"
                    value={targetIdInput}
                    onChange={(e) => setTargetIdInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-1 px-3">
                  <Zap size={14} fill="currentColor" />
                  <span>Connect</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom border-secondary border-opacity-25 pb-2">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('active')}
        >
          <Cast size={14} className="me-1" />
          <span>Active Remote Streams ({activeSessions?.length || 0})</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={14} className="me-1" />
          <span>Session Audit History</span>
        </button>
      </div>

      {activeTab === 'active' ? (
        activeSessions && activeSessions.length > 0 ? (
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Session ID</th>
                      <th>Target Endpoint</th>
                      <th>Operating Technician</th>
                      <th>Duration</th>
                      <th>Bitrate / FPS</th>
                      <th>Encryption</th>
                      <th className="text-end">Administrative Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions.map((session) => (
                      <tr key={session.id}>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <span className="font-mono text-primary fw-bold small">{session.sessionId}</span>
                            <button
                              type="button"
                              onClick={() => copySessionId(session.sessionId)}
                              className="btn btn-ghost p-0 text-muted"
                              title="Copy Session ID"
                            >
                              {copiedId === session.sessionId ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                            </button>
                          </div>
                          <span className="badge bg-success-subtle text-success small" style={{ fontSize: '0.6875rem' }}>
                            Live Stream
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold text-white">{session.targetDeviceName}</div>
                          <div className="font-mono text-muted small">{session.targetNetrixId}</div>
                        </td>
                        <td>
                          <div className="text-white small">{session.technicianName}</div>
                          <div className="text-muted small">{session.technicianEmail}</div>
                        </td>
                        <td>
                          <div className="font-mono text-white fw-medium">{session.duration}</div>
                          <div className="text-muted small">Started {session.startedAt.slice(11, 16)} UTC</div>
                        </td>
                        <td>
                          <div className="text-white small">{session.bandwidthMbps} Mbps &bull; {session.fps} FPS</div>
                          <div className="text-muted small">{session.latencyMs}ms RTT</div>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary small" style={{ fontSize: '0.6875rem' }}>
                            {session.encryption}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            onClick={() => handleTerminate(session.id)}
                            disabled={isTerminating}
                            className="btn btn-outline-danger btn-sm py-1 px-2 d-inline-flex align-items-center gap-1"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <PowerOff size={13} />
                            <span>Kill Session</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Cast}
            title="No active remote desktop sessions"
            description="There are currently no active peer-to-peer or relay streams underway. Launch a quick connection or join a customer support queue."
            actionText="Start a Remote Connection"
            onAction={() => dispatch(openQuickConnectModal())}
          />
        )
      ) : (
        /* Historical Session Records */
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
            <span className="fw-bold text-white fs-6">Concluded Session Records</span>
            <span className="text-muted small">Immutable E2EE audit trail</span>
          </div>
          <div className="card-body p-4 text-center text-muted">
            <History size={36} className="mb-2 opacity-50" />
            <p className="small mb-0">No past remote desktop sessions recorded yet.</p>
          </div>
        </div>
      )}
    </div>
  );
};
