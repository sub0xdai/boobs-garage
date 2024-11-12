import express from 'express';
import db from '../config/database.js';
import authMiddleware from '../middleware/sessionMiddleware.js';

const router = express.Router();

// Get user preferences
router.get('/', authMiddleware, async (req, res) => {
  try {
    db.get(
      'SELECT view_preferences FROM users WHERE id = ?',
      [req.user.id],
      (err, preferences) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching preferences' });
        }
        res.json(preferences?.view_preferences ? JSON.parse(preferences.view_preferences) : {});
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/', authMiddleware, async (req, res) => {
  const { servicesView, blogView } = req.body;
  
  try {
    const preferences = JSON.stringify({ servicesView, blogView });
    
    db.run(
      'UPDATE users SET view_preferences = ? WHERE id = ?',
      [preferences, req.user.id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating preferences' });
        }
        res.json({ servicesView, blogView });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
