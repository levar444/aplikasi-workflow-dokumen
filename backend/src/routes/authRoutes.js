const express = require('express');

const {
  login,
  register,
  forgotPassword,
  getMe
} = require('../controllers/authController');

const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Login
router.post('/login', login);

// Register akun baru
router.post('/register', register);

// Lupa password
router.post('/forgot-password', forgotPassword);

// Data user yang sedang login
router.get('/me', authenticate, getMe);

module.exports = router;