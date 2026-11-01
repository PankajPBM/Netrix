import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import { QuickConnectModal } from './components/QuickConnectModal';
import { NotificationDrawer } from './components/NotificationDrawer';

export const AppLayout: React.FC = () => {
  return (
    <div className="netrix-app-shell">
      {/* Primary Navigation Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="netrix-main-wrapper">
        <AppHeader />

        <main className="netrix-page-content">
          <Outlet />
        </main>
      </div>

      {/* Global Overlays */}
      <QuickConnectModal />
      <NotificationDrawer />
    </div>
  );
};
