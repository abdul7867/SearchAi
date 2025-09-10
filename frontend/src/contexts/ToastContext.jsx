import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message, duration, isExiting: false };
    
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    // First mark as exiting to trigger exit animation
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, isExiting: true } : toast
    ));
    
    // Remove after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300); // Match the CSS animation duration
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    return addToast({ type, message });
  }, [addToast]);

  const success = useCallback((title, message) => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title, message) => {
    return addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((title, message) => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title, message) => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-900 dark:bg-green-950/50 dark:border-green-800/50 dark:text-green-100';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-900 dark:bg-red-950/50 dark:border-red-800/50 dark:text-red-100';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:bg-yellow-950/50 dark:border-yellow-800/50 dark:text-yellow-100';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800/50 dark:text-blue-100';
      default:
        return 'border-border bg-muted text-foreground dark:bg-muted/80';
    }
  };

  const getToastRole = (type) => {
    switch (type) {
      case 'error':
        return 'alert';
      case 'success':
      case 'warning':
      case 'info':
      default:
        return 'status';
    }
  };

  const getToastAriaLabel = (type, title, message) => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    if (title && message) {
      return `${typeLabel} notification: ${title}. ${message}`;
    } else if (title) {
      return `${typeLabel} notification: ${title}`;
    } else if (message) {
      return `${typeLabel} notification: ${message}`;
    }
    return `${typeLabel} notification`;
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    showToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed top-4 right-4 z-50 space-y-2 max-w-sm"
        aria-live="polite"
        aria-atomic="true"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={getToastRole(toast.type)}
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
            aria-label={getToastAriaLabel(toast.type, toast.title, toast.message)}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out transform ${
              toast.isExiting 
                ? 'animate-out slide-out-to-right-full opacity-0 scale-95' 
                : 'animate-in slide-in-from-right-full opacity-100 scale-100'
            } ${getToastStyles(toast.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getToastIcon(toast.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold">
                  {toast.title}
                </p>
              )}
              {toast.message && (
                <p className={`text-sm ${toast.title ? 'mt-1' : ''}`}>
                  {toast.message}
                </p>
              )}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current"
              aria-label={`Dismiss ${toast.type} notification`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
