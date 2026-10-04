# E-TAT: Flow, Input, Output, dan Kontrol Data

Rancangan aplikasi MVP empat role: Sekretariat/Admin, Pengaju, Medis, dan Hukum.

Tanggal: 3 Oktober 2026  
Status: Rancangan, bukan SOP yang telah disahkan atau implementasi aplikasi.

## 1. Tujuan dan batas rancangan

Dokumen ini memetakan halaman aplikasi dari permintaan akun sampai tindak lanjut rehabilitasi: siapa yang mengisi, data yang masuk, hasil yang dihasilkan, dan kontrol untuk melanjutkan proses.

**Pisahkan tiga hal:** persetujuan akun, pemrosesan perkara TAT, dan pelaksanaan rehabilitasi. Akun aktif tidak berarti permohonan disetujui; hasil TAT terbit tidak berarti rehabilitasi telah dilaksanakan.

Asesmen Medis dan Hukum merupakan pemeriksaan terpisah. Hasilnya dibahas dalam **Case Conference/Pembahasan Kasus TAT**, bukan â€œsidang medisâ€ sebagai sidang pengadilan.

Isi dan kelompok formulir TAT mengacu pada JUKNIS TAT 2025. Field akun, status, model penyimpanan, audit, serta kontrol aplikasi merupakan rekomendasi teknis. Tabel di sini adalah pemetaan operasional, bukan transkripsi verbatim seluruh butir instrumen. Label, kode jawaban, dan instruksi resmi tetap mengikuti lampiran sumber.

Tidak semua data wajib pada saat draft. Kebutuhan field ditentukan oleh tahap, jalur perkara, kondisi subjek, dan template. Konflik bab/lampiran serta kebijakan yang belum diputuskan tidak boleh dijadikan aturan penolakan otomatis.

## 2. Ringkasan alur

1. Pengaju mendaftar dan memverifikasi kontak.
2. Admin memeriksa identitas, instansi, dan kewenangan akun.
3. Pengaju mengisi dan mengirim permohonan TAT.
4. Admin memverifikasi berkas dan meminta koreksi bila perlu.
5. Admin mencatat disposisi Ketua, penugasan tim, dan jadwal.
6. Petugas mencatat kehadiran serta prasyarat pemeriksaan.
7. Medis dan Hukum melakukan asesmen pada alur masing-masing.
8. Hasil final dibahas dalam Case Conference.
9. Dokumen hasil disusun, ditandatangani, diperiksa, dan diterbitkan.
10. Hasil diserahkan kepada penerima berwenang.
11. Pengaju melaporkan pelaksanaan rehab/tindak lanjut berdasarkan bukti; Admin memverifikasi.

Ketua TAT dan fasilitas rehab tidak memiliki akun tambahan dalam MVP. Kewenangan mereka tetap ada: Admin hanya mencatat keputusan atau bukti eksternal, bukan menggantikan pengambil keputusan.

## 3. Pendaftaran akun Pengaju

**Pengisi:** calon Pengaju. Data akun petugas terpisah dari identitas orang yang diperiksa.

| Kelompok          | Input                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Identitas petugas | Nama lengkap, identitas kedinasan/NIP/NRP sesuai instansi, jabatan, pangkat bila relevan |
| Instansi          | Instansi, unit kerja, wilayah penugasan                                                  |
| Kontak            | Email, nomor kontak, kanal verifikasi                                                    |
| Kewenangan        | Jenis kewenangan dan dasar penugasan/penunjukan                                          |
| Bukti             | File surat, jenis dokumen, nomor, tanggal, penerbit                                      |

**Proses:** daftar â†’ verifikasi kontak â†’ unggah bukti kewenangan â†’ kirim untuk ditelaah.

**Output:** permintaan akun, nomor pelacakan, dan status pemeriksaan. Belum ada akses perkara.

**Kontrol:** role publik hanya Pengaju. Medis, Hukum, dan Admin diundang oleh pihak berwenang. Verifikasi email membuktikan penguasaan kanal, bukan kewenangan kedinasan. File bukti dipindai sebelum dapat digunakan.

