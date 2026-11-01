import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ProtocolLaunchState = 'idle' | 'requesting_ticket' | 'launching_client' | 'client_active' | 'failed';

interface SessionUiState {
  quickConnectModalOpen: boolean;
  targetNetrixId: string;
  launchState: ProtocolLaunchState;
  activeSessionTicket: string | null;
  launchError: string | null;
}

const initialState: SessionUiState = {
  quickConnectModalOpen: false,
  targetNetrixId: '',
  launchState: 'idle',
  activeSessionTicket: null,
  launchError: null,
};

export const sessionUiSlice = createSlice({
  name: 'sessionUi',
  initialState,
  reducers: {
    openQuickConnectModal: (state, action: PayloadAction<string | undefined>) => {
      state.quickConnectModalOpen = true;
      if (action.payload) {
        state.targetNetrixId = action.payload;
      }
      state.launchState = 'idle';
      state.launchError = null;
    },
    closeQuickConnectModal: (state) => {
      state.quickConnectModalOpen = false;
      state.launchState = 'idle';
      state.launchError = null;
    },
    setTargetNetrixId: (state, action: PayloadAction<string>) => {
      state.targetNetrixId = action.payload;
    },
    setLaunchState: (state, action: PayloadAction<ProtocolLaunchState>) => {
      state.launchState = action.payload;
    },
    setSessionTicket: (state, action: PayloadAction<string | null>) => {
      state.activeSessionTicket = action.payload;
    },
    setLaunchError: (state, action: PayloadAction<string | null>) => {
      state.launchError = action.payload;
      state.launchState = 'failed';
    },
  },
});

export const {
  openQuickConnectModal,
  closeQuickConnectModal,
  setTargetNetrixId,
  setLaunchState,
  setSessionTicket,
  setLaunchError,
} = sessionUiSlice.actions;

export default sessionUiSlice.reducer;

