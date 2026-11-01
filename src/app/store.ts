import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '@/features/auth/authSlice';
import preferencesReducer from './store/preferencesSlice';
import notificationsReducer from '@/features/notifications/notificationSlice';
import devicesUiReducer from '@/features/devices/devicesUiSlice';
import sessionUiReducer from '@/features/remote-sessions/sessionUiSlice';
import { baseApi } from '@/services/api/baseApi';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    notifications: notificationsReducer,
    devicesUi: devicesUiReducer,
    sessionUi: sessionUiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
