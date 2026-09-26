# WattWise Operating Simulator Blueprint

**Phase 1 — dokumentasi dan pemodelan pengetahuan**  
Tanggal penyusunan: **26 September 2026**. Bahasa kerja: Indonesia.

**Status dokumen:** baseline pengetahuan internal yang terstruktur dan terlacak, dengan batas sumber yang eksplisit. Ini menjadi rujukan kerja simulator; pengesahan sebagai representasi produk produksi memerlukan konfirmasi snapshot terbaru dan keputusan atas konflik pada bagian 18. Tidak ada hasil simulasi atau klaim keberhasilan komersial di dalamnya.

## 1. Purpose

**Sumber:** S00, khususnya Project Purpose, Primary Output, dan Quality Check.

**CURRENT — mandat proyek:** WattWise Operating Simulator ditujukan sebagai lingkungan pembelajaran internal tentang hubungan produk, pelanggan, keuangan, GTM, risiko, dan keputusan startup. Phase 1 hanya mendokumentasikan pengetahuan yang akan menjadi dasar aturan pada fase berikutnya.

**RECOMMENDATION — cakupan masa depan:** simulator membantu tim memahami perilaku produk, perjalanan pelanggan, asumsi finansial, pertumbuhan, insiden startup, kesiapan scale, dan pertanyaan juri/investor. Tim dapat menelusuri konsekuensi suatu perubahan tanpa menganggap hasil hipotetis sebagai bukti lapangan.

Keluaran Phase 1 adalah blueprint ini dan README pendamping. Tidak dibuat UI simulator, komponen React, executable simulator, aturan matematis baru, perubahan skema database, pricing, entitlement, atau refactor aplikasi. Simulator operasional internal ini juga berbeda dari fitur skenario penghematan energi yang disebut dalam dokumentasi produk lama.

## 2. Source Hierarchy

**Sumber:** S00; inventaris lokal dan pembacaan sumber S01–S17 pada tanggal penyusunan.

### Hierarki dan cara menggunakannya

| Level | Jenis sumber | Cara memperlakukan klaim |
| --- | --- | --- |
| 1 — CURRENT PRODUCT TRUTH | Implementasi, arsitektur, dokumentasi produk, perilaku aktual | Kode membuktikan implementasi dalam snapshot; deployment dan penggunaan nyata tetap memerlukan bukti tersendiri. Spesifikasi tidak otomatis membuktikan fitur telah berjalan. |
| 2 — CURRENT COMPETITION / PITCH NARRATIVE | Deck final PLN ICE, positioning, roadmap, RAB, GTM | Menjelaskan narasi dan rencana. Tidak mengalahkan bukti implementasi untuk klaim fitur. |
| 3 — FINANCIAL SOURCE OF TRUTH | Strategi finansial, monetisasi, pricing hypothesis, WTP, unit economics | Memisahkan asumsi, target, proyeksi, dan hasil aktual; tidak menganggap angka pitch sebagai transaksi. |
| 4 — SIMULATION ASSUMPTIONS | What-if, stress test, variabel hipotetis | Selalu SIMULATION; bukan kondisi bisnis sekarang. |

Hierarki digunakan sesuai domain, bukan untuk menghapus konflik. Untuk harga yang tampil, bukti UI adalah CURRENT; untuk harga yang terbukti diterima pasar, diperlukan bukti pembayaran. Bila dua sumber berbeda, keduanya dicatat di bagian 18 dengan keputusan yang diperlukan.

### Cakupan pemeriksaan

- **CURRENT — kondisi workspace:** `D:/04_LOMBA_DAN_ORGANISASI/Start-up Animation` semula kosong dan bukan repositori Git. Hasil Phase 1 ditulis hanya di `docs/simulator/` pada workspace tersebut.
- **CURRENT — sumber lokal yang ditemukan:** `D:/04_LOMBA_DAN_ORGANISASI/Start up Proto/Startup Proto`, selanjutnya disebut **akar sumber**. Folder ini berisi Next.js, subfolder `wattwise-laravel`, dan dokumentasi produk/rewrite/launch/validation.
- Repositori Git induk `D:/04_LOMBA_DAN_ORGANISASI/Start up Proto` menunjukkan HEAD `f78d2e8`, bertanggal 2026-07-03, tetapi working tree sudah memiliki banyak penghapusan dan folder `Startup Proto/` yang untracked sebelum pekerjaan ini. HEAD tersebut **tidak** dapat dianggap sebagai versi seluruh berkas yang dibaca. Tidak dilakukan reset, checkout, commit, atau perubahan pada sumber.
- Beberapa berkas PRD, launch, dan forecasting memiliki waktu modifikasi lokal yang berdekatan; waktu salin/modifikasi tidak cukup menentukan mana yang paling baru. Petunjuk versi dan kecocokan kode dipakai, dengan konflik tetap terbuka.
- **UNKNOWN / NEEDS VALIDATION:** apakah snapshot tetangga ini sama dengan repository/deployment WattWise terbaru. Tidak dilakukan akses deployment, database, transaksi, atau riset web eksternal.
- Pitch deck final PLN ICE, RAB, GTM final, strategi finansial, dan laporan pilot terisi **belum ditemukan pada cakupan yang diperiksa**. Tidak disimpulkan bahwa dokumen tersebut tidak ada di tempat lain. README sumber menunjuk laporan lama di `D:/LOMBA/Startup Proto/Laporan_Aplikasi_WattWise_AI.md`; lokasi tersebut tidak tersedia saat diperiksa.

### Register sumber

Lokasi S01–S17 relatif terhadap akar sumber di atas. Bagian spesifik atau nama metode dicantumkan agar dapat dicari ulang. Label STALE / HISTORICAL berlaku pada klaim yang telah bertentangan dengan snapshot, bukan otomatis seluruh isi dokumen.

