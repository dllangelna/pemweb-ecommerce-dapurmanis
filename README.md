# 🥐 Dapur Manis — Website Toko Kue & Pastry Online

Proyek ini dibuat sebagai tugas **Ujian Tengah Semester (UTS)** mata kuliah **Pemrograman Web**, Program Studi Sarjana Terapan Manajemen Informatika.

Website ini bertema **Toko Kue & Pastry Dapur Manis**, dibangun menggunakan standar **HTML5**, **CSS3 (Burgundy & Warm Beige Aesthetic)**, dan **JavaScript murni (Vanilla JS)** tanpa framework luar.

---

## 📋 Fitur Utama Website

1. **Branding & Logo AI**: Menggunakan logo visual bakery melingkar elegan dengan palet warna burgundy & warm cream (`logo.png`).
2. **5 Voucher Diskon dengan Smart Eligibility (Pilihan Otomatis)**:
   - `MANISBARU` — Diskon 15% untuk pelanggan baru (tanpa syarat belanja).
   - `PAGIMANIS` — Buy 2 Get 1 / Hemat Rp 15.000 khusus pembelian minimal 2 produk kategori Pastry/Croissant.
   - `ULTAHMANIS` — Diskon 25% khusus pemesanan varian Cake & Tart.
   - `DONUT75` — Paket Hemat Rp 15.000 khusus varian Donat.
   - `FREEONGKIR` — Gratis ongkir pengiriman ke alamat minimal belanja Rp 80.000 (khusus Delivery).
   - **Fitur Smart Voucher Picker (Tanpa Ribet Ketik Kode)**: Pelanggan tidak perlu lagi menyalin dan mengetik kode promo secara manual. Cukup klik tombol "Pilih Voucher Promo" di keranjang atau modal checkout. Sistem otomatis memvalidasi apakah isi keranjang memenuhi syarat promo, menampilkan estimasi potongan harga, dan otomatis melepaskan voucher jika komposisi keranjang berubah.
3. **20 Katalog Menu Lengkap**:
   - Terdiri dari aneka varian: *Cake & Tart*, *Pastry*, *Donat*, dan *Cookies/Macaron*.
   - Dilengkapi foto produk berkualitas tinggi dari Unsplash.
   - Fitur **Filter Kategori Dinamis** via JavaScript (Semua, Cake, Pastry, Donat, Cookies).
4. **Keranjang Belanja Interaktif (Cart Drawer & Floating Button)**:
   - Tombol keranjang di header dan tombol floating melayang di pojok kanan bawah dengan badge jumlah item otomatis.
   - Panel keranjang geser (*slide-in drawer*) menampilkan daftar kue, foto, opsi porsi/ukuran, add-on lilin & pisau, catatan ucapan custom, pengatur kuantitas (`-` / `+`), kalkulasi subtotal, dan tombol hapus.
   - **Smart Voucher Banner**: Menampilkan voucher aktif secara estetik serta pintasan untuk memilih atau mengganti voucher langsung.
   - Tersimpan otomatis di **LocalStorage** browser sehingga data pesanan dan voucher tidak hilang saat berpindah halaman atau me-refresh web.
5. **Formulir Checkout & Sistem Pembayaran Modern Efektif**:
   - Formulir checkout lengkap: Nama, Nomor WA, Opsi Pengiriman (Delivery / Ambil Sendiri), Alamat pengiriman, Tanggal & Waktu kirim, Catatan khusus baker, serta opsi pembayaran yang fleksibel.
   - **Pilihan Metode Pembayaran Realistis**:
     - 🟢 **QRIS Instan**: Menampilkan QR Code resmi Dapur Manis langsung di struk digital sesuai total belanja untuk di-scan via GoPay, OVO, Dana, ShopeePay, BCA, atau m-Banking.
     - 🏦 **Transfer Bank**: Pilihan 6 bank (BCA, Mandiri, BRI, BNI, BSI, SeaBank) dilengkapi tombol 1-klik "Salin No. Rekening".
     - 💵 **COD (Bayar di Tempat)**: Pembayaran tunai saat kue tiba atau diambil di toko.
   - **Struk Pesanan Digital & Fitur Unduh Struk**:
     - Status pesanan transparan: `🟡 Menunggu Konfirmasi Toko via WhatsApp` (untuk QRIS & Transfer Bank) dan `💵 Bayar saat Terima Kue (COD)`.
     - **📥 Simpan / Cetak Struk (PDF)**: Menggunakan print stylesheet khusus (`@media print`) yang secara otomatis memformat struk digital Dapur Manis menjadi dokumen rapi dan bersih untuk disimpan langsung sebagai file PDF (`Struk-DapurManis-#DM-xxxx.pdf`) atau dicetak ke kertas.
   - **Sinkronisasi Konfirmasi WhatsApp Tanpa Terpotong**:
     - Tombol konfirmasi mengirim format chat terstruktur penuh ke WhatsApp Admin toko (`0858-1609-8398`) yang di-encode secara presisi (`encodeURIComponent`) sehingga seluruh rincian kue, diskon voucher, total bayar, dan status pembayaran muncul 100% lengkap di chat.
