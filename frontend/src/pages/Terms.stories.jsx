import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Terms from './Terms';
import { ThemeProvider } from '../contexts/ThemeContext';

export default {
  title: 'Pages/Terms',
  component: Terms,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Terms of Service page that outlines the rules and guidelines for using AI Search. Features a comprehensive layout with sections covering user accounts, acceptable use, intellectual property, and legal disclaimers.',
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
        story: 'Terms of Service page in dark theme to demonstrate theme switching capabilities.',
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
      story: 'Terms of Service page optimized for mobile devices, showing responsive design.',
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
      story: 'Terms of Service page on tablet devices, demonstrating responsive breakpoints.',
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
      story: 'Terms of Service page on desktop devices, showing full-width layout.',
    },
  },
};
