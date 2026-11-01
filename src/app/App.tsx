import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAppSelector } from './store';

export const App: React.FC = () => {
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    const effectiveTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-netrix-theme', effectiveTheme);
  }, [theme]);

  return <RouterProvider router={router} />;
};

