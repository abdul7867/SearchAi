import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Input from './Input';
import { runComprehensiveKeyboardTest } from '../utils/keyboardNavigation';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

describe('Input Component', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    placeholder: 'Enter text here'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders input with correct label', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renders with different types', () => {
      const { rerender } = render(<Input {...defaultProps} type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input {...defaultProps} type="password" />);
      expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'password');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Input {...defaultProps} size="sm" />);
      expect(screen.getByRole('textbox')).toHaveClass('px-3', 'py-1.5', 'text-sm');

      rerender(<Input {...defaultProps} size="lg" />);
      expect(screen.getByRole('textbox')).toHaveClass('px-4', 'py-3', 'text-lg');
    });

    it('renders disabled state correctly', () => {
      render(<Input {...defaultProps} disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('renders required state correctly', () => {
      render(<Input {...defaultProps} required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('renders with error state', () => {
      render(<Input {...defaultProps} error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders with helper text', () => {
      render(<Input {...defaultProps} helperText="This field is optional" />);
      expect(screen.getByText('This field is optional')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Input {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(input).toHaveValue('new value');
    });

    it('handles focus and blur events', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(<Input {...defaultProps} onFocus={handleFocus} onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events', () => {
      const handleKeyDown = jest.fn();
      render(<Input {...defaultProps} onKeyDown={handleKeyDown} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Input {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper label association', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test Label');
      
      expect(input).toHaveAttribute('id', 'test-input');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('supports aria-label when no visible label', () => {
      render(<Input {...defaultProps} label="" aria-label="Hidden label" />);
      expect(screen.getByRole('textbox', { name: 'Hidden label' })).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <div>
          <div id="custom-label">Custom Label</div>
          <Input {...defaultProps} label="" aria-labelledby="custom-label" />
        </div>
      );
      expect(screen.getByRole('textbox', { name: 'Custom Label' })).toBeInTheDocument();
    });

    it('supports aria-describedby for helper text', () => {
      render(<Input {...defaultProps} helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      const helperText = screen.getByText('Helper text');
      
      expect(helperText).toHaveAttribute('id');
      expect(input).toHaveAttribute('aria-describedby', helperText.id);
    });

    it('supports aria-describedby for error messages', () => {
      render(<Input {...defaultProps} error="Error message" />);
      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByText('Error message');
      
      expect(errorMessage).toHaveAttribute('id');
      expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
    });

    it('supports aria-describedby for both helper text and error', () => {
      render(<Input {...defaultProps} helperText="Helper text" error="Error message" />);
      const input = screen.getByRole('textbox');
      const helperText = screen.getByText('Helper text');
      const errorMessage = screen.getByText('Error message');
      
      const describedBy = `${helperText.id} ${errorMessage.id}`;
      expect(input).toHaveAttribute('aria-describedby', describedBy);
    });

    it('has proper ARIA attributes for different states', () => {
      const { rerender } = render(<Input {...defaultProps} />);
      let input = screen.getByRole('textbox');
      
      // Default state
      expect(input).not.toHaveAttribute('aria-invalid');
      expect(input).not.toHaveAttribute('aria-required');
      
      // Required state
      rerender(<Input {...defaultProps} required />);
      input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
      
      // Error state
      rerender(<Input {...defaultProps} error="Error" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('has proper focus management', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      expect(input).toHaveFocus();
      
      // Test focus styles
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
    });

    it('maintains focus when disabled', () => {
      render(<Input {...defaultProps} disabled />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      expect(input).toHaveFocus();
    });

    it('has proper color contrast for different states', () => {
      const { rerender } = render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      // Default state
      expect(input).toHaveClass('bg-background', 'text-foreground', 'border-border');
      
      // Error state
      rerender(<Input {...defaultProps} error="Error" />);
      expect(screen.getByRole('textbox')).toHaveClass('border-destructive');
    });
  });

  describe('Keyboard Navigation & Focus Management', () => {
    it('can receive focus via tab navigation', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      expect(input).toHaveFocus();
    });

    it('can lose focus when tabbing away', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      expect(input).toHaveFocus();
      
      input.blur();
      expect(input).not.toHaveFocus();
    });

    it('has visible focus indicator', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      expect(input).toHaveClass('focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
    });

    it('handles Enter key correctly', () => {
      const handleKeyDown = jest.fn();
      render(<Input {...defaultProps} onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('handles Escape key correctly', () => {
      const handleKeyDown = jest.fn();
      render(<Input {...defaultProps} onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('handles arrow keys correctly', () => {
      const handleKeyDown = jest.fn();
      render(<Input {...defaultProps} onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      
      // Test all arrow keys
      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      arrowKeys.forEach(key => {
        fireEvent.keyDown(input, { key, code: key });
      });
      
      expect(handleKeyDown).toHaveBeenCalledTimes(4);
    });

    it('maintains focus during keyboard interactions', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      expect(input).toHaveFocus();
      
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(input).toHaveFocus();
      
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      expect(input).toHaveFocus();
    });

    it('handles rapid keyboard input', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      
      // Rapid typing
      const testText = 'Hello World!';
      for (let i = 0; i < testText.length; i++) {
        fireEvent.keyDown(input, { key: testText[i], code: `Key${testText[i].toUpperCase()}` });
      }
      
      expect(input).toHaveFocus();
    });

    it('handles mixed keyboard and mouse interactions', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      // Start with keyboard focus
      input.focus();
      expect(input).toHaveFocus();
      
      // Click with mouse
      fireEvent.click(input);
      expect(input).toHaveFocus();
      
      // Continue with keyboard
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(input).toHaveFocus();
    });

    it('handles copy/paste keyboard shortcuts', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      
      // Test Ctrl+C (Copy)
      fireEvent.keyDown(input, { key: 'c', code: 'KeyC', ctrlKey: true });
      
      // Test Ctrl+V (Paste)
      fireEvent.keyDown(input, { key: 'v', code: 'KeyV', ctrlKey: true });
      
      // Test Ctrl+X (Cut)
      fireEvent.keyDown(input, { key: 'x', code: 'KeyX', ctrlKey: true });
      
      expect(input).toHaveFocus();
    });

    it('handles select all keyboard shortcut', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      
      // Test Ctrl+A (Select All)
      fireEvent.keyDown(input, { key: 'a', code: 'KeyA', ctrlKey: true });
      
      expect(input).toHaveFocus();
    });
  });

  describe('Comprehensive Keyboard Testing', () => {
    it('passes comprehensive keyboard navigation test', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      
      const results = runComprehensiveKeyboardTest(input, {
        shortcuts: [
          { key: 'Enter', code: 'Enter', expectedAction: 'Submit or confirm', description: 'Enter key' },
          { key: 'Escape', code: 'Escape', expectedAction: 'Cancel or clear', description: 'Escape key' },
          { key: 'ArrowLeft', code: 'ArrowLeft', expectedAction: 'Move cursor left', description: 'Left arrow' },
          { key: 'ArrowRight', code: 'ArrowRight', expectedAction: 'Move cursor right', description: 'Right arrow' }
        ],
        onEscape: () => {
          // Input doesn't handle escape by default
          return false;
        }
      });
      
      // Tab navigation should pass
      expect(results.tabNavigation.canTabTo).toBe(true);
      expect(results.tabNavigation.canTabFrom).toBe(true);
      expect(results.tabNavigation.hasVisibleFocus).toBe(true);
      
      // Overall summary
      expect(results.summary.passed).toBeGreaterThan(0);
      expect(results.summary.failed).toBe(0);
    });

    it('maintains accessibility in different states', () => {
      const { rerender } = render(<Input {...defaultProps} />);
      let input = screen.getByRole('textbox');
      
      // Test normal state
      let results = runComprehensiveKeyboardTest(input);
      expect(results.summary.failed).toBe(0);
      
      // Test disabled state
      rerender(<Input {...defaultProps} disabled />);
      input = screen.getByRole('textbox');
      results = runComprehensiveKeyboardTest(input);
      expect(results.summary.failed).toBe(0);
      
      // Test error state
      rerender(<Input {...defaultProps} error="Error" />);
      input = screen.getByRole('textbox');
      results = runComprehensiveKeyboardTest(input);
      expect(results.summary.failed).toBe(0);
    });

    it('handles different input types correctly', () => {
      const inputTypes = ['text', 'email', 'password', 'number', 'tel', 'url'];
      
      inputTypes.forEach(type => {
        const { unmount } = render(<Input {...defaultProps} type={type} />);
        const input = screen.getByRole(type === 'number' ? 'spinbutton' : 'textbox');
        
        const results = runComprehensiveKeyboardTest(input);
        expect(results.summary.failed).toBe(0);
        
        unmount();
      });
    });
  });

  describe('Semantic HTML', () => {
    it('renders as input element', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has proper input type', () => {
      render(<Input {...defaultProps} type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('supports all input attributes', () => {
      render(
        <Input
          {...defaultProps}
          minLength={3}
          maxLength={50}
          pattern="[A-Za-z]+"
          autocomplete="name"
        />
      );
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveAttribute('minlength', '3');
      expect(input).toHaveAttribute('maxlength', '50');
      expect(input).toHaveAttribute('pattern', '[A-Za-z]+');
      expect(input).toHaveAttribute('autocomplete', 'name');
    });

    it('renders label as label element', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByText('Test Label').tagName).toBe('LABEL');
    });
  });

  describe('Form Integration', () => {
    it('works within forms', () => {
      render(
        <form>
          <Input {...defaultProps} name="test" />
        </form>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'test');
    });

    it('supports form validation', () => {
      render(<Input {...defaultProps} required minLength={3} />);
      const input = screen.getByRole('textbox');
      
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('minlength', '3');
    });

    it('supports form submission', () => {
      const handleSubmit = jest.fn();
      render(
        <form onSubmit={handleSubmit}>
          <Input {...defaultProps} name="test" />
          <button type="submit">Submit</button>
        </form>
      );
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test value' } });
      
      fireEvent.submit(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label gracefully', () => {
      render(<Input {...defaultProps} label="" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('handles very long labels', () => {
      const longLabel = 'This is a very long label that might wrap to multiple lines and should still be accessible and properly associated with the input field';
      render(<Input {...defaultProps} label={longLabel} />);
      expect(screen.getByLabelText(longLabel)).toBeInTheDocument();
    });

    it('handles special characters in labels', () => {
      const specialLabel = 'Label with special chars: !@#$%^&*()';
      render(<Input {...defaultProps} label={specialLabel} />);
      expect(screen.getByLabelText(specialLabel)).toBeInTheDocument();
    });

    it('handles numeric labels', () => {
      render(<Input {...defaultProps} label={42} />);
      expect(screen.getByLabelText('42')).toBeInTheDocument();
    });

    it('handles empty values gracefully', () => {
      render(<Input {...defaultProps} value="" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('handles controlled component behavior', () => {
      const { rerender } = render(<Input {...defaultProps} value="initial" />);
      let input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');
      
      rerender(<Input {...defaultProps} value="updated" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveValue('updated');
    });
  });

  describe('Integration with other components', () => {
    it('works with Button components', () => {
      render(
        <div>
          <Input {...defaultProps} />
          <button type="submit">Submit</button>
        </div>
      );
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('works with Card components', () => {
      render(
        <div className="card">
          <Input {...defaultProps} />
        </div>
      );
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });
});
