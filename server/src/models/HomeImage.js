// server/src/models/homeImage.js
import db from '../config/database.js';

const HomeImage = {
  findOne: (options) => {
    return new Promise((resolve, reject) => {
      console.log('Finding home image with options:', options);
      
      const query = `
        SELECT * FROM home_images 
        WHERE active = 1 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      
      db.get(query, [], (err, row) => {
        if (err) {
          console.error('Error finding home image:', err);
          reject(err);
          return;
        }
        console.log('Found home image:', row);
        resolve(row);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      console.log('Creating home image with data:', data);
      const now = new Date().toISOString();
      
      // Begin transaction
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // First deactivate current active images
        db.run(
          'UPDATE home_images SET active = 0 WHERE active = 1',
          [],
          (err) => {
            if (err) {
              console.error('Error deactivating current images:', err);
              db.run('ROLLBACK');
              reject(err);
              return;
            }

            // Then insert new image
            db.run(
              `INSERT INTO home_images (imageUrl, active, created_at, updated_at)
               VALUES (?, 1, ?, ?)`,
              [data.imageUrl, now, now],
              function(err) {
                if (err) {
                  console.error('Error inserting new image:', err);
                  db.run('ROLLBACK');
                  reject(err);
                  return;
                }

                const newId = this.lastID;
                
                // Get the created image
                db.get(
                  'SELECT * FROM home_images WHERE id = ?',
                  [newId],
                  (err, row) => {
                    if (err) {
                      console.error('Error fetching created image:', err);
                      db.run('ROLLBACK');
                      reject(err);
                      return;
                    }

                    db.run('COMMIT');
                    console.log('Successfully created home image:', row);
                    resolve(row);
                  }
                );
              }
            );
          }
        );
      });
    });
  },

  update: (updates, conditions) => {
    return new Promise((resolve, reject) => {
      console.log('Updating home image:', { updates, conditions });
      const now = new Date().toISOString();
      
      db.run(
        'UPDATE home_images SET active = ?, updated_at = ? WHERE active = ?',
        [updates.active ? 1 : 0, now, conditions.active ? 1 : 0],
        (err) => {
          if (err) {
            console.error('Error updating home image:', err);
            reject(err);
            return;
          }
          console.log('Successfully updated home image');
          resolve();
        }
      );
    });
  }
};

// Verify table exists when module loads
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='home_images'", [], (err, row) => {
  if (err) {
    console.error('Error checking for home_images table:', err);
    return;
  }
  if (!row) {
    console.error('home_images table does not exist!');
  } else {
    console.log('home_images table verified');
  }
});

export default HomeImage;
