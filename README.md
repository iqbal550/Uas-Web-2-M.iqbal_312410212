# 📦 E-Inventory System

Sistem manajemen inventaris sederhana berbasis **CodeIgniter 4 (REST API)** untuk backend dan **Vue 3 SPA** (tanpa build tool) untuk frontend. Mendukung manajemen Kategori, Supplier, dan Barang dengan autentikasi token sederhana.

## ✨ Fitur

- 🔐 Login admin dengan token authentication (Bearer Token)
- 📊 Dashboard ringkasan
- 🏷️ Manajemen Kategori (CRUD)
- 🚚 Manajemen Supplier (CRUD)
- 📦 Manajemen Barang (CRUD) dengan relasi ke Kategori & Supplier
- 🌐 REST API siap dikonsumsi oleh frontend manapun (CORS sudah diatur)

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | PHP 8.2+, CodeIgniter 4, MySQL/MariaDB (MySQLi) |
| Frontend | Vue 3 (CDN), Vue Router 4 (CDN), Axios, Tailwind CSS (CDN) |
| Database | MySQL/MariaDB |
| Auth | Custom Bearer Token (disimpan di kolom `token` tabel `users`) |

## 📁 Struktur Folder

```
project-root/
├── backend-api/              # CodeIgniter 4 REST API
│   ├── app/
│   │   ├── Controllers/      # AuthController, BarangController, KategoriController, SupplierController
│   │   ├── Models/           # UserModel, BarangModel, KategoriModel, SupplierModel
│   │   ├── Filters/          # AuthFilter (cek token), CorsFilter
│   │   └── Config/
│   │       ├── Routes.php
│   │       └── Database.php
│   ├── public/
│   │   └── index.php         # Entry point — document root harus mengarah ke sini
│   ├── .env                  # Konfigurasi database
│   └── frontend-spa/         # (opsional) frontend bisa diletakkan di sini
│       ├── index.html
│       └── components/
│           ├── Login.js
│           ├── Dashboard.js
│           ├── Kategori.js
│           ├── Supplier.js
│           ├── Barang.js
│           ├── Home.js
│           └── App.js
└── db_inventory.sql          # Dump struktur + data database
```

> ⚠️ **Penting:** Saat extract dari ZIP, pastikan tidak ada folder bersarang ganda (`backend-api/backend-api/...`). Struktur yang benar: `htdocs/backend-api/public/index.php` langsung, bukan `htdocs/backend-api/backend-api/public/index.php`.

## 🚀 Instalasi & Setup

### 1. Clone repository

```bash
git clone <repo-url> backend-api
cd backend-api
```

### 2. Letakkan di web server lokal (XAMPP/Laragon)

Pindahkan/clone folder ini ke dalam `htdocs` (XAMPP) atau `www` (Laragon), pastikan struktur seperti di atas (tidak nested ganda).

### 3. Setup Database

1. Buat database baru bernama `db_inventory` di phpMyAdmin/MySQL.
2. Import file `db_inventory.sql` ke database tersebut.
3. Jalankan migrasi tambahan berikut (kolom `token` dibutuhkan untuk auth):

```sql
ALTER TABLE `users`
  ADD COLUMN `token` VARCHAR(255) NULL DEFAULT NULL AFTER `password`;
```

### 4. Konfigurasi `.env`

Copy/sesuaikan file `.env` di root `backend-api`:

```env
CI_ENVIRONMENT = development

database.default.hostname = localhost
database.default.database = db_inventory
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
database.default.DBPrefix =
database.default.port = 3306
```

> Sesuaikan `username`/`password` dengan kredensial MySQL lokal kamu.

### 5. Akses Aplikasi

- **Backend API base URL:** `http://localhost/backend-api/public/`

<img width="1897" height="1137" alt="Screenshot 2026-06-22 220852" src="https://github.com/user-attachments/assets/a8229651-952e-43f6-a86a-7c7af9b07e31" />

- **Frontend (jika diletakkan di dalam backend-api):** `http://localhost/backend-api/frontend-spa/#/login`

### 6. Login Default

| Email | Password |
|---|---|
| `admin@inventory.com` | `admin123` |

> Password di atas sudah berupa bcrypt hash di database. Untuk reset password admin, jalankan:
> ```sql
> UPDATE `users`
> SET `password` = '$2y$10$Z0D.8ZeVYdwOuXxze1gXee.j5nCnVTxqJ85YQBvuiSL5A2G2JwkwK'
> WHERE `email` = 'admin@inventory.com';
> ```

## 📡 Dokumentasi API

