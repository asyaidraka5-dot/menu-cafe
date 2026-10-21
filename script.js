/* ========================================== */
/* 1. DATA MENU (PENGGANTI DATABASE)          */
/* ========================================== */
/* Seluruh daftar produk kafe disimpan di sini dalam bentuk array of objects. */
/* Anda dapat menambah, menghapus, atau mengubah menu langsung di dalam daftar ini. */
const menuData = [
    { 
        id: 1, 
        nama: "Kopi Susu Aren", 
        kategori: "minuman", 
        harga: 18000, 
        desc: "Kopi espresso dengan susu segar dan gula aren asli.", 
        gambar: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300" 
    },
    { 
        id: 2, 
        nama: "Americano", 
        kategori: "minuman", 
        harga: 15000, 
        desc: "Espresso murni disajikan panas atau dingin.", 
        gambar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300" 
    },
    { 
        id: 3, 
        nama: "Nasi Goreng Spesial", 
        kategori: "makanan", 
        harga: 25000, 
        desc: "Nasi goreng dengan telor, ayam suwir, dan kerupuk.", 
        gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300" 
    },
    { 
        id: 4, 
        nama: "Chicken Katsu Don", 
        kategori: "makanan", 
        harga: 28000, 
        desc: "Ayam katsu renyah dengan saus khas di atas nasi.", 
        gambar: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300" 
    },
    { 
        id: 5, 
        nama: "Kentang Goreng", 
        kategori: "camilan", 
        harga: 12000, 
        desc: "Kentang renyah disajikan dengan saus sambal.", 
        gambar: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300" 
    },
    { 
        id: 6, 
        nama: "Roti Bakar Cokelat", 
        kategori: "camilan", 
        harga: 15000, 
        desc: "Roti bakar lembut dengan isian cokelat lumer.", 
        gambar: "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bff?w=300" 
    }
];

/* ========================================== */
/* 2. VARIABEL PENYIMPANAN KERANJANG          */
/* ========================================== */
/* Array kosong ini digunakan untuk menampung produk yang dipilih oleh pelanggan. */
let keranjang = [];


/* ========================================== */
/* 3. FUNGSI MENAMPILKAN MENU KE LAYAR        */
/* ========================================== */
function tampilkanMenu(dataYangDitampilkan) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = ''; // Kosongkan area grid terlebih dahulu

    // Melakukan perulangan (looping) pada setiap data menu
    dataYangDitampilkan.forEach(item => {
        // Membuat elemen kartu produk secara dinamis
        const card = document.createElement('div');
        card.className = 'menu-card';
        
        card.innerHTML = `
            <img src="${item.gambar}" alt="${item.nama}">
            <div class="menu-info">
                <h3>${item.nama}</h3>
                <p>${item.desc}</p>
            </div>
            <div class="menu-bottom">
                <span class="harga">Rp ${item.harga.toLocaleString('id-ID')}</span>
                <button class="btn-tambah" onclick="tambahKeKeranjang(${item.id})">+ Tambah</button>
            </div>
        `;
        
        menuGrid.appendChild(card);
    });
}


/* ========================================== */
/* 4. FUNGSI FILTER BERDASARKAN KATEGORI      */
/* ========================================== */
function filterKategori(kategoriPilihan) {
    // Mengubah status tombol aktif pada navigasi kategori
    const tombolKategori = document.querySelectorAll('.btn-kategori');
    tombolKategori.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Menampilkan menu sesuai pilihan kategori
    if (kategoriPilihan === 'semua') {
        tampilkanMenu(menuData);
    } else {
        const hasilFilter = menuData.filter(item => item.kategori === kategoriPilihan);
        tampilkanMenu(hasilFilter);
    }
}


/* ========================================== */
/* 5. FUNGSI MENAMBAH PRODUK KE KERANJANG     */
/* ========================================== */
function tambahKeKeranjang(idProduk) {
    // Cari data produk berdasarkan ID-nya
    const produk = menuData.find(item => item.id === idProduk);
    
    // Cek apakah produk tersebut sudah ada di dalam keranjang
    const itemDiKeranjang = keranjang.find(item => item.id === idProduk);

    if (itemDiKeranjang) {
        // Jika sudah ada, tambahkan jumlahnya (+1)
        itemDiKeranjang.jumlah += 1;
    } else {
        // Jika belum ada, masukkan produk baru ke keranjang dengan jumlah awal 1
        keranjang.push({ ...produk, jumlah: 1 });
    }

    // Perbarui tampilan keranjang di layar
    updateKeranjangView();
}


