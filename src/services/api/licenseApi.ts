import { baseApi } from './baseApi';

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

export const licenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentLicense: builder.query<LicenseInfo, void>({
      query: () => '/licenses',
      providesTags: ['Licenses'],
    }),

    activateLicense: builder.mutation<LicenseInfo, string>({
      query: (licenseKey) => ({
        url: '/licenses/activate',
        method: 'POST',
        body: { licenseKey },
      }),
      invalidatesTags: ['Licenses'],
    }),
  }),
});

export const {
  useGetCurrentLicenseQuery,
  useActivateLicenseMutation,
} = licenseApi;