| ID | Sumber / lokasi | Bukti dan batas pemakaian |
| --- | --- | --- |
| S00 | Brief pengguna, `C:/Users/lenovo/.codex/attachments/bcac51e0-9878-45f3-a709-df8f113be6c7/Pasted text.txt` | Mandat Phase 1, thesis, funnel, roadmap, contoh target dan skenario. Bukan laporan hasil pilot atau bukti deployment. |
| S01 | `README.md`, Fitur MVP 2, Tech Stack Terbaru, Disclaimer | Narasi Next.js, routing ML, PDF, input manual, batas hubungan PLN. **STALE / HISTORICAL** untuk klaim sebagai stack terkini; berkonflik dengan S04. |
| S02 | `docs/product/wattwise-ai-prd.md`, bagian 1–8, 14–17 | Positioning, segmen, journey, paket, target, roadmap. **STALE / HISTORICAL** pada trial otomatis, sebagian limit, dan roadmap implementasi; bukan hasil aktual. |
| S03 | `docs/rewrite/laravel-migration-spec.md`, bagian 2–5 | Rencana Laravel 11, parallel rewrite, Next.js sebagai produksi sampai migrasi. **STALE / HISTORICAL** untuk versi framework dan status perpindahan yang belum dikonfirmasi. |
| S04 | `docs/launch/deployment-dry-run-v0.2-rc1.md`, bagian 1, 5, 7 | Dry run, bukan laporan deploy; Next.js disebut legacy, tanpa payment gateway/PDF/IoT/LSTM. Larangan wording prediksi perlu direkonsiliasi dengan S08. |
| S05 | `docs/rewrite/week-6-plan-gating-trial-spec.md`, bagian 3–8, 12, 15 | Rencana trial 30 hari tanpa kartu, fitur dan limit. **STALE / HISTORICAL** untuk limit Pro satu usaha dan Business yang masih dinyatakan nanti. |
| S06 | `wattwise-laravel/app/Services/FeatureGateService.php`, `PLANS`, `getEffectivePlan`, `usage` | Konfigurasi hak akses snapshot, expiry trial, hitungan bisnis aktif; `team.members` masih future capability. |
| S07 | `wattwise-laravel/app/Http/Controllers/PlanController.php`, `startTrial`; `OnboardingController.php`, `store` | Aktivasi trial eksplisit 30 hari, pemeriksaan pernah trial, tanpa input pembayaran; onboarding yang dibaca tidak mengaktifkan trial. |
| S08 | `wattwise-laravel/app/Services/Predictions/PredictionService.php`, `predict`, `predictForBusiness`; `app/Http/Controllers/PredictionController.php` | Forecasting deterministik berdasarkan kedalaman histori; bukan ML; prediksi dihitung ulang dan tidak dipersist pada controller ini. |
| S09 | `wattwise-laravel/app/Services/Recommendations/RecommendationService.php`, `getRecommendationsForBusiness`; `app/Http/Controllers/RecommendationController.php`, `index` | Aturan rekomendasi, data hilang, rasio, kandidat peralatan, dan gating tiga rekomendasi pertama. |
| S10 | `wattwise-laravel/resources/js/pages/Plans/Index.vue`, `planCards`, keterangan pilot | Harga yang tampil Rp0/Rp49.000/Rp149.000, Business lima cabang; menyatakan belum menarik biaya atau mengintegrasikan gateway. Copy fitur bukan bukti fitur selesai. |
| S11 | `wattwise-laravel/composer.json`, `require`; `wattwise-laravel/routes/web.php` | Constraint framework `^13.17`, Inertia `^3.0`; rute data, rekomendasi, prediksi, laporan, paket. Constraint bukan verifikasi versi runtime terpasang. |
| S12 | `docs/validation/validation-results-template.md`, bagian 1–4 | Template kosong dengan target minimum wawancara, usability, usefulness, niat kembali, dan WTP verbal. Tidak membuktikan capaian. |
| S13 | `docs/validation/user-testing-script-v0.2.md`, bagian 1, 3–4 | Tugas uji pemahaman produk dan estimasi, pertanyaan WTP Rp49.000; bukan bukti pembayaran. |
| S14 | `src/lib/prediction/model-router.ts`, `routeAndPredict`; `lstm-umkm-model.ts` | Implementasi Next.js rule-based/Gradient Boosting/LSTM; konteks **STALE / HISTORICAL** menurut S04. Komentar LSTM menyatakan ONNX tidak dipakai. |
| S15 | `wattwise-laravel/app/Http/Controllers/ElectricityEntryController.php`, `store`; `app/Models/ElectricityEntry.php` | Catatan bulanan, kWh dari meter, estimasi tagihan bila kosong, batas jumlah entri. Field yang dibaca belum membedakan tegas nilai tagihan input dan hasil estimasi. |
| S16 | `wattwise-laravel/app/Http/Controllers/BusinessController.php`, `store`, `restore`; S06 `usage` | Limit usaha dipanggil saat tambah/restore; bisnis arsip tidak dihitung sebagai usaha aktif. |
| S17 | Inventaris berkas dan status Git lokal, 26 September 2026 | Menetapkan cakupan pemeriksaan dan gap sumber; bukan hasil audit runtime atau validasi komersial. |

**RECOMMENDATION — MODEL INFERENCE:** setiap calon variabel fase berikutnya perlu membawa ID, makna, unit/periode, status, sumber/versi/cakupan, serta pertanyaan terbuka. Ini kontrak pengetahuan, bukan skema database baru.

## 3. Knowledge Status Labels

**Sumber:** S00, Mandatory Knowledge Labels dan Traceability.

| Label | Definisi operasional | Contoh pemakaian di blueprint |
| --- | --- | --- |
| **CURRENT** | Sudah diimplementasikan, diamati, atau digunakan saat ini dalam cakupan bukti yang disebut. | Kode lokal menetapkan durasi trial 30 hari. Tidak menyatakan seluruh pengguna produksi mengalaminya. |
| **HYPOTHESIS** | Belum tervalidasi melalui perilaku atau pembayaran pelanggan nyata. | Rp49.000/bulan dapat diterima pengguna Pro. |
| **TARGET** | Ambang keberhasilan eksperimen atau gate; belum merupakan capaian. | Target usefulness pada template validasi. |
| **RECOMMENDATION** | Usulan keputusan masa depan setelah bukti memadai. | Meninjau tiering sesudah biaya dukungan diketahui. |
| **SIMULATION** | Kondisi hipotetis untuk eksperimen simulator. | Churn bulanan 10–15% dalam stress test mendatang. |

**UNKNOWN / NEEDS VALIDATION** digunakan ketika nilai atau klaim belum dapat dikonfirmasi. Nilai unknown tidak berarti nol dan tidak boleh diisi dengan tebakan.

**MODEL INFERENCE** menandai sintesis atau usulan penulis, bukan label status keenam. **STALE / HISTORICAL** menandai provenance lama. **DERIVED FROM ASSUMPTIONS** dan **BASE-CASE PROJECTION** adalah penjelas asal angka, bukan bukti CURRENT.

Satu objek dapat memuat dua klaim berbeda: **CURRENT** harga tampil Rp49.000; **HYPOTHESIS** harga tersebut menghasilkan pelanggan berbayar dan margin yang layak. Status harus melekat pada klaim, bukan hanya judul tabel.

## 4. WattWise Product Thesis

**Sumber:** S00 Core Product Thesis; S02 bagian 1–6; S15.

**CURRENT — arah produk yang didokumentasikan:** WattWise mengubah data listrik yang sudah tersedia bagi pengguna menjadi keputusan energi yang lebih terstruktur melalui:

**DATA → UNDERSTAND → PREDICT → DECIDE → ACT → MEASURE**

WattWise bersifat **software-first**. Pengguna dapat memulai dengan data manual tanpa sensor atau IoT wajib; input manual tersedia pada snapshot lokal. Nilai yang dituju adalah pemahaman biaya listrik, prioritas pemeriksaan, tindakan yang masuk akal, dan evaluasi periode berikutnya.

**HYPOTHESIS:** alur tersebut membantu pemilik kos/properti kecil dan UMKM padat energi mengambil keputusan yang cukup berguna untuk mendorong penggunaan berulang dan pembayaran. Besaran dampak dan willingness to pay belum dibuktikan oleh sumber yang tersedia.

**RECOMMENDATION:** integrasi hardware dipertimbangkan hanya jika validasi menunjukkan kebutuhan data lebih granular yang tidak terpenuhi oleh pendekatan software-first. Permintaan IoT tidak otomatis menjadi komitmen roadmap.

## 5. What WattWise Is / Is Not

**Sumber:** S00 Product Positioning; S02 Non-Goals; S01 Disclaimer; S04 MVP Non-Goals.

**CURRENT — batas positioning yang ditetapkan sumber:**

| WattWise IS | WattWise IS NOT |
| --- | --- |
| Electricity cost intelligence | Aplikasi resmi PLN atau pengganti PLN Mobile |
| Energy decision support | Meter listrik resmi atau pengukuran presisi per alat |
| Web SaaS | Audit energi bersertifikat |
| Software-first | Sistem diagnosis teknis otomatis |
| Alur terstruktur dari data ke tindakan dan evaluasi | Platform kontrol IoT real-time pada MVP yang ditinjau |
| Estimasi dan indikasi berdasarkan data yang tersedia | Sistem yang menjamin penghematan atau mengetahui penyebab pasti kenaikan listrik |

**CURRENT — batas interpretasi:** forecasting dan diagnostics/recommendation adalah lapisan berbeda. Prediksi konsumsi tidak membuktikan alat rusak. Peringkat kandidat peralatan bukan pengukuran sensor. Perubahan setelah tindakan tidak otomatis disebabkan tindakan tersebut.

## 6. Customer & Market Model

**Sumber:** S00 Market Strategy; S02 bagian 1–4; S13 profil partisipan.

| Tahap pasar | Segmen dan alasan pemilihan | Status |
| --- | --- | --- |
| Initial wedge | Pemilik kos/pengelola properti sewa kecil yang dapat dijangkau lokal, memiliki pengambil keputusan jelas, masalah listrik berulang, dan histori tagihan/kWh yang dapat digunakan. | CURRENT sebagai arah segmentasi; keunggulan akuisisi dan rendahnya hambatan adopsi adalah HYPOTHESIS. |
| Ekspansi | Laundry, F&B, frozen food/cold storage kecil, percetakan/fotokopi, minimarket kecil. | HYPOTHESIS bahwa pola nilai dapat diperluas; validasi per segmen dibutuhkan. |
| Tahap lanjut | Operator multi-lokasi, portfolio intelligence, perluasan geografis. | RECOMMENDATION bersyarat bukti retensi dan kemampuan melayani. |

