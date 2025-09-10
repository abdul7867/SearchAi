import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';
import { cn } from '../utils/cn';

const ThemeToggle = ({ 
  variant = 'icon',
  size = 'icon',
  className,
  showSystemOption = false,
  ...props 
}) => {
  const { theme, toggleTheme, setTheme } = useTheme();

  const handleThemeChange = (newTheme) => {
    if (newTheme === 'system') {
      // Remove manual preference to allow system preference
      localStorage.removeItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(newTheme);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return showSystemOption ? 'system' : 'light';
      default:
        return 'light';
    }
  };

  const getAriaLabel = () => {
    const nextTheme = getNextTheme();
    return `Switch to ${nextTheme} theme (current: ${theme})`;
  };

  if (variant === 'dropdown' && showSystemOption) {
    return (
      <div className="relative group">
        <Button
          variant="ghost"
          size={size}
          className={cn(
            "relative transition-all duration-200 hover:scale-105",
            className
          )}
          aria-label={getAriaLabel()}
          data-theme-toggle
          {...props}
        >
          {getThemeIcon()}
        </Button>
        
        {/* Dropdown menu */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-2">
            <button
              onClick={() => handleThemeChange('light')}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center space-x-3",
                theme === 'light' && "bg-accent text-accent-foreground"
              )}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center space-x-3",
                theme === 'dark' && "bg-accent text-accent-foreground"
              )}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center space-x-3",
                !localStorage.getItem('theme') && "bg-accent text-accent-foreground"
              )}
            >
              <Monitor className="h-4 w-4" />
              <span>System</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn(
        "transition-all duration-200 hover:scale-105",
        className
      )}
      aria-label={getAriaLabel()}
      data-theme-toggle
      {...props}
    >
      {getThemeIcon()}
    </Button>
  );
};

export default ThemeToggle;
