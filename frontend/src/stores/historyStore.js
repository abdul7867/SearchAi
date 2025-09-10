import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const historyStore = create((set, get) => ({
  // State
  searches: [],
  bookmarkedSearches: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  bookmarkedPagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch search history
  fetchHistory: async (page = 1, limit = 20) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ 
        error: 'Authentication required. Please log in to view history.',
        loading: false 
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/history?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        set({ 
          searches: response.data.data.searches,
          pagination: response.data.data.pagination,
          loading: false,
          error: null
        });
      } else {
        set({ 
          error: response.data.error?.message || 'Failed to fetch history',
          loading: false 
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('History fetch error:', error);
      }
      
      let errorMessage = 'An error occurred while fetching history';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          localStorage.removeItem('token');
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  // Fetch bookmarked searches
  fetchBookmarked: async (page = 1, limit = 20) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ 
        error: 'Authentication required. Please log in to view bookmarks.',
        loading: false 
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/history/bookmarked?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        set({ 
          bookmarkedSearches: response.data.data.searches,
          bookmarkedPagination: response.data.data.pagination,
          loading: false,
          error: null
        });
      } else {
        set({ 
          error: response.data.error?.message || 'Failed to fetch bookmarks',
          loading: false 
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Bookmarked fetch error:', error);
      }
      
      let errorMessage = 'An error occurred while fetching bookmarks';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          localStorage.removeItem('token');
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  // Clear search history
  clearHistory: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ 
        error: 'Authentication required. Please log in to clear history.',
        loading: false 
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/history`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        set({ 
          searches: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 },
          loading: false,
          error: null
        });
        return { success: true };
      } else {
        set({ 
          error: response.data.error?.message || 'Failed to clear history',
          loading: false 
        });
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Clear history error:', error);
      }
      
      let errorMessage = 'An error occurred while clearing history';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          localStorage.removeItem('token');
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ 
        error: errorMessage,
        loading: false 
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Toggle bookmark for a search
  toggleBookmark: async (searchId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ 
        error: 'Authentication required. Please log in to bookmark searches.',
        loading: false 
      });
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/search/${searchId}/bookmark`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update the search in both arrays
        const updatedSearches = get().searches.map(search => 
          search.id === searchId 
            ? { ...search, isBookmarked: response.data.data.isBookmarked }
            : search
        );
        
        const updatedBookmarked = get().bookmarkedSearches.map(search => 
          search.id === searchId 
            ? { ...search, isBookmarked: response.data.data.isBookmarked }
            : search
        );

        set({ 
          searches: updatedSearches,
          bookmarkedSearches: updatedBookmarked
        });

        return { success: true };
      } else {
        set({ 
          error: response.data.error?.message || 'Failed to toggle bookmark',
          loading: false 
        });
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Toggle bookmark error:', error);
      }
      
      let errorMessage = 'An error occurred while toggling bookmark';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          localStorage.removeItem('token');
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ 
        error: errorMessage,
        loading: false 
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Reset store
  reset: () => set({
    searches: [],
    bookmarkedSearches: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    bookmarkedPagination: { page: 1, limit: 20, total: 0, pages: 0 }
  })
}));

export default historyStore;
