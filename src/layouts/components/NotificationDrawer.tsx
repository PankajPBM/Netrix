import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setNotificationDrawerOpen,
  markAllAsRead,
  clearAllNotifications,
  markAsRead,
} from '@/features/notifications/notificationSlice';
import { useNavigate } from 'react-router-dom';

export const NotificationDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { drawerOpen, items } = useAppSelector((state) => state.notifications);

  if (!drawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="text-warning" />;
      case 'danger':
        return <AlertTriangle size={16} className="text-danger" />;
      case 'success':
        return <CheckCircle size={16} className="text-success" />;
      default:
        return <Info size={16} className="text-primary" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1040 }}
        onClick={() => dispatch(setNotificationDrawerOpen(false))}
      />

      {/* Drawer */}
      <div
        className="position-fixed top-0 end-0 h-100 shadow-lg d-flex flex-column"
        style={{
          width: '380px',
          maxWidth: '90vw',
          backgroundColor: 'var(--netrix-bg-surface)',
          borderLeft: '1px solid var(--netrix-border)',
          zIndex: 1050,
          animation: 'slideInRight 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h6 className="m-0 fw-bold text-white">System Notifications</h6>
            {items.some((n) => !n.isRead) && (
              <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.6875rem' }}>
                {items.filter((n) => !n.isRead).length} New
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn btn-ghost p-1 text-muted"
            onClick={() => dispatch(setNotificationDrawerOpen(false))}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        {items.length > 0 && (
          <div className="px-3 py-2 bg-dark bg-opacity-25 border-bottom border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-ghost btn-sm py-0 px-1 text-muted d-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem' }}
              onClick={() => dispatch(markAllAsRead())}
            >
              <CheckCheck size={14} />
              <span>Mark all as read</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm py-0 px-1 text-muted d-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem' }}
              onClick={() => dispatch(clearAllNotifications())}
            >
              <Trash2 size={13} />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Bell size={32} className="mb-2 opacity-50" />
              <p className="small mb-0">No active alerts or notifications.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2 mb-2 transition-all cursor-pointer ${item.isRead ? 'opacity-75' : ''}`}
                style={{
                  backgroundColor: item.isRead
                    ? 'transparent'
                    : 'var(--netrix-bg-surface-elevated)',
                  border: '1px solid var(--netrix-border)',
                }}
                onClick={() => {
                  dispatch(markAsRead(item.id));
                  if (item.link) {
                    dispatch(setNotificationDrawerOpen(false));
                    navigate(item.link);
                  }
                }}
              >
                <div className="d-flex align-items-start gap-2">
                  <div className="mt-1">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className={`fw-semibold text-truncate ${item.isRead ? 'text-secondary' : 'text-white'}`} style={{ fontSize: '0.8125rem' }}>
                        {item.title}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.6875rem' }}>
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-muted mb-1 text-truncate-2" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                      {item.message}
                    </p>
                    {item.link && (
                      <div className="d-flex align-items-center gap-1 text-primary" style={{ fontSize: '0.6875rem' }}>
                        <span>Inspect detail</span>
                        <ExternalLink size={10} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

