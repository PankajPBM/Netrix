import { baseApi } from './baseApi';
import { MOCK_TECHNICIANS, MockTechnician } from '../mock/mockData';

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

let workingTechnicians: MockTechnician[] = [...MOCK_TECHNICIANS];

export const technicianApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTechnicians: builder.query<MockTechnician[], void>({
      queryFn: async () => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { data: [...workingTechnicians] };
        }
        return { data: [] };
      },
      providesTags: ['Technicians'],
    }),

    updateTechnicianStatus: builder.mutation<MockTechnician, { id: string; status: MockTechnician['status'] }>({
      queryFn: async ({ id, status }) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          const tech = workingTechnicians.find((t) => t.id === id);
          if (tech) {
            tech.status = status;
            return { data: { ...tech } };
          }
          return { error: { status: 404, data: 'Technician not found' } };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: ['Technicians'],
    }),
  }),
});

export const {
  useGetTechniciansQuery,
  useUpdateTechnicianStatusMutation,
} = technicianApi;