## 4. Pemeriksaan akun oleh Admin

**Data masuk:** permintaan akun, kontak terverifikasi, dan bukti kewenangan.

| Input Admin | Isi                                                              |
| ----------- | ---------------------------------------------------------------- |
| Identitas   | Hasil pencocokan dan catatan                                     |
| Instansi    | Unit terkonfirmasi dan lingkup akses                             |
| Kewenangan  | Dasar kewenangan, jenis tindakan/jalur yang diizinkan            |
| Hasil       | Disetujui, ditolak, atau diklarifikasi sesuai alur yang disahkan |
| Alasan      | Dasar keputusan atau bagian yang harus diperbaiki                |

**Output:** akun aktif dengan akses terbatas atau pemberitahuan alasan belum disetujui. Aktivasi menggunakan undangan/tautan sekali pakai.

**Kontrol:** pemeriksa dan waktu pemeriksaan dicatat otomatis. Pengaju tidak dapat mengganti instansi sendiri untuk memperoleh akses perkara lain. Alur klarifikasi akun perlu diselaraskan dengan kontrak API yang dipakai; jangan mengasumsikan seluruh status UI sudah tersedia sebagai endpoint.

## 5. Form pengajuan TAT

**Pengisi:** Pengaju aktif. Form dibagi menjadi informasi permohonan, identitas, perkara, bukti/lab, dan dokumen.

### 5.1 Informasi permohonan

| Input                    | Keterangan                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Jalur                    | Penangkapan tanpa BB, penangkapan dengan BB, P19, penuntutan, pemeriksaan pengadilan |
| Unit TAT tujuan          | Sesuai kewenangan                                                                    |
| Surat permohonan         | Nomor dan tanggal                                                                    |
| Tanggal pengajuan sumber | Tanggal pada dokumen; berbeda dari waktu kirim aplikasi                              |
| Pengaju                  | Nama petugas, instansi, jabatan, kontak, dasar kewenangan                            |
| Pengajuan terkait        | Hubungan dengan pengajuan ulang/lanjutan                                             |

Role Pengaju tidak membuka semua jalur secara otomatis. Kewenangan penyidik/JPU dan dasar perkara tetap diperiksa.

### 5.2 Identitas tersangka/terdakwa

| Input                                    | Keterangan                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| Nama                                     | Sesuai dokumen identitas                                                               |
| Jenis dan nomor identitas                | NIK/paspor/identitas yang diterima sesuai jalur                                        |
| Tempat/tanggal lahir                     | Jika hanya usia perkiraan tersedia, simpan dasar perkiraan                             |
| Jenis kelamin, kewarganegaraan           | Jangan menggunakan default yang mengarang fakta                                        |
| Alamat                                   | Alamat dan wilayah sesuai sumber                                                       |
| Nomor HP                                 | Kontak klien, bukan otomatis nomor penyidik                                            |
| Pendidikan, pekerjaan, status perkawinan | Dilengkapi sesuai tahap pemeriksaan                                                    |
| Nomor rekening                           | Ada dalam formulir sumber; pemilik, tujuan, dan kewajiban pengisiannya perlu kebijakan |
| Kondisi khusus                           | Status anak, kebutuhan pendamping, bahasa dan penerjemah                               |
| Asal data                                | Dokumen rujukan dan catatan ketidakpastian/perbedaan identitas                         |

Nomor rekening bukan field pembayaran layanan. TAT tidak diperlakukan sebagai layanan yang menagih klien.

### 5.3 Data perkara

| Input                     | Keterangan                                         |
| ------------------------- | -------------------------------------------------- |
| Referensi perkara         | Nomor perkara/LP/LKN sesuai dokumen                |
| Pasal                     | Daftar pasal yang disangkakan                      |
| Kronologi                 | Narasi kejadian dan sumber                         |
| Penerbitan SP Penangkapan | Tanggal/jam dan tingkat kepastian waktu            |
| Penangkapan aktual        | Terpisah dari tanggal penerbitan surat             |
| Penahanan                 | Tanggal, lokasi, dasar bila berlaku                |
| P19                       | Nomor/tanggal petunjuk atau BA koordinasi          |
| Penuntutan/pengadilan     | Dasar penuntutan atau penetapan hakim sesuai jalur |

