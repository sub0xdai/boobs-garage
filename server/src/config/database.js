// server/src/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../db/bobs_garage.sqlite');

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to SQLite database');
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Create tables if they don't exist
  initializeTables();
  
  // Create admin user after tables are created
  try {
    await createAdminUser();
    console.log('Admin user created or already exists');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
});

// Create admin user function as a Promise
function createAdminUser() {
  return new Promise(async (resolve, reject) => {
    try {
      const password = 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      db.run(`
        INSERT OR IGNORE INTO users 
        (username, email, password_hash, is_admin, created_at) 
        VALUES (?, ?, ?, ?, ?)
      `, 
        ['admin', 'admin@bobsgarage.com', hashedPassword, 1, new Date().toISOString()],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function initializeTables() {
  const tables = [`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      last_login TEXT,
      session_token TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER,
      image_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`];

  tables.forEach(table => {
    db.run(table, err => {
      if (err) {
        console.error('Error creating table:', err);
      }
    });
  });
}

module.exports = db;
