import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Copy,
  Check,
  User,
  Mail,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  useGetAssistTicketsQuery,
  useCreateAssistInviteMutation,
  useUpdateAssistStatusMutation,
} from '@/services/api/assistApi';
import { useGetTechniciansQuery } from '@/services/api/technicianApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useAppDispatch } from '@/app/store';
import { openQuickConnectModal } from '@/features/remote-sessions/sessionUiSlice';

export const QuickSupportPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: tickets, isLoading } = useGetAssistTicketsQuery();
  const { data: technicians } = useGetTechniciansQuery();
  const [createInvite, { isLoading: isCreating }] = useCreateAssistInviteMutation();
  const [updateStatus] = useUpdateAssistStatusMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [issueSummary, setIssueSummary] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState('Alex Patel');
  const [copiedPin, setCopiedPin] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingSpinner message="Querying active customer support sessions..." />;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !issueSummary) return;

    await createInvite({
      clientName: customerName,
      clientEmail: customerEmail,
      summary: issueSummary,
      assignedTechnician,
    });

    setModalOpen(false);
    setCustomerName('');
    setCustomerEmail('');
    setIssueSummary('');
  };

  const copyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">NETRIX Assist — Quick Support</h1>
          <p className="page-subtitle">
            Provide instant, zero-install customer support sessions with temporary access PINs
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          >
            <Plus size={16} />
            <span>Generate Support PIN</span>
          </button>
        </div>
      </div>

      {/* Customer Experience Information Banner */}
      <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary-subtle text-primary">On-Demand Helpdesk</span>
                <span className="text-muted small">&bull;</span>
                <span className="text-muted small">No Administrative Rights Required</span>
              </div>
              <h5 className="fw-bold text-white mb-1">How Customer Access Works</h5>
              <p className="text-muted small mb-0">
                1. Direct the customer to <code>https://assist.netrix.pbtechzone.com</code>.<br />
                2. Provide the 6-digit access PIN generated below.<br />
                3. The customer explicitly clicks "Authorize Technician" to initiate screen viewing. Access is revoked instantly upon session termination.
              </p>
            </div>

            <div className="col-12 col-md-4 text-md-end">
              <a
                href="https://assist.netrix.pbtechzone.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
              >
                <span>Customer Web Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Active Assist Queue Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <LifeBuoy size={18} className="text-primary" />
            <span className="fw-bold text-white fs-6">Customer Support Queue</span>
          </div>
          <span className="badge bg-secondary-subtle text-secondary small">
            {tickets?.length || 0} Total Tickets
          </span>
        </div>

        <div className="card-body p-0">
          {tickets && tickets.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Access PIN</th>
                    <th>Customer Name</th>
                    <th>Reported Issue</th>
                    <th>Status</th>
                    <th>Assigned Technician</th>
                    <th>Created</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="font-mono text-primary fw-bold fs-6">{t.pinCode}</span>
                          <button
                            type="button"
                            onClick={() => copyPin(t.pinCode)}
                            className="btn btn-ghost p-0 text-muted"
                            title="Copy PIN"
                          >
                            {copiedPin === t.pinCode ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-white">{t.clientName}</div>
                        <div className="text-muted small">{t.clientEmail}</div>
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <div className="text-white small text-truncate">{t.summary}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            t.status === 'in_progress'
                              ? 'bg-warning-subtle text-warning'
                              : t.status === 'completed'
                              ? 'bg-success-subtle text-success'
                              : 'bg-info-subtle text-info'
                          }`}
                        >
                          {t.status === 'in_progress'
                            ? 'In Session'
                            : t.status === 'completed'
                            ? 'Resolved'
                            : 'Waiting for Customer'}
                        </span>
                      </td>
                      <td>
                        <div className="small text-white">{t.assignedTechnician}</div>
                      </td>
                      <td>
                        <span className="text-muted small">{t.createdAt}</span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex align-items-center justify-content-end gap-1">
                          {t.status === 'waiting' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateStatus({ id: t.id, status: 'in_progress' });
                                dispatch(openQuickConnectModal(t.pinCode));
                              }}
                              className="btn btn-primary btn-sm py-1 px-2"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Accept & Connect
                            </button>
                          )}
                          {t.status === 'in_progress' && (
                            <button
                              type="button"
                              onClick={() => updateStatus({ id: t.id, status: 'completed' })}
                              className="btn btn-outline-success btn-sm py-1 px-2 d-flex align-items-center gap-1"
                              style={{ fontSize: '0.75rem' }}
                            >
                              <CheckCircle2 size={13} />
                              <span>Mark Resolved</span>
                            </button>
                          )}
                          {t.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => updateStatus({ id: t.id, status: 'expired' })}
                              className="btn btn-ghost btn-sm p-1 text-danger"
                              title="Revoke PIN"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={LifeBuoy}
              title="Support queue is clear"
              description="No active on-demand assistance requests are in queue. Generate a support PIN to send to a customer."
              actionText="Generate Support PIN"
              onAction={() => setModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Generate PIN Modal */}
      {modalOpen && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title fw-bold fs-6 text-white m-0">Generate Customer Support Invitation</h5>
                <button type="button" className="btn btn-ghost p-1 text-muted" onClick={() => setModalOpen(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreate}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-white">Customer Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text"><User size={16} /></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Margaret Reynolds"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-white">Customer Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><Mail size={16} /></span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="m.reynolds@acmeglobal.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-white">Issue Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="e.g. Cannot open accounting spreadsheet after VPN update..."
                      value={issueSummary}
                      onChange={(e) => setIssueSummary(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-white">Assigned Technician</label>
                    <select
                      className="form-select"
                      value={assignedTechnician}
                      onChange={(e) => setAssignedTechnician(e.target.value)}
                    >
                      {technicians?.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isCreating} className="btn btn-primary btn-sm">
                    {isCreating ? 'Generating...' : 'Issue Access Code'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
