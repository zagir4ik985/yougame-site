const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'yougame-secret-key-2024';

function authMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

  if (!token) {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.clearCookie('token');
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Токен истёк' });
    }
    return res.redirect('/login');
  }
}

function optionalAuth(req, res, next) {
  const token = req.cookies?.token;

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      res.clearCookie('token');
    }
  }

  next();
}

module.exports = { authMiddleware, optionalAuth, JWT_SECRET };
