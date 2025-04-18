// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthMiddleware {
  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user info to request
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  async requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
  }

  async requireSupervisor(req, res, next) {
    if (req.user && (req.user.role === 'supervisor' || req.user.role === 'admin')) {
      next();
    } else {
      return res.status(403).json({ message: 'Supervisor privileges required' });
    }
  }
}

module.exports = new AuthMiddleware();