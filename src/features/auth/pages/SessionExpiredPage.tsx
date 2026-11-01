import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, LogIn } from 'lucide-react';

export const SessionExpiredPage: React.FC = () => {
  return (
    <div className="card shadow-lg border-0 text-center" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
      <div className="card-body p-5">
        <div
          className="p-3 rounded-circle d-inline-flex mb-3"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--netrix-status-busy)' }}
        >
          <Clock size={42} />
        </div>
        <h1 className="fs-4 fw-bold text-white mb-2">Session Expired</h1>
        <p className="text-muted small mb-4">
          Your secure authentication token has expired due to enterprise inactivity policies. Please re-authenticate to restore your administrative console session.
        </p>
        <Link to="/auth/login" className="btn btn-primary d-inline-flex align-items-center gap-2">
          <LogIn size={16} />
          <span>Sign In Again</span>
        </Link>
      </div>
    </div>
  );
};
