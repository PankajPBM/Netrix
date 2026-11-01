import React, { useState } from 'react';
import {
  Search,
  Zap,
  Bell,
  Sun,
  Moon,
  Laptop,
  LogOut,
  User,
  Shield,
  Building,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setTheme, ThemeMode } from '@/app/store/preferencesSlice';
import { toggleNotificationDrawer } from '@/features/notifications/notificationSlice';
import { openQuickConnectModal } from '@/features/remote-sessions/sessionUiSlice';
import { logout } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.preferences.theme);
  const user = useAppSelector((state) => state.auth.user);
  const notifications = useAppSelector((state) => state.notifications.items);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const cycleTheme = (mode: ThemeMode) => {
    dispatch(setTheme(mode));
    setThemeDropdownOpen(false);
  };

  return (
    <header className="netrix-header">
      {/* Omni-Search Box */}
      <div className="header-search">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search devices by ID (942 810 503), hostname, or IP..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const target = e.currentTarget.value.trim();
              if (target) {
                navigate(`/devices?search=${encodeURIComponent(target)}`);
              }
            }
          }}
        />
        <span className="search-shortcut">Ctrl+K</span>
      </div>

      {/* Right Header Action Items */}
      <div className="header-actions">
        {/* Quick Connect Session Dispatch Shortcut */}
        <button
          type="button"
          onClick={() => dispatch(openQuickConnectModal())}
          className="btn btn-primary d-flex align-items-center gap-2"
          style={{ height: '36px', fontSize: '0.8125rem' }}
        >
          <Zap size={15} fill="currentColor" />
          <span className="d-none d-sm-inline">Quick Connect</span>
        </button>

        {/* Organization Switcher Badge */}
        {user?.organizationName && (
          <div
            className="d-none d-md-flex align-items-center gap-1 px-2 py-1 rounded-2 text-muted"
            style={{
              backgroundColor: 'var(--netrix-bg-surface-elevated)',
              border: '1px solid var(--netrix-border)',
              fontSize: '0.75rem',
            }}
          >
            <Building size={13} className="text-primary" />
            <span className="fw-medium text-white">{user.organizationName}</span>
          </div>
        )}

        {/* Theme Mode Toggle Dropdown */}
        <div className="position-relative">
          <button
            type="button"
            onClick={() => {
              setThemeDropdownOpen(!themeDropdownOpen);
              setUserDropdownOpen(false);
            }}
            className="icon-btn"
            title={`Current theme: ${theme}`}
            aria-label="Theme mode"
          >
            {theme === 'dark' ? <Moon size={17} /> : theme === 'light' ? <Sun size={17} /> : <Laptop size={17} />}
          </button>

          {themeDropdownOpen && (
            <div
              className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg"
              style={{ minWidth: '140px', zIndex: 1050 }}
            >
              <button
                type="button"
                className={`dropdown-item ${theme === 'dark' ? 'active fw-bold' : ''}`}
                onClick={() => cycleTheme('dark')}
              >
                <Moon size={15} /> Dark Mode
              </button>
              <button
                type="button"
                className={`dropdown-item ${theme === 'light' ? 'active fw-bold' : ''}`}
                onClick={() => cycleTheme('light')}
              >
                <Sun size={15} /> Light Mode
              </button>
              <button
                type="button"
                className={`dropdown-item ${theme === 'system' ? 'active fw-bold' : ''}`}
                onClick={() => cycleTheme('system')}
              >
                <Laptop size={15} /> System Default
              </button>
            </div>
          )}
        </div>

        {/* Notification Drawer Toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleNotificationDrawer())}
          className="icon-btn"
          title="Notifications"
          aria-label="Open notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && <span className="badge-dot" />}
        </button>

        {/* User Profile Menu */}
        <div className="position-relative">
          <button
            type="button"
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setThemeDropdownOpen(false);
            }}
            className="d-flex align-items-center gap-2 p-1 rounded-2 border-0 bg-transparent cursor-pointer"
            style={{ outline: 'none' }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: '34px',
                height: '34px',
                backgroundColor: 'var(--netrix-brand-500)',
                fontSize: '0.8125rem',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
            </div>
          </button>

          {userDropdownOpen && (
            <div
              className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg"
              style={{ minWidth: '220px', zIndex: 1050 }}
            >
              <div className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-1">
                <div className="fw-semibold text-white text-truncate">{user?.name || 'Administrator'}</div>
                <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                  {user?.email || 'admin@netrix.pbtechzone.com'}
                </div>
                <div className="mt-1">
                  <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.6875rem' }}>
                    <Shield size={11} className="me-1" />
                    {user?.role || 'Operator'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setUserDropdownOpen(false);
                  navigate('/settings');
                }}
              >
                <User size={15} /> Account Settings
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setUserDropdownOpen(false);
                  navigate('/licenses');
                }}
              >
                <Building size={15} /> License & Subscription
              </button>

              <div className="dropdown-divider my-1" />

              <button
                type="button"
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

