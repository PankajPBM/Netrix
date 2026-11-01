import { baseApi } from './baseApi';

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

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

const mockAdminTelemetry: AdminTelemetry = {
  totalRegisteredDevices: 18450,
  activeRelayNodes: 64,
  avgRelayLatencyMs: 14.8,
  globalBandwidthUsageGbps: 34.2,
  totalOrganizations: 412,
  totalActiveSessions: 890,
  systemHealth: 'optimal',
  relayClusters: [
    { region: 'US East (N. Virginia)', nodeCount: 16, loadPercentage: 42, status: 'healthy' },
    { region: 'US West (Oregon)', nodeCount: 12, loadPercentage: 38, status: 'healthy' },
    { region: 'Europe West (Frankfurt)', nodeCount: 18, loadPercentage: 55, status: 'healthy' },
    { region: 'Asia Pacific (Singapore)', nodeCount: 10, loadPercentage: 48, status: 'healthy' },
    { region: 'Asia Pacific (Tokyo)', nodeCount: 8, loadPercentage: 29, status: 'healthy' },
  ],
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTelemetry: builder.query<AdminTelemetry, void>({
      queryFn: async () => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { data: { ...mockAdminTelemetry } };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      providesTags: ['AdminTelemetry'],
    }),
  }),
});

export const {
  useGetAdminTelemetryQuery,
} = adminApi;

