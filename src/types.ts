/**
 * Types and Interfaces for e-TAT (Sistem Pengelolaan Layanan Tim Asesmen Terpadu)
 * Sesuai Dokumen 1 (Bisnis) dan Dokumen 2 (Fungsional) - 8 September 2026
 */

export type UserRole =
  | 'pengaju'       // Penyidik Polri / BNN
  | 'sekretariat'   // Sekretariat TAT (Koordinator proses)
  | 'medis'         // Asesor Medis & Psikologis (Dokter/Psikolog)
  | 'hukum'         // Asesor Hukum (Penyidik/Jaksa/Ahli Hukum)
  | 'koordinator'   // Ketua / Koordinator TAT (Pengendali Pleno & Pengesah)
  | 'pimpinan'      // Pimpinan / Pengawas (Kepala BNN / Direktur Resnarkoba)
  | 'rehabilitasi'  // Petugas Fasilitas Rehabilitasi
  | 'admin';        // Administrator Sistem

export interface UserProfile {
  id: string;
  name: string;
  nip: string;
  role: UserRole;
  agency: string; // e.g., 'Polresta Bandung', 'BNN Provinsi Jawa Barat', 'RSKO Jakarta'
  avatar?: string;
  email: string;
  phone: string;
}

// 4 Kelompok Status Terpisah
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

// Model Utama: Satu Berkas Permohonan Asesmen Terpadu
export interface PermohonanAsesmen {
  id: string;
  nomorPermohonan: string; // e.g. "TAT/2026/09/089"
  tanggalPengajuan: string;
  tenggatSlaTanggal: string; // Target SLA operasional
  isMendekatiTenggat: boolean;
  isMelewatiTenggat: boolean;
  
  // Status 4 Kelompok
  statusProsesUtama: StatusProsesUtama;
  statusMedis: StatusMedisHukum;
  statusHukum: StatusMedisHukum;
  statusDokumen: StatusDokumen;
  statusTindakLanjut: StatusTindakLanjut;
  
  // Pihak & Penanggung Jawab
  pengajuId: string;
  pengajuNama: string;
  instansiPengaju: string;
  penanggungJawabBerikutnya: string; // "Sekretariat TAT", "Penyidik Polresta", "Asesor Medis", "Ketua TAT", dll
  tindakanBerikutnyaLabel: string; // "Menunggu verifikasi berkas", "Perbaikan KTP oleh pengaju", dll
  
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
  
  // Fitur Pendukung
  klarifikasiList: Klarifikasi[];
  auditLogs: AuditLog[];
  
  // Catatan Pengecualian Kasus
  catatanPengecualian?: {
    tipe: 'identitas_belum_pasti' | 'dokumen_bertentangan' | 'lab_tertunda' | 'terperiksa_absen' | 'medis_darurat' | 'anak_berhadapan_hukum' | 'konflik_kepentingan_asesor' | 'perbaikan_rekomendasi' | 'fasilitas_penuh';
    keterangan: string;
  };
}
