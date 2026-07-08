const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  let products;

  if (category) {
    products = db.prepare('SELECT * FROM products WHERE category = ? ORDER BY downloads DESC').all(category);
  } else {
    products = db.prepare('SELECT * FROM products ORDER BY downloads DESC').all();
  }

  res.json({ products });
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Продукт не найден' });
  res.json({ product });
});

router.post('/:id/download', authMiddleware, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Продукт не найден' });

  db.prepare('UPDATE products SET downloads = downloads + 1 WHERE id = ?').run(req.params.id);

  const existing = db.prepare('SELECT id FROM downloads WHERE user_id = ? AND product_id = ?').get(req.user.id, req.params.id);
  if (!existing) {
    db.prepare('INSERT INTO downloads (user_id, product_id) VALUES (?, ?)').run(req.user.id, req.params.id);
  }

  res.json({ success: true, download_url: product.download_url });
});

router.get('/:id/downloads', authMiddleware, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Продукт не найден' });
  db.prepare('UPDATE products SET downloads = downloads + 1 WHERE id = ?').run(req.params.id);
  res.redirect(product.download_url);
});

module.exports = router;
