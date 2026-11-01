import { baseApi } from './baseApi';
import { AssistTicket } from '@/types/models';

export interface CreateAssistInviteRequest {
  clientName: string;
  clientEmail: string;
  summary: string;
  assignedTechnician?: string;
}

export const assistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssistTickets: builder.query<AssistTicket[], void>({
      query: () => '/assist/tickets',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Assist' as const, id })),
              { type: 'Assist', id: 'LIST' },
            ]
          : [{ type: 'Assist', id: 'LIST' }],
    }),

    createAssistInvite: builder.mutation<AssistTicket, CreateAssistInviteRequest>({
      query: (body) => ({
        url: '/assist/invitations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Assist', id: 'LIST' }],
    }),

    updateAssistStatus: builder.mutation<AssistTicket, { id: string; status: AssistTicket['status'] }>({
      query: ({ id, status }) => ({
        url: `/assist/tickets/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'Assist', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAssistTicketsQuery,
  useCreateAssistInviteMutation,
  useUpdateAssistStatusMutation,
} = assistApi;
