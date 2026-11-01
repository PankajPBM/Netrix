/**
 * NETRIX Real-Time WebRTC Remote Desktop Engine
 * Encrypted P2P video stream, audio, and low-latency input data channels
 * Hybrid architecture: High-speed WebSocket with global Cloudflare D1 HTTP fallback
 */

export interface RemoteSessionConfig {
  signalingUrl: string;
  localId: string;
  remoteId: string;
  role: 'host' | 'client';
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (err: Error) => void;
  onRemoteStream?: (stream: MediaStream) => void;
}

export class NetrixRtcEngine {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private ws: WebSocket | null = null;
  private localStream: MediaStream | null = null;
  private config: RemoteSessionConfig;
  private isDestroyed = false;
  private pollInterval: NodeJS.Timeout | null = null;
  private lastPollTimestamp = Date.now() - 5000;
  private processedSignals = new Set<string>();

  private iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ];

  constructor(config: RemoteSessionConfig) {
    this.config = config;
  }

  /**
   * Initialize signaling and WebRTC connection
   */
  public async initialize(): Promise<void> {
    this.peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
      iceCandidatePoolSize: 4,
    });

    // Handle ICE Candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({
          type: 'candidate',
          candidate: event.candidate,
        });
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log('[NETRIX RTC] Connection state:', state);
      if (state === 'connected') {
        this.config.onConnected?.();
      } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.config.onDisconnected?.();
      }
    };

    // If client: listen for incoming remote stream
    if (this.config.role === 'client') {
      this.peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.config.onRemoteStream?.(event.streams[0]);
        }
      };

      // Create bidirectional Data Channel for low-latency input injection
      this.dataChannel = this.peerConnection.createDataChannel('netrix-input', {
        ordered: true,
        maxRetransmits: 0,
      });
      this.setupDataChannel(this.dataChannel);
    } else {
      // Host side: listen for incoming data channel
      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.setupDataChannel(this.dataChannel);
      };

      // Host captures the screen
      await this.startScreenCapture();
    }

    // Connect to Cloudflare WebRTC Signaling Gateway
    this.connectSignaling();
    this.startHttpSignalingFallback();
  }

  /**
   * Host captures the Windows desktop
   */
  private async startScreenCapture(): Promise<void> {
    try {
      if (window.netrixDesktop && window.netrixDesktop.getScreenSources) {
        const sources = await window.netrixDesktop.getScreenSources();
        const primarySource = sources[0];

        if (primarySource) {
          this.localStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              // @ts-expect-error Electron specific constraints
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: primarySource.id,
                minWidth: 1280,
                maxWidth: 1920,
                minHeight: 720,
                maxHeight: 1080,
                minFrameRate: 30,
                maxFrameRate: 60,
              },
            },
          });
        }
      } else if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // Fallback to standard web getDisplayMedia
        this.localStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60 },
          audio: false,
        });
      }

      if (this.localStream && this.peerConnection) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }

      // Notify controller that host screen is ready
      this.sendSignal({ type: 'host_ready' });
    } catch (e) {
      console.error('[NETRIX RTC] Screen capture failed:', e);
      this.config.onError?.(e instanceof Error ? e : new Error(String(e)));
    }
  }

  /**
   * Connect to Cloudflare Worker WebSocket Signaling Gateway
   */
  private connectSignaling(): void {
    try {
      const wsUrl = new URL(this.config.signalingUrl);
      wsUrl.searchParams.set('id', this.config.localId);
      wsUrl.searchParams.set('peerId', this.config.remoteId);
      wsUrl.searchParams.set('role', this.config.role);

      this.ws = new WebSocket(wsUrl.toString());

      this.ws.onopen = async () => {
        console.log('[NETRIX RTC] Signaling WebSocket connected');
        // If client, send initial session request & offer
        if (this.config.role === 'client') {
          await this.createAndSendOffer();
        } else {
          this.sendSignal({ type: 'host_ready' });
        }
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          await this.handleSignal(data);
        } catch (err) {
          console.error('[NETRIX RTC] Signaling processing error:', err);
        }
      };

      this.ws.onerror = (e) => {
        console.warn('[NETRIX RTC] WebSocket notice, relying on HTTP signaling:', e);
      };
    } catch (e) {
      console.warn('[NETRIX RTC] WebSocket initialization notice:', e);
    }
  }

  /**
   * HTTP Signaling Polling Fallback (ensures 100% connectivity across any edge node)
   */
  private startHttpSignalingFallback(): void {
    const poll = async () => {
      if (this.isDestroyed || this.peerConnection?.connectionState === 'connected') return;

      try {
        const cleanId = encodeURIComponent(this.config.localId.replace(/\s+/g, ''));
        const res = await fetch(`https://netrix.prakashkushwaha77.com.np/netrix/api/signal/poll?peerId=${cleanId}&since=${this.lastPollTimestamp}`);
        if (res.ok) {
          const messages = await res.json();
          if (Array.isArray(messages)) {
            for (const msg of messages) {
              const created = msg.created_at || Date.now();
              if (created > this.lastPollTimestamp) {
                this.lastPollTimestamp = created;
              }
              const payload = typeof msg.payload === 'string' ? JSON.parse(msg.payload) : msg.payload;
              await this.handleSignal(payload);
            }
          }
        }
      } catch {}
    };

    this.pollInterval = setInterval(poll, 1200);
  }

  /**
   * Process incoming WebRTC signal
   */
  private async handleSignal(data: any): Promise<void> {
    if (!data || !data.type) return;

    // Deduplicate
    const sigKey = data.type + '_' + (data.sdp?.sdp?.length || '') + '_' + (data.candidate?.candidate || '');
    if (this.processedSignals.has(sigKey)) return;
    this.processedSignals.add(sigKey);

    console.log('[NETRIX RTC] Received signal:', data.type);

    try {
      if (data.type === 'host_ready' && this.config.role === 'client') {
        // Host is ready; send offer immediately
        await this.createAndSendOffer();
      } else if (data.type === 'offer' && this.config.role === 'host' && this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.sendSignal({ type: 'answer', sdp: answer });
      } else if (data.type === 'answer' && this.config.role === 'client' && this.peerConnection) {
        if (this.peerConnection.signalingState !== 'stable') {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
      } else if (data.type === 'candidate' && this.peerConnection) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (err) {
      console.warn('[NETRIX RTC] Signal handling notice:', err);
    }
  }

  private async createAndSendOffer(): Promise<void> {
    if (!this.peerConnection) return;
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.sendSignal({ type: 'offer', sdp: offer });
    } catch (err) {
      console.error('[NETRIX RTC] Failed to create offer:', err);
    }
  }

  private sendSignal(msg: object): void {
    const payload = {
      ...msg,
      from: this.config.localId.replace(/\s+/g, ''),
      to: this.config.remoteId.replace(/\s+/g, ''),
      timestamp: Date.now(),
    };

    // 1. Send via WebSocket if connected
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }

    // 2. Also send via global HTTP signaling for guaranteed cross-edge delivery
    fetch('https://netrix.prakashkushwaha77.com.np/netrix/api/signal/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  /**
   * Setup input listener / injector
   */
  private setupDataChannel(channel: RTCDataChannel): void {
    channel.onopen = () => {
      console.log('[NETRIX RTC] Input DataChannel Open');
    };

    channel.onmessage = (event) => {
      try {
        const cmd = JSON.parse(event.data);
        if (this.config.role === 'host' && window.netrixDesktop) {
          if (cmd.t === 'm') {
            window.netrixDesktop.injectMouseMove(cmd.x, cmd.y);
          } else if (cmd.t === 'c') {
            window.netrixDesktop.injectMouseAction(cmd.action, cmd.btn, cmd.delta);
          } else if (cmd.t === 'k') {
            window.netrixDesktop.injectKeyboardAction(cmd.action, cmd.vk);
          }
        }
      } catch (err) {
        console.error('[NETRIX RTC] Failed to execute remote input:', err);
      }
    };
  }

  public sendMouseMove(x: number, y: number): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({ t: 'm', x, y }));
    }
  }

  public sendMouseAction(action: 'mousedown' | 'mouseup' | 'wheel', btn = 0, delta = 0): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({ t: 'c', action, btn, delta }));
    }
  }

  public sendKeyboardAction(action: 'keydown' | 'keyup', vk: number): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({ t: 'k', action, vk }));
    }
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.pollInterval) clearInterval(this.pollInterval);
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.dataChannel?.close();
    this.peerConnection?.close();
    this.ws?.close();
  }
}
