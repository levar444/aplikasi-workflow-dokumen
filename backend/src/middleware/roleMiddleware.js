const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak: Hak akses tidak memadai.' });
    }
    next();
  };
};

module.exports = roleMiddleware;