import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, twoFactorPending } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Desktop Client Mode: Installed desktop executable does not require web console login
  const isDesktopMode =
    typeof window !== 'undefined' &&
    (Boolean(window.netrixDesktop) ||
      window.location.protocol === 'file:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  if (isDesktopMode) {
    return <>{children}</>;
  }

  if (twoFactorPending.pending) {
    return <Navigate to="/auth/2fa" state={{ from: location }} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

