// server/src/middleware/sessionMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const sessionMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No token provided or invalid format');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // First verify the user exists without the last_login field
    db.get(
      'SELECT id, username, email, is_admin FROM users WHERE id = ?',
      [decoded.user.id],
      (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        if (!user) {
          console.log('User not found:', decoded.user.id);
          return res.status(401).json({ message: 'Invalid session' });
        }

        // Update last_login in a separate query
        const now = new Date().toISOString();
        db.run(
          'UPDATE users SET last_login = ? WHERE id = ?',
          [now, user.id],
          (updateErr) => {
            if (updateErr) {
              console.error('Error updating last_login:', updateErr);
              // Continue anyway as this is not critical
            }
          }
        );

        // Attach user to request
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: Boolean(user.is_admin),
          lastLogin: now  // Use the current time since we just updated it
        };

        console.log('User attached to request:', req.user);
        next();
      }
    );
  } catch (error) {
    console.error('Session middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = sessionMiddleware;
