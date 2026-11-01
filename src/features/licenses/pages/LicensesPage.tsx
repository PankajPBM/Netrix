import React, { useState } from 'react';
import {
  KeyRound,
  CheckCircle,
  Building,
  Copy,
  Check,
} from 'lucide-react';
import { useGetCurrentLicenseQuery, useActivateLicenseMutation } from '@/services/api/licenseApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const LicensesPage: React.FC = () => {
  const { data: license, isLoading } = useGetCurrentLicenseQuery();
  const [activateLicense, { isLoading: isActivating }] = useActivateLicenseMutation();

  const [newKeyInput, setNewKeyInput] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingSpinner message="Checking cryptographic license entitlements..." />;
  }

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) return;

    await activateLicense(newKeyInput.trim());
    setSuccessMsg('License key validated and active channel quota updated successfully.');
    setNewKeyInput('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Licenses & Subscription Management</h1>
          <p className="page-subtitle">
            View active tier capacity, concurrent channel allocations, seat quotas, and license key activations
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 p-3">
          <CheckCircle size={18} />
          <div>{successMsg}</div>
        </div>
      )}

      {/* Current Active Plan Overview Card */}
      <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        <div className="card-body p-4">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-success-subtle text-success">Active Commercial License</span>
                <span className="text-muted small">&bull;</span>
                <span className="text-muted small">Expires {license?.expiresAt} ({license?.daysRemaining} days remaining)</span>
              </div>
              <h3 className="fw-bold text-white mb-2">{license?.tier}</h3>
              <p className="text-muted small mb-3">
                Commercial enterprise deployment published by <strong>PB Tech Zone</strong>. Unrestricted multi-monitor streaming, hardware acceleration, and granular RBAC.
              </p>

              {/* License Key Box */}
              <div className="d-flex align-items-center gap-2 p-2 rounded-2 font-mono" style={{ backgroundColor: 'var(--netrix-bg-app)', border: '1px solid var(--netrix-border)', maxWidth: '480px' }}>
                <KeyRound size={16} className="text-primary flex-shrink-0" />
                <span className="text-white text-truncate small">{license?.licenseKey}</span>
                <button
                  type="button"
                  onClick={() => license && copyKey(license.licenseKey)}
                  className="btn btn-ghost btn-sm p-1 ms-auto text-muted"
                  title="Copy License Key"
                >
                  {copiedKey ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Quota Highlights */}
            <div className="col-12 col-lg-4">
              <div className="p-3 rounded-2 text-start" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Concurrent Channels:</span>
                  <span className="text-white fw-bold font-mono">{license?.activeChannels} / {license?.concurrentChannels}</span>
                </div>
                <div className="progress mb-3" style={{ height: '4px' }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${((license?.activeChannels || 1) / (license?.concurrentChannels || 50)) * 100}%` }}
                  />
                </div>

                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Authorized Seat Pool:</span>
                  <span className="text-white fw-bold font-mono">{license?.usedSeats} / {license?.totalSeats}</span>
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div
                    className="progress-bar bg-info"
                    style={{ width: `${((license?.usedSeats || 1) / (license?.totalSeats || 150)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Entitlements & Features Included */}
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-transparent">
              <div className="fw-bold text-white fs-6">Plan Capabilities & Security Entitlements</div>
              <div className="text-muted small">Included with NETRIX Business tier</div>
            </div>
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-3">
                {license?.features.map((feat, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-2">
                    <CheckCircle size={16} className="text-success flex-shrink-0" />
                    <span className="text-white small">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* License Key Activation Box */}
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-transparent">
              <div className="fw-bold text-white fs-6">Apply License Key or Extension</div>
              <div className="text-muted small">Upgrade concurrent channels or renew support validity</div>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleActivate}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-white">Enter License Activation Key</label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    placeholder="NX-ENT-XXXX-XXXX-PBZ-PROD"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    required
                  />
                  <div className="form-text text-muted small">
                    Purchased from PB Tech Zone commercial licensing portal or authorized enterprise reseller.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isActivating}
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                >
                  <KeyRound size={14} />
                  <span>{isActivating ? 'Validating...' : 'Activate License'}</span>
                </button>
              </form>

              <div className="mt-4 p-3 rounded-2" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)' }}>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <Building size={16} className="text-primary flex-shrink-0" />
                  <div>
                    Need additional concurrent session channels? Contact PB Tech Zone enterprise sales at{' '}
                    <span className="text-primary">licensing@pbtechzone.com</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
