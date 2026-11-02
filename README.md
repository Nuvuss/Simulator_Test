# 📱 Booking Manager Exam Simulator (RevoU Case Study)

Aplikasi simulasi tes interaktif berbasis web untuk seleksi calon **Booking Manager (Admission Executive)**. Kandidat menjalani 3 sesi chat berwaktu (15 menit per sesi) dengan lead terskrip menggunakan antarmuka mirip WhatsApp. Seluruh transkrip percakapan akan otomatis disimpan ke Google Sheets setelah selesai.

---

## 🚀 Fitur Utama

- **WhatsApp-Style UI**: Tampilan gelembung chat (hijau/putih), status online, timestamp, animasi indikator mengetik (typing indicator), serta sticky input bar responsif untuk desktop dan mobile (hingga lebar layar 360px).
- **3 Skenario Lead Realistis**:
  1. **Rina (24)**: Career switcher (Gym Admin) – *Digital Marketing* (pertanyaan seputar jadwal shift, portofolio, biaya, belajar via YouTube).
  2. **Dimas (22)**: Fresh graduate (HI) – *Data Analytics* (pertanyaan tools Excel/SQL, durasi, penyaluran kerja, izin ortu, sertifikasi Google).
  3. **Shania (32)**: Upskiller / Marketing Manager – *Data-Driven Decision Making with ITB* (pertanyaan sertifikat ITB vs RevoU, online vs Bandung, materi teknis vs manajerial, kesibukan meeting, reimburse kantor).
- **Acak Pertanyaan**: Urutan pertanyaan dan objeksi diacak secara dinamis untuk setiap kandidat menggunakan algoritma Fisher-Yates (pertanyaan program selalu muncul sebelum objeksi agar alur natural).
- **Server/Client Timer**: Countdown 15 menit per sesi dengan penanda visual warna (kuning < 5 menit, merah berkedip < 1 menit), auto-close saat timeout, dan tahan refresh melalui `localStorage`.
- **Integrasi Google Sheets API**: Transkrip lengkap (nama kandidat, email, nama lead, nomor sesi, sender, pesan, timestamp WIB, waktu respon per pesan) otomatis dikirim ke Google Sheet saat ujian selesai.

---

## 🛠️ Menjalankan Aplikasi Secara Lokal

### 1. Masuk ke direktori dan jalankan development server:

```bash
cd "simulator-bm"
npm run dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 📊 Konfigurasi Google Sheets

Buat file `.env.local` di dalam folder `simulator-bm` dengan menyalin format dari `.env.example`:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=nama-service-account@nama-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
GOOGLE_SHEET_NAME=Sheet1
```

### Panduan Setup Google Cloud & Google Sheets:

1. **Buat Project di Google Cloud Console**:
   - Buka [Google Cloud Console](https://console.cloud.google.com/).
   - Buat project baru, misalnya `Simulator-BM`.
2. **Aktifkan Google Sheets API**:
   - Masuk ke menu **APIs & Services** > **Library**.
   - Cari **Google Sheets API**, lalu klik **Enable**.
3. **Buat Service Account**:
   - Buka **APIs & Services** > **Credentials**.
   - Klik **Create Credentials** > **Service account**.
   - Berikan nama (misal: `sheets-writer`), lalu klik **Done**.
4. **Buat & Unduh Kunci JSON**:
   - Klik service account yang baru dibuat, masuk ke tab **Keys**.
   - Klik **Add Key** > **Create new key** > pilih format **JSON**.
   - Unduh file JSON tersebut.
   - Salin nilai `client_email` ke variabel `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
   - Salin nilai `private_key` ke variabel `GOOGLE_PRIVATE_KEY`.
5. **Siapkan Google Sheet**:
   - Buat Google Spreadsheet baru di [Google Sheets](https://sheets.new).
   - Di baris pertama (Row 1), buat header kolom:
     | Candidate Name | Email | Lead Name | Section # | Sender | Message | Timestamp | Response Time (s) |
   - Ambil Spreadsheet ID dari URL:
     `https://docs.google.com/spreadsheets/d/`**`<GOOGLE_SHEET_ID>`**`/edit`
   - Klik tombol **Bagikan / Share** di kanan atas Google Sheet, lalu tambahkan email `client_email` dari Service Account dengan hak akses **Editor**.

---

## ☁️ Panduan Deploy ke Vercel

1. **Deploy via Vercel CLI**:
   ```bash
   npx vercel
   ```
2. **Atau via GitHub Integration**:
   - Push repository ini ke akun GitHub Anda.
   - Buka [vercel.com](https://vercel.com) dan buat New Project dengan mengimpor repository ini.
   - Pada bagian **Environment Variables**, tambahkan:
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `GOOGLE_PRIVATE_KEY`
     - `GOOGLE_SHEET_ID`
     - `GOOGLE_SHEET_NAME`
   - Klik **Deploy**.
