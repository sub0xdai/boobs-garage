// server/src/routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/sessionMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Get all services
router.get('/', async (req, res) => {
  try {
    db.all('SELECT * FROM services', [], (err, services) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.json(services);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new service (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price } = req.body;
  try {
    db.run(
      'INSERT INTO services (name, description, price, updated_at) VALUES (?, ?, ?, ?)',
      [name, description, price, new Date().toISOString()],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error creating service' });
        }
        res.json({ id: this.lastID, name, description, price });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price } = req.body;
  const { id } = req.params;
  try {
    db.run(
      'UPDATE services SET name = ?, description = ?, price = ?, updated_at = ? WHERE id = ?',
      [name, description, price, new Date().toISOString(), id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating service' });
        }
        res.json({ id, name, description, price });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
