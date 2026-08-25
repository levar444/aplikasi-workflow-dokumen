const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan atau tidak valid.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Menggunakan kunci rahasia yang sama dengan yang ada di authController.js
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_2026');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token kedaluwarsa atau tidak sah.' });
  }
};

module.exports = authMiddleware;