import { createContext, useContext, useState, useEffect } from 'react';

/* 1. Create the context */
const ThemeContext = createContext();

/* 2. Provider component — wraps your whole app */
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Read from localStorage on first load
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch { return false; }
  });

  // Apply theme to <html> element whenever isDark changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/* 3. Custom hook — clean way to consume context */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};