/**
 * Performance monitoring utilities for Core Web Vitals and performance metrics
 */

// Core Web Vitals thresholds
const CORE_WEB_VITALS = {
  LCP: 2500, // 2.5 seconds
  FID: 100,  // 100 milliseconds
  CLS: 0.1   // 0.1
};

/**
 * Monitor Largest Contentful Paint (LCP)
 */
export function monitorLCP() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        const lcp = lastEntry.startTime;
        if (import.meta.env.DEV) {
        console.log(`LCP: ${lcp}ms`);
      }
        
        // Report to analytics or performance monitoring service
        if (lcp > CORE_WEB_VITALS.LCP && import.meta.env.DEV) {
          console.warn(`LCP exceeds threshold: ${lcp}ms > ${CORE_WEB_VITALS.LCP}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
}

/**
 * Monitor First Input Delay (FID)
 */
export function monitorFID() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime;
        if (import.meta.env.DEV) {
        console.log(`FID: ${fid}ms`);
      }
        
        if (fid > CORE_WEB_VITALS.FID && import.meta.env.DEV) {
          console.warn(`FID exceeds threshold: ${fid}ms > ${CORE_WEB_VITALS.FID}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  }
}

/**
 * Monitor Cumulative Layout Shift (CLS)
 */
export function monitorCLS() {
  if ('PerformanceObserver' in window) {
    let clsValue = 0;
    let clsEntries = [];
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
      
      if (import.meta.env.DEV) {
        console.log(`CLS: ${clsValue}`);
      }
      
      if (clsValue > CORE_WEB_VITALS.CLS && import.meta.env.DEV) {
        console.warn(`CLS exceeds threshold: ${clsValue} > ${CORE_WEB_VITALS.CLS}`);
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Monitor Time to First Byte (TTFB)
 */
export function monitorTTFB() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        const ttfb = entry.responseStart - entry.requestStart;
        if (import.meta.env.DEV) {
        console.log(`TTFB: ${ttfb}ms`);
      }
      });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
  }
}

/**
 * Monitor resource loading performance
 */
export function monitorResourceTiming() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.initiatorType === 'img' || entry.initiatorType === 'script') {
          const duration = entry.duration;
          const size = entry.transferSize;
          
          if (import.meta.env.DEV) {
          console.log(`${entry.initiatorType} loaded in ${duration}ms, size: ${size} bytes`);
        }
          
          // Warn about slow resources
          if (duration > 1000 && import.meta.env.DEV) {
            console.warn(`Slow resource: ${entry.name} took ${duration}ms to load`);
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
}

/**
 * Initialize all performance monitoring
 */
export function initPerformanceMonitoring() {
  // Wait for page load to start monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      monitorLCP();
      monitorFID();
      monitorCLS();
      monitorTTFB();
      monitorResourceTiming();
    });
  } else {
    monitorLCP();
    monitorFID();
    monitorCLS();
    monitorTTFB();
    monitorResourceTiming();
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics() {
  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  return {
    ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    lcp: 0, // Will be updated by observer
    fid: 0, // Will be updated by observer
    cls: 0, // Will be updated by observer
    domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
    loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
  };
}

/**
 * Performance optimization utilities
 */
export const performanceUtils = {
  // Debounce function calls for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function calls for performance
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Use requestAnimationFrame for smooth animations
  raf: (callback) => {
    return requestAnimationFrame(callback);
  },
  
  // Check if element is in viewport for lazy loading
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};
