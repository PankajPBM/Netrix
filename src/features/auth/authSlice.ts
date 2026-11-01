import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './types';

export const DEFAULT_MOCK_USER: User = {
  id: 'usr_pbtech_001',
  email: 'admin@pbtechzone.com',
  name: 'Pankaj Kushwaha',
  role: 'SuperAdmin',
  organizationId: 'org_pbtech_hq',
  organizationName: 'PB Tech Zone',
  twoFactorEnabled: true,
  lastLoginAt: new Date().toISOString(),
};

// Application starts in clean signed-out state requiring real login
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
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
