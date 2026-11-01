import React, { useState } from 'react';
import {
  Building2,
  Users,
  Shield,
  MoreVertical,
  UserPlus,
} from 'lucide-react';
import {
  useGetOrganizationsQuery,
  useGetOrganizationMembersQuery,
  useInviteMemberMutation,
} from '@/services/api/organizationApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const OrganizationsPage: React.FC = () => {
  const { data: orgs, isLoading: isOrgsLoading } = useGetOrganizationsQuery();
  const { data: members, isLoading: isMembersLoading } = useGetOrganizationMembersQuery();
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();

  const [activeTab, setActiveTab] = useState<'members' | 'organizations'>('members');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Technician' | 'TechnicianLead' | 'OrgAdmin' | 'Viewer'>('Technician');

  if (isOrgsLoading || isMembersLoading) {
    return <LoadingSpinner message="Querying enterprise organizational structures..." />;
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    await inviteMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
    });

    setInviteModalOpen(false);
    setInviteEmail('');
    setInviteName('');
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Enterprise Organizations & Teams</h1>
          <p className="page-subtitle">
            Manage multi-tenant organizations, team memberships, and granular role-based access control (RBAC)
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          >
            <UserPlus size={16} />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom border-secondary border-opacity-25 pb-2">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('members')}
        >
          <Users size={14} className="me-1" />
          <span>Members & Roles ({members?.length || 0})</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'organizations' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('organizations')}
        >
          <Building2 size={14} className="me-1" />
          <span>Organization Tenancies ({orgs?.length || 0})</span>
        </button>
      </div>

      {activeTab === 'members' ? (
        /* MEMBERS & RBAC TABLE */
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
            <span className="fw-bold text-white fs-6">Enterprise Team Roster</span>
            <span className="badge bg-secondary-subtle text-secondary small">
              PB Tech Zone Enterprise HQ
            </span>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email Address</th>
                    <th>RBAC Security Role</th>
                    <th>Account Status</th>
                    <th>Last Active</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members?.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ width: '32px', height: '32px', backgroundColor: 'var(--netrix-brand-500)', fontSize: '0.75rem' }}
                          >
                            {m.name.charAt(0)}
                          </div>
                          <span className="fw-semibold text-white">{m.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted small">{m.email}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            m.role === 'SuperAdmin'
                              ? 'bg-danger-subtle text-danger'
                              : m.role === 'OrgAdmin'
                              ? 'bg-primary-subtle text-primary'
                              : m.role === 'TechnicianLead'
                              ? 'bg-warning-subtle text-warning'
                              : 'bg-secondary-subtle text-secondary'
                          }`}
                        >
                          <Shield size={11} className="me-1" />
                          {m.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${m.status === 'active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                          {m.status === 'active' ? 'Active' : 'Invite Sent'}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted small">{m.lastActive}</span>
                      </td>
                      <td className="text-end">
                        <button type="button" className="btn btn-ghost btn-sm p-1 text-muted">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* MULTI-TENANT ORGANIZATIONS */
        <div className="row g-3">
          {orgs?.map((org) => (
            <div key={org.id} className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <Building2 size={18} className="text-primary" />
                    <span className="fw-bold text-white">{org.name}</span>
                  </div>
                  <span className="badge bg-primary-subtle text-primary small">
                    {org.tier}
                  </span>
                </div>

                <div className="card-body p-3">
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Registered Devices:</span>
                    <span className="text-white fw-bold">{org.deviceCount}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Seat Allocations:</span>
                    <span className="text-white fw-bold">{org.memberCount} Members</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-3">
                    <span>Concurrent Streams:</span>
                    <span className="text-white font-mono">{org.activeChannels} / {org.maxChannels} Channels</span>
                  </div>

                  <div className="progress mb-3" style={{ height: '4px' }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${(org.activeChannels / org.maxChannels) * 100}%` }}
                    />
                  </div>

                  <button type="button" className="btn btn-secondary btn-sm w-100">
                    Switch to Tenant Context
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title fw-bold fs-6 text-white m-0">Invite Team Member</h5>
                <button type="button" className="btn btn-ghost p-1 text-muted" onClick={() => setInviteModalOpen(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleInvite}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-white">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Jason Miller"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-white">Work Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="j.miller@pbtechzone.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-white">Role & Access Tier</label>
                    <select
                      className="form-select"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                    >
                      <option value="Technician">Technician — Assigned remote support & devices</option>
                      <option value="TechnicianLead">Technician Lead — Dispatch queue & technician assignments</option>
                      <option value="OrgAdmin">Organization Admin — Billing, device enrollments, member management</option>
                      <option value="Viewer">Viewer — Audit logs and read-only telemetry</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setInviteModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isInviting} className="btn btn-primary btn-sm">
                    {isInviting ? 'Sending Invite...' : 'Send Invitation'}
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
