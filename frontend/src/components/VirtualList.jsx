import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { performanceUtils } from '../utils/performance.js';

/**
 * VirtualList component for performance optimization
 * Only renders visible items to improve performance with large datasets
 */
const VirtualList = ({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5, // Number of items to render outside viewport
  renderItem,
  className = '',
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);
  const [scrollElement, setScrollElement] = useState(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!containerHeight || !itemHeight) return { start: 0, end: 0 };

    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + overscan, items.length);

    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      ...item,
      virtualIndex: visibleRange.start + index
    }));
  }, [items, visibleRange]);

  // Calculate total height for scrollbar
  const totalHeight = items.length * itemHeight;

  // Handle scroll events with throttling for performance
  const handleScroll = useCallback(
    performanceUtils.throttle((event) => {
      setScrollTop(event.target.scrollTop);
    }, 16), // ~60fps
    []
  );

  // Set up scroll listener
  useEffect(() => {
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [scrollElement, handleScroll]);

  // Auto-scroll to top when items change
  useEffect(() => {
    if (scrollElement) {
      scrollElement.scrollTop = 0;
      setScrollTop(0);
    }
  }, [items.length, scrollElement]);

  // Render item with proper positioning
  const renderItemWithPosition = useCallback((item, index) => {
    const top = (visibleRange.start + index) * itemHeight;
    
    return (
      <div
        key={item.virtualIndex || index}
        style={{
          position: 'absolute',
          top: `${top}px`,
          height: `${itemHeight}px`,
          width: '100%'
        }}
      >
        {renderItem(item, visibleRange.start + index)}
      </div>
    );
  }, [visibleRange.start, itemHeight, renderItem]);

  return (
    <div
      ref={setContainerRef}
      className={`relative ${className}`}
      style={{ height: containerHeight }}
      {...props}
    >
      {/* Scrollable container */}
      <div
        ref={setScrollElement}
        className="h-full overflow-auto"
        style={{ height: containerHeight }}
      >
        {/* Virtual content with total height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map((item, index) => renderItemWithPosition(item, index))}
        </div>
      </div>
      
      {/* Performance indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          {visibleItems.length}/{items.length} items
        </div>
      )}
    </div>
  );
};

export default VirtualList;
