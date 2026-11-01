import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://netrix.prakashkushwaha77.com.np/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('x-netrix-client', 'netrix-web-console');
      headers.set('x-netrix-version', import.meta.env.VITE_APP_VERSION || '1.0.0');
      return headers;
    },
  }),
  tagTypes: [
    'Devices',
    'Sessions',
    'Assist',
    'Organizations',
    'Members',
    'Technicians',
    'Licenses',
    'Activity',
    'AdminTelemetry',
  ],
  endpoints: () => ({}),
});
