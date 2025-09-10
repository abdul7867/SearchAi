import React from 'react';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../contexts/ThemeContext';

export default {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A theme toggle component that provides smooth, flicker-free theme switching between light, dark, and system themes. Features smooth transitions and accessibility enhancements.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="p-8 bg-background min-h-screen">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['icon', 'dropdown'],
      description: 'The visual variant of the theme toggle',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'The size of the theme toggle',
    },
    showSystemOption: {
      control: { type: 'boolean' },
      description: 'Whether to show the system theme option (only applies to dropdown variant)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

// Default icon toggle
export const Default = {
  args: {
    variant: 'icon',
    size: 'icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default icon-based theme toggle that cycles between light and dark themes.',
      },
    },
  },
};

// Small icon toggle
export const Small = {
  args: {
    variant: 'icon',
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small-sized theme toggle button.',
      },
    },
  },
};

// Medium icon toggle
export const Medium = {
  args: {
    variant: 'icon',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium-sized theme toggle button.',
      },
    },
  },
};

// Large icon toggle
export const Large = {
  args: {
    variant: 'icon',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large-sized theme toggle button.',
      },
    },
  },
};

// Dropdown with system option
export const DropdownWithSystem = {
  args: {
    variant: 'dropdown',
    size: 'icon',
    showSystemOption: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropdown variant that shows light, dark, and system theme options. Hover over the button to see the dropdown menu.',
      },
    },
  },
};

// Dropdown without system option
export const DropdownWithoutSystem = {
  args: {
    variant: 'dropdown',
    size: 'icon',
    showSystemOption: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropdown variant that only shows light and dark theme options.',
      },
    },
  },
};

// Custom styling
export const CustomStyling = {
  args: {
    variant: 'icon',
    size: 'icon',
    className: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle with custom styling applied.',
      },
    },
  },
};

// All variants showcase
export const AllVariants = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Icon Variants</h3>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" size="sm" />
          <ThemeToggle variant="icon" size="icon" />
          <ThemeToggle variant="icon" size="md" />
          <ThemeToggle variant="icon" size="lg" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Dropdown Variants</h3>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="dropdown" size="icon" showSystemOption={false} />
          <ThemeToggle variant="dropdown" size="icon" showSystemOption={true} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Custom Styling</h3>
        <div className="flex items-center space-x-4">
          <ThemeToggle 
            variant="icon" 
            size="icon" 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-full p-3 shadow-lg" 
          />
          <ThemeToggle 
            variant="icon" 
            size="icon" 
            className="bg-green-500 text-white hover:bg-green-600 rounded-lg p-3" 
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all theme toggle variants and sizes in one view.',
      },
    },
  },
};
