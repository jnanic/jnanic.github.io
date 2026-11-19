'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function getServerTheme() {
  return null;
}

function toggleTheme() {
  const theme = getTheme() === 'light' ? 'dark' : 'light';
  const { classList } = document.documentElement;
  classList.toggle('light', theme === 'light');
  classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // The toggle still works for this page when storage is unavailable.
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