Jika sumber hanya mencantumkan tanggal, jangan membuat jam fiktif sebagai fakta.

### 5.4 Barang bukti dan laboratorium

Keduanya berupa daftar berulang, bukan satu kolom narasi.

| Barang bukti                | Pemeriksaan laboratorium                      |
| --------------------------- | --------------------------------------------- |
| Jenis zat/barang dan uraian | Jenis spesimen: urine, rambut, darah, atau BB |
| Jumlah dan satuan           | Fasilitas pemeriksa                           |
| Berat bruto/netto bila ada  | Nomor/tanggal laporan                         |
| Dokumen sumber              | Tanggal ambil/periksa bila tersedia           |
| Referensi pemeriksaan       | Zat yang diuji, hasil tiap zat, file laporan  |

**Kontrol:** tidak diperiksa, hasil belum tersedia, dan negatif adalah keadaan berbeda. Jumlah wajib memiliki satuan.

### 5.5 Dokumen pengajuan

Checklist mengikuti jalur, bukan satu daftar universal.

| Jalur                  | Kelompok dokumen yang dipetakan                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Tanpa BB               | Permohonan, identitas, laporan informasi/LP/LKN, BA interogasi/pemeriksaan, SP penangkapan/tugas, urine, bukti elektronik bila ada        |
| Dengan BB              | Permohonan, identitas, LP/LKN, BAP, surat perintah terkait, BA penggeledahan/penyitaan, pemeriksaan lab, urine, bukti elektronik bila ada |
| P19                    | Dokumen penyidikan/perkara, penahanan, BB/lab, hasil urine/rambut, petunjuk P19 atau BA koordinasi, dokumen kondisional sesuai checklist  |
| Penuntutan             | Permohonan JPU, resume, lab, penetapan penyitaan, pemeriksaan rambut dan bukti elektronik sesuai sumber/kebijakan yang disahkan           |
| Pemeriksaan pengadilan | Permohonan Jaksa berdasarkan penetapan Hakim, dakwaan, resume, pelimpahan, penetapan persidangan, forensik komunikasi bila ada            |

Tabel ini ringkasan, bukan daftar untuk validasi final. Bab dan lampiran memiliki perbedaan tertentu, terutama jalur BB dan penuntutan; konfigurasi operasional harus ditelaah dan disahkan.

Per file simpan jenis, nomor/tanggal, penerbit, versi, pengunggah, waktu, hasil scan, dan keterkaitan checklist. Satu PDF dapat memenuhi beberapa item dengan referensi halaman.

**Output pengajuan:** nomor pelacakan, snapshot data, versi berkas, waktu kirim server, dan checklist Admin.

## 6. Verifikasi administrasi perkara

**Pengisi:** Admin. Pemeriksaan memakai versi yang dikirim, bukan draft yang sedang berubah.

| Input per item | Isi                                                     |
| -------------- | ------------------------------------------------------- |
| Ketersediaan   | Ada/tidak ada                                           |
| Keberlakuan    | Berlaku/tidak berlaku/belum dinilai beserta dasar       |
| Keterbacaan    | Terbaca/perlu penggantian                               |
| Kesesuaian     | Identitas, nomor, tanggal, perkara, BB/lab konsisten    |
| Hasil          | Valid, perlu koreksi, tidak valid, atau belum diperiksa |
| Koreksi        | Field/dokumen, alasan, perbaikan yang diminta           |
| Tanggapan      | Penjelasan Pengaju dan versi pengganti                  |

**Output:** daftar kekurangan atau hasil verifikasi untuk disposisi.

**Kontrol:** file lama tetap tersimpan. Revisi tidak mereset tenggat otomatis. Koreksi administratif bukan penolakan resmi; penolakan mengikuti kewenangan, alasan, dan dokumen yang sah.

## 7. Disposisi, penugasan, dan jadwal

**Pengisi:** Admin berdasarkan keputusan/mandat yang sah.

