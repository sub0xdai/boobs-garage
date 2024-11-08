// server/src/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/sessionMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Get all blog posts
router.get('/posts', async (req, res) => {
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

// Create new blog post (admin only)
router.post('/posts', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, content, image_url } = req.body;
  
  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    console.log('Creating blog post:', { title, content, image_url });
    const now = new Date().toISOString();
    
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
router.put('/posts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, content, image_url } = req.body;
  const { id } = req.params;

  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const now = new Date().toISOString();
    
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

module.exports = router;