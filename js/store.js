/* ===================================================================
   Teman Digital — store.js
   Lapisan "database" simulasi berbasis localStorage.

   >>> CATATAN PENTING BUAT PRODUCTION <<<
   File ini HANYA untuk demo/prototype. Password disimpan apa adanya
   di browser (tidak aman untuk data sungguhan). Saat sudah punya
   backend asli, ganti seluruh fungsi di sini dengan pemanggilan API
   (fetch ke server), dan proses pembayaran harus lewat payment
   gateway resmi (Midtrans/Xendit/dll) di sisi SERVER, bukan di sini.
   =================================================================== */

const DB_KEYS = {
  PRODUCTS: 'kp_products',
  USERS: 'kp_users',
  ORDERS: 'kp_orders',
  CART: 'kp_cart',
  SESSION: 'kp_session',
  BANNERS: 'kp_banners',
};

function readDB(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Gagal membaca', key, e);
    return fallback;
  }
}
function writeDB(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function uid(prefix) {
  return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function formatRupiah(n) {
  return 'Rp' + Number(n).toLocaleString('id-ID');
}

/* ---------------- Seed data ----------------
   >>> CATATAN PENTING <
   Tiap kali kamu ubah/tambah data produk di bawah (nama, harga, ikon,
   logo, dll), NAIKKAN ANGKA SEED_VERSION INI +1 lalu simpan.
   Semua browser (kamu & temen kelompok) otomatis ambil data produk
   terbaru pas buka lagi — TIDAK perlu hapus localStorage manual.
   Data user, riwayat pesanan & keranjang TIDAK ikut kereset. */
const SEED_VERSION = 2;
const ADMIN_PASSWORD_VERSION = 1;
function seedIfEmpty() {
  const savedVersion = Number(localStorage.getItem('kp_seed_version') || 0);
  const needsReseed = savedVersion < SEED_VERSION || !localStorage.getItem(DB_KEYS.PRODUCTS);

  if (needsReseed) {
    const EWALLET_PROVIDERS = [
      { code: 'dana', name: 'DANA', icon: 'D', logo: 'assets/img/dana.jpg' },
      { code: 'gopay', name: 'GoPay', icon: 'G', logo: 'assets/img/gopay.jpg' },
      { code: 'ovo', name: 'OVO', icon: 'O', logo: 'assets/img/ovo.jpg' },
      { code: 'shopeepay', name: 'ShopeePay', icon: 'S', logo: 'assets/img/shoppe pay.jpg' },
      { code: 'linkaja', name: 'LinkAja', icon: 'L', logo: 'assets/img/link aja.jpg' },
    ];
    const EWALLET_TIERS = [
      { nominals: [10000, 25000, 50000], fee: 2500 },
      { nominals: [100000, 150000, 200000], fee: 5000 },
    ];
    const ewalletProducts = [];
    EWALLET_PROVIDERS.forEach(prov => {
      EWALLET_TIERS.forEach(tier => {
        tier.nominals.forEach(nominal => {
          ewalletProducts.push({
            id: `ew-${prov.code}-${nominal}`,
            category: 'ewallet',
            provider: prov.name,
            name: `${prov.name} Rp${nominal.toLocaleString('id-ID')}`,
            desc: `Saldo masuk Rp${nominal.toLocaleString('id-ID')} (biaya admin Rp${tier.fee.toLocaleString('id-ID')})`,
            price: nominal + tier.fee,
            icon: prov.icon,
            logo: prov.logo || undefined,
            popular: nominal === 50000,
          });
        });
      });
    });

    const premiumProducts = [
      { id: 'pr-gemini-1', category: 'premium', provider: 'Gemini Pro', name: 'Gemini Pro 1 Bulan', desc: 'Akses Gemini Advanced & integrasi Google Workspace', price: 11000, icon: 'G', popular: true, logo: 'assets/img/gemini.jpg' },
      { id: 'pr-chatgpt-1', category: 'premium', provider: 'ChatGPT Pro', name: 'ChatGPT Plus 1 Bulan', desc: 'Akses model terbaru & prioritas penggunaan', price: 20000, icon: 'C', popular: true, logo: 'assets/img/chatgpt.jpg' },
      { id: 'pr-netflix-1', category: 'premium', provider: 'Netflix', name: 'Netflix Premium 1 Bulan', desc: 'Sharing 1 profil, kualitas Ultra HD', price: 37000, icon: 'N', logo: 'assets/img/netflix.jpg' },
      { id: 'pr-vidio-1', category: 'premium', provider: 'Vidio Platinum', name: 'Vidio Platinum 1 Bulan', desc: 'Live sport & serial eksklusif', price: 19500, icon: 'V', logo: 'assets/img/vidio.jpg' },
      { id: 'pr-canva-1', category: 'premium', provider: 'Canva Pro', name: 'Canva Pro 1 Bulan', desc: 'Akses semua template & fitur AI', price: 5000, icon: 'C', logo: 'assets/img/Logo Canva.jpg' },
      { id: 'pr-capcut-1', category: 'premium', provider: 'CapCut Pro', name: 'CapCut Pro 1 Bulan', desc: 'Efek & template premium, ekspor tanpa watermark', price: 18000, icon: 'C',logo: 'assets/img/CapCut Apks.jpg'  },
      { id: 'pr-alight-1', category: 'premium', provider: 'Alight Motion Pro', name: 'Alight Motion Pro 1 Bulan', desc: 'Aset premium & ekspor tanpa watermark', price: 8000, icon: 'A', logo: 'assets/img/Alight motion logo.jpg' },
      { id: 'pr-youtube-1', category: 'premium', provider: 'YouTube Premium', name: 'YouTube Premium 1 Bulan', desc: 'Bebas iklan + YouTube Music', price: 10000, icon: 'Y', logo:'assets/img/youtube.jpg' },
    ];

        writeDB(DB_KEYS.PRODUCTS, [...ewalletProducts, ...premiumProducts]);
    localStorage.setItem('kp_seed_version', String(SEED_VERSION));
  }

    if (!localStorage.getItem(DB_KEYS.USERS)) {
    const users = [
      {
        id: uid('usr'),
        name: 'Admin Teman Digital',
        email: 'admin@temandigital.id',
        phone: '085792827315',
        password: 'admin123', // <-- ganti password admin di sini
        role: 'admin',
        createdAt: Date.now(),
      },
    ];
    writeDB(DB_KEYS.USERS, users);
    localStorage.setItem('kp_admin_pw_version', String(ADMIN_PASSWORD_VERSION));
  } else {
    // USERS udah pernah ada di browser ini (bukan browser baru).
    // Blok ini SYNC password admin kalau ADMIN_PASSWORD_VERSION dinaikkan,
    // tanpa menghapus akun lain yang udah keburu register duluan.
    const savedPwVersion = Number(localStorage.getItem('kp_admin_pw_version') || 0);
    if (savedPwVersion < ADMIN_PASSWORD_VERSION) {
      const users = readDB(DB_KEYS.USERS, []);
      const admin = users.find(u => u.role === 'admin');
      if (admin) admin.password = 'admin123'; // <-- samain dengan password baru di atas
      writeDB(DB_KEYS.USERS, users);
      localStorage.setItem('kp_admin_pw_version', String(ADMIN_PASSWORD_VERSION));
    }
  }

  if (!localStorage.getItem(DB_KEYS.ORDERS)) writeDB(DB_KEYS.ORDERS, []);
  if (!localStorage.getItem(DB_KEYS.CART)) writeDB(DB_KEYS.CART, []);
}
seedIfEmpty();

/* ---------------- Warna identitas brand (bukan logo asli) ----------------
   Karena logo resmi tiap aplikasi berhak cipta, tiap produk ditampilkan
   sebagai badge berwarna khas brand tsb + inisial, bukan file logo asli. */
const BRAND_COLORS = {
  'dana': { bg: '#118EEA', fg: '#FFFFFF' },
  'gopay': { bg: '#00AA5B', fg: '#FFFFFF' },
  'ovo': { bg: '#4C2A86', fg: '#FFFFFF' },
  'shopeepay': { bg: '#EE4D2D', fg: '#FFFFFF' },
  'linkaja': { bg: '#E4252B', fg: '#FFFFFF' },
  'gemini pro': { bg: '#4285F4', fg: '#FFFFFF' },
  'chatgpt pro': { bg: '#10A37F', fg: '#FFFFFF' },
  'netflix': { bg: '#E50914', fg: '#FFFFFF' },
  'vidio premium': { bg: '#1CA1E0', fg: '#FFFFFF' },
  'canva pro': { bg: '#00C4CC', fg: '#FFFFFF' },
  'capcut pro': { bg: '#0AC9B8', fg: '#FFFFFF' },
  'alight motion pro': { bg: '#7B2FF7', fg: '#FFFFFF' },
  'youtube premium': { bg: '#FF0000', fg: '#FFFFFF' },
};
function brandColor(provider) {
  const key = (provider || '').toLowerCase().trim();
  if (BRAND_COLORS[key]) return BRAND_COLORS[key];
  // fallback: warna konsisten hasil hash nama provider, bukan acak tiap reload
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return { bg: `hsl(${hue}, 55%, 42%)`, fg: '#FFFFFF' };
}

/* ---------------- Banner promo (slider iklan di beranda) ---------------- */
const Banners = {
  all() {
    return readDB(DB_KEYS.BANNERS, [
      { id: 'b1', title: 'Promo Netflix Premium', subtitle: 'Perpanjang langganan favoritmu, diproses instan hari ini.', cta: 'Lihat langganan', link: '#premium', image: 'assets/img/netflixbanner.jpg' },
      { id: 'b4', title: 'Vidio Premium 1 Bulan', subtitle: 'Nonton live sport & serial eksklusif tanpa iklan, aktif langsung.', cta: 'Langganan sekarang', link: '#premium', image: 'assets/img/vidiobanner.jpg' },
      { id: 'b5', title: 'Canva Pro sebulan penuh', subtitle: 'Semua template & fitur AI Canva, cocok buat tugas & konten.', cta: 'Langganan sekarang', link: '#premium', image: 'assets/img/canvabanner.jpg' },
      { id: 'b3', title: 'Member baru dapat harga spesial', subtitle: 'Daftar sekarang dan nikmati proses otomatis 24 jam nonstop.', cta: 'Daftar gratis', link: 'register.html', colorFrom: '#C1432F', colorTo: '#E8703A' },
    ]);
  },
};

/* ---------------- Products ---------------- */
const Products = {
  all() { return readDB(DB_KEYS.PRODUCTS, []); },
  popularIds(limit = 3) {
    const tally = {};
    Orders.all().forEach(o => {
      (o.items || []).forEach(i => {
        tally[i.productId] = (tally[i.productId] || 0) + i.qty;
      });
    });
    const ranked = Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([id]) => id);
    if (ranked.length > 0) return ranked.slice(0, limit);
    // belum ada transaksi sama sekali (misal web baru) → fallback ke penanda manual di data produk
    return this.all().filter(p => p.popular).map(p => p.id);
  },
  byCategory(cat) { return this.all().filter(p => cat === 'all' ? true : p.category === cat); },
  byId(id) { return this.all().find(p => p.id === id); },
  search(q) {
    q = (q || '').toLowerCase().trim();
    if (!q) return this.all();
    return this.all().filter(p =>
      p.name.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q)
    );
  },
  add(product) {
    const list = this.all();
    product.id = product.id || uid('pr');
    list.push(product);
    writeDB(DB_KEYS.PRODUCTS, list);
    return product;
  },
  update(id, patch) {
    const list = this.all();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch };
    writeDB(DB_KEYS.PRODUCTS, list);
    return list[idx];
  },
  remove(id) {
    writeDB(DB_KEYS.PRODUCTS, this.all().filter(p => p.id !== id));
  },
};

