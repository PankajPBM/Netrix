import { baseApi } from './baseApi';
import { Technician } from '@/types/models';

export const technicianApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTechnicians: builder.query<Technician[], void>({
      query: () => '/technicians',
      providesTags: ['Technicians'],
    }),

    updateTechnicianStatus: builder.mutation<Technician, { id: string; status: Technician['status'] }>({
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
