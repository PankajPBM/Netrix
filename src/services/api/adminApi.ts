import { baseApi } from './baseApi';

export interface AdminTelemetry {
  totalRegisteredDevices: number;
  activeRelayNodes: number;
  avgRelayLatencyMs: number;
  globalBandwidthUsageGbps: number;
  totalOrganizations: number;
  totalActiveSessions: number;
  systemHealth: 'optimal' | 'degraded' | 'critical';
  relayClusters: {
    region: string;
    nodeCount: number;
    loadPercentage: number;
    status: 'healthy' | 'warning';
  }[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTelemetry: builder.query<AdminTelemetry, void>({
      query: () => '/admin/telemetry',
      providesTags: ['AdminTelemetry'],
    }),
  }),
});

export const {
  useGetAdminTelemetryQuery,
} = adminApi;