S02 menyebut kota kampus seperti Purwokerto; ini konteks target lokal, bukan bukti penetrasi pasar. Persona di PRD adalah alat perancangan, bukan pelanggan nyata. Keberadaan calon pelanggan dengan data cukup, buyer yang bersedia membayar, jumlah pengguna aktif, TAM/SAM/SOM, dan ukuran pasar terukur: **UNKNOWN / NEEDS VALIDATION**. Tidak ditambahkan angka pasar.

## 7. Product Value Loop

**Sumber:** S00 Product Value Chain; S08–S09; S11; S15.

| Tahap | Input → nilai yang diharapkan | Status dan batas bukti |
| --- | --- | --- |
| DATA | Catatan listrik, periode, tarif, konteks pendapatan dan peralatan → data usaha terstruktur. | CURRENT pada rute/controller lokal. Akurasi input pengguna tidak otomatis terjamin. |
| UNDERSTAND | Riwayat → tren, perbandingan, rasio, indikasi anomali. | CURRENT sebagai lingkup produk terdokumentasi dan layanan terkait; pemahaman pengguna nyata UNKNOWN / NEEDS VALIDATION. |
| PREDICT | Histori yang dapat digunakan → estimasi konsumsi/biaya berikutnya dengan penjelasan keterbatasan. | CURRENT pada S08, dengan estimator deterministik; akurasi lapangan UNKNOWN / NEEDS VALIDATION. |
| DECIDE | Indikasi + konteks → kandidat yang perlu diperiksa lebih dahulu. | CURRENT untuk rekomendasi rule-based S09; HYPOTHESIS bahwa prioritas tersebut berguna bagi pengguna. |
| ACT | Pengguna memilih tindakan dan melaksanakannya di lapangan. | HYPOTHESIS alur nilai; fitur action-plan tersimpan dan bukti pelaksanaan UNKNOWN / NEEDS VALIDATION pada snapshot yang ditinjau. |
| MEASURE | Data periode sesudah tindakan → perbandingan sebelum/sesudah. | RECOMMENDATION untuk evaluasi observasional; fitur outcome tracking khusus dan hasilnya UNKNOWN / NEEDS VALIDATION. |

**RECOMMENDATION — MODEL INFERENCE:** catatan evaluasi perlu mempertahankan konteks perubahan okupansi, jam operasi, tarif, dan kelengkapan data. Kebutuhan ini tidak menyatakan field tersebut sudah tersedia. Outcome tetap observasional; tidak boleh dipromosikan menjadi bukti kausal atau besaran penghematan terjamin.

## 8. Data Model — Conceptual

**Sumber:** S00 Role of Data; S02 model data; S08–S09; S15. Tabel ini menjelaskan makna data, bukan usulan migrasi.

| Kategori | Peran dan contoh | Status, batas, dan unknown |
| --- | --- | --- |
| Data listrik | **PRIMARY SIGNAL / GROUND TRUTH FOR RECORDED CONSUMPTION**: kWh, histori tagihan, periode bulanan, konteks tarif. | CURRENT sebagai input utama. Ground truth berlaku pada catatan konsumsi yang didukung asal data, bukan semua angka turunan di database. |
| Revenue | **BUSINESS CONTEXT**: pendapatan bulanan dan konteks rasio biaya listrik. | CURRENT pada model produk/rute/rekomendasi. Bukan sinyal pengukuran energi dan bukan seluruh biaya operasional. |
| Equipment | **TECHNICAL CONTEXT**: AC, pompa, freezer, washer, dryer; watt, jumlah, durasi. | CURRENT sebagai konteks estimasi. Nilai template/asumsi bukan bukti pemakaian riil atau penyebab kerusakan. |
| Usaha/lokasi | Profil, segmen, kepemilikan, usaha aktif/arsip. | CURRENT pada S07/S16. Unit lokasi aktif berbeda dari akun berbayar. |
| Paket/trial | Status hak akses, awal/akhir trial, masa aktif paket. | CURRENT pada S06/S07. Status PRO/BUSINESS tidak membuktikan transaksi telah terjadi. |
| Forecast dan rekomendasi | Estimasi turunan, alasan, confidence, kandidat pemeriksaan. | CURRENT pada S08/S09. Confidence internal bukan akurasi empiris terkalibrasi. |
| Tindakan dan outcome | Rencana, waktu pelaksanaan, periode pembanding, konteks perubahan. | RECOMMENDATION untuk pengetahuan masa depan; implementasi khusus UNKNOWN / NEEDS VALIDATION. |
| Cohort dan pembayaran | Awal trial, kelayakan cohort, bukti bayar/pre-order, pembaruan langganan. | RECOMMENDATION — MODEL INFERENCE untuk validasi; dataset komersial aktual UNKNOWN / NEEDS VALIDATION. |

**CURRENT — perbedaan asal nilai:** S15 dapat mengisi kWh dari selisih stand meter dan mengisi tagihan kosong dari estimasi kWh/tarif. S08 dapat menurunkan kWh dari tagihan/tarif. Angka hasil estimasi ini tidak boleh disebut pengukuran konsumsi aktual. Model S15 yang dibaca belum memiliki penanda provenance terpisah untuk semua asal nilai tersebut; lihat C11.

**RECOMMENDATION — MODEL INFERENCE:** kamus masa depan membedakan catatan pengguna, pembacaan meter yang dilaporkan, template, hasil estimasi, dan skenario. Nilai kosong, nol, dan periode hilang harus dibedakan. Penyelarasan periode listrik dan revenue perlu dikonfirmasi sebelum memakai rasio untuk keputusan.

## 9. AI & Decision-Support Boundaries

**Sumber:** S00 AI boundaries; S08–S09; S14; konflik dengan S01/S04.

### Forecasting

**CURRENT — implementasi snapshot Laravel:** `PredictionService` menyebut estimator rule-based deterministik, tanpa ML atau API eksternal pada layanan tersebut. Tidak ada histori usable menghasilkan status tanpa prediksi; satu bulan memakai baseline bulan tersebut; dua bulan memakai pola tren; tiga bulan atau lebih menggabungkan tren dan weighted moving average. Gap dan volatilitas memengaruhi confidence. Estimasi rupiah memerlukan tarif valid. Detail ini mendeskripsikan kode yang sudah ada, tidak membuat aturan simulator.

S08 memakai label tampilan **“Hybrid AI Decision Support”**, tetapi implementasi tersebut bukan bukti model machine learning. **UNKNOWN / NEEDS VALIDATION:** akurasi per segmen, hasil benchmark terbaru, kalibrasi confidence, dan metode pada deployment aktif.

**STALE / HISTORICAL:** S01/S14 mendeskripsikan router Next.js dengan rule-based, Gradient Boosting, dan LSTM. Keberadaan kode lama tidak membuktikan model tersebut berjalan pada Laravel.

**UNKNOWN / NEEDS VALIDATION:** N-BEATS/ONNX pada produk terbaru. Pencarian pada dokumentasi, kode aplikasi Next.js/Laravel yang diperiksa, dan package Next.js tidak menemukan implementasi N-BEATS/ONNX; komentar LSTM lama justru menyatakan ONNX tidak dipakai. Ini hasil pencarian terbatas, bukan pernyataan bahwa model tersebut tidak ada di repository lain.

### Diagnostics / recommendation

**CURRENT:** S09 menggunakan aturan atas data yang tersedia untuk kelengkapan data, rasio listrik terhadap revenue, dan kandidat peralatan. Output adalah decision-support dan prioritas inspeksi manual, bukan diagnosis, bukti equipment failure, ataupun causal attribution.

**HYPOTHESIS:** output yang dipahami dengan benar meningkatkan kepercayaan dan nilai yang dirasakan. Hubungan tersebut belum terukur. Ketika histori tidak cukup, batas informasi harus tetap terlihat; keberadaan estimasi sederhana bukan bukti forecast yang andal.

## 10. User Journey

**Sumber:** S02 Core User Journey; S07–S09; S12–S13; S15–S16.

