import { create } from 'zustand';

const uiStore = create((set) => ({
  // State
  loading: false,
  error: null,
  toast: {
    message: '',
    type: 'info',
    visible: false,
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  showToast: (message, type = 'info') => set({ toast: { message, type, visible: true } }),
  hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } })),
}));

export default uiStore;