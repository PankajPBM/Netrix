import React, { useState, useEffect } from 'react';
import {
  Cast,
  Zap,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  FolderSync,
  History,
  LifeBuoy,
  Laptop,
  ExternalLink,
} from 'lucide-react';
import { useGetDevicesQuery } from '@/services/api/deviceApi';
import { useAppDispatch } from '@/app/store';
import { openRemoteViewer } from '@/features/remote-sessions/sessionUiSlice';
import { Link } from 'react-router-dom';
import {
  getLocalNetrixId,
  getLocalOneTimePassword,
  regenerateOneTimePassword,
} from '@/services/device/localDevice';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [localId, setLocalId] = useState('');
  const [localPin, setLocalPin] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [remoteIdInput, setRemoteIdInput] = useState('');
  const [remotePinInput, setRemotePinInput] = useState('');

  useEffect(() => {
    setLocalId(getLocalNetrixId());
    setLocalPin(getLocalOneTimePassword());
  }, []);

  const handleCopyId = () => {
    if (localId) {
      navigator.clipboard.writeText(localId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyPin = () => {
    if (localPin) {
      navigator.clipboard.writeText(localPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleRegeneratePin = () => {
    const newPin = regenerateOneTimePassword();
    setLocalPin(newPin);
  };

  const handleDirectConnect = () => {
    const target = remoteIdInput.trim();
    if (!target) return;
    dispatch(openRemoteViewer({ targetId: target, role: 'client' }));
  };

  const { data: devices } = useGetDevicesQuery();

  return (
    <div className="d-flex flex-column gap-4 py-2">
      {/* ANYDESK / ULTRAVIEWER PREMIUM REMOTE CONNECT HUB */}
      <div className="row g-4">
        {/* THIS DESK (ALLOW REMOTE CONTROL) */}
        <div className="col-12 col-lg-6">
          <div
            className="card h-100 shadow-sm border-0 position-relative overflow-hidden"
            style={{
              backgroundColor: 'var(--netrix-bg-surface)',
              border: '1px solid var(--netrix-border)',
              borderRadius: '12px',
            }}
          >
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center pt-3 pb-2 px-4 border-0">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-2 p-2 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60A5FA' }}
                >
                  <Laptop size={20} />
                </div>
                <div>
                  <h2 className="fs-6 fw-bold mb-0 text-white">This Desk</h2>
                  <span className="text-secondary small">Your local workstation</span>
                </div>
              </div>
              <span
                className="badge d-flex align-items-center gap-1 py-1 px-2 fw-medium"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <span className="rounded-circle bg-success d-inline-block" style={{ width: 7, height: 7 }} />
                <span>Ready to Connect</span>
              </span>
            </div>

            <div className="card-body px-4 py-3 d-flex flex-column gap-3">
              {/* Your NETRIX ID Box */}
              <div>
                <label className="text-secondary small text-uppercase fw-semibold mb-1 d-block" style={{ letterSpacing: '0.05em' }}>
                  Your NETRIX Address
                </label>
                <div
                  className="d-flex align-items-center justify-content-between p-2 px-3 rounded-2"
                  style={{
                    backgroundColor: 'var(--netrix-bg-input)',
                    border: '1px solid var(--netrix-border-strong)',
                  }}
                >
                  <span className="fs-3 fw-bold font-mono text-primary letter-spacing-1">{localId}</span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 px-3 py-1 fw-medium"
                  >
                    {copiedId ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    <span>{copiedId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* One-Time Password / PIN Box */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="text-secondary small text-uppercase fw-semibold mb-0" style={{ letterSpacing: '0.05em' }}>
                    One-Time Password / PIN
                  </label>
                  <button
                    type="button"
                    onClick={handleRegeneratePin}
                    className="btn btn-ghost btn-sm p-0 text-primary small d-flex align-items-center gap-1"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <RefreshCw size={11} />
                    <span>Regenerate</span>
                  </button>
                </div>
                <div
                  className="d-flex align-items-center justify-content-between p-2 px-3 rounded-2"
                  style={{
                    backgroundColor: 'var(--netrix-bg-input)',
                    border: '1px solid var(--netrix-border-strong)',
                  }}
                >
                  <span className="fs-4 fw-bold font-mono text-warning letter-spacing-1">{localPin}</span>
                  <button
                    type="button"
                    onClick={handleCopyPin}
                    className="btn btn-ghost btn-sm text-secondary d-flex align-items-center gap-1"
                    title="Copy Password"
                  >
                    {copiedPin ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    <span className="small">{copiedPin ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Explanatory Safety Notice */}
              <div
                className="p-3 rounded-2 d-flex align-items-start gap-2"
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.06)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  color: '#94A3B8',
                  fontSize: '0.8125rem',
                  lineHeight: '1.4',
                }}
              >
                <ShieldCheck size={18} className="text-primary flex-shrink-0 mt-1" />
                <span>
                  Share your address and password with the partner who needs to control this desktop. A confirmation prompt will ask for your consent before any session starts.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* REMOTE DESK (CONTROL A REMOTE COMPUTER) */}
        <div className="col-12 col-lg-6">
          <div
            className="card h-100 shadow-sm border-0 position-relative overflow-hidden"
            style={{
              backgroundColor: 'var(--netrix-bg-surface)',
              border: '1px solid var(--netrix-border)',
              borderRadius: '12px',
            }}
          >
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center pt-3 pb-2 px-4 border-0">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-2 p-2 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}
                >
                  <Cast size={20} />
                </div>
                <div>
                  <h2 className="fs-6 fw-bold mb-0 text-white">Remote Desk</h2>
                  <span className="text-secondary small">Control a remote computer</span>
                </div>
              </div>
              <span
                className="badge py-1 px-2 fw-medium"
                style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60A5FA', border: '1px solid rgba(37, 99, 235, 0.3)' }}
              >
                P2P / WebRTC Direct
              </span>
            </div>

            <div className="card-body px-4 py-3 d-flex flex-column gap-3">
              {/* Remote ID Input */}
              <div>
                <label className="text-secondary small text-uppercase fw-semibold mb-1 d-block" style={{ letterSpacing: '0.05em' }}>
                  Remote NETRIX Address
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg font-mono text-white"
                  placeholder="e.g. 942 810 503"
                  value={remoteIdInput}
                  onChange={(e) => setRemoteIdInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDirectConnect()}
                  style={{
                    backgroundColor: 'var(--netrix-bg-input)',
                    borderColor: 'var(--netrix-border-strong)',
                    fontSize: '1.25rem',
                    letterSpacing: '1px',
                  }}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-secondary small text-uppercase fw-semibold mb-1 d-block" style={{ letterSpacing: '0.05em' }}>
                  Security Password (Optional)
                </label>
                <input
                  type="password"
                  className="form-control font-mono text-white"
                  placeholder="Enter partner's password if required"
                  value={remotePinInput}
                  onChange={(e) => setRemotePinInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDirectConnect()}
                  style={{
                    backgroundColor: 'var(--netrix-bg-input)',
                    borderColor: 'var(--netrix-border-strong)',
                  }}
                />
              </div>

              {/* Connect Actions */}
              <div className="d-flex gap-2 pt-1">
                <button
                  type="button"
                  disabled={!remoteIdInput.trim()}
                  onClick={handleDirectConnect}
                  className="btn btn-primary btn-lg flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-bold"
                  style={{ height: '48px', fontSize: '1rem' }}
                >
                  <Zap size={18} fill="currentColor" />
                  <span>Connect</span>
                </button>
                <button
                  type="button"
                  disabled={!remoteIdInput.trim()}
                  onClick={handleDirectConnect}
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-1 px-3"
                  title="Direct File Transfer"
                >
                  <FolderSync size={16} />
                  <span>Files</span>
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-1">
                <span className="text-secondary small">End-to-End Encrypted WebRTC Session</span>
                <Link to="/assist" className="text-primary text-decoration-none small fw-medium d-flex align-items-center gap-1">
                  <LifeBuoy size={14} />
                  <span>Customer Support PIN &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT SESSIONS & FLEET WORKSTATIONS */}
      <div
        className="card shadow-sm border-0"
        style={{
          backgroundColor: 'var(--netrix-bg-surface)',
          border: '1px solid var(--netrix-border)',
          borderRadius: '12px',
        }}
      >
        <div className="card-header bg-transparent d-flex justify-content-between align-items-center px-4 py-3 border-0">
          <div className="d-flex align-items-center gap-2">
            <History size={18} className="text-primary" />
            <span className="fw-bold text-white fs-6">Recent Sessions & Endpoints</span>
          </div>
          <Link to="/devices" className="btn btn-ghost btn-sm text-primary small d-flex align-items-center gap-1">
            <span>Manage All Devices</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        <div className="card-body px-4 py-2">
          {devices && devices.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ color: 'var(--netrix-text-primary)' }}>
                <thead>
                  <tr style={{ borderColor: 'var(--netrix-border)' }}>
                    <th className="text-secondary small fw-medium">Device Name</th>
                    <th className="text-secondary small fw-medium">NETRIX Address</th>
                    <th className="text-secondary small fw-medium">OS Platform</th>
                    <th className="text-secondary small fw-medium">Status</th>
                    <th className="text-end text-secondary small fw-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => (
                    <tr key={d.id} style={{ borderColor: 'var(--netrix-border)' }}>
                      <td>
                        <div className="fw-semibold text-white">{d.name}</div>
                        <div className="text-secondary small">{d.alias}</div>
                      </td>
                      <td className="font-mono text-primary fw-bold">{d.netrixId}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary">{d.os || d.osType}</span>
                      </td>
                      <td>
                        <span
                          className={`badge d-inline-flex align-items-center gap-1 ${
                            d.status === 'online' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'
                          }`}
                        >
                          <span
                            className={`rounded-circle ${d.status === 'online' ? 'bg-success' : 'bg-secondary'}`}
                            style={{ width: 6, height: 6 }}
                          />
                          <span>{d.status === 'online' ? 'Online' : 'Offline'}</span>
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          onClick={() => dispatch(openRemoteViewer({ targetId: d.netrixId, role: 'client' }))}
                          className="btn btn-primary btn-sm py-1 px-3 d-inline-flex align-items-center gap-1"
                        >
                          <Zap size={13} fill="currentColor" />
                          <span>Connect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-secondary">
              <History size={40} className="mb-2 opacity-40 text-muted" />
              <div className="fw-semibold text-white mb-1">No past sessions recorded yet</div>
              <p className="small text-secondary mb-0" style={{ maxWidth: '440px', margin: '0 auto' }}>
                Enter any remote computer's 9-digit NETRIX address above and click Connect to start an encrypted remote desktop session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
