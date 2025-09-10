import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from './Button';
import { runComprehensiveKeyboardTest } from '../utils/keyboardNavigation';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

describe('Button Component', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders button with correct text', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Button {...defaultProps} variant="primary" />);
      expect(screen.getByRole('button')).toHaveClass('bg-primary');

      rerender(<Button {...defaultProps} variant="secondary" />);
      expect(screen.getByRole('button')).toHaveClass('bg-secondary');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Button {...defaultProps} size="sm" />);
      expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

      rerender(<Button {...defaultProps} size="lg" />);
      expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
    });

    it('renders disabled state correctly', () => {
      render(<Button {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('renders loading state correctly', () => {
      render(<Button {...defaultProps} loading />);
      expect(screen.getByRole('button')).toHaveClass('opacity-75', 'cursor-wait');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      render(<Button {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      render(<Button {...defaultProps} disabled />);
      fireEvent.click(screen.getByRole('button'));
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      render(<Button {...defaultProps} loading />);
      fireEvent.click(screen.getByRole('button'));
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });

    it('handles keyboard interactions', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      // Test Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
      
      // Test Space key
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(defaultProps.onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes', () => {
      render(<Button {...defaultProps} aria-label="Custom button" />);
      expect(screen.getByRole('button', { name: 'Custom button' })).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <div>
          <Button {...defaultProps} aria-describedby="button-help" />
          <div id="button-help">This button performs an important action</div>
        </div>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'button-help');
    });

    it('supports aria-expanded for expandable buttons', () => {
      render(<Button {...defaultProps} aria-expanded="false" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports aria-pressed for toggle buttons', () => {
      render(<Button {...defaultProps} aria-pressed="false" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('has proper focus management', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
      
      // Test focus styles
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
    });

    it('maintains focus when disabled', () => {
      render(<Button {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });

    it('has proper color contrast for different variants', () => {
      const { rerender } = render(<Button {...defaultProps} variant="primary" />);
      const button = screen.getByRole('button');
      
      // Test primary variant contrast
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
      
      // Test secondary variant contrast
      rerender(<Button {...defaultProps} variant="secondary" />);
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });
  });

  describe('Keyboard Navigation & Focus Management', () => {
    it('can receive focus via tab navigation', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });

    it('can lose focus when tabbing away', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
      
      button.blur();
      expect(button).not.toHaveFocus();
    });

    it('has visible focus indicator', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
    });

    it('handles Enter key correctly', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key correctly', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default behavior for Enter key', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true
      });
      
      button.dispatchEvent(enterEvent);
      expect(enterEvent.defaultPrevented).toBe(true);
    });

    it('prevents default behavior for Space key', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true
      });
      
      button.dispatchEvent(spaceEvent);
      expect(spaceEvent.defaultPrevented).toBe(true);
    });

    it('maintains focus during keyboard interactions', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
      
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(button).toHaveFocus();
      
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(button).toHaveFocus();
    });

    it('handles multiple rapid keyboard presses', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      
      // Rapid Enter key presses
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      }
      
      expect(defaultProps.onClick).toHaveBeenCalledTimes(5);
      expect(button).toHaveFocus();
    });

    it('handles mixed keyboard and mouse interactions', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      // Start with keyboard focus
      button.focus();
      expect(button).toHaveFocus();
      
      // Click with mouse
      fireEvent.click(button);
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
      expect(button).toHaveFocus();
      
      // Continue with keyboard
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(defaultProps.onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Comprehensive Keyboard Testing', () => {
    it('passes comprehensive keyboard navigation test', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      const results = runComprehensiveKeyboardTest(button, {
        shortcuts: [
          { key: 'Enter', code: 'Enter', expectedAction: 'Activate button', description: 'Enter key activation' },
          { key: ' ', code: 'Space', expectedAction: 'Activate button', description: 'Space key activation' }
        ],
        onEscape: () => {
          // Button doesn't handle escape by default
          return false;
        }
      });
      
      // Tab navigation should pass
      expect(results.tabNavigation.canTabTo).toBe(true);
      expect(results.tabNavigation.canTabFrom).toBe(true);
      expect(results.tabNavigation.hasVisibleFocus).toBe(true);
      
      // Keyboard shortcuts should pass
      expect(results.keyboardShortcuts.shortcuts['Enter key activation'].success).toBe(true);
      expect(results.keyboardShortcuts.shortcuts['Space key activation'].success).toBe(true);
      
      // Overall summary
      expect(results.summary.passed).toBeGreaterThan(0);
      expect(results.summary.failed).toBe(0);
    });

    it('maintains accessibility in different states', () => {
      const { rerender } = render(<Button {...defaultProps} />);
      let button = screen.getByRole('button');
      
      // Test normal state
      let results = runComprehensiveKeyboardTest(button);
      expect(results.summary.failed).toBe(0);
      
      // Test disabled state
      rerender(<Button {...defaultProps} disabled />);
      button = screen.getByRole('button');
      results = runComprehensiveKeyboardTest(button);
      expect(results.summary.failed).toBe(0);
      
      // Test loading state
      rerender(<Button {...defaultProps} loading />);
      button = screen.getByRole('button');
      results = runComprehensiveKeyboardTest(button);
      expect(results.summary.failed).toBe(0);
    });
  });

  describe('Semantic HTML', () => {
    it('renders as button element by default', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders as anchor when href is provided', () => {
      render(<Button {...defaultProps} href="/test" />);
      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
    });

    it('renders as submit button when type is submit', () => {
      render(<Button {...defaultProps} type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('renders as reset button when type is reset', () => {
      render(<Button {...defaultProps} type="reset" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<Button onClick={defaultProps.onClick} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    it('handles very long text content', () => {
      const longText = 'This is a very long button text that might wrap to multiple lines and should still be accessible';
      render(<Button {...defaultProps} children={longText} />);
      expect(screen.getByRole('button', { name: longText })).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      const specialText = 'Button with special chars: !@#$%^&*()';
      render(<Button {...defaultProps} children={specialText} />);
      expect(screen.getByRole('button', { name: specialText })).toBeInTheDocument();
    });

    it('handles numeric children', () => {
      render(<Button {...defaultProps} children={42} />);
      expect(screen.getByRole('button', { name: '42' })).toBeInTheDocument();
    });
  });

  describe('Integration with other components', () => {
    it('works with form elements', () => {
      render(
        <form>
          <Button type="submit">Submit Form</Button>
        </form>
      );
      expect(screen.getByRole('button', { name: 'Submit Form' })).toHaveAttribute('type', 'submit');
    });

    it('works with navigation elements', () => {
      render(
        <nav>
          <Button href="/home">Home</Button>
        </nav>
      );
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    });
  });
});