6. **Formulir Kontak Terpusat (Centered)**: Halaman kontak divalidasi dengan regex email dan verifikasi kelengkapan data sebelum dikirim.
7. **Desain Ramah & Responsif**: Menggunakan font **Quicksand** dari Google Fonts dengan nuansa hangat, lembut, dan adaptif di layar smartphone maupun PC.

---

## 📁 Struktur Berkas Proyek

```
UTS/
├── index.html       → Halaman Beranda (Hero, 5 Promo Tiket Voucher, Filter & 20 Menu Produk)
├── tentang.html     → Halaman Tentang Kami (Latar belakang, Visi-Misi, Tim)
├── kontak.html      → Halaman Kontak (Formulir pemesanan posisi tengah + validasi)
├── style.css        → Desain gaya CSS (Burgundy & Warm Beige, Flexbox, Grid, Animasi)
├── script.js        → Logika JavaScript (Event handling, DOM manipulation, Filter, Toast)
├── logo.png         → Logo resmi Dapur Manis hasil prompt AI
├── muffin.jpg       → Foto menu Blueberry Crumble Muffin
├── macaron.jpg      → Foto menu Rainbow Pastel Macarons
└── README.md        → Dokumentasi lengkap tugas UTS
```

---

## 🌐 Cara Menjalankan Website

### 1. Membuka di Komputer Lokal
1. Buka folder `UTS`.
2. Klik ganda pada berkas `index.html`.
3. Website akan otomatis terbuka di browser favorit Anda (Chrome, Edge, Firefox, dll).

### 2. Live Hosting di GitHub Pages
1. Buat repositori baru di akun GitHub Anda (misalnya `uts-pemweb-dapurmanis`).
2. Unggah seluruh berkas proyek ke repositori tersebut.
3. Buka menu **Settings** > **Pages** di repositori GitHub.
4. Pada bagian *Branch*, pilih `main` atau `master` lalu klik **Save**.
5. Website dapat diakses di:  
   `https://<username-github>.github.io/<nama-repo>/`

---

## 🛠️ Rincian Implementasi Teknis (Sesuai Kriteria Penilaian)

### 1. Struktur HTML (Bobot: 20 Poin)
- Menggunakan elemen HTML5 yang semantik: `<header>`, `<nav>`, `<section>`, `<article>`, dan `<footer>`.
- Navigasi antar halaman menggunakan tautan internal dengan indikator kelas `aktif`.
- Header di semua halaman dilengkapi logo gambar `logo.png` dan judul brand.

### 2. Desain CSS (Bobot: 30 Poin)
- **Skema Warna**: Burgundy lembut (`#742835` / `#8c3645`) dan Warm Beige (`#faf6f0` / `#f5ebd9`).
- **Tipografi**: Google Fonts *Quicksand* untuk kesan bakery modern, imut, dan ramah.
- **Tata Letak**: Kombinasi `CSS Flexbox` dan `CSS Grid` untuk susunan 20 menu dan 5 kartu promo.
- **Mikro-Interaksi**: Efek melayang (`transform: translateY(-6px)`), tombol bouncy saat di-hover, serta transisi fade-in.
- **Responsif**: Media query `@media (max-width: 768px)` untuk tampilan mobile yang rapi.

### 3. Fungsionalitas JavaScript (Bobot: 20 Poin)
- **Event Handling**: Event listener untuk tombol filter, klik keranjang, salin kode promo, toggle promo, dan submit form.
- **DOM Manipulation**: Fungsi `tampilkanProduk()` merender elemen kartu produk secara dinamis ke dalam DOM berdasarkan array data JavaScript.
- **Filter Kategori**: Fungsi `filterProduk()` menyaring data produk berdasarkan kategori pilihan secara instan tanpa reload halaman.
- **Animasi & Style via JS**: Notifikasi toast muncul dan menghilang dengan transisi `setTimeout()`.
- **Form Validation & WhatsApp Direct Integration**: Memeriksa kelengkapan input nama, validasi nomor WhatsApp (minimal 9 digit angka), pemilihan kategori kue, dan isi pesan, kemudian otomatis mengarahkan ke chat resmi WhatsApp Admin Toko dengan template pesan yang telah diformat rapi.

### 4. Kreativitas & Estetika (Bobot: 20 Poin)
- Tema toko kue yang konsisten dari logo, penamaan menu, gambar, hingga pilihan tone warna.
- Layout halaman kontak dirancang presisi di tengah layar (*center aligned*).

---

## 👤 Informasi Mahasiswa

| Identitas | Keterangan |
|---|---|
| **Nama Mahasiswa** | *(Silakan isi nama Anda)* |
| **NIM** | *(Silakan isi NIM Anda)* |
| **Program Studi** | Sarjana Terapan Manajemen Informatika |
| **Semester** | 3 |
| **Mata Kuliah** | Pemrograman Web |

---

*Dibuat untuk memenuhi tugas Ujian Tengah Semester (UTS) Pemrograman Web — 2026*
