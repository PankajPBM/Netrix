import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DeviceViewMode = 'table' | 'grid';
export type DeviceStatusFilter = 'all' | 'online' | 'offline' | 'busy';

interface DevicesUiState {
  viewMode: DeviceViewMode;
  statusFilter: DeviceStatusFilter;
  groupFilter: string;
  osFilter: string;
  searchQuery: string;
  selectedDeviceIds: string[];
  activeDeviceIdForDetail: string | null;
}

const initialState: DevicesUiState = {
  viewMode: 'table',
  statusFilter: 'all',
  groupFilter: 'all',
  osFilter: 'all',
  searchQuery: '',
  selectedDeviceIds: [],
  activeDeviceIdForDetail: null,
};

export const devicesUiSlice = createSlice({
  name: 'devicesUi',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<DeviceViewMode>) => {
      state.viewMode = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<DeviceStatusFilter>) => {
      state.statusFilter = action.payload;
    },
    setGroupFilter: (state, action: PayloadAction<string>) => {
      state.groupFilter = action.payload;
    },
    setOsFilter: (state, action: PayloadAction<string>) => {
      state.osFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSelectDevice: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedDeviceIds.includes(id)) {
        state.selectedDeviceIds = state.selectedDeviceIds.filter((item) => item !== id);
      } else {
        state.selectedDeviceIds.push(id);
      }
    },
    selectAllDevices: (state, action: PayloadAction<string[]>) => {
      state.selectedDeviceIds = action.payload;
    },
    clearSelection: (state) => {
      state.selectedDeviceIds = [];
    },
    setActiveDeviceIdForDetail: (state, action: PayloadAction<string | null>) => {
      state.activeDeviceIdForDetail = action.payload;
    },
  },
});

export const {
  setViewMode,
  setStatusFilter,
  setGroupFilter,
  setOsFilter,
  setSearchQuery,
  toggleSelectDevice,
  selectAllDevices,
  clearSelection,
  setActiveDeviceIdForDetail,
} = devicesUiSlice.actions;

export default devicesUiSlice.reducer;
