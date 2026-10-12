22// ============================================================
// SCRIPT.JS - Website Dapur Manis
// Fitur:
// 1. Event Handling (Klik promo, filter kategori, tambah keranjang)
// 2. DOM Manipulation (Render dinamis 20 produk & 5 promo)
// 3. Style & Animation (Toast alert, fade-in, card hover)
// 4. Form Validation (Validasi regex email & field wajib)
// ============================================================


// ============================================================
// 1. DATA 5 PROMO / DISKON SPESIAL
// ============================================================
const dataPromo = [
  {
    icon: "🎁",
    badge: "Diskon 15%",
    badgeClass: "badge-diskon",
    judul: "Voucher Pelanggan Baru",
    deskripsi: "Potongan langsung 15% untuk pembelian pertama tanpa minimum belanja.",
    kode: "MANISBARU"
  },
  {
    icon: "🥐",
    badge: "Buy 2 Get 1",
    badgeClass: "badge-free",
    judul: "Morning Pastry Treat",
    deskripsi: "Beli 2 varian croissant atau pastry, gratis 1 glazed donut pilihan.",
    kode: "PAGIMANIS"
  },
  {
    icon: "🎂",
    badge: "Diskon 25%",
    badgeClass: "badge-diskon",
    judul: "Sweet Birthday Cake",
    deskripsi: "Diskon 25% untuk pemesanan kue tart & birthday cake H-3 sebelum acara.",
    kode: "ULTAHMANIS"
  },
  {
    icon: "🍩",
    badge: "Paket Hemat",
    badgeClass: "badge-hemat",
    judul: "Weekend Donut Party",
    deskripsi: "1 Lusin (12 pcs) aneka donat lezat dengan harga spesial Rp 75.000 saja.",
    kode: "DONUT75"
  },
  {
    icon: "🚚",
    badge: "Gratis Ongkir",
    badgeClass: "badge-ongkir",
    judul: "Free Delivery Friday",
    deskripsi: "Gratis ongkos kirim seluruh area kota setiap Jumat minimal belanja Rp 80.000.",
    kode: "FREEONGKIR"
  }
];

