import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SegmentedControl from './SegmentedControl';

describe('SegmentedControl', () => {
  const defaultOptions = [
    { value: 'general', label: 'General', description: 'General search results' },
    { value: 'academic', label: 'Academic', description: 'Academic and scholarly sources' },
    { value: 'news', label: 'News', description: 'Current events and news sources' },
    { value: 'technical', label: 'Technical', description: 'Technical and developer resources' }
  ];

  const mockOnChange = vi.fn();

  it('renders all options correctly', () => {
    render(
      <SegmentedControl
        options={defaultOptions}
        value="general"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Academic')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Technical')).toBeInTheDocument();
  });

  it('shows the selected option with correct styling', () => {
    render(
      <SegmentedControl
        options={defaultOptions}
        value="academic"
        onChange={mockOnChange}
      />
    );

    const academicButton = screen.getByText('Academic').closest('button');
    expect(academicButton).toHaveClass('bg-card', 'border', 'shadow-sm');
  });

  it('calls onChange when an option is clicked', () => {
    render(
      <SegmentedControl
        options={defaultOptions}
        value="general"
        onChange={mockOnChange}
      />
    );

    const academicButton = screen.getByText('Academic');
    fireEvent.click(academicButton);

    expect(mockOnChange).toHaveBeenCalledWith('academic');
  });

  it('does not call onChange when the same option is clicked', () => {
    render(
      <SegmentedControl
        options={defaultOptions}
        value="general"
        onChange={mockOnChange}
      />
    );

    const generalButton = screen.getByText('General');
    fireEvent.click(generalButton);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <SegmentedControl
        options={defaultOptions}
        value="general"
        onChange={mockOnChange}
        size="sm"
      />
    );

    const container = screen.getByText('General').closest('div');
    expect(container).toHaveClass('p-1', 'text-sm');

    rerender(
      <SegmentedControl
        options={defaultOptions}
        value="general"
        onChange={mockOnChange}
        size="lg"
      />
    );

    const largeContainer = screen.getByText('General').closest('div');
    expect(largeContainer).toHaveClass('p-2', 'text-lg');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(
      <SegmentedControl
        options={defaultOptions}
        value="general"
        onChange={mockOnChange}
        variant="elevated"
      />
    );

    const container = screen.getByText('General').closest('div');
    expect(container).toHaveClass('bg-card', 'border', 'shadow-sm');

    rerender(
      <SegmentedControl
        options={defaultOptions}
        value="general"
        onChange={mockOnChange}
        variant="minimal"
      />
    );

    const minimalContainer = screen.getByText('General').closest('div');
    expect(minimalContainer).toHaveClass('bg-transparent', 'border-b', 'border-border');
  });

  it('applies custom className', () => {
    render(
      <SegmentedControl
        options={defaultOptions}
        value="general"
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    const container = screen.getByText('General').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('renders without onChange prop', () => {
    render(
      <SegmentedControl
        options={defaultOptions}
        value="general"
      />
    );

    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('handles empty options array', () => {
    render(
      <SegmentedControl
        options={[]}
        value=""
        onChange={mockOnChange}
      />
    );

    const container = screen.getByRole('group') || screen.getByText('').closest('div');
    expect(container).toBeInTheDocument();
  });

  it('applies focus mode colors correctly', () => {
    render(
      <SegmentedControl
        options={defaultOptions}
        value="academic"
        onChange={mockOnChange}
      />
    );

    const academicButton = screen.getByText('Academic').closest('button');
    expect(academicButton).toHaveClass('text-blue-600', 'bg-blue-50', 'border-blue-200');
  });

  it('shows selection indicator for selected option', () => {
    render(
      <SegmentedControl
        options={defaultOptions}
        value="news"
        onChange={mockOnChange}
      />
    );

    const newsButton = screen.getByText('News').closest('button');
    const indicator = newsButton.querySelector('div[class*="bg-primary"]');
    expect(indicator).toBeInTheDocument();
  });
});
