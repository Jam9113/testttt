const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Log all requests
app.use((req, res, next) => {
  console.log(`>> ${req.method} ${req.url}`);
  next();
});

// Handle orders
app.post('/order', (req, res) => {
  const orderData = req.body;
  console.log('Order received:', orderData);

  // Respond with fake order ID
  res.json({ message: 'Order received!', orderId: Date.now() });
});

// Fallback: Serve frontend.html for all unmatched GET requests (excluding API)
app.get(/^\/(?!order).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'frontend/dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