| Bagian    | Input                                                                 |
| --------- | --------------------------------------------------------------------- |
| Disposisi | Hasil, alasan, tanggal, Ketua, jabatan, dasar mandat, bukti keputusan |
| Tim Medis | Anggota, profesi, instansi, peran, bukti penugasan                    |
| Tim Hukum | Anggota, unsur instansi, jabatan, bukti penugasan                     |
| Jadwal    | Jenis sesi, mulai/selesai, zona waktu, lokasi/metode                  |
| Undangan  | Nomor/tanggal, penerima, file, status penyampaian                     |
| Perubahan | Jadwal baru, alasan, versi sebelumnya                                 |

**Output:** penugasan dan jadwal yang dapat dilihat pihak terkait.

**Kontrol:** pembuat keputusan eksternal dan Admin pencatat adalah identitas berbeda. Komposisi tim mengikuti ketentuan dan jalur, bukan sekadar memilih akun. Perubahan jadwal tidak menghapus riwayat atau mengulang SLA.

## 8. Penerimaan dan prasyarat pemeriksaan

**Pengisi:** petugas sesuai kewenangan masing-masing.

| Input                      | Tujuan                                                                   |
| -------------------------- | ------------------------------------------------------------------------ |
| Kehadiran/waktu kedatangan | Mencatat pelaksanaan nyata                                               |
| Pencocokan identitas       | Memastikan subjek sesuai permohonan                                      |
| Pengantar                  | Identitas dan kapasitas petugas                                          |
| Pendamping/wali            | Identitas, hubungan, dasar keterlibatan, kehadiran                       |
| Penerjemah                 | Nama, bahasa, penugasan, sesi, kehadiran                                 |
| Persetujuan/assent         | Form sesuai kondisi, pilihan, tanggal, pihak terkait, bukti tanda tangan |
| Pernyataan bebas biaya     | Data dan bukti sesuai template                                           |
| Kondisi khusus/darurat     | Temuan, tindakan/rujukan, alasan tahap rutin tertunda                    |

**Output:** kesiapan pemeriksaan atau kendala yang harus ditindaklanjuti.

**Kontrol:** persetujuan tidak dicentang otomatis. Keadaan darurat ditangani tenaga berwenang tanpa terhalang checklist aplikasi, dengan kejadian dan alasan tercatat.

## 9. Asesmen Medis

**Pengisi:** Tim Medis yang ditugaskan. Identitas dari pengajuan ditampilkan untuk dikonfirmasi, bukan diketik ulang tanpa hubungan.

### 9.1 Kelompok input

| Bagian                        | Input                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Sesi                          | Register/rekam medik bila ada, tanggal/waktu, pemeriksa, metode, sumber anamnesis, versi instrumen |
| Status medis                  | Penyakit, rawat inap, kondisi kronis, terapi, tes/status HIV dan hepatitis sesuai instrumen        |
| Pekerjaan/dukungan            | Status dan riwayat kerja, keterampilan, dukungan finansial dan kebutuhan hidup                     |
| Penggunaan zat                | Jenis zat, penggunaan 30 hari terakhir, lama sepanjang hidup, cara pakai                           |
| Riwayat terapi                | Rehab/terapi sebelumnya, overdosis, waktu dan penanganan                                           |
| Riwayat legal dalam instrumen | Jawaban kategori riwayat sesuai ASI; bukan pengganti asesmen Hukum                                 |
| Keluarga/sosial               | Situasi tinggal, hubungan, konflik, lingkungan penggunaan zat                                      |
| Psikiatris                    | Gejala, riwayat, periode kejadian, catatan pemeriksa sesuai instrumen                              |
| Pemeriksaan fisik             | Tekanan darah, nadi, frekuensi napas, suhu, sistem tubuh dan temuan                                |
| Penunjang                     | Jenis pemeriksaan, hasil tiap zat, tanggal, laporan sumber                                         |
| Ringkasan instrumen           | Penilaian domain dan catatan sesuai template                                                       |
| Diagnosis                     | Sistem/kode/nama, utama/penyerta, dasar penilaian                                                  |
| Usulan                        | Pemeriksaan lanjut, terapi, jenis layanan, durasi beserta satuan dan alasan                        |
| Pengesahan                    | Pemeriksa, penelaah/pihak sesuai formulir, bukti pengesahan                                        |