| Langkah | Perilaku dan nilai | Status / bukti yang masih diperlukan |
| --- | --- | --- |
| Mengenal produk | Calon pengguna memahami masalah dan batas estimasi. | HYPOTHESIS; S13 menyediakan tugas pemahaman, hasil terisi belum ditemukan. |
| Registrasi/onboarding | Membuat profil usaha dan listrik. | CURRENT implementasi onboarding lokal; completion rate aktual unknown. |
| Memilih usaha aktif | Menentukan lokasi yang menjadi konteks data dan analisis. | CURRENT pada controller yang dibaca; bukan bukti konsolidasi seluruh portofolio. |
| Mengisi data | Listrik, revenue, dan konteks alat sesuai ketersediaan. | CURRENT input lokal; kelengkapan data pelanggan unknown. |
| Mendapat nilai awal | Membaca ringkasan, forecast jika tersedia, dan kandidat inspeksi. | CURRENT output layanan; usefulness pelanggan adalah HYPOTHESIS. |
| Mengaktifkan Pro Trial | Aktivasi eksplisit jika eligible; akses Pro selama 30 hari. | CURRENT S07; perbedaan PRD trial otomatis dicatat C04. |
| Mengambil tindakan | Memilih langkah yang relevan dan memeriksa kondisi nyata. | HYPOTHESIS perilaku; outcome dan penyimpanan action plan unknown. |
| Kembali menginput | Menambah data periode berikutnya dan meninjau perubahan. | TARGET penggunaan berulang, belum capaian. |
| Membayar/bertahan | Menilai manfaat Pro atau kebutuhan multi-lokasi Business. | HYPOTHESIS komersial; pembayaran, renewal, churn aktual unknown. |

**RECOMMENDATION — MODEL INFERENCE:** aktivasi harus dihubungkan dengan pengalaman nilai awal yang disepakati tim, bukan disamakan otomatis dengan pendaftaran atau klik trial. Definisi event dan waktu pengamatan belum final.

## 11. Monetization Funnel

**Sumber:** S00 Monetization Model; S05–S07; S10; S12.

**CURRENT — funnel validasi yang dimandatkan:** **FREE → PRO TRIAL → PRO → BUSINESS → RETENTION**. Ini peta pembelajaran nilai dan monetisasi, bukan klaim seluruh pelanggan harus naik ke Business. Retention juga relevan bagi pelanggan Pro.

| Tahap | Nilai / peran bisnis | Pengetahuan yang dapat dipakai |
| --- | --- | --- |
| Free | Akuisisi dan initial value discovery. | CURRENT harga tampil Rp0. Kelayakan Free sebagai saluran akuisisi efisien adalah HYPOTHESIS. |
| Pro Trial | Aktivasi dan penemuan manfaat premium. | CURRENT kode trial **30 hari**, pemeriksaan sudah pernah trial per akun melalui catatan subscription, tanpa kartu/metode bayar pada jalur aktivasi yang dibaca. Efektivitas durasi adalah HYPOTHESIS. |
| Pro | Calon recurring revenue. | CURRENT UI menampilkan **Rp49.000/bulan**; **HYPOTHESIS harga pilot**, bukan harga komersial final atau bukti penerimaan pasar. |
| Business | Multi-lokasi dan potensi ARPA lebih tinggi. | CURRENT UI menampilkan **Rp149.000/bulan**; **HYPOTHESIS harga pilot dan kelayakan unit economics**. |
| Retention | Pengguna kembali memperoleh nilai dan, bila berbayar, memperpanjang. | HYPOTHESIS mekanisme keberlanjutan; hasil cohort UNKNOWN / NEEDS VALIDATION. |

**CURRENT — batas transaksi:** S10 secara eksplisit menyatakan belum menarik biaya dan belum mengintegrasikan gateway. Maka nama paket berbayar, tombol sales, atau record subscription tidak boleh dihitung sebagai pelanggan membayar. Bukti transaksi manual di luar aplikasi: **UNKNOWN / NEEDS VALIDATION**, bukan diasumsikan tidak ada.

**CURRENT — konfigurasi snapshot, bukan janji komersial final:** S06 mengatur Free 1 bisnis aktif, Pro/Trial 3, Business 50; Free 3 entri listrik, 3 entri revenue, 10 peralatan. S16 menerapkan pengecekan limit usaha. UI/spec berbeda; lihat C03, C05, C06. `team.members` Business bernilai 5 dalam konfigurasi tetapi penghitungnya masih placeholder; jangan menyatakan kolaborasi tim telah selesai.

**RECOMMENDATION:** tiering komersial ditinjau setelah WTP, retensi, support burden, penggunaan per lokasi, dan unit economics terukur. Tidak ada entitlement atau pricing produksi yang diubah pada Phase 1.

## 12. Validation Model

**Sumber:** S00 Validation Model; S02 Success Metrics; S12–S13. Strategi finansial yang diminta belum tersedia.

### Makna metrik dan kebutuhan bukti

Definisi operasional berikut adalah **RECOMMENDATION — MODEL INFERENCE** untuk menyepakati pengukuran pada fase berikutnya; belum merupakan instrumentasi aktif.

| Metrik | Apa yang perlu dibuktikan / disepakati | Nilai aktual |
| --- | --- | --- |
| Activation | Pengguna mencapai nilai awal; tentukan event, populasi eligible, dan jendela waktunya. | UNKNOWN / NEEDS VALIDATION |
| Usefulness | Pengguna memahami manfaat dan batas rekomendasi melalui tugas/wawancara. | UNKNOWN / NEEDS VALIDATION |
| Repeat Usage / habit | Pengguna benar-benar kembali dan menginput periode berikutnya; bedakan dari niat kembali. | UNKNOWN / NEEDS VALIDATION |
| Trial-to-Paid | Cohort trial yang sudah mendapat waktu konversi memadai dan bukti pembayaran nyata. | UNKNOWN / NEEDS VALIDATION |
| WTP | Pisahkan pernyataan bersedia membayar, komitmen pre-order, dan transaksi diterima. | UNKNOWN / NEEDS VALIDATION |
| Retention / churn | Bedakan user retention, paid-account retention, dan revenue retention; periode dan cohort belum ditetapkan. | UNKNOWN / NEEDS VALIDATION |
| Customer lifetime | Lama hubungan berbayar yang teramati; cohort muda belum menunjukkan seluruh lifetime. | UNKNOWN / NEEDS VALIDATION |
| CAC, LTV, payback | Biaya akuisisi, kontribusi pelanggan, periode pengembalian; cakupan biaya belum final. | UNKNOWN / NEEDS VALIDATION |

### Target yang benar-benar ditemukan

Semua angka di tabel ini adalah **TARGET**, bukan hasil.

| Sumber | Target yang tercantum | Batas interpretasi |
| --- | --- | --- |
| S12 | Minimal 5 sesi wawancara; TCR ≥80%; median tugas utama <4 menit; 0 temuan P0; usefulness ≥4,0/5. | Gate uji pengguna/release pada template v0.2; template masih berisi placeholder. |
| S12 | Minimal 3 partisipan bersedia menggunakan kembali. | Niat penggunaan, bukan retensi observasional. |
| S12 | Minimal 2 partisipan bersedia membayar Rp49.000/bulan. | WTP verbal, bukan paid/pre-order evidence. |
| S02 | Onboarding >85%; monthly entry retention >60%; template adoption >70%; minimal 5 alat; recommendation view >50%; trial-to-paid >3%. | Target PRD, sebagian mungkin historis; definisi/cohort dan rekonsiliasi dengan brief diperlukan. |

S00 memberi **contoh TARGET bersyarat dukungan dokumen finansial**: activation ≥60%, trial-to-paid ≥10%, habit/repeat input ≥50%, churn bulanan ≤5% setelah periode validasi yang relevan, serta minimum bukti WTP nyata/paid/pre-order. Karena sumber finansial belum ditemukan, angka tersebut **belum diadopsi sebagai target resmi perusahaan**. Status persetujuan, periode pengamatan, dan jumlah minimum bukti pembayaran: **UNKNOWN / NEEDS VALIDATION**. Jangan mengganti target S02 secara diam-diam; lihat C08.

**RECOMMENDATION:** validasi bergerak dari nilai yang dipahami, penggunaan berulang, WTP nyata, hingga retensi berbayar. Satu pilot dengan respon positif tidak cukup untuk menetapkan scale readiness tanpa konteks cohort dan biaya layanan.

## 13. GTM Model

**Sumber:** S00 GTM Model/Market Strategy; S02 initial wedge; S13 target partisipan. Tidak ditemukan laporan performa kanal.

