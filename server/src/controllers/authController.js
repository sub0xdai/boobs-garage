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
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }

        if (user) {
          return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const created_at = new Date().toISOString();
        
        db.run(
          'INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)',
          [username, email, hashedPassword, created_at],
          function(err) {
            if (err) {
              return res.status(500).json({ message: 'Error creating user' });
            }

            // Create JWT token
            const payload = {
              user: {
                id: this.lastID,
                email
              }
            };

            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: '1h' },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
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
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }

        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
          user: {
            id: user.id,
            email: user.email
          }
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
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
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }

          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

          res.json(user);
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // New admin-specific endpoints
  getAllUsers: async (req, res) => {
    try {
      db.all(
        'SELECT id, username, email, is_admin, last_login, created_at FROM users',
        [],
        (err, users) => {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }
          res.json(users);
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  toggleUserAdmin: async (req, res) => {
    const { userId } = req.params;
    try {
      db.run(
        'UPDATE users SET is_admin = NOT is_admin WHERE id = ?',
        [userId],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }
          res.json({ message: 'Admin status updated' });
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;
