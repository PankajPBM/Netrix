import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './types';

// Default mock user for enterprise development mode
export const DEFAULT_MOCK_USER: User = {
  id: 'usr_pbtech_001',
  email: 'admin@pbtechzone.com',
  name: 'Pankaj Sharma',
  role: 'SuperAdmin',
  organizationId: 'org_pbtech_hq',
  organizationName: 'PB Tech Zone Enterprise',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  twoFactorEnabled: true,
  lastLoginAt: '2026-11-01T08:30:00Z',
};

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

const initialState: AuthState = {
  user: isMockEnabled ? DEFAULT_MOCK_USER : null,
  accessToken: isMockEnabled ? 'mock_jwt_access_token_netrix_prod' : null,
  isAuthenticated: isMockEnabled,
  isLoading: false,
  error: null,
  twoFactorPending: {
    pending: false,
    tempToken: null,
    email: null,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.twoFactorPending = { pending: false, tempToken: null, email: null };
      state.error = null;
    },
    setTwoFactorRequired: (
      state,
      action: PayloadAction<{ tempToken: string; email: string }>
    ) => {
      state.twoFactorPending = {
        pending: true,
        tempToken: action.payload.tempToken,
        email: action.payload.email,
      };
      state.isAuthenticated = false;
    },
    clearTwoFactorPending: (state) => {
      state.twoFactorPending = { pending: false, tempToken: null, email: null };
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.twoFactorPending = { pending: false, tempToken: null, email: null };
      state.error = null;
      // Do not wipe global preferences (like theme) on logout
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setCredentials,
  setTwoFactorRequired,
  clearTwoFactorPending,
  logout,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;
