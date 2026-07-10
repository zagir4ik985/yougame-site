document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.toggle('open');
    });
  }

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
          if (themeLabel) {
            themeLabel.textContent = theme === 'dark-glass' ? 'Тёмная' : 'Светлая';
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
          errorEl.style.color = '#00e5a0';
          errorEl.textContent = 'Пароль изменён!';
          passwordForm.reset();
          setTimeout(() => { errorEl.textContent = ''; errorEl.style.color = '#ff4466'; }, 3000);
        } else {
          errorEl.textContent = result.error || 'Ошибка';
        }
      } catch {
        errorEl.textContent = 'Ошибка сервера';
      }
    });
  }
});
