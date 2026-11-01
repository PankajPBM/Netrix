import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-5 px-3">
      <div
        className="p-3 rounded-circle d-inline-flex mb-3"
        style={{ backgroundColor: 'var(--netrix-bg-surface-elevated)', color: 'var(--netrix-text-muted)' }}
      >
        <Icon size={36} />
      </div>
      <h5 className="fw-semibold text-white mb-1 fs-6">{title}</h5>
      <p className="text-muted small mx-auto mb-3" style={{ maxWidth: '380px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" onClick={onAction} className="btn btn-primary btn-sm px-3">
          {actionText}
        </button>
      )}
    </div>
  );
};
