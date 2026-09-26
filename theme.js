/* Diterapkan sedini mungkin (dipanggil dari <head>) supaya halaman
   tidak "kedip" salah warna sebelum tema tersimpan diterapkan. */
(function () {
  function getStoredTheme() { return localStorage.getItem('td_theme'); }
  function applyTheme(theme) { document.documentElement.setAttribute('data-theme', theme); }

  const stored = getStoredTheme();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('td_theme', next);
    updateToggleIcon();
  };
  function updateToggleIcon() {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  document.addEventListener('DOMContentLoaded', function () {
    updateToggleIcon();
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.addEventListener('click', window.toggleTheme);
  });
})();
