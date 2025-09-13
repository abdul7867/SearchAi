import { create } from 'zustand';
import axios from 'axios';
import uiStore from './uiStore';
import authStore from './authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const historyStore = create((set, get) => ({
  // State
  searches: [],
  bookmarkedSearches: [],
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

  // Fetch search history
  fetchHistory: async (page = 1, limit = 20) => {
    const { setLoading, setError, clearError } = uiStore.getState();
    const { isAuthenticated } = authStore.getState();

    if (!isAuthenticated) {
      setError('Authentication required. Please log in to view history.');
      return;
    }

    setLoading(true);
    clearError();

    try {
      const response = await axios.get(
        `${API_BASE_URL}/history?page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        set((state) => {
          const newSearches = response.data.data.searches;
          const existingSearches = page === 1 ? [] : state.searches;
          
          // Filter out duplicates
          const uniqueSearches = [...existingSearches];
          const existingIds = new Set(existingSearches.map(s => s.id));
          
          newSearches.forEach(search => {
            if (!existingIds.has(search.id)) {
              uniqueSearches.push(search);
            }
          });

          return {
            searches: uniqueSearches,
            pagination: response.data.data.pagination,
          };
        });
      } else {
        setError(response.data.error?.message || 'Failed to fetch history');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('History fetch error:', error);
      }

      let errorMessage = 'An error occurred while fetching history';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          // Cookie will be cleared by server
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage =
          'Unable to connect to the server. Please check your internet connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  },

  // Fetch bookmarked searches
  fetchBookmarked: async (page = 1, limit = 20) => {
    const { setLoading, setError, clearError } = uiStore.getState();
    const { isAuthenticated } = authStore.getState();

    if (!isAuthenticated) {
      setError('Authentication required. Please log in to view bookmarks.');
      return;
    }

    setLoading(true);
    clearError();

    try {
      const response = await axios.get(
        `${API_BASE_URL}/history/bookmarked?page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        set((state) => {
          const newSearches = response.data.data.searches;
          const existingSearches = page === 1 ? [] : state.bookmarkedSearches;

          // Filter out duplicates
          const uniqueSearches = [...existingSearches];
          const existingIds = new Set(existingSearches.map(s => s.id));

          newSearches.forEach(search => {
            if (!existingIds.has(search.id)) {
              uniqueSearches.push(search);
            }
          });

          return {
            bookmarkedSearches: uniqueSearches,
            bookmarkedPagination: response.data.data.pagination,
          };
        });
      } else {
        setError(response.data.error?.message || 'Failed to fetch bookmarks');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Bookmarked fetch error:', error);
      }

      let errorMessage = 'An error occurred while fetching bookmarks';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          // Cookie will be cleared by server
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage =
          'Unable to connect to the server. Please check your internet connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  },

  // Clear search history
  clearHistory: async () => {
    const { setLoading, setError, clearError } = uiStore.getState();
    const { isAuthenticated } = authStore.getState();

    if (!isAuthenticated) {
      setError('Authentication required. Please log in to clear history.');
      return;
    }

    setLoading(true);
    clearError();

    try {
      const response = await axios.delete(`${API_BASE_URL}/history`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.success) {
        set({
          searches: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        });
        return { success: true };
      } else {
        setError(response.data.error?.message || 'Failed to clear history');
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
          // Cookie will be cleared by server
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage =
          'Unable to connect to the server. Please check your internet connection.';
      }

      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  },

  // Toggle bookmark for a search
  toggleBookmark: async (searchId) => {
    const { setError } = uiStore.getState();
    const { isAuthenticated } = authStore.getState();

    if (!isAuthenticated) {
      setError('Authentication required. Please log in to bookmark searches.');
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/search/${searchId}/bookmark`,
        {},
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Update the search in both arrays
        const updatedSearches = get().searches.map((search) =>
          search.id === searchId
            ? { ...search, isBookmarked: response.data.data.isBookmarked }
            : search
        );

        const updatedBookmarked = get().bookmarkedSearches.map((search) =>
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
        setError(
          response.data.error?.message || 'Failed to toggle bookmark'
        );
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
          // Cookie will be cleared by server
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage =
          'Unable to connect to the server. Please check your internet connection.';
      }

      setError(errorMessage);

      return { success: false, error: errorMessage };
    }
  },

  // Clean up old search history
  cleanupHistory: async () => {
    const { setError } = uiStore.getState();
    const { isAuthenticated } = authStore.getState();

    if (!isAuthenticated) {
      setError('Authentication required. Please log in to manage history.');
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/history/cleanup`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        console.log('✅ History cleanup completed:', response.data.data);
        // Refresh history after cleanup
        historyStore.getState().fetchHistory();
        return response.data.data;
      }
    } catch (error) {
      let errorMessage = 'Failed to cleanup history';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          // Cookie will be cleared by server
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      }
      
      console.error('❌ History cleanup error:', errorMessage);
      setError(errorMessage);
    }
  },

  // Reset store
  reset: () =>
    set({
      searches: [],
      bookmarkedSearches: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      bookmarkedPagination: { page: 1, limit: 20, total: 0, pages: 0 }
    })
}));

export default historyStore;
