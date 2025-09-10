import React from 'react';
import LayoutShell from './LayoutShell';
import Header from './Header';
import Footer from './Footer';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export default {
  title: 'Layout/LayoutShell',
  component: LayoutShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible layout shell component that provides header, sidebar, footer, and main content areas.',
      },
    },
  },
  argTypes: {
    header: {
      control: false,
      description: 'Header component to render at the top',
    },
    sidebar: {
      control: false,
      description: 'Sidebar component to render on the left',
    },
    footer: {
      control: false,
      description: 'Footer component to render at the bottom',
    },
    children: {
      control: false,
      description: 'Main content to render in the center',
    },
  },
};

// Mock Header component for stories
const MockHeader = () => (
  <div className="w-full border-b border-border bg-card/95 p-4">
    <div className="container mx-auto">
      <h1 className="text-xl font-bold">Mock Header</h1>
    </div>
  </div>
);

// Mock Sidebar component for stories
const MockSidebar = () => (
  <div className="w-64 border-r border-border bg-card/50 p-4">
    <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
    <nav className="space-y-2">
      <a href="#" className="block p-2 rounded hover:bg-accent">Navigation Item 1</a>
      <a href="#" className="block p-2 rounded hover:bg-accent">Navigation Item 2</a>
      <a href="#" className="block p-2 rounded hover:bg-accent">Navigation Item 3</a>
    </nav>
  </div>
);

// Mock Footer component for stories
const MockFooter = () => (
  <div className="w-full border-t border-border bg-card/50 p-4">
    <div className="container mx-auto text-center text-muted-foreground">
      <p>Mock Footer - © 2024</p>
    </div>
  </div>
);

// Sample content for stories
const SampleContent = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Welcome to AI Search</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This is the main content area of the layout. You can put any content here including
          forms, lists, cards, or any other components.
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Advanced AI-powered search</li>
          <li>• Intelligent result ranking</li>
          <li>• Personalized recommendations</li>
          <li>• Search history and collections</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export const Default = {
  args: {
    children: <SampleContent />,
  },
};

export const WithHeader = {
  args: {
    header: <MockHeader />,
    children: <SampleContent />,
  },
};

export const WithFooter = {
  args: {
    footer: <MockFooter />,
    children: <SampleContent />,
  },
};

export const WithHeaderAndFooter = {
  args: {
    header: <MockHeader />,
    footer: <MockFooter />,
    children: <SampleContent />,
  },
};

export const WithSidebar = {
  args: {
    header: <MockHeader />,
    sidebar: <MockSidebar />,
    footer: <MockFooter />,
    children: <SampleContent />,
  },
};

export const HeaderOnly = {
  args: {
    header: <MockHeader />,
    children: <SampleContent />,
  },
};

export const SidebarOnly = {
  args: {
    sidebar: <MockSidebar />,
    children: <SampleContent />,
  },
};

export const FooterOnly = {
  args: {
    footer: <MockFooter />,
    children: <SampleContent />,
  },
};

export const RealComponents = {
  args: {
    header: <Header />,
    footer: <Footer />,
    children: <SampleContent />,
  },
};
