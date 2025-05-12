const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./orders.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create orders table if not exists
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

// POST /order route
app.post('/order', (req, res) => {
  const { customerName, items, total, deliveryOption, address, paymentMethod, gcashNumber } = req.body;

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
        console.error(err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(200).json({ orderId: this.lastID });
      }
    }
  );
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