function tampilkanPromo() {
  const container = document.getElementById('gridPromo');
  if (!container) return;

  container.innerHTML = '';

  dataPromo.forEach(function(promo) {
    const card = document.createElement('div');
    card.className = 'promo-card fade-in';
    card.innerHTML = `
      <div class="promo-card-body">
        <div class="promo-card-top">
          <div class="promo-icon-wrap">${promo.icon}</div>
          <span class="promo-badge ${promo.badgeClass}">${promo.badge}</span>
        </div>
        <h3>${promo.judul}</h3>
        <p>${promo.deskripsi}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function salinKodePromo(kode, btnElement) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(kode);
  }

  // Jika keranjang ada produknya, cek apakah bisa langsung dipakai
  if (dataKeranjang && dataKeranjang.length > 0 && daftarVoucherValid[kode]) {
    const v = daftarVoucherValid[kode];
    const subtotal = dataKeranjang.reduce(function(sum, item) {
      return sum + (item.hargaAngka * item.jumlah);
    }, 0);
    const syarat = v.cekSyarat(dataKeranjang, subtotal, 'delivery');

    if (syarat.bisa) {
      pilihVoucherLangsung(kode);
      tampilkanNotifikasi('🎉 Voucher "' + kode + '" memenuhi syarat dan langsung terpasang!');
      bukaKeranjang();
      return;
    } else {
      tampilkanNotifikasi('📋 Kode "' + kode + '" disalin! Status: ' + syarat.pesan);
    }
  } else {
    tampilkanNotifikasi('📋 Kode voucher "' + kode + '" berhasil disalin! Anda bisa memilihnya langsung di keranjang atau checkout.');
  }

  // Feedback visual langsung pada tombol yang diklik
  if (btnElement) {
    const teksAsli = btnElement.innerHTML;
    btnElement.innerHTML = '✓ Tersalin!';
    btnElement.classList.add('tersalin');
    setTimeout(function() {
      btnElement.innerHTML = teksAsli;
      btnElement.classList.remove('tersalin');
    }, 2000);
  }
}

function toggleSemuaPromo() {
  const areaPromo = document.getElementById('areaPromo');
  const btn = document.getElementById('btnTogglePromo');
  if (!areaPromo || !btn) return;

  if (areaPromo.style.display === 'none') {
    areaPromo.style.display = 'block';
    btn.innerHTML = '✨ Sembunyikan Promo';
  } else {
    areaPromo.style.display = 'none';
    btn.innerHTML = '🎁 Tampilkan Promo (' + dataPromo.length + ')';
  }
}


// ============================================================
// 2. DATA 20 MENU PRODUK (Pastry, Donat, Cake, Tart, Cookies)
// DENGAN OPSI PORSI (SLICE / HALF / 1 KOTAK TART) & ADD-ON
// ============================================================
const daftarAddonCake = [
  { id: 'lilin-std', nama: 'Lilin Standard (2 Batang)', harga: 0, icon: '🕯️', gratis: true },
  { id: 'lilin-spiral', nama: 'Lilin Spiral Metalik Mewah', harga: 5000, icon: '🕯️' },
  { id: 'lilin-angka', nama: 'Lilin Angka Gold / Rose Gold', harga: 8000, icon: '🕯️' },
  { id: 'lilin-sparkler', nama: 'Lilin Magic Sparkler (Kembang Api Tart)', harga: 12000, icon: '✨' },
  { id: 'topper-hbd', nama: 'Topper Akrilik "Happy Birthday"', harga: 10000, icon: '🎂' },
  { id: 'kartu-ucapan', nama: 'Kartu Ucapan Custom (Greeting Card)', harga: 5000, icon: '💌' },
  { id: 'set-pisau-piring', nama: 'Pisau Tart Segitiga & Piring Set (5 pcs)', harga: 7000, icon: '🍴' },
  { id: 'box-pita-mewah', nama: 'Pita Satin & Box Hampers Eksklusif', harga: 15000, icon: '🎀' }
];

const dataProduk = [
  {
    id: 1,
    nama: "Strawberry Shortcake",
    kategori: "cake",
    deskripsi: "Kue bolu lembut dengan lapisan whipped cream manis dan irisan buah stroberi segar.",
    harga: "Rp 28.000",
    gambar: "images/shortcake.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Potong', sub: 'Camilan santai (1 porsi)', harga: 28000, icon: '🍰' },
      { id: 'half', nama: '1/2 Porsi / Half Tart (12 cm)', sub: 'Cocok untuk 2-3 orang', harga: 68000, icon: '🎂' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (20 cm)', sub: 'Tart utuh spesial perayaan', harga: 130000, icon: '🎂' }
    ]
  },
  {
    id: 2,
    nama: "Fudgy Chocolate Brownie",
    kategori: "cake",
    deskripsi: "Brownies panggang tekstur fudgy pekat cokelat Belgia dengan taburan almond renyah.",
    harga: "Rp 20.000",
    gambar: "images/brownie.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Potong', sub: 'Potongan tebal brownies fudgy', harga: 20000, icon: '🍫' },
      { id: 'half', nama: '1/2 Loyang (Box 6 pcs)', sub: 'Porsi sedang keluarga', harga: 48000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (12 pcs)', sub: 'Loyang penuh lengkap kotak tart', harga: 90000, icon: '🎂' }
    ]
  },
  {
    id: 3,
    nama: "Sweet Berry Cupcake",
    kategori: "cake",
    deskripsi: "Cupcake vanila lembut bertabur buttercream stroberi manis dan hiasan sprinkle lucu.",
    harga: "Rp 25.000",
    gambar: "images/cupcake_berry.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Cupcake personal manis', harga: 25000, icon: '🧁' },
      { id: 'half', nama: '1/2 Porsi (Box 6 pcs)', sub: 'Paket box isi 6 cupcake', harga: 65000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (12 pcs)', sub: 'Kotak hampers tart isi 12 pcs', harga: 120000, icon: '🎂' }
    ]
  },
  {
    id: 4,
    nama: "New York Cheesecake",
    kategori: "cake",
    deskripsi: "Kue keju panggang autentik khas New York dengan crust biskuit gurih dan tekstur lumer.",
    harga: "Rp 32.000",
    gambar: "images/cheesecake_ny.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Potong', sub: '1 potong cheesecake lembut', harga: 32000, icon: '🍰' },
      { id: 'half', nama: '1/2 Porsi / Half Tart (12 cm)', sub: 'Cocok untuk 2-3 orang', harga: 78000, icon: '🎂' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (20 cm)', sub: 'Cheesecake bulat utuh 1 kotak', harga: 145000, icon: '🎂' }
    ]
  },
  {
    id: 5,
    nama: "Pastel Glazed Donuts",
    kategori: "donat",
    deskripsi: "Donat empuk bertekstur fluffy dengan lelehan gula glaze aneka warna pastel yang menggemaskan.",
    harga: "Rp 15.000",
    gambar: "images/donat_pastel.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Donat glaze pastel personal', harga: 15000, icon: '🍩' },
      { id: 'half', nama: '1/2 Porsi / 1/2 Lusin (Box 6 pcs)', sub: 'Pilihan 6 rasa donat pastel', harga: 42000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Lusin (1 Kotak Box Tart)', sub: '12 pcs lengkap box tart perayaan', harga: 78000, icon: '🎁' }
    ]
  },
  {
    id: 6,
    nama: "Matcha Roll Cake",
    kategori: "cake",
    deskripsi: "Bolu gulung aroma matcha Jepang asli dengan isian fresh cream dingin yang lembut.",
    harga: "Rp 22.000",
    gambar: "images/matcha_roll.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Potong', sub: '1 slice bolu gulung matcha', harga: 22000, icon: '🍰' },
      { id: 'half', nama: '1/2 Roll (Bolu 1/2 Porsi)', sub: 'Cocok untuk santap berdua', harga: 52000, icon: '🎂' },
      { id: 'whole', nama: '1 Roll Utuh / 1 Kotak Tart Panjang', sub: 'Roll cake utuh 1 kotak tart', harga: 98000, icon: '🎂' }
    ]
  },
  {
    id: 7,
    nama: "Golden Butter Croissant",
    kategori: "pastry",
    deskripsi: "Croissant berlapis renyah di luar, empuk beraroma butter Prancis premium di dalam.",
    harga: "Rp 28.000",
    gambar: "images/croissant.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Croissant renyah personal', harga: 28000, icon: '🥐' },
      { id: 'half', nama: '1/2 Porsi (Pack Isi 3 Pcs)', sub: 'Pas untuk sarapan keluarga', harga: 75000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Hampers (6 Pcs)', sub: 'Box hampers tart croissant', harga: 140000, icon: '🎁' }
    ]
  },
  {
    id: 8,
    nama: "Velvet Bloom Tart",
    kategori: "cake",
    deskripsi: "Tart red velvet cantik dengan filling cream cheese frosting creamy dan wangi cokelat khas.",
    harga: "Rp 35.000",
    gambar: "images/red_velvet.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Potong', sub: '1 iris tart red velvet mewah', harga: 35000, icon: '🍰' },
      { id: 'half', nama: '1/2 Porsi / Half Tart (12 cm)', sub: 'Cocok untuk 2-3 orang', harga: 85000, icon: '🎂' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (20 cm)', sub: 'Tart utuh spesial perayaan megah', harga: 160000, icon: '🎂' }
    ]
  },
  {
    id: 9,
    nama: "Parisian Chocolate Eclair",
    kategori: "pastry",
    deskripsi: "Choux pastry panjang dengan isian custard vanila lezat dan topping cokelat ganache mengkilap.",
    harga: "Rp 32.000",
    gambar: "images/eclair.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Eclair cokelat ganache personal', harga: 32000, icon: '🥖' },
      { id: 'half', nama: '1/2 Porsi (Pack Isi 3 Pcs)', sub: 'Paket bertiga santai', harga: 88000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Hampers (6 Pcs)', sub: 'Kotak hampers tart eclair', harga: 165000, icon: '🎁' }
    ]
  },
  {
    id: 10,
    nama: "Cinnamon Sugar Ring Donut",
    kategori: "donat",
    deskripsi: "Donat kentang tradisional empuk berbalut gula pasir halus dan bubuk kayu manis wangi.",
    harga: "Rp 14.000",
    gambar: "images/donat_cinnamon.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Donat kayu manis personal', harga: 14000, icon: '🍩' },
      { id: 'half', nama: '1/2 Porsi / 1/2 Lusin (Box 6 pcs)', sub: 'Paket box isi 6 donat', harga: 39000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Lusin (1 Kotak Box Tart)', sub: '12 pcs dalam box tart pesta', harga: 72000, icon: '🎁' }
    ]
  },
  {
    id: 11,
    nama: "Blueberry Crumble Muffin",
    kategori: "pastry",
    deskripsi: "Muffin lembut berisi selai dan buah blueberry segar dengan topping crumble renyah gurih.",
    harga: "Rp 26.000",
    gambar: "images/muffin.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Muffin crumble blueberry hangat', harga: 26000, icon: '🧁' },
      { id: 'half', nama: '1/2 Porsi (Pack Isi 3 Pcs)', sub: 'Paket bertiga lezat', harga: 72000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Hampers (6 Pcs)', sub: 'Kotak hampers tart muffin', harga: 138000, icon: '🎁' }
    ]
  },
  {
    id: 12,
    nama: "Classic Italian Tiramisu",
    kategori: "cake",
    deskripsi: "Perpaduan ladyfinger berlumur espresso kopi harum, mascarpone lembut, dan bubuk kakao.",
    harga: "Rp 30.000",
    gambar: "images/tiramisu.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Cup', sub: '1 cup/slice tiramisu autentik', harga: 30000, icon: '🍰' },
      { id: 'half', nama: '1/2 Porsi / Box Sedang', sub: 'Porsi share berdua/bertiga', harga: 60000, icon: '🎂' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (20 cm)', sub: 'Tiramisu utuh 1 kotak tart ultah', harga: 115000, icon: '🎂' }
    ]
  },
  {
    id: 13,
    nama: "Choco Lava Molten Cake",
    kategori: "cake",
    deskripsi: "Kue cokelat hangat dengan lelehan cokelat meleleh melimpah ketika dipotong.",
    harga: "Rp 25.000",
    gambar: "images/choco_lava.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Kue molten lava hangat', harga: 25000, icon: '🍫' },
      { id: 'half', nama: '1/2 Porsi (Box Isi 3 Pcs)', sub: 'Paket bertiga sensasi leleh', harga: 68000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart Party (6 Pcs)', sub: 'Box hampers tart lava cake', harga: 128000, icon: '🎂' }
    ]
  },
  {
    id: 14,
    nama: "Peach Fruit Danish Pastry",
    kategori: "pastry",
    deskripsi: "Pastry pastry renyah khas Denmark dengan cream custard manis dan irisan buah peach segar.",
    harga: "Rp 30.000",
    gambar: "images/peach_danish.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Danish peach renyah segar', harga: 30000, icon: '🥐' },
      { id: 'half', nama: '1/2 Porsi (Pack Isi 3 Pcs)', sub: 'Paket bertiga nikmat', harga: 82000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Hampers (6 Pcs)', sub: 'Kotak hampers pastry elegan', harga: 155000, icon: '🎁' }
    ]
  },
  {
    id: 15,
    nama: "Choco Chip Soft Cookies",
    kategori: "cookies",
    deskripsi: "Kukis panggang bertekstur chewy renyah dengan lelehan cokelat chips melimpah di setiap gigitan.",
    harga: "Rp 22.000",
    gambar: "images/cookies.jpg",
    porsi: [
      { id: 'slice', nama: 'Pack Mini (3 Pcs)', sub: 'Camilan kukis renyah', harga: 22000, icon: '🍪' },
      { id: 'half', nama: '1/2 Porsi (Toples Sedang 8 Pcs)', sub: 'Toples cemilan meja', harga: 55000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Gift Box (16 Pcs)', sub: 'Gift box tart hampers cookies', harga: 105000, icon: '🎁' }
    ]
  },
  {
    id: 16,
    nama: "Rainbow Pastel Macarons",
    kategori: "cookies",
    deskripsi: "Satu set biskuit meringue almond khas Prancis dengan aneka rasa dan warna pastel imut.",
    harga: "Rp 35.000",
    gambar: "images/macaron.jpg",
    porsi: [
      { id: 'slice', nama: 'Box Mini (4 Pcs)', sub: 'Macaron aneka rasa cantik', harga: 35000, icon: '🍬' },
      { id: 'half', nama: '1/2 Porsi (Box Sedang 8 Pcs)', sub: 'Pilihan 8 warna pastel', harga: 65000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart Gift (16 Pcs)', sub: 'Kotak gift box mewah hampers', harga: 125000, icon: '🎁' }
    ]
  },
  {
    id: 17,
    nama: "Lotus Biscoff Cheesecake",
    kategori: "cake",
    deskripsi: "Cheesecake creamy dingin dengan selai karamel Lotus Biscoff dan remahan biskuit renyah.",
    harga: "Rp 32.000",
    gambar: "images/biscoff_cheesecake.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Potong', sub: '1 iris lotus cheesecake', harga: 32000, icon: '🍰' },
      { id: 'half', nama: '1/2 Porsi / Half Tart (12 cm)', sub: 'Cocok untuk 2-3 orang', harga: 75000, icon: '🎂' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (20 cm)', sub: 'Cheesecake utuh 1 kotak tart', harga: 140000, icon: '🎂' }
    ]
  },
  {
    id: 18,
    nama: "Warm Apple Cinnamon Pie",
    kategori: "pastry",
    deskripsi: "Pie panggang kulit renyah berisi potongan apel manis berbumbu kayu manis hangat aromatik.",
    harga: "Rp 25.000",
    gambar: "images/apple_pie.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Potong', sub: '1 slice pie apel wangi', harga: 25000, icon: '🥧' },
      { id: 'half', nama: '1/2 Pie (15 cm)', sub: 'Setengah loyang pie apel', harga: 58000, icon: '🥧' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart Pie (22 cm)', sub: '1 loyang pie utuh kotak tart', harga: 110000, icon: '🥧' }
    ]
  },
  {
    id: 19,
    nama: "Matcha Chiffon Layer Cake",
    kategori: "cake",
    deskripsi: "Kue sifon hijau lembut bertingkat dengan krim matcha dan taburan bubuk teh hijau premium.",
    harga: "Rp 28.000",
    gambar: "images/matcha_layer.jpg",
    porsi: [
      { id: 'slice', nama: 'Per Slice / Potong', sub: '1 slice bolu sifon matcha lembut', harga: 28000, icon: '🍰' },
      { id: 'half', nama: '1/2 Porsi / Half Tart (12 cm)', sub: 'Cocok untuk 2-3 orang', harga: 70000, icon: '🎂' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (20 cm)', sub: 'Kue bolu lapis utuh 1 kotak tart', harga: 135000, icon: '🎂' }
    ]
  },
  {
    id: 20,
    nama: "Boston Cream Donut",
    kategori: "donat",
    deskripsi: "Donat bulat tanpa lubang berisikan vla custard vanila dingin dengan balutan cokelat pekat.",
    harga: "Rp 18.000",
    gambar: "images/donat_boston.jpg",
    porsi: [
      { id: 'slice', nama: '1 Pcs Satuan', sub: 'Donat isi vla custard personal', harga: 18000, icon: '🍩' },
      { id: 'half', nama: '1/2 Porsi / 1/2 Lusin (Box 6 pcs)', sub: 'Paket box isi 6 donat', harga: 49000, icon: '📦' },
      { id: 'whole', nama: '1 Porsi Utuh / 1 Lusin (1 Kotak Box Tart)', sub: '12 pcs dalam box tart pesta', harga: 92000, icon: '🎁' }
    ]
  }
];

// Menampilkan produk dengan opsi filter kategori
function tampilkanProduk(kategoriDipilih = 'semua') {
  const container = document.getElementById('daftarProduk');
  if (!container) return;

  container.innerHTML = '';

  const hasilFilter = dataProduk.filter(function(item) {
    if (kategoriDipilih === 'semua') return true;
    return item.kategori === kategoriDipilih;
  });

  hasilFilter.forEach(function(produk, index) {
    const card = document.createElement('div');
    card.className = 'card fade-in';
    card.style.animationDelay = (index * 0.05) + 's';

    const hargaMulai = produk.porsi && produk.porsi.length > 0
      ? 'Mulai ' + formatRupiah(produk.porsi[0].harga)
      : produk.harga;

    card.innerHTML = `
      <div onclick="bukaModalDetail(${produk.id})" style="cursor: pointer;">
        <img src="${produk.gambar}" alt="${produk.nama}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80';" />
        <span class="kategori-tag">${produk.kategori.toUpperCase()}</span>
        <h3>${produk.nama}</h3>
        <p>${produk.deskripsi}</p>
        <div class="harga">${hargaMulai}</div>
      </div>
      <button onclick="bukaModalDetail(${produk.id})" class="btn-pilih-opsi">🍰 Pilih Porsi & Add-on</button>
    `;

    container.appendChild(card);
  });
}

function filterProduk(kategori, tombolKlik) {
  document.querySelectorAll('.btn-kategori').forEach(function(btn) {
    btn.classList.remove('aktif');
  });
  if (tombolKlik) {
    tombolKlik.classList.add('aktif');
  }
  tampilkanProduk(kategori);
}


// ============================================================
// 3. MODAL DETAIL KUE, PILIHAN PORSI & ADD-ON LILIN / TOPPER
// ============================================================
let produkDetailAktif = null;
let porsiTerpilihIndex = 0;
let addonTerpilih = [];
let modalQty = 1;

function bukaModalDetail(idProduk) {
  const produk = dataProduk.find(function(p) { return p.id === idProduk; });
  if (!produk) return;

  produkDetailAktif = produk;
  porsiTerpilihIndex = 0;
  addonTerpilih = [];
  modalQty = 1;

  renderKontenModalDetail();

  const modal = document.getElementById('modalDetailProduk');
  const overlay = document.getElementById('cartOverlay');
  if (modal) modal.classList.add('buka');
  if (overlay) overlay.classList.add('aktif');
  document.body.style.overflow = 'hidden';
}

function tutupModalDetail() {
  const modal = document.getElementById('modalDetailProduk');
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  const checkoutModal = document.getElementById('checkoutModal');
  const successModal = document.getElementById('successModal');

  if (modal) modal.classList.remove('buka');

  const adaModalLain = (drawer && drawer.classList.contains('buka')) ||
                       (checkoutModal && checkoutModal.classList.contains('buka')) ||
                       (successModal && successModal.classList.contains('buka'));

  if (overlay && !adaModalLain) {
    overlay.classList.remove('aktif');
    document.body.style.overflow = '';
  }
}

function renderKontenModalDetail() {
  const container = document.getElementById('modalDetailBody');
  if (!container || !produkDetailAktif) return;

  const p = produkDetailAktif;
  const porsiList = p.porsi || [
    { id: 'slice', nama: 'Per Slice / Potong', sub: 'Camilan santai (1 porsi)', harga: 28000, icon: '🍰' },
    { id: 'half', nama: '1/2 Porsi / Half Tart (12 cm)', sub: 'Cocok untuk 2-3 orang', harga: 68000, icon: '🎂' },
    { id: 'whole', nama: '1 Porsi Utuh / 1 Kotak Tart (20 cm)', sub: 'Tart utuh spesial perayaan', harga: 130000, icon: '🎂' }
  ];

  // Render Porsi Cards
  let porsiHtml = porsiList.map(function(item, idx) {
    const isChecked = idx === porsiTerpilihIndex ? 'checked' : '';
    const isSelectedClass = idx === porsiTerpilihIndex ? 'terpilih' : '';
    return `
      <label class="porsi-card ${isSelectedClass}" onclick="pilihPorsiModal(${idx})">
        <input type="radio" name="porsiPilihan" value="${idx}" ${isChecked} />
        <span class="porsi-icon">${item.icon || '🍰'}</span>
        <span class="porsi-name">${item.nama}</span>
        <span class="porsi-sub">${item.sub}</span>
        <span class="porsi-price">${formatRupiah(item.harga)}</span>
      </label>
    `;
  }).join('');

  // Render Add-on Cards
  let addonHtml = daftarAddonCake.map(function(item) {
    const isChecked = addonTerpilih.includes(item.id) ? 'checked' : '';
    const isSelectedClass = addonTerpilih.includes(item.id) ? 'terpilih' : '';
    const hargaTeks = item.gratis ? '<span class="badge-gratis">Gratis (Rp 0)</span>' : `+ ${formatRupiah(item.harga)}`;
    return `
      <label class="addon-card ${isSelectedClass}">
        <input type="checkbox" value="${item.id}" ${isChecked} onchange="toggleAddonModal('${item.id}')" />
        <span class="addon-icon">${item.icon}</span>
        <div class="addon-info">
          <span class="addon-name">${item.nama}</span>
          <span class="addon-price">${hargaTeks}</span>
        </div>
      </label>
    `;
  }).join('');

  // Hitung total harga satuan saat ini
  const porsiDipilih = porsiList[porsiTerpilihIndex] || porsiList[0];
  let totalAddon = 0;
  addonTerpilih.forEach(function(aid) {
    const aObj = daftarAddonCake.find(function(ad) { return ad.id === aid; });
    if (aObj) totalAddon += aObj.harga;
  });
  const hargaSatuan = porsiDipilih.harga + totalAddon;
  const totalModal = hargaSatuan * modalQty;

  container.innerHTML = `
    <!-- Info Header Produk -->
    <div class="detail-header-card">
      <div class="detail-img-wrap">
        <img src="${p.gambar}" alt="${p.nama}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80';" />
      </div>
      <div class="detail-info-wrap">
        <span class="detail-cat-badge">${p.kategori.toUpperCase()}</span>
        <h3 class="detail-title">${p.nama}</h3>
        <p class="detail-desc">${p.deskripsi}</p>
        <span class="detail-base-price">✨ Silakan sesuaikan ukuran & aksesoris di bawah ini:</span>
      </div>
    </div>

    <!-- Pilihan Porsi / Ukuran -->
    <div class="detail-section">
      <h4 class="detail-section-title">🍰 Pilihan Porsi / Ukuran (Wajib)</h4>
      <p class="detail-section-subtitle">Pilih per slice, 1/2 porsi, atau 1 kotak utuh tart perayaan</p>
      <div class="porsi-grid">
        ${porsiHtml}
      </div>
    </div>

    <!-- Pilihan Add-on Lilin & Cake Accessories -->
    <div class="detail-section">
      <h4 class="detail-section-title">🕯️ Pilihan Add-on Lilin & Aksesoris Cake (Opsional)</h4>
      <p class="detail-section-subtitle">Lengkapi momen manis dengan lilin estetik, topper ucapan, atau pisau kue</p>
      <div class="addon-grid">
        ${addonHtml}
      </div>
    </div>

    <!-- Request Tulisan di Kue / Lilin Angka -->
    <div class="detail-section">
      <h4 class="detail-section-title">✍️ Tulisan di Atas Kue / Plakat Cokelat (Opsional)</h4>
      <p class="detail-section-subtitle">Tuliskan pesan ucapan selamat atau request angka untuk lilin angka</p>
      <input type="text" id="inputTulisanKue" class="custom-text-input" placeholder="Contoh: Happy Birthday Dilla ke-20 / Lilin Angka 20" />
    </div>

    <!-- Footer Bar: Qty & Tombol Tambah ke Keranjang -->
    <div class="detail-footer-bar">
      <div class="detail-qty-picker">
        <label>Jumlah:</label>
        <div class="qty-control-box">
          <button type="button" class="qty-control-btn" onclick="ubahQtyModal(-1)">−</button>
          <span id="modalQtyNum" class="qty-control-num">${modalQty}</span>
          <button type="button" class="qty-control-btn" onclick="ubahQtyModal(1)">+</button>
        </div>
      </div>
      <button type="button" class="btn-detail-add" onclick="tambahCustomProdukKeKeranjang()">
        🛍️ + Masukkan ke Keranjang • <span id="modalTotalBtnText">${formatRupiah(totalModal)}</span>
      </button>
    </div>
  `;
}

function pilihPorsiModal(index) {
  porsiTerpilihIndex = index;
  renderKontenModalDetail();
}

function toggleAddonModal(idAddon) {
  const idx = addonTerpilih.indexOf(idAddon);
  if (idx > -1) {
    addonTerpilih.splice(idx, 1);
  } else {
    addonTerpilih.push(idAddon);
  }
  renderKontenModalDetail();
}

function ubahQtyModal(delta) {
  modalQty = Math.max(1, modalQty + delta);
  const qtyEl = document.getElementById('modalQtyNum');
  if (qtyEl) qtyEl.textContent = modalQty;
  perbaruiHargaModal();
}

function perbaruiHargaModal() {
  if (!produkDetailAktif) return;
  const porsiList = produkDetailAktif.porsi || [];
  const porsi = porsiList[porsiTerpilihIndex] || { harga: 0 };
  let totalAddon = 0;
  addonTerpilih.forEach(function(aid) {
    const a = daftarAddonCake.find(function(ad) { return ad.id === aid; });
    if (a) totalAddon += a.harga;
  });
  const total = (porsi.harga + totalAddon) * modalQty;
  const btnText = document.getElementById('modalTotalBtnText');
  if (btnText) btnText.textContent = formatRupiah(total);
}

function tambahCustomProdukKeKeranjang() {
  if (!produkDetailAktif) return;

  const p = produkDetailAktif;
  const porsiList = p.porsi || [];
  const porsi = porsiList[porsiTerpilihIndex] || { nama: 'Standard', harga: ambilAngkaHarga(p.harga) };

  const inputTulisan = document.getElementById('inputTulisanKue');
  const tulisanKue = inputTulisan ? inputTulisan.value.trim() : '';

  const addonObjects = addonTerpilih.map(function(aid) {
    const a = daftarAddonCake.find(function(ad) { return ad.id === aid; });
    return a ? { id: a.id, nama: a.nama, harga: a.harga } : null;
  }).filter(Boolean);

  let addonTotal = 0;
  addonObjects.forEach(function(a) { addonTotal += a.harga; });

  const hargaSatuan = porsi.harga + addonTotal;

  // Key unik berdasarkan produk, porsi, addons, dan tulisan di kue
  const sortedAddonIds = addonObjects.map(function(a) { return a.id; }).sort().join('-');
  const itemKey = `${p.id}_${porsi.id || porsi.nama}_${sortedAddonIds}_${tulisanKue.toLowerCase()}`;

  const indexAda = dataKeranjang.findIndex(function(item) {
    return item.key === itemKey;
  });

  if (indexAda > -1) {
    dataKeranjang[indexAda].jumlah += modalQty;
  } else {
    dataKeranjang.push({
      key: itemKey,
      id: p.id,
      nama: p.nama,
      kategori: p.kategori,
      gambar: p.gambar,
      porsiNama: porsi.nama,
      porsiHarga: porsi.harga,
      addons: addonObjects,
      tulisanKue: tulisanKue,
      hargaAngka: hargaSatuan,
      hargaStr: formatRupiah(hargaSatuan),
      jumlah: modalQty
    });
  }

  simpanKeranjangKeStorage();
  tutupModalDetail();
  tampilkanNotifikasi(`🛍️ "${p.nama} (${porsi.nama})" berhasil masuk ke keranjang!`);
  animasiTombolKeranjang();
  bukaKeranjang();
}


// ============================================================
// 4. KERANJANG BELANJA & CHECKOUT (STATE & EVENT HANDLING)
// ============================================================
let dataKeranjang = [];
let voucherAktif = null;
let dataOrderTerakhir = null;

const daftarVoucherValid = {
  MANISBARU: {
    kode: 'MANISBARU',
    nama: 'Diskon 15% Pelanggan Baru',
    badge: 'Diskon 15%',
    badgeClass: 'badge-diskon',
    icon: '🎁',
    deskripsi: 'Potongan langsung 15% untuk semua menu kue lezat tanpa minimum belanja.',
    tipe: 'persen',
    nilai: 15,
    cekSyarat: function(keranjang, subtotal, opsiKirim) {
      if (!keranjang || keranjang.length === 0 || subtotal <= 0) {
        return { bisa: false, pesan: 'Keranjang belanja masih kosong.' };
      }
      return { bisa: true, pesan: 'Bisa digunakan untuk seluruh pesanan kue!' };
    },
    hitungPotongan: function(keranjang, subtotal, opsiKirim) {
      return Math.round(subtotal * 0.15);
    }
  },
  PAGIMANIS: {
    kode: 'PAGIMANIS',
    nama: 'Morning Pastry Treat (Hemat Rp 15rb)',
    badge: 'Buy 2 Get 1',
    badgeClass: 'badge-free',
    icon: '🥐',
    deskripsi: 'Potongan Rp 15.000 khusus pembelian minimal 2 varian menu Pastry / Croissant.',
    tipe: 'potongan',
    nilai: 15000,
    cekSyarat: function(keranjang, subtotal, opsiKirim) {
      if (!keranjang || keranjang.length === 0) {
        return { bisa: false, pesan: 'Keranjang belanja masih kosong.' };
      }
      const totalPastry = keranjang.filter(function(i) {
        return i.kategori === 'pastry';
      }).reduce(function(sum, i) {
        return sum + i.jumlah;
      }, 0);

      if (totalPastry < 2) {
        const kurang = 2 - totalPastry;
        return {
          bisa: false,
          pesan: totalPastry === 0
            ? 'Belum ada produk Pastry di keranjang (min. 2 pcs).'
            : `Kurang ${kurang} produk Pastry lagi untuk klaim promo ini.`
        };
      }
      return { bisa: true, pesan: `Syarat terpenuhi (${totalPastry} pastry di keranjang)!` };
    },
    hitungPotongan: function(keranjang, subtotal, opsiKirim) {
      return Math.min(subtotal, 15000);
    }
  },
  ULTAHMANIS: {
    kode: 'ULTAHMANIS',
    nama: 'Diskon 25% Sweet Cake & Tart',
    badge: 'Diskon 25%',
    badgeClass: 'badge-diskon',
    icon: '🎂',
    deskripsi: 'Diskon 25% khusus untuk pemesanan kue tart atau kue ulang tahun.',
    tipe: 'persen',
    nilai: 25,
    cekSyarat: function(keranjang, subtotal, opsiKirim) {
      if (!keranjang || keranjang.length === 0) {
        return { bisa: false, pesan: 'Keranjang belanja masih kosong.' };
      }
      const adaCake = keranjang.some(function(i) {
        return i.kategori === 'cake' || (i.porsiNama && (i.porsiNama.includes('Tart') || i.porsiNama.includes('Utuh')));
      });

      if (!adaCake) {
        return { bisa: false, pesan: 'Khusus untuk pemesanan menu Cake / Kue Tart.' };
      }
      return { bisa: true, pesan: 'Syarat terpenuhi (produk Cake/Tart terdeteksi)!' };
    },
    hitungPotongan: function(keranjang, subtotal, opsiKirim) {
      const subtotalCake = keranjang.filter(function(i) {
        return i.kategori === 'cake' || (i.porsiNama && (i.porsiNama.includes('Tart') || i.porsiNama.includes('Utuh')));
      }).reduce(function(sum, i) {
        return sum + (i.hargaAngka * i.jumlah);
      }, 0);
      return Math.round(subtotalCake * 0.25);
    }
  },
  DONUT75: {
    kode: 'DONUT75',
    nama: 'Weekend Donut Party (Hemat Rp 15rb)',
    badge: 'Paket Hemat',
    badgeClass: 'badge-hemat',
    icon: '🍩',
    deskripsi: 'Hemat Rp 15.000 khusus untuk pembelian varian menu Donat empuk.',
    tipe: 'potongan',
    nilai: 15000,
    cekSyarat: function(keranjang, subtotal, opsiKirim) {
      if (!keranjang || keranjang.length === 0) {
        return { bisa: false, pesan: 'Keranjang belanja masih kosong.' };
      }
      const totalDonat = keranjang.filter(function(i) {
        return i.kategori === 'donat';
      }).reduce(function(sum, i) {
        return sum + i.jumlah;
      }, 0);

      if (totalDonat === 0) {
        return { bisa: false, pesan: 'Khusus untuk pembelian varian menu Donat.' };
      }
      return { bisa: true, pesan: `Syarat terpenuhi (${totalDonat} menu donat di keranjang)!` };
    },
    hitungPotongan: function(keranjang, subtotal, opsiKirim) {
      const subtotalDonat = keranjang.filter(function(i) {
        return i.kategori === 'donat';
      }).reduce(function(sum, i) {
        return sum + (i.hargaAngka * i.jumlah);
      }, 0);
      return Math.min(subtotalDonat, 15000);
    }
  },
  FREEONGKIR: {
    kode: 'FREEONGKIR',
    nama: 'Gratis Ongkos Kirim (Hemat Rp 10rb)',
    badge: 'Gratis Ongkir',
    badgeClass: 'badge-ongkir',
    icon: '🚚',
    deskripsi: 'Bebas biaya ongkir pengiriman ke alamat minimal belanja Rp 80.000 khusus Delivery.',
    tipe: 'ongkir',
    nilai: 10000,
    cekSyarat: function(keranjang, subtotal, opsiKirim) {
      if (opsiKirim === 'pickup') {
        return { bisa: false, pesan: 'Opsi Ambil Sendiri di Toko sudah bebas ongkir.' };
      }
      const minBelanja = 80000;
      if (subtotal < minBelanja) {
        const selisih = minBelanja - subtotal;
        return { bisa: false, pesan: `Belanja kurang ${formatRupiah(selisih)} lagi untuk gratis ongkir.` };
      }
      return { bisa: true, pesan: 'Syarat gratis ongkir terpenuhi (Hemat Rp 10.000)!' };
    },
    hitungPotongan: function(keranjang, subtotal, opsiKirim) {
      return (opsiKirim === 'pickup') ? 0 : 10000;
    }
  }
};

function ambilAngkaHarga(hargaStr) {
  if (typeof hargaStr === 'number') return hargaStr;
  return parseInt(String(hargaStr).replace(/[^0-9]/g, '')) || 0;
}

function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

function muatKeranjangDariStorage() {
  try {
    const tersimpan = localStorage.getItem('dapur_manis_keranjang');
    if (tersimpan) {
      dataKeranjang = JSON.parse(tersimpan);
      dataKeranjang.forEach(function(item) {
        const pTerbaru = dataProduk.find(function(p) { return p.id === item.id; });
        if (pTerbaru) {
          item.gambar = pTerbaru.gambar;
        }
      });
    }
    const voucherTersimpan = localStorage.getItem('dapur_manis_voucher');
    if (voucherTersimpan) {
      const parsed = JSON.parse(voucherTersimpan);
      if (parsed && parsed.kode && daftarVoucherValid[parsed.kode]) {
        voucherAktif = daftarVoucherValid[parsed.kode];
      } else {
        voucherAktif = null;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca keranjang dari storage:', e);
    dataKeranjang = [];
    voucherAktif = null;
  }
  perbaruiBadgeKeranjang();
}

function simpanKeranjangKeStorage() {
  try {
    localStorage.setItem('dapur_manis_keranjang', JSON.stringify(dataKeranjang));
    if (voucherAktif) {
      localStorage.setItem('dapur_manis_voucher', JSON.stringify({ kode: voucherAktif.kode }));
    } else {
      localStorage.removeItem('dapur_manis_voucher');
    }
  } catch (e) {
    console.warn('Gagal menyimpan keranjang ke storage:', e);
  }
  perbaruiBadgeKeranjang();
}

function perbaruiBadgeKeranjang() {
  const totalItem = dataKeranjang.reduce(function(sum, item) {
    return sum + item.jumlah;
  }, 0);

  document.querySelectorAll('.cart-badge').forEach(function(badge) {
    badge.textContent = totalItem;
  });

  const totalItemEl = document.getElementById('cartTotalItems');
  if (totalItemEl) {
    totalItemEl.textContent = totalItem + ' item';
  }
}

function animasiTombolKeranjang() {
  const btns = [
    document.getElementById('floatingCartBtn')
  ];
  btns.forEach(function(el) {
    if (el) {
      el.classList.add('bounce');
      setTimeout(function() {
        el.classList.remove('bounce');
      }, 500);
    }
  });
}

// Buka modal kustomisasi saat user klik tombol produk
function tambahKeranjang(identitas) {
  let produkDitemukan;
  if (typeof identitas === 'number') {
    produkDitemukan = dataProduk.find(function(p) { return p.id === identitas; });
  } else {
    produkDitemukan = dataProduk.find(function(p) {
      return p.nama === identitas || String(p.id) === String(identitas);
    });
  }

  if (!produkDitemukan) return;
  bukaModalDetail(produkDitemukan.id);
}

function ubahJumlahItem(index, delta) {
  if (index < 0 || index >= dataKeranjang.length) return;

  dataKeranjang[index].jumlah += delta;
  if (dataKeranjang[index].jumlah <= 0) {
    dataKeranjang.splice(index, 1);
  }

  simpanKeranjangKeStorage();
  renderIsiKeranjang();
}

function hapusItemKeranjang(index) {
  if (index < 0 || index >= dataKeranjang.length) return;

  dataKeranjang.splice(index, 1);
  simpanKeranjangKeStorage();
  renderIsiKeranjang();
  tampilkanNotifikasi('🗑️ Produk dihapus dari keranjang.');
}

function konfirmasiKosongkanKeranjang() {
  if (dataKeranjang.length === 0) return;
  if (confirm('Apakah Anda yakin ingin mengosongkan seluruh isi keranjang?')) {
    dataKeranjang = [];
    voucherAktif = null;
    simpanKeranjangKeStorage();
    renderIsiKeranjang();
    tampilkanNotifikasi('✨ Keranjang telah dikosongkan.');
  }
}

function bukaKeranjang() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) {
    window.location.href = 'index.html#produk';
    return;
  }

  renderIsiKeranjang();
  drawer.classList.add('buka');
  overlay.classList.add('aktif');
  document.body.style.overflow = 'hidden';
}

function tutupKeranjang() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const detailModal = document.getElementById('modalDetailProduk');
  const checkoutModal = document.getElementById('checkoutModal');
  const successModal = document.getElementById('successModal');
  const voucherModal = document.getElementById('voucherModal');

  if (drawer) drawer.classList.remove('buka');

  const adaModalLain = (detailModal && detailModal.classList.contains('buka')) ||
                       (checkoutModal && checkoutModal.classList.contains('buka')) ||
                       (voucherModal && voucherModal.classList.contains('buka')) ||
                       (successModal && successModal.classList.contains('buka'));

  if (overlay && !adaModalLain) {
    overlay.classList.remove('aktif');
    document.body.style.overflow = '';
  }
}

function tutupSemuaModal() {
  tutupKeranjang();
  tutupModalDetail();
  tutupCheckout();
  tutupModalVoucher();
  tutupSuksesModal();
}

function hitungTotalKeranjang(opsiPengiriman) {
  if (!opsiPengiriman) {
    const radioOpsi = document.querySelector('input[name="opsiPengiriman"]:checked');
    opsiPengiriman = radioOpsi ? radioOpsi.value : 'delivery';
  }

  const subtotal = dataKeranjang.reduce(function(sum, item) {
    return sum + (item.hargaAngka * item.jumlah);
  }, 0);

  let diskon = 0;
  let ongkir = 0;

  if (subtotal > 0) {
    if (opsiPengiriman === 'pickup') {
      ongkir = 0; // Ambil di toko gratis ongkir
    } else {
      // Delivery
      if (voucherAktif && voucherAktif.tipe === 'ongkir') {
        ongkir = 0; // Bebas ongkir dengan voucher
      } else {
        ongkir = 10000; // Tarif flat dalam kota
      }
    }

    // Smart Validation: Cek apakah voucher yang sedang aktif masih memenuhi syarat keranjang
    if (voucherAktif) {
      if (typeof voucherAktif.cekSyarat === 'function') {
        const syarat = voucherAktif.cekSyarat(dataKeranjang, subtotal, opsiPengiriman);
        if (!syarat.bisa) {
          const kodeLama = voucherAktif.kode;
          voucherAktif = null;
          simpanKeranjangKeStorage();
          tampilkanNotifikasi(`⚠️ Promo "${kodeLama}" dilepas otomatis: ${syarat.pesan}`);
        }
      }
    }

    // Hitung potongan jika voucher masih aktif dan memenuhi syarat
    if (voucherAktif) {
      if (typeof voucherAktif.hitungPotongan === 'function') {
        diskon = voucherAktif.hitungPotongan(dataKeranjang, subtotal, opsiPengiriman);
      } else if (voucherAktif.tipe === 'persen') {
        diskon = Math.round(subtotal * (voucherAktif.nilai / 100));
      } else if (voucherAktif.tipe === 'potongan') {
        diskon = Math.min(subtotal, voucherAktif.nilai);
      } else if (voucherAktif.tipe === 'ongkir') {
        diskon = (opsiPengiriman === 'delivery') ? 10000 : 0;
      }
    }
  } else {
    if (voucherAktif) {
      voucherAktif = null;
      simpanKeranjangKeStorage();
    }
  }

  const ongkirFinal = (opsiPengiriman === 'pickup' || (voucherAktif && voucherAktif.tipe === 'ongkir')) ? 0 : ongkir;
  const total = Math.max(0, subtotal - (voucherAktif && voucherAktif.tipe === 'ongkir' ? 0 : diskon) + ongkirFinal);

  return { subtotal: subtotal, diskon: diskon, ongkir: ongkirFinal, total: total, opsiPengiriman: opsiPengiriman };
}

function renderIsiKeranjang() {
  const container = document.getElementById('cartItemsList');
  const footer = document.getElementById('cartFooter');
  if (!container) return;

  if (dataKeranjang.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="empty-cart-icon">🛒</div>
        <h4>Keranjang Masih Kosong</h4>
        <p>Belum ada kue pilihanmu di sini. Yuk intip katalog menu lezat kami!</p>
        <button class="btn-belanja-sekarang" onclick="tutupKeranjang(); scrollKeProduk();">
          🍰 Pilih Kue Sekarang
        </button>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  let html = '';
  dataKeranjang.forEach(function(item, index) {
    const itemTotal = item.hargaAngka * item.jumlah;

    const porsiBadge = item.porsiNama ? `<span class="cart-porsi-badge">🍰 ${item.porsiNama}</span>` : '';

    let addonsHtml = '';
    if (item.addons && item.addons.length > 0) {
      addonsHtml = `
        <div class="cart-addons-chips">
          ${item.addons.map(function(a) {
            return `<span class="cart-addon-chip">+ ${a.nama}</span>`;
          }).join('')}
        </div>
      `;
    }

    const tulisanHtml = item.tulisanKue ? `<div class="cart-custom-note">✍️ "${item.tulisanKue}"</div>` : '';

    html += `
      <div class="cart-item">
        <img src="${item.gambar}" alt="${item.nama}" class="cart-item-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80';" />
        <div class="cart-item-info">
          <h4>${item.nama}</h4>
          ${porsiBadge}
          ${addonsHtml}
          ${tulisanHtml}
          <span class="cart-item-price">${item.hargaStr}</span>
          <div class="cart-item-controls">
            <div class="qty-selector">
              <button type="button" class="qty-btn" onclick="ubahJumlahItem(${index}, -1)">−</button>
              <span class="qty-num">${item.jumlah}</span>
              <button type="button" class="qty-btn" onclick="ubahJumlahItem(${index}, 1)">+</button>
            </div>
            <span class="cart-item-subtotal">${formatRupiah(itemTotal)}</span>
          </div>
        </div>
        <button type="button" class="btn-hapus-item" onclick="hapusItemKeranjang(${index})" title="Hapus item">🗑️</button>
      </div>
    `;
  });

  container.innerHTML = html;

  const kalkulasi = hitungTotalKeranjang('delivery');
  const subtotalEl = document.getElementById('cartSubtotalText');
  const diskonEl = document.getElementById('cartDiskonText');
  const rowDiskon = document.getElementById('rowDiskon');
  const totalEl = document.getElementById('cartTotalText');
  const namaVoucherEl = document.getElementById('namaVoucherAktif');

  if (subtotalEl) subtotalEl.textContent = formatRupiah(kalkulasi.subtotal);
  if (totalEl) totalEl.textContent = formatRupiah(kalkulasi.total);

  if (voucherAktif && kalkulasi.diskon > 0) {
    if (rowDiskon) rowDiskon.style.display = 'flex';
    if (namaVoucherEl) namaVoucherEl.textContent = voucherAktif.kode;
    if (diskonEl) diskonEl.textContent = '- ' + formatRupiah(kalkulasi.diskon);
  } else {
    if (rowDiskon) rowDiskon.style.display = 'none';
  }

  // Render pemilih voucher cerdas di drawer keranjang
  renderVoucherCartBanner();
}

// ------------------------------------------------------------
// SMART VOUCHER SYSTEM (PILIHAN VOUCHER OTOMATIS & SMART PICKER)
// ------------------------------------------------------------

function renderVoucherCartBanner() {
  const container = document.getElementById('cartVoucherBox');
  if (!container) return;

  const kalkulasi = hitungTotalKeranjang('delivery');
  const daftarKeys = Object.keys(daftarVoucherValid);
  let totalBisaDipakai = 0;

  daftarKeys.forEach(function(k) {
    const v = daftarVoucherValid[k];
    const syarat = v.cekSyarat(dataKeranjang, kalkulasi.subtotal, 'delivery');
    if (syarat.bisa) totalBisaDipakai++;
  });

  if (voucherAktif) {
    container.innerHTML = `
      <div class="voucher-applied-box">
        <div class="v-applied-header">
          <span class="v-applied-title">🎟️ Voucher Terpasang</span>
          <button type="button" class="btn-v-change" onclick="bukaModalVoucher()">Ganti Promo ❯</button>
        </div>
        <div class="v-applied-card">
          <div class="v-applied-info">
            <span class="v-applied-icon">${voucherAktif.icon || '🎁'}</span>
            <div class="v-applied-text">
              <strong>${voucherAktif.kode}</strong>
              <small>${voucherAktif.nama}</small>
              <span class="v-applied-saving">Hemat ${formatRupiah(kalkulasi.diskon || 0)}</span>
            </div>
          </div>
          <button type="button" class="btn-v-remove" onclick="lepasVoucher()" title="Lepas Voucher">✕</button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="voucher-picker-prompt" onclick="bukaModalVoucher()">
        <div class="v-prompt-left">
          <span class="v-prompt-icon">🎟️</span>
          <div>
            <strong>Pilih Voucher Promo</strong>
            <small>${totalBisaDipakai > 0 ? `✨ Ada ${totalBisaDipakai} promo bisa dipakai untuk kue ini!` : 'Lihat daftar voucher & promo hemat'}</small>
          </div>
        </div>
        <button type="button" class="btn-v-pilih">Pilih ❯</button>
      </div>
    `;
  }
}

function renderVoucherCheckoutBanner() {
  const container = document.getElementById('checkoutVoucherSection');
  if (!container) return;

  const radioOpsi = document.querySelector('input[name="opsiPengiriman"]:checked');
  const opsiKirim = radioOpsi ? radioOpsi.value : 'delivery';
  const kalkulasi = hitungTotalKeranjang(opsiKirim);

  const daftarKeys = Object.keys(daftarVoucherValid);
  let totalBisaDipakai = 0;

  daftarKeys.forEach(function(k) {
    const v = daftarVoucherValid[k];
    const syarat = v.cekSyarat(dataKeranjang, kalkulasi.subtotal, opsiKirim);
    if (syarat.bisa) totalBisaDipakai++;
  });

  if (voucherAktif) {
    container.innerHTML = `
      <div class="co-voucher-applied-box">
        <div class="co-voucher-header">
          <span class="co-voucher-label">🎟️ Voucher Promo Digunakan</span>
          <button type="button" class="btn-co-v-change" onclick="bukaModalVoucher()">Ganti Promo ❯</button>
        </div>
        <div class="co-voucher-card">
          <div class="co-v-left">
            <span class="co-v-icon">${voucherAktif.icon || '🎁'}</span>
            <div>
              <div class="co-v-name"><strong>${voucherAktif.kode}</strong> • ${voucherAktif.nama}</div>
              <div class="co-v-hemat">Potongan Diskon: <strong class="text-green">- ${formatRupiah(kalkulasi.diskon)}</strong></div>
            </div>
          </div>
          <button type="button" class="btn-co-v-remove" onclick="lepasVoucher()" title="Lepas voucher ini">Hapus</button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="co-voucher-select-banner" onclick="bukaModalVoucher()">
        <div class="co-v-select-left">
          <span class="co-v-select-icon">🎟️</span>
          <div>
            <strong>Pilih Voucher Promo</strong>
            <small>${totalBisaDipakai > 0 ? `Tersedia ${totalBisaDipakai} promo yang bisa kamu pakai` : 'Cek promo diskon spesial Dapur Manis'}</small>
          </div>
        </div>
        <button type="button" class="btn-co-v-pilih">Pilih ❯</button>
      </div>
    `;
  }
}

function bukaModalVoucher() {
  const modal = document.getElementById('voucherModal');
  if (!modal) return;

  renderDaftarVoucherModal();
  modal.classList.add('buka');
  document.body.style.overflow = 'hidden';
}

function tutupModalVoucher() {
  const modal = document.getElementById('voucherModal');
  if (modal) modal.classList.remove('buka');

  // Cek apakah ada modal atau drawer lain yang masih terbuka
  const drawer = document.getElementById('cartDrawer');
  const checkoutModal = document.getElementById('checkoutModal');
  const detailModal = document.getElementById('modalDetailProduk');
  const successModal = document.getElementById('successModal');

  const adaModalLain = (drawer && drawer.classList.contains('buka')) ||
                       (checkoutModal && checkoutModal.classList.contains('buka')) ||
                       (detailModal && detailModal.classList.contains('buka')) ||
                       (successModal && successModal.classList.contains('buka'));

  if (!adaModalLain) {
    document.body.style.overflow = '';
  }
}

function handleKlikLuarVoucher(event) {
  if (event.target && event.target.id === 'voucherModal') {
    tutupModalVoucher();
  }
}

function renderDaftarVoucherModal() {
  const container = document.getElementById('daftarVoucherContainer');
  const badgeEl = document.getElementById('badgeVoucherTersedia');
  if (!container) return;

  const radioOpsi = document.querySelector('input[name="opsiPengiriman"]:checked');
  const opsiKirim = radioOpsi ? radioOpsi.value : 'delivery';
  const kalkulasi = hitungTotalKeranjang(opsiKirim);

  const voucherKeys = Object.keys(daftarVoucherValid);
  let totalBisa = 0;
  let html = '';

  voucherKeys.forEach(function(key) {
    const v = daftarVoucherValid[key];
    const isAktif = voucherAktif && voucherAktif.kode === v.kode;
    const syarat = v.cekSyarat(dataKeranjang, kalkulasi.subtotal, opsiKirim);
    const bisaDipakai = syarat.bisa;

    if (bisaDipakai) totalBisa++;

    let estimasiHemat = 0;
    if (typeof v.hitungPotongan === 'function') {
      estimasiHemat = v.hitungPotongan(dataKeranjang, kalkulasi.subtotal, opsiKirim);
    }

    const cardClass = isAktif ? 'voucher-picker-card aktif' : (bisaDipakai ? 'voucher-picker-card bisa-pakai' : 'voucher-picker-card tidak-bisa');

    html += `
      <div class="${cardClass}">
        <div class="v-card-ribbon">
          <span class="v-card-icon">${v.icon}</span>
          <span class="v-card-badge ${v.badgeClass}">${v.badge}</span>
        </div>
        <div class="v-card-body">
          <div class="v-card-header-row">
            <h5>${v.nama}</h5>
            <span class="v-card-code">🏷️ ${v.kode}</span>
          </div>
          <p class="v-card-desc">${v.deskripsi}</p>
          <div class="v-card-syarat-bar ${bisaDipakai ? 'lolos' : 'gagal'}">
            ${bisaDipakai 
              ? `<span class="syarat-icon">✓</span> <span>${syarat.pesan} ${estimasiHemat > 0 ? `<strong>(Hemat ${formatRupiah(estimasiHemat)})</strong>` : ''}</span>`
              : `<span class="syarat-icon">⚠️</span> <span>${syarat.pesan}</span>`
            }
          </div>
        </div>
        <div class="v-card-action">
          ${isAktif ? `
            <div class="v-active-tag">✓ Terpasang</div>
            <button type="button" class="btn-v-action lepas" onclick="lepasVoucher()">Lepas</button>
          ` : bisaDipakai ? `
            <button type="button" class="btn-v-action pakai" onclick="pilihVoucherLangsung('${v.kode}')">Gunakan</button>
          ` : `
            <button type="button" class="btn-v-action disabled" disabled title="${syarat.pesan}">Belum Memenuhi</button>
          `}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (badgeEl) {
    badgeEl.textContent = `${totalBisa} promo bisa dipakai`;
  }
}

function pilihVoucherLangsung(kode) {
  const v = daftarVoucherValid[kode];
  if (!v) return;

  const radioOpsi = document.querySelector('input[name="opsiPengiriman"]:checked');
  const opsiKirim = radioOpsi ? radioOpsi.value : 'delivery';
  const subtotal = dataKeranjang.reduce(function(sum, item) {
    return sum + (item.hargaAngka * item.jumlah);
  }, 0);

  const syarat = v.cekSyarat(dataKeranjang, subtotal, opsiKirim);
  if (!syarat.bisa) {
    tampilkanNotifikasi(`⚠️ Belum bisa dipakai: ${syarat.pesan}`);
    return;
  }

  voucherAktif = v;
  simpanKeranjangKeStorage();

  // Update tampilan di semua komponen
  renderIsiKeranjang();
  renderCheckoutSummary();
  renderDaftarVoucherModal();

  tampilkanNotifikasi(`🎉 Voucher "${v.kode}" berhasil digunakan!`);
  setTimeout(function() {
    tutupModalVoucher();
  }, 250);
}

function lepasVoucher() {
  voucherAktif = null;
  simpanKeranjangKeStorage();

  renderIsiKeranjang();
  renderCheckoutSummary();
  renderDaftarVoucherModal();

  tampilkanNotifikasi('Voucher telah dilepas.');
}



function bukaCheckout() {
  if (dataKeranjang.length === 0) {
    tampilkanNotifikasi('Keranjang belanja Anda masih kosong.');
    return;
  }

  tutupKeranjang();

  const modal = document.getElementById('checkoutModal');
  const overlay = document.getElementById('cartOverlay');
  if (!modal || !overlay) return;

  renderCheckoutSummary();
  modal.classList.add('buka');
  overlay.classList.add('aktif');
  document.body.style.overflow = 'hidden';

  const tanggalInput = document.getElementById('coTanggal');
  if (tanggalInput && !tanggalInput.value) {
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    tanggalInput.value = besok.toISOString().split('T')[0];
    tanggalInput.min = new Date().toISOString().split('T')[0];
  }

  togglePilihanBank();
}

function tutupCheckout() {
  const modal = document.getElementById('checkoutModal');
  const overlay = document.getElementById('cartOverlay');
  if (modal) modal.classList.remove('buka');
  if (overlay) overlay.classList.remove('aktif');
  document.body.style.overflow = '';
}

function gantiOpsiPengiriman(opsi) {
  const groupAlamat = document.getElementById('groupAlamatPengiriman');
  const infoPickup = document.getElementById('infoPickupBox');
  const textareaAlamat = document.getElementById('coAlamat');
  const labelTanggal = document.getElementById('labelCoTanggal');
  const labelWaktu = document.getElementById('labelCoWaktu');

  if (opsi === 'pickup') {
    if (groupAlamat) groupAlamat.style.display = 'none';
    if (infoPickup) infoPickup.style.display = 'block';
    if (textareaAlamat) textareaAlamat.removeAttribute('required');
    if (labelTanggal) labelTanggal.textContent = 'Tanggal Pengambilan *';
    if (labelWaktu) labelWaktu.textContent = 'Waktu Pengambilan';
  } else {
    if (groupAlamat) groupAlamat.style.display = 'block';
    if (infoPickup) infoPickup.style.display = 'none';
    if (textareaAlamat) textareaAlamat.setAttribute('required', 'required');
    if (labelTanggal) labelTanggal.textContent = 'Tanggal Kirim *';
    if (labelWaktu) labelWaktu.textContent = 'Waktu Kirim';
  }

  renderCheckoutSummary();
}

const daftarRekeningBank = {
  BCA: { bank: 'Bank BCA', noRek: '827-091-2345', an: 'Dapur Manis' },
  Mandiri: { bank: 'Bank Mandiri', noRek: '137-00-9876-543', an: 'Dapur Manis' },
  BRI: { bank: 'Bank BRI', noRek: '0341-01-002345-502', an: 'Dapur Manis' },
  BNI: { bank: 'Bank BNI', noRek: '084-567-8901', an: 'Dapur Manis' },
  BSI: { bank: 'Bank Syariah Indonesia (BSI)', noRek: '712-345-6789', an: 'Dapur Manis' },
  SeaBank: { bank: 'SeaBank', noRek: '901-234-5678', an: 'Dapur Manis' }
};

function perbaruiInfoBankCheckout() {
  const selectBank = document.getElementById('selectBank');
  const box = document.getElementById('infoBankCheckoutBox');
  if (!selectBank || !box) return;

  const key = selectBank.value || 'BCA';
  const info = daftarRekeningBank[key] || daftarRekeningBank.BCA;

  box.innerHTML = `
    <div class="bank-live-row">
      <div class="bank-live-info">
        <span class="live-label">No. Rekening ${info.bank}:</span>
        <strong class="live-val">${info.noRek}</strong>
        <span class="live-an">a.n ${info.an}</span>
      </div>
      <button type="button" class="btn-copy-live" onclick="salinNomorRekening('${info.noRek}', this)">
        📋 Salin
      </button>
    </div>
  `;
}

function togglePilihanBank() {
  const radioTransfer = document.getElementById('radioTransferBank');
  const radioQRIS = document.querySelector('input[name="metodeBayar"][value="QRIS"]');
  const radioCOD = document.querySelector('input[name="metodeBayar"][value="COD (Bayar di Tempat)"]');

  const wrapperBank = document.getElementById('pilihanBankWrapper');
  const infoQRIS = document.getElementById('qrisInfoCheckout');
  const infoCOD = document.getElementById('codInfoCheckout');

  if (radioTransfer && radioTransfer.checked) {
    if (wrapperBank) wrapperBank.style.display = 'block';
    if (infoQRIS) infoQRIS.style.display = 'none';
    if (infoCOD) infoCOD.style.display = 'none';
    perbaruiInfoBankCheckout();
  } else if (radioQRIS && radioQRIS.checked) {
    if (wrapperBank) wrapperBank.style.display = 'none';
    if (infoQRIS) infoQRIS.style.display = 'block';
    if (infoCOD) infoCOD.style.display = 'none';
  } else if (radioCOD && radioCOD.checked) {
    if (wrapperBank) wrapperBank.style.display = 'none';
    if (infoQRIS) infoQRIS.style.display = 'none';
    if (infoCOD) infoCOD.style.display = 'block';
  }
}

function salinNomorRekening(noRek, btnEl) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(noRek.replace(/[^0-9]/g, ''));
  }
  tampilkanNotifikasi(`📋 No. Rekening "${noRek}" berhasil disalin!`);

  if (btnEl) {
    const teksAsli = btnEl.innerHTML;
    btnEl.innerHTML = '✓ Tersalin!';
    btnEl.classList.add('tersalin');
    setTimeout(function() {
      btnEl.innerHTML = teksAsli;
      btnEl.classList.remove('tersalin');
    }, 2000);
  }
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkoutSummaryItems');
  if (!container) return;

  let html = '';
  dataKeranjang.forEach(function(item) {
    const porsiText = item.porsiNama ? `<span class="co-item-porsi">🍰 ${item.porsiNama}</span>` : '';
    const addonText = item.addons && item.addons.length > 0 ? `<span class="co-item-addon">+ ${item.addons.map(function(a){ return a.nama; }).join(', ')}</span>` : '';
    const tulisanText = item.tulisanKue ? `<span class="co-item-custom-note">✍️ "${item.tulisanKue}"</span>` : '';

    html += `
      <div class="checkout-item-row">
        <div class="co-item-detail">
          <img src="${item.gambar}" alt="${item.nama}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80';" />
          <div>
            <h5>${item.nama}</h5>
            ${porsiText}
            ${addonText}
            ${tulisanText}
            <span class="co-item-qty">${item.jumlah} × ${item.hargaStr}</span>
          </div>
        </div>
        <span class="co-item-total">${formatRupiah(item.hargaAngka * item.jumlah)}</span>
      </div>
    `;
  });
  container.innerHTML = html;

  const kalkulasi = hitungTotalKeranjang();
  const subtotalEl = document.getElementById('coSubtotal');
  const diskonEl = document.getElementById('coDiskon');
  const rowDiskon = document.getElementById('coRowDiskon');
  const namaVoucherEl = document.getElementById('coNamaVoucher');
  const ongkirEl = document.getElementById('coOngkir');
  const totalEl = document.getElementById('coTotalAkhir');

  if (subtotalEl) subtotalEl.textContent = formatRupiah(kalkulasi.subtotal);
  if (totalEl) totalEl.textContent = formatRupiah(kalkulasi.total);

  if (voucherAktif && kalkulasi.diskon > 0) {
    if (rowDiskon) rowDiskon.style.display = 'flex';
    if (namaVoucherEl) namaVoucherEl.textContent = voucherAktif.kode;
    if (diskonEl) diskonEl.textContent = '- ' + formatRupiah(kalkulasi.diskon);
  } else {
    if (rowDiskon) rowDiskon.style.display = 'none';
  }

  if (ongkirEl) {
    if (kalkulasi.opsiPengiriman === 'pickup') {
      ongkirEl.textContent = 'GRATIS (Ambil di Toko)';
      ongkirEl.className = 'text-green bold';
    } else if (voucherAktif && voucherAktif.tipe === 'ongkir') {
      ongkirEl.textContent = 'GRATIS (Voucher FREEONGKIR)';
      ongkirEl.className = 'text-green bold';
    } else {
      ongkirEl.textContent = formatRupiah(kalkulasi.ongkir);
      ongkirEl.className = 'text-normal';
    }
  }

  // Render Pemilih Voucher Cerdas di Ringkasan Checkout
  renderVoucherCheckoutBanner();
}

