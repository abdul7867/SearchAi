import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export default {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A modal component with proper accessibility, backdrop, and various size options.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size of the modal',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Whether clicking the backdrop closes the modal',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing Escape closes the modal',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when modal is closed',
    },
  },
};

// Template for controlled modals
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Modal Content</h3>
          <p className="text-muted-foreground">
            This is the modal content. You can put any content here.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Default Modal',
  description: 'This is a default modal with title and description.',
  size: 'md',
};

export const Small = Template.bind({});
Small.args = {
  title: 'Small Modal',
  description: 'This is a small modal.',
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  title: 'Large Modal',
  description: 'This is a large modal with more space.',
  size: 'lg',
};

export const ExtraLarge = Template.bind({});
ExtraLarge.args = {
  title: 'Extra Large Modal',
  description: 'This is an extra large modal for complex content.',
  size: 'xl',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  title: 'Full Width Modal',
  description: 'This modal takes the full width of the screen.',
  size: 'full',
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
  description: 'This modal has no title but still has a description.',
  size: 'md',
};

export const WithoutDescription = Template.bind({});
WithoutDescription.args = {
  title: 'No Description Modal',
  size: 'md',
};

export const WithoutCloseButton = Template.bind({});
WithoutCloseButton.args = {
  title: 'No Close Button',
  description: 'This modal has no close button. You must handle closing programmatically.',
  showCloseButton: false,
  size: 'md',
};

export const NoBackdropClick = Template.bind({});
NoBackdropClick.args = {
  title: 'No Backdrop Click',
  description: 'This modal cannot be closed by clicking the backdrop.',
  closeOnBackdropClick: false,
  size: 'md',
};

export const NoEscapeKey = Template.bind({});
NoEscapeKey.args = {
  title: 'No Escape Key',
  description: 'This modal cannot be closed by pressing the Escape key.',
  closeOnEscape: false,
  size: 'md',
};

export const ComplexContent = Template.bind({});
ComplexContent.args = {
  title: 'Complex Content Modal',
  description: 'This modal contains complex content with cards and forms.',
  size: 'xl',
};

ComplexContent.render = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>
        Open Complex Modal
      </Button>
      
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Section 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is the first section of content in the modal.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Section 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is the second section of content in the modal.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setIsOpen(false)}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const ConfirmationDialog = Template.bind({});
ConfirmationDialog.args = {
  title: 'Confirm Action',
  description: 'Are you sure you want to perform this action?',
  size: 'sm',
};

ConfirmationDialog.render = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="p-8">
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>
      
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This action cannot be undone. This will permanently delete the item.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="destructive" onClick={() => setIsOpen(false)}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const FormModal = Template.bind({});
FormModal.args = {
  title: 'Edit Profile',
  description: 'Update your profile information.',
  size: 'lg',
};

FormModal.render = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>
        Edit Profile
      </Button>
      
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button type="submit">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
