import React from 'react';
import { cn } from '../utils/cn';

const LayoutShell = ({ 
  children, 
  className,
  header,
  sidebar,
  footer,
  ...props 
}) => {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)} {...props}>
      {/* Header */}
      {header && (
        <div className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          {header}
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebar && (
          <aside className="hidden lg:block w-64 border-r border-border bg-card/50">
            {sidebar}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="border-t border-border bg-card/50">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default LayoutShell;