Gunakan instrumen yang disahkan, bukan form generik â€œzat + diagnosis + lama rehabâ€. Pemilihan ASI Wajib Lapor/Rehabilitasi Medis atau ASI Full mengikuti kebijakan medis; jangan otomatis mewajibkan keduanya diisi penuh untuk semua kasus.

### 9.2 Instrumen penempatan

Enam dimensi yang dicatat:

1. Intoksikasi/putus zat.
2. Kondisi medis.
3. Emosional, perilaku, dan kognitif.
4. Kesiapan berubah.
5. Kekambuhan.
6. Lingkungan.

Per dimensi simpan indikator, tingkat keparahan, penjelasan, pemeriksa, dan versi sumber. Simpan usulan tingkat layanan, pertimbangan klinis, konsultasi bila ada, serta penjelasan/tanggapan klien sesuai proses.

**Output Medis:** formulir, ringkasan temuan, diagnosis, penilaian penempatan, dan usulan untuk pembahasan.

**Kontrol finalisasi:** identitas/sesi cocok; pelaksana dan kewenangan jelas; item berlaku terjawab atau berkode sah; lab bersumber; diagnosis bukan nilai contoh; pengesahan sesuai prosedur. Skor tidak otomatis menentukan diagnosis, hospitalisasi, atau durasi rehab. Hasil final dikunci; koreksi melalui amendemen. Admin tidak mengedit substansi Medis.

## 10. Asesmen Hukum

**Pengisi:** Tim Hukum yang ditugaskan. Alurnya terpisah dari Medis.

| Bagian               | Input                                                                  |
| -------------------- | ---------------------------------------------------------------------- |
| Header               | Tanggal, tingkat TAT, tim                                              |
| Latar belakang       | Identitas, pendidikan, pekerjaan, penghasilan, catatan relevan         |
| Dokumen              | Daftar dokumen yang ditelaah dan versinya                              |
| Wawancara petugas    | Identitas penyidik/JPU, waktu, keterangan, referensi                   |
| Wawancara terperiksa | Waktu, pemeriksa, keterangan, kronologi                                |
| Riwayat hukum        | Tindak pidana, penahanan, sidang, vonis, Rutan/Lapas bila berlaku      |
| Zat/BB               | Jenis, jumlah, satuan, hasil lab terkait                               |
| Tujuan penguasaan    | Sendiri, bersama, titipan, dijual, lainnya sesuai pemeriksaan          |
| Perolehan            | Langsung, perantara, jaringan, aplikasi, lainnya                       |
| Pembayaran           | Cara, bukti, harga, frekuensi, untuk siapa                             |
| Penelusuran          | Sumber, kewenangan, waktu, temuan, bukti, keterbatasan                 |
| Kesimpulan           | Fakta, pasal, peran, indikasi jaringan dan dasar, usulan tindak lanjut |
| Pengesahan           | Anggota, identitas kedinasan, bukti tanda tangan sesuai prosedur       |

**Output Hukum:** formulir asesmen, fakta hukum, kesimpulan, dan usulan untuk pembahasan.

**Kontrol:** pisahkan wawancara petugas dan terperiksa; penyimpangan urutan dicatat jujur. Penelusuran tidak dilakukan bukan berarti tidak ada jaringan. Dugaan, keterangan, bukti, dan kesimpulan berbeda. Hasil final dikunci dan diperbaiki melalui amendemen.

## 11. Case Conference/Pembahasan Kasus TAT

**Data masuk:** versi final hasil Medis dan Hukum serta bukti relevan.

