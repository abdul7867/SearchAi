import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies first (preferred method)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header for backward compatibility
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Not authorized, no token' }
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return res.status(401).json({
      success: false,
      error: { message: 'Not authorized, token failed' }
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in cookies first (preferred method)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header for backward compatibility
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we continue without user
      console.log('⚠️ Optional auth failed, continuing without user');
    }
  }

  next();
};

export default { protect, optionalAuth };
