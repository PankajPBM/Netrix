import { baseApi } from './baseApi';
import { MockTechnician } from '../mock/mockData';

export const technicianApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTechnicians: builder.query<MockTechnician[], void>({
      query: () => '/technicians',
      providesTags: ['Technicians'],
    }),

    updateTechnicianStatus: builder.mutation<MockTechnician, { id: string; status: MockTechnician['status'] }>({
      query: ({ id, status }) => ({
        url: `/technicians/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Technicians'],
    }),
  }),
});

export const {
  useGetTechniciansQuery,
  useUpdateTechnicianStatusMutation,
} = technicianApi;
