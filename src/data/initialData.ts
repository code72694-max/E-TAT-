import { PermohonanAsesmen, UserProfile, DokumenPersyaratan } from '../types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-sekretariat',
    name: 'Petugas Sekretariat Test-1',
    nip: '198403152006041002',
    role: 'sekretariat',
    agency: 'Sekretariat TAT - BNN Kota Bandung',
    email: 'sekretariat.test1@bnn.go.id',
    phone: '0812-3456-7890'
  },
  {
    id: 'user-pengaju',
    name: 'Penyidik Pengaju Test-1',
    nip: '198907122010121003',
    role: 'pengaju',
    agency: 'Sat Resnarkoba Polresta Bandung',
    email: 'penyidik.test1@polri.go.id',
    phone: '0813-8899-1122'
  },
  {
    id: 'user-medis',
    name: 'Dokter Asesor Medis Test-1',
    nip: '197908222005012004',
    role: 'medis',
    agency: 'Tim Medis TAT / RSUD Kota Bandung',
    email: 'dokter.test1@dinkes.go.id',
    phone: '0811-2233-4455'
  },
  {
    id: 'user-hukum',
    name: 'Asesor Hukum Test-1',
    nip: '198211052008011005',
    role: 'hukum',
    agency: 'Tim Hukum TAT / Kejaksaan Negeri Bandung',
    email: 'hukum.test1@kejaksaan.go.id',
    phone: '0815-7766-5544'
  },
  {
    id: 'user-koordinator',
    name: 'Koordinator TAT Test-1',
    nip: '197705142001121001',
    role: 'koordinator',
    agency: 'Ketua Tim Asesmen Terpadu - BNNP Jabar',
    email: 'koordinator.test1@bnn.go.id',
    phone: '0811-9988-7766'
  },
  {
    id: 'user-pimpinan',
    name: 'Pimpinan Pengawas Test-1',
    nip: '196904121992031001',
    role: 'pimpinan',
    agency: 'Kepala BNN Provinsi Jawa Barat',
    email: 'pimpinan.test1@bnn.go.id',
    phone: '0811-1234-5678'
  },
  {
    id: 'user-rehab',
    name: 'Petugas Fasilitas Rehab Test-1',
    nip: '198606182009122003',
    role: 'rehabilitasi',
    agency: 'Balai Besar Rehabilitasi BNN Lido Bogor',
    email: 'rehab.test1@lido.bnn.go.id',
    phone: '0813-4455-6677'
  },
  {
    id: 'user-admin',
    name: 'Administrator Sistem Test-1',
    nip: '199501202020121004',
    role: 'admin',
    agency: 'Pusdatin BNN RI',
    email: 'admin.test1@bnn.go.id',
    phone: '0812-9900-1122'
  }
];

export const STANDARD_DOCUMENTS: Omit<DokumenPersyaratan, 'id' | 'fileUrl' | 'fileName' | 'uploadedAt' | 'statusVerifikasi' | 'catatanKoreksi' | 'versi'>[] = [
  { nama: 'Surat Permohonan Asesmen dari Penyidik', wajib: true },
  { nama: 'Laporan Polisi (LP)', wajib: true },
  { nama: 'Surat Perintah Penyidikan (Sp.Sidik)', wajib: true },
  { nama: 'Surat Perintah Penangkapan & Penahanan', wajib: true },
  { nama: 'Berita Acara Pemeriksaan (BAP) Tersangka', wajib: true },
  { nama: 'Surat Tanda Penerimaan & Penyitaan Barang Bukti', wajib: true },
  { nama: 'Berita Acara Penimbangan / Pembungkusan Barang Bukti', wajib: true },
  { nama: 'Hasil Pemeriksaan Laboratorium Toksikologi Urin Awal', wajib: true },
  { nama: 'Fotokopi KTP / KK / Identitas Terperiksa', wajib: true },
  { nama: 'Surat Pernyataan / Permohonan Rehabilitasi dari Keluarga', wajib: false }
];

export const REHAB_FACILITIES = [
  {
    id: 'fac-1',
    nama: 'Balai Besar Rehabilitasi BNN Lido Bogor',
    tipe: 'Rawat Inap Pemerintah (BNN)',
    alamat: 'Jl. Mayjen HR Edi Sukma Km 21, Watesjaya, Cigombong, Bogor',
    kapasitasTotal: 300,
    kapasitasTersedia: 0,
    kontak: '(0251) 8221010 / 0812-8889-9901',
    layanan: ['Detoksifikasi', 'Rehabilitasi Medis', 'Rehabilitasi Sosial', 'Pascarehabilitasi']
  },
  {
    id: 'fac-2',
    nama: 'RSKO (Rumah Sakit Ketergantungan Obat) Jakarta',
    tipe: 'Rumah Sakit Khusus Kemenkes (Inap & Jalan)',
    alamat: 'Jl. Lapangan Tembak No.75, Cibubur, Ciracas, Jakarta Timur',
    kapasitasTotal: 150,
    kapasitasTersedia: 14,
    kontak: '(021) 87711968 / 0811-1909-8765',
    layanan: ['Detoks Medis Intensif', 'Dual Diagnosis / Psikiatri', 'Rawat Inap 3-6 Bulan', 'Rawat Jalan']
  },
  {
    id: 'fac-3',
    nama: 'Klinik Pratama BNN Kota Bandung (IPWL)',
    tipe: 'Rawat Jalan Pemerintah',
    alamat: 'Jl. Ciungwanara No. 10, Tamansari, Bandung',
    kapasitasTotal: 80,
    kapasitasTersedia: 28,
    kontak: '(022) 2503201 / 0813-2211-0099',
    layanan: ['Konseling Rawat Jalan', 'Terapi Kelompok', 'Program 8-12 Sesi', 'Tes Urin Berkala']
  },
  {
    id: 'fac-4',
    nama: 'Loka Rehabilitasi BNN Batam',
    tipe: 'Rawat Inap Pemerintah (BNN)',
    alamat: 'Kawasan Nongsa Digital Park, Batam',
    kapasitasTotal: 120,
    kapasitasTersedia: 8,
    kontak: '(0778) 761102 / 0812-7000-8811',
    layanan: ['Rehabilitasi Medis', 'Rehabilitasi Vokasional', 'Rawat Inap 6 Bulan']
  }
];

