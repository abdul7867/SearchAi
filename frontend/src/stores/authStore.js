import { create } from 'zustand';
import axios from 'axios';
import uiStore from './uiStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Configure axios to include credentials (cookies) with requests
axios.defaults.withCredentials = true;

const authStore = create((set, get) => ({
  // State
  user: null,
  token: null, // Remove localStorage dependency
  isAuthenticated: false,

  // Actions

  // Login action
  login: async (email, password) => {
    uiStore.getState().setLoading(true);
    uiStore.getState().clearError();

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { user } = response.data.data;
        
        // No need to store token - it's now in HTTP-only cookie
        // Remove any existing Authorization header
        delete axios.defaults.headers.common['Authorization'];
        
        set({ 
          user,
          token: null, // Token is now in cookie
          isAuthenticated: true,
        });

        return { success: true };
      } else {
        uiStore.getState().setError(response.data.error?.message || 'Login failed');
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Login error:', error);
      }
      
      let errorMessage = 'An error occurred during login';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      uiStore.getState().setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      uiStore.getState().setLoading(false);
    }
  },

  // Register action
  register: async (name, email, password) => {
    uiStore.getState().setLoading(true);
    uiStore.getState().clearError();

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });

      if (response.data.success) {
        const { user } = response.data.data;
        
        // No need to store token - it's now in HTTP-only cookie
        // Remove any existing Authorization header
        delete axios.defaults.headers.common['Authorization'];
        
        set({ 
          user,
          token: null, // Token is now in cookie
          isAuthenticated: true,
        });

        return { success: true };
      } else {
        uiStore.getState().setError(response.data.error?.message || 'Registration failed');
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Registration error:', error);
      }
      
      let errorMessage = 'An error occurred during registration';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'An account with this email already exists';
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      uiStore.getState().setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      uiStore.getState().setLoading(false);
    }
  },

  // Logout action
  logout: async () => {
    try {
      // Call logout endpoint to clear cookie
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with local logout even if request fails
    }
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset store state
    set({ 
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  // Check if user is authenticated on app start
  checkAuth: async () => {
    try {
      // Remove any existing Authorization header - we use cookies now
      delete axios.defaults.headers.common['Authorization'];
      
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      
      if (response.data.success) {
        set({ 
          user: response.data.data.user,
          token: null, // Token is in cookie
          isAuthenticated: true
        });
        return true;
      } else {
        // Invalid token/cookie
        set({ 
          user: null,
          token: null,
          isAuthenticated: false
        });
        return false;
      }
    } catch (error) {
      // Handle different types of authentication errors
      const isNetworkError = !error.response;
      const isUnauthorized = error.response?.status === 401;
      const isServerError = error.response?.status >= 500;
      
      // Only log errors in development, and only if they're not expected auth failures
      if (import.meta.env.DEV && !isUnauthorized) {
        console.warn('Auth check failed:', {
          message: error.message,
          status: error.response?.status,
          isNetworkError,
          isServerError
        });
      }
      
      // Clear authentication state
      set({ 
        user: null,
        token: null,
        isAuthenticated: false
      });
      
      // Return false to indicate auth check failed
      return false;
    }
  },

  // Update user profile
  updateProfile: async (updates) => {
    uiStore.getState().setLoading(true);
    uiStore.getState().clearError();

    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, updates);

      if (response.data.success) {
        set({ 
          user: response.data.data.user,
        });
        return { success: true };
      } else {
        uiStore.getState().setError(response.data.error?.message || 'Profile update failed');
        return { success: false, error: response.data.error?.message };
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Profile update error:', error);
      }
      
      let errorMessage = 'An error occurred while updating profile';
      
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }

      uiStore.getState().setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      uiStore.getState().setLoading(false);
    }
  }
}));

export default authStore;