function prosesCheckout(e) {
  e.preventDefault();

  if (dataKeranjang.length === 0) {
    alert('Keranjang belanja kosong!');
    return;
  }

  const nama = document.getElementById('coNama').value.trim();
  const telepon = document.getElementById('coTelepon').value.trim();
  const tanggal = document.getElementById('coTanggal').value;
  const waktu = document.getElementById('coWaktu').value;
  const catatan = document.getElementById('coCatatan').value.trim();

  const radioOpsi = document.querySelector('input[name="opsiPengiriman"]:checked');
  const opsiPengiriman = radioOpsi ? radioOpsi.value : 'delivery';

  let alamatFinal = '';
  if (opsiPengiriman === 'pickup') {
    alamatFinal = 'Ambil Sendiri di Toko Dapur Manis (Jl. Cempaka Manis No. 45)';
  } else {
    const alamatInput = document.getElementById('coAlamat');
    alamatFinal = alamatInput ? alamatInput.value.trim() : '';
    if (!alamatFinal) {
      alert('Mohon isi alamat pengiriman dengan lengkap!');
      return;
    }
  }

  const radioBayar = document.querySelector('input[name="metodeBayar"]:checked');
  let metodeBayar = radioBayar ? radioBayar.value : 'QRIS';

  if (metodeBayar === 'Transfer Bank') {
    const selectBank = document.getElementById('selectBank');
    const bankDipilih = selectBank ? selectBank.value : 'BCA';
    metodeBayar = 'Transfer Bank ' + bankDipilih;
  }

  if (!nama || !telepon || !tanggal) {
    alert('Mohon lengkapi semua data wajib bertanda bintang (*)!');
    return;
  }

  const randomId = Math.floor(1000 + Math.random() * 9000);
  const tanggalStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const noOrder = 'DM-' + tanggalStr + '-' + randomId;

  const kalkulasi = hitungTotalKeranjang(opsiPengiriman);

  dataOrderTerakhir = {
    noOrder: noOrder,
    nama: nama,
    telepon: telepon,
    alamat: alamatFinal,
    opsiPengiriman: opsiPengiriman,
    tanggal: tanggal,
    waktu: waktu,
    catatan: catatan || 'Tidak ada catatan',
    metodeBayar: metodeBayar,
    items: JSON.parse(JSON.stringify(dataKeranjang)),
    subtotal: kalkulasi.subtotal,
    diskon: kalkulasi.diskon,
    ongkir: kalkulasi.ongkir,
    total: kalkulasi.total,
    voucher: voucherAktif ? voucherAktif.kode : null
  };

  dataKeranjang = [];
  voucherAktif = null;
  simpanKeranjangKeStorage();

  tutupCheckout();
  tampilkanSuksesModal(dataOrderTerakhir);
}

