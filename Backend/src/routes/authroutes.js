// src/routes/auth.routes.js
const express = require('express');
const AuthController = require('../controllers/authcontroller');
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;