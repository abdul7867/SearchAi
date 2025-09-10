import React, { useState, useRef, useEffect } from 'react';
import { performanceUtils } from '../utils/performance.js';

/**
 * AnimatedButton component with smooth micro-interactions
 * Uses CSS transforms and requestAnimationFrame for optimal performance
 */
const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  ripple = true,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);

  // Variant styles
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80',
    outline: 'border border-border bg-background text-foreground hover:bg-accent active:bg-accent/80',
    ghost: 'bg-transparent text-foreground hover:bg-accent active:bg-accent/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  // Handle button press with animation
  const handleMouseDown = () => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    
    // Use requestAnimationFrame for smooth animation
    performanceUtils.raf(() => {
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'scale(0.95)';
      }
    });
  };

  const handleMouseUp = () => {
    if (disabled || loading) return;
    
    setIsPressed(false);
    
    performanceUtils.raf(() => {
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'scale(1)';
      }
    });
  };

  // Handle ripple effect
  const handleClick = (event) => {
    if (disabled || loading) return;

    if (ripple && rippleRef.current) {
      const rect = rippleRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = {
        id: Date.now(),
        x,
        y,
        size
      };

      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) {
      onClick(event);
    }
  };

  // Cleanup ripples on unmount
  useEffect(() => {
    return () => {
      setRipples([]);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
        ${isPressed ? 'shadow-inner' : ''}
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
        if (buttonRef.current) {
          buttonRef.current.style.transform = 'scale(1)';
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onClick={handleClick}
      disabled={disabled || loading}
      style={{
        transform: 'scale(1)',
        transition: 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
      }}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
        </div>
      )}

      {/* Content with loading state */}
      <div className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>

      {/* Ripple effect container */}
      <div ref={rippleRef} className="absolute inset-0 pointer-events-none">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              transform: 'scale(0)',
              animation: 'ripple 0.6s ease-out'
            }}
          />
        ))}
      </div>

      {/* Hover effect overlay */}
      <div
        className={`absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : ''
        }`}
      />
    </button>
  );
};

export default AnimatedButton;