/* ========================================== */
/* 6. FUNGSI MENGUBAH JUMLAH ITEM (+ / -)     */
/* ========================================== */
function ubahJumlah(idProduk, nilaiPerubahan) {
    const item = keranjang.find(item => item.id === idProduk);
    
    if (item) {
        item.jumlah += nilaiPerubahan;
        
        // Jika jumlahnya 0 atau kurang, hapus item tersebut dari keranjang
        if (item.jumlah <= 0) {
            keranjang = keranjang.filter(item => item.id !== idProduk);
        }
    }
    
    updateKeranjangView();
}


/* ========================================== */
/* 7. FUNGSI MEMPERBARUI TAMPILAN KERANJANG   */
/* ========================================== */
function updateKeranjangView() {
    const containerCartItems = document.getElementById('cartItems');
    const totalHargaElem = document.getElementById('totalHarga');

    // Jika keranjang kosong, tampilkan teks pemberitahuan
    if (keranjang.length === 0) {
        containerCartItems.innerHTML = '<p class="empty-cart">Keranjang masih kosong.</p>';
        totalHargaElem.innerText = 'Rp 0';
        return;
    }

    containerCartItems.innerHTML = '';
    let totalBelanja = 0;

    // Render ulang daftar item yang ada di keranjang
    keranjang.forEach(item => {
        const subtotal = item.harga * item.jumlah;
        totalBelanja += subtotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        
        cartItemDiv.innerHTML = `
            <div class="cart-item-detail">
                <strong>${item.nama}</strong><br>
                <small>Rp ${item.harga.toLocaleString('id-ID')} x ${item.jumlah}</small>
            </div>
            <div class="cart-item-controls">
                <button onclick="ubahJumlah(${item.id}, -1)">-</button>
                <span style="margin: 0 8px;">${item.jumlah}</span>
                <button onclick="ubahJumlah(${item.id}, 1)">+</button>
            </div>
        `;
        
        containerCartItems.appendChild(cartItemDiv);
    });

    // Tampilkan total keseluruhan harga
    totalHargaElem.innerText = `Rp ${totalBelanja.toLocaleString('id-ID')}`;
}


/* ========================================== */
/* 8. FUNGSI KIRIM PESANAN VIA WHATSAPP       */
/* ========================================== */
function kirimPesananWA() {
    // Validasi: Cegah pengiriman jika keranjang masih kosong
    if (keranjang.length === 0) {
        alert("Keranjang belanja Anda masih kosong! Silakan pilih menu terlebih dahulu.");
        return;
    }

    // Ubah nomor di bawah ini dengan nomor WhatsApp kasir kafe yang sebenarnya (awali dengan kode negara, misal 62)
    const nomorKasirWA = "6281234567890"; 
    
    let pesanTeks = "Halo Kak, saya ingin memesan menu berikut:\n\n";
    let totalKeseluruhan = 0;

    // Susun rincian pesanan dari keranjang
    keranjang.forEach(item => {
        const subtotal = item.harga * item.jumlah;
        totalKeseluruhan += subtotal;
        pesanTeks += `- ${item.nama} (${item.jumlah}x) = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    pesanTeks += `\n*Total Pembayaran: Rp ${totalKeseluruhan.toLocaleString('id-ID')}*\n\nMohon segera diproses, terima kasih!`;

    // Ubah format teks agar aman dibaca oleh URL browser (mengganti spasi/simbol menjadi format link)
    const urlWhatsApp = `https://wa.me/${nomorKasirWA}?text=${encodeURIComponent(pesanTeks)}`;
    
    // Buka aplikasi/web WhatsApp di tab baru peramban
    window.open(urlWhatsApp, '_blank');
}


/* ========================================== */
/* 9. INISIALISASI SAAT HALAMAN DIMUAT        */
/* ========================================== */
/* Perintah ini memastikan seluruh fungsi tampilkanMenu langsung berjalan saat file HTML selesai dibuka. */
document.addEventListener('DOMContentLoaded', () => {
    tampilkanMenu(menuData);
});
