const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    unit TEXT,
    category TEXT,
    brand TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT,
    image TEXT
  )`);

  // Inventory history table
  db.run(`CREATE TABLE IF NOT EXISTS inventory_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    old_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    change_date TEXT NOT NULL,
    changed_by TEXT DEFAULT 'admin',
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  )`);

  // Users table for authentication
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create index for faster lookups
  db.run(`CREATE INDEX IF NOT EXISTS idx_product_name ON products(name)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory_history(product_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_user_email ON users(email)`);
});

module.exports = db;

