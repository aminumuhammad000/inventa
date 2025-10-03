// database/db.js
const Database = require("better-sqlite3");
const path = require("path");

// Path to database file
const dbPath = path.join(__dirname, "mydb.sqlite");

// Create or open the database
const db = new Database(dbPath);
console.log("Connected to SQLite database (better-sqlite3).");

// =======================
// Tables Initialization
// =======================
db.prepare(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

// Example insert (only runs once if table empty)
const adminExists = db.prepare("SELECT COUNT(*) AS count FROM admins").get();
if (adminExists.count === 0) {
  db.prepare(`
    INSERT INTO admins (name, role, email, password) 
    VALUES (?, ?, ?, ?)
  `).run("Admin", "superadmin", "admin@inventa.com", "admin");
  console.log("Default superadmin inserted.");
}

db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('sold','active','returned')),
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    unit_price REAL,
    discount REAL,
    cost_price REAL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    customer_id INTEGER,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    payment_method TEXT,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_type TEXT CHECK(order_type IN ('sale','on-credit','side')),
    status TEXT CHECK(status IN ('complete','incomplete','in-progress','returned')),
    requirement TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(customer_id) REFERENCES customers(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_name TEXT NOT NULL,
    logo_url TEXT,
    address TEXT,
    theme_color TEXT,
    email TEXT,
    phone TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    url_src TEXT,
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    start_date DATE,
    end_date DATE
  )
`).run();

// Export the db instance
module.exports = db;