/* ---------------- Users / Auth ---------------- */
const Auth = {
  users() { return readDB(DB_KEYS.USERS, []); },
  findByEmail(email) {
    email = (email || '').toLowerCase().trim();
    return this.users().find(u => u.email.toLowerCase() === email);
  },
    register({ name, email, phone, password }) {
    if (password.length < 6) {
      return { ok: false, error: 'Kata sandi minimal 6 karakter.' };
    }
    if (!/^(0|62|\+62)8[0-9]{8,11}$/.test(phone)) {
      return { ok: false, error: 'Format nomor HP tidak valid. Contoh: 08123456789' };
    }
    if (this.findByEmail(email)) {
      return { ok: false, error: 'Email sudah terdaftar. Coba login.' };
    }
    const users = this.users();
    const user = { id: uid('usr'), name, email, phone, password, role: 'user', createdAt: Date.now() };
    users.push(user);
    writeDB(DB_KEYS.USERS, users);
    this.setSession(user.id);
    return { ok: true, user };
  },
  login(email, password) {
    const user = this.findByEmail(email);
    if (!user || user.password !== password) {
      return { ok: false, error: 'Email atau kata sandi salah.' };
    }
    this.setSession(user.id);
    return { ok: true, user };
  },
  setSession(userId) { writeDB(DB_KEYS.SESSION, { userId }); },
  logout() { localStorage.removeItem(DB_KEYS.SESSION); },
  currentUser() {
    const s = readDB(DB_KEYS.SESSION, null);
    if (!s) return null;
    return this.users().find(u => u.id === s.userId) || null;
  },
  isLoggedIn() { return !!this.currentUser(); },
  isAdmin() {
    const u = this.currentUser();
    return !!u && u.role === 'admin';
  },
  requireLogin(redirectTo) {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html' + (redirectTo ? ('?next=' + encodeURIComponent(redirectTo)) : '');
      return false;
    }
    return true;
  },
  requireAdmin() {
    if (!this.isAdmin()) {
      window.location.href = 'login.html?next=admin.html';
      return false;
    }
    return true;
  },
};

