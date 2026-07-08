const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, username, email, theme FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

router.put('/theme', authMiddleware, (req, res) => {
  const { theme } = req.body;

  if (!['glass', 'dark-glass'].includes(theme)) {
    return res.status(400).json({ error: 'Некорректная тема' });
  }

  db.prepare('UPDATE users SET theme = ? WHERE id = ?').run(theme, req.user.id);
  res.json({ success: true, theme });
});

router.put('/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ error: 'Текущий пароль неверен' });
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, req.user.id);
  res.json({ success: true });
});

router.get('/downloads', authMiddleware, (req, res) => {
  const downloads = db.prepare(`
    SELECT p.id, p.title, p.version, p.image_url, d.downloaded_at
    FROM downloads d
    JOIN products p ON p.id = d.product_id
    WHERE d.user_id = ?
    ORDER BY d.downloaded_at DESC
  `).all(req.user.id);

  res.json({ downloads });
});

module.exports = router;
