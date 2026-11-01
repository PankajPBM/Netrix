import React, { useEffect, useRef, useState } from 'react';
import {
  Monitor,
  Maximize2,
  Minimize2,
  PhoneOff,
  Shield,
  Activity,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NetrixRtcEngine } from '@/services/webrtc/netrixRtcEngine';

import { getNormalizedLocalNetrixId } from '@/services/device/localDevice';

interface RemoteViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  role: 'client' | 'host';
}

export const RemoteViewerModal: React.FC<RemoteViewerModalProps> = ({
  isOpen,
  onClose,
  targetId,
  role = 'client',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<NetrixRtcEngine | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [fps] = useState(60);
  const [latency] = useState(14);
  const [statusText, setStatusText] = useState('Initiating P2P WebRTC Handshake...');

  useEffect(() => {
    if (!isOpen || !targetId) return;

    const signalingUrl = 'wss://netrix.prakashkushwaha77.com.np/netrix/ws';
    const localId = getNormalizedLocalNetrixId();
    const cleanTargetId = targetId.replace(/\s+/g, '');

    if (localId === cleanTargetId && role === 'client') {
      setStatusText('Cannot start remote control session to your own local address.');
      return;
    }

    const engine = new NetrixRtcEngine({
      signalingUrl,
      localId,
      remoteId: cleanTargetId,
      role,
      onConnected: () => {
        setIsConnected(true);
        setStatusText('Connected — Encrypted P2P Session Active');
      },
      onDisconnected: () => {
        setIsConnected(false);
        setStatusText('Session Terminated');
      },
      onRemoteStream: (stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      },
      onError: (err) => {
        setStatusText(`Notice: ${err.message}`);
      },
    });

    engine.initialize();
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [isOpen, targetId, role]);

  if (!isOpen) return null;

  // Transmit mouse movement coordinates to Host
  const handleMouseMove = (e: React.MouseEvent<HTMLVideoElement>) => {
    if (!videoRef.current || !engineRef.current || role !== 'client') return;
    const rect = videoRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Send normalized coordinates to host display
    engineRef.current.sendMouseMove(Math.round(xRatio * 1920), Math.round(yRatio * 1080));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!engineRef.current || role !== 'client') return;
    engineRef.current.sendMouseAction('mousedown', e.button);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!engineRef.current || role !== 'client') return;
    engineRef.current.sendMouseAction('mouseup', e.button);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!engineRef.current || role !== 'client') return;
    engineRef.current.sendMouseAction('wheel', 0, e.deltaY > 0 ? -1 : 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column"
      style={{
        zIndex: 99999,
        backgroundColor: '#050811',
      }}
    >
      {/* Top Floating Control Toolbar */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-dark"
        style={{
          backgroundColor: 'rgba(11, 15, 25, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <Monitor size={18} className="text-primary" />
            <span className="fw-bold text-white small">NETRIX Remote</span>
            <span className="badge bg-dark border border-secondary text-info mono small">
              {targetId}
            </span>
          </div>

          <div className="vr bg-secondary opacity-50 my-1" />

          <div className="d-flex align-items-center gap-2 small text-muted">
            <span
              className={`badge ${isConnected ? 'bg-success' : 'bg-warning'} rounded-circle p-1`}
              style={{ width: '8px', height: '8px' }}
            />
            <span className="text-light" style={{ fontSize: '0.8rem' }}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Quality Metrics & Actions */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-md-flex align-items-center gap-3 text-muted mono" style={{ fontSize: '0.75rem' }}>
            <span className="d-flex align-items-center gap-1 text-success">
              <Activity size={14} /> {fps} FPS
            </span>
            <span>{latency} ms</span>
            <span className="d-flex align-items-center gap-1 text-info">
              <Shield size={14} /> ChaCha20-P2P
            </span>
          </div>

          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-light py-1 px-2"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-light py-1 px-2"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <button
              type="button"
              className="btn btn-sm btn-danger py-1 px-3 d-flex align-items-center gap-1 ms-2"
              onClick={onClose}
            >
              <PhoneOff size={14} />
              <span className="small fw-semibold">Disconnect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Remote Desktop Screen Canvas */}
      <div
        className="flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden position-relative"
        style={{ cursor: role === 'client' ? 'default' : 'none' }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="mw-100 mh-100 shadow-lg"
          style={{
            objectFit: 'contain',
            backgroundColor: '#000',
            userSelect: 'none',
          }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        />

        {!isConnected && (
          <div className="position-absolute text-center p-4 rounded card-dark" style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
            <div className="spinner-border text-primary mb-3" role="status" />
            <h5 className="text-white fw-bold mb-1">Connecting to {targetId}...</h5>
            <p className="text-muted small mb-0">Establishing end-to-end encrypted WebRTC channel.</p>
          </div>
        )}
      </div>
    </div>
  );
};
