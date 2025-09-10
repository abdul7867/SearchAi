import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AICard from './AICard';

describe('AICard', () => {
  const defaultProps = {
    answer: 'This is a test AI answer',
    metadata: {
      processingTime: 1000,
      searchResultsCount: 5,
      timestamp: '2024-01-01T00:00:00.000Z'
    },
    focus: 'general',
    isBookmarked: false,
    onBookmark: vi.fn(),
    searchId: 'test-123'
  };

  it('renders the AI answer correctly', () => {
    render(<AICard {...defaultProps} />);
    expect(screen.getByText('This is a test AI answer')).toBeInTheDocument();
  });

  it('displays the AI Answer title', () => {
    render(<AICard {...defaultProps} />);
    expect(screen.getByText('AI Answer')).toBeInTheDocument();
  });

  it('shows the Bot icon in the header', () => {
    render(<AICard {...defaultProps} />);
    const botIcon = screen.getByTestId('bot-icon');
    expect(botIcon).toBeInTheDocument();
  });

  it('displays processing time metadata', () => {
    render(<AICard {...defaultProps} />);
    expect(screen.getByText('1000ms')).toBeInTheDocument();
  });

  it('displays source count metadata', () => {
    render(<AICard {...defaultProps} />);
    expect(screen.getByText('5 sources')).toBeInTheDocument();
  });

  it('shows focus mode badge', () => {
    render(<AICard {...defaultProps} />);
    expect(screen.getByText('general')).toBeInTheDocument();
  });

  it('displays timestamp when available', () => {
    render(<AICard {...defaultProps} />);
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
  });

  it('calls onBookmark when bookmark button is clicked', () => {
    const mockOnBookmark = vi.fn();
    render(<AICard {...defaultProps} onBookmark={mockOnBookmark} />);
    
    const bookmarkButton = screen.getByRole('button', { name: /add bookmark/i });
    fireEvent.click(bookmarkButton);
    
    expect(mockOnBookmark).toHaveBeenCalledWith('test-123');
  });

  it('shows bookmarked state correctly', () => {
    render(<AICard {...defaultProps} isBookmarked={true} />);
    
    const bookmarkButton = screen.getByRole('button', { name: /remove bookmark/i });
    expect(bookmarkButton).toHaveClass('text-yellow-600', 'bg-yellow-50');
  });

  it('shows unbookmarked state correctly', () => {
    render(<AICard {...defaultProps} isBookmarked={false} />);
    
    const bookmarkButton = screen.getByRole('button', { name: /add bookmark/i });
    expect(bookmarkButton).toHaveClass('text-muted-foreground');
  });

  it('handles missing metadata gracefully', () => {
    const propsWithoutMetadata = {
      ...defaultProps,
      metadata: {}
    };
    
    render(<AICard {...propsWithoutMetadata} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(screen.getByText('0 sources')).toBeInTheDocument();
  });

  it('handles missing focus gracefully', () => {
    const propsWithoutFocus = {
      ...defaultProps,
      focus: null
    };
    
    render(<AICard {...propsWithoutFocus} />);
    expect(screen.queryByText('general')).not.toBeInTheDocument();
  });

  it('does not render bookmark button when onBookmark is not provided', () => {
    const propsWithoutBookmark = {
      ...defaultProps,
      onBookmark: null
    };
    
    render(<AICard {...propsWithoutBookmark} />);
    expect(screen.queryByRole('button', { name: /bookmark/i })).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<AICard {...defaultProps} className="custom-class" />);
    const card = screen.getByText('AI Answer').closest('div');
    expect(card).toHaveClass('custom-class');
  });

  it('handles long answers without breaking layout', () => {
    const longAnswer = 'A'.repeat(1000);
    render(<AICard {...defaultProps} answer={longAnswer} />);
    
    expect(screen.getByText(longAnswer)).toBeInTheDocument();
  });

  it('renders with different focus modes', () => {
    const { rerender } = render(<AICard {...defaultProps} focus="academic" />);
    expect(screen.getByText('academic')).toBeInTheDocument();
    
    rerender(<AICard {...defaultProps} focus="news" />);
    expect(screen.getByText('news')).toBeInTheDocument();
    
    rerender(<AICard {...defaultProps} focus="technical" />);
    expect(screen.getByText('technical')).toBeInTheDocument();
  });

  it('renders markdown content correctly', () => {
    const markdownAnswer = `# Main Heading

This is a **bold** paragraph with *italic* text.

## Sub Heading

- List item 1
- List item 2
- List item 3

\`\`\`javascript
console.log('Hello World');
\`\`\`

> This is a blockquote

[Link text](https://example.com)`;

    render(<AICard {...defaultProps} answer={markdownAnswer} />);
    
    // Check that markdown is rendered as HTML elements, not raw text
    expect(screen.getByText('Main Heading')).toBeInTheDocument();
    expect(screen.getByText('Sub Heading')).toBeInTheDocument();
    expect(screen.getByText('This is a bold paragraph with italic text.')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
    expect(screen.getByText('List item 3')).toBeInTheDocument();
    expect(screen.getByText('This is a blockquote')).toBeInTheDocument();
    expect(screen.getByText('Link text')).toBeInTheDocument();
    
    // Check that code block is rendered
    expect(screen.getByText("console.log('Hello World');")).toBeInTheDocument();
  });

  it('renders inline code correctly', () => {
    const answerWithInlineCode = 'Use the `npm install` command to install packages.';
    render(<AICard {...defaultProps} answer={answerWithInlineCode} />);
    
    expect(screen.getByText('npm install')).toBeInTheDocument();
  });

  it('renders tables correctly', () => {
    const tableAnswer = `| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |`;

    render(<AICard {...defaultProps} answer={tableAnswer} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('NYC')).toBeInTheDocument();
  });
});
