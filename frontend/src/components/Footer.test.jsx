import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Footer from './Footer';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props}>{children}</a>
    ),
  };
});

describe('Footer Component', () => {
  it('renders brand logo and name', () => {
    render(<Footer />);
    expect(screen.getByText('AI Search')).toBeInTheDocument();
  });

  it('renders brand description', () => {
    render(<Footer />);
    expect(screen.getByText(/Advanced AI-powered search engine/)).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search History')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
  });

  it('renders connect section', () => {
    render(<Footer />);
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Need help? Contact our support team.')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
  });

  it('renders copyright notice with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    expect(screen.getByText(`© ${currentYear} AI Search. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Footer className="custom-footer" />);
    const footerElement = screen.getByText('AI Search').closest('footer');
    expect(footerElement).toHaveClass('custom-footer');
  });

  it('forwards additional props', () => {
    render(<Footer data-testid="footer-test" />);
    expect(screen.getByTestId('footer-test')).toBeInTheDocument();
  });

  it('renders all navigation links with correct hrefs', () => {
    render(<Footer />);
    
    const homeLink = screen.getByText('Home');
    const historyLink = screen.getByText('Search History');
    const collectionsLink = screen.getByText('Collections');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(historyLink).toHaveAttribute('href', '/history');
    expect(collectionsLink).toHaveAttribute('href', '/collections');
  });

  it('renders external social links with correct attributes', () => {
    render(<Footer />);
    
    const githubLink = screen.getByLabelText('GitHub');
    const twitterLink = screen.getByLabelText('Twitter');
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders legal links with correct hrefs', () => {
    render(<Footer />);
    
    const privacyLink = screen.getByText('Privacy Policy');
    const termsLink = screen.getByText('Terms of Service');
    
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  it('has proper semantic structure', () => {
    render(<Footer />);
    
    // Check for proper heading hierarchy
    const quickLinksHeading = screen.getByText('Quick Links');
    const connectHeading = screen.getByText('Connect');
    
    expect(quickLinksHeading.tagName).toBe('H3');
    expect(connectHeading.tagName).toBe('H3');
    
    // Check for proper list structure
    const quickLinksList = quickLinksHeading.nextElementSibling;
    expect(quickLinksList.tagName).toBe('UL');
  });
});
