import React, { useState } from 'react';
import {
  FileClock,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useGetActivityLogsQuery } from '@/services/api/activityApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export const ActivityPage: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const { data: logs, isLoading } = useGetActivityLogsQuery({
    category,
    search,
  });

  if (isLoading) {
    return <LoadingSpinner message="Retrieving cryptographically verified audit records..." />;
  }

  const exportCsv = () => {
    if (!logs || logs.length === 0) return;
    const headers = ['Timestamp', 'Actor', 'Action', 'Target', 'Category', 'IP Address', 'Status'];
    const rows = logs.map((l) => [l.timestamp, l.actor, l.action, l.target, l.category, l.ipAddress, l.status]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `netrix_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs & System Activity</h1>
          <p className="page-subtitle">
            Cryptographically sealed timeline of all administrative events, remote sessions, and device telemetry
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            onClick={exportCsv}
            className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text"><Search size={14} /></span>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Filter by actor, action description, or device..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Category Selectors */}
            <div className="col-12 col-md-7 d-flex gap-1 overflow-x-auto justify-content-md-end">
              {['all', 'session', 'auth', 'device', 'license', 'admin'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`btn btn-sm text-capitalize flex-shrink-0 ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      {logs && logs.length > 0 ? (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp (UTC)</th>
                    <th>Actor / Operator</th>
                    <th>Action</th>
                    <th>Affected Resource</th>
                    <th>Category</th>
                    <th>Origin IP</th>
                    <th className="text-end">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span className="font-mono text-muted small">{log.timestamp}</span>
                      </td>
                      <td>
                        <span className="fw-semibold text-white small">{log.actor}</span>
                      </td>
                      <td>
                        <span className="text-white small">{log.action}</span>
                      </td>
                      <td>
                        <span className="font-mono text-primary small">{log.target}</span>
                      </td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary text-uppercase" style={{ fontSize: '0.6875rem' }}>
                          {log.category}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono text-muted small">{log.ipAddress}</span>
                      </td>
                      <td className="text-end">
                        <span
                          className={`badge ${
                            log.status === 'success'
                              ? 'bg-success-subtle text-success'
                              : log.status === 'warning'
                              ? 'bg-warning-subtle text-warning'
                              : 'bg-danger-subtle text-danger'
                          }`}
                        >
                          {log.status === 'success' ? (
                            <CheckCircle size={11} className="me-1" />
                          ) : log.status === 'warning' ? (
                            <AlertTriangle size={11} className="me-1" />
                          ) : (
                            <XCircle size={11} className="me-1" />
                          )}
                          <span className="text-capitalize">{log.status}</span>
                        </span>
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
          icon={FileClock}
          title="No audit events matched"
          description="Try broadening your search keyword or selecting 'All' categories."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setCategory('all');
          }}
        />
      )}
    </div>
  );
};
