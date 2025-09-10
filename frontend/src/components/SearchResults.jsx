import { useState } from 'react';
import { ExternalLink, Clock, FileText, Bookmark, SortAsc, SortDesc, Filter } from 'lucide-react';
import SearchResultActions from './SearchResultActions';
import LoadingSkeleton from './LoadingSkeleton';
import AICard from './AICard';
import SourceCard from './SourceCard';

const SearchResults = ({ results, isLoading, onBookmark, onNewSearch }) => {
  const [showActions, setShowActions] = useState(true);
  const [sortOrder, setSortOrder] = useState('relevance');

  // Enhanced safety check: ensure results is an array and handle all edge cases
  if (!results || !Array.isArray(results)) {
    console.warn('SearchResults: results is not an array:', results, 'Type:', typeof results);
    
    // If results is null/undefined, show a loading state instead of error
    if (results === null || results === undefined) {
      return (
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">
            Ready to search. Enter your query above to get started.
          </div>
        </div>
      );
    }
    
    // If results exists but is not an array, show error with more details
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">
          Invalid results format. Received: {typeof results} - {JSON.stringify(results).substring(0, 100)}
        </div>
        <button
          onClick={onNewSearch}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          New Search
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* AI Answer Skeleton */}
        <LoadingSkeleton type="ai-answer-card" />
        
        {/* Search Result Actions Skeleton */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="flex space-x-2">
                <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
                <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sources Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
        
        {/* Source Cards Skeleton */}
        <div className="space-y-4">
          <LoadingSkeleton type="source-card" />
          <LoadingSkeleton type="source-card" />
          <LoadingSkeleton type="source-card" />
        </div>
        
        {/* Bottom Actions Skeleton */}
        <div className="flex justify-center space-x-4">
          <div className="h-12 w-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-12 w-32 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">
          No search results found. Try adjusting your search terms.
        </div>
        <button
          onClick={onNewSearch}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          New Search
        </button>
      </div>
    );
  }

  const handleSort = (order) => {
    setSortOrder(order);
    // TODO: Implement actual sorting logic
  };

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  // Extract AI answer and sources from results
  const aiAnswer = results.find(result => result.type === 'ai-answer');
  const sources = results.filter(result => result.type === 'source');

  return (
    <div id="search-results" className="max-w-4xl mx-auto space-y-6">
      {/* AI Answer Card */}
      {aiAnswer && (
        <AICard
          answer={aiAnswer.content}
          metadata={{
            processingTime: aiAnswer.processingTime,
            searchResultsCount: sources.length,
            timestamp: aiAnswer.timestamp,
            focus: aiAnswer.focus || 'general'
          }}
          focus={aiAnswer.focus || 'general'}
          isBookmarked={aiAnswer.isBookmarked}
          onBookmark={onBookmark}
          searchId={aiAnswer.id}
        />
      )}

      {/* Search Result Actions */}
      {showActions && (
        <SearchResultActions
          onNewSearch={onNewSearch}
          onToggleActions={toggleActions}
          resultsCount={sources.length}
        />
      )}

      {/* Sources Section */}
      {sources.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Sources ({sources.length})
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={sortOrder}
                onChange={(e) => handleSort(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() => handleSort(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Toggle sort order"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Source Cards */}
          <div className="space-y-4">
            {sources.map((source, index) => (
              <SourceCard
                key={source.id || index}
                source={{
                  title: source.title,
                  url: source.url,
                  snippet: source.snippet || source.description,
                  domain: source.domain,
                  date: source.date || source.publishedAt,
                  sourceType: source.sourceType || 'web'
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom Actions */}
      <div className="flex justify-center space-x-4 pt-6">
        <button
          onClick={onNewSearch}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          New Search
        </button>
        {!showActions && (
          <button
            onClick={toggleActions}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Show Actions
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
