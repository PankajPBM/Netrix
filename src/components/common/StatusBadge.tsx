import React from 'react';

export type StatusType = 'online' | 'offline' | 'busy' | 'danger' | 'info';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  pulse = false,
  className = '',
}) => {
  const normStatus = status.toLowerCase() as StatusType;

  const badgeClass = {
    online: 'badge-online',
    offline: 'badge-offline',
    busy: 'badge-busy',
    danger: 'badge-danger',
    info: 'badge-info',
  }[normStatus] || 'badge-offline';

  const dotClass = {
    online: 'bg-success',
    offline: 'bg-secondary',
    busy: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
  }[normStatus] || 'bg-secondary';

  const displayLabel = label || normStatus.charAt(0).toUpperCase() + normStatus.slice(1);

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      <span
        className={`rounded-circle d-inline-block ${dotClass} ${pulse && normStatus === 'online' ? 'animate-pulse' : ''}`}
        style={{ width: '6px', height: '6px' }}
      />
      <span>{displayLabel}</span>
    </span>
  );
};

