import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastProvider } from '../contexts/ToastContext';

// Mock auth store for stories
const mockAuthStore = {
  user: { name: 'John Doe', email: 'john@example.com' },
  isAuthenticated: true,
  logout: () => console.log('Logout clicked'),
};

// Mock the auth store
vi.mock('../stores/authStore', () => ({
  default: () => mockAuthStore,
}));

// Wrapper component for stories
const HeaderWrapper = ({ children, ...props }) => (
  <BrowserRouter>
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive header component with mobile navigation drawer, theme switching, and user authentication. Features a left-side mobile navigation drawer that slides out smoothly.',
      },
    },
  },
  decorators: [
    (Story) => (
      <HeaderWrapper>
        <Story />
      </HeaderWrapper>
    ),
  ],
  argTypes: {
    onMobileMenuToggle: { action: 'mobile menu toggled' },
    className: { control: 'text' },
  },
};

// Base story
export const Default = {
  args: {},
};

// Mobile view story
export const MobileView = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet view story
export const TabletView = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Desktop view story
export const DesktopView = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// Scrolled state story
export const ScrolledState = {
  decorators: [
    (Story) => (
      <HeaderWrapper>
        <div className="h-screen">
          <div className="h-20 bg-gradient-to-b from-blue-500 to-purple-600"></div>
          <div className="h-96 bg-gray-100 dark:bg-gray-800"></div>
          <Story />
        </div>
      </HeaderWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Header with scroll effect applied. Scroll down to see the shadow and backdrop blur effect.',
      },
    },
  },
};

// Mobile navigation drawer story
export const MobileNavigationDrawer = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <HeaderWrapper>
        <div className="min-h-screen bg-background">
          <Story />
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Mobile Navigation Drawer</h2>
            <p className="text-muted-foreground">
              This story demonstrates the left-side mobile navigation drawer. 
              Click the menu button (hamburger icon) to open the drawer from the left side.
              The drawer includes user information, navigation links, and logout functionality.
            </p>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Left-side slide-out animation</li>
                  <li>Backdrop overlay with blur effect</li>
                  <li>User profile information</li>
                  <li>Navigation links with active states</li>
                  <li>Logout button</li>
                  <li>Auto-close on navigation</li>
                  <li>Body scroll prevention when open</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </HeaderWrapper>
    ),
  ],
  docs: {
    description: {
      story: 'Demonstrates the left-side mobile navigation drawer with all its features and functionality.',
    },
  },
};

// Responsive breakpoints story
export const ResponsiveBreakpoints = {
  parameters: {
    docs: {
      description: {
        story: 'Shows how the header adapts to different screen sizes. Use the viewport controls to see the responsive behavior.',
      },
    },
  },
};

// Unauthenticated state story
export const Unauthenticated = {
  decorators: [
    (Story) => {
      // Mock unauthenticated state
      vi.mocked(require('../stores/authStore').default).mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: () => console.log('Logout clicked'),
      });
      
      return (
        <HeaderWrapper>
          <Story />
        </HeaderWrapper>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Header in unauthenticated state, showing login and signup buttons instead of user info and navigation.',
      },
    },
  },
};

// Long username story
export const LongUsername = {
  decorators: [
    (Story) => {
      // Mock user with long name
      vi.mocked(require('../stores/authStore').default).mockReturnValue({
        user: { 
          name: 'Very Long User Name That Might Cause Layout Issues', 
          email: 'longname@example.com' 
        },
        isAuthenticated: true,
        logout: () => console.log('Logout clicked'),
      });
      
      return (
        <HeaderWrapper>
          <Story />
        </HeaderWrapper>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Header with a very long username to demonstrate text truncation and responsive behavior.',
      },
    },
  },
};
