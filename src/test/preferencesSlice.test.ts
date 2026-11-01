import { describe, it, expect } from 'vitest';
import preferencesReducer, {
  setTheme,
  toggleSidebar,
  setSoundAlerts,
} from '../app/store/preferencesSlice';

describe('Preferences Redux Slice', () => {
  const initial = {
    theme: 'dark' as const,
    sidebarCollapsed: false,
    soundAlertsEnabled: true,
    refreshIntervalSeconds: 30,
  };

  it('updates theme mode and stores preference', () => {
    const state = preferencesReducer(initial, setTheme('light'));
    expect(state.theme).toBe('light');
  });

  it('toggles sidebar collapse state', () => {
    const state1 = preferencesReducer(initial, toggleSidebar());
    expect(state1.sidebarCollapsed).toBe(true);

    const state2 = preferencesReducer(state1, toggleSidebar());
    expect(state2.sidebarCollapsed).toBe(false);
  });

  it('updates sound alert preferences', () => {
    const state = preferencesReducer(initial, setSoundAlerts(false));
    expect(state.soundAlertsEnabled).toBe(false);
  });
});

