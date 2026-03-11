const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, series, price, description, stock, status } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, series, price, description, stock, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, series, price, description, stock || 0, status || 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, series, price, description, stock, status } = req.body;
    const result = await pool.query(
      'UPDATE products SET name = $1, series = $2, price = $3, description = $4, stock = $5, status = $6 WHERE id = $7 RETURNING *',
      [name, series, price, description, stock, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully', id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`NOVA Admin API running on port ${port}`);
});
