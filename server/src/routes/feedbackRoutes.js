// server/src/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/sessionMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Get all feedback (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    db.all(`
      SELECT f.*, u.username 
      FROM feedback f 
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.created_at DESC`, 
      [], 
      (err, feedback) => {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        res.json(feedback);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new feedback
router.post('/', authMiddleware, async (req, res) => {
  const { content, image_url } = req.body;
  const user_id = req.user.id;
  
  try {
    db.run(
      'INSERT INTO feedback (user_id, content, image_url, status, created_at) VALUES (?, ?, ?, ?, ?)',
      [user_id, content, image_url, 'pending', new Date().toISOString()],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error creating feedback' });
        }
        res.json({ id: this.lastID, content, image_url, status: 'pending' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update feedback status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    db.run(
      'UPDATE feedback SET status = ? WHERE id = ?',
      [status, id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating feedback' });
        }
        res.json({ message: 'Feedback status updated' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    db.run('DELETE FROM feedback WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting feedback' });
      }
      res.json({ message: 'Feedback deleted' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
