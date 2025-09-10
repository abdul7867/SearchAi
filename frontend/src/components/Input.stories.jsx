import Input from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success'],
    },
    error: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    required: {
      control: { type: 'boolean' },
    },
  },
};

export const Default = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email...',
    type: 'email',
  },
};

export const WithHelperText = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password...',
    helperText: 'Must be at least 8 characters long',
  },
};

export const WithError = {
  args: {
    label: 'Username',
    placeholder: 'Enter username...',
    error: 'Username is required',
  },
};

export const Required = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name...',
    required: true,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

export const Success = {
  args: {
    label: 'Email',
    placeholder: 'Enter email...',
    type: 'email',
    variant: 'success',
    helperText: 'Email format is valid',
  },
};

export const Small = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size...',
    size: 'sm',
  },
};

export const Large = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size...',
    size: 'lg',
  },
};

export const Search = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    size: 'lg',
  },
};

export const Number = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter age...',
    min: 0,
    max: 120,
  },
};

export const Tel = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+1 (555) 123-4567',
  },
};

export const URL = {
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
  },
};
