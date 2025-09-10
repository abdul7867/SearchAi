import { useState, useEffect } from 'react';
import { Search, BookOpen, Newspaper, Code, Globe, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import SegmentedControl from '../components/SegmentedControl';
import searchStore from '../stores/searchStore';
import authStore from '../stores/authStore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../contexts/ToastContext';

const Home = () => {
  const [selectedFocus, setSelectedFocus] = useState('general');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get state from stores - FIXED: Use proper Zustand hook pattern
  const query = searchStore((state) => state.query);
  const results = searchStore((state) => state.results);
  const loading = searchStore((state) => state.loading);
  const error = searchStore((state) => state.error);
  const performSearch = searchStore((state) => state.performSearch);
  const clearResults = searchStore((state) => state.clearResults);
  const clearError = searchStore((state) => state.clearError);
  const setQuery = searchStore((state) => state.setQuery);
  
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const { showToast } = useToast();

  // Safeguard: ensure results is always an array
  const safeResults = (() => {
    console.log('Debug - results:', results, 'type:', typeof results, 'isArray:', Array.isArray(results));
    if (Array.isArray(results)) {
      return results;
    }
    if (results === null || results === undefined) {
      return [];
    }
    // If results is somehow not an array, convert it or return empty array
    console.warn('Results is not an array:', results, typeof results);
    return Array.isArray(results) ? results : [];
  })();

  // Focus mode options for the segmented control
  const focusModeOptions = [
    { value: 'general', label: 'General', description: 'General search results' },
    { value: 'academic', label: 'Academic', description: 'Academic and scholarly sources' },
    { value: 'news', label: 'News', description: 'Current events and news sources' },
    { value: 'technical', label: 'Technical', description: 'Technical and developer resources' }
  ];

  // Handle URL parameters for search
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlFocus = searchParams.get('focus') || 'general';
    
    if (urlQuery && isAuthenticated) {
      // Set the focus mode from URL
      setSelectedFocus(urlFocus);
      
      // Update the search store query
      setQuery(urlQuery);
      
      // Perform the search automatically
      handleSearch(urlQuery, urlFocus);
    }
  }, [searchParams, isAuthenticated, setQuery]);

  const handleSearch = async (searchQuery, focus, advancedOptions) => {
    if (!searchQuery.trim()) return;
    
    if (!isAuthenticated) {
      showToast('Please log in to start searching', 'info');
      return;
    }

    try {
      await performSearch(searchQuery, focus, advancedOptions);
      
      // Update URL with search parameters
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('q', searchQuery);
      newSearchParams.set('focus', focus);
      navigate(`/search?${newSearchParams.toString()}`, { replace: true });
    } catch (err) {
      showToast('Search failed. Please try again.', 'error');
    }
  };

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (results && results.length > 0 && !loading) {
      setTimeout(() => {
        // Try to find the AI answer section first (most important)
        const aiAnswerElement = document.getElementById('ai-answer');
        if (aiAnswerElement) {
          // Scroll to the AI answer with smooth behavior
          aiAnswerElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
          
          // Additional scroll to ensure we're at the top of AI answer
          window.scrollTo({
            top: aiAnswerElement.offsetTop - 100, // Offset by 100px for better visibility
            behavior: 'smooth'
          });
        } else {
          // Fallback to search results container
          const resultsElement = document.getElementById('search-results');
          if (resultsElement) {
            resultsElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
            
            window.scrollTo({
              top: resultsElement.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        }
      }, 300); // Delay to ensure results are fully rendered
    }
  }, [results, loading]);

  const handleFocusChange = (newFocus) => {
    setSelectedFocus(newFocus);
    
    // Update URL with new focus if there's an active search
    if (query) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('q', query);
      newSearchParams.set('focus', newFocus);
      navigate(`/search?${newSearchParams.toString()}`, { replace: true });
    }
    
    // Optionally show a toast to confirm focus mode change
    showToast(`Focus mode changed to ${newFocus.charAt(0).toUpperCase() + newFocus.slice(1)}`, 'info');
  };

  const handleClearError = () => {
    clearError();
  };

  const handleNewSearch = () => {
    clearResults();
    // Clear URL parameters when starting a new search
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Hero Content */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Search Engine
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Discover Answers with
              <span className="block bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                Conversational AI
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get instant, intelligent responses to your questions with AI-generated summaries and verified sources from across the web.
            </p>
          </div>

          {/* Enhanced Search Interface with Focus Mode Selection */}
          <div className="mb-12 max-w-4xl mx-auto">
            {/* Focus Mode Selection */}
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Choose Your Search Focus
              </h3>
              <SegmentedControl
                options={focusModeOptions}
                value={selectedFocus}
                onChange={handleFocusChange}
                size="md"
                variant="default"
                className="mx-auto"
              />
            </div>
            
            {/* Search Bar */}
            <SearchBar 
              onSearch={handleSearch}
              isLoading={loading}
              selectedFocus={selectedFocus}
              initialQuery={query}
            />
            
            {/* Authentication Required Message */}
            {!isAuthenticated && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Please{' '}
                  <a href="/login" className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium">
                    log in
                  </a>{' '}
                  to start searching
                </p>
              </div>
            )}
            
            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-destructive text-sm">{error}</p>
                <button 
                  onClick={handleClearError}
                  className="mt-2 text-destructive/80 hover:text-destructive text-sm underline underline-offset-2"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Why Choose Our AI Search?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Search,
                  title: 'Instant Answers',
                  description: 'Get AI-generated summaries in seconds, not hours of research.',
                  gradient: 'from-blue-500 to-blue-600'
                },
                {
                  icon: BookOpen,
                  title: 'Verified Sources',
                  description: 'Every answer is backed by credible, up-to-date sources.',
                  gradient: 'from-green-500 to-green-600'
                },
                {
                  icon: Zap,
                  title: 'Smart Focus',
                  description: 'Choose your search focus for more relevant results.',
                  gradient: 'from-purple-500 to-purple-600'
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group p-6 rounded-2xl border border-border hover:border-primary/40 hover:bg-accent/30 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 w-fit mx-auto mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-foreground text-lg mb-2 text-center">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Start Searching Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {safeResults && safeResults.length > 0 && (
        <div className="pb-16">
          <SearchResults 
            results={safeResults}
            isLoading={loading}
            onBookmark={(searchId) => {
              // TODO: Implement bookmark functionality
              showToast('Bookmark feature coming soon!', 'info');
            }}
            onNewSearch={handleNewSearch}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
