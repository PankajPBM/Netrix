import { baseApi } from './baseApi';
import { ActivityLog } from '@/types/models';

export interface GetActivityParams {
  category?: string;
  search?: string;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<ActivityLog[], GetActivityParams | void>({
      query: (params) => ({
        url: '/activity',
        params: params || {},
      }),
      providesTags: ['Activity'],
    }),

    addAuditLog: builder.mutation<ActivityLog, Omit<ActivityLog, 'id' | 'timestamp'>>({
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
