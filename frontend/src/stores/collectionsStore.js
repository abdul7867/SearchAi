import { create } from 'zustand';
import axios from 'axios';
import authStore from './authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const collectionsStore = create((set, get) => ({
  // State
  collections: [],
  currentCollection: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch user's collections
  fetchCollections: async (page = 1, limit = 20) => {
    const { isAuthenticated } = authStore.getState();
    
    if (!isAuthenticated) {
      set({ error: 'Authentication required. Please log in to view collections.' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/collections?page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        set({ 
          collections: response.data.data.collections,
          pagination: response.data.data.pagination,
        });
      } else {
        set({ error: response.data.error?.message || 'Failed to fetch collections' });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Collections fetch error:', error);
      }
      
      let errorMessage = 'An error occurred while fetching collections';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          authStore.getState().logout();
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch collection by ID with searches
  fetchCollection: async (collectionId) => {
    const { isAuthenticated } = authStore.getState();
    
    if (!isAuthenticated) {
      set({ error: 'Authentication required. Please log in to view collection.' });
      return { success: false, error: 'Authentication required' };
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/collections/${collectionId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        set({ 
          currentCollection: response.data.data.collection,
        });
        return { success: true, collection: response.data.data.collection };
      } else {
        set({ error: response.data.error?.message || 'Failed to fetch collection' });
        return { success: false, error: response.data.error?.message || 'Failed to fetch collection' };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Collection fetch error:', error);
      }
      
      let errorMessage = 'An error occurred while fetching collection';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          authStore.getState().logout();
        } else if (error.response.status === 404) {
          errorMessage = 'Collection not found';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Create new collection
  createCollection: async (collectionData) => {
    const { isAuthenticated } = authStore.getState();
    
    if (!isAuthenticated) {
      set({ error: 'Authentication required. Please log in to create collections.' });
      return { success: false, error: 'Authentication required' };
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/collections`,
        collectionData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Add new collection to the list
        const newCollection = response.data.data.collection;
        set(state => ({
          collections: [newCollection, ...state.collections],
        }));
        return { success: true, collection: newCollection };
      } else {
        set({ error: response.data.error?.message || 'Failed to create collection' });
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Create collection error:', error);
      }
      
      let errorMessage = 'An error occurred while creating collection';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          authStore.getState().logout();
        } else if (error.response.status === 409) {
          errorMessage = 'Collection with this name already exists';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ error: errorMessage });
      
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Update collection
  updateCollection: async (collectionId, updateData) => {
    const { isAuthenticated } = authStore.getState();
    
    if (!isAuthenticated) {
      set({ error: 'Authentication required. Please log in to update collections.' });
      return { success: false, error: 'Authentication required' };
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.put(
        `${API_BASE_URL}/collections/${collectionId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const updatedCollection = response.data.data.collection;
        
        // Update collection in the list
        set(state => ({
          collections: state.collections.map(collection => 
            collection.id === collectionId ? updatedCollection : collection
          ),
          currentCollection: state.currentCollection?.id === collectionId 
            ? updatedCollection 
            : state.currentCollection,
        }));
        
        return { success: true, collection: updatedCollection };
      } else {
        set({ error: response.data.error?.message || 'Failed to update collection' });
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Update collection error:', error);
      }
      
      let errorMessage = 'An error occurred while updating collection';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          authStore.getState().logout();
        } else if (error.response.status === 404) {
          errorMessage = 'Collection not found';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ error: errorMessage });
      
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Delete collection
  deleteCollection: async (collectionId) => {
    const { isAuthenticated } = authStore.getState();
    
    if (!isAuthenticated) {
      set({ error: 'Authentication required. Please log in to delete collections.' });
      return { success: false, error: 'Authentication required' };
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/collections/${collectionId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Remove collection from the list
        set(state => ({
          collections: state.collections.filter(collection => collection.id !== collectionId),
          currentCollection: state.currentCollection?.id === collectionId 
            ? null 
            : state.currentCollection,
        }));
        
        return { success: true };
      } else {
        set({ error: response.data.error?.message || 'Failed to delete collection' });
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      console.error('Delete collection error:', error);
      
      let errorMessage = 'An error occurred while deleting collection';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          authStore.getState().logout();
        } else if (error.response.status === 404) {
          errorMessage = 'Collection not found';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ error: errorMessage });
      
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Add search to collection
  addSearchToCollection: async (collectionId, searchId) => {
    const { isAuthenticated } = authStore.getState();
    
    if (!isAuthenticated) {
      set({ error: 'Authentication required. Please log in to add searches to collections.' });
      return { success: false, error: 'Authentication required' };
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/collections/${collectionId}/searches`,
        { searchId },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Refresh the current collection if it's the one being updated
        if (get().currentCollection?.id === collectionId) {
          get().fetchCollection(collectionId);
        }
        
        return { success: true };
      } else {
        set({ error: response.data.error?.message || 'Failed to add search to collection' });
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Add search to collection error:', error);
      }
      
      let errorMessage = 'An error occurred while adding search to collection';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          authStore.getState().logout();
        } else if (error.response.status === 404) {
          errorMessage = 'Collection or search not found';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ error: errorMessage });
      
      return { success: false, error: errorMessage };
    }
  },

  // Remove search from collection
  removeSearchFromCollection: async (collectionId, searchId) => {
    const { isAuthenticated } = authStore.getState();
    
    if (!isAuthenticated) {
      set({ error: 'Authentication required. Please log in to remove searches from collections.' });
      return { success: false, error: 'Authentication required' };
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/collections/${collectionId}/searches/${searchId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Refresh the current collection if it's the one being updated
        if (get().currentCollection?.id === collectionId) {
          get().fetchCollection(collectionId);
        }
        
        return { success: true };
      } else {
        set({ error: response.data.error?.message || 'Failed to remove search from collection' });
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Remove search from collection error:', error);
      }
      
      let errorMessage = 'An error occurred while removing search from collection';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          authStore.getState().logout();
        } else if (error.response.status === 404) {
          errorMessage = 'Collection or search not found';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      set({ error: errorMessage });
      
      return { success: false, error: errorMessage };
    }
  },

  // Reset store
  reset: () => set({
    collections: [],
    currentCollection: null,
    pagination: { page: 1, limit: 20, total: 0, pages: 0 }
  })
}));

export default collectionsStore;
