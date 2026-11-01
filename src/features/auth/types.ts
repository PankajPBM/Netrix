export type UserRole = 'SuperAdmin' | 'OrgAdmin' | 'TechnicianLead' | 'Technician' | 'Viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  twoFactorPending: {
    pending: boolean;
    tempToken: string | null;
    email: string | null;
  };
}

