import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'icon'],
    },
  },
};

export const Primary = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};

export const Destructive = {
  args: {
    children: 'Button',
    variant: 'destructive',
  },
};

export const Outline = {
  args: {
    children: 'Button',
    variant: 'outline',
  },
};

export const Ghost = {
  args: {
    children: 'Button',
    variant: 'ghost',
  },
};

export const Link = {
  args: {
    children: 'Button',
    variant: 'link',
  },
};

export const Small = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Large = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};
