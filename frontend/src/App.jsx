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
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import TestingDashboard from './components/TestingDashboard';
import authStore from './stores/authStore';
import SmoothScrollToTop from './components/SmoothScrollToTop';
import './App.css';

function App() {
  const { checkAuth } = authStore((state) => state); // ✅ FIXED: Use proper Zustand selector pattern

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
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/history" 
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/collections" 
                  element={
                    <ProtectedRoute>
                      <Collections />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/testing" element={<TestingDashboard />} />
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
