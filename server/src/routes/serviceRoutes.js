
// server/src/routes/serviceRoutes.js
import express from 'express';
import db from '../config/database.js';
import authMiddleware from '../middleware/sessionMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    db.all('SELECT * FROM services', [], (err, services) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      console.log('Services from DB:', services); // Add this
      res.json(services);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new service (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, features } = req.body;  // Add features here
  
  // Add validation
  if (!name || !description || !price) {
    return res.status(400).json({ 
      message: 'Name, description, and price are required' 
    });
  }
  try {
    // Log the incoming request
    console.log('Creating service:', { name, description, price, features });
    db.run(
      'INSERT INTO services (name, description, price, features, updated_at) VALUES (?, ?, ?, ?, ?)',  // Add features column
      [name, description, price, features, new Date().toISOString()],  // Add features parameter
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
          features,  // Add features here
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
        res.json({ id, name, description, price, features });
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

export default router;

