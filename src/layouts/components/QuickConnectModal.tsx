import React, { useState } from 'react';
import {
  X,
  Zap,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  closeQuickConnectModal,
  setTargetNetrixId,
  setLaunchState,
  setSessionTicket,
} from '@/features/remote-sessions/sessionUiSlice';
import { useDispatchSessionMutation } from '@/services/api/sessionApi';
import { launchNetrixClient } from '@/services/protocol/clientLauncher';

export const QuickConnectModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { quickConnectModalOpen, targetNetrixId, launchState, activeSessionTicket } =
    useAppSelector((state) => state.sessionUi);

  const [dispatchSession, { isLoading }] = useDispatchSessionMutation();

  const [permissions, setPermissions] = useState({
    remoteControl: true,
    fileTransfer: true,
    remoteAudio: true,
    clipboardSync: true,
    recording: false,
  });

  const [accessMode, setAccessMode] = useState<'unattended' | 'interactive'>('unattended');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!quickConnectModalOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanId = targetNetrixId.trim();
    if (!cleanId || cleanId.replace(/\s+/g, '').length < 6) {
      setErrorMsg('Please enter a valid 9-digit NETRIX Device ID (e.g., 942 810 503).');
      return;
    }

    try {
      dispatch(setLaunchState('requesting_ticket'));
      const res = await dispatchSession({
        targetNetrixId: cleanId,
        accessType: accessMode,
        permissions: Object.entries(permissions)
          .filter(([, v]) => v)
          .map(([k]) => k),
      }).unwrap();

      dispatch(setSessionTicket(res.sessionTicket));
      dispatch(setLaunchState('launching_client'));

      // Launch via OS registered URI handler
      const launched = await launchNetrixClient(res.protocolLaunchUri);
      if (launched) {
        dispatch(setLaunchState('client_active'));
      } else {
        dispatch(setLaunchState('idle'));
      }
    } catch {
      setErrorMsg('Failed to authorize session ticket. Target host may be offline or unauthorized.');
      dispatch(setLaunchState('failed'));
    }
  };

  const copyUri = (uri: string) => {
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
          {/* Header */}
          <div className="modal-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-2"
                style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', color: 'var(--netrix-brand-400)' }}
              >
                <Zap size={18} />
              </div>
              <div>
                <h5 className="modal-title m-0 fw-bold fs-6 text-white">Start Remote Session</h5>
                <p className="text-muted m-0" style={{ fontSize: '0.75rem' }}>
                  Connect to a remote workstation or server via NETRIX Remote
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost p-1 text-muted"
              onClick={() => dispatch(closeQuickConnectModal())}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 p-2 mb-3" style={{ fontSize: '0.8125rem' }}>
                <AlertTriangle size={16} className="flex-shrink-0" />
                <div>{errorMsg}</div>
              </div>
            )}

            {launchState === 'client_active' ? (
              <div className="text-center py-4">
                <div
                  className="rounded-circle d-inline-flex p-3 mb-3"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--netrix-status-online)' }}
                >
                  <Radio size={36} className="animate-pulse" />
                </div>
                <h5 className="fw-bold text-white mb-1">Native Client Dispatched</h5>
                <p className="text-muted px-4" style={{ fontSize: '0.8125rem' }}>
                  Handshake protocol transmitted to your local <strong>NETRIX Remote</strong> client. The low-latency session window should open automatically.
                </p>

                {activeSessionTicket && (
                  <div className="bg-dark p-3 rounded-2 text-start mt-3 mb-3 border border-secondary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted font-monospace" style={{ fontSize: '0.6875rem' }}>
                        ONE-TIME DISPATCH TICKET
                      </span>
                      <button
                        type="button"
                        onClick={() => copyUri(`netrix://connect?ticket=${activeSessionTicket}`)}
                        className="btn btn-ghost btn-sm py-0 px-1 text-primary d-flex align-items-center gap-1"
                        style={{ fontSize: '0.6875rem' }}
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copied ? 'Copied' : 'Copy URI'}</span>
                      </button>
                    </div>
                    <code className="text-primary font-mono text-break" style={{ fontSize: '0.75rem' }}>
                      {activeSessionTicket}
                    </code>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm px-4"
                  onClick={() => dispatch(closeQuickConnectModal())}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnect}>
                {/* Remote ID Input */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-white">Target NETRIX ID</label>
                  <div className="input-group">
                    <span className="input-group-text font-monospace text-primary">#</span>
                    <input
                      type="text"
                      className="form-control font-monospace fs-6"
                      placeholder="e.g. 942 810 503"
                      value={targetNetrixId}
                      onChange={(e) => dispatch(setTargetNetrixId(e.target.value))}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>
                    Enter the 9-digit alphanumeric identifier displayed on the remote device's NETRIX agent.
                  </div>
                </div>

                {/* Connection Mode Selection */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-white">Access Authorization Mode</label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn flex-fill text-start p-2 ${accessMode === 'unattended' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAccessMode('unattended')}
                      style={{ fontSize: '0.8125rem' }}
                    >
                      <div className="fw-semibold">Unattended Access</div>
                      <div className="text-opacity-75 small">Pre-authorized password/token</div>
                    </button>
                    <button
                      type="button"
                      className={`btn flex-fill text-start p-2 ${accessMode === 'interactive' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAccessMode('interactive')}
                      style={{ fontSize: '0.8125rem' }}
                    >
                      <div className="fw-semibold">Interactive Support</div>
                      <div className="text-opacity-75 small">Prompt user on target screen</div>
                    </button>
                  </div>
                </div>

                {/* Granular Session Permissions */}
                <div className="mb-3 p-3 rounded-2" style={{ backgroundColor: 'var(--netrix-bg-app)', border: '1px solid var(--netrix-border)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-1 text-white fw-semibold" style={{ fontSize: '0.8125rem' }}>
                      <SlidersHorizontal size={14} className="text-primary" />
                      <span>Session Policy Grants</span>
                    </div>
                    <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.6875rem' }}>E2EE</span>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="form-check form-switch mb-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="permControl"
                          checked={permissions.remoteControl}
                          onChange={(e) => setPermissions({ ...permissions, remoteControl: e.target.checked })}
                        />
                        <label className="form-check-label text-muted" htmlFor="permControl" style={{ fontSize: '0.75rem' }}>
                          Remote Keyboard & Mouse
                        </label>
                      </div>
                      <div className="form-check form-switch mb-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="permFiles"
                          checked={permissions.fileTransfer}
                          onChange={(e) => setPermissions({ ...permissions, fileTransfer: e.target.checked })}
                        />
                        <label className="form-check-label text-muted" htmlFor="permFiles" style={{ fontSize: '0.75rem' }}>
                          Direct File Transfer
                        </label>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-check form-switch mb-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="permAudio"
                          checked={permissions.remoteAudio}
                          onChange={(e) => setPermissions({ ...permissions, remoteAudio: e.target.checked })}
                        />
                        <label className="form-check-label text-muted" htmlFor="permAudio" style={{ fontSize: '0.75rem' }}>
                          Remote Audio Forwarding
                        </label>
                      </div>
                      <div className="form-check form-switch mb-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="permClipboard"
                          checked={permissions.clipboardSync}
                          onChange={(e) => setPermissions({ ...permissions, clipboardSync: e.target.checked })}
                        />
                        <label className="form-check-label text-muted" htmlFor="permClipboard" style={{ fontSize: '0.75rem' }}>
                          Synchronized Clipboard
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="d-flex justify-content-end gap-2 pt-2 border-top border-secondary border-opacity-25">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => dispatch(closeQuickConnectModal())}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" />
                        <span>Negotiating Ticket...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Authorize & Launch Client</span>
                        <ExternalLink size={13} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

