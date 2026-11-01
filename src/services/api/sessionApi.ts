import { baseApi } from './baseApi';
import { MockSession } from '../mock/mockData';

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
      query: () => '/sessions/active',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Sessions' as const, id })),
              { type: 'Sessions', id: 'LIST' },
            ]
          : [{ type: 'Sessions', id: 'LIST' }],
    }),

    dispatchSession: builder.mutation<DispatchSessionResponse, DispatchSessionRequest>({
      query: (body) => ({
        url: '/sessions/dispatch',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Sessions', id: 'LIST' }],
    }),

    terminateSession: builder.mutation<string, string>({
      query: (sessionId) => ({
        url: `/sessions/${sessionId}/terminate`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Sessions', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetActiveSessionsQuery,
  useDispatchSessionMutation,
  useTerminateSessionMutation,
} = sessionApi;
