import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, twoFactorPending } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (twoFactorPending.pending) {
    return <Navigate to="/auth/2fa" state={{ from: location }} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
