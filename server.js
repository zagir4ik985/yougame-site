const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { optionalAuth } = require('./middleware/auth');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/settings', require('./routes/settings'));

app.use(optionalAuth);

app.get('/', (req, res) => {
  const categories = db.prepare('SELECT DISTINCT category FROM products').all();
  const products = db.prepare('SELECT * FROM products ORDER BY downloads DESC').all();
  res.render('index', {
    user: req.user || null,
    products,
    categories: categories.map(c => c.category)
  });
});

app.get('/login', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('login', { user: null });
});

app.get('/register', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('register', { user: null });
});

app.get('/product/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).render('404', { user: req.user || null });
  res.render('product', { user: req.user || null, product });
});

app.get('/settings', (req, res) => {
  if (!req.user) return res.redirect('/login');
  const user = db.prepare('SELECT id, username, email, theme FROM users WHERE id = ?').get(req.user.id);
  res.render('settings', { user });
});

app.get('/downloads', (req, res) => {
  if (!req.user) return res.redirect('/login');
  const downloads = db.prepare(`
    SELECT p.*, d.downloaded_at FROM downloads d
    JOIN products p ON p.id = d.product_id
    WHERE d.user_id = ?
    ORDER BY d.downloaded_at DESC
  `).all(req.user.id);
  const user = db.prepare('SELECT id, username, email, theme FROM users WHERE id = ?').get(req.user.id);
  res.render('downloads', { user, downloads });
});

app.listen(PORT, () => {
  console.log(`YouGame server started on http://localhost:${PORT}`);
});
