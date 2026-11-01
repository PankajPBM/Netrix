import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAppSelector } from './store';

export const App: React.FC = () => {
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    const effectiveTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;

    document.documentElement.setAttribute('data-netrix-theme', effectiveTheme);
  }, [theme]);

  return <RouterProvider router={router} />;
};

