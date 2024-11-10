
// server/src/routes/feedbackRoutes.js
import express from 'express';
import db from '../config/database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import authMiddleware from '../middleware/sessionMiddleware.js';

const router = express.Router(); // Correct initialization of Router

// Create uploads directory if it doesn't exist
const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Using the absolute path we created
  },
  filename: function (req, file, cb) {
    // Sanitize filename
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
    cb(null, filename);
  }
});

// Add file filter for images
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Route to create feedback with image upload
router.post('/', upload.single('image'), handleMulterError, async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user?.id || null;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!content) {
      // Clean up uploaded file if content validation fails
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error removing file:', err);
        });
      }
      return res.status(400).json({ message: 'Content is required' });
    }

    db.run(
      `INSERT INTO feedback (content, user_id, image_url, created_at, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [content, user_id, image_url, new Date().toISOString(), 'pending'],
      function (err) {
        if (err) {
          // Clean up uploaded file if database insert fails
          if (req.file) {
            fs.unlink(req.file.path, (err) => {
              if (err) console.error('Error removing file:', err);
            });
          }
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error saving feedback' });
        }

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
    // Clean up uploaded file if any error occurs
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error removing file:', err);
      });
    }
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
      function (err) {
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

// Delete feedback (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  console.log('Delete request received for feedback id:', req.params.id); // Debug log
  
  try {
    db.run(
      'DELETE FROM feedback WHERE id = ?',
      [req.params.id],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error deleting feedback' });
        }
        
        console.log('Changes made:', this.changes); // Debug log
        
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Feedback not found' });
        }
        
        res.json({ message: 'Feedback deleted successfully' });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

