/**
 * Types and Interfaces for e-TAT (Sistem Pengelolaan Layanan Tim Asesmen Terpadu)
 * Sesuai rancangan.md v1.1 — 4 Role Login: ADMIN, MEDIS, HUKUM, PENGAJU
 *
 * Role login: PENGAJU (Penyidik/Pemohon), ADMIN (Sekretariat), MEDIS, HUKUM
 * Stream assessment: MEDICAL, LEGAL
 * Referensi: rancangan.md section 1-9
 */

// =====================================================================
// EMPAT ROLE LOGIN KANONIS (rancangan.md)
// =====================================================================
export type UserRole =
  | 'PENGAJU'       // Penyidik Polri / BNN / Jaksa (pemohon)
  | 'ADMIN'         // Sekretariat TAT (administrasi, disposisi, penerbitan)
  | 'MEDIS'         // Asesor Medis & Psikologis (dokter/psikolog)
  | 'HUKUM'         // Asesor Hukum (penyidik/jaksa/ahli hukum dalam tim)
  | 'KOORDINATOR'   // Koordinator TAT
  | 'REHABILITASI'  // Fasilitas Rehabilitasi
  | 'pengaju'
  | 'admin'
  | 'sekretariat'
  | 'medis'
  | 'hukum'
  | 'koordinator'
  | 'pimpinan'
  | 'rehabilitasi';


export interface UserProfile {
  id: string;
  name: string;
  nip: string;
  role: UserRole;
  agency: string; // e.g., 'Polresta Samarinda', 'BNN Provinsi Kalimantan Timur', 'Balai Rehabilitasi Tanah Merah'
  avatar?: string;
  email: string;
  phone: string;
  position?: string;
}

export interface RegistrasiPengguna {
  id: string;
  nomorRegistrasi: string; // e.g. REG-TAT/2026/POLRES-001
  tanggalDaftar: string;
  namaLengkap: string;
  pangkat: string; // e.g. 'KOMBES POL', 'AKBP', 'KOMPOL', 'AKP', 'IPTU', 'IPDA', 'AIPDA', 'BRIPKA', 'PNS'
  nrp: string; // NRP atau NIP
  jabatan: string; // e.g. 'Kapolres', 'Wakapolres', 'Kasat Resnarkoba', 'Kanit Idik', 'Penyidik Pembantu', 'Kepala BNNK'
  instansi: string; // e.g. 'Polresta Samarinda', 'Polres Kutai Kartanegara', 'BNNK Samarinda'
  kategoriInstansi: 'Polres / Polresta' | 'Polda' | 'Polsek' | 'BNNK / BNNP' | 'Kejaksaan' | 'Lainnya';
  wilayahHukum: string; // Samarinda, Balikpapan, Kukar, dll
  alamatKantor: string;
  email: string;
  phone: string;
  teleponKantor?: string;
  password?: string;
  
  // Peran dalam Sistem E-TAT
  peranSistem?: UserRole | string;
  spesialisasiTugas?: string[];
  
  // Dokumen & Foto
  fotoKtpUrl: string;
  fotoKtpName: string;
  fotoKtaUrl: string;
  fotoKtaName: string;
  suratPenunjukanUrl?: string;
  suratPenunjukanName?: string;
  
  // Status Persetujuan Admin
  status: 'pending' | 'approved' | 'rejected';
  catatanAdmin?: string;
  approvedAt?: string;
  approvedBy?: string | { id?: string; name?: string; role?: string };
}

// =====================================================================
// STATUS FLOW UTAMA — sesuai rancangan.md Section 7 (Kanonis)
// =====================================================================
export type ApplicationStatus =
  | 'DRAFT'                            // Pengaju: simpan, periksa, kirim
  | 'SUBMITTED'                        // Admin: mulai verifikasi
  | 'ADMIN_REVIEW'                     // Admin: minta koreksi / selesai telaah
  | 'NEEDS_CORRECTION'                 // Pengaju: tanggapi dan kirim ulang
  | 'AWAITING_DISPOSITION'             // Admin: catat keputusan Ketua dengan bukti
  | 'APPROVED'                         // Admin: registrasi, penugasan, jadwal
  | 'SCHEDULED'                        // Tim: mulai sesi sesuai prasyarat
  | 'ASSESSMENT_ACTIVE'                // Tim: simpan/finalisasi
  | 'READY_FOR_CONFERENCE'             // Admin: catat pembahasan dilaksanakan
  | 'CONFERENCE_HELD'                  // Admin: klarifikasi / catat hasil untuk draf
  | 'CONFERENCE_CLARIFICATION_REQUIRED' // Tim: jawaban/amendemen
  | 'OUTCOME_RECORDED_FOR_DRAFT'       // Admin: buat draf keluaran
  | 'AWAITING_SIGNED_OUTPUTS'          // Admin: unggah, periksa, terbitkan
  | 'RESULTS_ISSUED'                   // Hasil terbit; substatus berubah
  | 'REJECTED'                         // Terminal: ditolak
  | 'OUT_OF_SCOPE_REFERRED';           // Terminal: dirujuk non-TAT

export type AssessmentStatus =
  | 'NOT_STARTED'
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'FINAL'
  | 'AMENDMENT_REQUIRED'
  | 'SUPERSEDED';