export const INITIAL_PERMOHONAN: PermohonanAsesmen[] = [
  // KASUS 1: PERLU PERBAIKAN BERKAS (Verifikasi Administrasi)
  {
    id: 'tat-089',
    nomorPermohonan: 'TAT/2026/09/089',
    tanggalPengajuan: '2026-09-07',
    tenggatSlaTanggal: '2026-09-12',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    statusProsesUtama: 'perlu_perbaikan',
    statusMedis: 'belum_dimulai',
    statusHukum: 'belum_dimulai',
    statusDokumen: 'draf',
    statusTindakLanjut: 'belum_dikonfirmasi',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Penyidik Pengaju Test-1',
    instansiPengaju: 'Sat Resnarkoba Polresta Bandung',
    penanggungJawabBerikutnya: 'Penyidik Pengaju Test-1 (Sat Resnarkoba)',
    tindakanBerikutnyaLabel: 'Menunggu perbaikan dokumen KTP & Penimbangan BB oleh Pengaju',
    terperiksa: {
      id: 'trp-089',
      namaLengkap: 'Terperiksa Test-1',
      alias: 'Subjek Uji 1',
      nik: '3273151804980003',
      isNikVerified: false,
      statusIdentitasKhusus: 'normal',
      tempatLahir: 'Bandung',
      tanggalLahir: '1998-04-18',
      usia: 28,
      jenisKelamin: 'Laki-laki',
      pekerjaan: 'Karyawan Swasta (Ekspedisi)',
      alamatKtp: 'Jl. Kiaracondong No. 142 RT 03/05, Kebon Kangkung, Bandung',
      alamatDomisili: 'Jl. Kiaracondong No. 142, Bandung',
      namaWaliPendamping: 'Wali Terperiksa Test-1 (Keluarga)',
      kontakWali: '0812-2211-3344'
    },
    perkara: {
      id: 'perk-089',
      nomorLaporanPolisi: 'LP/A/142/IX/2026/SPKT.SATRESNARKOBA/POLRESTA BANDUNG',
      tanggalLp: '2026-09-06',
      instansiPenyidik: 'Sat Resnarkoba Polresta Bandung',
      namaPenyidik: 'Penyidik Pengaju Test-1',
      nomorHpPenyidik: '0813-8899-1122',
      pasalDipersangkakan: 'Pasal 127 ayat (1) huruf a dan/atau Pasal 112 ayat (1) UU No. 35 Tahun 2009',
      tempatKejadianPerkara: 'Kamar Kos No. 04, Jl. Babakan Sari, Kiaracondong, Kota Bandung',
      tanggalWaktuPenangkapan: '2026-09-06 21:30 WIB',
      kronologiSingkat: 'Terperiksa diamankan saat berada di dalam kamar kos. Saat penggeledahan ditemukan 1 bungkus plastik klip kecil berisi kristal putih diduga sabu yang disimpan di dalam saku celana.',
      barangBuktiList: [
        {
          id: 'bb-089-1',
          jenisZat: 'Metamfetamina (Sabu)',
          beratKotorGram: 0.62,
          beratBersihGram: 0.38,
          statusUjiLab: 'proses_lab',
          nomorSuratLab: 'Lab/Toksi/112/IX/2026/Puslabfor',
          keterangan: 'Dibawah batasan SEMA No. 04/2010 (< 1 gram sabu)'
        },
        {
          id: 'bb-089-2',
          jenisZat: 'Peralatan Konsumsi (Pipet kaca & Korek)',
          beratBersihGram: 0,
          statusUjiLab: 'belum_uji',
          keterangan: 'Alat hisap bong sederhana'
        }
      ]
    },
    dokumenList: [
      {
        id: 'doc-089-1',
        nama: 'Surat Permohonan Asesmen dari Penyidik',
        wajib: true,
        fileUrl: '#',
        fileName: 'Surat_Permohonan_TAT_Polresta_Bdg_089.pdf',
        fileSize: '420 KB',
        uploadedAt: '2026-09-07 10:15',
        statusVerifikasi: 'sesuai',
        versi: 1
      },
      {
        id: 'doc-089-2',
        nama: 'Laporan Polisi (LP)',
        wajib: true,
        fileUrl: '#',
        fileName: 'LP_A_142_IX_2026_Polresta_Bdg.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-09-07 10:18',
        statusVerifikasi: 'sesuai',
        versi: 1
      },
      {
        id: 'doc-089-3',
        nama: 'Berita Acara Penimbangan / Pembungkusan Barang Bukti',
        wajib: true,
        fileUrl: '#',
        fileName: 'BA_Timbang_BB_Pegadaian.pdf',
        fileSize: '650 KB',
        uploadedAt: '2026-09-07 10:20',
        statusVerifikasi: 'perlu_perbaikan',
        catatanKoreksi: 'Stempel basah Pegadaian tidak terbaca jelas dan berat bersih tertulis berbeda antara angka (0.38 gr) dan huruf. Mohon unggah lembar asli penimbangan yang jelas.',
        versi: 1
      },
      {
        id: 'doc-089-4',
        nama: 'Fotokopi KTP / KK / Identitas Terperiksa',
        wajib: true,
        fileUrl: '#',
        fileName: 'Scan_KTP_Terperiksa_Test01.jpg',
        fileSize: '310 KB',
        uploadedAt: '2026-09-07 10:22',
        statusVerifikasi: 'perlu_perbaikan',
        catatanKoreksi: 'Nama pada KTP tertulis "Terperiksa Test-1", namun pada lampiran permohonan terdapat perbedaan ejaan. Harap sinkronkan dokumen atau lampirkan surat keterangan beda nama/KK.',
        versi: 1
      },
      {
        id: 'doc-089-5',
        nama: 'Hasil Pemeriksaan Laboratorium Toksikologi Urin Awal',
        wajib: true,
        fileUrl: '#',
        fileName: 'Hasil_Tes_Urin_Rapid_Polresta.pdf',
        fileSize: '510 KB',
        uploadedAt: '2026-09-07 10:25',
        statusVerifikasi: 'sesuai',
        versi: 1
      }
    ],
    klarifikasiList: [
      {
        id: 'klar-1',
        dariNama: 'Petugas Sekretariat Test-1',
        dariPeran: 'sekretariat',
        kepadaPeran: 'pengaju',
        pertanyaan: 'Mohon penyidik melengkapi BA Penimbangan yang tertera cap stempel resmi serta mengonfirmasi ejaan nama yang baku sesuai e-KTP.',
        tanggalTanya: '2026-09-07 14:00',
        status: 'menunggu_tanggapan'
      }
    ],
    auditLogs: [
      {
        id: 'aud-1',
        timestamp: '2026-09-07 10:30',
        actorNama: 'Penyidik Pengaju Test-1',
        actorPeran: 'pengaju',
        aksi: 'Pengajuan Permohonan Baru',
        rincian: 'Mengirimkan berkas permohonan asesmen terpadu perkara No. LP/A/142/IX/2026.'
      },
      {
        id: 'aud-2',
        timestamp: '2026-09-07 14:15',
        actorNama: 'Petugas Sekretariat Test-1',
        actorPeran: 'sekretariat',
        aksi: 'Verifikasi Berkas Administrasi',
        rincian: 'Mengembalikan berkas dengan status "Perlu Perbaikan" (2 dokumen koreksi).'
      }
    ]
  },

  // KASUS 2: ASESMEN BERLANGSUNG (Medis Selesai, Hukum Menunggu Info Lab Toksikologi Definitif)
  {
    id: 'tat-085',
    nomorPermohonan: 'TAT/2026/09/085',
    tanggalPengajuan: '2026-09-04',
    tenggatSlaTanggal: '2026-09-09',
    isMendekatiTenggat: true,
    isMelewatiTenggat: false,
    statusProsesUtama: 'asesmen_berlangsung',
    statusMedis: 'siap_dibahas',
    statusHukum: 'menunggu_lab_atau_info',
    statusDokumen: 'draf',
    statusTindakLanjut: 'belum_dikonfirmasi',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Penyidik Pengaju Test-1',
    instansiPengaju: 'Sat Resnarkoba Polresta Bandung',
    penanggungJawabBerikutnya: 'Tim Asesor Hukum (Asesor Hukum Test-1)',
    tindakanBerikutnyaLabel: 'Menunggu hasil uji konfirmasi lab BNN & BAP saksi konfrontir',
    terperiksa: {
      id: 'trp-085',
      namaLengkap: 'Terperiksa Test-2',
      alias: 'Subjek Uji 2',
      nik: '3204281209950001',
      isNikVerified: true,
      statusIdentitasKhusus: 'normal',
      tempatLahir: 'Cimahi',
      tanggalLahir: '1995-09-12',
      usia: 30,
      jenisKelamin: 'Laki-laki',
      pekerjaan: 'Freelance Desain Grafis',
      alamatKtp: 'Komplek Permata Biru Blok C3 No. 12, Cileunyi, Kab. Bandung',
      alamatDomisili: 'Komplek Permata Biru Blok C3 No. 12, Cileunyi',
      namaWaliPendamping: 'Wali Terperiksa Test-2 (Keluarga)',
      kontakWali: '0813-7722-1100'
    },
    perkara: {
      id: 'perk-085',
      nomorLaporanPolisi: 'LP/A/138/IX/2026/SPKT.SATRESNARKOBA/POLRESTA BANDUNG',
      tanggalLp: '2026-09-03',
      instansiPenyidik: 'Sat Resnarkoba Polresta Bandung',
      namaPenyidik: 'Penyidik Pembantu Test-2',
      nomorHpPenyidik: '0812-3344-5566',
      pasalDipersangkakan: 'Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009',
      tempatKejadianPerkara: 'Sebuah kafe di Jl. Riau (RE Martadinata), Cihapit, Bandung',
      tanggalWaktuPenangkapan: '2026-09-03 23:15 WIB',
      kronologiSingkat: 'Terperiksa ditangkap saat nongkrong bersama teman-temannya. Dilakukan penggeledahan tas ditemukan 1 klip kecil sabu sisa pakai 0.22 gram.',
      barangBuktiList: [
        {
          id: 'bb-085-1',
          jenisZat: 'Metamfetamina (Sabu)',
          beratKotorGram: 0.45,
          beratBersihGram: 0.22,
          statusUjiLab: 'positif',
          nomorSuratLab: 'Lab/Toksi/098/IX/2026/Puslabfor',
          tanggalSuratLab: '2026-09-05',
          keterangan: 'Positif mengandung Metamfetamina Golongan I'
        }
      ]
    },
    timAsesmen: {
      sekretariatNama: 'Petugas Sekretariat Test-1',
      asesorMedisNama: 'Dokter Asesor Medis Test-1',
      asesorHukumNama: 'Asesor Hukum Test-1',
      jadwalPemeriksaanMedis: '2026-09-05 09:30 WIB',
      jadwalPemeriksaanHukum: '2026-09-06 13:30 WIB',
      jadwalPleno: '2026-09-09 10:00 WIB (Tentatif)',
      lokasiPemeriksaan: 'Ruang TAT BNN Kota Bandung'
    },
    dokumenList: [
      {
        id: 'doc-085-1',
        nama: 'Surat Permohonan Asesmen dari Penyidik',
        wajib: true,
        fileName: 'Surat_Permohonan_085.pdf',
        fileSize: '512 KB',
        uploadedAt: '2026-09-04 09:00',
        statusVerifikasi: 'sesuai',
        versi: 1
      },
      {
        id: 'doc-085-2',
        nama: 'Laporan Polisi (LP)',
        wajib: true,
        fileName: 'LP_138_Polresta.pdf',
        fileSize: '890 KB',
        uploadedAt: '2026-09-04 09:05',
        statusVerifikasi: 'sesuai',
        versi: 1
      },
      {
        id: 'doc-085-3',
        nama: 'Surat Tanda Penerimaan & Penyitaan Barang Bukti',
        wajib: true,
        fileName: 'Sita_BB_085.pdf',
        fileSize: '410 KB',
        uploadedAt: '2026-09-04 09:10',
        statusVerifikasi: 'sesuai',
        versi: 1
      },
      {
        id: 'doc-085-4',
        nama: 'Hasil Pemeriksaan Laboratorium Toksikologi Urin Awal',
        wajib: true,
        fileName: 'Uji_Lab_Urin_Positif.pdf',
        fileSize: '780 KB',
        uploadedAt: '2026-09-04 09:12',
        statusVerifikasi: 'sesuai',
        versi: 1
      }
    ],
    asesmenMedis: {
      id: 'med-085',
      asesorId: 'user-medis',
      asesorNama: 'Dokter Asesor Medis Test-1',
      tanggalPemeriksaan: '2026-09-05',
      status: 'siap_dibahas',
      riwayatZat: [
        {
          jenisZat: 'Metamfetamina (Sabu)',
          caraPakai: 'Hisap (Bong)',
          frekuensi: '1-2 kali seminggu saat lembur kerja',
          lamaPemakaianBulan: 14,
          terakhirPakai: '2026-09-03 (1 hari sebelum ditangkap)'
        }
      ],
      kondisiFisik: 'Keadaan umum baik, gizi cukup, tanda vital stabil. Tidak ditemukan infeksi akut.',
      tekananDarah: '120/80 mmHg',
      denyutNadi: '84 x/menit',
      tandaBekasSuntikan: false,
      komorbiditasMedis: 'Gastritis kronis ringan, insomnia situasional.',
      kondisiPsikologis: 'Afek cemas wajar terkait proses hukum, tilikan (insight) derajat 4, tidak ditemukan gejala psikotik (halusinasi/waham negatif).',
      hasilUrin: [
        { parameter: 'MET (Metamfetamina)', hasil: 'Positif' },
        { parameter: 'AMP (Amfetamina)', hasil: 'Positif' },
        { parameter: 'THC (Ganja)', hasil: 'Negatif' },
        { parameter: 'BZO (Benzodiazepin)', hasil: 'Negatif' },
        { parameter: 'MOP (Morfin)', hasil: 'Negatif' }
      ],
      instrumen: 'ASSIST',
      skorInstrumen: 21,
      tingkatRisikoInstrumen: 'Sedang',
      diagnosisKlinisIcd: 'F15.1 Gangguan Penggunaan Stimulansia Pola Berbahaya (Harmful Use)',
      interpretasiKlinis: 'Klien mengalami ketergantungan derajat ringan-sedang terhadap zat jenis metamfetamina dipicu beban kerja berlebih. Memiliki motivasi pulih cukup tinggi dengan dukungan keluarga kooperatif.',
      kebutuhanRawat: 'Rawat Jalan',
      durasiUsulanBulan: 3,
      catatanKhusus: 'Diusulkan program rehabilitasi rawat jalan intensif (12 sesi konseling psikologis adiksi di Klinik Pratama BNN).',
      terakhirDiperbarui: '2026-09-05 16:30'
    },
    asesmenHukum: {
      id: 'huk-085',
      asesorId: 'user-hukum',
      asesorNama: 'Asesor Hukum Test-1',
      tanggalTelaah: '2026-09-06',
      status: 'menunggu_lab_atau_info',
      riwayatResidivisme: {
        pernahDitangkap: false,
        terverifikasiDatabase: true,
        keteranganPerkaraLalu: 'Berdasarkan pengecekan database SKCK & SDP Ditjenpas: Tidak memiliki catatan kriminal sebelumnya (bukan residivis).'
      },
      analisisPeran: 'Penyalahguna Murni',
      argumentasiPeran: 'Barang bukti yang ditemukan berada di bawah kuota pemakaian 1 hari (0.22 gram < 1 gram SEMA 04/2010). Tidak ditemukan timbangan digital, plastik klip kosong dalam jumlah banyak, maupun catatan transaksi penjualan narkotika pada ponsel terperiksa.',
      faktaPendukung: [
        'Ditangkap seorang diri dengan barang bukti sisa pakai 0.22 gram',
        'Hasil tes urin positif metamfetamina',
        'Tidak ada bukti transaksi jual beli atau transfer mencurigakan pada rekening & ponsel'
      ],
      catatanBelumTerverifikasi: 'Menunggu Berita Acara Konfrontir saksi penjual (DPO berinisial "AG") yang memasok barang ke terperiksa untuk memastikan tidak ada peran perantara/kurir.',
      analisisBarangBukti: 'Sesuai dengan Surat Edaran Mahkamah Agung (SEMA) No. 04 Tahun 2010 butir 2 huruf a (Sabu <= 1 gram).',
      kesimpulanHukum: 'Dapat dikategorikan sebagai penyalahguna narkotika bagi diri sendiri (Pasal 127 UU No. 35/2009). Direkomendasikan menjalani proses hukum berkeadilan restoratif dengan tindak lanjut rehabilitasi.',
      rekomendasiHukum: 'Proses Hukum Dilanjutkan dengan Rehabilitasi',
      catatanKlarifikasi: 'Perlu konfirmasi tertulis dari penyidik terkait status pemanggilan saksi rekan kos.',
      terakhirDiperbarui: '2026-09-06 17:00'
    },
    klarifikasiList: [
      {
        id: 'klar-2',
        dariNama: 'Asesor Hukum Test-1',
        dariPeran: 'hukum',
        kepadaPeran: 'pengaju',
        pertanyaan: 'Apakah penyidik telah memeriksa ponsel terperiksa dan memastikan riwayat chat tidak mengandung transaksi sindikat/jaringan?',
        tanggalTanya: '2026-09-06 14:00',
        jawaban: 'Sudah dilakukan digital forensic oleh Subdit Cyber. Hasilnya chat hanya pemesanan kepada penjual eceran untuk konsumsi pribadi, tidak ditemukan chat penjualan.',
        dijawabOleh: 'Penyidik Pengaju Test-1',
        tanggalJawab: '2026-09-06 16:20',
        status: 'selesai'
      }
    ],
    auditLogs: [
      {
        id: 'aud-21',
        timestamp: '2026-09-04 11:00',
        actorNama: 'Petugas Sekretariat Test-1',
        actorPeran: 'sekretariat',
        aksi: 'Penugasan Tim Asesor',
        rincian: 'Menugaskan Dokter Asesor Medis Test-1 dan Asesor Hukum Test-1.'
      },
      {
        id: 'aud-22',
        timestamp: '2026-09-05 16:35',
        actorNama: 'Dokter Asesor Medis Test-1',
        actorPeran: 'medis',
        aksi: 'Penyelesaian Asesmen Medis',
        rincian: 'Asesmen medis selesai dengan rekomendasi Rawat Jalan 3 bulan (ASSIST Skor 21).'
      }
    ]
  },

  // KASUS 3: SIAP PLENO (Medis & Hukum Lengkap, Ringkasan Terpadu Tersusun)
  {
    id: 'tat-082',
    nomorPermohonan: 'TAT/2026/09/082',
    tanggalPengajuan: '2026-09-02',
    tenggatSlaTanggal: '2026-09-08',
    isMendekatiTenggat: true,
    isMelewatiTenggat: false,
    statusProsesUtama: 'siap_pleno',
    statusMedis: 'siap_dibahas',
    statusHukum: 'siap_dibahas',
    statusDokumen: 'draf',
    statusTindakLanjut: 'belum_dikonfirmasi',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Penyidik Pengaju Test-1',
    instansiPengaju: 'Sat Resnarkoba Polresta Bandung',
    penanggungJawabBerikutnya: 'Ketua / Koordinator TAT (Koordinator TAT Test-1)',
    tindakanBerikutnyaLabel: 'Menunggu pelaksanaan Sidang Pleno TAT terjadwal hari ini',
    terperiksa: {
      id: 'trp-082',
      namaLengkap: 'Terperiksa Test-3',
      alias: 'Subjek Uji 3',
      nik: '3273010502010008',
      isNikVerified: true,
      statusIdentitasKhusus: 'normal',
      tempatLahir: 'Bandung',
      tanggalLahir: '2001-02-05',
      usia: 25,
      jenisKelamin: 'Laki-laki',
      pekerjaan: 'Mahasiswa Tingkat Akhir',
      alamatKtp: 'Jl. Tubagus Ismail VII No. 45, Sekeloa, Coblong, Bandung',
      alamatDomisili: 'Jl. Tubagus Ismail VII No. 45, Bandung',
      namaWaliPendamping: 'Wali Terperiksa Test-3 (Keluarga)',
      kontakWali: '0811-2299-8800'
    },
    perkara: {
      id: 'perk-082',
      nomorLaporanPolisi: 'LP/A/135/IX/2026/SPKT.SATRESNARKOBA/POLRESTA BANDUNG',
      tanggalLp: '2026-09-01',
      instansiPenyidik: 'Sat Resnarkoba Polresta Bandung',
      namaPenyidik: 'Penyidik Pembantu Test-3',
      nomorHpPenyidik: '0812-7788-9900',
      pasalDipersangkakan: 'Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009',
      tempatKejadianPerkara: 'Sebuah apartemen di Cihampelas, Bandung',
      tanggalWaktuPenangkapan: '2026-09-01 19:45 WIB',
      kronologiSingkat: 'Terperiksa diamankan bersama barang bukti daun ganja kering seberat 2.15 gram bersih yang disimpan dalam toples kaca kecil di meja belajar.',
      barangBuktiList: [
        {
          id: 'bb-082-1',
          jenisZat: 'Cannabis (Ganja Kering)',
          beratKotorGram: 4.5,
          beratBersihGram: 2.15,
          statusUjiLab: 'positif',
          nomorSuratLab: 'Lab/Toksi/089/IX/2026/Puslabfor',
          tanggalSuratLab: '2026-09-03',
          keterangan: 'Di bawah SEMA 04/2010 (< 5 gram ganja)'
        }
      ]
    },
    timAsesmen: {
      sekretariatNama: 'Petugas Sekretariat Test-1',
      asesorMedisNama: 'Dokter Asesor Medis Test-1',
      asesorHukumNama: 'Asesor Hukum Test-1',
      jadwalPemeriksaanMedis: '2026-09-03 10:00 WIB',
      jadwalPemeriksaanHukum: '2026-09-04 14:00 WIB',
      jadwalPleno: '2026-09-08 13:30 WIB',
      lokasiPemeriksaan: 'Ruang Rapat Tim Asesmen Terpadu BNNP Jawa Barat'
    },
    dokumenList: [
      {
        id: 'doc-082-1',
        nama: 'Surat Permohonan Asesmen dari Penyidik',
        wajib: true,
        fileName: 'Surat_Permohonan_082.pdf',
        fileSize: '480 KB',
        uploadedAt: '2026-09-02 08:30',
        statusVerifikasi: 'sesuai',
        versi: 1
      },
      {
        id: 'doc-082-2',
        nama: 'Laporan Polisi (LP)',
        wajib: true,
        fileName: 'LP_Perkara_Test03.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '2026-09-02 08:35',
        statusVerifikasi: 'sesuai',
        versi: 1
      },
      {
        id: 'doc-082-3',
        nama: 'Hasil Pemeriksaan Laboratorium Toksikologi Urin Awal',
        wajib: true,
        fileName: 'Lab_Urin_Ganja_Positif.pdf',
        fileSize: '650 KB',
        uploadedAt: '2026-09-02 08:40',
        statusVerifikasi: 'sesuai',
        versi: 1
      }
    ],
    asesmenMedis: {
      id: 'med-082',
      asesorId: 'user-medis',
      asesorNama: 'Dokter Asesor Medis Test-1',
      tanggalPemeriksaan: '2026-09-03',
      status: 'siap_dibahas',
      riwayatZat: [
        {
          jenisZat: 'Ganja (Cannabis)',
          caraPakai: 'Hisap (Linting)',
          frekuensi: 'Hampir setiap hari menjelang tidur',
          lamaPemakaianBulan: 24,
          terakhirPakai: '2026-09-01'
        }
      ],
      kondisiFisik: 'Status fisik stabil, sklera sedikit hiperemis (mata merah), refleks pupil normal.',
      tekananDarah: '115/75 mmHg',
      denyutNadi: '78 x/menit',
      tandaBekasSuntikan: false,
      komorbiditasMedis: 'Tidak ada riwayat penyakit sistemik kronis.',
      kondisiPsikologis: 'Motivasi berobat mandiri ada, amotivasi episodik terkait penggunaan ganja kronis, insight derajat 5.',
      hasilUrin: [
        { parameter: 'THC (Ganja)', hasil: 'Positif' },
        { parameter: 'MET (Metamfetamina)', hasil: 'Negatif' },
        { parameter: 'AMP (Amfetamina)', hasil: 'Negatif' },
        { parameter: 'BZO (Benzodiazepin)', hasil: 'Negatif' },
        { parameter: 'MOP (Morfin)', hasil: 'Negatif' }
      ],
      instrumen: 'ASSIST',
      skorInstrumen: 26,
      tingkatRisikoInstrumen: 'Tinggi',
      diagnosisKlinisIcd: 'F12.2 Sindrom Ketergantungan Kanabinoid',
      interpretasiKlinis: 'Ketergantungan psikologis kronis terhadap ganja, mengganggu penyelesaian skripsi dan fungsi sosial harian.',
      kebutuhanRawat: 'Rawat Inap',
      durasiUsulanBulan: 3,
      catatanKhusus: 'Diusulkan rehabilitasi medis & psikososial rawat inap di Balai Besar Lido atau RSKO untuk pemulihan intensif.',
      terakhirDiperbarui: '2026-09-03 15:45'
    },
    asesmenHukum: {
      id: 'huk-082',
      asesorId: 'user-hukum',
      asesorNama: 'Asesor Hukum Test-1',
      tanggalTelaah: '2026-09-04',
      status: 'siap_dibahas',
      riwayatResidivisme: {
        pernahDitangkap: false,
        terverifikasiDatabase: true,
        keteranganPerkaraLalu: 'Tidak pernah dipidana sebelumnya (Clear criminal record).'
      },
      analisisPeran: 'Penyalahguna Murni',
      argumentasiPeran: 'Berat ganja 2.15 gram berada di bawah ambang batas SEMA 04/2010 (5 gram). Tidak terbukti memperjualbelikan atau mengedarkan.',
      faktaPendukung: [
        'Konsumsi pribadi di kamar kos',
        'Tidak ada alat timbangan atau kemasan pecah paket',
        'Penyelidikan tidak menemukan kaitan jaringan pengedar antar-kampus'
      ],
      catatanBelumTerverifikasi: 'Keterangan penjual daring via media sosial masih dalam penelusuran penyidik.',
      analisisBarangBukti: 'Memenuhi persyaratan kualifikasi penyalahguna murni UU 35/2009.',
      kesimpulanHukum: 'Direkomendasikan menjalani rehabilitasi medis dan sosial rawat inap tanpa mengabaikan kelanjutan kepastian hukum.',
      rekomendasiHukum: 'Proses Hukum Dilanjutkan dengan Rehabilitasi',
      terakhirDiperbarui: '2026-09-04 16:30'
    },
    sidangPleno: {
      id: 'pln-082',
      tanggalPleno: '2026-09-08',
      waktu: '13:30 - 15:00 WIB',
      tempat: 'Ruang Sidang Pleno TAT Lantai 2, Gedung BNNP Jawa Barat',
      nomorBeritaAcara: 'BA-PLENO/082/IX/2026/TAT-JABAR',
      pimpinanPleno: 'Koordinator TAT Test-1',
      daftarHadir: [
        { nama: 'Koordinator TAT Test-1', peran: 'Ketua / Koordinator', instansi: 'BNNP Jabar', hadir: true },
        { nama: 'Dokter Asesor Medis Test-1', peran: 'Tim Asesor Medis', instansi: 'RSUD Bandung', hadir: true },
        { nama: 'Asesor Hukum Test-1', peran: 'Tim Asesor Hukum', instansi: 'Kejari Bandung', hadir: true },
        { nama: 'Penyidik Pengaju Test-1', peran: 'Penyidik Pengaju', instansi: 'Sat Resnarkoba Polresta Bandung', hadir: true }
      ],
      pokokBahasan: 'Pembahasan sinkronisasi rekomendasi medis (Rawat Inap 3 bulan di Balai Lido) dan aspek hukum penyalahguna murni ganja 2.15 gram.',
      catatanPerbedaanPendapat: 'Tidak ada dissenting opinion. Seluruh tim sepakat atas indikasi ketergantungan ganja berat dan status penyalahguna murni.',
      kesepakatanRekomendasi: 'Disepakati pemberian rekomendasi Rehabilitasi Medis dan Sosial Rawat Inap selama 3 (tiga) bulan di fasilitas rehabilitasi pemerintah.',
      jenisRekomendasiFinal: 'Rehabilitasi Rawat Inap',
      durasiRehabBulan: 3,
      fasilitasRujukanUsulan: 'Balai Besar Rehabilitasi BNN Lido Bogor / RSKO Cibubur',
      statusPleno: 'terjadwal'
    },
    klarifikasiList: [],
    auditLogs: [
      {
        id: 'aud-31',
        timestamp: '2026-09-04 17:00',
        actorNama: 'Petugas Sekretariat Test-1',
        actorPeran: 'sekretariat',
        aksi: 'Penjadwalan Sidang Pleno',
        rincian: 'Hasil medis dan hukum lengkap. Menjadwalkan sidang pleno untuk 8 September 2026.'
      }
    ]
  },

  // KASUS 4: PENGESAHAN REKOMENDASI (Pleno Selesai, Menunggu 1 Tanda Tangan Terakhir)
  {
    id: 'tat-079',
    nomorPermohonan: 'TAT/2026/09/079',
    tanggalPengajuan: '2026-08-28',
    tenggatSlaTanggal: '2026-09-04',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    statusProsesUtama: 'pengesahan_rekomendasi',
    statusMedis: 'siap_dibahas',
    statusHukum: 'siap_dibahas',
    statusDokumen: 'menunggu_pengesahan',
    statusTindakLanjut: 'sedang_dikoordinasikan',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Penyidik Pengaju Test-1',
    instansiPengaju: 'Sat Resnarkoba Polresta Bandung',
    penanggungJawabBerikutnya: 'Ketua Tim TAT (Koordinator TAT Test-1)',
    tindakanBerikutnyaLabel: 'Menunggu tanda tangan digital pengesahan akhir oleh Ketua Tim TAT',
    terperiksa: {
      id: 'trp-079',
      namaLengkap: 'Terperiksa Test-4',
      alias: 'Subjek Uji 4',
      nik: '3273114512960004',
      isNikVerified: true,
      statusIdentitasKhusus: 'normal',
      tempatLahir: 'Jakarta',
      tanggalLahir: '1996-12-05',
      usia: 29,
      jenisKelamin: 'Perempuan',
      pekerjaan: 'Manajer Pemasaran',
      alamatKtp: 'Jl. Dago Asri I No. 18, Coblong, Bandung',
      alamatDomisili: 'Apartemen Grand Asia Afrika Tower B, Bandung',
      namaWaliPendamping: 'Wali Terperiksa Test-4 (Keluarga)',
      kontakWali: '0812-3344-5511'
    },
    perkara: {
      id: 'perk-079',
      nomorLaporanPolisi: 'LP/A/128/VIII/2026/SPKT.SATRESNARKOBA/POLRESTA BANDUNG',
      tanggalLp: '2026-08-27',
      instansiPenyidik: 'Sat Resnarkoba Polresta Bandung',
      namaPenyidik: 'Penyidik Pembantu Test-2',
      nomorHpPenyidik: '0812-3344-5566',
      pasalDipersangkakan: 'Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009',
      tempatKejadianPerkara: 'Kamar Apartemen Grand Asia Afrika, Jl. Karapitan, Bandung',
      tanggalWaktuPenangkapan: '2026-08-27 22:00 WIB',
      kronologiSingkat: 'Ditemukan 2 butir pil ekstasi (MDMA) dengan berat bersih 0.54 gram dan sisa sabu 0.15 gram di laci meja rias.',
      barangBuktiList: [
        {
          id: 'bb-079-1',
          jenisZat: 'MDMA (Ekstasi)',
          beratKotorGram: 0.8,
          beratBersihGram: 0.54,
          statusUjiLab: 'positif',
          nomorSuratLab: 'Lab/Toksi/065/VIII/2026/Puslabfor',
          keterangan: '2 butir pil logo granat'
        }
      ]
    },
    timAsesmen: {
      sekretariatNama: 'Petugas Sekretariat Test-1',
      asesorMedisNama: 'Dokter Asesor Medis Test-1',
      asesorHukumNama: 'Asesor Hukum Test-1',
      jadwalPleno: '2026-09-04 10:00 WIB',
      lokasiPemeriksaan: 'Ruang Pleno BNNP Jabar'
    },
    dokumenList: [
      {
        id: 'doc-079-1',
        nama: 'Surat Permohonan Asesmen dari Penyidik',
        wajib: true,
        fileName: 'Surat_Permohonan_079.pdf',
        fileSize: '410 KB',
        uploadedAt: '2026-08-28 09:00',
        statusVerifikasi: 'sesuai',
        versi: 1
      },
      {
        id: 'doc-079-2',
        nama: 'Laporan Polisi (LP)',
        wajib: true,
        fileName: 'LP_128_Perkara_Test04.pdf',
        fileSize: '950 KB',
        uploadedAt: '2026-08-28 09:10',
        statusVerifikasi: 'sesuai',
        versi: 1
      }
    ],
    asesmenMedis: {
      id: 'med-079',
      asesorId: 'user-medis',
      asesorNama: 'Dokter Asesor Medis Test-1',
      tanggalPemeriksaan: '2026-08-30',
      status: 'siap_dibahas',
      riwayatZat: [
        {
          jenisZat: 'MDMA & Metamfetamina',
          caraPakai: 'Telan & Hisap',
          frekuensi: 'Akhir pekan (rekreasional menuju ketergantungan)',
          lamaPemakaianBulan: 18,
          terakhirPakai: '2026-08-27'
        }
      ],
      kondisiFisik: 'Status fisik stabil, penurunan nafsu makan, gangguan siklus tidur.',
      tekananDarah: '130/85 mmHg',
      denyutNadi: '92 x/menit',
      tandaBekasSuntikan: false,
      komorbiditasMedis: 'Episode Depresi Sedang (F32.1) tanpa gejala psikotik.',
      kondisiPsikologis: 'Klien mengalami tekanan emosional berat (burnout kerja), mencari pelarian dengan stimulansia.',
      hasilUrin: [
        { parameter: 'MET', hasil: 'Positif' },
        { parameter: 'AMP', hasil: 'Positif' },
        { parameter: 'MDMA', hasil: 'Positif' }
      ],
      instrumen: 'ASSIST',
      skorInstrumen: 23,
      tingkatRisikoInstrumen: 'Sedang',
      diagnosisKlinisIcd: 'F19.2 Sindrom Ketergantungan Multipel Zat dengan Komorbid Depresi',
      interpretasiKlinis: 'Membutuhkan intervensi dual-diagnosis (penanganan adiksi sekaligus terapi kejiwaan antidepresi).',
      kebutuhanRawat: 'Rawat Inap',
      durasiUsulanBulan: 3,
      catatanKhusus: 'Sangat disarankan dirawat di RSKO Cibubur yang memiliki fasilitas dual-diagnosis terpadu.',
      terakhirDiperbarui: '2026-08-31 11:00'
    },
    asesmenHukum: {
      id: 'huk-079',
      asesorId: 'user-hukum',
      asesorNama: 'Asesor Hukum Test-1',
      tanggalTelaah: '2026-09-01',
      status: 'siap_dibahas',
      riwayatResidivisme: {
        pernahDitangkap: false,
        terverifikasiDatabase: true,
        keteranganPerkaraLalu: 'Bukan residivis.'
      },
      analisisPeran: 'Penyalahguna Murni',
      argumentasiPeran: 'Barang bukti 2 butir ekstasi (0.54 gr) di bawah SEMA 04/2010 (maksimal 8 butir). Tidak ada bukti keterlibatan dalam sindikat peredaran.',
      faktaPendukung: ['Membeli untuk dikonsumsi sendiri saat party', 'Tidak ditemukan alat distribusi'],
      catatanBelumTerverifikasi: 'Tidak ada.',
      analisisBarangBukti: 'Memenuhi kriteria SEMA No. 04 Tahun 2010 butir 2 huruf e.',
      kesimpulanHukum: 'Direkomendasikan rehabilitasi medis dan sosial dengan pengawasan hukum yang ketat.',
      rekomendasiHukum: 'Proses Hukum Dilanjutkan dengan Rehabilitasi',
      terakhirDiperbarui: '2026-09-01 15:00'
    },
    sidangPleno: {
      id: 'pln-079',
      tanggalPleno: '2026-09-04',
      waktu: '10:00 - 11:45 WIB',
      tempat: 'Ruang Sidang Pleno BNNP Jawa Barat',
      nomorBeritaAcara: 'BA-PLENO/079/IX/2026/TAT-JABAR',
      pimpinanPleno: 'Koordinator TAT Test-1',
      daftarHadir: [
        { nama: 'Koordinator TAT Test-1', peran: 'Ketua / Koordinator', instansi: 'BNNP Jabar', hadir: true },
        { nama: 'Dokter Asesor Medis Test-1', peran: 'Tim Asesor Medis', instansi: 'RSUD Bandung', hadir: true },
        { nama: 'Asesor Hukum Test-1', peran: 'Tim Asesor Hukum', instansi: 'Kejari Bandung', hadir: true },
        { nama: 'Penyidik Pengaju Test-1', peran: 'Penyidik Pengaju', instansi: 'Sat Resnarkoba Polresta Bandung', hadir: true }
      ],
      pokokBahasan: 'Penetapan rekomendasi penanganan adiksi dual-diagnosis bagi terperiksa Terperiksa Test-4.',
      catatanPerbedaanPendapat: 'Nihil. Seluruh unsur menyetujui rujukan ke fasilitas RSKO Cibubur.',
      kesepakatanRekomendasi: 'Diterbitkan rekomendasi resmi Tim Asesmen Terpadu untuk menjalani Rehabilitasi Medis dan Sosial Rawat Inap selama 3 (tiga) bulan di Rumah Sakit Ketergantungan Obat (RSKO) Cibubur Jakarta.',
      jenisRekomendasiFinal: 'Rehabilitasi Rawat Inap',
      durasiRehabBulan: 3,
      fasilitasRujukanUsulan: 'RSKO Cibubur Jakarta',
      statusPleno: 'selesai_sepakat'
    },
    rekomendasiResmi: {
      nomorSurat: 'REK-TAT/079/IX/2026/BNNP-JABAR',
      tanggalTerbit: '2026-09-04',
      dibuatOleh: 'Sekretariat Tim Asesmen Terpadu BNNP Jawa Barat',
      ringkasanMedis: 'Terperiksa Terperiksa Test-4 mengalami Sindrom Ketergantungan Multipel Zat (MDMA & Metamfetamina) kategori sedang dengan komorbiditas depresi sedang (F19.2 + F32.1), memerlukan rawat inap 3 bulan.',
      ringkasanHukum: 'Terperiksa terbukti sebagai penyalahguna narkotika murni bagi diri sendiri (Pasal 127 UU 35/2009), bukan residivis, dan barang bukti di bawah batasan SEMA 04/2010.',
      rekomendasiFinalText: 'Menyimpulkan dan merekomendasikan kepada Penyidik agar Terperiksa ditempatkan di Fasilitas Rehabilitasi Medis & Sosial RSKO Cibubur Jakarta untuk menjalani rawat inap selama 3 (tiga) bulan.',
      isLengkapPengesahan: false,
      qrVerificationCode: 'ETAT-VERIF-2026-079-994A1F',
      filePdfSimulasiUrl: '#',
      daftarPengesah: [
        {
          id: 'sign-1',
          nama: 'Dokter Asesor Medis Test-1',
          jabatan: 'Asesor Medis TAT',
          instansi: 'RSUD Kota Bandung',
          status: 'disahkan',
          tanggalPengesahan: '2026-09-04 14:15',
          tandaTanganDigitalHash: 'SHA256:d41d8cd98f00b204e9800998ecf8427e_MEDIS'
        },
        {
          id: 'sign-2',
          nama: 'Asesor Hukum Test-1',
          jabatan: 'Asesor Hukum TAT',
          instansi: 'Kejaksaan Negeri Bandung',
          status: 'disahkan',
          tanggalPengesahan: '2026-09-04 15:30',
          tandaTanganDigitalHash: 'SHA256:e2fc714c4727ee9395f324cd2e7f331f_HUKUM'
        },
        {
          id: 'sign-3',
          nama: 'Penyidik Pengaju Test-1',
          jabatan: 'Penyidik / Pemohon',
          instansi: 'Sat Resnarkoba Polresta Bandung',
          status: 'disahkan',
          tanggalPengesahan: '2026-09-04 16:45',
          tandaTanganDigitalHash: 'SHA256:c4ca4238a0b923820dcc509a6f75849b_PENYIDIK'
        },
        {
          id: 'sign-4',
          nama: 'Koordinator TAT Test-1',
          jabatan: 'Ketua / Koordinator Tim Asesmen Terpadu',
          instansi: 'BNN Provinsi Jawa Barat',
          status: 'menunggu'
        }
      ]
    },
    tindakLanjut: {
      id: 'tl-079',
      jenisTindakLanjut: 'Rujukan Rehabilitasi',
      namaFasilitasTujuan: 'RSKO (Rumah Sakit Ketergantungan Obat) Jakarta',
      kontakFasilitas: '(021) 87711968',
      statusRujukan: 'sedang_dikoordinasikan',
      penanggungJawabTindakLanjut: 'Sekretariat TAT & Penyidik Polresta Bandung',
      statusProsesHukumTerkait: 'Penyidikan tahap I tetap berproses sembari menanti penetapan diversi/rehab dari jaksa.',
      terakhirDiperbarui: '2026-09-04 17:00'
    },
    klarifikasiList: [],
    auditLogs: [
      {
        id: 'aud-41',
        timestamp: '2026-09-04 11:50',
        actorNama: 'Koordinator TAT Test-1',
        actorPeran: 'koordinator',
        aksi: 'Penyelesaian Sidang Pleno',
        rincian: 'Sidang pleno selesai dengan kesepakatan rekomendasi rawat inap RSKO.'
      },
      {
        id: 'aud-42',
        timestamp: '2026-09-04 14:15',
        actorNama: 'Dokter Asesor Medis Test-1',
        actorPeran: 'medis',
        aksi: 'Pengesahan Tanda Tangan Digital',
        rincian: 'Menandatangani lembar rekomendasi resmi No. REK-TAT/079/IX/2026.'
      }
    ]
  },

  // KASUS 5: REKOMENDASI TERBIT - TINDAK LANJUT TERHAMBAT (Kapasitas Balai Lido Penuh)
  {
    id: 'tat-074',
    nomorPermohonan: 'TAT/2026/08/074',
    tanggalPengajuan: '2026-08-20',
    tenggatSlaTanggal: '2026-08-26',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    statusProsesUtama: 'rekomendasi_terbit',
    statusMedis: 'siap_dibahas',
    statusHukum: 'siap_dibahas',
    statusDokumen: 'resmi_terbit',
    statusTindakLanjut: 'terhambat',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Penyidik Pengaju Test-1',
    instansiPengaju: 'Sat Resnarkoba Polresta Bandung',
    penanggungJawabBerikutnya: 'Sekretariat TAT (Petugas Sekretariat Test-1)',
    tindakanBerikutnyaLabel: 'Kapasitas Balai Lido Penuh: Diperlukan koordinasi pengalihan fasilitas rujukan alternatif',
    terperiksa: {
      id: 'trp-074',
      namaLengkap: 'Terperiksa Test-5',
      alias: 'Subjek Uji 5',
      nik: '3204122507920005',
      isNikVerified: true,
      statusIdentitasKhusus: 'normal',
      tempatLahir: 'Soreang',
      tanggalLahir: '1992-07-25',
      usia: 34,
      jenisKelamin: 'Laki-laki',
      pekerjaan: 'Wiraswasta',
      alamatKtp: 'Jl. Raya Soreang-Banjaran No. 88, Kab. Bandung',
      alamatDomisili: 'Jl. Raya Soreang-Banjaran No. 88, Kab. Bandung',
      namaWaliPendamping: 'Wali Terperiksa Test-5 (Keluarga)',
      kontakWali: '0812-9988-7711'
    },
    perkara: {
      id: 'perk-074',
      nomorLaporanPolisi: 'LP/A/119/VIII/2026/SPKT.SATRESNARKOBA/POLRESTA BANDUNG',
      tanggalLp: '2026-08-19',
      instansiPenyidik: 'Sat Resnarkoba Polresta Bandung',
      namaPenyidik: 'Penyidik Pengaju Test-1',
      nomorHpPenyidik: '0813-8899-1122',
      pasalDipersangkakan: 'Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009',
      tempatKejadianPerkara: 'Sebuah hotel di kawasan Pasteur, Bandung',
      tanggalWaktuPenangkapan: '2026-08-19 18:30 WIB',
      kronologiSingkat: 'Ditemukan sabu sisa pakai 0.35 gram di dalam bungkus rokok.',
      barangBuktiList: [
        {
          id: 'bb-074-1',
          jenisZat: 'Metamfetamina (Sabu)',
          beratKotorGram: 0.55,
          beratBersihGram: 0.35,
          statusUjiLab: 'positif',
          nomorSuratLab: 'Lab/Toksi/052/VIII/2026/Puslabfor',
          keterangan: 'Sabu sisa konsumsi pribadi'
        }
      ]
    },
    timAsesmen: {
      sekretariatNama: 'Petugas Sekretariat Test-1',
      asesorMedisNama: 'Dokter Asesor Medis Test-1',
      asesorHukumNama: 'Asesor Hukum Test-1',
      jadwalPleno: '2026-08-25 09:00 WIB',
      lokasiPemeriksaan: 'Ruang Pleno BNNP Jabar'
    },
    dokumenList: [],
    rekomendasiResmi: {
      nomorSurat: 'REK-TAT/074/VIII/2026/BNNP-JABAR',
      tanggalTerbit: '2026-08-25',
      dibuatOleh: 'Sekretariat TAT BNNP Jawa Barat',
      ringkasanMedis: 'Ketergantungan Sabu Kronis derajat berat (ASSIST Skor 29), memerlukan rawat inap 6 bulan.',
      ringkasanHukum: 'Penyalahguna murni narkotika, bukan pengedar, direkomendasikan rawat inap rehabilitasi.',
      rekomendasiFinalText: 'Rekomendasi resmi penempatan di Balai Besar Rehabilitasi BNN Lido Bogor selama 6 (enam) bulan.',
      isLengkapPengesahan: true,
      qrVerificationCode: 'ETAT-VERIF-2026-074-88A22B',
      filePdfSimulasiUrl: '#',
      daftarPengesah: [
        { id: 's-1', nama: 'Dokter Asesor Medis Test-1', jabatan: 'Asesor Medis', instansi: 'RSUD Bandung', status: 'disahkan', tanggalPengesahan: '2026-08-25 11:00' },
        { id: 's-2', nama: 'Asesor Hukum Test-1', jabatan: 'Asesor Hukum', instansi: 'Kejari Bandung', status: 'disahkan', tanggalPengesahan: '2026-08-25 11:30' },
        { id: 's-3', nama: 'Penyidik Pengaju Test-1', jabatan: 'Penyidik', instansi: 'Polresta Bandung', status: 'disahkan', tanggalPengesahan: '2026-08-25 13:00' },
        { id: 's-4', nama: 'Koordinator TAT Test-1', jabatan: 'Ketua TAT', instansi: 'BNNP Jabar', status: 'disahkan', tanggalPengesahan: '2026-08-25 14:00' }
      ],
      buktiPenerimaanPengaju: {
        diterimaOleh: 'Penyidik Pengaju Test-1',
        tanggalDiterima: '2026-08-25 15:30',
        nomorTandaTerima: 'TTR/TAT-074/VIII/2026'
      }
    },
    tindakLanjut: {
      id: 'tl-074',
      jenisTindakLanjut: 'Rujukan Rehabilitasi',
      namaFasilitasTujuan: 'Balai Besar Rehabilitasi BNN Lido Bogor',
      kontakFasilitas: '(0251) 8221010',
      statusRujukan: 'kapasitas_penuh',
      tanggalRujukanDikirim: '2026-08-26',
      tanggalKonfirmasiFasilitas: '2026-08-27',
      hambatanPelaksanaan: 'Kapasitas bed rawat inap Balai Lido terisi penuh 100% sampai tanggal 25 September 2026. Antrean menunggu penempatan (waiting list #4).',
      penanggungJawabTindakLanjut: 'Sekretariat TAT BNNP Jabar & Penyidik Polresta Bandung',
      statusProsesHukumTerkait: 'Penyidik menitipkan terperiksa sementara di Ruang Tahanan Polresta Bandung menunggu relokasi fasilitas atau kuota kosong.',
      terakhirDiperbarui: '2026-08-27 10:15'
    },
    catatanPengecualian: {
      tipe: 'fasilitas_penuh',
      keterangan: 'Rujukan ke Balai Besar Lido terkendala kuota penuh. Koordinasi pengalihan ke RS Marzuki Mahdi Bogor atau RSKO Cibubur sedang diusulkan.'
    },
    klarifikasiList: [
      {
        id: 'klar-51',
        dariNama: 'Petugas Fasilitas Rehab Test-1',
        dariPeran: 'rehabilitasi',
        kepadaPeran: 'sekretariat',
        pertanyaan: 'Konfirmasi dari Bagian Admisi Balai Lido: Kuota penerimaan rujukan residen pria penuh 300 bed. Tersedia estimasi pembukaan slot pada tanggal 28 September.',
        tanggalTanya: '2026-08-27 09:30',
        jawaban: 'Terima kasih atas informasinya. Kami sedang berkoordinasi dengan penyidik untuk opsi pengalihan sementara ke RSKO Cibubur.',
        dijawabOleh: 'Petugas Sekretariat Test-1',
        tanggalJawab: '2026-08-27 10:30',
        status: 'selesai'
      }
    ],
    auditLogs: [
      {
        id: 'aud-51',
        timestamp: '2026-08-25 15:30',
        actorNama: 'Penyidik Pengaju Test-1',
        actorPeran: 'pengaju',
        aksi: 'Konfirmasi Penerimaan Rekomendasi Resmi',
        rincian: 'Penyidik menerima dokumen fisik dan elektronik rekomendasi No. REK-TAT/074/VIII/2026.'
      },
      {
        id: 'aud-52',
        timestamp: '2026-08-27 10:00',
        actorNama: 'Petugas Fasilitas Rehab Test-1',
        actorPeran: 'rehabilitasi',
        aksi: 'Update Status Rujukan: Kapasitas Penuh',
        rincian: 'Mencatat status kapasitas penuh pada sistem e-TAT.'
      }
    ]
  },

  // KASUS 6: SKENARIO PENGECUALIAN - ANAK BERHADAPAN DENGAN HUKUM (ABH) & SELESAI
  {
    id: 'tat-068',
    nomorPermohonan: 'TAT/2026/08/068',
    tanggalPengajuan: '2026-08-10',
    tenggatSlaTanggal: '2026-08-15',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    statusProsesUtama: 'selesai_tindak_lanjut',
    statusMedis: 'siap_dibahas',
    statusHukum: 'siap_dibahas',
    statusDokumen: 'resmi_terbit',
    statusTindakLanjut: 'terlaksana',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Penyidik Pengaju Test-1',
    instansiPengaju: 'Sat Resnarkoba Polresta Bandung',
    penanggungJawabBerikutnya: 'Layanan Selesai (Pemantauan Berkala Pasca-Rehab)',
    tindakanBerikutnyaLabel: 'Tindak lanjut terlaksana: Klien menjalani program rawat jalan di Klinik BNN & Diversi tercapai',
    terperiksa: {
      id: 'trp-068',
      namaLengkap: 'Terperiksa Test-6 (Subjek Anak)',
      alias: 'Subjek Uji 6',
      nik: '3273050904100002',
      isNikVerified: true,
      statusIdentitasKhusus: 'anak_berhadapan_hukum',
      tempatLahir: 'Bandung',
      tanggalLahir: '2010-04-09',
      usia: 16,
      jenisKelamin: 'Laki-laki',
      pekerjaan: 'Pelajar SMK Kelas 1',
      alamatKtp: 'Kec. Bojongloa Kaler, Kota Bandung',
      alamatDomisili: 'Kec. Bojongloa Kaler, Kota Bandung',
      namaWaliPendamping: 'Wali Terperiksa Test-6 & Petugas BAPAS',
      kontakWali: '0813-2211-9988'
    },
    perkara: {
      id: 'perk-068',
      nomorLaporanPolisi: 'LP/A/105/VIII/2026/SPKT.SATRESNARKOBA/POLRESTA BANDUNG',
      tanggalLp: '2026-08-09',
      instansiPenyidik: 'Unit PPA / Sat Resnarkoba Polresta Bandung',
      namaPenyidik: 'Penyidik Pembantu Test-4',
      nomorHpPenyidik: '0812-4455-6677',
      pasalDipersangkakan: 'Pasal 127 ayat (1) huruf a UU No. 35/2009 jo UU No. 11/2012 tentang Sistem Peradilan Pidana Anak (SPPA)',
      tempatKejadianPerkara: 'Area taman dekat sekolah, Bandung',
      tanggalWaktuPenangkapan: '2026-08-09 16:00 WIB',
      kronologiSingkat: 'Terperiksa anak diamankan saat menggunakan obat keras daftar G (Tramadol / Trihexyphenidyl) bersama teman sebayanya.',
      barangBuktiList: [
        {
          id: 'bb-068-1',
          jenisZat: 'Tramadol (Obat Keras Daftar G)',
          beratBersihGram: 0,
          statusUjiLab: 'positif',
          keterangan: '4 butir Tramadol 50mg'
        }
      ]
    },
    timAsesmen: {
      sekretariatNama: 'Petugas Sekretariat Test-1',
      asesorMedisNama: 'Dokter Asesor Medis Test-1',
      asesorHukumNama: 'Asesor Hukum Test-1',
      jadwalPleno: '2026-08-14 10:00 WIB',
      lokasiPemeriksaan: 'Ruang Khusus Anak BNN Kota Bandung'
    },
    dokumenList: [],
    rekomendasiResmi: {
      nomorSurat: 'REK-TAT/068/VIII/2026/BNNP-JABAR',
      tanggalTerbit: '2026-08-14',
      dibuatOleh: 'Sekretariat TAT BNNP Jawa Barat',
      ringkasanMedis: 'Penyalahgunaan zat sedatif/analgetik derajat ringan pada anak, membutuhkan konseling psikologis remaja dan pendampingan keluarga.',
      ringkasanHukum: 'Memenuhi syarat Diversi berdasarkan UU No. 11 Tahun 2012 tentang SPPA. Disepakati pengembalian ke orang tua dengan kewajiban rawat jalan di IPWL.',
      rekomendasiFinalText: 'Rekomendasi diversi dan rehabilitasi rawat jalan selama 2 bulan di Klinik Pratama BNN Kota Bandung.',
      isLengkapPengesahan: true,
      qrVerificationCode: 'ETAT-VERIF-2026-068-ABH91',
      filePdfSimulasiUrl: '#',
      daftarPengesah: [
        { id: 's-68-1', nama: 'Dokter Asesor Medis Test-1', jabatan: 'Asesor Medis', instansi: 'RSUD Bandung', status: 'disahkan', tanggalPengesahan: '2026-08-14 11:00' },
        { id: 's-68-2', nama: 'Asesor Hukum Test-1', jabatan: 'Asesor Hukum', instansi: 'Kejari Bandung', status: 'disahkan', tanggalPengesahan: '2026-08-14 11:30' },
        { id: 's-68-3', nama: 'Koordinator TAT Test-1', jabatan: 'Ketua TAT', instansi: 'BNNP Jabar', status: 'disahkan', tanggalPengesahan: '2026-08-14 13:00' }
      ]
    },
    tindakLanjut: {
      id: 'tl-068',
      jenisTindakLanjut: 'Diversi / Restorative Justice',
      namaFasilitasTujuan: 'Klinik Pratama BNN Kota Bandung (IPWL)',
      kontakFasilitas: '(022) 2503201',
      statusRujukan: 'klien_mulai_layanan',
      tanggalRujukanDikirim: '2026-08-15',
      tanggalKonfirmasiFasilitas: '2026-08-16',
      tanggalMulaiLayanan: '2026-08-18',
      penanggungJawabTindakLanjut: 'Pembimbing Kemasyarakatan BAPAS & Dokter Klinik BNN',
      statusProsesHukumTerkait: 'Kesepakatan Diversi disahkan oleh Pengadilan Negeri Bandung. Proses pidana dihentikan demi kepentingan terbaik anak.',
      terakhirDiperbarui: '2026-08-20 10:00'
    },
    pengawasanKlien: {
      id: 'pgw-068',
      statusKepatuhan: 'sangat_patuh',
      modalitasLayanan: 'Rawat Jalan',
      durasiBulan: 2,
      tanggalMulai: '2026-08-18',
      tanggalTargetSelesai: '2026-10-18',
      instansiPelaksanaRehab: 'Klinik Pratama BNN Kota Bandung (IPWL)',
      konselorPendamping: 'Konselor Adiksi Pratama Test-1, S.Psi',
      penyidikPengawas: 'Penyidik Pembantu Test-4 (Polresta Bandung)',
      petugasBapas: 'Pembimbing Kemasyarakatan Bapas Bandung Test-1',
      totalSesiWajib: 12,
      sesiTerselesaikan: 8,
      jumlahMangkir: 0,
      suratPeringatanList: [],
      riwayatTesUrinBerkala: [
        {
          id: 'urin-068-1',
          tanggalTes: '2026-08-18',
          tahapKe: 1,
          jenisPemeriksaan: 'Terjadwal',
          parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
          hasil: 'Negatif',
          keterangan: 'Skrining intake awal rehabilitasi rawat jalan. Tidak terdeteksi zat.',
          petugasPemeriksa: 'Analis Lab Klinik BNN Test-1'
        },
        {
          id: 'urin-068-2',
          tanggalTes: '2026-09-02',
          tahapKe: 2,
          jenisPemeriksaan: 'Terjadwal',
          parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
          hasil: 'Negatif',
          keterangan: 'Evaluasi berkala minggu ke-2. Klien kooperatif dan aktif di sekolah.',
          petugasPemeriksa: 'Analis Lab Klinik BNN Test-1'
        },
        {
          id: 'urin-068-3',
          tanggalTes: '2026-09-16',
          tahapKe: 3,
          jenisPemeriksaan: 'Acak (Random)',
          parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
          hasil: 'Negatif',
          keterangan: 'Uji acak mendadak saat sesi konseling. Hasil konfirmasi bersih.',
          petugasPemeriksa: 'Analis Lab Klinik BNN Test-1'
        }
      ],
      jurnalPengawasan: [
        {
          id: 'jrn-068-1',
          tanggal: '2026-08-18',
          jenisKegiatan: 'Konseling Individu',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Intake perdana. Klien berkomitmen mengikuti program diversi bersama wali.',
          petugasPengawas: 'Konselor Adiksi Pratama Test-1, S.Psi',
          instansiPengawas: 'Klinik Pratama BNN Kota Bandung'
        },
        {
          id: 'jrn-068-2',
          tanggal: '2026-08-25',
          jenisKegiatan: 'Wajib Lapor Mingguan',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Sesi wajib lapor didampingi ibu terperiksa. Menunjukkan kepatuhan jadwal sekolah.',
          petugasPengawas: 'Pembimbing Kemasyarakatan Bapas Bandung Test-1',
          instansiPengawas: 'Bapas Kelas I Bandung'
        },
        {
          id: 'jrn-068-3',
          tanggal: '2026-09-02',
          jenisKegiatan: 'Sesi Terapi Kelompok',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Terapi kelompok remaja sebaya: latihan asertif menolak tawaran obat terlarang.',
          petugasPengawas: 'Konselor Adiksi Pratama Test-1, S.Psi',
          instansiPengawas: 'Klinik Pratama BNN Kota Bandung'
        },
        {
          id: 'jrn-068-4',
          tanggal: '2026-09-09',
          jenisKegiatan: 'Wajib Lapor Mingguan',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Laporan mingguan teratur. Hubungan dengan keluarga membaik signifikan.',
          petugasPengawas: 'Penyidik Pembantu Test-4',
          instansiPengawas: 'Sat Resnarkoba Polresta Bandung'
        },
        {
          id: 'jrn-068-5',
          tanggal: '2026-09-16',
          jenisKegiatan: 'Home Visit (Kunjungan Rumah)',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Kunjungan rumah oleh PK Bapas dan konselor. Lingkungan keluarga kondusif dan mendukung.',
          petugasPengawas: 'Pembimbing Kemasyarakatan Bapas Bandung Test-1',
          instansiPengawas: 'Bapas Kelas I Bandung'
        }
      ],
      rekomendasiTindakLanjutHukum: 'Diusulkan Surat Keterangan Selesai'
    },
    catatanPengecualian: {
      tipe: 'anak_berhadapan_hukum',
      keterangan: 'Perkara anak berhadapan dengan hukum (ABH). Wajib didampingi orang tua/wali dan PK BAPAS. Publikasi identitas dilarang keras.'
    },
    klarifikasiList: [],
    auditLogs: [
      {
        id: 'aud-61',
        timestamp: '2026-08-18 09:30',
        actorNama: 'Petugas Sekretariat Test-1',
        actorPeran: 'sekretariat',
        aksi: 'Konfirmasi Masuk Layanan Rehab',
        rincian: 'Klien anak Terperiksa Test-6 mulai menjalani sesi perdana konseling rawat jalan di Klinik BNN Bandung.'
      }
    ]
  },

  // KASUS 7: PENGAWASAN PASCA TAT DENGAN PERINGATAN (SP-1 KARENA MANGKIR 1X)
  {
    id: 'tat-055',
    nomorPermohonan: 'TAT/2026/08/055',
    tanggalPengajuan: '2026-08-01',
    tenggatSlaTanggal: '2026-08-06',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    statusProsesUtama: 'selesai_tindak_lanjut',
    statusMedis: 'siap_dibahas',
    statusHukum: 'siap_dibahas',
    statusDokumen: 'resmi_terbit',
    statusTindakLanjut: 'terlaksana',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Penyidik Pengaju Test-1',
    instansiPengaju: 'Sat Resnarkoba Polresta Bandung',
    penanggungJawabBerikutnya: 'Konselor Klinik BNN & Penyidik Pengawas',
    tindakanBerikutnyaLabel: 'Pengawasan Klien: Dalam status Peringatan SP-1 akibat mangkir 1x sesi wajib lapor',
    terperiksa: {
      id: 'trp-055',
      namaLengkap: 'Terperiksa Test-7 (Dalam Pengawasan SP-1)',
      alias: 'Subjek Uji 7',
      nik: '3273011508930005',
      isNikVerified: true,
      tempatLahir: 'Bandung',
      tanggalLahir: '1993-08-15',
      usia: 33,
      jenisKelamin: 'Laki-laki',
      pekerjaan: 'Wiraswasta Kuliner',
      alamatKtp: 'Kec. Lengkong, Kota Bandung',
      alamatDomisili: 'Kec. Lengkong, Kota Bandung',
      namaWaliPendamping: 'Keluarga Terperiksa Test-7',
      kontakWali: '0812-7788-9900'
    },
    perkara: {
      id: 'perk-055',
      nomorLaporanPolisi: 'LP/A/92/VIII/2026/SPKT.SATRESNARKOBA/POLRESTA BANDUNG',
      tanggalLp: '2026-07-31',
      instansiPenyidik: 'Sat Resnarkoba Polresta Bandung',
      namaPenyidik: 'Penyidik Pengaju Test-1',
      nomorHpPenyidik: '0813-8899-1122',
      pasalDipersangkakan: 'Pasal 127 ayat (1) huruf a UU No. 35/2009',
      tempatKejadianPerkara: 'Kec. Lengkong, Kota Bandung',
      tanggalWaktuPenangkapan: '2026-07-31 21:00 WIB',
      kronologiSingkat: 'Diamankan saat mengonsumsi ganja di tempat tinggal. BB di bawah ambang SEMA No. 04/2010 (0.8 gr).',
      barangBuktiList: [
        {
          id: 'bb-055-1',
          jenisZat: 'Ganja / Kanabis Kering',
          beratBersihGram: 0.8,
          statusUjiLab: 'positif',
          keterangan: '1 bungkus kertas kecil'
        }
      ]
    },
    timAsesmen: {
      sekretariatNama: 'Petugas Sekretariat Test-1',
      asesorMedisNama: 'Dokter Asesor Medis Test-1',
      asesorHukumNama: 'Asesor Hukum Test-1',
      jadwalPleno: '2026-08-05 10:00 WIB',
      lokasiPemeriksaan: 'Ruang TAT BNN Kota Bandung'
    },
    dokumenList: [],
    rekomendasiResmi: {
      nomorSurat: 'REK-TAT/055/VIII/2026/BNNP-JABAR',
      tanggalTerbit: '2026-08-05',
      dibuatOleh: 'Sekretariat TAT BNNP Jawa Barat',
      ringkasanMedis: 'Penyalahgunaan zat kanabis derajat sedang. Direkomendasikan rawat jalan 3 bulan.',
      ringkasanHukum: 'Penyalahguna murni, memenuhi syarat Restorative Justice Polri sesuai Perpol No. 08/2021.',
      rekomendasiFinalText: 'Rekomendasi Restorative Justice dengan kewajiban menjalani Rehabilitasi Rawat Jalan 3 bulan di Klinik Pratama BNN Kota Bandung.',
      isLengkapPengesahan: true,
      qrVerificationCode: 'ETAT-VERIF-2026-055-RJ88',
      filePdfSimulasiUrl: '#',
      daftarPengesah: [
        { id: 's-55-1', nama: 'Dokter Asesor Medis Test-1', jabatan: 'Asesor Medis', instansi: 'RSUD Bandung', status: 'disahkan', tanggalPengesahan: '2026-08-05 11:00' },
        { id: 's-55-2', nama: 'Asesor Hukum Test-1', jabatan: 'Asesor Hukum', instansi: 'Kejari Bandung', status: 'disahkan', tanggalPengesahan: '2026-08-05 11:30' },
        { id: 's-55-3', nama: 'Koordinator TAT Test-1', jabatan: 'Ketua TAT', instansi: 'BNNP Jabar', status: 'disahkan', tanggalPengesahan: '2026-08-05 14:00' }
      ]
    },
    tindakLanjut: {
      id: 'tl-055',
      jenisTindakLanjut: 'Diversi / Restorative Justice',
      namaFasilitasTujuan: 'Klinik Pratama BNN Kota Bandung (IPWL)',
      kontakFasilitas: '(022) 2503201',
      statusRujukan: 'klien_mulai_layanan',
      tanggalRujukanDikirim: '2026-08-06',
      tanggalKonfirmasiFasilitas: '2026-08-07',
      tanggalMulaiLayanan: '2026-08-10',
      penanggungJawabTindakLanjut: 'Konselor Adiksi Klinik BNN & Penyidik Polresta',
      statusProsesHukumTerkait: 'Penyidikan dihentikan bersyarat melalui Surat Perintah Penghentian Penyidikan (SP3) RJ dengan syarat kepatuhan penuh program rehab.',
      terakhirDiperbarui: '2026-09-18 11:30'
    },
    pengawasanKlien: {
      id: 'pgw-055',
      statusKepatuhan: 'dalam_peringatan',
      modalitasLayanan: 'Rawat Jalan',
      durasiBulan: 3,
      tanggalMulai: '2026-08-10',
      tanggalTargetSelesai: '2026-11-10',
      instansiPelaksanaRehab: 'Klinik Pratama BNN Kota Bandung (IPWL)',
      konselorPendamping: 'Konselor Adiksi Pratama Test-1, S.Psi',
      penyidikPengawas: 'Penyidik Pengaju Test-1 (Sat Resnarkoba Polresta)',
      totalSesiWajib: 16,
      sesiTerselesaikan: 6,
      jumlahMangkir: 1,
      suratPeringatanList: [
        {
          nomorSp: 'SP-1/TAT-AWAS/055/IX/2026',
          tingkatSp: 'SP-1 (Peringatan Awal)',
          tanggalSp: '2026-09-14',
          alasan: 'Klien tidak hadir pada sesi wajib lapor mingguan ke-5 tanggal 12 September tanpa keterangan sah. Peringatan keras diberikan: jika mangkir kembali akan diterbitkan SP-2 dan eskalasi ke penyidik.',
          diterbitkanOleh: 'Konselor Klinik BNN & Disetujui Penyidik Pengawas'
        }
      ],
      riwayatTesUrinBerkala: [
        {
          id: 'urin-055-1',
          tanggalTes: '2026-08-10',
          tahapKe: 1,
          jenisPemeriksaan: 'Terjadwal',
          parameter: ['THC', 'MET', 'AMP'],
          hasil: 'Negatif',
          keterangan: 'Skrining awal admisi rawat jalan.',
          petugasPemeriksa: 'Analis Lab Klinik BNN Test-1'
        },
        {
          id: 'urin-055-2',
          tanggalTes: '2026-09-01',
          tahapKe: 2,
          jenisPemeriksaan: 'Terjadwal',
          parameter: ['THC', 'MET', 'AMP'],
          hasil: 'Negatif',
          keterangan: 'Evaluasi bulan ke-1. Hasil tes urin bersih dari metabolit kanabis.',
          petugasPemeriksa: 'Analis Lab Klinik BNN Test-1'
        },
        {
          id: 'urin-055-3',
          tanggalTes: '2026-09-15',
          tahapKe: 3,
          jenisPemeriksaan: 'Acak (Random)',
          parameter: ['THC', 'MET', 'AMP'],
          hasil: 'Negatif',
          keterangan: 'Uji urin wajib paska pemanggilan SP-1. Hasil tetap negatif.',
          petugasPemeriksa: 'Analis Lab Klinik BNN Test-1'
        }
      ],
      jurnalPengawasan: [
        {
          id: 'jrn-055-1',
          tanggal: '2026-08-10',
          jenisKegiatan: 'Konseling Individu',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Sesi intake & penetapan jadwal wajib lapor tiap hari Jumat.',
          petugasPengawas: 'Konselor Adiksi Pratama Test-1, S.Psi',
          instansiPengawas: 'Klinik Pratama BNN Kota Bandung'
        },
        {
          id: 'jrn-055-2',
          tanggal: '2026-08-17',
          jenisKegiatan: 'Wajib Lapor Mingguan',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Sesi evaluasi pemicu stres kerja dan manajemen waktu.',
          petugasPengawas: 'Konselor Adiksi Pratama Test-1, S.Psi',
          instansiPengawas: 'Klinik Pratama BNN Kota Bandung'
        },
        {
          id: 'jrn-055-3',
          tanggal: '2026-08-24',
          jenisKegiatan: 'Sesi Terapi Kelompok',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Mengikuti diskusi kelompok pemulihan adiksi.',
          petugasPengawas: 'Konselor Adiksi Pratama Test-1, S.Psi',
          instansiPengawas: 'Klinik Pratama BNN Kota Bandung'
        },
        {
          id: 'jrn-055-4',
          tanggal: '2026-09-01',
          jenisKegiatan: 'Pemeriksaan Urin',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Tes urin bulan ke-1 hasil negatif.',
          petugasPengawas: 'Analis Lab Klinik BNN Test-1',
          instansiPengawas: 'Klinik Pratama BNN Kota Bandung'
        },
        {
          id: 'jrn-055-5',
          tanggal: '2026-09-12',
          jenisKegiatan: 'Wajib Lapor Mingguan',
          statusKehadiran: 'Mangkir / Tanpa Kabar',
          catatanPerkembangan: 'Klien tidak hadir dan nomor ponsel tidak merespons saat dihubungi petugas. Petugas menerbitkan SP-1.',
          petugasPengawas: 'Konselor Adiksi Pratama Test-1, S.Psi',
          instansiPengawas: 'Klinik Pratama BNN Kota Bandung'
        },
        {
          id: 'jrn-055-6',
          tanggal: '2026-09-15',
          jenisKegiatan: 'Konseling Individu',
          statusKehadiran: 'Hadir',
          catatanPerkembangan: 'Klien hadir memenuhi panggilan SP-1 didampingi wali. Mengakui lalai karena urusan pekerjaan. Berjanji patuh pada jadwal sisa.',
          petugasPengawas: 'Konselor Adiksi Pratama Test-1, S.Psi',
          instansiPengawas: 'Klinik Pratama BNN Kota Bandung'
        }
      ],
      rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi'
    },
    klarifikasiList: [],
    auditLogs: [
      {
        id: 'aud-55-1',
        timestamp: '2026-09-14 14:00',
        actorNama: 'Petugas Fasilitas Rehab Test-1',
        actorPeran: 'rehabilitasi',
        aksi: 'Penerbitan SP-1 Klien Mangkir',
        rincian: 'Diterbitkan SP-1/TAT-AWAS/055/IX/2026 karena mangkir sesi wajib lapor tanggal 12 September 2026.'
      }
    ]
  }
];
