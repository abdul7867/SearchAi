import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SourceCard from './SourceCard';

describe('SourceCard', () => {
  const defaultSource = {
    title: 'Test Source Title',
    url: 'https://example.com/test',
    snippet: 'This is a test snippet for the source card component.',
    domain: 'example.com',
    date: '2024-01-15T10:00:00.000Z',
    sourceType: 'web'
  };

  it('renders the source title correctly', () => {
    render(<SourceCard source={defaultSource} />);
    expect(screen.getByText('Test Source Title')).toBeInTheDocument();
  });

  it('renders the source snippet when provided', () => {
    render(<SourceCard source={defaultSource} />);
    expect(screen.getByText('This is a test snippet for the source card component.')).toBeInTheDocument();
  });

  it('renders the domain badge when showDomain is true', () => {
    render(<SourceCard source={defaultSource} showDomain={true} />);
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('does not render domain when showDomain is false', () => {
    render(<SourceCard source={defaultSource} showDomain={false} />);
    expect(screen.queryByText('example.com')).not.toBeInTheDocument();
  });

  it('renders the date when showDate is true and date is provided', () => {
    render(<SourceCard source={defaultSource} showDate={true} />);
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
  });

  it('does not render date when showDate is false', () => {
    render(<SourceCard source={defaultSource} showDate={false} />);
    expect(screen.queryByText(/Jan 15, 2024/)).not.toBeInTheDocument();
  });

  it('renders snippet when showSnippet is true and snippet is provided', () => {
    render(<SourceCard source={defaultSource} showSnippet={true} />);
    expect(screen.getByText('This is a test snippet for the source card component.')).toBeInTheDocument();
  });

  it('does not render snippet when showSnippet is false', () => {
    render(<SourceCard source={defaultSource} showSnippet={false} />);
    expect(screen.queryByText('This is a test snippet for the source card component.')).not.toBeInTheDocument();
  });

  it('renders external link with correct URL', () => {
    render(<SourceCard source={defaultSource} />);
    const link = screen.getByRole('link', { name: /open test source title in new tab/i });
    expect(link).toHaveAttribute('href', 'https://example.com/test');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies compact layout when compact prop is true', () => {
    render(<SourceCard source={defaultSource} compact={true} />);
    const card = screen.getByText('Test Source Title').closest('div');
    expect(card).toHaveClass('p-3');
  });

  it('applies default layout when compact prop is false', () => {
    render(<SourceCard source={defaultSource} compact={false} />);
    const card = screen.getByText('Test Source Title').closest('div');
    expect(card).toHaveClass('p-4');
  });

  it('applies custom className when provided', () => {
    render(<SourceCard source={defaultSource} className="custom-class" />);
    const card = screen.getByText('Test Source Title').closest('div');
    expect(card).toHaveClass('custom-class');
  });

  it('handles missing domain gracefully', () => {
    const sourceWithoutDomain = { ...defaultSource, domain: undefined };
    render(<SourceCard source={sourceWithoutDomain} />);
    expect(screen.getByText('example.com')).toBeInTheDocument(); // Should extract from URL
  });

  it('handles missing date gracefully', () => {
    const sourceWithoutDate = { ...defaultSource, date: undefined };
    render(<SourceCard source={sourceWithoutDate} showDate={true} />);
    expect(screen.queryByText(/Jan 15, 2024/)).not.toBeInTheDocument();
  });

  it('handles missing snippet gracefully', () => {
    const sourceWithoutSnippet = { ...defaultSource, snippet: undefined };
    render(<SourceCard source={sourceWithoutSnippet} showSnippet={true} />);
    expect(screen.queryByText('This is a test snippet for the source card component.')).not.toBeInTheDocument();
  });

  it('displays correct source type for web sources', () => {
    render(<SourceCard source={defaultSource} />);
    expect(screen.getByText('web')).toBeInTheDocument();
  });

  it('displays correct source type for PDF sources', () => {
    const pdfSource = { ...defaultSource, sourceType: 'pdf' };
    render(<SourceCard source={pdfSource} />);
    expect(screen.getByText('pdf')).toBeInTheDocument();
  });

  it('displays correct source type for news sources', () => {
    const newsSource = { ...defaultSource, sourceType: 'news' };
    render(<SourceCard source={newsSource} />);
    expect(screen.getByText('news')).toBeInTheDocument();
  });

  it('extracts domain from URL when domain is not provided', () => {
    const sourceWithUrlOnly = { ...defaultSource, domain: undefined };
    render(<SourceCard source={sourceWithUrlOnly} />);
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('handles invalid URLs gracefully', () => {
    const sourceWithInvalidUrl = { ...defaultSource, url: 'invalid-url', domain: undefined };
    render(<SourceCard source={sourceWithInvalidUrl} />);
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('handles invalid dates gracefully', () => {
    const sourceWithInvalidDate = { ...defaultSource, date: 'invalid-date' };
    render(<SourceCard source={sourceWithInvalidDate} showDate={true} />);
    expect(screen.queryByText(/Jan 15, 2024/)).not.toBeInTheDocument();
  });

  it('renders with long title and snippet without breaking layout', () => {
    const longSource = {
      ...defaultSource,
      title: 'A'.repeat(200),
      snippet: 'B'.repeat(500)
    };
    render(<SourceCard source={longSource} />);
    expect(screen.getByText(longSource.title)).toBeInTheDocument();
    expect(screen.getByText(longSource.snippet)).toBeInTheDocument();
  });

  it('applies hover effects and transitions', () => {
    render(<SourceCard source={defaultSource} />);
    const card = screen.getByText('Test Source Title').closest('div');
    expect(card).toHaveClass('hover:bg-accent/50', 'transition-all', 'duration-200');
  });

  it('shows source type icon correctly', () => {
    render(<SourceCard source={defaultSource} />);
    // The icon should be present (we can't easily test the specific icon type without more complex queries)
    expect(screen.getByText('web')).toBeInTheDocument();
  });
});
