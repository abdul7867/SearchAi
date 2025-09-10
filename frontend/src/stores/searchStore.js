import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const searchStore = create((set, get) => ({
  // State
  query: '',
  results: null,
  loading: false,
  error: null,
  focus: 'general',
  conversationId: null,
  currentRequestController: null, // Add AbortController for request cancellation

  // Actions
  setQuery: (query) => {
    set({ query });
  },
  setFocus: (focus) => {
    set({ focus });
  },
  setConversationId: (conversationId) => {
    set({ conversationId });
  },
  
  clearResults: () => {
    set({ results: null, error: null });
  },
  clearError: () => {
    set({ error: null });
  },

  // Search action with deduplication
  performSearch: async (query, focus = 'general', advancedOptions = {}, conversationId = null) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ 
        error: 'Authentication required. Please log in to search.',
        loading: false 
      });
      return;
    }

    // Cancel any existing request
    const currentState = get();
    if (currentState.currentRequestController) {
      currentState.currentRequestController.abort();
      console.log('🚫 Cancelled previous search request');
    }

    // Create new AbortController for this request
    const controller = new AbortController();

    set({ 
      loading: true, 
      error: null,
      query,
      focus,
      conversationId,
      currentRequestController: controller
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/search`,
        { query, focus, conversationId, ...advancedOptions },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal // Add signal for request cancellation
        }
      );

      // Check if this request was cancelled
      if (controller.signal.aborted) {
        console.log('🚫 Request was cancelled');
        return;
      }

      if (response.data.success) {
        // Transform the backend response into the format expected by SearchResults component
        const backendResults = response.data.data.search;
        
        const transformedResults = [];
        
        // Add AI answer as first item
        if (backendResults.answer) {
          transformedResults.push({
            id: backendResults.id,
            type: 'ai-answer',
            content: backendResults.answer,
            processingTime: backendResults.metadata?.processingTime || 0,
            timestamp: backendResults.createdAt,
            focus: backendResults.focus || 'general',
            isBookmarked: backendResults.isBookmarked || false
          });
        }
        
        // Add sources
        if (backendResults.sources && Array.isArray(backendResults.sources)) {
          backendResults.sources.forEach(source => {
            transformedResults.push({
              id: source.id || Math.random().toString(36).substr(2, 9),
              type: 'source',
              title: source.title,
              url: source.url,
              snippet: source.snippet,
              domain: source.domain,
              date: source.date || source.publishedAt,
              sourceType: source.type || 'web'
            });
          });
        }
        
        // Ensure transformedResults is always an array
        if (!Array.isArray(transformedResults)) {
          set({ 
            results: [],
            loading: false,
            error: 'Invalid results format received from server'
          });
          return;
        }
        
        // If no results were found, set empty array
        if (transformedResults.length === 0) {
          // No results found
        }
        
        set({ 
          results: transformedResults,
          loading: false,
          error: null,
          currentRequestController: null // Clear the controller on success
        });
      } else {
        set({ 
          results: [], // ✅ FIXED: Ensure results is always an array, even on error
          error: response.data.error?.message || 'Search failed',
          loading: false,
          currentRequestController: null
        });
      }
    } catch (error) {
      // Check if the error is due to request cancellation
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('🚫 Search request was cancelled');
        return; // Don't update state for cancelled requests
      }

      if (import.meta.env.DEV) {
        console.error('Search error:', error);
      }
      
      let errorMessage = 'An error occurred during search';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          // Clear invalid token
          localStorage.removeItem('token');
        } else if (error.response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment before searching again.';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ 
        results: [], // ✅ FIXED: Ensure results is always an array, even on error
        error: errorMessage,
        loading: false,
        currentRequestController: null
      });
    }
  },

  // Reset store
  reset: () => {
    const currentState = get();
    // Cancel any pending request
    if (currentState.currentRequestController) {
      currentState.currentRequestController.abort();
    }
    
    set({
      query: '',
      results: null,
      loading: false,
      error: null,
      focus: 'general',
      conversationId: null,
      currentRequestController: null
    });
  }
}));

export default searchStore;
