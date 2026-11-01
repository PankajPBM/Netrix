import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'secondary';
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary',
  trend,
}) => {
  const iconBg = {
    primary: 'rgba(37, 99, 235, 0.15)',
    success: 'rgba(16, 185, 129, 0.15)',
    warning: 'rgba(245, 158, 11, 0.15)',
    info: 'rgba(6, 182, 212, 0.15)',
    secondary: 'rgba(100, 116, 139, 0.15)',
  }[variant];

  const iconColor = {
    primary: 'var(--netrix-brand-400)',
    success: 'var(--netrix-status-online)',
    warning: 'var(--netrix-status-busy)',
    info: 'var(--netrix-status-info)',
    secondary: 'var(--netrix-status-offline)',
  }[variant];

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body p-3 p-xl-4 d-flex align-items-center justify-content-between">
        <div>
          <div className="text-muted fw-semibold text-uppercase tracking-wider mb-1" style={{ fontSize: '0.6875rem' }}>
            {title}
          </div>
          <div className="fs-3 fw-bold text-white lh-1 mb-1">{value}</div>
          <div className="d-flex align-items-center gap-2">
            {trend && (
              <span
                className={`fw-semibold ${trend.isPositive ? 'text-success' : 'text-danger'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
            {subtitle && (
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div
          className="p-3 rounded-3 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};