**CURRENT — mekanisme yang disebut dalam brief sebagai model GTM:** founder-led outreach, pilot lokal, komunitas UMKM/properti, partnership, referral, dan ekspansi multi-lokasi. Status eksekusi aktual masing-masing: **UNKNOWN / NEEDS VALIDATION**.

| Mekanisme | HYPOTHESIS yang ingin diuji | Bukti yang diperlukan — RECOMMENDATION / MODEL INFERENCE |
| --- | --- | --- |
| Founder-led outreach | Pendekatan langsung menjangkau decision maker dengan konteks listrik jelas. | Respon, kecocokan segmen, waktu founder, dan pengguna yang melanjutkan. |
| Pilot lokal | Pendampingan awal membantu memahami friction dan nilai produk. | Data usable, tugas selesai, pemahaman rekomendasi, repeat input, WTP nyata. |
| Komunitas UMKM/properti | Kepercayaan komunitas mempermudah akses calon pengguna relevan. | Kualitas peserta dan penggunaan berulang, bukan hanya jumlah pendaftar. |
| Partnership | Mitra menyediakan distribusi atau konteks yang berulang. | Bentuk kerja sama, biaya, tanggung jawab, dan hasil pelanggan. |
| Referral | Pengguna puas memperkenalkan pengguna lain yang sesuai. | Rujukan terlacak, aktivasi, retensi, dan biaya insentif bila ada. |
| Multi-lokasi | Nilai pada satu lokasi mendorong adopsi lokasi tambahan. | Manfaat per lokasi, support burden, dan margin akun. |

**RECOMMENDATION:** scale mengikuti bukti, bukan semata urutan roadmap. Besaran funnel, CAC per kanal, anggaran, partnership aktif, dan kemampuan kanal berulang: **UNKNOWN / NEEDS VALIDATION**.

## 14. Financial Model — Conceptual

**Sumber:** S00 Financial Logic/Monetization/Known Commercial Risk; S06; S10; S12. Sumber finansial Level 3 belum ditemukan.

### Logika keuangan tanpa proyeksi buatan

**HYPOTHESIS:** recurring revenue dapat berasal dari langganan Pro dan Business apabila trial menghasilkan pengguna membayar yang terus memperoleh nilai. Revenue startup WattWise berbeda dari revenue usaha pelanggan pada bagian 8.

| Elemen | Makna dan status | Nilai yang tersedia / gap |
| --- | --- | --- |
| Harga Pro / Business | HYPOTHESIS harga pilot; CURRENT sebagai angka UI. | Rp49.000 / Rp149.000 per akun per bulan sesuai tampilan paket; kontrak penagihan aktual belum terverifikasi. |
| Trial conversion | TARGET / HYPOTHESIS untuk validasi funnel. | Target PRD >3%; contoh brief ≥10% belum terkonfirmasi finansial. Aktual unknown. |
| Churn bulanan | TARGET / HYPOTHESIS keberlanjutan. | Contoh brief ≤5% belum terkonfirmasi; aktual dan periode relevan unknown. |
| ARPA | HYPOTHESIS pendapatan rata-rata akun; bergantung mix paket dan pembayaran. | UNKNOWN / NEEDS VALIDATION; tidak diturunkan menjadi angka dari harga pilot saja. |
| Gross margin | HYPOTHESIS tentang sisa pendapatan setelah biaya layanan yang disepakati. | UNKNOWN / NEEDS VALIDATION; klasifikasi hosting, inference, storage/report, dan support belum final. |
| CAC | HYPOTHESIS biaya untuk memperoleh pelanggan berbayar. | UNKNOWN / NEEDS VALIDATION; biaya kanal dan waktu founder belum dihitung. |
| Customer lifetime | Observasi atau HYPOTHESIS umur pelanggan bila belum tersedia histori. | UNKNOWN / NEEDS VALIDATION. |
| LTV | HYPOTHESIS — **DERIVED FROM ASSUMPTIONS** bila memakai lifetime/margin asumsi. | UNKNOWN / NEEDS VALIDATION; tidak ada perhitungan LTV baru. |
| Payback | HYPOTHESIS waktu pengembalian biaya akuisisi dari kontribusi pelanggan. | UNKNOWN / NEEDS VALIDATION; tidak ada periode numerik baru. |
| Operating cost | Kategori biaya operasi, kapasitas founder, support, infrastruktur, dan pengembangan. | UNKNOWN / NEEDS VALIDATION untuk nilai dan pemisahan biaya tetap/variabel. |
| Paid accounts per kuartal | **TARGET / BASE-CASE PROJECTION** jika kelak disediakan strategi finansial. | UNKNOWN / NEEDS VALIDATION; tidak dibuat angka pelanggan atau revenue kuartalan. |
| Revenue aktual | Memerlukan transaksi dan periode yang dapat direkonsiliasi. | UNKNOWN / NEEDS VALIDATION; UI menyatakan belum menarik biaya, pembayaran eksternal belum diketahui. |

**RECOMMENDATION — MODEL INFERENCE:** model proyeksi kuartalan kelak perlu memisahkan akun awal, trial yang matang, konversi, renewal/churn, mix Pro/Business, perubahan lokasi, dan biaya layanan sepanjang periode. Agregasi bulanan/kuartalan dan aturan pengakuan pendapatan belum ditentukan. Phase 1 tidak menetapkan persamaan, default angka, atau kurva pertumbuhan.

### Risiko harga dan entitlement

**CURRENT — paparan konfigurasi:** harga Business yang tampil Rp149.000/bulan berhadapan dengan konfigurasi 50 bisnis aktif (S06), UI 5 cabang (S10), dan PRD 10 (S02). Angka ini adalah konflik spesifikasi, bukan skenario buatan.

**HYPOTHESIS — risiko bisnis:** banyak lokasi pada harga akun rendah dapat meningkatkan pekerjaan onboarding/support, penyimpanan/report, menekan revenue per lokasi, dan merusak contribution margin. Belum ditemukan angka biaya yang membuktikan margin sudah negatif; analisis hubungan ini adalah **MODEL INFERENCE**, bukan hasil laporan finansial.

**RECOMMENDATION:** tim menyepakati unit penagihan, batas lokasi, cakupan support, dan bukti margin sebelum menentukan tier komersial. Tidak mengubah produksi pada Phase 1.

## 15. Strategic Roadmap

**Sumber:** S00 Roadmap Logic; pembanding S02 Roadmap. Seluruh tahap di bawah adalah **RECOMMENDATION arah strategis**, bukan tahap yang sudah dicapai.

**PRODUCT VALIDATION → PAID VALIDATION → LOCAL COMMERCIALIZATION → PRODUCT INTELLIGENCE → SCALE & ECOSYSTEM**

| Tahap | Pertanyaan keputusan | Bukti yang perlu tersedia |
| --- | --- | --- |
| Product validation | Apakah pengguna memahami dan menggunakan nilai produk? | Kualitas produk/data, usefulness, perilaku berulang. |
| Paid validation | Apakah nilai cukup kuat untuk dibayar? | Bukti WTP nyata, konversi, awal retensi, beban support. |
| Local commercialization | Apakah akuisisi dan pelayanan lokal dapat diulang? | Cohort berbayar, biaya kanal, kapasitas operasi. |
| Product intelligence | Apakah pembelajaran penggunaan meningkatkan keputusan produk? | Gap data/forecast, pola kebutuhan segmen, evaluasi manfaat. |
| Scale & ecosystem | Apakah ekspansi dapat dilayani secara berkelanjutan? | Retensi, recurring revenue, unit economics, kanal dan kapasitas yang memadai. |

Prinsip keputusan: **VALUE → WTP → RETENTION → RECURRING REVENUE → SCALE**. Ambang numerik untuk tiap gate belum final. Hardware tetap opsional dan bergantung validasi kebutuhan granularitas; tidak otomatis wajib pada tahap terakhir.

Roadmap fitur pada PRD (rewrite → automation → hardware simulation/expansion) tidak sama dengan roadmap bisnis ini atau fase pembangunan simulator. Lihat C10.

## 16. Short-Term Prototyping Timeline

**Sumber:** S00 Short-Term Prototyping Plan; pembanding dokumen rewrite Week 1–8 pada inventaris S17.

**RECOMMENDATION — rencana empat minggu, bukan bukti pelaksanaan:**