function tampilkanSuksesModal(order) {
  const modal = document.getElementById('successModal');
  const overlay = document.getElementById('cartOverlay');
  const receiptContainer = document.getElementById('orderReceiptDetails');
  if (!modal || !overlay || !receiptContainer) return;

  let itemsHtml = order.items.map(function(item) {
    const porsiTxt = item.porsiNama ? `<span class="slip-tag tag-porsi">Porsi: ${item.porsiNama}</span>` : '';
    const addonTxt = item.addons && item.addons.length > 0 ? `<span class="slip-tag tag-addon">+ ${item.addons.map(function(a){ return a.nama; }).join(', ')}</span>` : '';
    const noteTxt = item.tulisanKue ? `<div class="slip-note">Ucapan: "${item.tulisanKue}"</div>` : '';

    return `
      <div class="slip-item-row">
        <div class="slip-item-info">
          <strong>${item.nama}</strong>
          <div>${porsiTxt}${addonTxt}</div>
          ${noteTxt}
        </div>
        <span class="slip-item-qty">${item.jumlah}x</span>
        <span class="slip-item-price">${formatRupiah(item.hargaAngka * item.jumlah)}</span>
      </div>
    `;
  }).join('');

  const labelLayanan = order.opsiPengiriman === 'pickup' ? 'Ambil di Toko (Pick-up)' : 'Diantar ke Alamat (Delivery)';

  const isCOD = order.metodeBayar.includes('COD');
  const isQRIS = order.metodeBayar.includes('QRIS');
  const isTransfer = order.metodeBayar.includes('Transfer Bank');

  // Status awal struk
  let statusBadgeHtml = '';
  if (isCOD) {
    statusBadgeHtml = `<span class="status-order-pill status-cod" id="badgeStatusBayar">💵 Bayar saat Terima Kue (COD)</span>`;
  } else {
    statusBadgeHtml = `<span class="status-order-pill status-pending" id="badgeStatusBayar">🟡 Menunggu Konfirmasi Toko via WhatsApp</span>`;
  }

  // Bagian Detail Pembayaran (QRIS / Bank / COD)
  let paymentGuideHtml = '';
  if (isQRIS) {
    paymentGuideHtml = `
      <div class="receipt-payment-box qris-payment-box">
        <div class="pay-box-header">
          <span class="pay-box-icon">🟢</span>
          <div>
            <h6>Scan QRIS Dapur Manis</h6>
            <small>Gunakan BCA Mobile, GoPay, OVO, ShopeePay, Dana, atau m-Banking apa saja</small>
          </div>
        </div>
        <div class="qris-display-card">
          <div class="qris-brand-bar">
            <span class="qris-brand-title">QRIS</span>
            <span class="qris-brand-sub">Pembayaran Digital Resmi</span>
          </div>
          <div class="qris-qr-wrap">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=00020101021226600016ID.CO.QRIS.WWW01189360091100212345670215DAPURMANISBAKE51440014ID.LINKAJA.WWW02150000000000000005204581253033605407${order.total}5802ID5911DAPUR+MANIS6004KOTA6304" alt="QRIS Dapur Manis" class="qris-qr-image" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DAPUR+MANIS+TOTAL+${order.total}'" />
          </div>
          <div class="qris-merchant-info">
            <strong>DAPUR MANIS BAKERY</strong>
            <span>NMID: ID1020304050607</span>
            <div class="qris-total-amount">Total: <strong>${formatRupiah(order.total)}</strong></div>
          </div>
        </div>
        <p class="pay-note">💡 <em>Setelah scan pembayaran, silakan unduh foto struk di bawah ini dan konfirmasi langsung ke WhatsApp Admin.</em></p>
      </div>
    `;
  } else if (isTransfer) {
    let bankKey = 'BCA';
    Object.keys(daftarRekeningBank).forEach(function(k) {
      if (order.metodeBayar.includes(k)) bankKey = k;
    });
    const bankInfo = daftarRekeningBank[bankKey] || daftarRekeningBank.BCA;

    paymentGuideHtml = `
      <div class="receipt-payment-box bank-payment-box">
        <div class="pay-box-header">
          <span class="pay-box-icon">🏦</span>
          <div>
            <h6>Rekening Pembayaran (${bankInfo.bank})</h6>
            <small>Silakan transfer tepat sebesar total tagihan ke rekening berikut</small>
          </div>
        </div>
        <div class="bank-account-card">
          <div class="bank-acc-row">
            <span class="acc-label">Bank Tujuan:</span>
            <strong class="acc-val">${bankInfo.bank}</strong>
          </div>
          <div class="bank-acc-row rekening-highlight">
            <div>
              <span class="acc-label">Nomor Rekening:</span>
              <strong class="acc-val no-rek">${bankInfo.noRek}</strong>
            </div>
            <button type="button" class="btn-copy-rek" onclick="salinNomorRekening('${bankInfo.noRek}', this)">
              📋 Salin No. Rekening
            </button>
          </div>
          <div class="bank-acc-row">
            <span class="acc-label">Atas Nama:</span>
            <strong class="acc-val">${bankInfo.an}</strong>
          </div>
          <div class="bank-acc-row total-highlight">
            <span class="acc-label">Nominal Transfer:</span>
            <strong class="acc-val text-primary">${formatRupiah(order.total)}</strong>
          </div>
        </div>
      </div>
    `;
  } else {
    // COD
    paymentGuideHtml = `
      <div class="receipt-payment-box cod-payment-box">
        <div class="pay-box-header">
          <span class="pay-box-icon">💵</span>
          <div>
            <h6>Pembayaran Tunai (COD)</h6>
            <small>Bayar saat pesanan kue diserahkan ke alamat atau diambil di toko</small>
          </div>
        </div>
        <div class="cod-info-card">
          <p>Silakan siapkan uang pas sebesar <strong>${formatRupiah(order.total)}</strong> untuk diserahkan ke kurir pengantar atau kasir toko Dapur Manis.</p>
        </div>
      </div>
    `;
  }

  receiptContainer.innerHTML = `
    <!-- KARTU STRUK BUTIK RESMI -->
    <div class="artisan-receipt-card">
      <div class="receipt-top-brand">
        <span class="receipt-brand-badge">✦ OFFICIAL RECEIPT ✦</span>
        <h4 class="receipt-brand-title">DAPUR MANIS</h4>
        <div class="receipt-brand-sub">Artisan Bakery & Patisserie</div>
        <div class="receipt-brand-contact">Jl. Manis Indah No. 12, Surabaya • WA: 0858-1609-8398</div>
      </div>

      <div class="receipt-divider-dash"></div>

      <div class="receipt-meta-grid">
        <div class="meta-row">
          <span class="meta-label">No. Struk</span>
          <span class="meta-value highlight-order">#${order.noOrder}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Tanggal & Jam</span>
          <span class="meta-value">${order.tanggal} (${order.waktu})</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Nama Pemesan</span>
          <span class="meta-value">${order.nama} (${order.telepon})</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Layanan</span>
          <span class="meta-value">${labelLayanan}</span>
        </div>
        <div class="meta-row full">
          <span class="meta-label">Alamat Tujuan</span>
          <span class="meta-value">${order.alamat}</span>
        </div>
        ${order.catatan !== 'Tidak ada catatan' ? `
        <div class="meta-row full">
          <span class="meta-label">Catatan Khusus</span>
          <span class="meta-value" style="color:#742835; font-style:italic;">"${order.catatan}"</span>
        </div>` : ''}
      </div>

      <div class="receipt-status-wrap">
        ${statusBadgeHtml}
      </div>

      <div class="receipt-divider-dash"></div>

      <div class="receipt-items-slip">
        <div class="slip-items-header">
          <span>MENU KUE</span>
          <span style="text-align:center;">QTY</span>
          <span style="text-align:right;">TOTAL</span>
        </div>
        ${itemsHtml}
      </div>

      <div class="receipt-divider-dash"></div>

      <div class="slip-calc-box">
        <div class="slip-calc-row"><span>Subtotal Produk</span><span>${formatRupiah(order.subtotal)}</span></div>
        ${order.diskon > 0 ? `<div class="slip-calc-row slip-diskon"><span>Diskon (${order.voucher})</span><span>- ${formatRupiah(order.diskon)}</span></div>` : ''}
        <div class="slip-calc-row"><span>Ongkos Kirim</span><span>${order.ongkir === 0 ? 'GRATIS (Rp 0)' : formatRupiah(order.ongkir)}</span></div>
        <div class="slip-grand-total">
          <span>TOTAL TAGIHAN</span>
          <strong>${formatRupiah(order.total)}</strong>
        </div>
      </div>

      <div class="receipt-barcode-wrap">
        <div class="simulated-barcode-img"></div>
        <div class="barcode-code">* ${order.noOrder} *</div>
        <p class="receipt-sweet-note">Baked fresh with love every single day ♡<br>Terima kasih telah memesan kue di Dapur Manis!</p>
      </div>
    </div>

    <!-- PANDUAN PEMBAYARAN KONSUMEN -->
    <div class="payment-instructions-wrap" style="margin-top: 14px;">
      ${paymentGuideHtml}
    </div>
  `;

  modal.classList.add('buka');
  overlay.classList.add('aktif');
  document.body.style.overflow = 'hidden';
}

