import React, { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Shield, MonitorCheck } from 'lucide-react';
import { AppSidebar } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import { QuickConnectModal } from './components/QuickConnectModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { RemoteViewerModal } from '@/features/remote-sessions/components/RemoteViewerModal';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { closeRemoteViewer, openRemoteViewer } from '@/features/remote-sessions/sessionUiSlice';
import { getNormalizedLocalNetrixId } from '@/services/device/localDevice';

export const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isViewerOpen, viewerTargetId, viewerRole } = useAppSelector(
    (state) => state.sessionUi
  );

  const [incomingRequest, setIncomingRequest] = useState<{ from: string } | null>(null);
  const standbyWsRef = useRef<WebSocket | null>(null);

  // Standby Host Listener for Incoming Remote Connections
  useEffect(() => {
    if (isViewerOpen) {
      if (standbyWsRef.current) {
        standbyWsRef.current.close();
        standbyWsRef.current = null;
      }
      return;
    }

    const localId = getNormalizedLocalNetrixId();
    const wsUrl = `wss://netrix.prakashkushwaha77.com.np/netrix/ws?id=${localId}&role=standby`;
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);
        standbyWsRef.current = ws;

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'offer' && data.from) {
              setIncomingRequest({ from: data.from });
            }
          } catch {}
        };

        ws.onclose = () => {
          if (!isViewerOpen) {
            reconnectTimer = setTimeout(connect, 5000);
          }
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch {}
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
      standbyWsRef.current = null;
    };
  }, [isViewerOpen]);

  const handleAcceptIncoming = () => {
    if (!incomingRequest) return;
    const callerId = incomingRequest.from;
    setIncomingRequest(null);
    dispatch(openRemoteViewer({ targetId: callerId, role: 'host' }));
  };

  const handleDeclineIncoming = () => {
    setIncomingRequest(null);
  };

  return (
    <div className="netrix-app-shell">
      {/* Primary Navigation Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="netrix-main-wrapper">
        <AppHeader />

        <main className="netrix-page-content">
          <Outlet />
        </main>
      </div>

      {/* Global Overlays */}
      <QuickConnectModal />
      <NotificationDrawer />

      {/* Incoming Connection Consent Dialog */}
      {incomingRequest && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 99998 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content shadow-lg border-0"
              style={{
                backgroundColor: '#0F172A',
                color: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <div className="modal-header border-bottom border-secondary pb-3">
                <div className="d-flex align-items-center gap-2">
                  <Shield className="text-warning" size={22} />
                  <h5 className="modal-title mb-0 fw-bold">Incoming Remote Session Request</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleDeclineIncoming}
                />
              </div>

              <div className="modal-body py-4">
                <p className="text-secondary small mb-3">
                  A remote technician has initiated an encrypted session request to control this computer.
                </p>

                <div
                  className="p-3 rounded-3 mb-3"
                  style={{
                    backgroundColor: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="text-muted small">Requester NETRIX ID:</div>
                  <div className="fs-5 fw-bold font-mono text-primary">{incomingRequest.from}</div>
                </div>

                <div className="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-0">
                  <MonitorCheck size={16} className="text-info flex-shrink-0" />
                  <span>Accepting will initiate hardware-accelerated desktop capture and grant remote cursor and keyboard input.</span>
                </div>
              </div>

              <div className="modal-footer border-top border-secondary pt-3 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-danger px-4"
                  onClick={handleDeclineIncoming}
                >
                  Decline
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 d-flex align-items-center gap-2"
                  onClick={handleAcceptIncoming}
                >
                  <MonitorCheck size={16} />
                  <span>Accept & Share Desktop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Interactive Remote Desktop Viewer */}
      <RemoteViewerModal
        isOpen={isViewerOpen}
        onClose={() => dispatch(closeRemoteViewer())}
        targetId={viewerTargetId}
        role={viewerRole}
      />
    </div>
  );
};