| Minggu | Fokus | Hasil yang diharapkan, belum tercapai |
| --- | --- | --- |
| 1 | MVP stabilization | Daftar masalah prioritas dan kesiapan alur inti untuk diuji. |
| 2 | User validation | Temuan pemahaman, usability, usefulness, dan kebutuhan data. |
| 3 | Limited pilot | Observasi penggunaan dalam cakupan terbatas serta sinyal WTP. |
| 4 | Evaluation / iteration / readiness | Evaluasi bukti, perbaikan prioritas, dan keputusan kesiapan tahap selanjutnya. |

**FUTURE ROADMAP** adalah arah bisnis jangka panjang; **4-WEEK PROTOTYPING TIMELINE** adalah rencana kerja pendek. Keduanya berbeda dari Phase 1/2 simulator dan penomoran Week 1–8 rewrite historis. Tanggal mulai, PIC yang ditunjuk, kapasitas, dan bukti penyelesaian: **UNKNOWN / NEEDS VALIDATION**. Berakhirnya empat minggu tidak otomatis menandakan siap scale.

## 17. Known Risk Domains

**Sumber:** S00 Risk Model; S02 Risks & Constraints; S08–S10; S12–S13. Risiko adalah **HYPOTHESIS paparan** kecuali kondisi kode yang secara khusus diberi CURRENT; kejadian dan besaran dampak aktual belum terkonfirmasi. Hubungan dampak merupakan **MODEL INFERENCE**, tanpa formula mitigasi.

| Domain | Risiko yang perlu dipahami | Hubungan dengan domain lain |
| --- | --- | --- |
| **PRODUCT RISK** | Bugs, UX buruk, histori tidak cukup, forecast unavailable/lemah, rekomendasi disalahpahami. | Pengalaman nilai dan trust melemah; activation dan repeat usage berpotensi turun. |
| **CUSTOMER RISK** | Aktivasi rendah, gagal input, rasa penasaran sekali pakai, penggunaan berulang lemah. | Data berikutnya tidak tersedia; sulit menilai outcome, WTP, dan retensi. |
| **COMMERCIAL RISK** | WTP rendah, trial-to-paid rendah, churn tinggi, price/value mismatch. | Pendapatan berulang dan umur pelanggan berpotensi turun. |
| **FINANCIAL RISK** | CAC tinggi, support burden, contribution margin negatif, harga terlalu rendah untuk multi-lokasi. | Payback dan kelayakan Business dapat memburuk; kapasitas founder tertekan. |
| **MARKET RISK** | Segmen awal keliru, akuisisi mahal, kanal sulit diulang. | Pelanggan kurang cocok, kebutuhan produk menyebar, biaya pertumbuhan meningkat. |
| **TECHNOLOGY RISK** | Model forecast belum cukup divalidasi, kompleksitas integrasi, permintaan IoT, kualitas/provenance data buruk. | Trust dan kejelasan batas estimasi menurun; scope dan biaya berpotensi meningkat. |
| **EXECUTION RISK** | Scale prematur, feature creep, kapasitas founder kurang, disiplin validasi lemah. | Perbaikan nilai inti tertunda, bukti tercampur asumsi, dana dan waktu terserap sebelum retensi terbukti. |

**CURRENT — sinyal risiko yang teramati pada sumber:** konflik entitlement Business, label AI vs estimator deterministik, dan perbedaan target/definisi validasi. Ini membuktikan inkonsistensi sumber, bukan kerugian finansial atau kegagalan pelanggan yang sudah terjadi. Probabilitas, severity numerik, biaya insiden, dan efektivitas mitigasi: **UNKNOWN / NEEDS VALIDATION**.

## 18. Known Contradictions / Open Questions

**Sumber:** per baris di bawah. Tidak ada konflik yang diselesaikan dengan tebakan. Kolom keputusan adalah **RECOMMENDATION**, bukan perubahan produk yang telah disetujui.

### Register konflik

| ID | Pernyataan A + lokasi | Pernyataan B + lokasi | Mengapa penting | Keputusan yang diperlukan |
| --- | --- | --- | --- | --- |
| C01 | S01 Tech Stack menyebut Next.js sebagai stack terbaru; S03 §3 mempertahankannya sebagai produksi sampai migrasi siap. | S04 §7 menyebut Next.js legacy/reference only; kode Laravel tersedia. | Simulator dapat memodelkan produk atau fitur yang salah versi. | Tim menunjukkan repository/ref dan deployment aktif; pisahkan baseline Next.js dan Laravel. Status produksi UNKNOWN / NEEDS VALIDATION. |
| C02 | S03 §2 merencanakan Laravel 11. | S11 composer meminta framework `^13.17`. | Detail arsitektur lama tidak tepat untuk snapshot lokal. | Perbarui sumber arsitektur setelah versi terpasang/runtime dikonfirmasi; spesifikasi 11 ditandai STALE / HISTORICAL. |
| C03 | S10 `planCards`: Business 5 cabang; S02 §14: Business 10 profil. | S06 `PLANS`: Business 50 bisnis aktif; S16 memakai limit tersebut. | Janji pelanggan dan beban support/unit economics dapat berbeda jauh. | Tetapkan limit komersial dan satuan akun/lokasi, berdasarkan bukti layanan. Phase 1 tidak memilih 5, 10, atau 50 sebagai kebijakan final. |
| C04 | S02 Trial Rules: trial otomatis setelah onboarding. | S05 §8 dan S07 `startTrial`: aktivasi eksplisit; `OnboardingController::store` yang dibaca tidak mengaktifkan trial. | Waktu mulai cohort dan definisi conversion berbeda. | Tentukan pemicu resmi trial dan perbarui wording; CURRENT lokal adalah jalur aktivasi eksplisit yang ditemukan. |
| C05 | S05 matriks: Pro 1 bisnis; S10 Pro mencantumkan multi-bisnis dalam fitur yang tidak termasuk. | S02 §14 dan S06: Pro/Trial 3 bisnis aktif. | Nilai paket dan batas expansion tidak konsisten. | Tetapkan entitlement dan copy resmi; jangan memakai matriks lama sebagai fakta implementasi. |
| C06 | S02/S05 menyebut Free histori “3 bulan terakhir”. | S06 `usage` menghitung seluruh entri; S15 menolak entri periode baru jika jumlah mencapai 3, bukan rolling window tiga bulan. | Pengguna bisa gagal mencatat bulan keempat; berpengaruh pada repeat usage dan interpretasi habit. | Sepakati makna kuota, akses histori, dan kebutuhan validasi; dokumentasikan perilaku aktual tanpa mengubahnya. |
| C07 | S01 menyebut ML routing dan PDF; S04 §5/§7 melarang wording prediksi tagihan, serta meniadakan LSTM dan PDF. | S08 dan S11 memiliki forecasting deterministik/rute prediksi; S06 menonaktifkan `export.pdf`. S08 memakai label “Hybrid AI Decision Support” tetapi menyatakan bukan ML. | Narasi AI, fitur historis, dan kemampuan lokal mudah tercampur. | Sahkan deskripsi forecasting per versi dan bahasa UI; verifikasi N-BEATS/ONNX jika ada sumber terbaru. |
| C08 | S02 §15: trial-to-paid >3%, monthly entry retention >60%; S12: niat bayar/kembali. | S00 memberi contoh bersyarat ≥10% konversi, ≥50% habit, serta bukti paid/pre-order; sumber finansial belum ditemukan. | Target berbeda dan niat tidak setara perilaku/transaksi. Bukan bukti bahwa salah satu target baru sudah resmi. | Sediakan strategi finansial, samakan event/cohort/periode, sahkan target. Aktivasi ≥60% dan churn ≤5% juga belum terkonfirmasi. |
| C09 | S10 kartu Business menjanjikan kolaborasi sampai 5 pengguna dan konsolidasi laporan. | S05 menyebut fitur tim nanti; S06 `usage('team.members')` selalu 0 dengan komentar future capability. | Copy dapat dianggap fitur selesai meski bukti implementasinya belum memadai. | Audit kesiapan kolaborasi/konsolidasi; jangan mengklaim fitur CURRENT hanya dari kartu harga. |
| C10 | S02 roadmap memakai Core MVP → Automation → Hardware Simulation/Expansion; dokumen rewrite memakai Week 1–8. | S00 memakai lima tahap strategi bisnis dan timeline prototyping empat minggu. | Penomoran fase dapat mendorong scale atau hardware berdasarkan kalender. | Bedakan roadmap bisnis, timeline eksperimen, sejarah rewrite, dan fase simulator; gate berbasis bukti. |
| C11 | S00 menempatkan listrik sebagai ground truth recorded consumption; S02 menggambarkan histori tagihan. | S15 menyimpan tagihan hasil estimasi pada field tagihan; S08 dapat menurunkan kWh dari tagihan/tarif. | Nilai turunan dapat keliru dianggap pembacaan aktual, mencemari evaluasi forecast/outcome. | Sepakati provenance konseptual dan cara mengidentifikasi nilai lama. Tidak ada migrasi skema pada Phase 1. |
| C12 | S02 §14: rekomendasi Free hanya isu kelengkapan data. | S05 top 3 dan S09 controller membuka tiga rekomendasi pertama tanpa filter hanya kelengkapan. | Definisi nilai Free, upgrade, dan activation tidak sama. | Tetapkan spesifikasi resmi Free; pertahankan catatan bahwa kode lokal menerapkan gating posisi. |
| C13 | S02 journey menggunakan istilah “sisa kas bersih” setelah listrik. | S09 menjelaskan biaya operasional lain belum diperhitungkan; S13 menguji pemahaman “sisa pendapatan setelah listrik”. | Pengguna dapat mengira output adalah laba bersih. | Gunakan definisi sisa pendapatan setelah listrik dan konfirmasi wording produk, tanpa mengubah UI pada Phase 1. |

