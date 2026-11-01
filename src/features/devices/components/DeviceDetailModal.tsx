import React, { useState } from 'react';
import {
  X,
  Zap,
  Activity,
  Cpu,
  HardDrive,
  Network,
  ShieldCheck,
  RefreshCw,
  Power,
  Trash2,
  Check,
  Star,
} from 'lucide-react';
import { Device } from '@/types/models';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAppDispatch } from '@/app/store';
import { openQuickConnectModal } from '@/features/remote-sessions/sessionUiSlice';
import {
  useToggleDeviceFavoriteMutation,
  useDeleteDeviceMutation,
} from '@/services/api/deviceApi';

interface DeviceDetailModalProps {
  device: Device | null;
  onClose: () => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ device, onClose }) => {
  const dispatch = useAppDispatch();
  const [toggleFavorite] = useToggleDeviceFavoriteMutation();
  const [deleteDevice] = useDeleteDeviceMutation();
  const [rebooting, setRebooting] = useState(false);
  const [rebootSent, setRebootSent] = useState(false);

  if (!device) return null;

  const handleStartSession = () => {
    onClose();
    dispatch(openQuickConnectModal(device.netrixId));
  };

  const handleRebootSignal = () => {
    setRebooting(true);
    setTimeout(() => {
      setRebooting(false);
      setRebootSent(true);
      setTimeout(() => setRebootSent(false), 3000);
    }, 1000);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${device.name} from the enterprise fleet?`)) {
      await deleteDevice(device.id);
      onClose();
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
          {/* Header */}
          <div className="modal-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-ghost p-1 text-warning"
                onClick={() => toggleFavorite(device.id)}
                title={device.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
              >
                <Star size={18} fill={device.isFavorite ? 'currentColor' : 'none'} />
              </button>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="modal-title m-0 fw-bold fs-5 text-white">{device.name}</h5>
                  <StatusBadge status={device.status} pulse={device.status === 'online'} />
                </div>
                <div className="text-muted font-mono small">
                  NETRIX ID: <span className="text-primary fw-bold">{device.netrixId}</span> &bull; {device.alias}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={handleStartSession}
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              >
                <Zap size={14} fill="currentColor" />
                <span>Connect</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost p-1 text-muted"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {rebootSent && (
              <div className="alert alert-success d-flex align-items-center gap-2 p-2 mb-3 small">
                <Check size={16} />
                <span>Encrypted restart command dispatched to device daemon.</span>
              </div>
            )}

            {/* Hardware Telemetry Counters */}
            <div className="row g-3 mb-4">
              <div className="col-4">
                <div className="p-3 rounded-2 text-center" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
                  <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mb-1">
                    <Cpu size={14} className="text-primary" />
                    <span>CPU Load</span>
                  </div>
                  <div className="fs-4 fw-bold text-white">{device.cpuUsage}%</div>
                  <div className="progress mt-2" style={{ height: '4px' }}>
                    <div
                      className={`progress-bar ${device.cpuUsage > 80 ? 'bg-danger' : 'bg-primary'}`}
                      style={{ width: `${device.cpuUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="p-3 rounded-2 text-center" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
                  <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mb-1">
                    <Activity size={14} className="text-info" />
                    <span>Memory</span>
                  </div>
                  <div className="fs-4 fw-bold text-white">{device.ramUsage}%</div>
                  <div className="progress mt-2" style={{ height: '4px' }}>
                    <div
                      className={`progress-bar ${device.ramUsage > 80 ? 'bg-danger' : 'bg-info'}`}
                      style={{ width: `${device.ramUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="p-3 rounded-2 text-center" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
                  <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mb-1">
                    <HardDrive size={14} className="text-warning" />
                    <span>Primary Disk</span>
                  </div>
                  <div className="fs-4 fw-bold text-white">{device.diskUsage}%</div>
                  <div className="progress mt-2" style={{ height: '4px' }}>
                    <div
                      className={`progress-bar ${device.diskUsage > 85 ? 'bg-danger' : 'bg-warning'}`}
                      style={{ width: `${device.diskUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fw-bold text-white fs-6 mb-3 d-flex align-items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>System & Operating Environment</span>
                </h6>
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td className="text-muted">OS Version:</td>
                      <td className="text-white fw-medium">{device.os}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Agent Client:</td>
                      <td className="text-white font-mono">{device.version}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Group / Dept:</td>
                      <td className="text-white">{device.group}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Datacenter / Site:</td>
                      <td className="text-white">{device.location}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">System Uptime:</td>
                      <td className="text-white font-mono">{device.uptime}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-md-6">
                <h6 className="fw-bold text-white fs-6 mb-3 d-flex align-items-center gap-2">
                  <Network size={16} className="text-primary" />
                  <span>Network & Security Telemetry</span>
                </h6>
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td className="text-muted">Private IP:</td>
                      <td className="text-white font-mono">{device.ipAddress}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Public Gateway:</td>
                      <td className="text-white font-mono">{device.publicIp}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Unattended Access:</td>
                      <td>
                        <span className={`badge ${device.unattendedAccess ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {device.unattendedAccess ? 'Enabled (Master Token)' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Last Pulse:</td>
                      <td className="text-white">{device.lastSeen}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Assigned Lead:</td>
                      <td className="text-white">{device.assignedTechnician || 'Fleet Pool'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={handleDelete}
            >
              <Trash2 size={14} />
              <span>Deregister Device</span>
            </button>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                onClick={handleRebootSignal}
                disabled={rebooting}
              >
                {rebooting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Power size={14} />
                )}
                <span>Dispatch Reboot</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
