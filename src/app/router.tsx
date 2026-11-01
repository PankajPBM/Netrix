import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/RoleGuard';

// Application Feature Pages
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { DevicesPage } from '@/features/devices/pages/DevicesPage';
import { AddressBookPage } from '@/features/address-book/pages/AddressBookPage';
import { RemoteSessionsPage } from '@/features/remote-sessions/pages/RemoteSessionsPage';
import { QuickSupportPage } from '@/features/quick-support/pages/QuickSupportPage';
import { OrganizationsPage } from '@/features/organizations/pages/OrganizationsPage';
import { TechniciansPage } from '@/features/technicians/pages/TechniciansPage';
import { ActivityPage } from '@/features/activity/pages/ActivityPage';
import { LicensesPage } from '@/features/licenses/pages/LicensesPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { AdminPage } from '@/features/admin/pages/AdminPage';

// Authentication Pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { TwoFactorPage } from '@/features/auth/pages/TwoFactorPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { SessionExpiredPage } from '@/features/auth/pages/SessionExpiredPage';
import { AccessDeniedPage } from '@/features/auth/pages/AccessDeniedPage';
import { NotFoundPage } from '@/components/feedback/NotFoundPage';

export const router = createBrowserRouter([
  // Protected Console Shell
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'devices', element: <DevicesPage /> },
      { path: 'address-book', element: <AddressBookPage /> },
      { path: 'sessions', element: <RemoteSessionsPage /> },
      { path: 'assist', element: <QuickSupportPage /> },
      { path: 'organizations', element: <OrganizationsPage /> },
      { path: 'technicians', element: <TechniciansPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'licenses', element: <LicensesPage /> },
      { path: 'settings', element: <SettingsPage /> },
      {
        path: 'admin',
        element: (
          <RoleGuard allowedRoles={['SuperAdmin']}>
            <AdminPage />
          </RoleGuard>
        ),
      },
    ],
  },

  // Authentication Flows
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '2fa', element: <TwoFactorPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'session-expired', element: <SessionExpiredPage /> },
    ],
  },

  // Error Pages
  { path: '/403', element: <AccessDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
