import React, { useState, useEffect, useRef } from 'react';
import { performanceUtils } from '../utils/performance.js';

/**
 * PageTransition component for smooth page transitions
 * Uses CSS transforms and requestAnimationFrame for optimal performance
 */
const PageTransition = ({
  children,
  className = '',
  transitionType = 'fade',
  duration = 300,
  delay = 0,
  onEnter,
  onExit,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const elementRef = useRef(null);

  // Transition types
  const transitionStyles = {
    fade: {
      enter: 'opacity-100',
      exit: 'opacity-0',
      base: 'transition-opacity duration-300'
    },
    slideUp: {
      enter: 'translate-y-0 opacity-100',
      exit: 'translate-y-4 opacity-0',
      base: 'transition-all duration-300 ease-out'
    },
    slideDown: {
      enter: 'translate-y-0 opacity-100',
      exit: '-translate-y-4 opacity-0',
      base: 'transition-all duration-300 ease-out'
    },
    slideLeft: {
      enter: 'translate-x-0 opacity-100',
      exit: 'translate-x-4 opacity-0',
      base: 'transition-all duration-300 ease-out'
    },
    slideRight: {
      enter: 'translate-x-0 opacity-100',
      exit: '-translate-x-4 opacity-0',
      base: 'transition-all duration-300 ease-out'
    },
    scale: {
      enter: 'scale-100 opacity-100',
      exit: 'scale-95 opacity-0',
      base: 'transition-all duration-300 ease-out'
    },
    rotate: {
      enter: 'rotate-0 opacity-100',
      exit: 'rotate-12 opacity-0',
      base: 'transition-all duration-300 ease-out'
    }
  };

  const currentTransition = transitionStyles[transitionType] || transitionStyles.fade;

  // Handle enter animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (onEnter) {
        performanceUtils.raf(() => onEnter());
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onEnter]);

  // Handle exit animation
  const handleExit = () => {
    setIsExiting(true);
    
    if (onExit) {
      performanceUtils.raf(() => onExit());
    }
  };

  // Expose exit method
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.exit = handleExit;
    }
  }, [onExit]);

  return (
    <div
      ref={elementRef}
      className={`
        ${currentTransition.base}
        ${isVisible ? currentTransition.enter : currentTransition.exit}
        ${isExiting ? currentTransition.exit : ''}
        ${className}
      `}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageTransition;
