import React from 'react';

const LoadingSkeleton = ({ type = 'default', className = '' }) => {
  const baseClasses = 'animate-pulse bg-muted rounded';
  
  switch (type) {
    case 'text':
      return (
        <div className={`h-4 ${baseClasses} ${className}`} />
      );
    
    case 'title':
      return (
        <div className={`h-8 w-3/4 ${baseClasses} ${className}`} />
      );
    
    case 'paragraph':
      return (
        <div className="space-y-2">
          <div className={`h-4 w-full ${baseClasses}`} />
          <div className={`h-4 w-5/6 ${baseClasses}`} />
          <div className={`h-4 w-4/6 ${baseClasses}`} />
        </div>
      );
    
    case 'card':
      return (
        <div className={`p-6 border border-border rounded-lg ${className}`}>
          <div className="space-y-4">
            <div className={`h-6 w-1/2 ${baseClasses}`} />
            <div className={`h-4 w-full ${baseClasses}`} />
            <div className={`h-4 w-3/4 ${baseClasses}`} />
            <div className="flex space-x-2">
              <div className={`h-6 w-16 ${baseClasses}`} />
              <div className={`h-6 w-20 ${baseClasses}`} />
            </div>
          </div>
        </div>
      );
    
    case 'search-result':
      return (
        <div className={`p-6 border border-border rounded-lg ${className}`}>
          <div className="space-y-3">
            <div className={`h-5 w-3/4 ${baseClasses}`} />
            <div className={`h-4 w-full ${baseClasses}`} />
            <div className={`h-4 w-5/6 ${baseClasses}`} />
            <div className="flex justify-between">
              <div className={`h-4 w-20 ${baseClasses}`} />
              <div className={`h-4 w-16 ${baseClasses}`} />
            </div>
          </div>
        </div>
      );
    
    case 'ai-answer-card':
      return (
        <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
          <div className="space-y-4">
            {/* Header with title and bookmark button */}
            <div className="flex items-center justify-between">
              <div className={`h-7 w-24 ${baseClasses}`} />
              <div className={`h-10 w-10 rounded-lg ${baseClasses}`} />
            </div>
            
            {/* AI Answer content */}
            <div className="space-y-3">
              <div className={`h-4 w-full ${baseClasses}`} />
              <div className={`h-4 w-5/6 ${baseClasses}`} />
              <div className={`h-4 w-4/6 ${baseClasses}`} />
              <div className={`h-4 w-3/4 ${baseClasses}`} />
            </div>
            
            {/* Metadata section */}
            <div className="pt-4 border-t border-border">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <div className={`h-4 w-4 rounded ${baseClasses}`} />
                  <div className={`h-4 w-16 ${baseClasses}`} />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`h-4 w-4 rounded ${baseClasses}`} />
                  <div className={`h-4 w-20 ${baseClasses}`} />
                </div>
                <div className={`h-4 w-24 ${baseClasses}`} />
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'source-card':
      return (
        <div className={`border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors ${className}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title */}
              <div className={`h-5 w-3/4 ${baseClasses}`} />
              
              {/* Snippet */}
              <div className="space-y-2">
                <div className={`h-4 w-full ${baseClasses}`} />
                <div className={`h-4 w-5/6 ${baseClasses}`} />
              </div>
              
              {/* Domain and date */}
              <div className="flex items-center space-x-2">
                <div className={`h-6 w-16 rounded ${baseClasses}`} />
                <div className={`h-4 w-20 ${baseClasses}`} />
              </div>
            </div>
            
            {/* External link icon */}
            <div className={`ml-4 h-8 w-8 rounded-md ${baseClasses}`} />
          </div>
        </div>
      );
    
    case 'collection':
      return (
        <div className={`p-6 border border-border rounded-lg ${className}`}>
          <div className="space-y-4">
            <div className={`h-6 w-2/3 ${baseClasses}`} />
            <div className={`h-4 w-full ${baseClasses}`} />
            <div className="flex space-x-2">
              <div className={`h-4 w-16 ${baseClasses}`} />
              <div className={`h-4 w-20 ${baseClasses}`} />
            </div>
            <div className="flex space-x-2">
              <div className={`h-6 w-16 ${baseClasses}`} />
              <div className={`h-6 w-16 ${baseClasses}`} />
            </div>
          </div>
        </div>
      );
    
    case 'form':
      return (
        <div className={`space-y-4 ${className}`}>
          <div>
            <div className={`h-4 w-20 mb-2 ${baseClasses}`} />
            <div className={`h-10 w-full ${baseClasses}`} />
          </div>
          <div>
            <div className={`h-4 w-24 mb-2 ${baseClasses}`} />
            <div className={`h-10 w-full ${baseClasses}`} />
          </div>
          <div>
            <div className={`h-4 w-16 mb-2 ${baseClasses}`} />
            <div className={`h-10 w-full ${baseClasses}`} />
          </div>
        </div>
      );
    
    case 'button':
      return (
        <div className={`h-10 w-24 ${baseClasses} ${className}`} />
      );
    
    case 'avatar':
      return (
        <div className={`w-10 h-10 rounded-full ${baseClasses} ${className}`} />
      );
    
    case 'list':
      return (
        <div className={`space-y-3 ${className}`}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full ${baseClasses}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-4 w-3/4 ${baseClasses}`} />
                <div className={`h-3 w-1/2 ${baseClasses}`} />
              </div>
            </div>
          ))}
        </div>
      );
    
    default:
      return (
        <div className={`h-4 w-full ${baseClasses} ${className}`} />
      );
  }
};

export default LoadingSkeleton;