export type DeliveryStatus =
  | 'NOT_APPLICABLE'
  | 'NOT_ISSUED'
  | 'ISSUED_NOT_DELIVERED'
  | 'PARTIALLY_DELIVERED'
  | 'DELIVERED'
  | 'ACKNOWLEDGED';

export type FollowupStatus =
  | 'NOT_APPLICABLE_YET'
  | 'NOT_APPLICABLE'
  | 'NOT_YET_REPORTED'
  | 'REPORTED_PENDING_VERIFICATION'
  | 'VERIFIED_IMPLEMENTED'
  | 'VERIFIED_NOT_IMPLEMENTED'
  | 'CLARIFICATION_REQUIRED';

// === Backward Compat: type lama (masih dipakai komponen lama) ===
// 4 Kelompok Status Terpisah (lama)
export type StatusProsesUtama =
  | 'draf'
  | 'diajukan'
  | 'verifikasi_berkas'
  | 'perlu_perbaikan'
  | 'penugasan_jadwal'
  | 'asesmen_berlangsung'
  | 'siap_pleno'
  | 'pembahasan_pleno'
  | 'pengesahan_rekomendasi'
  | 'rekomendasi_terbit'
  | 'selesai_tindak_lanjut';

export type StatusMedisHukum =
  | 'belum_dimulai'
  | 'sedang_berlangsung'
  | 'menunggu_lab_atau_info'
  | 'perlu_klarifikasi'
  | 'siap_dibahas';

export type StatusDokumen =
  | 'draf'
  | 'diperiksa'
  | 'menunggu_pengesahan'
  | 'resmi_terbit'
  | 'digantikan_atau_ditarik';

export type StatusTindakLanjut =
  | 'belum_dikonfirmasi'
  | 'sedang_dikoordinasikan'
  | 'terjadwal'
  | 'terlaksana'
  | 'terhambat';

// Kelengkapan Berkas Administrasi
export type StatusVerifikasiDokumen =
  | 'sesuai'
  | 'perlu_perbaikan'
  | 'belum_tersedia'
  | 'tidak_berlaku'
  | 'belum_diperiksa'
  | 'belum_diunggah';

export interface DokumenPersyaratan {
  id: string;
  nama: string;
  wajib: boolean;
  kode?: string;
  keterangan?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  statusVerifikasi: StatusVerifikasiDokumen;
  catatanKoreksi?: string;
  versi: number;
}

export interface BarangBukti {
  id: string;
  jenisZat: string; // e.g. "Metamfetamina (Sabu)", "Ganja", "MDMA (Ekstasi)"
  beratKotorGram?: number;
  beratBersihGram: number;
  statusUjiLab: 'belum_uji' | 'proses_lab' | 'positif' | 'negatif';
  nomorSuratLab?: string;
  tanggalSuratLab?: string;
  keterangan?: string;
  fotoBarangBuktiUrl?: string;
  fotoUjiLabUrl?: string;
}

// Terperiksa (Orang yang diperiksa - dipisahkan dari Perkara dan Permohonan)
export interface Terperiksa {
  id: string;
  namaLengkap: string;
  alias?: string;
  nik?: string;
  isNikVerified: boolean;
  statusIdentitasKhusus?: 'dewasa' | 'normal' | 'tanpa_nik' | 'anak_berhadapan_hukum' | 'warga_asing' | 'perlu_penerjemah';
  tempatLahir: string;
  tanggalLahir: string;
  usia: number;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  pekerjaan: string;
  alamatKtp: string;
  alamatDomisili: string;
  namaWaliPendamping?: string;
  kontakWali?: string;
}

// Prasyarat Pemeriksaan & Penerimaan Subjek (Section 8 flow.md)
export interface PrasyaratPemeriksaan {
  id?: string;
  permohonanId?: string;

  // 1. Checklist Kehadiran & Kedatangan Subjek
  waktuKedatangan?: string;
  kehadiranSubjek: boolean;
  pencocokanIdentitas: boolean;
  catatanPencocokanIdentitas?: string;

  // 2. Petugas Pengantar & Pendamping/Wali Hadir
  namaPengantar?: string;
  instansiPengantar?: string;
  jabatanPengantar?: string;
  kehadiranPengantar: boolean;

  kehadiranPendamping: boolean;
  namaPendamping?: string;
  hubunganPendamping?: string;
  dasarKeterlibatan?: string;
  kontakPendamping?: string;

  // 3. Penerjemah
  membutuhkanPenerjemah: boolean;
  namaPenerjemah?: string;
  bahasaPenerjemah?: string;
  kehadiranPenerjemah: boolean;
  nomorPenugasanPenerjemah?: string;

  // 4. Form Persetujuan / Assent (Informed Consent)
  sudahDisetujui: boolean;
  jenisFormPersetujuan?: string;
  tanggalPersetujuan?: string;
  penandatanganPersetujuan?: string;
  dokumenPersetujuanUrl?: string;

  // 5. Pernyataan Bebas Biaya
  pernyataanBebasBiaya: boolean;
  tanggalPernyataanBebasBiaya?: string;
  dokumenBebasBiayaUrl?: string;

  // Catatan Tambahan / Kondisi Khusus
  kondisiKhususDarurat: boolean;
  catatanKondisiKhusus?: string;
  tindakanDaruratRujukan?: string;

