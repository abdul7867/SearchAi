import React from 'react';
import { ExternalLink, Globe, Calendar, FileText } from 'lucide-react';

const SourceCard = ({ 
  source, 
  className = '',
  showDomain = true,
  showDate = true,
  showSnippet = true,
  compact = false
}) => {
  const {
    title,
    url,
    snippet,
    domain,
    date,
    sourceType = 'web'
  } = source;

  const getDomainFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return domain || 'unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const getSourceTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'news':
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getSourceTypeColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'news':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-accent text-muted-foreground border-border';
    }
  };

  return (
    <div className={`group border border-border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-all duration-200 hover:border-primary/30 ${className} ${
      compact ? 'p-3' : 'p-4'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          <h4 className={`font-medium text-foreground line-clamp-2 leading-tight ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {title}
          </h4>
          
          {/* Snippet */}
          {showSnippet && snippet && (
            <p className={`text-muted-foreground line-clamp-2 leading-relaxed ${
              compact ? 'text-xs' : 'text-sm'
            }`}>
              {snippet}
            </p>
          )}
          
          {/* Metadata row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Domain */}
            {showDomain && (
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span className={`text-xs font-medium px-2 py-1 rounded-md border ${
                  getSourceTypeColor(sourceType)
                }`}>
                  {getDomainFromUrl(url)}
                </span>
              </div>
            )}
            
            {/* Date */}
            {showDate && date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(date)}
                </span>
              </div>
            )}
            
            {/* Source type indicator */}
            <div className="flex items-center gap-1.5">
              {getSourceTypeIcon(sourceType)}
              <span className="text-xs text-muted-foreground capitalize">
                {sourceType}
              </span>
            </div>
          </div>
        </div>
        
        {/* External link button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-shrink-0 p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-all duration-200 group-hover:scale-105 ${
            compact ? 'p-1.5' : 'p-2'
          }`}
          title="Open source in new tab"
          aria-label={`Open ${title} in new tab`}
        >
          <ExternalLink className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        </a>
      </div>
    </div>
  );
};

export default SourceCard;
