import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/test-utils';
import LayoutShell from './LayoutShell';

describe('LayoutShell Component', () => {
  it('renders with children only', () => {
    render(
      <LayoutShell>
        <div>Test content</div>
      </LayoutShell>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with header', () => {
    const headerContent = <div data-testid="header">Header content</div>;
    render(
      <LayoutShell header={headerContent}>
        <div>Test content</div>
      </LayoutShell>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    const footerContent = <div data-testid="footer">Footer content</div>;
    render(
      <LayoutShell footer={footerContent}>
        <div>Test content</div>
      </LayoutShell>
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with sidebar', () => {
    const sidebarContent = <div data-testid="sidebar">Sidebar content</div>;
    render(
      <LayoutShell sidebar={sidebarContent}>
        <div>Test content</div>
      </LayoutShell>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with all sections', () => {
    const headerContent = <div data-testid="header">Header content</div>;
    const sidebarContent = <div data-testid="sidebar">Sidebar content</div>;
    const footerContent = <div data-testid="footer">Footer content</div>;
    
    render(
      <LayoutShell 
        header={headerContent}
        sidebar={sidebarContent}
        footer={footerContent}
      >
        <div>Test content</div>
      </LayoutShell>
    );
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <LayoutShell className="custom-layout">
        <div>Test content</div>
      </LayoutShell>
    );
    
    const layoutElement = screen.getByText('Test content').closest('.custom-layout');
    expect(layoutElement).toBeInTheDocument();
  });

  it('forwards additional props', () => {
    render(
      <LayoutShell data-testid="layout-shell">
        <div>Test content</div>
      </LayoutShell>
    );
    
    expect(screen.getByTestId('layout-shell')).toBeInTheDocument();
  });

  it('renders without header when not provided', () => {
    render(
      <LayoutShell>
        <div>Test content</div>
      </LayoutShell>
    );
    
    // Should not have header-related classes
    const layoutElement = screen.getByText('Test content').closest('.min-h-screen');
    expect(layoutElement).toBeInTheDocument();
  });

  it('renders without sidebar when not provided', () => {
    render(
      <LayoutShell>
        <div>Test content</div>
      </LayoutShell>
    );
    
    // Main content should take full width
    const mainElement = screen.getByText('Test content').closest('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders without footer when not provided', () => {
    render(
      <LayoutShell>
        <div>Test content</div>
      </LayoutShell>
    );
    
    // Should not have footer-related classes
    const layoutElement = screen.getByText('Test content').closest('.min-h-screen');
    expect(layoutElement).toBeInTheDocument();
  });
});
