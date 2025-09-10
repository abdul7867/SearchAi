import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Get theme from localStorage or system preference
const getInitialTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

// Apply theme to document without causing layout shift
const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Remove both classes to ensure clean state
  root.classList.remove('light', 'dark');
  
  // Add the current theme class
  root.classList.add(theme);
  
  // Set data attribute for additional CSS targeting if needed
  root.setAttribute('data-theme', theme);
  
  // Store in localStorage
  localStorage.setItem('theme', theme);
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get initial theme
    const initialTheme = getInitialTheme();
    
    // Apply theme immediately to prevent flash
    applyTheme(initialTheme);
    
    return initialTheme;
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const setThemeDirectly = (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      if (import.meta.env.DEV) {
        console.warn('Invalid theme:', newTheme);
      }
      return;
    }
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeDirectly,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
