import { baseApi } from './baseApi';
import { MockOrganization } from '../mock/mockData';

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'OrgAdmin' | 'TechnicianLead' | 'Technician' | 'Viewer';
  status: 'active' | 'invited' | 'suspended';
  lastActive: string;
}

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<MockOrganization[], void>({
      query: () => '/organizations',
      providesTags: ['Organizations'],
    }),

    getOrganizationMembers: builder.query<OrgMember[], string | void>({
      query: () => '/organizations/members',
      providesTags: ['Members'],
    }),

    inviteMember: builder.mutation<OrgMember, { email: string; name: string; role: OrgMember['role'] }>({
      query: (body) => ({
        url: '/organizations/members/invite',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Members'],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationMembersQuery,
  useInviteMemberMutation,
} = organizationApi;
