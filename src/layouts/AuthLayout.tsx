import React from 'react';
import { Outlet } from 'react-router-dom';
import { NetrixLogo } from '@/components/common/NetrixLogo';
import { ShieldCheck, Lock, Globe2 } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-between p-3 p-md-4"
      style={{
        backgroundColor: 'var(--netrix-bg-app)',
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.12) 0%, transparent 60%)',
      }}
    >
      {/* Top Branding Bar */}
      <header className="d-flex align-items-center justify-content-between container-fluid max-w-7xl">
        <NetrixLogo size="md" showText={true} showTagline={true} />
        <div className="d-flex align-items-center gap-2 text-muted small">
          <ShieldCheck size={16} className="text-primary" />
          <span className="d-none d-sm-inline">256-Bit TLS End-to-End Handshake</span>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="d-flex align-items-center justify-content-center py-4">
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <Outlet />
        </div>
      </main>

      {/* Footer Credentials & Legal Notice */}
      <footer className="container-fluid max-w-7xl d-flex flex-column flex-sm-row align-items-center justify-content-between text-muted gap-2" style={{ fontSize: '0.75rem' }}>
        <div>
          &copy; {new Date().getFullYear()} PB Tech Zone. All rights reserved. NETRIX Remote Platform.
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="d-flex align-items-center gap-1">
            <Globe2 size={13} /> Global Infrastructure
          </span>
          <span className="d-flex align-items-center gap-1">
            <Lock size={13} /> ISO/IEC 27001 Compliant
          </span>
        </div>
      </footer>
    </div>
  );
};

