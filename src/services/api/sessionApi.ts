import { baseApi } from './baseApi';
import { MOCK_ACTIVE_SESSIONS, MockSession } from '../mock/mockData';

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

let workingSessions: MockSession[] = [...MOCK_ACTIVE_SESSIONS];

export interface DispatchSessionRequest {
  targetNetrixId: string;
  accessType?: 'unattended' | 'interactive' | 'quick_assist';
  permissions?: string[];
}

export interface DispatchSessionResponse {
  sessionId: string;
  sessionTicket: string;
  protocolLaunchUri: string;
  expiresAt: string;
}

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveSessions: builder.query<MockSession[], void>({
      queryFn: async () => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { data: [...workingSessions] };
        }
        return { data: [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Sessions' as const, id })),
              { type: 'Sessions', id: 'LIST' },
            ]
          : [{ type: 'Sessions', id: 'LIST' }],
    }),

    dispatchSession: builder.mutation<DispatchSessionResponse, DispatchSessionRequest>({
      queryFn: async (payload) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          const cleanId = payload.targetNetrixId.replace(/\s+/g, '');
          const ticket = `st_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
          const sessionId = `NX-${Math.floor(10000 + Math.random() * 90000)}-DSP`;
          const protocolLaunchUri = `netrix://connect?ticket=${ticket}&target=${cleanId}&proto=3.2`;

          // Add to active mock sessions
          const newSession: MockSession = {
            id: `ses_${Date.now()}`,
            sessionId,
            targetNetrixId: payload.targetNetrixId,
            targetDeviceName: `Remote Endpoint (${payload.targetNetrixId})`,
            technicianName: 'Pankaj Kushwaha',
            technicianEmail: 'admin@pbtechzone.com',
            status: 'active',
            duration: '00:00:15',
            startedAt: new Date().toISOString(),
            bandwidthMbps: 3.5,
            fps: 60,
            latencyMs: 12,
            encryption: 'AES-256-GCM / ChaCha20-Poly1305',
            accessType: payload.accessType || 'unattended',
          };
          workingSessions.unshift(newSession);

          return {
            data: {
              sessionId,
              sessionTicket: ticket,
              protocolLaunchUri,
              expiresAt: new Date(Date.now() + 60000).toISOString(),
            },
          };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: [{ type: 'Sessions', id: 'LIST' }],
    }),

    terminateSession: builder.mutation<string, string>({
      queryFn: async (sessionId) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          workingSessions = workingSessions.filter((s) => s.id !== sessionId && s.sessionId !== sessionId);
          return { data: sessionId };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: [{ type: 'Sessions', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetActiveSessionsQuery,
  useDispatchSessionMutation,
  useTerminateSessionMutation,
} = sessionApi;

