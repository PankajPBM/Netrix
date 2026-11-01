import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'light' | 'system';

interface PreferencesState {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  soundAlertsEnabled: boolean;
  refreshIntervalSeconds: number;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('netrix_theme') as ThemeMode | null;
  if (saved && ['dark', 'light', 'system'].includes(saved)) {
    return saved;
  }
  return 'dark'; // Enterprise default
};

const getInitialSidebarState = (): boolean => {
  const saved = localStorage.getItem('netrix_sidebar_collapsed');
  return saved === 'true';
};

const initialState: PreferencesState = {
  theme: getInitialTheme(),
  sidebarCollapsed: getInitialSidebarState(),
  soundAlertsEnabled: true,
  refreshIntervalSeconds: 30,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      localStorage.setItem('netrix_theme', action.payload);
      
      const effectiveTheme = action.payload === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : action.payload;
      document.documentElement.setAttribute('data-netrix-theme', effectiveTheme);
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('netrix_sidebar_collapsed', String(state.sidebarCollapsed));
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('netrix_sidebar_collapsed', String(action.payload));
    },
    setSoundAlerts: (state, action: PayloadAction<boolean>) => {
      state.soundAlertsEnabled = action.payload;
    },
  },
});

export const { setTheme, toggleSidebar, setSidebarCollapsed, setSoundAlerts } = preferencesSlice.actions;
export default preferencesSlice.reducer;
