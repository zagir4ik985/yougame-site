document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.toggle('open');
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('.product-card-title')?.textContent?.toLowerCase() || '';
        card.style.display = title.includes(q) ? 'block' : 'none';
      });
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;

      try {
        const url = category === 'all' ? '/api/products' : `/api/products?category=${category}`;
        const res = await fetch(url);
        const data = await res.json();

        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        if (data.products.length === 0) {
          grid.innerHTML = `<div class="empty-state glass-card"><i class="fas fa-box-open fa-4x"></i><p>Ничего не найдено</p></div>`;
          return;
        }

        grid.innerHTML = data.products.map(p => `
          <a href="/product/${p.id}" class="product-card glass-card">
            <div class="product-card-img"><i class="fas fa-cubes"></i></div>
            <div class="product-card-body">
              <h3 class="product-card-title">${escHtml(p.title)}</h3>
              <p class="product-card-desc">${escHtml((p.description || '').substring(0, 80))}${(p.description || '').length > 80 ? '...' : ''}</p>
              <div class="product-card-meta">
                <span class="badge">${escHtml(p.version)}</span>
                <span class="download-count"><i class="fas fa-download"></i> ${p.downloads}</span>
              </div>
            </div>
          </a>
        `).join('');
      } catch (err) {
        console.error('Filter error:', err);
      }
    });
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData);
      const errorEl = document.getElementById('authError');

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
          window.location.href = '/';
        } else {
          errorEl.textContent = result.error || 'Ошибка входа';
        }
      } catch {
        errorEl.textContent = 'Ошибка сервера';
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const data = Object.fromEntries(formData);
      const errorEl = document.getElementById('authError');

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
          window.location.href = '/';
        } else {
          errorEl.textContent = result.error || 'Ошибка регистрации';
        }
      } catch {
        errorEl.textContent = 'Ошибка сервера';
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    });
  }

  const downloadBtns = document.querySelectorAll('.btn-download');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const productId = btn.dataset.productId;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
      btn.disabled = true;

      try {
        const res = await fetch(`/api/products/${productId}/download`, { method: 'POST' });
        const data = await res.json();

        if (data.success) {
          btn.innerHTML = '<i class="fas fa-check"></i> Скачано!';
          setTimeout(() => {
            if (data.download_url && data.download_url !== '#') {
              window.open(data.download_url, '_blank');
            }
          }, 500);
        } else {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      } catch {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  });

  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');

  if (themeToggle) {
    themeToggle.addEventListener('change', async () => {
      const theme = themeToggle.checked ? 'dark-glass' : 'glass';

      try {
        const res = await fetch('/api/settings/theme', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme })
        });
        const data = await res.json();

        if (data.success) {
          document.body.className = theme;
          if (themeLabel) {
            themeLabel.textContent = theme === 'dark-glass' ? 'Тёмное стекло' : 'Стекло';
          }
        }
      } catch (err) {
        console.error('Theme error:', err);
      }
    });
  }

  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(passwordForm);
      const data = Object.fromEntries(formData);
      const errorEl = document.getElementById('passwordError');

      try {
        const res = await fetch('/api/settings/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
          errorEl.style.color = '#51cf66';
          errorEl.textContent = 'Пароль успешно изменён!';
          passwordForm.reset();
          setTimeout(() => { errorEl.textContent = ''; errorEl.style.color = '#ff6b6b'; }, 3000);
        } else {
          errorEl.textContent = result.error || 'Ошибка';
        }
      } catch {
        errorEl.textContent = 'Ошибка сервера';
      }
    });
  }
});

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
