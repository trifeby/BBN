# Website Yayasan Bakul Budaya Nusantara (BBN)

**Status:** source code prototype siap dikonfigurasi. **Belum dipublikasikan**, belum terhubung ke akun Sanity/Cloudflare milik yayasan, dan build npm belum teruji di lingkungan pembuatannya karena jaringan registry npm tidak tersedia. `preview.html` adalah pratinjau mandiri yang dapat dibuka tanpa instalasi.

Konsep: **Budaya Menyatukan Kita** / *Dari Sebakul, Terhubung Se-Nusantara*.

## Yang sudah ada

- Beranda editorial yang responsif, header dan footer, empat pilar, program, ajakan kolaborasi.
- Halaman `/tentang/`, `/program/`, `/cerita/`, detail artikel (`/cerita/[slug]/`), `/jejak-karya/`, `/kolaborasi/`, `/privasi/`, dan 404.
- Sanity Studio **terpisah** di folder `studio/`, dengan jenis konten: Identitas & Kontak, Program, Berita, Agenda, dan Galeri.
- Pembacaan konten Sanity saat build. Jika belum terhubung, program awal berisi nama/penjelasan dari materi internal, sedangkan berita, galeri dan agenda tetap kosong (tidak ada kegiatan fiktif).
- Endpoint `functions/api/contact.ts` untuk formulir Cloudflare Pages menggunakan **Turnstile server-side** dan **Resend server-side** bila semua kredensial disiapkan.
- Metadata SEO, canonical URL, sitemap dinamis, alternatif teks gambar, skip link, navigasi seluler, dan dukungan reduced-motion.

> Penting: foto kegiatan asli, email, nomor kontak, data legal, anggota, angka capaian, dan mitra **belum diisikan**, menunggu verifikasi. Ornamen bakul pada hero adalah ilustrasi konseptual, bukan logo resmi yayasan.

## Struktur folder

```text
bbn-website/
├─ src/
│  ├─ components/       Header, Footer, card, ilustrasi pengganti foto
│  ├─ layouts/          Layout halaman dan metadata
│  ├─ lib/content.ts    Skema tipe, query Sanity, fallback terkontrol
│  ├─ pages/            Beranda dan semua halaman publik
│  └─ styles/           Identitas visual global + Tailwind CSS 4
├─ studio/              Dashboard Sanity Studio (aplikasi terpisah)
│  ├─ sanity.config.ts
│  └─ schemas/          Dokumen yang bisa diedit pengurus
├─ functions/api/       Endpoint pengajuan kolaborasi (Cloudflare Pages)
├─ docs/                Langkah untuk admin dan deployment
├─ preview.html         Preview statis, offline, beranda + section inti
└─ .env.example         Daftar variabel konfigurasi
```

## 1. Instalasi lokal

Syarat: Node.js 22+, npm, dan koneksi internet untuk unduh paket **pada saat instalasi**.

```bash
# Dalam folder bbn-website
npm install
cp .env.example .env
npm run dev
```

Buka `http://localhost:4321`. Website dapat dibuka dengan konten dasar walau Sanity belum terhubung. **Jangan gunakan `preview.html` sebagai deploy final**; itu hanya referensi visual.

### Isi `.env`

```dotenv
PUBLIC_SITE_URL=https://DOMAIN-RESMI-YANG-DISETUJUI
PUBLIC_SANITY_PROJECT_ID=isi-id-proyek-sanity
PUBLIC_SANITY_DATASET=production
PUBLIC_TURNSTILE_SITE_KEY=isi-site-key-turnstile
```

`PUBLIC_` dapat terlihat oleh browser: **jangan pernah** mengisi API secret/token privat ke variabel ini.

## 2. Menyiapkan Sanity CMS

1. Buat akun di https://www.sanity.io/manage dan buat proyek BBN.
2. Buat dataset `production` (untuk versi awal, public-read agar website statis dapat membaca konten tanpa token privat).
3. Masuk folder studio:

```bash
cd studio
npm install
cp .env.example .env
# isi SANITY_STUDIO_PROJECT_ID dan SANITY_STUDIO_DATASET
npm run dev
```

4. Buka alamat Sanity Studio yang muncul di terminal. Login menggunakan akun yang diberi akses pada proyek BBN.
5. Setelah dites, deploy dashboard via `npm run deploy`, pilih hostname yang tersedia di `*.sanity.studio`.
6. Di root website, isi `PUBLIC_SANITY_PROJECT_ID` dan `PUBLIC_SANITY_DATASET` **sama** dengan pengaturan Studio.
7. Isi Identitas & Kontak Resmi, publikasi berita, agenda, program, dan unggah galeri sesuai izin. Untuk memastikan frontend terbarui, jalankan build kembali atau pasang webhook di langkah 4.

**Catatan role**: pada paket Sanity Free, pengaturan wewenang editor sangat terbatas. Bila perlu persetujuan rilis terpisah, validasi biaya/role Sanity terlebih dahulu. Jangan memberi akses admin kepada banyak pengguna tanpa prosedur publikasi.

## 3. Validasi lokal

```bash
# Kembali ke root
npm run build
npm run check
npm run preview
```