### Pertanyaan terbuka dan kesenjangan bukti

| ID | Informasi yang belum tersedia | Status | Bukti / keputusan yang dibutuhkan |
| --- | --- | --- | --- |
| O01 | Source of truth terbaru: repo/ref, deployment, final deck PLN ICE. | UNKNOWN / NEEDS VALIDATION | Tim menunjuk versi yang sah; hasil pemeriksaan snapshot ini tidak disamakan otomatis dengan live product. |
| O02 | Strategi finansial, RAB, biaya support, CAC, LTV, ARPA, margin, proyeksi kuartalan. | UNKNOWN / NEEDS VALIDATION | Dokumen Level 3 dengan unit, periode, status asumsi/target/aktual. |
| O03 | Pilot terisi, jumlah pengguna/pembayar, konversi, retensi, WTP nyata. | UNKNOWN / NEEDS VALIDATION | Hasil cohort dan bukti transaksi/pre-order; template dan demo seed bukan hasil pelanggan. |
| O04 | Apakah fitur action-plan/measurement sudah ada pada versi terbaru. | UNKNOWN / NEEDS VALIDATION | Kode, alur, serta data penggunaan; ACT/MEASURE tetap intended value loop sampai terverifikasi. |
| O05 | Model N-BEATS/ONNX, evaluasi akurasi, validitas confidence. | UNKNOWN / NEEDS VALIDATION | Artefak/model path, jalur inference, versi dan evaluasi data relevan. |
| O06 | Persetujuan gate activation, habit, trial-to-paid, churn, minimum WTP nyata. | UNKNOWN / NEEDS VALIDATION | Definisi event, denominator, cohort matang, jendela observasi dan pengambil keputusan. |
| O07 | Mekanisme penagihan nyata dan harga final. | UNKNOWN / NEEDS VALIDATION | S10 menyatakan belum menarik biaya; pembayaran eksternal dan kontrak belum tersedia. Harga pilot tetap HYPOTHESIS. |
| O08 | Implementasi kanal GTM, kapasitas founder, biaya per kanal, tanggal/PIC prototyping. | UNKNOWN / NEEDS VALIDATION | Catatan pelaksanaan dan bukti hasil, bukan hanya daftar mekanisme. |
| O09 | Kebutuhan hardware dan ambang kesiapan scale. | UNKNOWN / NEEDS VALIDATION | Validasi kebutuhan granularitas, retensi, kemampuan layanan, dan unit economics. |

## 19. Candidate Dependencies for Phase 2

**Sumber:** S00 Dependency Candidates; konteks S08–S13. Label resmi bagian ini: **“Candidate dependencies for Phase 2”**.

Semua hubungan di bawah adalah **HYPOTHESIS — MODEL INFERENCE** untuk diformalisasi kemudian. Panah berarti kandidat keterkaitan, bukan kausalitas terbukti, besaran pengaruh, atau hubungan matematis yang sudah diimplementasikan.

1. **Product Quality → Activation → Usefulness → Repeat Usage → WTP → Trial-to-Paid → Retention → Recurring Revenue → Scale Readiness.** Kualitas yang dirasakan, WTP verbal, dan pembayaran nyata harus tetap dibedakan.
2. **Data Quality → Analysis Quality → Forecast Reliability → User Trust → Perceived Value.** Kualitas model juga memerlukan evaluasi; kelengkapan data saja tidak menjamin akurasi.
3. **Churn → Customer Lifetime → LTV → Recurring Revenue → Scale Readiness.** Arah keterkaitan perlu mempertimbangkan cohort, periode, dan definisi churn yang dipilih.
4. **CAC → Payback → Unit Economics → Growth Sustainability.** Cakupan biaya dan basis contribution margin belum ditentukan.
5. **Support Burden → Operating Cost → Gross Margin → Business Tier Viability.** Perlu pemisahan biaya layanan dan biaya operasi; klasifikasi akuntansi belum final.

Tidak ada koefisien, skor readiness, fungsi mitigasi, kurva, atau perhitungan dampak. Ketergantungan balik, jeda waktu, dan faktor pembaur akan dibahas pada Phase 2 setelah definisi disepakati.

## 20. Future Simulator Modules

**Sumber:** S00 Future Simulator Modules. Semua modul berstatus **RECOMMENDATION rancangan masa depan**; contoh keluarannya **SIMULATION**, belum tersedia atau diimplementasikan.

| Modul | Purpose | Expected future inputs | Expected future outputs | Knowledge dependencies |
| --- | --- | --- | --- | --- |
| **Product Lab** | Memahami alur produk dan batas estimasi. | Kualitas/kelengkapan histori, tarif, revenue, konteks alat, status fitur. | Penjelasan alur nilai dan kondisi output unavailable/terbatas. | Bagian 4–9; baseline produk dan metode forecast yang sah. |
| **Customer Journey Lab** | Mengeksplorasi perjalanan dari nilai awal ke penggunaan berulang. | Segmen, onboarding, pemahaman rekomendasi, trial, friction. | Jalur perjalanan dan titik kehilangan nilai hipotetis. | Bagian 6, 10–12; definisi activation/cohort. |
| **Financial Lab** | Memahami sensitivitas asumsi komersial. | Harga pilot, mix paket, konversi, churn, biaya, lokasi per akun. | Perbandingan kondisi finansial hipotetis dengan label asumsi. | Bagian 11, 12, 14; sumber finansial Level 3 dan entitlement yang disepakati. |
| **GTM Lab** | Membandingkan pendekatan segmen dan kanal. | Kanal, calon pelanggan, kapasitas outreach, biaya dan bukti pilot. | Trade-off akuisisi dan kesiapan kanal untuk diulang. | Bagian 6, 12–14; bukti GTM. |
| **Incident Lab** | Memahami respons terhadap gangguan startup. | Insiden produk, data, trust, pembayaran, support, atau kapasitas. | Peta domain terdampak dan opsi keputusan untuk dibahas. | Bagian 17–19; tidak menjanjikan formula mitigasi. |
| **Roadmap Decision Lab** | Menguji prioritas berbasis bukti. | Bukti nilai/WTP/retensi, kapasitas, permintaan hardware, tahap bisnis. | Alasan melanjutkan, menunda, atau menguji ulang keputusan. | Bagian 12, 15–19; gate yang disepakati. |
| **Jury Mode** | Melatih penjelasan bisnis dan batas klaim. | Pertanyaan, status pengetahuan, sumber, konflik dan skenario. | Peta sumber/domain relevan dan gap bukti untuk dijelaskan tim. | Seluruh blueprint, terutama bagian 3, 9, 14, 18, 22. |

## 21. Future Scenario Categories

**Sumber:** S00 Project Purpose dan Jury / Investor Knowledge. Seluruh baris berlabel **SIMULATION**, tanpa probabilitas, besaran dampak, atau hasil yang dihitung.

