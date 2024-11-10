import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory exists
const dbDir = path.resolve(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'bobs_garage.sqlite');
console.log('Database path:', dbPath); // Debug log
const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to SQLite database');

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Create tables if they don't exist
  await initializeTables();

  // Add the last_login column if it doesn't exist
  await addLastLoginColumn();

  // Create admin user after tables are created
  try {
    await createAdminUser();
    console.log('Admin user created or already exists');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
});

// Function to add the last_login column if it doesn't already exist
function addLastLoginColumn() {
  return new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(users);", (err, rows) => {
      if (err) {
        return reject(err);
      }
      
      const hasLastLogin = rows.some(row => row.name === 'last_login');
      if (!hasLastLogin) {
        db.run("ALTER TABLE users ADD COLUMN last_login TEXT;", (err) => {
          if (err) {
            console.error('Error adding last_login column:', err);
            return reject(err);
          }
          console.log('Added last_login column to users table');
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

function addStatusColumn(db) {
  return new Promise((resolve, reject) => {
    db.run(`ALTER TABLE feedback ADD COLUMN status TEXT DEFAULT 'pending'`, (err) => {
      if (err) {
        // If error is about column already existing, that's fine
        if (err.message.includes('duplicate column name')) {
          resolve();
          return;
        }
        console.error('Error adding status column:', err);
        reject(err);
      } else {
        console.log('Status column added successfully');
        resolve();
      }
    });
  });
}

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
    `CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
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

export default db;