Tes menu desktop/seluler, tautan program, isi artikel, foto, alur form, dan halaman 404. Jalankan `npm --prefix studio run build` untuk mengetes Studio setelah `.env` siap.

## 4. GitHub + Cloudflare Pages

1. Buat repository GitHub privat/organisasi. Tambahkan isi folder proyek ini lalu commit, tanpa `.env`, `.dev.vars`, password atau API key.
2. Di Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git.
3. Pilih repository dan branch utama.
4. **Root directory**: `/` (root project), **Build command**: `npm run build`, **Build output directory**: `dist`.
5. Tambahkan environment variables `PUBLIC_SITE_URL`, `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_TURNSTILE_SITE_KEY` (untuk *build*). Domain dapat dipasang setelah website preview lolos pemeriksaan.
6. Setelah deploy, hubungkan custom domain milik BBN dan uji HTTPS. Selama domain masih contoh, metadata diset ke noindex agar URL contoh tidak terindeks.
7. Uji Pages Functions lewat `POST /api/contact` hanya setelah secrets pada langkah 5 disiapkan.

**Catatan environment**: PUBLIC_SITE_URL harus domain final `https://...` tanpa path. Ubah domain contoh sebelum launch agar canonical dan sitemap benar. Pada Astro, jika memakai file `.env` lokal untuk `site`, pastikan env terbaca dalam `astro.config.mjs` (konfigurasi contoh juga menerima environment dari proses CI).

## 5. Formulir kolaborasi yang aman

Form tidak akan tampil aktif sampai `PUBLIC_TURNSTILE_SITE_KEY` disediakan. Pada Cloudflare Pages, set variabel **terenkripsi** (Secrets) berikut:

- `TURNSTILE_SECRET_KEY`: secret dari Cloudflare Turnstile (pasangkan domain resmi website).
- `RESEND_API_KEY`: server-side API key dari layanan pengiriman email Resend.
- `CONTACT_FROM`: pengirim yang terverifikasi pada Resend, misalnya `Kolaborasi BBN <noreply@domain-anda>` (contoh format, **bukan alamat BBN**).
- `CONTACT_TO`: alamat email resmi pengurus yang menerima pesan.

Daftarkan domain pengirim pada Resend sesuai instruksi DNS. Form memerlukan persetujuan, validasi input di server, honeypot, Turnstile, lalu mengirim email melalui Resend. **Tidak ada database untuk menyimpan pesan**. Terapkan rate limiting / WAF rule di Cloudflare dan pembatasan akses inbox sebelum publikasi. Kebijakan privasi harus disetujui organisasi (halaman yang tersedia baru naskah awal).

**Uji end-to-end**: pengiriman asli, salah token Turnstile, data kosong, email tidak valid, spam honeypot, dan kegagalan layanan. Endpoint belum diuji langsung pada Cloudflare.

## 6. Publikasi otomatis setelah editor menekan Publish

Karena website Astro statis, perubahan konten Sanity memerlukan *rebuild*. Cloudflare Pages mendukung **Deploy Hooks** untuk ini.

1. Cloudflare → Pages project → Settings → Builds → Add deploy hook; pilih branch produksi.
2. Salin URL hook, dan **jaga sebagai rahasia** karena siapa pun yang mengetahuinya bisa memicu build.
3. Sanity manage → API → Webhooks → Add webhook; gunakan URL Deploy Hook tersebut.
4. Dataset: `production`. Events: create, update, delete untuk dokumen yang **diterbitkan**; filter dokumen draft agar tidak memicu build berlebih (GROQ sesuai pengaturan yang tersedia). Pastikan tidak mengekspos draft pada frontend.
5. Terbitkan sebuah artikel percobaan, pastikan Pages ter-build otomatis, lalu periksa konten di website.

Bila ada banyak perubahan, batasi pemicu atau gunakan cara rebuild manual agar tidak melewati kuota build. Rotasi deploy hook jika URL bocor.

Panduan resmi: https://developers.cloudflare.com/pages/configuration/deploy-hooks/

## 7. Serah terima pengurus

Lihat `docs/PANDUAN-PENGURUS.md` dan `docs/CHECKLIST-PUBLISH.md`. Prioritas data yang belum dimasukkan:

- File logo resmi + kode warna final.
- Dokumen legal/struktur pengurus yang boleh ditampilkan.
- Foto autentik kegiatan dengan izin pemakaian.
- Email resmi, domain, akun pengurus, dan persetujuan privasi.
- Profil yayasan PDF untuk calon mitra.

## Batasan yang dinyatakan terbuka

- Tidak ada akun GitHub, Sanity, Resend, maupun Cloudflare milik BBN yang dihubungkan/dibuat dalam artefak ini.
- Belum ada npm dependency yang diunduh di lingkungan pengembangan ini (registry tidak dapat dijangkau), sehingga tes build/typecheck Astro maupun dashboard Sanity perlu dijalankan pada mesin berinternet.
- Tidak ada klaim bahwa formulir aktif atau website sudah online.
- Preview HTML telah disediakan agar desain dapat diperiksa offline sebelum tersambung ke CMS.
