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
  
  // Add validation
  if (!name || !description || !price) {
    return res.status(400).json({ 
      message: 'Name, description, and price are required' 
    });
  }

  try {
    // Log the incoming request
    console.log('Creating service:', { name, description, price });

    db.run(
      'INSERT INTO services (name, description, price, updated_at) VALUES (?, ?, ?, ?)',
      [name, description, price, new Date().toISOString()],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error creating service' });
        }
        
        // Return the created service with its ID
        const newService = {
          id: this.lastID,
          name,
          description,
          price,
          updated_at: new Date().toISOString()
        };
        
        console.log('Service created:', newService);
        res.status(201).json(newService);
      }
    );
  } catch (error) {
    console.error('Server error:', error);
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

// Delete service (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    db.run('DELETE FROM services WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting service' });
      }
      res.json({ message: 'Service deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
