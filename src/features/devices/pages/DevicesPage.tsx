import React, { useState } from 'react';
import {
  Monitor,
  Search,
  Plus,
  LayoutGrid,
  List,
  Star,
  Zap,
  MoreVertical,
  Activity,
  Cpu,
  Trash2,
} from 'lucide-react';
import { useGetDevicesQuery, useToggleDeviceFavoriteMutation, useDeleteDeviceMutation } from '@/services/api/deviceApi';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { DeviceDetailModal } from '../components/DeviceDetailModal';
import { RegisterDeviceModal } from '../components/RegisterDeviceModal';
import { Device } from '@/types/models';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { openQuickConnectModal } from '@/features/remote-sessions/sessionUiSlice';
import {
  setViewMode,
  setStatusFilter,
  setGroupFilter,
  setOsFilter,
  setSearchQuery,
  toggleSelectDevice,
  selectAllDevices,
  clearSelection,
  DeviceStatusFilter,
} from '../devicesUiSlice';

export const DevicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { viewMode, statusFilter, groupFilter, osFilter, searchQuery, selectedDeviceIds } =
    useAppSelector((state) => state.devicesUi);

  const { data: devices, isLoading } = useGetDevicesQuery({
    search: searchQuery,
    status: statusFilter,
    group: groupFilter,
    os: osFilter,
  });

  const [toggleFavorite] = useToggleDeviceFavoriteMutation();
  const [deleteDevice] = useDeleteDeviceMutation();

  const [selectedDeviceForModal, setSelectedDeviceForModal] = useState<Device | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const allFilteredDevices = devices || [];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(selectAllDevices(allFilteredDevices.map((d) => d.id)));
    } else {
      dispatch(clearSelection());
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${selectedDeviceIds.length} selected devices?`)) {
      for (const id of selectedDeviceIds) {
        await deleteDevice(id);
      }
      dispatch(clearSelection());
    }
  };

  const groups = ['all', 'Financial Services', 'Engineering Core', 'Database Infrastructure', 'Mobile Development', 'Executive Suite', 'Retail & Kiosks'];
  const osList = ['all', 'windows', 'linux', 'mac', 'android'];

  if (isLoading) {
    return <LoadingSpinner message="Querying enterprise device fleet..." />;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet & Device Management</h1>
          <p className="page-subtitle">
            Configure, inspect, monitor, and establish remote desktop sessions with enterprise endpoints
          </p>
        </div>

        <div className="page-actions">
          {selectedDeviceIds.length > 0 && (
            <div className="d-flex align-items-center gap-2 me-2">
              <span className="badge bg-primary-subtle text-primary small">
                {selectedDeviceIds.length} selected
              </span>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setRegisterModalOpen(true)}
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          >
            <Plus size={16} />
            <span>Enroll Device</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text"><Search size={15} /></span>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search by ID, hostname, IP..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
              </div>
            </div>

            {/* Status Pills */}
            <div className="col-12 col-md-4 d-flex gap-1 overflow-x-auto">
              {(['all', 'online', 'busy', 'offline'] as DeviceStatusFilter[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => dispatch(setStatusFilter(st))}
                  className={`btn btn-sm text-capitalize flex-shrink-0 ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Group & OS Selectors */}
            <div className="col-6 col-md-2">
              <select
                className="form-select form-select-sm"
                value={groupFilter}
                onChange={(e) => dispatch(setGroupFilter(e.target.value))}
              >
                <option value="all">All Groups</option>
                {groups.filter((g) => g !== 'all').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-2 d-flex align-items-center justify-content-end gap-1">
              <select
                className="form-select form-select-sm"
                value={osFilter}
                onChange={(e) => dispatch(setOsFilter(e.target.value))}
              >
                <option value="all">All OS</option>
                {osList.filter((o) => o !== 'all').map((o) => (
                  <option key={o} value={o} className="text-capitalize">{o}</option>
                ))}
              </select>

              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => dispatch(setViewMode('table'))}
                  title="Table View"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => dispatch(setViewMode('grid'))}
                  title="Grid View"
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Devices Display */}
      {allFilteredDevices.length === 0 ? (
        <EmptyState
          icon={Monitor}
          title="No devices match the specified filters"
          description="Try broadening your search query or clear the status and group filters to inspect all fleet endpoints."
          actionText="Clear All Filters"
          onAction={() => {
            dispatch(setSearchQuery(''));
            dispatch(setStatusFilter('all'));
            dispatch(setGroupFilter('all'));
            dispatch(setOsFilter('all'));
          }}
        />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedDeviceIds.length === allFilteredDevices.length && allFilteredDevices.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th style={{ width: '30px' }}></th>
                    <th>Device Name & NETRIX ID</th>
                    <th>Operating System</th>
                    <th>Status</th>
                    <th>Telemetry / Load</th>
                    <th>Group / Site</th>
                    <th>Last Seen</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allFilteredDevices.map((device) => {
                    const isSelected = selectedDeviceIds.includes(device.id);
                    return (
                      <tr key={device.id} className={isSelected ? 'table-active' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => dispatch(toggleSelectDevice(device.id))}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => toggleFavorite(device.id)}
                            className="btn btn-ghost p-0 text-warning"
                          >
                            <Star size={15} fill={device.isFavorite ? 'currentColor' : 'none'} />
                          </button>
                        </td>
                        <td>
                          <div
                            className="fw-bold text-white cursor-pointer hover-text-primary"
                            onClick={() => setSelectedDeviceForModal(device)}
                          >
                            {device.name}
                          </div>
                          <div className="font-mono text-primary small">{device.netrixId}</div>
                        </td>
                        <td>
                          <div className="small text-white">{device.os}</div>
                          <div className="font-mono text-muted small">{device.ipAddress}</div>
                        </td>
                        <td>
                          <StatusBadge status={device.status} pulse={device.status === 'online'} />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <span className="small text-muted" title="CPU">
                              <Cpu size={12} className="me-1 text-primary" />
                              {device.cpuUsage}%
                            </span>
                            <span className="small text-muted" title="RAM">
                              <Activity size={12} className="me-1 text-info" />
                              {device.ramUsage}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary small">
                            {device.group}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted small">{device.lastSeen}</span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end gap-1">
                            <button
                              type="button"
                              onClick={() => dispatch(openQuickConnectModal(device.netrixId))}
                              className="btn btn-primary btn-sm py-1 px-2 d-flex align-items-center gap-1"
                              style={{ fontSize: '0.75rem' }}
                            >
                              <Zap size={13} fill="currentColor" />
                              <span>Connect</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedDeviceForModal(device)}
                              className="btn btn-ghost btn-sm p-1 text-muted"
                              title="Device Details"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="row g-3">
          {allFilteredDevices.map((device) => (
            <div key={device.id} className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 shadow-sm border-0 position-relative">
                <div className="card-header bg-transparent d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(device.id)}
                      className="btn btn-ghost p-0 text-warning"
                    >
                      <Star size={15} fill={device.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <span className="fw-bold text-white text-truncate">{device.name}</span>
                  </div>
                  <StatusBadge status={device.status} pulse={device.status === 'online'} />
                </div>

                <div className="card-body p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small">NETRIX ID</span>
                    <span className="font-mono text-primary fw-bold">{device.netrixId}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small">OS</span>
                    <span className="text-white small text-truncate" style={{ maxWidth: '180px' }}>{device.os}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small">IP Address</span>
                    <span className="font-mono text-muted small">{device.ipAddress}</span>
                  </div>

                  {/* Hardware Telemetry Bars */}
                  <div className="mt-3 p-2 rounded-2" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)' }}>
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>CPU: {device.cpuUsage}%</span>
                      <span>RAM: {device.ramUsage}%</span>
                      <span>Disk: {device.diskUsage}%</span>
                    </div>
                    <div className="progress" style={{ height: '4px' }}>
                      <div className="progress-bar bg-primary" style={{ width: `${device.cpuUsage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-transparent d-flex align-items-center justify-content-between">
                  <button
                    type="button"
                    onClick={() => setSelectedDeviceForModal(device)}
                    className="btn btn-ghost btn-sm text-muted"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Inspect Details
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(openQuickConnectModal(device.netrixId))}
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <Zap size={13} fill="currentColor" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <DeviceDetailModal
        device={selectedDeviceForModal}
        onClose={() => setSelectedDeviceForModal(null)}
      />

      <RegisterDeviceModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};
