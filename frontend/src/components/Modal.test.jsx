import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import Modal from './Modal';
import Button from './Button';

// Mock createPortal to return the children directly
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children, container) => children,
  };
});

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    // Mock document.body
    Object.defineProperty(document, 'body', {
      value: document.createElement('body'),
      writable: true,
    });
  });

  afterEach(() => {
    // Restore body overflow
    document.body.style.overflow = 'unset';
  });

  describe('Rendering', () => {
    it('renders nothing when isOpen is false', () => {
      render(<Modal isOpen={false} onClose={mockOnClose} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders modal when isOpen is true', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} />);
      // Check if any modal-related content is rendered
      const modalContent = screen.getByText('', { selector: '[role="dialog"]' });
      expect(modalContent).toBeInTheDocument();
    });

    it('renders with title', () => {
      render(<Modal isOpen={true} title="Test Title" onClose={mockOnClose} />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toHaveAttribute('id', 'modal-title');
    });

    it('renders with description', () => {
      render(<Modal isOpen={true} description="Test Description" onClose={mockOnClose} />);
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toHaveAttribute('id', 'modal-description');
    });

    it('renders children content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('renders close button by default', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('does not render close button when showCloseButton is false', () => {
      render(<Modal isOpen={true} showCloseButton={false} onClose={mockOnClose} />);
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Modal isOpen={true} title="Test Title" onClose={mockOnClose} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('has correct ARIA attributes when no title', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).not.toHaveAttribute('aria-labelledby');
    });

    it('has correct ARIA attributes with both title and description', () => {
      render(
        <Modal 
          isOpen={true} 
          title="Test Title" 
          description="Test Description" 
          onClose={mockOnClose} 
        />
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      render(<Modal isOpen={true} size="sm" onClose={mockOnClose} />);
      const modal = screen.getByRole('dialog').querySelector('.max-w-md');
      expect(modal).toBeInTheDocument();
    });

    it('applies medium size classes', () => {
      render(<Modal isOpen={true} size="md" onClose={mockOnClose} />);
      const modal = screen.getByRole('dialog').querySelector('.max-w-lg');
      expect(modal).toBeInTheDocument();
    });

    it('applies large size classes', () => {
      render(<Modal isOpen={true} size="lg" onClose={mockOnClose} />);
      const modal = screen.getByRole('dialog').querySelector('.max-w-2xl');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Close Behavior', () => {
    it('calls onClose when close button is clicked', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} />);
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed and closeOnEscape is true', async () => {
      render(<Modal isOpen={true} closeOnEscape={true} onClose={mockOnClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('does not call onClose when Escape key is pressed and closeOnEscape is false', async () => {
      render(<Modal isOpen={true} closeOnEscape={false} onClose={mockOnClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      await waitFor(() => {
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('Body Scroll Management', () => {
    it('prevents body scroll when modal is open', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when modal is closed', () => {
      const { rerender } = render(<Modal isOpen={true} onClose={mockOnClose} />);
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal isOpen={false} onClose={mockOnClose} />);
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(<Modal isOpen={true} className="custom-modal" onClose={mockOnClose} />);
      const modal = screen.getByRole('dialog').querySelector('.custom-modal');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Modal isOpen={true} ref={ref} onClose={mockOnClose} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Integration with Other Components', () => {
    it('works with Button component', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Button onClick={mockOnClose}>Close</Button>
        </Modal>
      );
      const button = screen.getByRole('button', { name: 'Close' });
      expect(button).toBeInTheDocument();
    });
  });
});
