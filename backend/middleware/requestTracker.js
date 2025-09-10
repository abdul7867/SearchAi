/**
 * Request tracking middleware to prevent duplicate responses
 */

const activeRequests = new Map();

export const requestTracker = (req, res, next) => {
  const requestId = `${req.method}-${req.url}-${Date.now()}-${Math.random()}`;
  req.requestId = requestId;
  
  // Track active requests
  activeRequests.set(requestId, {
    method: req.method,
    url: req.url,
    timestamp: Date.now(),
    userId: req.user?.id || 'anonymous'
  });
  
  // Track if response has been sent
  let responseSent = false;
  
  // Override the end method which is called when response is finished
  const originalEnd = res.end;
  res.end = function(...args) {
    if (responseSent) {
      console.warn(`⚠️ Duplicate response attempt prevented for ${requestId}`, {
        method: req.method,
        url: req.url,
        userId: req.user?.id || 'anonymous'
      });
      return;
    }
    
    responseSent = true;
    activeRequests.delete(requestId);
    console.log(`📤 Response sent: ${requestId} - ${req.method} ${req.url}`);
    
    // Call original end method
    return originalEnd.apply(this, args);
  };
  
  // Cleanup on request close/abort
  req.on('close', () => {
    if (!responseSent) {
      console.log(`🚫 Request aborted: ${requestId} - ${req.method} ${req.url}`);
      activeRequests.delete(requestId);
    }
  });
  
  // Cleanup on response finish (backup)
  res.on('finish', () => {
    activeRequests.delete(requestId);
  });
  
  // Log request start
  console.log(`📥 Request started: ${requestId} - ${req.method} ${req.url}`);
  
  next();
};

// Cleanup function for old requests (run periodically)
export const cleanupOldRequests = () => {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  for (const [requestId, request] of activeRequests.entries()) {
    if (now - request.timestamp > maxAge) {
      console.log(`🧹 Cleaning up old request: ${requestId}`);
      activeRequests.delete(requestId);
    }
  }
};

// Get active requests (for monitoring)
export const getActiveRequests = () => {
  return Array.from(activeRequests.entries()).map(([id, request]) => ({
    id,
    ...request,
    age: Date.now() - request.timestamp
  }));
};

// Start cleanup interval
setInterval(cleanupOldRequests, 60000); // Run every minute

export default requestTracker;