| Kategori / pemicu hipotetis | Domain yang dieksplorasi kelak | Batas interpretasi |
| --- | --- | --- |
| Churn meningkat, termasuk contoh 10–15% per bulan | Lifetime, retensi, revenue, scale readiness | Angka stress test dari brief; bukan churn WattWise sekarang. |
| Trial-to-paid turun, termasuk hanya 3% | Aktivasi, nilai premium, WTP, model finansial | 3% skenario berbeda dari target PRD >3%; tidak mengubah target resmi. |
| Pengguna tidak memahami rekomendasi | Trust, usefulness, support, repeat usage | Tidak menganggap rekomendasi sebagai diagnosis teknis. |
| Histori listrik kurang atau data tidak andal | Forecast unavailable/lemah, analisis, trust | Jangan mengisi histori hilang dengan data seolah aktual. |
| Pengguna tidak kembali setelah bulan pertama | Habit, data berikutnya, value loop, churn | Bedakan tidak login, tidak input, dan berhenti berlangganan. |
| Business memakai terlalu banyak lokasi | Beban support, biaya report/storage, margin | Entitlement aktual masih berkonflik; baseline harus ditetapkan dahulu. |
| Pengguna meminta IoT | Kebutuhan data, biaya, integrasi, fokus produk | Hardware opsional, tidak otomatis diprioritaskan. |
| Pilot menunjukkan hasil baik | Kualitas bukti, paid validation, kapasitas | Tidak otomatis membuktikan product-market fit atau siap scale. |
| Pilot gagal atau hasil campuran | Segmentasi, usability, nilai, disiplin validasi | Tidak otomatis menyimpulkan semua segmen gagal. |
| Tim scale terlalu dini | Akuisisi, retensi, support, kapasitas founder | Kalender roadmap tidak menggantikan gate bukti. |

## 22. Jury / Investor Question Domains

**Sumber:** S00 Jury / Investor Knowledge; peta bukti bagian 2 dan 18.

### Questions the Simulator Should Eventually Help the Team Answer

Daftar pertanyaan berikut adalah **RECOMMENDATION cakupan latihan**. Contoh angka what-if tetap **SIMULATION**. Pemetaan tidak menggantikan jawaban berbasis bukti dan tidak menyediakan naskah jawaban panjang.

| Pertanyaan | Sistem/domain | Rujukan pengetahuan |
| --- | --- | --- |
| Masalah apa yang sebenarnya diselesaikan WattWise? | Product thesis, customer | Bagian 4, 6–7 |
| Mengapa tidak cukup memakai PLN Mobile? | Positioning, batas produk | Bagian 5; bukan perbandingan fitur PLN Mobile yang belum diteliti |
| Mengapa tidak memakai IoT sejak hari pertama? | Software-first, technology, economics | Bagian 4, 9, 17 |
| Bagaimana menentukan kandidat inspeksi tanpa sensor? | Data, decision-support | Bagian 8–9 |
| Di mana AI digunakan? | Arsitektur dan forecasting | Bagian 9; C01, C07, O05 |
| Apa yang terjadi jika histori tidak cukup? | Data quality, product | Bagian 7–9 |
| Mengapa pengguna bersedia membayar? | Value, WTP, commercial | Bagian 10–12; bukti aktual O03 |
| Mengapa Pro Trial 30 hari? | Journey, activation, experiment | Bagian 11–12; efektivitas durasi belum tervalidasi |
| Mengapa Rp49 ribu / Rp149 ribu? | Pricing hypothesis, unit economics | Bagian 11, 14; O02, O07 |
| Bagaimana jika churn 10–15%? | SIMULATION: retention, lifetime, financial | Bagian 19, 21 |
| Bagaimana jika trial-to-paid hanya 3%? | SIMULATION: conversion, WTP, financial | Bagian 12, 21; C08 |
| Bagaimana jika pengguna tidak kembali setelah bulan pertama? | Customer, repeat usage, retention | Bagian 10, 12, 17 |
| Bagaimana jika pelanggan Business memakai terlalu banyak lokasi? | Entitlement, support, financial | Bagian 11, 14; C03, C05 |
| Kapan hardware perlu diperkenalkan? | Technology, roadmap decision | Bagian 4, 15; O09 |
| Kapan WattWise siap scale? | Validation, GTM, financial, execution | Bagian 12–15, 19 |
| Apa yang perlu dilakukan jika pilot gagal? | Validation, roadmap, execution | Bagian 12, 15–17, 21 |

## 23. Phase 1 Completion Checklist

**Sumber:** S00 Quality Check; inventaris S17; pemeriksaan isi dokumen ini.

- [x] Blueprint dan README tersedia di `docs/simulator/` pada workspace yang diminta.
- [x] Dokumentasi dan snapshot WattWise tetangga telah diperiksa; hierarki, lokasi sumber, dan batas freshness dicatat.
- [x] Setiap bagian utama menyebut sumber; fakta snapshot dipisahkan dari deployment dan hasil pelanggan.
- [x] CURRENT, HYPOTHESIS, TARGET, RECOMMENDATION, SIMULATION, serta UNKNOWN / NEEDS VALIDATION didefinisikan.
- [x] Harga pilot tidak dianggap harga tervalidasi; angka keuangan yang tidak tersedia tidak diisi atau dihitung.
- [x] Software-first konsisten; hardware opsional dan bergantung validasi.
- [x] Forecasting dipisahkan dari diagnostics; rekomendasi adalah decision-support.
- [x] Evaluasi outcome diposisikan sebagai observasional, bukan bukti kausal.
- [x] Roadmap strategi, timeline empat minggu, sejarah rewrite, dan fase simulator dibedakan.
- [x] Risiko, kandidat dependensi, tujuh modul masa depan, kategori skenario, dan domain pertanyaan dicatat tanpa aturan matematis atau executable code.
- [x] Konflik yang ditemukan dicatat dengan A/B, lokasi, dampak, serta keputusan yang dibutuhkan; tidak diperbaiki dengan tebakan.
- [x] Penulisan tugas ini dibatasi pada dua berkas Markdown di `docs/simulator/`; tidak mengubah kode produksi, database, pricing, entitlement, atau sumber tetangga.
- [ ] Tim mengonfirmasi repository/ref/deployment terbaru dan mengesahkan baseline produk (O01).
- [ ] Deck final PLN ICE, strategi finansial, RAB, dan hasil pilot dilampirkan serta direkonsiliasi (O01–O03).
- [ ] Tim memutuskan konflik entitlement, trial, target, dan wording AI sebelum baseline dipakai sebagai aturan (bagian 18).

Checklist terbuka adalah keterbatasan bukti dan keputusan tim, bukan fitur simulator yang sudah diimplementasikan. Workspace tujuan tidak memiliki Git sehingga tidak tersedia diff terhadap HEAD; verifikasi cakupan menggunakan inventaris berkas dan operasi penulisan yang hanya menyentuh dua dokumen. Tidak dijalankan build aplikasi, migrasi, atau pengujian runtime; pekerjaan ini dokumentasi saja.

## 24. Next Phase

**Sumber:** S00 Next Phase/Dependency Candidates; gap bagian 18. Seluruh langkah berikut **RECOMMENDATION**, belum dikerjakan.

1. Konfirmasi source of truth terbaru, lengkapi deck/finansial/pilot, dan minta keputusan tim untuk konflik yang memengaruhi baseline. Unknown tetap unknown sampai ada bukti.
2. Susun kamus variabel: definisi, satuan, periode, segment/cohort, unit akun vs lokasi, label status, provenance, dan keterbatasan. Bedakan metrik produk dari hasil komersial.
3. Formalisasikan kandidat dependensi menjadi spesifikasi hubungan yang dapat ditinjau: arah, jeda waktu, faktor pembaur, serta syarat data. Besaran parameter hanya berasal dari sumber atau skenario yang dilabeli.
4. Pisahkan baseline bukti, target eksperimen, dan variasi SIMULATION sebelum membahas aturan numerik. Harga/limit yang berkonflik tidak boleh diam-diam menjadi default simulator.
5. Tetapkan kriteria penerimaan Phase 2 dan cakupan fase implementasi terpisah. UI, engine, scoring, serta skenario interaktif menunggu pekerjaan lanjutan.

**Phase 2 tidak diimplementasikan dalam perubahan ini.**
