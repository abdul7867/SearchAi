import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Login action
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ 
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null
        });

        return { success: true };
      } else {
        set({ 
          error: response.data.error?.message || 'Login failed',
          loading: false 
        });
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

      set({ 
        error: errorMessage,
        loading: false 
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Register action
  register: async (name, email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ 
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null
        });

        return { success: true };
      } else {
        set({ 
          error: response.data.error?.message || 'Registration failed',
          loading: false 
        });
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

      set({ 
        error: errorMessage,
        loading: false 
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset store state
    set({ 
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  },

  // Check if user is authenticated on app start
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get(`${API_BASE_URL}/users/me`);
      
      if (response.data.success) {
        set({ 
          user: response.data.data.user,
          token,
          isAuthenticated: true
        });
      } else {
        // Invalid token, clear it
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        set({ 
          user: null,
          token: null,
          isAuthenticated: false
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Auth check error:', error);
      }
      
      // Clear invalid token
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ 
        user: null,
        token: null,
        isAuthenticated: false
      });
    }
  },

  // Update user profile
  updateProfile: async (updates) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, updates);

      if (response.data.success) {
        set({ 
          user: response.data.data.user,
          loading: false,
          error: null
        });
        return { success: true };
      } else {
        set({ 
          error: response.data.error?.message || 'Profile update failed',
          loading: false 
        });
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

      set({ 
        error: errorMessage,
        loading: false 
      });
      
      return { success: false, error: errorMessage };
    }
  }
}));

export default authStore;
