import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  return (
    <div className="card shadow-lg border-0 text-center" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
      <div className="card-body p-5">
        <div
          className="p-3 rounded-circle d-inline-flex mb-3"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--netrix-status-danger)' }}
        >
          <ShieldX size={42} />
        </div>
        <h1 className="fs-4 fw-bold text-white mb-2">403 — Access Restricted</h1>
        <p className="text-muted small mb-4">
          Your current account role does not possess the requisite RBAC authorization tier to inspect or manage this administrative resource.
        </p>
        <Link to="/" className="btn btn-primary d-inline-flex align-items-center gap-2">
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