Base URL: `http://localhost/backend-api/public`
<img width="1841" height="1115" alt="Screenshot 2026-06-22 223326" src="https://github.com/user-attachments/assets/baf69006-d4f4-49ab-b7d5-e96f00f3b6c6" />

### 🔐 Auth

#### POST `/auth/login`
Login dan dapatkan token.

**Request Body:**
```json
{
  "email": "admin@inventory.com",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "status": 200,
  "message": "Login berhasil.",
  "data": {
    "id": 1,
    "nama": "Administrator",
    "email": "admin@inventory.com",
    "token": "f90ca73234cef6d0846473232055d090a..."
  }
}
```
<img width="1920" height="1200" alt="Screenshot (16)" src="https://github.com/user-attachments/assets/40143a22-00e2-4aa8-84d7-6efca8bf30f6" />

**Response 401** (email/password salah):
```json
{ "status": 401, "message": "Email atau password salah." }
```

#### POST `/auth/logout` 🔒
Hapus token (logout). Butuh header `Authorization: Bearer <token>`.

**Response 200:**
```json
{ "status": 200, "message": "Logout berhasil." }
```

---

### 🔒 Endpoint Terlindungi

Semua endpoint di bawah ini **wajib** menyertakan header:
```
Authorization: Bearer <token>
```

Jika tidak ada/salah, akan mendapat response:
```json
{ "status": 401, "message": "Token tidak ditemukan. Akses ditolak." }
```
atau
```json
{ "status": 401, "message": "Token tidak valid." }
```

#### Kategori

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/kategori` | List semua kategori |
| GET | `/kategori/{id}` | Detail kategori |
| POST | `/kategori` | Tambah kategori |
| PUT | `/kategori/{id}` | Update kategori |
| DELETE | `/kategori/{id}` | Hapus kategori |

**Body POST/PUT:**
```json
{ "nama_kategori": "Elektronik", "deskripsi": "Perangkat elektronik" }
```

#### Supplier

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/supplier` | List semua supplier |
| GET | `/supplier/{id}` | Detail supplier |
| POST | `/supplier` | Tambah supplier |
| PUT | `/supplier/{id}` | Update supplier |
| DELETE | `/supplier/{id}` | Hapus supplier |

**Body POST/PUT:**
```json
{ "nama_supplier": "PT Sumber Jaya", "alamat": "Jakarta", "telepon": "021-1234567" }
```

#### Barang

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/barang` | List semua barang (join kategori & supplier) |
| GET | `/barang/{id}` | Detail barang |
| POST | `/barang` | Tambah barang |
| PUT | `/barang/{id}` | Update barang |
| DELETE | `/barang/{id}` | Hapus barang |

**Body POST/PUT:**
```json
{
  "kode_barang": "BRG-011",
  "nama_barang": "Monitor LED 24 inch",
  "stok": 10,
  "harga": 1500000,
  "id_kategori": 1,
  "id_supplier": 1
}
```

## 🧪 Testing dengan Postman

1. **Login** → `POST /auth/login` dengan body email & password → copy `token` dari response.
2. **Akses endpoint terlindungi tanpa token** → harus dapat `401`.
3. **Akses dengan token** → tambahkan header `Authorization: Bearer <token>` → harus dapat `200`.

| Skenario | Header Authorization | Status |
|---|---|---|
| Tanpa header | *(kosong)* | 401 |
| Format salah | `salahformat` | 401 |
| Token salah | `Bearer token-ngasal` | 401 |
| Token valid | `Bearer <token-asli>` | 200 |

## 🗄️ Struktur Database

```
users     (id, nama, email, password, token, created_at)
kategori  (id, nama_kategori, deskripsi, created_at)
supplier  (id, nama_supplier, alamat, telepon, created_at)
barang    (id, kode_barang, nama_barang, stok, harga, id_kategori*, id_supplier*, created_at)
```
`*` = foreign key dengan `ON DELETE SET NULL`

## 🐛 Troubleshooting

| Masalah | Kemungkinan Penyebab |
|---|---|
| Login selalu gagal padahal email/password benar | Kolom `token` belum ada di tabel `users` — jalankan migrasi `ALTER TABLE` di atas |
| Error 404 saat hit endpoint | Cek folder tidak nested ganda (`backend-api/backend-api/...`) |
| `Unknown column 'b.id_kategori'` | Tabel `barang` belum punya kolom `id_kategori`/`id_supplier` — re-import `db_inventory.sql` |
| CORS error di browser | Pastikan filter `cors` aktif global di `app/Config/Filters.php` |
| Error detail tidak muncul, cuma generik | Set `CI_ENVIRONMENT = development` di `.env` untuk lihat error detail (jangan dipakai di production) |

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik/pembelajaran.
