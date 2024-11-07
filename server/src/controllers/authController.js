
// server/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authController = {
  // Register user
  register: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Check if user exists
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const created_at = new Date().toISOString();

        // Create user
        db.run(
          'INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)',
          [username, email, hashedPassword, created_at],
          function(err) {
            if (err) return res.status(500).json({ message: 'Error creating user' });

            // Create JWT token
            const payload = { user: { id: this.lastID, email } };
            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: '1h' },
              (err, token) => {
                if (err) throw err;
                res.json({ 
                  token,
                  user: { id: this.lastID, email, isAdmin: false }
                });
              }
            );
          }
        );
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // Login user
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user exists
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create JWT token
        const payload = { user: { id: user.id, email: user.email, isAdmin: Boolean(user.is_admin) } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          res.json({ 
            token,
            user: { id: user.id, email: user.email, isAdmin: Boolean(user.is_admin) }
          });
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      db.get(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [req.user.id],
        (err, user) => {
          if (err) return res.status(500).json({ message: 'Server error' });
          if (!user) return res.status(404).json({ message: 'User not found' });

          res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: Boolean(user.is_admin),
            created_at: user.created_at
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // Get all users (Admin)
  getAllUsers: async (req, res) => {
    try {
      db.all(
        'SELECT id, username, email, is_admin, last_login, created_at FROM users',
        [],
        (err, users) => {
          if (err) return res.status(500).json({ message: 'Server error' });
          res.json(users);
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Toggle admin status
  toggleUserAdmin: async (req, res) => {
    const { userId } = req.params;
    try {
      db.run('UPDATE users SET is_admin = NOT is_admin WHERE id = ?', [userId], (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ message: 'Admin status updated' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Token-based login
  loginWithTokens: async (req, res) => {
  const { email, password } = req.body;

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      // Add password check
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      // Create tokens
      const token = jwt.sign(
        { user: { id: user.id, email: user.email, isAdmin: Boolean(user.is_admin) } },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      
      const refreshToken = jwt.sign(
        { userId: user.id }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' }
      );

      // Store refresh token
      db.run('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [user.id, refreshToken], (err) => {
        if (err) return res.status(500).json({ message: 'Error storing refresh token' });
        res.json({ 
          token, 
          refreshToken, 
          user: { 
            id: user.id, 
            email: user.email, 
            isAdmin: Boolean(user.is_admin) 
          } 
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
},

  // Refresh token
  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      db.get(
        'SELECT users.* FROM users JOIN refresh_tokens ON users.id = refresh_tokens.user_id WHERE refresh_tokens.token = ?',
        [refreshToken],
        (err, user) => {
          if (err || !user) return res.status(401).json({ message: 'Invalid refresh token' });

          const newToken = jwt.sign(
            { user: { id: user.id, email: user.email, isAdmin: user.isAdmin } },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
          );
          res.json({ token: newToken });
        }
      );
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  },

  // Logout
  logout: async (req, res) => {
    const { refreshToken } = req.body;
    try {
      db.run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken], (err) => {
        if (err) return res.status(500).json({ message: 'Error during logout' });
        res.json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;