  petugasPenerimaId?: string;
  petugasPenerima?: {
    id: string;
    name: string;
    role: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Perkara Hukum Terkait
export interface PerkaraHukum {
  id: string;
  nomorLaporanPolisi: string;
  tanggalLp: string;
  instansiPenyidik: string;
  namaPenyidik: string;
  nomorHpPenyidik: string;
  pasalDipersangkakan: string; // e.g., "Pasal 127 ayat (1) atau Pasal 114 ayat (1) UU No. 35/2009"
  tempatKejadianPerkara: string;
  tanggalWaktuPenangkapan: string;
  kronologiSingkat: string;
  barangBuktiList: BarangBukti[];
}

// Asesmen Medis & Psikologis Terstruktur
export interface AsesmenMedis {
  id: string;
  asesorId: string;
  asesorNama: string;
  tanggalPemeriksaan: string;
  status: StatusMedisHukum;
  
  // Riwayat Penggunaan
  riwayatZat: {
    jenisZat: string;
    caraPakai: string; // Hisap, Telan, Suntik
    frekuensi: string; // Setiap hari, 2-3x seminggu, Situasional
    lamaPemakaianBulan: number;
    terakhirPakai: string;
  }[];
  
  // Pemeriksaan Fisik & Jiwa
  kondisiFisik: string;
  tekananDarah: string;
  denyutNadi: string;
  tandaBekasSuntikan: boolean;
  komorbiditasMedis: string; // Penyakit penyerta (Hepatitis, HIV, dll)
  kondisiPsikologis: string; // Cemas, Depresi, Halusinasi, Stabil
  
  // Hasil Laboratorium Toksikologi Urin
  hasilUrin: {
    parameter: string; // AMP, MET, THC, BZO, MOP
    hasil: 'Positif' | 'Negatif';
  }[];
  
  // Instrumen ASSIST / ASI
  instrumen: 'ASSIST' | 'ASI';
  skorInstrumen: number;
  tingkatRisikoInstrumen: 'Rendah' | 'Sedang' | 'Tinggi';
  
  // Kesimpulan & Usulan Layanan
  diagnosisKlinisIcd: string; // e.g., "F15.2 Sindrom Ketergantungan Stimulansia"
  interpretasiKlinis: string;
  kebutuhanRawat: 'Rawat Inap' | 'Rawat Jalan' | 'Detoksifikasi Medis Darurat' | 'Tidak Memerlukan Rawat';
  durasiUsulanBulan: number;
  catatanKhusus?: string;
  permintaanPemeriksaanTambahan?: string;
  terakhirDiperbarui: string;
}

// Asesmen Hukum Berbasis Argumentasi & Sumber
export interface AsesmenHukum {
  id: string;
  asesorId: string;
  asesorNama: string;
  tanggalTelaah: string;
  status: StatusMedisHukum;
  
  // Riwayat Hukum Terverifikasi vs Dugaan
  riwayatResidivisme: {
    pernahDitangkap: boolean;
    keteranganPerkaraLalu?: string;
    terverifikasiDatabase: boolean;
  };
  
  // Telaah Fakta dan Peran
  analisisPeran: 'Penyalahguna Murni' | 'Korban Penyalahgunaan' | 'Pecandu dengan Kepemilikan Terbatas' | 'Indikasi Pengedar / Jaringan' | 'Belum Dapat Disimpulkan';
  argumentasiPeran: string;
  faktaPendukung: string[];
  catatanBelumTerverifikasi: string; // Fakta yang belum cukup bukti
  analisisBarangBukti: string; // Analisis berat SEMA 04/2010 atau batasan gramatur
  
  // Kesimpulan Hukum
  kesimpulanHukum: string;
  rekomendasiHukum: 'Proses Hukum Dilanjutkan dengan Rehabilitasi' | 'Proses Hukum Dilanjutkan Tanpa Rehabilitasi' | 'Penerapan Keadilan Restoratif / Diversi' | 'Perlu Pendalaman Penyidikan';
  catatanKlarifikasi?: string;
  terakhirDiperbarui: string;
}

// Sidang Pleno TAT
export interface SidangPleno {
  id: string;
  tanggalPleno: string;
  waktu: string;
  tempat: string;
  nomorBeritaAcara: string;
  pimpinanPleno: string;
  daftarHadir: {
    nama: string;
    peran: string;
    instansi: string;
    hadir: boolean;
  }[];
  pokokBahasan: string;
  catatanPerbedaanPendapat?: string; // Dissenting opinions jika ada
  kesepakatanRekomendasi: string;
  jenisRekomendasiFinal: 'Rehabilitasi Rawat Inap' | 'Rehabilitasi Rawat Jalan' | 'Lanjut Proses Hukum Tanpa Rehab' | 'Pemeriksaan Tambahan';
  durasiRehabBulan?: number;
  fasilitasRujukanUsulan?: string;
  statusPleno: 'terjadwal' | 'berlangsung' | 'selesai_sepakat' | 'butuh_klarifikasi_tambahan';
  fileBeritaAcaraSigned?: string;
}

// Pengesahan Multi-Pihak
export interface PengesahDokumen {
  id: string;
  nama: string;
  jabatan: string;
  instansi: string;
  status: 'menunggu' | 'disahkan' | 'ditolak_koreksi';
  tanggalPengesahan?: string;
  catatanKoreksi?: string;
  tandaTanganDigitalHash?: string;
}

export interface RekomendasiResmi {
  nomorSurat: string;
  tanggalTerbit: string;
  dibuatOleh: string;
  ringkasanMedis: string;
  ringkasanHukum: string;
  rekomendasiFinalText: string;
  daftarPengesah: PengesahDokumen[];
  isLengkapPengesahan: boolean;
  qrVerificationCode: string;
  filePdfSimulasiUrl: string;
  buktiPenerimaanPengaju?: {
    diterimaOleh: string;
    tanggalDiterima: string;
    nomorTandaTerima: string;
  };
}

// Pemantauan Rujukan & Tindak Lanjut
export interface TindakLanjutLayanan {
  id: string;
  jenisTindakLanjut: 'Rujukan Rehabilitasi' | 'Proses Peradilan / Pengadilan' | 'Diversi / Restorative Justice' | 'Lainnya';
  namaFasilitasTujuan?: string;
  kontakFasilitas?: string;
  statusRujukan: 'belum_kirim' | 'terkirim' | 'diterima_fasilitas' | 'kapasitas_penuh' | 'klien_mulai_layanan' | 'batal_kendala' | 'sedang_dikoordinasikan';
  tanggalRujukanDikirim?: string;
  tanggalKonfirmasiFasilitas?: string;
  tanggalMulaiLayanan?: string;
  hambatanPelaksanaan?: string; // e.g. "Kapasitas bed rawat inap penuh hingga akhir bulan", "Kendala biaya transportasi"
  penanggungJawabTindakLanjut: string;
  buktiPelaksanaanUrl?: string;
  statusProsesHukumTerkait?: string; // Catatan apakah penyidikan/sidang tetap lanjut
  terakhirDiperbarui: string;
}


// =====================================================================
// MODUL: TINDAK LANJUT & MONITORING REHABILITASI PASCA TAT
// Sesuai JUKNIS: memisahkan administrasi dari klinis
// Tenaga kesehatan fasilitas ≠ Tim Medis TAT
// =====================================================================

// --- STEP 1: PELAKSANAAN REHAB (diisi Pengaju setelah hasil TAT terbit) ---
export interface PelaksanaanRehab {
  id: string;
  // Referensi TAT
  nomorRekomendasiTAT: string;           // Nomor surat rekomendasi TAT yang dilaksanakan
  jenisLayananSesuaiRekomendasi: string; // Sesuai isi rekomendasi TAT (bukan diubah)
  // Fasilitas tujuan
  namaFasilitasTujuan: string;
  alamatFasilitas: string;
  kontakPenanggungJawabFasilitas: string;
  namaPenanggungJawabFasilitas: string;
  // Koordinasi penerimaan
  tanggalKoordinasiPenerimaan: string;
  hasilKoordinasiPenerimaan: string;     // Diterima / ditunda / perlu jadwal ulang
  catatanKoordinasi?: string;
  // Serah terima aktual
  tanggalSerahTerimaAktual?: string;
  identitasPihakMenyerahkan?: string;    // Nama + jabatan
  identitasPihakMenerima?: string;       // Nama + jabatan dari fasilitas
  fileBaSerahTerimaUrl?: string;
  // Masuk layanan
  tanggalMasukLayananTerkonfirmasi?: string;
  // Kendala
  adaKendala: boolean;
  kendala?: string;                      // Kapasitas penuh, transportasi, dll
  perbedaanDariRekomendasi?: string;     // Jika ada perbedaan pelaksanaan
  // Status & audit
  statusPelaksanaan: 'perlu_konfirmasi' | 'koordinasi_berjalan' | 'serah_terima_selesai' | 'klien_mulai_layanan' | 'terkendala_eskalasi';
  diisiOleh: string;
  kapasitasPengisi: string;              // Penyidik pengirim / pendamping
  tanggalDiisi: string;
  statusVerifikasiAdmin?: 'belum_diperiksa' | 'terverifikasi' | 'perlu_klarifikasi';
  catatanVerifikasiAdmin?: string;
  tanggalVerifikasiAdmin?: string;
  diverifikasiOleh?: string;
}

// --- STEP 2: LAPORAN KONTROL dari FASILITAS (diterima, bukan dibuat oleh Tim TAT) ---
export type JenisLaporanKontrol =
  | 'Laporan Kemajuan Periodik'
  | 'Laporan Kunjungan Kontrol'
  | 'Laporan Evaluasi Klinis'        // dari fasilitas / tenaga kesehatan berwenang
  | 'Laporan Wajib Lapor'
  | 'Laporan Kejadian Khusus'
  | 'Laporan Akhir Layanan';

export type StatusLaporanKontrol =
  | 'diterima_belum_diperiksa'
  | 'admin_terverifikasi'             // Admin sudah verifikasi kelengkapan administratif
  | 'diteruskan_untuk_telaah'         // Jika perlu telaah klinis oleh Medis yang ditugaskan
  | 'telaah_klinis_selesai'
  | 'perlu_klarifikasi'
  | 'laporan_final';

export interface LaporanKontrol {
  id: string;
  // Identitas laporan
  jenisLaporan: JenisLaporanKontrol;
  tanggalKegiatanSebenarnya: string;   // Bukan tanggal diunggah
  namaFasilitasPelapor: string;
  nomorLaporanFasilitas?: string;      // Nomor/referensi dari fasilitas
  tanggalLaporanFasilitas?: string;
  namaPenerbitLaporan: string;         // Nama tenaga kesehatan / petugas penerbit
  kapasitasPenerbit: string;           // Dokter, konselor, perawat, dll
  // Isi laporan
  statusPelaksanaanBerdasarkanBukti: 'terlaksana' | 'tidak_terlaksana' | 'terlaksana_sebagian' | 'tidak_terkonfirmasi';
  ringkasanAdministratif: string;      // Ringkasan isi laporan yang relevan secara admin
  catatanKendala?: string;
  rencanaBerdasarkanLaporan?: string;  // Rencana berikutnya sesuai laporan fasilitas
  fileBuktiUrl?: string;
  // Siapa mengunggah
  diunggahOleh: string;
  kapasitasPengunggah: string;         // Pengaju / Admin
  tanggalDiunggah: string;
  // Status verifikasi
  statusAdmin: 'belum_diperiksa' | 'terverifikasi' | 'perlu_klarifikasi';
  catatanAdmin?: string;
  diverifikasiOleh?: string;
  tanggalVerifikasi?: string;
  // Telaah klinis (opsional, hanya jika ada penugasan)
  perluTelaahKlinis?: boolean;
  statusTelaahKlinis?: 'belum_ditelaah' | 'sedang_ditelaah' | 'selesai';
  penugasanMedis?: string;             // Nama Medis yang ditugaskan (jika ada)
  catatanTelaahKlinis?: string;        // Hanya telaah dokumen, bukan rekam medis
  tanggalTelaahKlinis?: string;
}

// --- STEP 3: BUKTI WAJIB LAPOR (terpisah dari kontrol medis) ---
// JUKNIS: wajib lapor = tersangka/terdakwa kepada penyidik, bukan laporan klinis
export interface BuktiWajibLapor {
  id: string;
  tanggalRencanaWajibLapor?: string;      // Rencana Wajib Lapor (diisi saat menjadwalkan)
  tanggalPelaporanAktual?: string;        // Tanggal Kejadian Sebenarnya (diisi Pengaju/Penyidik setelah wajib lapor terjadi)
  tanggalWajibLapor: string;
  waktuInputSistem?: string;             // Catatan waktu otomatis simpan oleh sistem
  namaPenyidikPenerima: string;          // Penyidik / JPU yang menerima laporan
  instansiPenyidik: string;              // Instansi / tempat atau kanal pelaporan
  kegiatanRehabTerkait?: string;       // Laporan rehab mana yang terkait
  kanal: 'langsung' | 'surat' | 'digital' | 'melalui_pengaju';
  buktiPenerimaanUrl?: string;           // Link / dokumen bukti yang tersedia
  catatanKendala?: string;
  statusKonfirmasi: 'diajukan' | 'dikonfirmasi_penyidik' | 'belum_dikonfirmasi';
  statusVerifikasiAdmin?: 'belum_diperiksa' | 'terverifikasi' | 'perlu_perbaikan';
  catatanAdmin?: string;
  diunggahOleh: string;
  tanggalDiunggah: string;
}

// --- STEP 4: AKHIR LAYANAN REHAB (diisi Pengaju, berdasarkan dokumen fasilitas) ---
export interface AkhirLayananRehab {
  id: string;
  tanggalAkhirLayananAktual: string;
  hasilSesuaiDokumenFasilitas: string;  // Keterangan dari fasilitas, bukan penilaian Tim TAT
  statusAkhir: 'selesai_program' | 'dipindahkan' | 'berhenti_sebelum_selesai';
  namaFasilitas: string;
  pihakPenerbitKeterangan: string;      // Fasilitas / tenaga kesehatan yang menerbitkan
  fileSuratAkhirLayananUrl?: string;
  rencanaLanjutanDariFasilitas?: string;
  fasilitasPascarehabJikaAda?: string;
  jadwalLanjutanBerdasarkanRencana?: string;
  buktiWajibLaporPascaRawatInap?: string;  // Jika berlaku (rawat inap)
  diisiOleh: string;
  kapasitasPengisi: string;
  tanggalDiisi: string;
  statusVerifikasiAdmin?: 'belum_diperiksa' | 'terverifikasi' | 'perlu_klarifikasi';
  diverifikasiOleh?: string;
  catatanVerifikasiAdmin?: string;
}

// --- CONTAINER UTAMA: Monitoring Tindak Lanjut Rehab ---
// Menggantikan PengawasanKlien yang sebelumnya mencampur klinis dan admin
export interface MonitoringTindakLanjut {
  id: string;
  // Referensi
  nomorRekomendasi: string;
  // Step 1: Pelaksanaan
  pelaksanaanRehab?: PelaksanaanRehab;
  // Step 2: Laporan kontrol (array, bisa banyak selama masa rehab)
  laporanKontrolList: LaporanKontrol[];
  // Step 3: Bukti wajib lapor
  buktiWajibLaporList: BuktiWajibLapor[];
  // Step 4: Akhir layanan
  akhirLayanan?: AkhirLayananRehab;
  // Status keseluruhan tindak lanjut
  statusMonitoring: 'menunggu_pelaksanaan' | 'berjalan' | 'terkendala' | 'selesai' | 'tidak_terlaksana';
  // Catatan eskalasi
  eskalasi?: {
    tanggal: string;
    alasan: string;
    diajukanOleh: string;
    ditujukanKepada: string;
    statusEskalasi: 'aktif' | 'selesai';
  }[];
  dibuatOleh: string;
  tanggalDibuat: string;
  terakhirDiperbarui: string;
}

// =====================================================================
// BACKWARD COMPAT: PengawasanKlien dipertahankan untuk komponen lama
// Idealnya dimigrasikan ke MonitoringTindakLanjut di sprint berikutnya
// =====================================================================
export interface SuratPeringatanKlien {
  nomorSp: string;
  tingkatSp: 'SP-1 (Peringatan Awal)' | 'SP-2 (Peringatan Keras)' | 'SP-3 (Peringatan Terakhir / Rekomendasi Pencabutan)' | string;
  tanggalSp: string;
  alasan: string;
  diterbitkanOleh: string;
}

export interface TesUrinBerkala {
  id: string;
  tanggalTes: string;
  tahapKe: number;
  jenisPemeriksaan: 'Terjadwal' | 'Acak (Random)' | string;
  parameter?: string[];
  hasil: 'Negatif' | 'Positif' | string;
  keterangan?: string;
  petugasPemeriksa: string;
}

export interface JurnalPengawasan {
  id: string;
  tanggal: string;
  jenisKegiatan: 'Wajib Lapor Mingguan' | 'Konseling Individual' | 'Konseling Kelompok' | 'Kunjungan Rumah (Home Visit)' | 'Tes Urin' | string;
  statusKehadiran: 'Hadir' | 'Mangkir / Absen' | 'Izin Resmi' | string;
  catatanPerkembangan: string;
  petugasPengawas: string;
  instansiPengawas?: string;
}

export interface PengawasanKlien {
  id: string;
  statusKepatuhan: 'sangat_patuh' | 'patuh' | 'dalam_peringatan' | 'tidak_patuh_mangkir' | 'selesai_program';
  modalitasLayanan: 'Rawat Jalan' | 'Rawat Inap' | 'Bina Lanjut Pascarehab';
  durasiBulan: number;
  tanggalMulai: string;
  tanggalTargetSelesai: string;
  tanggalKontrolBerikutnya?: string;
  waktuKontrolBerikutnya?: string;
  catatanKontrolBerikutnya?: string;
  instansiPelaksanaRehab: string;
  konselorPendamping: string;
  penyidikPengawas: string;
  petugasBapas?: string;
  totalSesiWajib: number;
  sesiTerselesaikan: number;
  jumlahMangkir: number;
  suratPeringatanList: SuratPeringatanKlien[];
  riwayatTesUrinBerkala: TesUrinBerkala[];
  jurnalPengawasan: JurnalPengawasan[];
  rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi' | 'Pencabutan Hak RJ / Lanjut Sidang' | 'Diusulkan Surat Keterangan Selesai';
  checklistAdmisi?: {
    id: string;
    kode: string;
    nama: string;
    checked: boolean;
    catatan?: string;
    tanggalVerifikasi?: string;
    verifikator?: string;
  }[];
  suratKeteranganSelesai?: {
    nomorSurat: string;
    tanggalTerbit: string;
    predikat: 'Selesai Baik (Pulih Produktif)' | 'Selesai Cukup' | 'Gagal / Dikeluarkan';
    ditandatanganiOleh: string;
  };
}

// Klarifikasi Terarah (Q&A antar pemangku kepentingan)
export interface Klarifikasi {
  id: string;
  dariNama: string;
  dariPeran: UserRole;
  kepadaPeran: UserRole;
  pertanyaan: string;
  lampiran?: string;
  tanggalTanya: string;
  jawaban?: string;
  dijawabOleh?: string;
  tanggalJawab?: string;
  status: 'menunggu_tanggapan' | 'selesai';
}

// Audit Trail & Activity Log
export interface AuditLog {
  id: string;
  timestamp: string;
  actorNama: string;
  actorPeran: UserRole;
  aksi: string;
  rincian: string;
}

// ===================================================================
// INSTRUMEN KRITERIA PENEMPATAN KLIEN (Client Placement Criteria)
// Adaptasi ASAM Placement Criteria 3rd Edition
// ===================================================================

/** Level rekomendasi layanan rehabilitasi (0 = tidak perlu rawatan, 4 = sangat berat / hospitalisasi) */
export type LevelLayananRehabilitasi = 0 | 1 | 2 | 3 | 4;

/** Label resmi per level layanan */
export const LABEL_LEVEL_LAYANAN: Record<LevelLayananRehabilitasi, string> = {
  0: 'Tidak Membutuhkan Rawatan',
  1: 'Rawat Jalan (Ringan)',
  2: 'Rawat Jalan Intensif (Sedang)',
  3: 'Residensial / Pemantauan Medis (Berat)',
  4: 'Hospitalisasi (Sangat Berat)',
};

/** 6 Dimensi penilaian ASAM */
export type DimensiASAM =
  | 'intoksikasi'           // D1: Intoksikasi Akut / Potensi Putus Zat
  | 'komplikasi_medis'      // D2: Komplikasi dan Kondisi Medis
  | 'kondisi_psikologis'    // D3: Komplikasi Emosional, Perilaku, Kognitif
  | 'kesiapan_berubah'      // D4: Kesiapan Berubah (Motivasi)
  | 'potensi_kekambuhan'    // D5: Potensi Kekambuhan / Penggunaan Berlanjut
  | 'lingkungan_pemulihan'; // D6: Lingkungan Tempat Tinggal / Pemulihan

/** Satu baris penilaian per dimensi */
export interface PenilaianDimensiASAM {
  dimensi: DimensiASAM;
  levelDipilih: LevelLayananRehabilitasi;
  /** Deskripsi kondisi klien yang relevan / alasan pemilihan level */
  catatanKlinis: string;
  /** Indikator spesifik yang tercentang sesuai dokumen */
  indikatorTerpilih: string[];
}

/** Ringkasan hasil & rekomendasi akhir instrumen */
export interface HasilInstrumenKriteriaPlasemen {
  /** Level dengan tanda centang terbanyak / paling berat */
  levelRekomendasiAkhir: LevelLayananRehabilitasi;
  /** Narasi penjelasan rekomendasi */
  justifikasiRekomendasi: string;
  /** Apakah ada perbedaan indikasi antar dimensi */
  adaDisparitasDimensi: boolean;
  catatanDisparitas?: string;
}

/** Dokumen lengkap instrumen kriteria penempatan klien */
export interface InstrumenKriteriaPlasemen {
  id: string;
  tanggalPengisian: string;
  petugasNama: string;
  petugasInstansi: string;
  /** Apakah wawancara tambahan ke keluarga/wali dilakukan */
  wawancaraTambahanDilakukan: boolean;
  catatanWawancara?: string;
  penilaianPerDimensi: PenilaianDimensiASAM[];
  hasil: HasilInstrumenKriteriaPlasemen;
  statusPengisian: 'draf' | 'lengkap' | 'divalidasi';
  validasiOleh?: string;
  tanggalValidasi?: string;
}

// Deadline / SLA Summary
export interface DeadlineSummary {
  status: 'ON_TRACK' | 'APPROACHING' | 'OVERDUE' | 'UNRESOLVED_POLICY';
  dueAt: string | null;
  reason?: string;
}

// Blocker item
export interface BlockerItem {
  code: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message?: string;
}

// Model Utama: Satu Berkas Permohonan Asesmen Terpadu
// === VERSI BARU sesuai rancangan.md v1.1 ===
export interface PermohonanAsesmen {
  id: string;
  trackingNumber?: string;           // Nomor lacak publik (pre-registration)
  nomorPermohonan: string;           // registrationNumber setelah APPROVED (e.g. "TAT/2026/09/089")
  tanggalPengajuan: string;
  revision?: number;
  route?: string;                    // ARREST_WITHOUT_EVIDENCE | WITH_EVIDENCE | P19 | PROSECUTION | COURT
  jenisPengajuan?: 'penangkapan_tanpa_bb' | 'penangkapan_dengan_bb' | 'p19' | 'penuntutan' | 'persidangan';
  metodePelaksanaan?: 'luring' | 'daring' | 'hybrid';
  satuanKerjaTujuan?: string;
  targetTatUnit?: { id: string; name: string; level?: string };

  // ======= EMPAT STATUS KANONIS (rancangan.md section 1 & 7) =======
  applicationStatus: ApplicationStatus;        // tahap proses TAT
  medicalStatus: AssessmentStatus;             // kemajuan asesmen medis
  legalStatus: AssessmentStatus;              // kemajuan asesmen hukum
  deliveryStatus: DeliveryStatus;             // penyampaian hasil
  followupStatus: FollowupStatus;             // pelaksanaan rekomendasi

  // === Backward Compat: status lama untuk komponen yang belum migrasi ===
  statusProsesUtama: StatusProsesUtama;
  statusMedis: StatusMedisHukum;
  statusHukum: StatusMedisHukum;
  statusDokumen: StatusDokumen;
  statusTindakLanjut: StatusTindakLanjut;

  // Deadline
  tenggatSlaTanggal: string;
  isMendekatiTenggat: boolean;
  isMelewatiTenggat: boolean;
  deadlineSummary?: DeadlineSummary;

  // Pihak & Penanggung Jawab
  pengajuId: string;
  pengajuNama: string;
  pengajuEmail?: string;
  instansiPengaju: string;
  penanggungJawabBerikutnya: string;
  tindakanBerikutnyaLabel: string;
  nextAction?: string;                         // Kode aksi (COMPLETE_DOCUMENT_REVIEW, dll)

  // Blockers & Visibility
  blockers?: BlockerItem[];
  allowedActions?: string[];
  visibility?: {
    medicalDetail: 'GRANTED' | 'NOT_GRANTED' | 'SUMMARY_ONLY';
    legalDetail: 'GRANTED' | 'NOT_GRANTED' | 'SUMMARY_ONLY';
  };

  // Data Berkas Terpadu
  terperiksa: Terperiksa;
  perkara: PerkaraHukum;
  dokumenList: DokumenPersyaratan[];

  // Tim & Penugasan
  timAsesmen?: {
    sekretariatNama: string;
    asesorMedisNama?: string;
    asesorHukumNama?: string;
    jadwalPemeriksaanMedis?: string;
    jadwalPemeriksaanHukum?: string;
    jadwalPleno?: string;
    lokasiPemeriksaan?: string;
  };

  // Hasil Asesmen Substantif
  asesmenMedis?: AsesmenMedis;
  asesmenHukum?: AsesmenHukum;
  sidangPleno?: SidangPleno;
  rekomendasiResmi?: RekomendasiResmi;
  tindakLanjut?: TindakLanjutLayanan;
  pengawasanKlien?: PengawasanKlien;
  monitoringTindakLanjut?: MonitoringTindakLanjut; // JUKNIS-aligned monitoring module
  instrumenKriteriaPlasemen?: InstrumenKriteriaPlasemen;
  prasyaratPemeriksaan?: PrasyaratPemeriksaan;

  // Fitur Pendukung
  klarifikasiList: Klarifikasi[];
  auditLogs: AuditLog[];

  // Catatan Pengecualian Kasus
  catatanPengecualian?: {
    tipe: 'identitas_belum_pasti' | 'dokumen_bertentangan' | 'lab_tertunda' | 'terperiksa_absen' | 'medis_darurat' | 'anak_berhadapan_hukum' | 'konflik_kepentingan_asesor' | 'perbaikan_rekomendasi' | 'fasilitas_penuh';
    keterangan: string;
  };
}

// =====================================================================
// HELPER: Label maps untuk UI
// =====================================================================
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: 'Draf',
  SUBMITTED: 'Diajukan',
  ADMIN_REVIEW: 'Verifikasi Admin',
  NEEDS_CORRECTION: 'Perlu Perbaikan',
  AWAITING_DISPOSITION: 'Menunggu Keputusan Ketua',
  APPROVED: 'Disetujui',
  SCHEDULED: 'Dijadwalkan',
  ASSESSMENT_ACTIVE: 'Asesmen Berlangsung',
  READY_FOR_CONFERENCE: 'Siap Pleno',
  CONFERENCE_HELD: 'Pembahasan Dilaksanakan',
  CONFERENCE_CLARIFICATION_REQUIRED: 'Klarifikasi Pleno',
  OUTCOME_RECORDED_FOR_DRAFT: 'Hasil Dicatat (Draf)',
  AWAITING_SIGNED_OUTPUTS: 'Menunggu Dokumen Resmi',
  RESULTS_ISSUED: 'Hasil Terbit',
  REJECTED: 'Ditolak',
  OUT_OF_SCOPE_REFERRED: 'Dirujuk (Non-TAT)',
};

export const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, string> = {
  NOT_STARTED: 'Belum Dimulai',
  DRAFT: 'Draf',
  PENDING_REVIEW: 'Menunggu Telaah',
  FINAL: 'Final',
  AMENDMENT_REQUIRED: 'Perlu Amandemen',
  SUPERSEDED: 'Digantikan',
};

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  NOT_APPLICABLE: 'Tidak Berlaku',
  NOT_ISSUED: 'Belum Terbit',
  ISSUED_NOT_DELIVERED: 'Terbit, Belum Diserahkan',
  PARTIALLY_DELIVERED: 'Sebagian Terkirim',
  DELIVERED: 'Terkirim',
  ACKNOWLEDGED: 'Dikonfirmasi Diterima',
};

