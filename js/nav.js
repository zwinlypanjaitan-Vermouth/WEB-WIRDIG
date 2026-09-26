/* Perbarui bagian navbar yang bergantung pada status login & isi keranjang.
   Dipanggil di setiap halaman setelah DOM siap. */
function renderNavState() {
  const cartCountEls = document.querySelectorAll('[data-cart-count]');
  const count = Cart.count();
  cartCountEls.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });

  const authSlot = document.querySelector('[data-auth-slot]');
  if (!authSlot) return;
  const user = Auth.currentUser();
  if (user) {
    authSlot.innerHTML = `
      <a class="user-chip" href="akun.html">
        <span>Halo, <strong>${user.name.split(' ')[0]}</strong></span>
        ${user.role === 'admin' ? '<span class="tag-role">Admin</span>' : ''}
      </a>
      <button class="btn btn-ghost btn-sm" id="logoutBtn" type="button">Keluar</button>
    `;
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      Auth.logout();
      window.location.href = 'index.html';
    });
  } else {
    authSlot.innerHTML = `
      <a class="btn btn-ghost btn-sm" href="login.html">Masuk</a>
      <a class="btn btn-primary btn-sm" href="register.html">Daftar</a>
    `;
  }
}
document.addEventListener('DOMContentLoaded', renderNavState);