/* ---------------- Cart ---------------- */
const Cart = {
  items() { return readDB(DB_KEYS.CART, []); },
  count() { return this.items().reduce((n, i) => n + i.qty, 0); },
  add(productId, qty) {
    qty = qty || 1;
    const items = this.items();
    const found = items.find(i => i.productId === productId);
    if (found) found.qty += qty; else items.push({ productId, qty });
    writeDB(DB_KEYS.CART, items);
  },
  setQty(productId, qty) {
    let items = this.items();
    if (qty <= 0) { items = items.filter(i => i.productId !== productId); }
    else { const f = items.find(i => i.productId === productId); if (f) f.qty = qty; }
    writeDB(DB_KEYS.CART, items);
  },
  remove(productId) { writeDB(DB_KEYS.CART, this.items().filter(i => i.productId !== productId)); },
  clear() { writeDB(DB_KEYS.CART, []); },
  detailed() {
    return this.items().map(i => {
      const p = Products.byId(i.productId);
      return p ? { ...i, product: p, subtotal: p.price * i.qty } : null;
    }).filter(Boolean);
  },
  total() { return this.detailed().reduce((n, i) => n + i.subtotal, 0); },
};

/* ---------------- Orders ---------------- */
const Orders = {
  all() { return readDB(DB_KEYS.ORDERS, []); },
  byUser(userId) { return this.all().filter(o => o.userId === userId).sort((a, b) => b.createdAt - a.createdAt); },
  byId(id) { return this.all().find(o => o.id === id); },
  create({ userId, items, total, method, targetAccount }) {
    const orders = this.all();
    const order = {
      id: uid('KP').toUpperCase(),
      userId, items, total, method, targetAccount,
      status: 'pending',
      createdAt: Date.now(),
    };
    orders.unshift(order);
    writeDB(DB_KEYS.ORDERS, orders);
    return order;
  },
  updateStatus(id, status) {
    const orders = this.all();
    const o = orders.find(o => o.id === id);
    if (o) { o.status = status; writeDB(DB_KEYS.ORDERS, orders); }
    return o;
  },
  /* Simulasi proses pembayaran otomatis.
     >>> Di production, ini diganti dengan webhook/callback asli dari
     payment gateway (Midtrans/Xendit) yang memberi tahu status bayar. */
  simulateProcessing(id, delayMs = 1800) {
    setTimeout(() => { this.updateStatus(id, 'sukses'); }, delayMs);
  },
};

/* ---------------- WhatsApp checkout ----------------
   Pembayaran & pengiriman produk dikonfirmasi manual oleh admin lewat WA.
   >>> GANTI nomor di bawah ini dengan nomor WhatsApp admin/toko kamu <<<
   Format: kode negara tanpa "+" atau "0" di depan, contoh 62812xxxxxxx */
const ADMIN_WHATSAPP_NUMBER = '6285792827315';

function buildWhatsAppMessage(order) {
  const lines = [
    'Halo Admin Teman Digital, saya mau konfirmasi pesanan berikut:',
    '',
    `No. Pesanan: ${order.id}`,
    'Produk:',
    ...order.items.map(i => `- ${i.name} x${i.qty} (${formatRupiah(i.price * i.qty)})`),
    '',
    `Total: ${formatRupiah(order.total)}`,
    `Nomor/akun tujuan: ${order.targetAccount}`,
    '',
    'Mohon info cara pembayarannya ya. Terima kasih!',
  ];
  return lines.join('\n');
}
function whatsappOrderLink(order) {
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`;
}
