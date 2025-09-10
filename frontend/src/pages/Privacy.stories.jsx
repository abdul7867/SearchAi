import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Privacy from './Privacy';
import { ThemeProvider } from '../contexts/ThemeContext';

export default {
  title: 'Pages/Privacy',
  component: Privacy,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Privacy Policy page that explains how AI Search collects, uses, and protects user data. Features a comprehensive layout with sections covering data collection, usage, protection, and user rights.',
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <Story />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    ),
  ],
};

// Default story
export const Default = {
  args: {},
};

// Dark theme story
export const DarkTheme = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ThemeProvider>
          <div className="min-h-screen bg-background dark">
            <Story />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Privacy Policy page in dark theme to demonstrate theme switching capabilities.',
      },
    },
  },
};

// Mobile view story
export const MobileView = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  docs: {
    description: {
      story: 'Privacy Policy page optimized for mobile devices, showing responsive design.',
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
  docs: {
    description: {
      story: 'Privacy Policy page on tablet devices, demonstrating responsive breakpoints.',
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
  docs: {
    description: {
      story: 'Privacy Policy page on desktop devices, showing full-width layout.',
    },
  },
};
