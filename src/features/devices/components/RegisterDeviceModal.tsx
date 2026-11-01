import React, { useState } from 'react';
import {
  X,
  Plus,
  Terminal,
  Copy,
  Check,
  Monitor,
  ShieldCheck,
} from 'lucide-react';
import { useRegisterDeviceMutation } from '@/services/api/deviceApi';

interface RegisterDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterDeviceModal: React.FC<RegisterDeviceModalProps> = ({ isOpen, onClose }) => {
  const [registerDevice, { isLoading }] = useRegisterDeviceMutation();
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [group, setGroup] = useState('Infrastructure / Engineering');
  const [osType, setOsType] = useState<'windows' | 'mac' | 'linux' | 'android'>('windows');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await registerDevice({
      name: name.trim(),
      alias: alias.trim() || name.trim(),
      group,
      osType,
    });

    onClose();
    setName('');
    setAlias('');
  };

  const silentInstallCmd = `msiexec /i "NETRIX_Host_v3.2.0.msi" /qn /norestart DEPLOY_TOKEN="nx_dep_9831a_prod" ORG_ID="org_pbtech_hq"`;

  const copyCmd = () => {
    navigator.clipboard.writeText(silentInstallCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
          {/* Header */}
          <div className="modal-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-2"
                style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', color: 'var(--netrix-brand-400)' }}
              >
                <Plus size={18} />
              </div>
              <div>
                <h5 className="modal-title m-0 fw-bold fs-6 text-white">Register Endpoint Device</h5>
                <p className="text-muted m-0" style={{ fontSize: '0.75rem' }}>
                  Add a computer to your unattended enterprise fleet
                </p>
              </div>
            </div>
            <button type="button" className="btn btn-ghost p-1 text-muted" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Hostname */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-white">Device Hostname</label>
                <div className="input-group">
                  <span className="input-group-text"><Monitor size={16} /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. LON-PROD-APP02"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Alias */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-white">Friendly Alias / Role</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Payment Gateway Secondary Node"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>

              {/* OS Selection */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-white">Target Operating System</label>
                <select
                  className="form-select"
                  value={osType}
                  onChange={(e) => setOsType(e.target.value as any)}
                >
                  <option value="windows">Microsoft Windows (10, 11, Server 2019-2025)</option>
                  <option value="linux">Linux (Ubuntu, Debian, RHEL, CentOS)</option>
                  <option value="mac">Apple macOS (Intel & Apple Silicon M1-M4)</option>
                  <option value="android">Android Enterprise / POS</option>
                </select>
              </div>

              {/* Group */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-white">Assigned Organizational Group</label>
                <select
                  className="form-select"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <option value="Infrastructure / Engineering">Infrastructure / Engineering</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Database Infrastructure">Database Infrastructure</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Retail & Kiosks">Retail & Kiosks</option>
                </select>
              </div>

              {/* Mass Deployment Silent Script Snippet */}
              <div className="p-3 rounded-2 mt-4" style={{ backgroundColor: 'var(--netrix-bg-app)', border: '1px solid var(--netrix-border)' }}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex align-items-center gap-1 text-white fw-semibold small">
                    <Terminal size={14} className="text-primary" />
                    <span>Mass Deployment Token Command</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyCmd}
                    className="btn btn-ghost btn-sm py-0 px-1 text-primary d-flex align-items-center gap-1"
                    style={{ fontSize: '0.6875rem' }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <code className="font-mono text-muted d-block small text-break user-select-all">
                  {silentInstallCmd}
                </code>
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    <span>Enrolling...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Enroll Device</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
