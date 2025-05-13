const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = '/tmp/orders.db';

function initializeDb(db) {
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT,
    items TEXT,
    total REAL,
    deliveryOption TEXT,
    address TEXT,
    paymentMethod TEXT,
    gcashNumber TEXT
  )`);
}

function getDb() {
  const db = new sqlite3.Database(dbPath);
  if (!fs.existsSync(dbPath)) {
    initializeDb(db);
  }
  return db;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    customerName,
    items,
    total,
    deliveryOption,
    address,
    paymentMethod,
    gcashNumber,
  } = req.body;

  const db = getDb();

  const stmt = db.prepare(`INSERT INTO orders (
    customerName, items, total, deliveryOption, address, paymentMethod, gcashNumber
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  stmt.run(
    customerName,
    JSON.stringify(items),
    total,
    deliveryOption,
    address,
    paymentMethod,
    gcashNumber,
    function (err) {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.status(200).json({ orderId: this.lastID });
    }
  );
}