function kirimWhatsAppPesanan() {
  if (!dataOrderTerakhir) return;
  const o = dataOrderTerakhir;

  const itemTeks = o.items.map(function(i, idx) {
    let t = `${idx + 1}. *${i.nama}* (${i.jumlah}x)\n   - Harga: ${formatRupiah(i.hargaAngka * i.jumlah)}`;
    if (i.porsiNama) t += `\n   - Ukuran: ${i.porsiNama}`;
    if (i.addons && i.addons.length > 0) t += `\n   - Add-on: ${i.addons.map(function(a){ return a.nama; }).join(', ')}`;
    if (i.tulisanKue) t += `\n   - Ucapan di Kue: "${i.tulisanKue}"`;
    return t;
  }).join('\n\n');

  const labelLayanan = o.opsiPengiriman === 'pickup' ? 'Ambil Sendiri di Toko (Pick-up)' : 'Diantar ke Alamat (Delivery)';

  let statusBayarWA = '';
  if (o.metodeBayar.includes('COD')) {
    statusBayarWA = 'Bayar di Tempat (COD saat terima kue)';
  } else {
    statusBayarWA = 'Menunggu Konfirmasi Toko via WA (Struk PDF terlampir)';
  }

  let pesanWA = `*KONFIRMASI PESANAN - DAPUR MANIS*\n` +
    `----------------------------------------\n` +
    `*No. Pesanan:* #${o.noOrder}\n` +
    `*Jadwal:* ${o.tanggal} (${o.waktu})\n\n` +
    `*DATA PEMESAN*\n` +
    `Nama: ${o.nama}\n` +
    `No. WA: ${o.telepon}\n` +
    `Layanan: ${labelLayanan}\n` +
    `Alamat: ${o.alamat}\n` +
    `Metode Bayar: ${o.metodeBayar}\n` +
    `Status Bayar: ${statusBayarWA}\n` +
    (o.catatan && o.catatan !== 'Tidak ada catatan' ? `Catatan Khusus: ${o.catatan}\n` : '') +
    `----------------------------------------\n\n` +
    `*RINCIAN MENU KUE*\n` +
    `${itemTeks}\n\n` +
    `----------------------------------------\n` +
    `*RINCIAN BIAYA*\n` +
    `Subtotal Produk: ${formatRupiah(o.subtotal)}\n` +
    (o.diskon > 0 ? `Diskon (${o.voucher}): - ${formatRupiah(o.diskon)}\n` : '') +
    `Ongkos Kirim: ${o.ongkir === 0 ? 'GRATIS (Rp 0)' : formatRupiah(o.ongkir)}\n` +
    `*TOTAL TAGIHAN: ${formatRupiah(o.total)}*\n` +
    `----------------------------------------\n\n` +
    `Foto struk pesanan resmi telah saya simpan dan saya lampirkan di chat ini. Mohon segera diproses ya. Terima kasih!`;

  const noWA = "6285816098398";
  const urlWA = 'https://wa.me/' + noWA + '?text=' + encodeURIComponent(pesanWA);

  // Buat tautan virtual lalu klik otomatis
  const linkWA = document.createElement('a');
  linkWA.href = urlWA;
  linkWA.target = '_blank';
  linkWA.rel = 'noopener noreferrer';
  document.body.appendChild(linkWA);
  linkWA.click();
  document.body.removeChild(linkWA);
}

