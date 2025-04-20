const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  async register(userData) {
    try {
      // Check for required fields for all user types
      const commonRequiredFields = ['username', 'email', 'password'];
      for (const field of commonRequiredFields) {
        if (!userData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Ensure role is set before validation
      userData.role = userData.role || 'user';

      // Add role-specific validations
      if (userData.role === 'user') {
        const requiredFields = ['studentId', 'name', 'enrollmentId', 'college', 'department'];
        for (const field of requiredFields) {
          if (!userData[field]) {
            throw new Error(`Missing required field for user: ${field}`);
          }
        }
      } else if (userData.role === 'supervisor') {
        const requiredFields = ['name', 'supervisorId', 'department'];
        for (const field of requiredFields) {
          if (!userData[field]) {
            throw new Error(`Missing required field for supervisor: ${field}`);
          }
        }
      } else if (userData.role === 'admin') {
        // Add admin-specific field validation if needed
        if (!userData.name) {
          throw new Error(`Missing required field for admin: name`);
        }
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email: userData.email });
      if (existingEmail) {
        throw new Error('Email already in use');
      }

      // Check if username already exists
      const existingUsername = await User.findOne({ username: userData.username });
      if (existingUsername) {
        throw new Error('Username already in use');
      }

      // Create user with role defined first to ensure proper validation
      const user = new User({ role: userData.role, ...userData });
      await user.save();

      const tokens = this.generateTokens(user);
      
      // Create response object
      const response = {
        message: 'Registration successful',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name
        },
        tokens
      };
      
      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.isValidPassword(password))) {
        throw new Error('Invalid email or password');
      }

      const tokens = this.generateTokens(user);
      
      // Build response object
      const response = {
        message: 'Login successful',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name
        },
        tokens
      };
      
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        email: user.email, 
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error('User not found');

      const tokens = this.generateTokens(user);
      return {
        message: 'Token refreshed successfully',
        tokens,
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
}

module.exports = new AuthService();