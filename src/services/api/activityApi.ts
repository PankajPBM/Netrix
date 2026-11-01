import { baseApi } from './baseApi';
import { MockActivityLog } from '../mock/mockData';

export interface GetActivityParams {
  category?: string;
  search?: string;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<MockActivityLog[], GetActivityParams | void>({
      query: (params) => ({
        url: '/activity',
        params: params || {},
      }),
      providesTags: ['Activity'],
    }),

    addAuditLog: builder.mutation<MockActivityLog, Omit<MockActivityLog, 'id' | 'timestamp'>>({
      query: (body) => ({
        url: '/activity',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Activity'],
    }),
  }),
});

export const {
  useGetActivityLogsQuery,
  useAddAuditLogMutation,
} = activityApi;
