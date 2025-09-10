import SegmentedControl from './SegmentedControl';

export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable segmented control component for selecting from multiple options, with support for different sizes, variants, and focus mode-specific styling.'
      }
    }
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options with value, label, and optional icon and description'
    },
    value: {
      control: 'select',
      options: ['general', 'academic', 'news', 'technical'],
      description: 'Currently selected option value'
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when selection changes'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the control'
    },
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'minimal'],
      description: 'Visual variant of the control'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
};

// Default focus mode options
const defaultOptions = [
  { value: 'general', label: 'General', description: 'General search results' },
  { value: 'academic', label: 'Academic', description: 'Academic and scholarly sources' },
  { value: 'news', label: 'News', description: 'Current events and news sources' },
  { value: 'technical', label: 'Technical', description: 'Technical and developer resources' }
];

// Custom icon options
const customIconOptions = [
  { value: 'general', label: 'General', icon: 'Globe' },
  { value: 'academic', label: 'Academic', icon: 'BookOpen' },
  { value: 'news', label: 'News', icon: 'Newspaper' },
  { value: 'technical', label: 'Technical', icon: 'Code' }
];

export const Default = {
  args: {
    options: defaultOptions,
    value: 'general',
    size: 'md',
    variant: 'default'
  }
};

export const AcademicSelected = {
  args: {
    ...Default.args,
    value: 'academic'
  }
};

export const NewsSelected = {
  args: {
    ...Default.args,
    value: 'news'
  }
};

export const TechnicalSelected = {
  args: {
    ...Default.args,
    value: 'technical'
  }
};

export const SmallSize = {
  args: {
    ...Default.args,
    size: 'sm'
  }
};

export const LargeSize = {
  args: {
    ...Default.args,
    size: 'lg'
  }
};

export const ElevatedVariant = {
  args: {
    ...Default.args,
    variant: 'elevated'
  }
};

export const MinimalVariant = {
  args: {
    ...Default.args,
    variant: 'minimal'
  }
};

export const CustomIcons = {
  args: {
    options: customIconOptions,
    value: 'general',
    size: 'md',
    variant: 'default'
  }
};

export const Interactive = {
  args: {
    ...Default.args,
    value: 'general'
  },
  parameters: {
    docs: {
      description: {
        story: 'This is an interactive example. Try clicking different options to see the selection change.'
      }
    }
  }
};
