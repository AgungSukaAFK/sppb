Berikut adalah template README yang menarik untuk sistem pengajuan pembelian barang:

---

# 🛒 Sistem Pengajuan Pembelian Barang

Selamat datang di **Sistem Pengajuan Pembelian Barang**! Aplikasi ini dirancang untuk mempermudah proses permintaan, persetujuan, dan pengelolaan pembelian barang di perusahaan. Dengan alur persetujuan yang terstruktur, pengguna dapat mengajukan permintaan barang dan mendapatkan persetujuan dari supervisor atau manajer secara cepat dan transparan.

## 🌟 Fitur Utama

1. **Permintaan Pembelian Barang**  
   Pengguna dapat dengan mudah membuat dan mengirimkan permintaan pembelian barang ke supervisor.

2. **Alur Persetujuan yang Fleksibel**  
   Permintaan dapat disetujui langsung oleh supervisor atau diteruskan ke manajer untuk persetujuan lebih lanjut.

3. **Histori Pembelian**  
   Lacak semua permintaan yang pernah diajukan dengan tampilan histori yang lengkap dan rapi.

4. **Dashboard Persetujuan**  
   Supervisor dan manajer memiliki akses ke dashboard yang memudahkan mereka melihat dan memproses permintaan pembelian.

## 🚀 Cara Memulai

Berikut langkah-langkah untuk memulai proyek ini di lingkungan lokal Anda:

### 1. Clone Repository

```bash
git clone https://github.com/agungsukaafk/sppb.git
cd sistem-pengajuan-pembelian
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

- Pastikan Anda memiliki **MySQL** terpasang.
- Buat database dengan nama `purchase_system`.
- Update konfigurasi database di file `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=purchase_system
```

### 4. Migrasi Database

```bash
npx prisma migrate dev
```

### 5. Menjalankan Aplikasi

```bash
npm run dev
```

Buka browser dan akses aplikasi di `http://localhost:3000`.

## 📊 Alur Proses Pengajuan

1. **Pengguna Biasa**:

   - Membuat permintaan pembelian barang.
   - Menunggu persetujuan supervisor.

2. **Supervisor**:

   - Memproses permintaan.
   - Dapat langsung menyetujui, menolak, atau meminta persetujuan manajer.

3. **Manajer**:
   - Meninjau permintaan yang memerlukan persetujuan akhir.
   - Menyetujui atau menolak permintaan berdasarkan kebijakan.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React dengan Next.js
- **Backend**: Express.js
- **Database**: MySQL
- **Autentikasi**: JWT (JSON Web Token)

## 📚 Dokumentasi API

Kami juga menyediakan dokumentasi API untuk membantu pengembang lain dalam mengintegrasikan sistem ini. Dokumentasi API dapat diakses melalui endpoint `/api/docs` (WIP).

## 🤝 Kontribusi

Kami sangat terbuka terhadap kontribusi! Jika Anda ingin berkontribusi:

1. Fork repository ini.
2. Buat branch fitur baru (`git checkout -b feature-fitur-baru`).
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`).
4. Push ke branch (`git push origin feature-fitur-baru`).
5. Buat Pull Request.

## 📬 Kontak

Jika Anda memiliki pertanyaan atau saran, jangan ragu untuk menghubungi kami di [email@example.com](mailto:email@example.com).

---

⭐ Jangan lupa untuk memberi bintang di repository ini jika Anda merasa aplikasi ini bermanfaat!

---

README ini dibuat agar jelas dan menarik, memberikan gambaran yang lengkap tentang sistem pengajuan pembelian barang, dari fitur, cara instalasi, hingga kontribusi.
