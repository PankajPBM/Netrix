import { describe, it, expect } from 'vitest';
import devicesUiReducer, {
  setViewMode,
  setStatusFilter,
  toggleSelectDevice,
  selectAllDevices,
  clearSelection,
} from '../features/devices/devicesUiSlice';

describe('Devices UI Redux Slice', () => {
  const initial = {
    viewMode: 'table' as const,
    statusFilter: 'all' as const,
    groupFilter: 'all',
    osFilter: 'all',
    searchQuery: '',
    selectedDeviceIds: [],
    activeDeviceIdForDetail: null,
  };

  it('switches between table and grid views', () => {
    const state = devicesUiReducer(initial, setViewMode('grid'));
    expect(state.viewMode).toBe('grid');
  });

  it('filters by status', () => {
    const state = devicesUiReducer(initial, setStatusFilter('online'));
    expect(state.statusFilter).toBe('online');
  });

  it('handles multi-device selections for bulk operations', () => {
    let state = devicesUiReducer(initial, toggleSelectDevice('dev_001'));
    expect(state.selectedDeviceIds).toEqual(['dev_001']);

    state = devicesUiReducer(state, toggleSelectDevice('dev_002'));
    expect(state.selectedDeviceIds).toEqual(['dev_001', 'dev_002']);

    state = devicesUiReducer(state, toggleSelectDevice('dev_001'));
    expect(state.selectedDeviceIds).toEqual(['dev_002']);

    state = devicesUiReducer(state, selectAllDevices(['dev_001', 'dev_002', 'dev_003']));
    expect(state.selectedDeviceIds).toHaveLength(3);

    state = devicesUiReducer(state, clearSelection());
    expect(state.selectedDeviceIds).toHaveLength(0);
  });
});