function unduhFotoStruk() {
  if (!dataOrderTerakhir) {
    tampilkanNotifikasi('Belum ada data pesanan untuk diunduh.');
    return;
  }
  const o = dataOrderTerakhir;

  try {
    const W = 560;
    const paperX = 35;
    const paperW = W - 70; // 490px
    const innerPad = 24;
    const contentW = paperW - (innerPad * 2);

    // Canvas pengukur teks untuk perhitungan layout dinamis
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = '12px "Plus Jakarta Sans", sans-serif';

    function hitungBarisTeks(teks, maxW, fontSpec) {
      if (!teks) return [];
      if (fontSpec) tempCtx.font = fontSpec;
      const kata = String(teks).split(' ');
      const baris = [];
      let cur = '';
      for (let i = 0; i < kata.length; i++) {
        const test = cur ? cur + ' ' + kata[i] : kata[i];
        if (tempCtx.measureText(test).width > maxW && cur) {
          baris.push(cur);
          cur = kata[i];
        } else {
          cur = test;
        }
      }
      if (cur) baris.push(cur);
      return baris;
    }

    const barisAlamat = hitungBarisTeks(o.alamat, contentW - 20, '600 11.5px "Plus Jakarta Sans", sans-serif');
    const barisCatatan = (o.catatan && o.catatan !== 'Tidak ada catatan')
      ? hitungBarisTeks(o.catatan, contentW - 20, 'italic 11px "Plus Jakarta Sans", sans-serif')
      : [];

    // Pre-calculate per-item text wrapping & heights
    const itemLayouts = o.items.map(function(item, idx) {
      const barisNama = hitungBarisTeks((idx + 1) + '. ' + item.nama, contentW - 170, 'bold 12px "Plus Jakarta Sans", sans-serif');
      let barisAddons = [];
      if (item.addons && item.addons.length > 0) {
        barisAddons = hitungBarisTeks('↳ Add-on: ' + item.addons.map(function(a){ return a.nama; }).join(', '), contentW - 20, '500 10.5px "Plus Jakarta Sans", sans-serif');
      }
      let barisUcapan = [];
      if (item.tulisanKue) {
        barisUcapan = hitungBarisTeks('↳ Ucapan: "' + item.tulisanKue + '"', contentW - 20, 'italic 10.5px "Plus Jakarta Sans", sans-serif');
      }
      return {
        barisNama: barisNama,
        barisAddons: barisAddons,
        barisUcapan: barisUcapan
      };
    });

    // Detail Rekening / QRIS jika ada
    let bankDetailTeks = '';
    if (o.metodeBayar.includes('Transfer Bank')) {
      let bankKey = 'BCA';
      Object.keys(daftarRekeningBank).forEach(function(k) {
        if (o.metodeBayar.includes(k)) bankKey = k;
      });
      const bInfo = daftarRekeningBank[bankKey] || daftarRekeningBank.BCA;
      bankDetailTeks = 'No. Rek ' + bInfo.bank + ': ' + bInfo.noRek + ' (a.n ' + bInfo.an + ')';
    } else if (o.metodeBayar.includes('QRIS')) {
      bankDetailTeks = 'NMID: ID1020304050607 (Scan QRIS Dapur Manis)';
    }

    const barisFooterTeks = hitungBarisTeks(
      'Simpan foto struk ini untuk konfirmasi ke WhatsApp (0858-1609-8398)',
      contentW - 20,
      '500 9.5px "Plus Jakarta Sans", sans-serif'
    );

    // ==========================================
    // HITUNG TINGGI KERTAS STRUK SECARA PERSIS & AKURAT
    // ==========================================
    let simY = 28; // Jarak awal dari tepi atas kertas (paperY)
    simY += 22;    // Badge '✦ OFFICIAL BAKERY RECEIPT ✦'
    simY += 16;    // Title 'DAPUR MANIS'
    simY += 16;    // Subtitle 'ARTISAN BAKERY & PATISSERIE'
    simY += 18;    // Alamat toko
    simY += 18;    // Dotted line

    // Meta Header
    simY += 14;    // Label 'NO. STRUK' / 'TANGGAL'
    simY += 20;    // Nilai No Struk & Tanggal
    simY += 14;    // Label 'PEMESAN' / 'LAYANAN'
    simY += 20;    // Nilai Pemesan & Layanan
    simY += 14;    // Label 'ALAMAT TUJUAN'
    simY += Math.max(1, barisAlamat.length) * 16; // Baris alamat
    if (barisCatatan.length > 0) {
      simY += 14;  // Label 'CATATAN KHUSUS'
      simY += barisCatatan.length * 16; // Baris catatan
    }

    // Status Pill
    simY += 38;    // Rounded pill status (height 28 + margin 10)
    simY += 14;    // Dotted line

    // Tabel Menu Kue
    simY += 34;    // Header table bar (height 26 + margin 8)
    itemLayouts.forEach(function(il, idx) {
      simY += il.barisNama.length * 16;
      if (o.items[idx].porsiNama) simY += 16;
      if (il.barisAddons.length > 0) simY += il.barisAddons.length * 16;
      if (il.barisUcapan.length > 0) simY += il.barisUcapan.length * 16;
      simY += 6; // Jarak antar item
    });
    simY += 16;    // Dotted line

    // Rincian Biaya
    simY += 18;    // Subtotal
    if (o.diskon > 0) simY += 18; // Diskon Voucher
    simY += 18;    // Ongkos Kirim
    simY += 6;     // Spasi sebelum Grand Total
    simY += 48;    // Grand Total pill (height 40 + margin 8)
    simY += 18;    // Metode Bayar
    if (bankDetailTeks) simY += 16; // Info no rek / NMID
    simY += 16;    // Dotted line

    // Barcode & Footer
    simY += 34 + 10; // Barcode height (34) + spacing (10)
    simY += 18;      // '* NO ORDER *'
    simY += 16;      // 'Baked fresh with love...'
    simY += barisFooterTeks.length * 15; // Catatan WA konfirmasi

    // Padding ekstra di bawah teks sebelum gerigi sobekan kertas
    simY += 34;

    const paperH = Math.ceil(simY);
    const paperY = 24;
    const H = paperH + (paperY * 2); // Padding studio atas & bawah simetris

    // Buat canvas utama skala 2x (Retina untuk ketajaman maksimal)
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Helper: Path Kertas Struk dengan Sobekan Zig-zag (Serrated Tear Edges)
    function tracePaperTicket(x, y, w, h, toothW, toothH) {
      const teeth = Math.floor(w / toothW);
      const actualToothW = w / teeth;

      ctx.beginPath();
      // Mulai dari kiri atas
      ctx.moveTo(x, y + toothH);
      // Gigi sobekan atas
      for (let i = 0; i < teeth; i++) {
        const midX = x + (i * actualToothW) + (actualToothW / 2);
        const endX = x + ((i + 1) * actualToothW);
        ctx.lineTo(midX, y);
        ctx.lineTo(endX, y + toothH);
      }
      // Sisi kanan lurus ke bawah
      ctx.lineTo(x + w, y + h - toothH);
      // Gigi sobekan bawah (dari kanan ke kiri)
      for (let i = teeth - 1; i >= 0; i--) {
        const midX = x + (i * actualToothW) + (actualToothW / 2);
        const startX = x + (i * actualToothW);
        ctx.lineTo(midX, y + h);
        ctx.lineTo(startX, y + h - toothH);
      }
      // Sisi kiri lurus ke atas
      ctx.lineTo(x, y + toothH);
      ctx.closePath();
    }

    // Helper: Rounded Rectangle
    function drawRoundRect(x, y, w, h, r, fillColor, strokeColor, strokeWidth) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      if (strokeColor) {
        ctx.lineWidth = strokeWidth || 1;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Helper: Dotted Line
    function drawDottedLine(y) {
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#dfcfc4';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(paperX + innerPad, y);
      ctx.lineTo(paperX + paperW - innerPad, y);
      ctx.stroke();
      ctx.restore();
    }

    // 1. Studio Table Background
    ctx.fillStyle = '#f6f2ec';
    ctx.fillRect(0, 0, W, H);

    // 2. Kertas Struk Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(74, 25, 34, 0.12)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#fffdfa';
    tracePaperTicket(paperX, paperY, paperW, paperH, 10, 6);
    ctx.fill();
    ctx.restore();

    // Border Kertas
    ctx.save();
    ctx.strokeStyle = '#ebdcd0';
    ctx.lineWidth = 1;
    tracePaperTicket(paperX, paperY, paperW, paperH, 10, 6);
    ctx.stroke();
    ctx.restore();

    let curY = paperY + 28;

    // 3. Header Toko Bakery
    ctx.textAlign = 'center';
    ctx.fillStyle = '#b25e24';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✦ OFFICIAL BAKERY RECEIPT ✦', paperX + (paperW / 2), curY);
    curY += 22;

    ctx.fillStyle = '#742835';
    ctx.font = 'bold 23px "Playfair Display", Georgia, serif';
    ctx.fillText('DAPUR MANIS', paperX + (paperW / 2), curY);
    curY += 16;

    ctx.fillStyle = '#996d74';
    ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ARTISAN BAKERY & PATISSERIE', paperX + (paperW / 2), curY);
    curY += 16;

    ctx.fillStyle = '#7a6267';
    ctx.font = '500 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Jl. Manis Indah No. 12, Surabaya • WA: 0858-1609-8398', paperX + (paperW / 2), curY);
    curY += 18;

    // Cap Stempel Vintage Bakery (Rubber Stamp Effect)
    const isCOD = o.metodeBayar.includes('COD');
    ctx.save();
    ctx.translate(paperX + paperW - 68, paperY + 68);
    ctx.rotate(-0.14);
    drawRoundRect(-55, -20, 110, 40, 8, null, 'rgba(180, 45, 65, 0.75)', 1.6);
    drawRoundRect(-51, -16, 102, 32, 6, null, 'rgba(180, 45, 65, 0.4)', 1);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(180, 45, 65, 0.85)';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('★ DAPUR MANIS ★', 0, -4);
    ctx.font = '900 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(isCOD ? 'ORDER (COD)' : 'CONFIRMED', 0, 9);
    ctx.restore();

    drawDottedLine(curY);
    curY += 18;

    // 4. Data Pemesan (2 Kolom Rapi)
    const labelLayanan = o.opsiPengiriman === 'pickup' ? 'Ambil di Toko (Pick-up)' : 'Diantar (Delivery)';
    const col1X = paperX + innerPad;
    const col2X = paperX + (paperW / 2) + 6;

    ctx.textAlign = 'left';
    ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#8f6e74';
    ctx.fillText('NO. STRUK', col1X, curY);
    ctx.fillText('TANGGAL', col2X, curY);
    curY += 14;

    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#742835';
    ctx.fillText('#' + o.noOrder, col1X, curY);
    ctx.font = '600 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#2d181e';
    ctx.fillText(o.tanggal + ' (' + o.waktu + ')', col2X, curY);
    curY += 20;

    ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#8f6e74';
    ctx.fillText('PEMESAN', col1X, curY);
    ctx.fillText('LAYANAN', col2X, curY);
    curY += 14;

    ctx.font = '600 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#2d181e';
    ctx.fillText(o.nama + ' (' + o.telepon + ')', col1X, curY);
    ctx.fillText(labelLayanan, col2X, curY);
    curY += 20;

    // Alamat
    ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#8f6e74';
    ctx.fillText('ALAMAT TUJUAN', col1X, curY);
    curY += 14;

    ctx.font = '600 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#2d181e';
    if (barisAlamat.length > 0) {
      for (let i = 0; i < barisAlamat.length; i++) {
        ctx.fillText(barisAlamat[i], col1X, curY);
        curY += 16;
      }
    } else {
      ctx.fillText('-', col1X, curY);
      curY += 16;
    }

    if (barisCatatan.length > 0) {
      ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#8f6e74';
      ctx.fillText('CATATAN KHUSUS', col1X, curY);
      curY += 14;

      ctx.font = 'italic 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#742835';
      for (let i = 0; i < barisCatatan.length; i++) {
        ctx.fillText('"' + barisCatatan[i] + '"', col1X, curY);
        curY += 16;
      }
    }

    // Status Pill
    const statusTeks = isCOD ? '💵 Bayar saat Terima Kue (COD)' : '🟡 Menunggu Konfirmasi Toko via WA';
    const statusBg = isCOD ? '#fef3ec' : '#fef9c3';
    const statusBorder = isCOD ? '#fed7aa' : '#fde047';
    const statusColor = isCOD ? '#c2410c' : '#854d0e';

    drawRoundRect(paperX + innerPad, curY, contentW, 28, 8, statusBg, statusBorder, 1);
    ctx.textAlign = 'center';
    ctx.fillStyle = statusColor;
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(statusTeks, paperX + (paperW / 2), curY + 18);
    curY += 38;

    drawDottedLine(curY);
    curY += 14;

    // 5. Tabel Menu Kue (Header Bar)
    drawRoundRect(paperX + innerPad, curY, contentW, 26, 6, '#faf4ed', '#ebdcd0', 0.8);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#8f6e74';
    ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MENU KUE', paperX + innerPad + 10, curY + 17);
    ctx.textAlign = 'center';
    ctx.fillText('QTY', paperX + paperW - innerPad - 110, curY + 17);
    ctx.textAlign = 'right';
    ctx.fillText('TOTAL', paperX + paperW - innerPad - 10, curY + 17);
    curY += 34;

    o.items.forEach(function(item, idx) {
      const il = itemLayouts[idx];

      ctx.textAlign = 'left';
      ctx.fillStyle = '#2d181e';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      for (let n = 0; n < il.barisNama.length; n++) {
        ctx.fillText(il.barisNama[n], paperX + innerPad + 8, curY);
        if (n === 0) {
          ctx.textAlign = 'center';
          ctx.font = 'bold 11.5px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#6b545a';
          ctx.fillText(item.jumlah + 'x', paperX + paperW - innerPad - 110, curY);

          ctx.textAlign = 'right';
          ctx.fillStyle = '#742835';
          ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(formatRupiah(item.hargaAngka * item.jumlah), paperX + paperW - innerPad - 8, curY);

          ctx.textAlign = 'left';
          ctx.fillStyle = '#2d181e';
          ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        }
        curY += 16;
      }

      if (item.porsiNama) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#b25e24';
        ctx.font = '500 10.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('   ↳ Ukuran: ' + item.porsiNama, paperX + innerPad + 8, curY);
        curY += 16;
      }

      if (il.barisAddons.length > 0) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#6b545a';
        ctx.font = '500 10.5px "Plus Jakarta Sans", sans-serif';
        for (let a = 0; a < il.barisAddons.length; a++) {
          ctx.fillText((a === 0 ? '   ' : '     ') + il.barisAddons[a], paperX + innerPad + 8, curY);
          curY += 16;
        }
      }

      if (il.barisUcapan.length > 0) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#742835';
        ctx.font = 'italic 10.5px "Plus Jakarta Sans", sans-serif';
        for (let u = 0; u < il.barisUcapan.length; u++) {
          ctx.fillText((u === 0 ? '   ' : '     ') + il.barisUcapan[u], paperX + innerPad + 8, curY);
          curY += 16;
        }
      }

      curY += 6;
    });

    drawDottedLine(curY);
    curY += 16;

    // 6. Rincian Biaya
    function drawBiayaLine(label, valTeks, isDiskon) {
      ctx.textAlign = 'left';
      ctx.fillStyle = isDiskon ? '#16a34a' : '#6d555b';
      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(label, paperX + innerPad + 6, curY);

      ctx.textAlign = 'right';
      ctx.fillStyle = isDiskon ? '#16a34a' : '#2d181e';
      ctx.font = isDiskon ? 'bold 12px "Plus Jakarta Sans", sans-serif' : '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(valTeks, paperX + paperW - innerPad - 6, curY);
      curY += 18;
    }

    drawBiayaLine('Subtotal Produk', formatRupiah(o.subtotal));
    if (o.diskon > 0) {
      drawBiayaLine('Diskon Voucher (' + (o.voucher || 'VOUCHER') + ')', '- ' + formatRupiah(o.diskon), true);
    }
    drawBiayaLine('Ongkos Kirim', o.ongkir === 0 ? 'GRATIS (Rp 0)' : formatRupiah(o.ongkir));
    curY += 6;

    // Grand Total Banner
    drawRoundRect(paperX + innerPad, curY, contentW, 40, 10, '#742835');
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TOTAL PEMBAYARAN:', paperX + innerPad + 14, curY + 25);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffeedd';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(formatRupiah(o.total), paperX + paperW - innerPad - 14, curY + 25);
    curY += 48;

    // Metode Bayar
    ctx.textAlign = 'left';
    ctx.fillStyle = '#7a6267';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Metode Pembayaran: ' + o.metodeBayar, paperX + innerPad + 6, curY);
    curY += 18;

    if (bankDetailTeks) {
      ctx.fillStyle = '#742835';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('💳 ' + bankDetailTeks, paperX + innerPad + 6, curY);
      curY += 16;
    }

    drawDottedLine(curY);
    curY += 16;

    // 7. Simulated Barcode
    const barcodeW = 230;
    const barcodeH = 34;
    const barcodeX = paperX + (paperW - barcodeW) / 2;
    const barCount = 44;
    const unitW = barcodeW / barCount;
    ctx.fillStyle = '#2c181e';

    for (let i = 0; i < barCount; i++) {
      const code = (o.noOrder.charCodeAt(i % o.noOrder.length) + (i * 7)) % 10;
      if (code % 2 === 0 || i === 0 || i === barCount - 1 || i % 5 === 0) {
        const isThick = code > 5;
        const bW = isThick ? unitW * 0.85 : unitW * 0.45;
        ctx.fillRect(barcodeX + (i * unitW), curY, bW, barcodeH);
      }
    }
    curY += barcodeH + 10;

    ctx.textAlign = 'center';
    ctx.fillStyle = '#7a6267';
    ctx.font = 'bold 11px "Courier New", Courier, monospace';
    ctx.fillText('* ' + o.noOrder + ' *', paperX + (paperW / 2), curY);
    curY += 18;

    ctx.fillStyle = '#742835';
    ctx.font = 'bold 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Baked fresh with love every single day ♡', paperX + (paperW / 2), curY);
    curY += 16;

    ctx.fillStyle = '#8f6e74';
    ctx.font = '500 9.5px "Plus Jakarta Sans", sans-serif';
    for (let f = 0; f < barisFooterTeks.length; f++) {
      ctx.fillText(barisFooterTeks[f], paperX + (paperW / 2), curY);
      curY += 15;
    }

    // Download PNG Otomatis
    const link = document.createElement('a');
    link.download = 'Struk-DapurManis-' + o.noOrder + '.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    tampilkanNotifikasi('📸 Foto struk estetik berhasil diunduh! Silakan lampirkan di WhatsApp.');
  } catch (err) {
    console.error('Gagal membuat foto struk:', err);
    tampilkanNotifikasi('Gagal membuat foto struk: ' + err.message);
  }
}

