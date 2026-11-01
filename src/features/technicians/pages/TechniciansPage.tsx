import React from 'react';
import {
  Star,
} from 'lucide-react';
import {
  useGetTechniciansQuery,
  useUpdateTechnicianStatusMutation,
} from '@/services/api/technicianApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const TechniciansPage: React.FC = () => {
  const { data: technicians, isLoading } = useGetTechniciansQuery();
  const [updateStatus] = useUpdateTechnicianStatusMutation();

  if (isLoading) {
    return <LoadingSpinner message="Querying technician roster and dispatch queue..." />;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Technicians & Engineering Roster</h1>
          <p className="page-subtitle">
            Manage support staff availability, workload dispatch, live active session assignments, and resolution SLAs
          </p>
        </div>
      </div>

      {/* Technicians Roster Grid */}
      <div className="row g-3">
        {technicians?.map((tech) => (
          <div key={tech.id} className="col-12 col-md-6 col-xl-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body p-4 text-center">
                {/* Avatar */}
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold mb-3 mx-auto"
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: 'var(--netrix-brand-500)',
                    fontSize: '1.25rem',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  {tech.name.charAt(0)}
                </div>

                <h5 className="fw-bold text-white mb-1 fs-6">{tech.name}</h5>
                <p className="text-muted small mb-2">{tech.role}</p>

                {/* Status Switcher */}
                <div className="mb-3">
                  <select
                    className="form-select form-select-sm text-center mx-auto"
                    style={{ width: '130px', fontSize: '0.75rem' }}
                    value={tech.status}
                    onChange={(e) => updateStatus({ id: tech.id, status: e.target.value as any })}
                  >
                    <option value="online">🟢 Available</option>
                    <option value="busy">🟡 In Session</option>
                    <option value="offline">⚪ Offline</option>
                  </select>
                </div>

                {/* Metrics */}
                <div className="p-3 rounded-2 text-start mb-3" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Active Stream:</span>
                    <span className="text-white fw-semibold">{tech.activeSessionsCount}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Resolved Today:</span>
                    <span className="text-white fw-semibold">{tech.resolvedTodayCount} cases</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Avg Resolution:</span>
                    <span className="text-white font-mono">{tech.avgResolutionTime}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>CSAT Rating:</span>
                    <span className="text-warning fw-bold d-flex align-items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      {tech.rating} / 5.0
                    </span>
                  </div>
                </div>

                <button type="button" className="btn btn-secondary btn-sm w-100" style={{ fontSize: '0.75rem' }}>
                  Inspect Session History
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
