# Checklist Pra-Publikasi Resmi Website BBN

## Legal dan konten
- [ ] Nama resmi yayasan disetujui
- [ ] Tanggal legal, akta, dan klaim hukum diverifikasi
- [ ] Logo resmi, font, dan palet warna disetujui
- [ ] Foto kegiatan mendapat izin publikasi; khusus foto anak diperiksa
- [ ] Nomor/email/alamat organisasi diverifikasi
- [ ] Referensi program dan berita dikurasi pengurus
- [ ] Kebijakan privasi, penanggung jawab data, dan retensi disetujui
- [ ] Logo/atribusi kemitraan digunakan dengan izin

## Teknologi
- [ ] `npm install` dan `npm run build` lulus
- [ ] `npm run check` lulus
- [ ] `npm --prefix studio run build` lulus
- [ ] Secret dan API key tidak ada di repository
- [ ] Domain resmi dan SSL/HTTPS aktif
- [ ] PUBLIC_SITE_URL sesuai domain final
- [ ] Konfigurasi publikasi Sanity ke Cloudflare (Deploy Hook) teruji
- [ ] Form Turnstile dan pengiriman Resend diuji end-to-end
- [ ] Cloudflare WAF/rate limiting dikonfigurasi
- [ ] Menu, tombol, dan tautan berjalan di desktop/mobile
- [ ] Alt text, judul halaman, metadata, sitemap, robots benar
- [ ] Pengurus mendapatkan akses akun CMS yang tepat
- [ ] Backup/recovery repository dan akses domain tersedia
