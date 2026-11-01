import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Monitor,
  BookOpen,
  Cast,
  LifeBuoy,
  Building2,
  Users2,
  FileClock,
  KeyRound,
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
      title: 'Command Center',
      items: [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/devices', label: 'Devices', icon: Monitor },
        { path: '/address-book', label: 'Address Book', icon: BookOpen },
        { path: '/sessions', label: 'Remote Sessions', icon: Cast },
        { path: '/assist', label: 'NETRIX Assist', icon: LifeBuoy },
      ],
    },
    {
      title: 'Enterprise Management',
      items: [
        { path: '/organizations', label: 'Organizations', icon: Building2 },
        { path: '/technicians', label: 'Technicians', icon: Users2 },
        { path: '/activity', label: 'Activity & Audit', icon: FileClock },
        { path: '/licenses', label: 'Licenses', icon: KeyRound },
      ],
    },
    {
      title: 'System & Preferences',
      items: [
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

        {/* Quick Client Download Link */}
        {!isCollapsed && (
          <div className="mt-4 p-3 rounded-2" style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', border: '1px solid var(--netrix-border)' }}>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-semibold text-white" style={{ fontSize: '0.8125rem' }}>NETRIX Remote Host</span>
              <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.6875rem' }}>v3.2</span>
            </div>
            <p className="text-muted mb-2" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
              Native desktop agent for unattended server & workstation deployment.
            </p>
            <a
              href="https://get.netrix.pbtechzone.com/download"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
            >
              <span>Download Agent</span>
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
