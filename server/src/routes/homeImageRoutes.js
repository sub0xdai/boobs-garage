// server/src/routes/homeImageRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import authMiddleware from '../middleware/sessionMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import db from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads'); // Path to server root uploads
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'home-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

const router = express.Router();

// Get current home image
router.get('/home-image', (req, res) => {
  db.get('SELECT * FROM home_images ORDER BY created_at DESC LIMIT 1', [], (err, image) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching home image' });
    }
    res.json(image || { imageUrl: '' });
  });
});

// Update home image
router.post('/home-image', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });

  }

  console.log('File upload details:', {
    originalPath: req.file.path,
    filename: req.file.filename,
    destination: req.file.destination
  });

  const imageUrl = `/uploads/${req.file.filename}`;
  const now = new Date().toISOString();

  // Start transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Deactivate current active image
    db.run('UPDATE home_images SET active = 0 WHERE active = 1', [], (err) => {
      if (err) {
        console.error('Error deactivating images:', err);
        db.run('ROLLBACK');
        return res.status(500).json({ message: 'Failed to update image' });
      }

      // Insert new image
      db.run(
        'INSERT INTO home_images (imageUrl, active, created_at, updated_at) VALUES (?, 1, ?, ?)',
        [imageUrl, now, now],
        function(err) {
          if (err) {
            console.error('Error inserting image:', err);
            db.run('ROLLBACK');
            // Clean up uploaded file
            fs.unlink(req.file.path, () => {});
            return res.status(500).json({ message: 'Failed to save image' });
          }

          db.get(
            'SELECT * FROM home_images WHERE id = ?',
            [this.lastID],
            (err, image) => {
              if (err) {
                console.error('Error fetching new image:', err);
                db.run('ROLLBACK');
                return res.status(500).json({ message: 'Failed to fetch new image' });
              }

              db.run('COMMIT');
              res.status(201).json(image);
            }
          );
        }
      );
    });
  });
});

export default router;
