import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

// Apply class immediately (before React renders) to prevent flash
const getInitialDark = () => {
  const saved = localStorage.getItem('jpa_theme');
  return saved === 'dark';
};

const applyTheme = (dark) => {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(getInitialDark);

  // Apply on every change
  useEffect(() => {
    applyTheme(dark);
    localStorage.setItem('jpa_theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Apply immediately on mount too (handles SSR / cold start)
  useEffect(() => {
    applyTheme(getInitialDark());
  }, []);

  const toggle = useCallback(() => setDark(v => !v), []);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Return safe defaults if called outside ThemeProvider
  if (!context) return { dark: false, toggle: () => {} };
  return context;
};
