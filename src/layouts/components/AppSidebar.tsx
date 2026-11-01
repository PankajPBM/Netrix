import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Monitor,
  BookOpen,
  Cast,
  LifeBuoy,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleSidebar } from '@/app/store/preferencesSlice';
import { NetrixLogo } from '@/components/common/NetrixLogo';

export const AppSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.preferences.sidebarCollapsed);
  const user = useAppSelector((state) => state.auth.user);

  const isSuperAdmin = user?.role === 'SuperAdmin';

  const navSections = [
    {
      title: 'Remote Control',
      items: [
        { path: '/', label: 'Connect', icon: LayoutDashboard },
        { path: '/assist', label: 'NETRIX Assist', icon: LifeBuoy },
        { path: '/address-book', label: 'Address Book', icon: BookOpen },
        { path: '/sessions', label: 'Session History', icon: Cast },
      ],
    },
    {
      title: 'Management',
      items: [
        { path: '/devices', label: 'Fleet Devices', icon: Monitor },
        { path: '/settings', label: 'Settings', icon: Settings },
        ...(isSuperAdmin
          ? [{ path: '/admin', label: 'Admin Console', icon: ShieldAlert }]
          : []),
      ],
    },
  ];

  return (
    <aside className={`netrix-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <NavLink to="/" className="text-decoration-none">
          <NetrixLogo size={isCollapsed ? 'sm' : 'md'} showText={!isCollapsed} showTagline={!isCollapsed} />
        </NavLink>
      </div>

      {/* Navigation Groups */}
      <div className="sidebar-content">
        {navSections.map((section, idx) => (
          <div key={idx} className="nav-section">
            {!isCollapsed && <div className="section-title">{section.title}</div>}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `nav-item-link ${isActive ? 'active' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="nav-icon" size={18} />
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}

        {/* Cloud Console Link */}
        {!isCollapsed && (
          <div className="mt-4 p-3 rounded-2" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-semibold text-white" style={{ fontSize: '0.8125rem' }}>Cloud Console</span>
              <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.6875rem' }}>PB Tech Zone</span>
            </div>
            <p className="text-muted mb-2" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
              Web dashboard for fleet administration and server telemetry.
            </p>
            <a
              href="https://netrix.prakashkushwaha77.com.np/netrix"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
            >
              <span>Open Web Console</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>

      {/* Sidebar Footer with Collapse Action */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="sidebar-footer-text d-flex flex-column">
            <span className="text-white fw-medium" style={{ fontSize: '0.75rem' }}>PB Tech Zone</span>
            <span className="text-muted" style={{ fontSize: '0.6875rem' }}>NETRIX Platform v1.0</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="btn btn-ghost p-1 text-muted"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

