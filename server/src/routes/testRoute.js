// server/src/routes/testRoute.js
import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Test route to retrieve all users
router.get('/', async (req, res) => {
  try {
    db.all('SELECT * FROM users', [], (err, users) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json(users);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
