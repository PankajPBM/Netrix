import React, { useState } from 'react';
import {
  User,
  Shield,
  Moon,
  Sun,
  Laptop,
  CheckCircle,
  Monitor,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setTheme, ThemeMode, setSoundAlerts } from '@/app/store/preferencesSlice';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);
  const soundAlerts = useAppSelector((state) => state.preferences.soundAlertsEnabled);
  const user = useAppSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'client'>('profile');
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Pankaj Kushwaha');
  const [email] = useState(user?.email || 'admin@pbtechzone.com');

  // Security Form state
  const [twoFaActive, setTwoFaActive] = useState(user?.twoFactorEnabled ?? true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg('Profile preferences updated successfully.');
    setTimeout(() => setSaveMsg(null), 3000);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Application & Account Settings</h1>
          <p className="page-subtitle">
            Configure administrative security credentials, themes, notification channels, and client protocol defaults
          </p>
        </div>
      </div>

      {saveMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 p-3">
          <CheckCircle size={18} />
          <div>{saveMsg}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom border-secondary border-opacity-25 pb-2">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={14} className="me-1" />
          <span>Profile & Identity</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'security' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={14} className="me-1" />
          <span>Security & 2FA</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'appearance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('appearance')}
        >
          <Moon size={14} className="me-1" />
          <span>Appearance & Themes</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'client' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('client')}
        >
          <Monitor size={14} className="me-1" />
          <span>NETRIX Remote Client</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'profile' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent">
            <h6 className="fw-bold text-white mb-0">Operator Profile Information</h6>
          </div>
          <div className="card-body p-4" style={{ maxWidth: '600px' }}>
            <form onSubmit={handleSaveProfile}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-white">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-white">Enterprise Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  disabled
                />
                <div className="form-text text-muted small">Managed via your organization identity provider.</div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-white">Assigned Organization</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.organizationName || 'PB Tech Zone Enterprise'}
                  disabled
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent">
            <h6 className="fw-bold text-white mb-0">Two-Factor Authentication & Access Security</h6>
          </div>
          <div className="card-body p-4" style={{ maxWidth: '640px' }}>
            <div className="d-flex align-items-center justify-content-between p-3 rounded-2 mb-4" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
              <div>
                <div className="fw-semibold text-white">Two-Factor Authentication (TOTP)</div>
                <div className="text-muted small">Require 6-digit authenticator code on every administrative sign-in</div>
              </div>
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={twoFaActive}
                  onChange={(e) => {
                    setTwoFaActive(e.target.checked);
                    setSaveMsg(`Two-factor authentication ${e.target.checked ? 'activated' : 'disabled'}.`);
                    setTimeout(() => setSaveMsg(null), 3000);
                  }}
                />
              </div>
            </div>

            <h6 className="fw-bold text-white fs-6 mb-3">Change Administrative Password</h6>
            <form onSubmit={(e) => { e.preventDefault(); setSaveMsg('Password updated.'); setTimeout(() => setSaveMsg(null), 3000); }}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" placeholder="••••••••••••" />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" placeholder="••••••••••••" />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Update Master Password
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent">
            <h6 className="fw-bold text-white mb-0">Display & Interface Preferences</h6>
          </div>
          <div className="card-body p-4" style={{ maxWidth: '640px' }}>
            <div className="mb-4">
              <label className="form-label fw-semibold text-white mb-2">Theme Mode</label>
              <div className="row g-2">
                {(['dark', 'light', 'system'] as ThemeMode[]).map((mode) => (
                  <div key={mode} className="col-4">
                    <button
                      type="button"
                      onClick={() => dispatch(setTheme(mode))}
                      className={`btn w-100 p-3 text-center d-flex flex-column align-items-center gap-2 ${theme === mode ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {mode === 'dark' ? <Moon size={20} /> : mode === 'light' ? <Sun size={20} /> : <Laptop size={20} />}
                      <span className="text-capitalize small fw-semibold">{mode} Mode</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between p-3 rounded-2" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
              <div>
                <div className="fw-semibold text-white">Audio Alert Signals</div>
                <div className="text-muted small">Play auditory alerts when new incoming support requests arrive</div>
              </div>
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => dispatch(setSoundAlerts(e.target.checked))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'client' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent">
            <h6 className="fw-bold text-white mb-0">NETRIX Remote Client Dispatch Policies</h6>
          </div>
          <div className="card-body p-4" style={{ maxWidth: '640px' }}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-white">Client Scheme Handler</label>
              <input type="text" className="form-control font-mono" value="netrix://" disabled />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-white">Default Video Encoding Profile</label>
              <select className="form-select">
                <option value="h265">Hardware HEVC / H.265 (Recommended for low-bandwidth 4K)</option>
                <option value="av1">AV1 Pure Streaming (Ultra-low bitrate)</option>
                <option value="h264">Standard H.264 / AVC (Legacy fallback)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-white">Frame Rate Target</label>
              <select className="form-select">
                <option value="60">60 FPS (Fluid Interactive Desktop)</option>
                <option value="30">30 FPS (Standard Administration)</option>
                <option value="120">120 FPS High Refresh (Local Network LAN)</option>
              </select>
            </div>

            <button type="button" className="btn btn-primary btn-sm" onClick={() => { setSaveMsg('Client profile settings saved.'); setTimeout(() => setSaveMsg(null), 3000); }}>
              Save Client Policies
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
