import React from 'react';

interface NetrixLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const NetrixLogo: React.FC<NetrixLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 24,
    md: 32,
    lg: 42,
  }[size];

  return (
    <div className={`d-inline-flex align-items-center gap-2 ${className}`}>
      <svg
        width={iconDimensions}
        height={iconDimensions}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="64" height="64" rx="14" fill="#0F172A" />
        <rect x="1" y="1" width="62" height="62" rx="13" stroke="#334155" strokeWidth="1.5" />
        <path
          d="M18 46V18L32 35V18"
          stroke="#3B82F6"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 46V29L46 46V18"
          stroke="#60A5FA"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="18" r="3" fill="#60A5FA" />
        <circle cx="46" cy="46" r="3" fill="#3B82F6" />
        <circle cx="32" cy="32" r="2.5" fill="#38BDF8" />
      </svg>

      {showText && (
        <div className="d-flex flex-column">
          <span
            className="fw-bold tracking-tight text-white lh-1"
            style={{ fontSize: size === 'lg' ? '1.5rem' : size === 'sm' ? '1rem' : '1.25rem' }}
          >
            NETRIX
          </span>
          {showTagline && (
            <span
              className="text-muted text-uppercase fw-semibold"
              style={{ fontSize: '0.625rem', letterSpacing: '0.08em', marginTop: '2px' }}
            >
              Connect Beyond Limits
            </span>
          )}
        </div>
      )}
    </div>
  );
};
