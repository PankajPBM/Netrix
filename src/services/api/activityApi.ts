import { baseApi } from './baseApi';
import { MOCK_ACTIVITY_LOGS, MockActivityLog } from '../mock/mockData';

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

let workingLogs: MockActivityLog[] = [...MOCK_ACTIVITY_LOGS];

export interface GetActivityParams {
  category?: string;
  search?: string;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<MockActivityLog[], GetActivityParams | void>({
      queryFn: async (params) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          let filtered = [...workingLogs];

          if (params?.category && params.category !== 'all') {
            filtered = filtered.filter((l) => l.category === params.category);
          }

          if (params?.search) {
            const q = params.search.toLowerCase();
            filtered = filtered.filter(
              (l) =>
                l.actor.toLowerCase().includes(q) ||
                l.action.toLowerCase().includes(q) ||
                l.target.toLowerCase().includes(q)
            );
          }

          return { data: filtered };
        }
        return { data: [] };
      },
      providesTags: ['Activity'],
    }),

    addAuditLog: builder.mutation<MockActivityLog, Omit<MockActivityLog, 'id' | 'timestamp'>>({
      queryFn: async (log) => {
        if (isMockEnabled) {
          const newEntry: MockActivityLog = {
            id: `act_${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            ...log,
          };
          workingLogs.unshift(newEntry);
          return { data: newEntry };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: ['Activity'],
    }),
  }),
});

export const {
  useGetActivityLogsQuery,
  useAddAuditLogMutation,
} = activityApi;
