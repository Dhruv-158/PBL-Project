const AuthService = require('../services/authservice');

class AuthController {
  async register(req, res, next) {
    try {
      // Pass all request body data to the service
      const userData = req.body;
      const result = await AuthService.register(userData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();