| Bagian              | Input                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| Pelaksanaan         | Jadwal, waktu aktual, tempat/metode                                                                      |
| Pimpinan/peserta    | Ketua, mandat, peserta, bukti kehadiran                                                                  |
| Bahan               | Versi asesmen Medis/Hukum dan dokumen terkait                                                            |
| Pembahasan          | Pokok diskusi, perbedaan pendapat, pertanyaan                                                            |
| Klarifikasi         | Bagian yang harus dilengkapi, tim penanggung jawab, hasil                                                |
| Hasil               | Kesimpulan terpadu dan alasan                                                                            |
| Rekomendasi         | Direkomendasikan/tidak/bersyarat sesuai keputusan; jenis layanan, penempatan, durasi/satuan bila berlaku |
| Tindak lanjut hukum | Kelanjutan proses dan kewajiban pelaporan                                                                |
| Dasar pencatatan    | Pembuat keputusan, tanggal, bukti konfirmasi/pengesahan, Admin pencatat                                  |

**Output:** catatan pembahasan dan hasil untuk penyusunan draft dokumen resmi, atau permintaan klarifikasi kepada tim terkait.

**Kontrol:** Admin mencatat, bukan memutuskan sendiri. Usulan Medis tidak otomatis menjadi keputusan final. Rapat selesai berbeda dari hasil resmi terbit. BA bertanda tangan dapat menjadi bukti final keputusan; jangan mewajibkan surat keputusan tambahan yang tidak ada sehingga menciptakan alur melingkar.

## 12. Dokumen hasil dan penyerahan

Isi dokumen ditarik dari snapshot hasil yang sama, bukan diketik ulang secara independen.

| Dokumen/proses                 | Data                                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| BA Pelaksanaan Asesmen Terpadu | Nomor, waktu/tempat, Ketua/tim dan mandat, dasar permohonan, identitas, hasil Medis/Hukum, fakta, kesimpulan, rekomendasi, tanda tangan |
| Surat Jawaban Permohonan       | Nomor/tanggal, klasifikasi, penerima, rujukan, identitas, kesimpulan, rekomendasi, tindak lanjut, lampiran, pengesah                    |
| Pemeriksaan hasil              | Versi, konsistensi isi, penandatangan dan mandat, bukti tanda tangan, pemeriksa                                                         |
| Penyerahan                     | Penerima/instansi, kanal, waktu kirim, status, waktu diterima, bukti                                                                    |

**Output:** paket hasil resmi dan bukti penerimaan.

**Kontrol:** draft, menunggu tanda tangan, diterbitkan, diserahkan, dan diterima merupakan keadaan berbeda. Simpan file final asli yang diarsipkan, bukan regenerasi dari data terbaru. Checksum membuktikan integritas file, bukan tanda tangan tersertifikasi. Pengaju tidak otomatis menerima semua catatan mentah medis.

## 13. Pelaksanaan rehab dan kontrol

**Pengisi:** Pengaju berdasarkan bukti fasilitas. **Pemeriksa administratif:** Admin. Tidak semua perkara masuk rehabilitasi; tindak lanjut mengikuti hasil sah.

| Bagian                 | Input                                                                      |
| ---------------------- | -------------------------------------------------------------------------- |
| Dasar                  | Versi rekomendasi yang dilaksanakan                                        |
| Fasilitas              | Nama, jenis, alamat, kontak                                                |
| Koordinasi             | Tanggal, hasil komunikasi/penerimaan, kendala                              |
| Serah terima/admisinya | Waktu aktual, pengantar, penerima, bukti masuk                             |
| Rencana kontrol        | Jadwal, kegiatan, sumber rencana dari pihak berwenang                      |
| Realisasi              | Tanggal aktual, kegiatan, kehadiran/status pelaksanaan                     |
| Laporan                | Ringkasan yang boleh dibagikan, laporan fasilitas, penanggung jawab sumber |
| Kendala                | Penundaan, ketidakhadiran terkonfirmasi, perubahan kondisi, tindak lanjut  |
| Verifikasi             | Status pemeriksaan Admin, catatan, klarifikasi, waktu/pemeriksa            |
| Penyelesaian           | Tanggal, keterangan pihak berwenang, bukti, tindak lanjut berikutnya       |

**Output:** riwayat pelaksanaan, bukti, status verifikasi, dan daftar pekerjaan lanjutan.

