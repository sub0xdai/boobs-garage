// server/src/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/sessionMiddleware');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public route to submit feedback
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user?.id || null; // Use user ID if available, null if not
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    db.run(
      `INSERT INTO feedback (content, user_id, image_url, created_at, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [content, user_id, image_url, new Date().toISOString(), 'pending'],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error saving feedback' });
        }

        // Return the created feedback
        db.get(
          'SELECT * FROM feedback WHERE id = ?',
          [this.lastID],
          (err, feedback) => {
            if (err) {
              console.error('Error fetching created feedback:', err);
              return res.status(500).json({ message: 'Error retrieving feedback' });
            }
            res.status(201).json(feedback);
          }
        );
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route to get all feedback (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    db.all(
      `SELECT feedback.*, users.username 
       FROM feedback 
       LEFT JOIN users ON feedback.user_id = users.id 
       ORDER BY created_at DESC`,
      [],
      (err, feedback) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error fetching feedback' });
        }
        res.json(feedback);
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route to update feedback status (admin only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    db.run(
      'UPDATE feedback SET status = ? WHERE id = ?',
      [status, id],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error updating feedback' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback status updated' });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
