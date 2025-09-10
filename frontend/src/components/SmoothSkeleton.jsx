import React, { useState, useEffect } from 'react';
import { performanceUtils } from '../utils/performance.js';

/**
 * SmoothSkeleton component with smooth loading animations
 * Uses CSS transforms and staggered animations for optimal performance
 */
const SmoothSkeleton = ({
  className = '',
  variant = 'text',
  lines = 1,
  animated = true,
  duration = 1500,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Variant styles
  const variantStyles = {
    text: 'h-4 bg-muted rounded',
    title: 'h-6 bg-muted rounded',
    avatar: 'w-12 h-12 bg-muted rounded-full',
    image: 'w-full h-32 bg-muted rounded-lg',
    card: 'w-full h-48 bg-muted rounded-lg',
    button: 'h-10 w-24 bg-muted rounded-lg'
  };

  // Show skeleton with staggered delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Generate skeleton lines
  const renderSkeletonLines = () => {
    if (variant === 'text' || variant === 'title') {
      return Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`
            ${variantStyles[variant]}
            ${animated ? 'animate-pulse' : ''}
            ${index === lines - 1 ? 'w-3/4' : 'w-full'}
            ${index > 0 ? 'mt-3' : ''}
          `}
          style={{
            animationDelay: animated ? `${index * 200}ms` : '0ms',
            animationDuration: `${duration}ms`
          }}
        />
      ));
    }

    return (
      <div
        className={`
          ${variantStyles[variant]}
          ${animated ? 'animate-pulse' : ''}
        `}
        style={{
          animationDuration: `${duration}ms`
        }}
      />
    );
  };

  return (
    <div
      className={`
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-300 ease-out
        ${className}
      `}
      {...props}
    >
      {renderSkeletonLines()}
    </div>
  );
};

/**
 * SmoothSkeletonGroup for multiple skeleton items
 */
export const SmoothSkeletonGroup = ({
  items = 3,
  variant = 'card',
  className = '',
  grid = false,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-500 ease-out
        ${grid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}
        ${className}
      `}
      {...props}
    >
      {Array.from({ length: items }, (_, index) => (
        <div
          key={index}
          className={`
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            transition-all duration-300 ease-out
          `}
          style={{
            transitionDelay: `${index * 100}ms`
          }}
        >
          <SmoothSkeleton variant={variant} />
        </div>
      ))}
    </div>
  );
};

export default SmoothSkeleton;
