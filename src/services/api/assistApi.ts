import { baseApi } from './baseApi';
import { MOCK_ASSIST_TICKETS, MockAssistTicket } from '../mock/mockData';

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

let workingTickets: MockAssistTicket[] = [...MOCK_ASSIST_TICKETS];

export interface CreateAssistInviteRequest {
  clientName: string;
  clientEmail: string;
  summary: string;
  assignedTechnician?: string;
}

export const assistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssistTickets: builder.query<MockAssistTicket[], void>({
      queryFn: async () => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { data: [...workingTickets] };
        }
        return { data: [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Assist' as const, id })),
              { type: 'Assist', id: 'LIST' },
            ]
          : [{ type: 'Assist', id: 'LIST' }],
    }),

    createAssistInvite: builder.mutation<MockAssistTicket, CreateAssistInviteRequest>({
      queryFn: async (payload) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const pin = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
          const created: MockAssistTicket = {
            id: `ast_${Date.now()}`,
            pinCode: pin,
            clientName: payload.clientName,
            clientEmail: payload.clientEmail,
            summary: payload.summary,
            status: 'waiting',
            createdAt: 'Just now',
            assignedTechnician: payload.assignedTechnician || 'Unassigned',
          };
          workingTickets.unshift(created);
          return { data: created };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: [{ type: 'Assist', id: 'LIST' }],
    }),

    updateAssistStatus: builder.mutation<MockAssistTicket, { id: string; status: MockAssistTicket['status'] }>({
      queryFn: async ({ id, status }) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          const ticket = workingTickets.find((t) => t.id === id);
          if (ticket) {
            ticket.status = status;
            return { data: { ...ticket } };
          }
          return { error: { status: 404, data: 'Ticket not found' } };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: [{ type: 'Assist', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAssistTicketsQuery,
  useCreateAssistInviteMutation,
  useUpdateAssistStatusMutation,
} = assistApi;

