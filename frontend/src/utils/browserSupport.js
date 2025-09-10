/**
 * Browser Support Utilities
 * Provides browser detection, capability checking, and fallback solutions
 */

// Get browser version first (before it's used)
function getBrowserVersion() {
  const ua = navigator.userAgent;
  let version = 'unknown';
  
  if (/Chrome/.test(ua) && !/Edge/.test(ua)) {
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (/Firefox/.test(ua)) {
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (/Edge/.test(ua)) {
    const match = ua.match(/Edge\/(\d+)/);
    version = match ? match[1] : 'unknown';
  }
  
  return parseInt(version) || 0;
}

// Browser detection
export const browserInfo = {
  isChrome: /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent),
  isFirefox: /Firefox/.test(navigator.userAgent),
  isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
  isEdge: /Edge/.test(navigator.userAgent),
  isIE: /MSIE|Trident/.test(navigator.userAgent),
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
  isAndroid: /Android/.test(navigator.userAgent),
  version: getBrowserVersion()
};

// Feature detection
export const features = {
  // CSS features
  supportsCSSGrid: CSS.supports('display', 'grid'),
  supportsCSSFlexbox: CSS.supports('display', 'flex'),
  supportsCSSVariables: CSS.supports('--custom-property', 'value'),
  supportsCSSAnimation: CSS.supports('animation', 'name 1s'),
  
  // JavaScript features
  supportsIntersectionObserver: 'IntersectionObserver' in window,
  supportsResizeObserver: 'ResizeObserver' in window,
  supportsMutationObserver: 'MutationObserver' in window,
  supportsServiceWorker: 'serviceWorker' in navigator,
  supportsPushManager: 'PushManager' in window,
  supportsNotification: 'Notification' in window,
  supportsWebGL: !!window.WebGLRenderingContext,
  supportsWebGL2: !!window.WebGL2RenderingContext,
  
  // API features
  supportsFetch: 'fetch' in window,
  supportsPromise: 'Promise' in window,
  supportsAsyncAwait: (() => {
    try {
      new Function('async () => {}');
      return true;
    } catch {
      return false;
    }
  })(),
  
  // Touch support
  supportsTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  supportsPointer: 'onpointerdown' in window,
  
  // Storage
  supportsLocalStorage: (() => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  })(),
  supportsSessionStorage: (() => {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  })(),
  
  // Performance
  supportsPerformanceObserver: 'PerformanceObserver' in window,
  supportsPerformanceNavigationTiming: 'PerformanceNavigationTiming' in window,
  supportsUserTiming: 'performance' in window && 'mark' in performance
};

// Browser-specific optimizations
export const browserOptimizations = {
  // Chrome optimizations
  chrome: {
    enableHardwareAcceleration: true,
    useWebGL: features.supportsWebGL2,
    enableServiceWorker: features.supportsServiceWorker,
    enablePushNotifications: features.supportsPushManager
  },
  
  // Firefox optimizations
  firefox: {
    enableHardwareAcceleration: true,
    useWebGL: features.supportsWebGL,
    enableServiceWorker: features.supportsServiceWorker,
    enablePushNotifications: features.supportsPushManager
  },
  
  // Safari optimizations
  safari: {
    enableHardwareAcceleration: browserInfo.version >= 10,
    useWebGL: features.supportsWebGL && browserInfo.version >= 8,
    enableServiceWorker: features.supportsServiceWorker && browserInfo.version >= 11,
    enablePushNotifications: false // Safari doesn't support push notifications
  },
  
  // Edge optimizations
  edge: {
    enableHardwareAcceleration: true,
    useWebGL: features.supportsWebGL,
    enableServiceWorker: features.supportsServiceWorker,
    enablePushNotifications: features.supportsPushManager
  }
};

// Get current browser optimizations
export function getCurrentBrowserOptimizations() {
  if (browserInfo.isChrome) return browserOptimizations.chrome;
  if (browserInfo.isFirefox) return browserOptimizations.firefox;
  if (browserInfo.isSafari) return browserOptimizations.safari;
  if (browserInfo.isEdge) return browserOptimizations.edge;
  
  // Default optimizations for unknown browsers
  return {
    enableHardwareAcceleration: false,
    useWebGL: false,
    enableServiceWorker: features.supportsServiceWorker,
    enablePushNotifications: false
  };
}

// Fallback utilities
export const fallbacks = {
  // CSS Grid fallback
  getGridFallback: (supportsGrid) => {
    if (supportsGrid) return 'grid';
    return 'flex'; // Fallback to flexbox
  },
  
  // CSS Variables fallback
  getCSSVariableFallback: (variable, fallback) => {
    if (features.supportsCSSVariables) {
      return `var(${variable}, ${fallback})`;
    }
    return fallback;
  },
  
  // Intersection Observer fallback
  createIntersectionObserverFallback: (callback, options = {}) => {
    if (features.supportsIntersectionObserver) {
      return new IntersectionObserver(callback, options);
    }
    
    // Fallback: trigger callback immediately
    return {
      observe: () => callback([{ isIntersecting: true }]),
      unobserve: () => {},
      disconnect: () => {}
    };
  },
  
  // Service Worker fallback
  registerServiceWorkerFallback: async (swPath) => {
    if (features.supportsServiceWorker) {
      try {
        const registration = await navigator.serviceWorker.register(swPath);
        return registration;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Service Worker registration failed:', error);
        }
        return null;
      }
    }
    return null;
  }
};

// Browser capability score (0-100)
export function getBrowserCapabilityScore() {
  let score = 0;
  const totalFeatures = Object.keys(features).length;
  
  Object.values(features).forEach(supported => {
    if (supported) score++;
  });
  
  return Math.round((score / totalFeatures) * 100);
}

// Performance recommendations based on browser
export function getPerformanceRecommendations() {
  const optimizations = getCurrentBrowserOptimizations();
  const recommendations = [];
  
  if (!optimizations.enableHardwareAcceleration) {
    recommendations.push('Consider using CSS transforms instead of position changes for animations');
  }
  
  if (!optimizations.useWebGL) {
    recommendations.push('Avoid complex 3D animations and effects');
  }
  
  if (!optimizations.enableServiceWorker) {
    recommendations.push('Implement alternative caching strategies for offline support');
  }
  
  if (browserInfo.isMobile) {
    recommendations.push('Optimize for mobile: reduce animations, use touch-friendly interactions');
  }
  
  if (browserInfo.isIOS) {
    recommendations.push('iOS Safari: use -webkit- prefixes for CSS animations');
  }
  
  return recommendations;
}

// Export default
export default {
  browserInfo,
  features,
  browserOptimizations,
  getCurrentBrowserOptimizations,
  fallbacks,
  getBrowserCapabilityScore,
  getPerformanceRecommendations
};
