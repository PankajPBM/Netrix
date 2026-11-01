import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import { QuickConnectModal } from './components/QuickConnectModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { RemoteViewerModal } from '@/features/remote-sessions/components/RemoteViewerModal';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { closeRemoteViewer } from '@/features/remote-sessions/sessionUiSlice';

export const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isViewerOpen, viewerTargetId, viewerRole } = useAppSelector(
    (state) => state.sessionUi
  );

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

      {/* Real-Time Interactive Remote Desktop Viewer */}
      <RemoteViewerModal
        isOpen={isViewerOpen}
        onClose={() => dispatch(closeRemoteViewer())}
        targetId={viewerTargetId}
        role={viewerRole}
      />
    </div>
  );
};
