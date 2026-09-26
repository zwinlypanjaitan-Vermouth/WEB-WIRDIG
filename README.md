# Teman Digital — Website Top Up E-Wallet & Langganan Aplikasi Premium

Website statis (HTML/CSS/JS) siap upload ke hosting mana pun (shared hosting, Netlify, Vercel, GitHub Pages, dll). Tidak butuh instalasi server khusus untuk versi demo ini.

## Fitur
- Mode terang & gelap (tombol 🌙/☀️ di navbar, tersimpan otomatis per pengunjung)
- Banner promo geser otomatis di beranda (bisa juga digeser manual)
- Katalog e-wallet dikelompokkan per provider (DANA, GoPay, dll) — klik provider untuk pilih nominal lewat pop-up
- Tombol **+ Keranjang** (checkout multi-langkah biasa) dan **Pesan** (langsung buat pesanan & diarahkan ke WhatsApp) di tiap produk
- Login, riwayat transaksi, dan panel admin (kelola produk & status pesanan)

## ⚠️ Wajib diganti sebelum dipakai
Buka `js/store.js`, cari baris berikut dan ganti dengan nomor WhatsApp toko kamu:
```js
const ADMIN_WHATSAPP_NUMBER = '6281234567890';
```
Format: kode negara `62` + nomor tanpa angka `0` di depan (contoh: `6281298765432`).

## Struktur file
```
kilatpay/
├── index.html      -> Beranda + katalog produk
├── login.html      -> Halaman masuk
├── register.html   -> Halaman daftar akun
├── checkout.html   -> Keranjang & proses checkout
├── akun.html       -> Riwayat transaksi & profil user
├── admin.html      -> Panel admin (kelola produk & pesanan)
├── css/style.css
└── js/
    ├── store.js    -> "Database" simulasi (localStorage)
    └── nav.js      -> Logika navbar (status login, badge keranjang)
```

## Cara upload ke hosting
1. Upload seluruh isi folder `kilatpay/` ke `public_html` (atau root direktori web) di hosting kamu lewat File Manager / FTP.
2. Pastikan `index.html` ada di root folder tersebut.
3. Arahkan domain ke folder itu (biasanya otomatis kalau taruh di `public_html`).
4. Selesai — buka domain kamu, website langsung jalan.

## Akun admin bawaan (demo)
- Email: `admin@temandigital.id`
- Kata sandi: `admin123`

Login dengan akun ini untuk mengakses Panel Admin (link muncul di halaman Akun setelah login).

## ⚠️ Batasan versi demo ini
Website ini **frontend-only**, datanya (user, produk, pesanan) disimpan di `localStorage` browser kamu masing-masing — bukan di server. Artinya:
- Data tidak sinkron antar perangkat/browser berbeda.
- Kalau cache/localStorage browser dihapus, data ikut hilang.
- Password disimpan apa adanya (tidak terenkripsi) — **jangan dipakai untuk data pengguna asli**.
- Tombol "bayar" hanya simulasi (status otomatis berubah jadi "sukses" setelah beberapa detik).

## Langkah lanjut kalau mau jualan beneran
Supaya bisa dipakai transaksi nyata, kamu butuh **backend/server**, minimal:
1. **Database asli** (MySQL/PostgreSQL/Firebase) untuk menyimpan user, produk, dan pesanan — ganti fungsi-fungsi di `js/store.js` menjadi pemanggilan API (`fetch`) ke server.
2. **Autentikasi aman** — hash password (bcrypt) & session/token di server, jangan simpan password polos di browser.
3. **Payment gateway resmi** — misalnya Midtrans, Xendit, atau Tripay (populer untuk bisnis PPOB di Indonesia). Proses pembayaran & konfirmasi (webhook) harus terjadi di server, bukan di JavaScript sisi pengguna.
4. **Integrasi supplier produk digital** — untuk top up e-wallet & voucher premium asli, biasanya kamu perlu daftar ke provider H2H (host-to-host) seperti Digiflazz, atau kerja sama resmi dengan penyedia layanan.

Kalau nanti sudah siap ke tahap ini, bagian yang perlu diganti sudah ditandai dengan komentar `>>> CATATAN PENTING <<<` di dalam `js/store.js`.
