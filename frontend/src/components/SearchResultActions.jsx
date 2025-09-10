import { useState } from 'react';
import { Download, Share2, Bookmark, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const SearchResultActions = ({ onNewSearch, onToggleActions, resultsCount }) => {
  const [copied, setCopied] = useState(false);
  const { success, error: showError } = useToast();

  const copyToClipboard = async () => {
    try {
      const content = `Search Results Summary\n\nFound ${resultsCount} sources for your query.\n\nUse the search interface to view detailed results and AI-generated answers.`;
      
      await navigator.clipboard.writeText(content);
      setCopied(true);
      success('Copied!', 'Search summary copied to clipboard');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showError('Copy Failed', 'Failed to copy to clipboard');
    }
  };

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Search Results',
          text: `Found ${resultsCount} sources for your search query.`,
          url: window.location.href
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          showError('Share Failed', 'Failed to share search result');
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">
            Search Actions
          </h3>
          <span className="text-sm text-muted-foreground">
            {resultsCount} sources found
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            title="Copy search summary to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {copied ? 'Copied!' : 'Copy Summary'}
            </span>
          </button>
          
          <button
            onClick={shareResult}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            title="Share search results"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <button
            onClick={onToggleActions}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            title="Hide search actions"
          >
            <EyeOff className="h-4 w-4" />
            <span className="hidden sm:inline">Hide</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button
          onClick={onNewSearch}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Start New Search
        </button>
      </div>
    </div>
  );
};

export default SearchResultActions;
