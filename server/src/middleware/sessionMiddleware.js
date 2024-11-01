// server/src/middleware/sessionMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const sessionMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user in database
    db.get(
      'SELECT id, username, email, is_admin, last_login FROM users WHERE id = ?',
      [decoded.user.id],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Invalid session' });
        }
        
        // Update last_login
        db.run(
          'UPDATE users SET last_login = ? WHERE id = ?',
          [new Date().toISOString(), user.id]
        );

        // Attach user to request
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: Boolean(user.is_admin),
          lastLogin: user.last_login
        };

        next();
      }
    );
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = sessionMiddleware;