**Kontrol:** Admin memverifikasi laporan, bukan menyatakan pulih. Jadwal klinis, perubahan terapi, dan penyelesaian layanan ditentukan pihak berwenang. Jangan membuat durasi, frekuensi tes, atau sanksi otomatis sebagai ketentuan JUKNIS. Belum ada laporan tidak sama dengan klien mangkir. Fasilitas penuh harus dicatat dan dieskalasikan, bukan mengganti penempatan diam-diam.

Pisahkan kontrol klinis dari monitoring administratif. Modul ini bukan rekam medis lengkap fasilitas rehab.

## 14. Model hubungan dan kontrol lintas tahap

### 14.1 Satu pengajuan, beberapa record yang terhubung

Gunakan pengajuan sebagai penghubung identitas versi perkara, dokumen, verifikasi, disposisi, penugasan, asesmen, pembahasan, hasil resmi, dan tindak lanjut. Jangan membuat satu form raksasa yang bisa diedit semua role.

Setiap hasil final menunjuk versi sumbernya. Koreksi alamat hari ini tidak mengubah BA yang telah ditandatangani kemarin.

### 14.2 Metadata minimal

| Record              | Metadata rancangan                                                              |
| ------------------- | ------------------------------------------------------------------------------- |
| Semua record proses | ID, pengajuan terkait, pembuat, waktu server, status, versi                     |
| Revisi              | Versi sebelumnya, alasan, pengubah, waktu                                       |
| Keputusan eksternal | Pengambil keputusan, kapasitas/mandat, waktu sumber, bukti, pencatat            |
| Dokumen             | ID/versi, jenis, nama asli, MIME, ukuran, lokasi privat, checksum, scan, izin   |
| Asesmen             | Pemeriksa, sesi, template/versi, jawaban, referensi bukti, finalisasi/amendemen |
| Tindak lanjut       | Rencana, realisasi, sumber bukti, verifikator, kendala dan penanggung jawab     |

### 14.3 Kontrol yang harus ada

1. Otorisasi backend berdasarkan role, organisasi, penugasan, status, dan kategori data.
2. Versi immutable untuk berkas, asesmen final, dan hasil resmi.
3. Nilai kosong, tidak diketahui, tidak berlaku, menolak menjawab, dan nol dibedakan.
4. Deadline memakai waktu sumber yang benar; revisi/jadwal ulang tidak mereset otomatis.
5. Notifikasi tidak membocorkan diagnosis atau identitas sensitif.
6. Status akun, permohonan, penyerahan hasil, dan tindak lanjut disimpan terpisah.
7. Pengingat keterlambatan menghasilkan pekerjaan tindak lanjut, bukan keputusan klinis/sanksi otomatis.
8. Akses/unduhan data sensitif dan perubahan penting dicatat dalam audit.

## 15. Referensi dan cakupan

- [JUKNIS TAT 2025](https://t90182123892.p.clickup-attachments.com/t90182123892/fa5b234e-46f1-4182-8b83-131e7d1bc232/JUKNIS%20TAT%202025.pdf): sumber prosedur dan formulir.
- [Rancangan lengkap flow, data, API, dan cetak](https://u300713116.p.clickup-attachments.com/u300713116/edecad2f-d5b0-5a7b-8d30-f68403798893/E-TAT-Rancangan-Lengkap-Flow-Data-API-Cetak.md?view=open): spesifikasi rinci terdahulu.
- [Dokumentasi proyek E-TAT](https://app.clickup.com/90182123892/docs/2kzmc0bm-1358): titik masuk dokumentasi.

Rujukan utama pada JUKNIS: checklist pengajuan PDF 148â€“152; instrumen Medis PDF 154â€“170; Hukum PDF 171â€“173; instrumen penempatan PDF 175â€“183; BA PDF 184â€“188; Surat Jawaban PDF 189â€“190; pernyataan bebas biaya PDF 191. Nomor tersebut adalah halaman penampil PDF.

Dokumen ini fokus pada flow dan input/output. Ia tidak menggantikan transkripsi seluruh item instrumen, kontrak API lengkap, pengesahan SOP, atau validasi operasional oleh pemilik layanan.
