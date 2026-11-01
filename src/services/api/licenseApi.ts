import { baseApi } from './baseApi';

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

export interface LicenseInfo {
  tier: string;
  licenseKey: string;
  status: 'active' | 'expiring_soon' | 'expired';
  activatedAt: string;
  expiresAt: string;
  daysRemaining: number;
  totalSeats: number;
  usedSeats: number;
  concurrentChannels: number;
  activeChannels: number;
  features: string[];
}

let mockLicense: LicenseInfo = {
  tier: 'NETRIX Business Enterprise',
  licenseKey: 'NX-ENT-9941-8820-PBZ-PROD',
  status: 'active',
  activatedAt: '2026-01-15',
  expiresAt: '2027-01-15',
  daysRemaining: 75,
  totalSeats: 150,
  usedSeats: 38,
  concurrentChannels: 50,
  activeChannels: 2,
  features: [
    'Unattended 24/7 Access',
    'NETRIX Assist Custom Branding',
    'AES-256 / ChaCha20 Hardware Accelerated Encryption',
    'Mass Deployment MSI / PKG Packages',
    'Session Recording & Real-time Audit Telemetry',
    'Granular RBAC & Multi-Tenant Organization Switcher',
    'Priority 24/7 PB Tech Zone Support SLA',
  ],
};

export const licenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentLicense: builder.query<LicenseInfo, void>({
      queryFn: async () => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { data: { ...mockLicense } };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      providesTags: ['Licenses'],
    }),

    activateLicense: builder.mutation<LicenseInfo, string>({
      queryFn: async (newKey) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          mockLicense.licenseKey = newKey.toUpperCase();
          mockLicense.status = 'active';
          mockLicense.daysRemaining = 365;
          return { data: { ...mockLicense } };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: ['Licenses'],
    }),
  }),
});

export const {
  useGetCurrentLicenseQuery,
  useActivateLicenseMutation,
} = licenseApi;

