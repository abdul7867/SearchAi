import React from 'react';
import { Bookmark, Clock, FileText, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AICard = ({ 
  answer, 
  metadata, 
  focus, 
  isBookmarked = false, 
  onBookmark, 
  searchId,
  className = '' 
}) => {
  const handleBookmark = () => {
    if (onBookmark && searchId) {
      onBookmark(searchId);
    }
  };

  return (
    <div id="ai-answer" className={`bg-card border border-border rounded-xl p-4 sm:p-6 ${className}`}>
      {/* Header with title and bookmark button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" data-testid="bot-icon" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">AI Answer</h2>
        </div>
        
        {onBookmark && (
          <button 
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isBookmarked
                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>
      
      {/* AI Answer content */}
      <div className="prose prose-lg max-w-none text-foreground mb-6 markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Add any custom components here if needed
          }}
        >
          {answer}
        </ReactMarkdown>
      </div>
      
      {/* Metadata section */}
      <div className="pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>
              {metadata?.processingTime ? `${metadata.processingTime}ms` : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>
              {metadata?.searchResultsCount || metadata?.sourcesCount || 0} sources
            </span>
          </div>
          
          {focus && (
            <div className="flex items-center space-x-2">
              <span className="bg-accent px-2 py-1 rounded-md text-xs font-medium">
                {focus}
              </span>
            </div>
          )}
          
          {metadata?.timestamp && (
            <div className="flex items-center space-x-2">
              <span>
                {new Date(metadata.timestamp).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICard;
