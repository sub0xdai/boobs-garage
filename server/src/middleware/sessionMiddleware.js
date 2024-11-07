// server/src/middleware/sessionMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const sessionMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader); // Debug log

    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided'); // Debug log
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check user in database
    db.get(
      'SELECT id, username, email, is_admin, last_login FROM users WHERE id = ?',
      [decoded.user.id],
      (err, user) => {
        if (err) {
          console.error('Database error:', err); // Debug log
          return res.status(500).json({ message: 'Server error' });
        }

        if (!user) {
          console.log('User not found:', decoded.user.id); // Debug log
          return res.status(401).json({ message: 'Invalid session' });
        }

        console.log('Found user:', { 
          id: user.id, 
          email: user.email, 
          isAdmin: Boolean(user.is_admin) 
        }); // Debug log
        
        // Update last_login
        db.run(
          'UPDATE users SET last_login = ? WHERE id = ?',
          [new Date().toISOString(), user.id],
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
          lastLogin: user.last_login
        };

        console.log('User attached to request:', req.user); // Debug log
        next();
      }
    );
  } catch (error) {
    console.error('Session middleware error:', error); // Debug log
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = sessionMiddleware;
