import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initPerformanceMonitoring } from './utils/performance.js'
import { browserInfo, getCurrentBrowserOptimizations } from './utils/browserSupport.js'

// Initialize performance monitoring
initPerformanceMonitoring();

// Log browser information for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('Browser Info:', browserInfo);
  console.log('Browser Optimizations:', getCurrentBrowserOptimizations());
}

// Register service worker for performance optimization
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  import.meta.env.DEV ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  ),
)
