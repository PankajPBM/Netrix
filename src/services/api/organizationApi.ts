import { baseApi } from './baseApi';
import { MOCK_ORGANIZATIONS, MockOrganization } from '../mock/mockData';

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

let workingOrgs: MockOrganization[] = [...MOCK_ORGANIZATIONS];

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'OrgAdmin' | 'TechnicianLead' | 'Technician' | 'Viewer';
  status: 'active' | 'invited' | 'suspended';
  lastActive: string;
}

const mockMembers: OrgMember[] = [
  {
    id: 'mem_01',
    name: 'Pankaj Kushwaha',
    email: 'admin@pbtechzone.com',
    role: 'SuperAdmin',
    status: 'active',
    lastActive: 'Active Now',
  },
];

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<MockOrganization[], void>({
      queryFn: async () => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { data: [...workingOrgs] };
        }
        return { data: [] };
      },
      providesTags: ['Organizations'],
    }),

    getOrganizationMembers: builder.query<OrgMember[], string | void>({
      queryFn: async () => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { data: [...mockMembers] };
        }
        return { data: [] };
      },
      providesTags: ['Members'],
    }),

    inviteMember: builder.mutation<OrgMember, { email: string; name: string; role: OrgMember['role'] }>({
      queryFn: async (payload) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const newMember: OrgMember = {
            id: `mem_${Date.now()}`,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            status: 'invited',
            lastActive: 'Invite sent just now',
          };
          mockMembers.push(newMember);
          return { data: newMember };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: ['Members'],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationMembersQuery,
  useInviteMemberMutation,
} = organizationApi;

