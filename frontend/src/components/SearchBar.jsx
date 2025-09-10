import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Filter, ChevronDown, X, Sparkles } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading, selectedFocus, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    dateRange: 'any',
    language: 'en',
    region: 'us',
    safeSearch: 'moderate'
  });
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // Update local query when initialQuery changes (e.g., when navigating from history)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Common search suggestions
  const commonQueries = [
    'What is artificial intelligence?',
    'How does machine learning work?',
    'Latest developments in quantum computing',
    'Climate change solutions 2024',
    'Best practices for web development',
    'Understanding blockchain technology',
    'Future of renewable energy',
    'Machine learning applications in healthcare'
  ];

  // Generate suggestions based on input
  useEffect(() => {
    if (query.trim().length > 2) {
      const filtered = commonQueries.filter(q => 
        q.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
      setFocusedSuggestion(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setFocusedSuggestion(-1);
    }
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setFocusedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedSuggestion >= 0) {
          handleSuggestionClick(suggestions[focusedSuggestion]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    if (query.trim() && !isLoading) {
      // Prevent rapid successive submissions
      if (searchRef.current) {
        searchRef.current.style.pointerEvents = 'none';
        setTimeout(() => {
          if (searchRef.current) {
            searchRef.current.style.pointerEvents = 'auto';
          }
        }, 1000); // Re-enable after 1 second
      }
      
      onSearch(query.trim(), selectedFocus, advancedOptions);
      setShowSuggestions(false);
      setFocusedSuggestion(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setFocusedSuggestion(-1);
    onSearch(suggestion, selectedFocus, advancedOptions);
  };

  const handleAdvancedOptionChange = (key, value) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAdvancedOptions = () => {
    setAdvancedOptions({
      dateRange: 'any',
      language: 'en',
      region: 'us',
      safeSearch: 'moderate'
    });
  };

  const clearQuery = () => {
    setQuery('');
    setShowSuggestions(false);
    setFocusedSuggestion(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-200" />
          
          {/* Main Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... What is artificial intelligence? How does machine learning work?"
            className={`w-full pl-12 pr-32 py-4 text-lg bg-card border-2 rounded-xl transition-all duration-300 ease-out placeholder:text-muted-foreground focus:outline-none ${
              isFocused 
                ? 'border-primary bg-background scale-[1.02] shadow-lg shadow-primary/20' 
                : 'border-border hover:border-border/60'
            }`}
            disabled={isLoading}
            autoComplete="off"
          />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-28 top-1/2 transform -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 hover:scale-110"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`absolute right-24 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
              showAdvanced
                ? 'text-primary bg-primary/10 border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105'
            }`}
            title="Advanced search options"
          >
            <Filter className="h-5 w-5" />
          </button>
          
          {/* Search Button */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
        
        {/* Enhanced Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-3 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50" ref={suggestionsRef}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setFocusedSuggestion(index)}
                className={`w-full text-left px-4 py-3 transition-all duration-200 border-l-4 ${
                  focusedSuggestion === index
                    ? 'bg-primary/10 border-l-primary scale-[1.02]'
                    : 'border-l-transparent hover:bg-accent/50 hover:scale-[1.02]'
                } border-b border-border last:border-b-0`}
              >
                <div className="flex items-center space-x-3">
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Advanced Search Options */}
        {showAdvanced && (
          <div className="mt-4 p-6 bg-card border border-border rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Advanced Search Options</h3>
              <button
                type="button"
                onClick={clearAdvancedOptions}
                className="text-sm text-muted-foreground hover:text-foreground underline transition-colors duration-200"
              >
                Reset to Default
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Date Range
                </label>
                <select
                  value={advancedOptions.dateRange}
                  onChange={(e) => handleAdvancedOptionChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                >
                  <option value="any">Any time</option>
                  <option value="day">Past 24 hours</option>
                  <option value="week">Past week</option>
                  <option value="month">Past month</option>
                  <option value="year">Past year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Language
                </label>
                <select
                  value={advancedOptions.language}
                  onChange={(e) => handleAdvancedOptionChange('language', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ru">Russian</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Region
                </label>
                <select
                  value={advancedOptions.region}
                  onChange={(e) => handleAdvancedOptionChange('region', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                >
                  <option value="us">United States</option>
                  <option value="gb">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="jp">Japan</option>
                  <option value="in">India</option>
                  <option value="br">Brazil</option>
                  <option value="mx">Mexico</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Safe Search
                </label>
                <select
                  value={advancedOptions.safeSearch}
                  onChange={(e) => handleAdvancedOptionChange('safeSearch', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                >
                  <option value="off">Off</option>
                  <option value="moderate">Moderate</option>
                  <option value="strict">Strict</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Focus Mode Indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 border border-accent/30 rounded-full text-sm font-medium text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Focus: {selectedFocus.charAt(0).toUpperCase() + selectedFocus.slice(1)}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
