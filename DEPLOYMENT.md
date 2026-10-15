# Panduan Deployment & Produksi — Narativa Studio (Task 3.4)

Dokumen ini menjelaskan prosedur deployment produksi untuk **Narativa** ke Vercel, konfigurasi database Neon PostgreSQL, integrasi CDN Bunny Stream, dan webhook Clerk authentication.

---

## 1. Konfigurasi Environment Variables (`.env.production`)

Pastikan seluruh variabel berikut telah diisi di panel **Vercel Project Settings > Environment Variables**:

| Variabel | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- |
| `APP_URL` | URL domain produksi | `https://narativa.id` |
| `NEXT_PUBLIC_APP_URL` | Domain publik aplikasi | `https://narativa.id` |
| `NODE_ENV` | Mode lingkungan | `production` |
| `DATABASE_URL` | Pooled Connection String Neon PostgreSQL | `postgresql://user:pass@ep-sample-pooler.ap-southeast-1.aws.neon.tech/narativa_production?sslmode=require` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable Key Clerk (Instance Live) | `pk_live_...` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable Key untuk Vite client | `pk_live_...` |
| `CLERK_SECRET_KEY` | Secret Key server-side Clerk | `sk_live_...` |
| `CLERK_WEBHOOK_SECRET` | Signing secret webhook dari Svix | `whsec_...` |
| `BUNNY_STREAM_CDN_HOSTNAME` | Hostname CDN Pull Zone video 9:16 | `vz-broll.narativa-stream.b-cdn.net` |
| `BUNNY_STREAM_TOKEN_AUTH_KEY` | Secret token SHA-256 Bunny Stream | `narativa_bunny_secret_token_key_2026` |
| `BUNNY_STREAM_LIBRARY_ID` | ID Library Video di Bunny Stream | `348912` |
| `BUNNY_SIGNED_URL_TTL_SEC` | Masa berlaku signed URL (detik) | `3600` |
| `SCRIPT_DAILY_LIMIT_PER_USER` | Kuota batas harian pembuatan skrip | `20` |

---

## 2. Migrasi Database Neon PostgreSQL Produksi

Jalankan perintah berikut sebelum meluncurkan aplikasi ke pengguna:

```bash
# 1. Verifikasi koneksi dan kesiapan environment
npm run db:migrate:prod

# 2. Sinkronisasi skema tabel Drizzle ke Neon Database
npm run db:push

# 3. (Opsional) Seeding 150 Ide, 700 Hook, 170 CTA, 8 Formula & 100 B-roll
npm run db:seed
```

---

## 3. Pendaftaran Webhook Clerk ke Domain Produksi

Sinkronisasi akun pengguna Narativa dikelola secara otomatis via event webhook Clerk:

1. Buka [Clerk Dashboard](https://dashboard.clerk.com/) dan pilih aplikasi produksi Anda.
2. Navigasi ke menu **Configure > Webhooks**.
3. Klik tombol **Add Endpoint**.
4. Isi **Endpoint URL** dengan URL produksi:
   ```
   https://<domain-anda>/api/webhooks/clerk
   ```
   *(Contoh: `https://narativa.id/api/webhooks/clerk`)*
5. Pada bagian **Message Filtering**, centang event berikut:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Simpan endpoint, lalu salin **Signing Secret** (berawalan `whsec_...`).
7. Masukkan nilai tersebut ke variabel `CLERK_WEBHOOK_SECRET` di Vercel.

---

## 4. Langkah Deployment ke Vercel

### Opsi A: Deployment via Vercel Dashboard (Rekomendasi)
1. Push kode ke repository GitHub/GitLab.
2. Buka [Vercel Dashboard](https://vercel.com/new).
3. Import repository Narativa.
4. Pada **Build and Output Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Masukkan seluruh Environment Variables dari `.env.production`.
6. Klik **Deploy**.

### Opsi B: Deployment via Vercel CLI
```bash
# Install Vercel CLI jika belum terpasang
npm i -g vercel

# Login ke akun Vercel
vercel login

# Deploy ke production
vercel --prod
```

File `vercel.json` telah dikonfigurasi secara otomatis dengan:
- SPA Rewrites ke `index.html`
- Header keamanan: Content-Security-Policy (CSP), X-Frame-Options (DENY), X-Content-Type-Options (nosniff), HSTS, dan Referrer-Policy
- Caching statis untuk `robots.txt` dan `sitemap.xml`

---

## 5. Checklist Verifikasi Pasca-Deployment

- [x] **Halaman Publik (`/`)**: Navigasi beranda, preview formula, dan 3 gaya jualan termuat tanpa kendala.
- [x] **Pendaftaran Akun (`/daftar`)**: Form pendaftaran tervalidasi dan redirect ke `/dashboard`.
- [x] **Login Kreator (`/masuk`)**: Login username & password terverifikasi, serta fitur 1-klik Quick Demo aktif.
- [x] **Perpustakaan (`/library/*`)**: Data ide, hook, cta, formula, dan video B-roll 9:16 dapat difilter dan diputar.
- [x] **Wizard 5-Langkah (`/skrip/baru`)**: Perakitan skrip modular menghasilkan estimasi durasi 2.5 kata/detik.
- [x] **Editor & Teleprompter (`/skrip/[id]`)**: Pengeditan tersimpan, ekspor `.txt` dan `.md`, serta mode teleprompter responsif di mobile, tablet, dan desktop.
- [x] **Keamanan**: Uji IDOR, sanitasi XSS, batas kuota 20 skrip/hari, dan penghapusan akun berfungsi sesuai PRD.
