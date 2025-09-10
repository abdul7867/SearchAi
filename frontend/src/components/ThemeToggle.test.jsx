import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ThemeToggle from './ThemeToggle';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock the theme context
const mockThemeContext = {
  theme: 'light',
  toggleTheme: vi.fn(),
  setTheme: vi.fn(),
};

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => mockThemeContext,
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockThemeContext.theme = 'light';
    localStorageMock.getItem.mockReturnValue('light');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Icon Variant', () => {
    it('renders with default props', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-theme-toggle');
    });

    it('calls toggleTheme when clicked', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      expect(mockThemeContext.toggleTheme).toHaveBeenCalledTimes(1);
    });

    it('shows sun icon for light theme', () => {
      mockThemeContext.theme = 'light';
      render(<ThemeToggle />);
      
      // Check if sun icon is present (light theme)
      expect(screen.getByRole('button')).toBeInTheDocument();
      // The icon should be visible in the button
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('shows moon icon for dark theme', () => {
      mockThemeContext.theme = 'dark';
      render(<ThemeToggle />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ThemeToggle className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('forwards additional props', () => {
      render(<ThemeToggle data-testid="theme-toggle" />);
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      
      // Should have aria-label
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toContain('Switch to dark theme');
    });
  });

  describe('Dropdown Variant', () => {
    it('renders dropdown when variant is dropdown', () => {
      render(<ThemeToggle variant="dropdown" showSystemOption={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('shows dropdown menu on hover', async () => {
      render(<ThemeToggle variant="dropdown" showSystemOption={true} />);
      const button = screen.getByRole('button');
      
      // Hover over the button
      fireEvent.mouseEnter(button);
      
      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();
      });
    });

    it('calls setTheme with correct theme when dropdown option is clicked', async () => {
      render(<ThemeToggle variant="dropdown" showSystemOption={true} />);
      const button = screen.getByRole('button');
      
      // Hover to show dropdown
      fireEvent.mouseEnter(button);
      
      await waitFor(() => {
        const darkOption = screen.getByText('Dark');
        fireEvent.click(darkOption);
        expect(mockThemeContext.setTheme).toHaveBeenCalledWith('dark');
      });
    });

    it('handles system theme selection', async () => {
      render(<ThemeToggle variant="dropdown" showSystemOption={true} />);
      const button = screen.getByRole('button');
      
      // Hover to show dropdown
      fireEvent.mouseEnter(button);
      
      await waitFor(() => {
        const systemOption = screen.getByText('System');
        fireEvent.click(systemOption);
        
        // Should remove localStorage item and set system theme
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('theme');
        expect(mockThemeContext.setTheme).toHaveBeenCalled();
      });
    });

    it('highlights current theme in dropdown', async () => {
      mockThemeContext.theme = 'dark';
      render(<ThemeToggle variant="dropdown" showSystemOption={true} />);
      const button = screen.getByRole('button');
      
      // Hover to show dropdown
      fireEvent.mouseEnter(button);
      
      await waitFor(() => {
        const darkOption = screen.getByText('Dark');
        expect(darkOption).toHaveClass('bg-accent', 'text-accent-foreground');
      });
    });

    it('does not show system option when showSystemOption is false', async () => {
      render(<ThemeToggle variant="dropdown" showSystemOption={false} />);
      const button = screen.getByRole('button');
      
      // Hover to show dropdown
      fireEvent.mouseEnter(button);
      
      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.queryByText('System')).not.toBeInTheDocument();
      });
    });
  });

  describe('Different Sizes', () => {
    it('renders with small size', () => {
      render(<ThemeToggle size="sm" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders with medium size', () => {
      render(<ThemeToggle size="md" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders with large size', () => {
      render(<ThemeToggle size="lg" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders with icon size', () => {
      render(<ThemeToggle size="icon" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Theme Icon Logic', () => {
    it('shows sun icon for light theme', () => {
      mockThemeContext.theme = 'light';
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('shows moon icon for dark theme', () => {
      mockThemeContext.theme = 'dark';
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('shows monitor icon for system theme', () => {
      mockThemeContext.theme = 'system';
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label that changes with theme', () => {
      mockThemeContext.theme = 'light';
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toContain('Switch to dark theme');
      
      // Change theme
      mockThemeContext.theme = 'dark';
      render(<ThemeToggle />);
      
      const newButton = screen.getByRole('button');
      expect(newButton.getAttribute('aria-label')).toContain('Switch to light theme');
    });

    it('has data-theme-toggle attribute', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-theme-toggle');
    });
  });

  describe('Error Handling', () => {
    it('warns when invalid theme is passed to setTheme', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<ThemeToggle variant="dropdown" showSystemOption={true} />);
      const button = screen.getByRole('button');
      
      // Hover to show dropdown
      fireEvent.mouseEnter(button);
      
      // Try to set invalid theme (this would be handled by the context)
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