export const FOLLOWUP_STATUS_LABELS: Record<FollowupStatus, string> = {
  NOT_APPLICABLE_YET: 'Belum Relevan',
  NOT_APPLICABLE: 'Tidak Diperlukan',
  NOT_YET_REPORTED: 'Belum Dilaporkan',
  REPORTED_PENDING_VERIFICATION: 'Dilaporkan (Verifikasi)',
  VERIFIED_IMPLEMENTED: 'Terverifikasi Terlaksana',
  VERIFIED_NOT_IMPLEMENTED: 'Terverifikasi Tidak Terlaksana',
  CLARIFICATION_REQUIRED: 'Perlu Klarifikasi',
};

// Peta backward-compat: ApplicationStatus -> StatusProsesUtama (lama)
export const APP_STATUS_TO_LEGACY: Partial<Record<ApplicationStatus, StatusProsesUtama>> = {
  DRAFT: 'draf',
  SUBMITTED: 'diajukan',
  ADMIN_REVIEW: 'verifikasi_berkas',
  NEEDS_CORRECTION: 'perlu_perbaikan',
  APPROVED: 'penugasan_jadwal',
  SCHEDULED: 'penugasan_jadwal',
  ASSESSMENT_ACTIVE: 'asesmen_berlangsung',
  READY_FOR_CONFERENCE: 'siap_pleno',
  CONFERENCE_HELD: 'pembahasan_pleno',
  CONFERENCE_CLARIFICATION_REQUIRED: 'pembahasan_pleno',
  OUTCOME_RECORDED_FOR_DRAFT: 'pengesahan_rekomendasi',
  AWAITING_SIGNED_OUTPUTS: 'pengesahan_rekomendasi',
  RESULTS_ISSUED: 'rekomendasi_terbit',
};
