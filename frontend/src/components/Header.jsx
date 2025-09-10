import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Search, History, FolderOpen, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import authStore from '../stores/authStore';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { cn } from '../utils/cn';

const Header = ({ 
  onMobileMenuToggle,
  className,
  ...props 
}) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  // Get state from stores
  const { user, isAuthenticated, logout } = authStore((state) => state); // ✅ FIXED: Use proper Zustand selector pattern
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigation = [
    { name: 'Search', href: '/', icon: Search },
    { name: 'History', href: '/history', icon: History },
    { name: 'Collections', href: '/collections', icon: FolderOpen },
  ];

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMobileMenuToggle) {
      onMobileMenuToggle(!isMobileMenuOpen);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={cn(
          "w-full transition-all duration-300",
          isScrolled && "shadow-lg backdrop-blur-md bg-card/95",
          className
        )} 
        {...props}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
              aria-label="AI Search Home"
            >
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">AI Search</span>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle */}
              <ThemeToggle
                variant="icon"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              />

              {/* Mobile menu button */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden transition-all duration-200 hover:scale-105"
                  onClick={handleMobileMenuToggle}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Desktop Auth buttons */}
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground max-w-32 truncate">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="transition-all duration-200 hover:scale-105">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer - Left Side */}
      {isAuthenticated && (
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleMobileMenuToggle}
            aria-hidden="true"
          />

          {/* Drawer - Left Side */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-card border-r border-border shadow-2xl transform transition-transform duration-300 ease-in-out",
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMobileMenuToggle}
                  aria-label="Close menu"
                  className="hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email && user?.name ? user.email : 'User'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Mobile navigation">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                        "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:text-foreground"
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {isActive && (
                        <ChevronDown className="h-4 w-4 ml-auto transform rotate-180" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions */}
              <div className="p-4 border-t border-border space-y-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleLogout}
                  className="w-full justify-start text-foreground hover:bg-accent"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
