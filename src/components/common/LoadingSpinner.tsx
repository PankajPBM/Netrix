import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading telemetry...',
  size = 'md',
}) => {
  const spinnerClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border' : '';

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <div className={`spinner-border text-primary ${spinnerClass} mb-2`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <div className="small">{message}</div>}
    </div>
  );
};
