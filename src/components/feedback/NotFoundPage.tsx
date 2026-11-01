import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 text-center" style={{ backgroundColor: 'var(--netrix-bg-app)' }}>
      <div className="card shadow-lg border-0 p-5" style={{ maxWidth: '480px', backgroundColor: 'var(--netrix-bg-surface)' }}>
        <div
          className="p-3 rounded-circle d-inline-flex mb-3 mx-auto"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--netrix-brand-400)' }}
        >
          <Compass size={48} />
        </div>
        <h1 className="fs-3 fw-bold text-white mb-2">404 — Endpoint Not Found</h1>
        <p className="text-muted small mb-4">
          The requested console view or device record does not exist or has been relocated within the fleet.
        </p>
        <Link to="/" className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2">
          <ArrowLeft size={16} />
          <span>Return to Command Center</span>
        </Link>
      </div>
    </div>
  );
};

