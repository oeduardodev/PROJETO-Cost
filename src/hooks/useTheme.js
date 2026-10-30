import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'costs-theme';
const ThemeContext = createContext(null);

function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredMode() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'light';
  } catch (error) {
    return 'light';
  }
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(getStoredMode);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = mode === 'system' ? systemTheme : mode;

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemTheme(event.matches ? 'dark' : 'light');

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0D0F12' : '#F8F9FB');
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      // A preferência continua válida durante a sessão mesmo sem localStorage.
    }
  }, [mode, resolvedTheme]);

  const setMode = useCallback((nextMode) => {
    if (nextMode === 'light' || nextMode === 'dark' || nextMode === 'system') {
      setModeState(nextMode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((current) => {
      const currentResolved = current === 'system' ? systemTheme : current;
      return currentResolved === 'dark' ? 'light' : 'dark';
    });
  }, [systemTheme]);

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      toggleTheme,
    }),
    [mode, resolvedTheme, setMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  }

  return context;
}
