import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

interface NotificationsState {
  items: NotificationItem[];
  drawerOpen: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'New Device Registered',
    message: 'WIN-SRV-FINANCE-02 joined the Enterprise Fleet via deployment token.',
    type: 'success',
    timestamp: '10 minutes ago',
    isRead: false,
    link: '/devices',
  },
  {
    id: 'notif_2',
    title: 'High CPU Alert',
    message: 'Device NYC-FIN-SRV01 CPU usage sustained above 92% for 5 minutes.',
    type: 'warning',
    timestamp: '32 minutes ago',
    isRead: false,
    link: '/devices',
  },
  {
    id: 'notif_3',
    title: 'Remote Session Ended',
    message: 'Technician Alex Patel concluded support session with Client #849102.',
    type: 'info',
    timestamp: '1 hour ago',
    isRead: true,
    link: '/sessions',
  },
  {
    id: 'notif_4',
    title: 'License Renewal Approaching',
    message: 'NETRIX Business tier (50 Concurrent Channels) renews in 28 days.',
    type: 'info',
    timestamp: '4 hours ago',
    isRead: true,
    link: '/licenses',
  },
];

const initialState: NotificationsState = {
  items: initialNotifications,
  drawerOpen: false,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    toggleNotificationDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    setNotificationDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.isRead = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => (n.isRead = true));
    },
    clearAllNotifications: (state) => {
      state.items = [];
    },
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>>) => {
      state.items.unshift({
        id: `notif_${Date.now()}`,
        timestamp: 'Just now',
        isRead: false,
        ...action.payload,
      });
    },
  },
});

export const {
  toggleNotificationDrawer,
  setNotificationDrawerOpen,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;

