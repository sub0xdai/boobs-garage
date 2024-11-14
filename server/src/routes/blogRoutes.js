
// server/src/routes/blogRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../config/database.js';
import * as fs from 'fs';
import authMiddleware from '../middleware/sessionMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Get absolute path for uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadPath = path.join(__dirname, '../../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('Created uploads directory at:', uploadPath);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath)  // Using absolute path to uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all blog posts
router.get('/posts', async (req, res) => {
  console.log('Blog posts request received');
  try {
    db.all(`
      SELECT blog_posts.*, users.username as author_name 
      FROM blog_posts 
      LEFT JOIN users ON blog_posts.author_id = users.id 
      ORDER BY created_at DESC
    `, [], (err, posts) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      console.log('Sending posts:', posts.length);
      res.json(posts);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog post
router.get('/posts/:id', async (req, res) => {
  try {
    db.get(`
      SELECT blog_posts.*, users.username as author_name 
      FROM blog_posts 
      LEFT JOIN users ON blog_posts.author_id = users.id 
      WHERE blog_posts.id = ?
    `, [req.params.id], (err, post) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update POST route 

router.post('/posts', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  console.log('Received request:');
  console.log('Body:', req.body);
  console.log('File:', req.file);

  const { title, content } = req.body;
  
  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const now = new Date().toISOString();
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    db.run(
      `INSERT INTO blog_posts (
        title, content, image_url, author_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, content, image_url, req.user.id, now, now],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error creating blog post' });
        }

        // Return the created post
        const newPost = {
          id: this.lastID,
          title,
          content,
          image_url,
          author_id: req.user.id,
          created_at: now,
          updated_at: now
        };

        console.log('Blog post created:', newPost);
        res.status(201).json(newPost);
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog post (admin only)
router.put('/posts/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const now = new Date().toISOString();
    
    // If there's a new image, use its path, otherwise keep existing image_url
    let image_url;
    if (req.file) {
      image_url = `/uploads/blog/${req.file.filename}`;
    } else {
      // Get existing image_url from database
      const post = await new Promise((resolve, reject) => {
        db.get('SELECT image_url FROM blog_posts WHERE id = ?', [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      image_url = post ? post.image_url : null;
    }
    
    db.run(
      `UPDATE blog_posts 
       SET title = ?, content = ?, image_url = ?, updated_at = ? 
       WHERE id = ?`,
      [title, content, image_url, now, id],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error updating blog post' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Post not found' });
        }

        const updatedPost = {
          id: parseInt(id),
          title,
          content,
          image_url,
          updated_at: now
        };

        res.json(updatedPost);
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Delete blog post (admin only)
router.delete('/posts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  
  try {
    db.run('DELETE FROM blog_posts WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error deleting blog post' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Blog post deleted successfully' });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

