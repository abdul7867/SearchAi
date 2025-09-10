import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

// Wrapper component for stories
const FooterWrapper = ({ children }) => (
  <BrowserRouter>
    <div className="min-h-screen bg-background">
      {children}
    </div>
  </BrowserRouter>
);

export default {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive footer component with brand information, quick links, and social media connections.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <FooterWrapper>
        <Story />
      </FooterWrapper>
    ),
  ],
};

export const Default = {
  args: {},
};

export const CustomClassName = {
  args: {
    className: 'bg-primary/10 border-primary',
  },
};

export const WithCustomStyling = {
  args: {
    className: 'bg-gradient-to-r from-primary/20 to-secondary/20',
  },
};

export const MobileView = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const DesktopView = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

export const DarkTheme = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
