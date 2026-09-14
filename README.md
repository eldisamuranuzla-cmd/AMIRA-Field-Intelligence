# AMIRA — Afdeling Material & Rawat Intelligence

POC aplikasi frontend untuk menggabungkan:

1. **Master Rawat** sebagai pondasi JOBCODE, job description, UOM, material dan rule.
2. **3 CSV Amanda Rawat** sebagai transaction engine aktual.
3. Classification JOBCODE menjadi CPT / WDC / WDM / CWC.
4. Dashboard field execution, HK, transaksi, blok, material, evidence dan GPS.

## Cara pakai

1. Buka `index.html` di browser atau deploy ke GitHub Pages.
2. Klik **Upload Amanda CSV**.
3. Pilih **Master Rawat** terlebih dahulu.
4. Pilih 3 CSV Amanda Rawat sekaligus.
5. Dashboard akan membaca file di browser dan menghitung data secara lokal.

> Data CSV tidak perlu disimpan di repository. Untuk data operasional riil, gunakan upload lokal/browser.

## Catatan POC

Parser dibuat toleran terhadap baris CSV Amanda yang mempunyai jumlah kolom tidak konsisten. Mapping job menggunakan `JOBCODE` dari `M_JOB` pada Master Rawat.

Architecture reference: Adriana V24 — AMIRA tetap berdiri sebagai repository terpisah.
