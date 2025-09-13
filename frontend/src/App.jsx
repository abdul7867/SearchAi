import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import authStore from './stores/authStore';
import SmoothScrollToTop from './components/SmoothScrollToTop';
import './App.css';

function App() {
  const checkAuth = authStore((state) => state.checkAuth); // ✅ FIXED: Use proper Zustand selector pattern

  useEffect(() => {
    // Check authentication status on app start
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <Layout>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <Home />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ErrorBoundary>
                      <Home />
                    </ErrorBoundary>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <History />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collections"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Collections />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collections/:id"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <CollectionDetail />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </Layout>
            <SmoothScrollToTop />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