// Fallback alias jika masih ada pemanggilan lama
function simpanStrukPDF() {
  unduhFotoStruk();
}

function tutupSuksesModal() {
  const modal = document.getElementById('successModal');
  const overlay = document.getElementById('cartOverlay');
  if (modal) modal.classList.remove('buka');
  if (overlay) overlay.classList.remove('aktif');
  document.body.style.overflow = '';
}

function tampilkanNotifikasi(pesan) {
  const notif = document.getElementById('notifikasi');
  if (!notif) return;

  notif.textContent = pesan;
  notif.style.display = 'block';

  // Sembunyikan notifikasi setelah 3 detik
  setTimeout(function() {
    notif.style.display = 'none';
  }, 3000);
}

function scrollKeProduk() {
  const produkSection = document.getElementById('produk');
  if (!produkSection) return;

  produkSection.scrollIntoView({ behavior: 'smooth' });
}


// ============================================================
// 4. TOGGLE TENTANG KAMI
// ============================================================
function toggleAlasan() {
  const konten = document.getElementById('infoAlasan');
  const tombol = document.getElementById('btnAlasan');

  if (!konten || !tombol) return;

  if (konten.style.display === 'block') {
    konten.style.display = 'none';
    tombol.textContent = '✨ Tampilkan Alasan';
  } else {
    konten.style.display = 'block';
    tombol.textContent = '🌰 Sembunyikan';
  }
}


