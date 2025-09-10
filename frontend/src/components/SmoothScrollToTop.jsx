import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { performanceUtils } from '../utils/performance.js';

/**
 * SmoothScrollToTop component with smooth scrolling animation
 * Uses requestAnimationFrame for optimal performance
 */
const SmoothScrollToTop = ({
  className = '',
  threshold = 300,
  smooth = true,
  duration = 500,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Check scroll position
  useEffect(() => {
    const handleScroll = performanceUtils.throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > threshold);
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Smooth scroll to top
  const scrollToTop = () => {
    if (smooth) {
      const startPosition = window.pageYOffset || document.documentElement.scrollTop;
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentPosition = startPosition * (1 - easeOut);

        window.scrollTo(0, startPosition - currentPosition);

        if (progress < 1) {
          performanceUtils.raf(animateScroll);
        }
      };

      performanceUtils.raf(animateScroll);
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-50
        w-12 h-12 rounded-full
        bg-primary text-primary-foreground
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
        ${className}
      `}
      aria-label="Scroll to top"
      {...props}
    >
      <ChevronUp className="w-6 h-6 mx-auto" />
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
    </button>
  );
};

export default SmoothScrollToTop;