// ============================================================
// 5. FORM VALIDATION & DIRECT WHATSAPP INTEGRATION
// ============================================================
function kirimPesan(event) {
  event.preventDefault();

  let valid = true;

  const namaEl    = document.getElementById('nama');
  const waEl      = document.getElementById('whatsapp');
  const jenisEl   = document.getElementById('jenis');
  const pesanEl   = document.getElementById('pesan');

  document.querySelectorAll('.error-msg').forEach(function(el) {
    el.style.display = 'none';
  });

  const nama  = namaEl ? namaEl.value.trim() : '';
  const wa    = waEl ? waEl.value.trim() : '';
  const jenis = jenisEl ? jenisEl.value : '';
  const pesan = pesanEl ? pesanEl.value.trim() : '';

  // Reset highlight border
  [namaEl, waEl, jenisEl, pesanEl].forEach(function(el) {
    if (el) el.style.borderColor = '';
  });

  if (!nama) {
    const err = document.getElementById('errNama');
    if (err) err.style.display = 'block';
    if (namaEl) namaEl.style.borderColor = '#b82d41';
    valid = false;
  }

  // Validasi nomor WhatsApp (minimal 6 digit angka untuk fleksibilitas tes & nomor riil)
  const waAngka = wa.replace(/[^0-9]/g, '');
  if (!wa || waAngka.length < 6) {
    const err = document.getElementById('errWhatsapp');
    if (err) {
      err.textContent = '⚠ Masukkan nomor WhatsApp yang valid (minimal 6 digit angka).';
      err.style.display = 'block';
    }
    if (waEl) waEl.style.borderColor = '#b82d41';
    valid = false;
  }

  if (!jenis) {
    const err = document.getElementById('errJenis');
    if (err) err.style.display = 'block';
    if (jenisEl) jenisEl.style.borderColor = '#b82d41';
    valid = false;
  }

  if (!pesan) {
    const err = document.getElementById('errPesan');
    if (err) err.style.display = 'block';
    if (pesanEl) pesanEl.style.borderColor = '#b82d41';
    valid = false;
  }

  if (valid) {
    // Susun template pesan WhatsApp konsultasi pemesanan kue
    const pesanWA =
      `*PESAN BARU DARI FORMULIR WEB - DAPUR MANIS* 🍰\n` +
      `----------------------------------------\n` +
      `👤 *Nama Lengkap:* ${nama}\n` +
      `📱 *No. WhatsApp:* ${wa}\n` +
      `🎂 *Kategori Kue / Minat:* ${jenis}\n` +
      `----------------------------------------\n` +
      `📝 *Pesan / Detail Kebutuhan:*\n` +
      `"${pesan}"\n` +
      `----------------------------------------\n\n` +
      `Halo Admin Dapur Manis, saya ingin konsultasi atau pesan kue seperti rincian di atas ya kak. Mohon informasinya. Terima kasih! ✨`;

    const noAdminWA = "6285816098398";
    const urlWA = 'https://wa.me/' + noAdminWA + '?text=' + encodeURIComponent(pesanWA);

    const sukses = document.getElementById('sukses');
    if (sukses) {
      sukses.innerHTML = `
        <div style="font-size:14px; margin-bottom:8px;">✅ <strong>Pesan disiapkan!</strong> Sedang mengalihkan ke WhatsApp...</div>
        <a href="${urlWA}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:8px 18px; background:#1b5e20; color:#ffffff; border-radius:12px; text-decoration:none; font-weight:700; font-size:13px; box-shadow:0 3px 8px rgba(0,0,0,0.2);">
          👉 Klik di Sini jika WhatsApp Tidak Terbuka Otomatis
        </a>
      `;
      sukses.style.display = 'block';
    }

    // Buka WhatsApp di tab baru secara otomatis (didukung fallback virtual link)
    const newTab = window.open(urlWA, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      const linkWA = document.createElement('a');
      linkWA.href = urlWA;
      linkWA.target = '_blank';
      linkWA.rel = 'noopener noreferrer';
      document.body.appendChild(linkWA);
      linkWA.click();
      document.body.removeChild(linkWA);
    }

    if (typeof tampilkanNotifikasi === 'function') {
      tampilkanNotifikasi('💬 Membuka WhatsApp Admin Dapur Manis...');
    }

    // Reset formulir setelah diarahkan
    const form = document.getElementById('formKontak');
    if (form) form.reset();

    setTimeout(function() {
      if (sukses) sukses.style.display = 'none';
    }, 15000);
  }
}


// ============================================================
// INISIALISASI SAAT HALAMAN SELESAI DIMUAT
// ============================================================
window.addEventListener('DOMContentLoaded', function() {
  tampilkanPromo();
  tampilkanProduk('semua');
  muatKeranjangDariStorage();
});
