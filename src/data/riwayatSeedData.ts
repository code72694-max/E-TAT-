import { PermohonanAsesmen } from '../types';

/**
 * Data Seed Khusus untuk Riwayat & Arsip Asesmen TAT (/dashboard/riwayat)
 * Berisi berkas permohonan yang statusnya sudah BENAR-BENAR SELESAI / FINISHED:
 * - RESULTS_ISSUED (Rekomendasi Terbit)
 * - VERIFIED_IMPLEMENTED (Selesai Tindak Lanjut)
 * - REJECTED (Permohonan Ditolak / Terindikasi Jaringan)
 * - OUT_OF_SCOPE_REFERRED (Dirujuk Non-TAT)
 */
export const riwayatPermohonanSeedList: PermohonanAsesmen[] = [
  {
    id: 'riwayat-tat-001',
    nomorPermohonan: 'TAT/2026/08/0012',
    trackingNumber: 'TRACK-202608-012',
    tanggalPengajuan: '12/08/2026 09:15 WIB',
    tenggatSlaTanggal: '18/08/2026',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    satuanKerjaTujuan: 'BNNP DKI Jakarta',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Ipda Budi Santoso, S.H.',
    pengajuEmail: 'code72694@gmail.com',
    instansiPengaju: 'Satresnarkoba Polres Metro Jakarta Pusat',
    penanggungJawabBerikutnya: 'Selesai / Terarsip',
    tindakanBerikutnyaLabel: 'Rekomendasi TAT telah terbit dan diserahkan ke Penyidik & Balai Rehab.',
    applicationStatus: 'RESULTS_ISSUED',
    medicalStatus: 'COMPLETED',
    legalStatus: 'COMPLETED',
    deliveryStatus: 'DELIVERED_LEGAL',
    followupStatus: 'VERIFIED_IMPLEMENTED',
    statusProsesUtama: 'rekomendasi_terbit',
    statusMedis: 'selesai',
    statusHukum: 'selesai',
    statusDokumen: 'lengkap',
    statusTindakLanjut: 'selesai',
    terperiksa: {
      id: 'terperiksa-001',
      namaLengkap: 'Budi Hermawan',
      alias: 'Budi Bin Slamet',
      nik: '3171012345670088',
      isNikVerified: true,
      tempatLahir: 'Jakarta',
      tanggalLahir: '15/05/1992',
      jenisKelamin: 'Laki-Laki',
      pekerjaan: 'Wiraswasta Swasta',
      alamatKtp: 'Jl. Kramat Raya No. 45, Senen, Jakarta Pusat',
      noHp: '081299887766'
    },
    perkara: {
      id: 'perkara-001',
      nomorLaporanPolisi: 'LP/A/302/VIII/2026/SPKT/POLRES_JAKPUS',
      tanggalLaporanPolisi: '10/08/2026',
      instansiPenyidik: 'Satresnarkoba Polres Metro Jakarta Pusat',
      namaPenyidik: 'Ipda Budi Santoso, S.H.',
      noHpPenyidik: '081298765432',
      pasalDisangkakan: 'Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009 tentang Narkotika',
      peranTersangka: 'Penyalahguna / Korban',
      kronologiSingkat: 'Tersangka ditangkap di indekos wilayah Senen dengan barang bukti 1 plastik klip berisi sabu sisa pakai 0.45 gram. Hasil tes urin awal di Polres menunjukkan Positif Metamfetamina.',
      barangBuktiList: [
        {
          id: 'bb-01',
          jenisZat: 'Metamfetamina (Sabu)',
          beratBersihGram: 0.45,
          keterangan: '1 Plastik Klip Bening Sisa Pakai (Disita Sah)'
        }
      ]
    },
    dokumenList: [
      {
        id: 'doc-01',
        nama: 'Surat Permohonan Asesmen TAT dari Penyidik',
        wajib: true,
        statusVerifikasi: 'sesuai',
        catatanKoreksi: 'Lengkap dan sesuai SOP',
        versi: 1,
        fileName: 'Surat_Permohonan_TAT_Polres_Jakpus.pdf',
        fileSize: '850 KB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-02',
        nama: 'Laporan Polisi (LP)',
        wajib: true,
        statusVerifikasi: 'sesuai',
        versi: 1,
        fileName: 'LP_A_302_VIII_2026.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-03',
        nama: 'Berita Acara Pemeriksaan (BAP) Saksi & Tersangka',
        wajib: true,
        statusVerifikasi: 'sesuai',
        versi: 1,
        fileName: 'BAP_Tersangka_Budi_Hermawan.pdf',
        fileSize: '2.4 MB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-04',
        nama: 'Surat Perintah Penangkapan & Penahanan (Spin-Kap/Han)',
        wajib: true,
        statusVerifikasi: 'sesuai',
        versi: 1,
        fileName: 'Spinkap_Spinhan_Polres_Jakpus.pdf',
        fileSize: '980 KB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-05',
        nama: 'Hasil Penimbangan & Segel Barang Bukti Pegadaian',
        wajib: true,
        statusVerifikasi: 'sesuai',
        versi: 1,
        fileName: 'BA_Timbang_Pegadaian_Sabu_0.45g.pdf',
        fileSize: '650 KB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-06',
        nama: 'Hasil Uji Laboratorium Forensik Barang Bukti (Labfor)',
        wajib: true,
        statusVerifikasi: 'sesuai',
        versi: 1,
        fileName: 'Hasil_Labfor_Polri_Positif_MET.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-07',
        nama: 'Hasil Tes Urin Sementara dari Penyidik/RS',
        wajib: true,
        statusVerifikasi: 'sesuai',
        versi: 1,
        fileName: 'Hasil_Skrining_Urin_Dokkes.pdf',
        fileSize: '540 KB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-08',
        nama: 'Surat Keterangan Bebas Covid-19 / Bebas Penyakit Menular',
        wajib: false,
        statusVerifikasi: 'sesuai',
        versi: 1,
        fileName: 'Suket_Sehat_Puskesmas.pdf',
        fileSize: '420 KB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-09',
        nama: 'Surat Pernyataan Kesediaan Rehabilitasi & Persetujuan Keluarga',
        wajib: true,
        statusVerifikasi: 'sesuai',
        versi: 1,
        fileName: 'Surat_Pernyataan_Keluarga.pdf',
        fileSize: '710 KB',
        uploadedAt: '12/08/2026 09:15 WIB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ],
    timAsesmen: {
      sekretariatNama: 'Kompol Arya Wicaksono, S.I.K.',
      asesorMedisNama: 'dr. Ratna Sp.KJ',
      asesorHukumNama: 'Agus Pratama, S.H., M.H.',
      jadwalPemeriksaanMedis: '14/08/2026 09:00 WIB',
      jadwalPemeriksaanHukum: '14/08/2026 13:00 WIB',
      jadwalPleno: '15/08/2026 10:00 WIB',
      lokasiPemeriksaan: 'Ruang Asesmen Terpadu BNNP DKI Jakarta'
    },
    asesmenMedis: {
      id: 'med-001',
      tanggalAsesmen: '14/08/2026',
      asesorNama: 'dr. Ratna Sp.KJ',
      skorInstrumen: 32,
      tingkatRisikoInstrumen: 'Tinggi (Ketergantungan)',
      diagnosisKlinisIcd: 'F15.2 (Sindrom Ketergantungan Stimulansia)',
      kebutuhanRawat: 'Rawat Inap',
      durasiUsulanBulan: 3,
      interpretasiKlinis: 'Klien menunjukkan toleransi zat yang tinggi dan adiksi fisik sedang. Membutuhkan perawatan rehabilitasi medis rawat inap 3 bulan.',
      catatanKhusus: 'Kondisi fisik stabil, siap dilanjutkan ke Sidang Pleno.',
      hasilUrin: [
        { parameter: 'MET (Metamfetamina / Sabu)', hasil: 'Positif' },
        { parameter: 'AMP (Amfetamina)', hasil: 'Positif' },
        { parameter: 'THC (Ganja / Kanabis)', hasil: 'Negatif' },
        { parameter: 'BZO (Benzodiazepin)', hasil: 'Negatif' },
        { parameter: 'MOP (Morfin / Opiat)', hasil: 'Negatif' }
      ]
    },
    asesmenHukum: {
      id: 'huk-001',
      tanggalAsesmen: '14/08/2026',
      asesorNama: 'Agus Pratama, S.H., M.H.',
      peranTersangka: 'Penyalahguna / Korban',
      kualifikasiHukum: 'Memenuhi Kriteria Rehabilitasi (SE MA No. 4/2010)',
      analisisHukum: 'Tersangka bukan bagian dari jaringan peredaran gelap narkotika. Barang bukti sabu 0.45 gram berada di bawah ambang batas (1.0 gram). Penyelidikan independen mengonfirmasi tersangka adalah korban penyalahgunaan.',
      kesimpulanHukum: 'Direkomendasikan rehabilitasi medis dan sosial sesuai ketentuan pasal 54 dan pasal 127 UU Narkotika.'
    },
    sidangPleno: {
      id: 'pleno-001',
      tanggalPleno: '15/08/2026',
      nomorBeritaAcara: 'BA-PLENO/TAT/2026/08/0012',
      jenisRekomendasiFinal: 'Rehabilitasi Medis Rawat Inap 3 Bulan',
      catatanPleno: 'Disetujui secara mufakat oleh seluruh tim asesor medis, hukum, dan penyidik.',
      pesertaList: ['Kompol Arya Wicaksono', 'dr. Ratna Sp.KJ', 'Agus Pratama, S.H.', 'Ipda Budi Santoso']
    },
    rekomendasiResmi: {
      id: 'rek-001',
      nomorSurat: 'REK-TAT/2026/08/0012',
      tanggalTerbit: '16/08/2026',
      isLengkapPengesahan: true,
      daftarPengesah: [
        { id: 'p1', nama: 'Kompol Arya Wicaksono, S.I.K.', jabatan: 'Ketua Tim Sekretariat TAT', status: 'disahkan', tanggalDisahkan: '16/08/2026 09:00 WIB' },
        { id: 'p2', nama: 'dr. Ratna Sp.KJ', jabatan: 'Asesor Medis TAT', status: 'disahkan', tanggalDisahkan: '16/08/2026 09:30 WIB' },
        { id: 'p3', nama: 'Agus Pratama, S.H., M.H.', jabatan: 'Asesor Hukum TAT', status: 'disahkan', tanggalDisahkan: '16/08/2026 09:45 WIB' },
        { id: 'p4', nama: 'Ipda Budi Santoso, S.H.', jabatan: 'Penyidik Pengaju', status: 'disahkan', tanggalDisahkan: '16/08/2026 10:00 WIB' }
      ]
    },
    tindakLanjut: {
      id: 'tl-001',
      namaFasilitasTujuan: 'Balai Rehabilitasi BNN Tanah Merah',
      statusRujukan: 'klien_mulai_layanan',
      tanggalKonfirmasiFasilitas: '18/08/2026',
      tanggalMulaiLayanan: '18/08/2026'
    },
    auditLogs: [
      { id: 'a1', timestamp: '12/08/2026 09:15 WIB', actorNama: 'Ipda Budi Santoso, S.H.', actorPeran: 'pengaju', aksi: 'PENGAJUAN_BARU', rincian: 'Mendaftarkan permohonan asesmen TAT baru' },
      { id: 'a2', timestamp: '12/08/2026 14:20 WIB', actorNama: 'Kompol Arya Wicaksono', actorPeran: 'sekretariat', aksi: 'VERIFIKASI_BERKAS', rincian: 'Seluruh berkas administrasi terverifikasi 100% lengkap' },
      { id: 'a3', timestamp: '14/08/2026 11:30 WIB', actorNama: 'dr. Ratna Sp.KJ', actorPeran: 'medis', aksi: 'INPUT_ASESMEN_MEDIS', rincian: 'Rekomendasi rawat inap 3 bulan' },
      { id: 'a4', timestamp: '14/08/2026 15:00 WIB', actorNama: 'Agus Pratama, S.H.', actorPeran: 'hukum', aksi: 'INPUT_ASESMEN_HUKUM', rincian: 'Tersangka terindikasi korban penyalahguna' },
      { id: 'a5', timestamp: '15/08/2026 11:00 WIB', actorNama: 'Kompol Arya Wicaksono', actorPeran: 'sekretariat', aksi: 'SIDANG_PLENO', rincian: 'BA Pleno diterbitkan dengan keputusan Rehabilitasi Rawat Inap' },
      { id: 'a6', timestamp: '16/08/2026 10:00 WIB', actorNama: 'Kompol Arya Wicaksono', actorPeran: 'sekretariat', aksi: 'PENGESAHAN_TTE', rincian: 'Surat Rekomendasi Resmi disahkan 100% TTE dan diterbitkan' }
    ],
    klarifikasiList: []
  },

  {
    id: 'riwayat-tat-002',
    nomorPermohonan: 'TAT/2026/07/0088',
    trackingNumber: 'TRACK-202607-088',
    tanggalPengajuan: '20/07/2026 10:30 WIB',
    tenggatSlaTanggal: '26/07/2026',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    satuanKerjaTujuan: 'BNNP DKI Jakarta',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Ipda Budi Santoso, S.H.',
    pengajuEmail: 'code72694@gmail.com',
    instansiPengaju: 'Satresnarkoba Polres Metro Jakarta Pusat',
    penanggungJawabBerikutnya: 'Selesai / Terarsip',
    tindakanBerikutnyaLabel: 'Rekomendasi Rehabilitasi Rawat Jalan 6 Bulan telah selesai dilaksanakan.',
    applicationStatus: 'VERIFIED_IMPLEMENTED',
    medicalStatus: 'COMPLETED',
    legalStatus: 'COMPLETED',
    deliveryStatus: 'DELIVERED_LEGAL',
    followupStatus: 'VERIFIED_IMPLEMENTED',
    statusProsesUtama: 'selesai_tindak_lanjut',
    statusMedis: 'selesai',
    statusHukum: 'selesai',
    statusDokumen: 'lengkap',
    statusTindakLanjut: 'selesai',
    terperiksa: {
      id: 'terperiksa-002',
      namaLengkap: 'Siti Nurhaliza',
      alias: 'Siti',
      nik: '3172025508940005',
      isNikVerified: true,
      tempatLahir: 'Jakarta',
      tanggalLahir: '25/08/1994',
      jenisKelamin: 'Perempuan',
      pekerjaan: 'Karyawan Swasta',
      alamatKtp: 'Jl. Palmerah Barat No. 12, Jakarta Barat',
      noHp: '081377665544'
    },
    perkara: {
      id: 'perkara-002',
      nomorLaporanPolisi: 'LP/A/215/VII/2026/SPKT/POLRES_JAKBAR',
      tanggalLaporanPolisi: '18/07/2026',
      instansiPenyidik: 'Satresnarkoba Polres Metro Jakarta Barat',
      namaPenyidik: 'Ipda Budi Santoso, S.H.',
      noHpPenyidik: '081298765432',
      pasalDisangkakan: 'Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009 tentang Narkotika',
      peranTersangka: 'Penyalahguna / Korban',
      kronologiSingkat: 'Tersangka diamankan di sebuah kafe daerah Palmerah saat menggunakan psikotropika golongan IV. BB berupa 2 butir Alprazolam.',
      barangBuktiList: [
        {
          id: 'bb-02',
          jenisZat: 'Alprazolam (Benzodiazepin)',
          beratBersihGram: 0.2,
          keterangan: '2 Butir Tablet Alprazolam 1mg'
        }
      ]
    },
    dokumenList: [],
    timAsesmen: {
      sekretariatNama: 'Kompol Arya Wicaksono, S.I.K.',
      asesorMedisNama: 'dr. Ratna Sp.KJ',
      asesorHukumNama: 'Agus Pratama, S.H., M.H.',
      jadwalPemeriksaanMedis: '22/07/2026 10:00 WIB',
      jadwalPemeriksaanHukum: '22/07/2026 14:00 WIB',
      jadwalPleno: '24/07/2026 09:00 WIB',
      lokasiPemeriksaan: 'Klinik Pratama BNNP DKI'
    },
    asesmenMedis: {
      id: 'med-002',
      tanggalAsesmen: '22/07/2026',
      asesorNama: 'dr. Ratna Sp.KJ',
      skorInstrumen: 18,
      tingkatRisikoInstrumen: 'Sedang (Penggunaan Rekreasional)',
      diagnosisKlinisIcd: 'F13.1 (Penggunaan Penenang yang Merugikan)',
      kebutuhanRawat: 'Rawat Jalan',
      durasiUsulanBulan: 6,
      interpretasiKlinis: 'Penggunaan rekreasional akibat tingkat kecemasan kerja. Direkomendasikan konseling individu rawat jalan 6 bulan.',
      hasilUrin: [
        { parameter: 'BZO (Benzodiazepin)', hasil: 'Positif' },
        { parameter: 'MET (Metamfetamina)', hasil: 'Negatif' }
      ]
    },
    asesmenHukum: {
      id: 'huk-002',
      tanggalAsesmen: '22/07/2026',
      asesorNama: 'Agus Pratama, S.H., M.H.',
      peranTersangka: 'Penyalahguna / Korban',
      kualifikasiHukum: 'Memenuhi Kriteria Rehabilitasi Rawat Jalan',
      analisisHukum: 'BB di bawah kriteria perber. Tersangka kooperatif dan tidak pernah berurusan dengan hukum sebelumnya.',
      kesimpulanHukum: 'Rekomendasi Rehabilitasi Rawat Jalan.'
    },
    sidangPleno: {
      id: 'pleno-002',
      tanggalPleno: '24/07/2026',
      nomorBeritaAcara: 'BA-PLENO/TAT/2026/07/0088',
      jenisRekomendasiFinal: 'Rehabilitasi Medis Rawat Jalan 6 Bulan',
      catatanPleno: 'Sidang Pleno menyetujui rawat jalan di Klinik Pratama BNNP.'
    },
    rekomendasiResmi: {
      id: 'rek-002',
      nomorSurat: 'REK-TAT/2026/07/0088',
      tanggalTerbit: '25/07/2026',
      isLengkapPengesahan: true,
      daftarPengesah: []
    },
    tindakLanjut: {
      id: 'tl-002',
      namaFasilitasTujuan: 'Klinik Pratama BNNP DKI Jakarta',
      statusRujukan: 'klien_mulai_layanan',
      tanggalMulaiLayanan: '26/07/2026'
    },
    auditLogs: [
      { id: 'a21', timestamp: '20/07/2026 10:30 WIB', actorNama: 'Ipda Budi Santoso', actorPeran: 'pengaju', aksi: 'PENGAJUAN_BARU', rincian: 'Permohonan diajukan' },
      { id: 'a22', timestamp: '25/07/2026 14:00 WIB', actorNama: 'Kompol Arya Wicaksono', actorPeran: 'sekretariat', aksi: 'PENGESAHAN_TTE', rincian: 'Rekomendasi terbit' }
    ],
    klarifikasiList: []
  },

  {
    id: 'riwayat-tat-003',
    nomorPermohonan: 'TAT/2026/06/0045',
    trackingNumber: 'TRACK-202606-045',
    tanggalPengajuan: '05/06/2026 14:00 WIB',
    tenggatSlaTanggal: '11/06/2026',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    satuanKerjaTujuan: 'BNNP DKI Jakarta',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Ipda Budi Santoso, S.H.',
    pengajuEmail: 'code72694@gmail.com',
    instansiPengaju: 'Satresnarkoba Polres Metro Jakarta Pusat',
    penanggungJawabBerikutnya: 'Selesai (Permohonan Ditolak)',
    tindakanBerikutnyaLabel: 'Permohonan Asesmen TAT Ditolak berdasarkan keputusan Sidang Pleno (Terindikasi Jaringan Pengedar).',
    applicationStatus: 'REJECTED',
    medicalStatus: 'COMPLETED',
    legalStatus: 'COMPLETED',
    deliveryStatus: 'DELIVERED_LEGAL',
    followupStatus: 'NOT_APPLICABLE',
    statusProsesUtama: 'ditolak',
    statusMedis: 'selesai',
    statusHukum: 'selesai',
    statusDokumen: 'lengkap',
    statusTindakLanjut: 'ditolak',
    terperiksa: {
      id: 'terperiksa-003',
      namaLengkap: 'Hendra Kurniawan',
      alias: 'Hendra / Ko Hendra',
      nik: '3173041102880002',
      isNikVerified: true,
      tempatLahir: 'Bandung',
      tanggalLahir: '11/02/1988',
      jenisKelamin: 'Laki-Laki',
      pekerjaan: 'Pengusaha hiburan malam',
      alamatKtp: 'Jl. Mangga Besar IX No. 88, Jakarta Barat',
      noHp: '081122334455'
    },
    perkara: {
      id: 'perkara-003',
      nomorLaporanPolisi: 'LP/A/140/VI/2026/SPKT/POLDA_METRO',
      tanggalLaporanPolisi: '03/06/2026',
      instansiPenyidik: 'Ditresnarkoba Polda Metro Jaya',
      namaPenyidik: 'AKP Agus Pratama, S.H.',
      noHpPenyidik: '081399887766',
      pasalDisangkakan: 'Pasal 114 ayat (2) jo Pasal 112 ayat (2) UU No. 35 Tahun 2009 tentang Narkotika',
      peranTersangka: 'Kurir / Jaringan Pengedar',
      kronologiSingkat: 'Tersangka ditangkap saat transaksi narkotika jenis Ekstasi (MDMA) sejumlah 500 butir. Hasil pendalaman digital forensik mengonfirmasi keterlibatan tersangka dalam jaringan pengedar antarprovinsi.',
      barangBuktiList: [
        {
          id: 'bb-03',
          jenisZat: 'Ekstasi (MDMA)',
          beratBersihGram: 145.0,
          keterangan: '500 Butir Tablet Ekstasi Logo Minion (145 gram)'
        }
      ]
    },
    dokumenList: [],
    asesmenMedis: {
      id: 'med-003',
      tanggalAsesmen: '08/06/2026',
      asesorNama: 'dr. Ratna Sp.KJ',
      skorInstrumen: 8,
      tingkatRisikoInstrumen: 'Rendah (Non-Ketergantungan)',
      diagnosisKlinisIcd: 'Z72.8 (Masalah Gaya Hidup)',
      kebutuhanRawat: 'Tidak Membutuhkan Rehabilitasi',
      durasiUsulanBulan: 0,
      interpretasiKlinis: 'Subjek tidak menunjukkan ketergantungan fisik maupun psikologis pada zat. Penggunaan bersifat instrumental.',
      hasilUrin: [
        { parameter: 'MET (Metamfetamina)', hasil: 'Negatif' },
        { parameter: 'AMP (Amfetamina)', hasil: 'Negatif' }
      ]
    },
    asesmenHukum: {
      id: 'huk-003',
      tanggalAsesmen: '08/06/2026',
      asesorNama: 'Agus Pratama, S.H., M.H.',
      peranTersangka: 'Kurir / Pengedar',
      kualifikasiHukum: 'TIDAK Memenuhi Kriteria Rehabilitasi (Jaringan Pengedar)',
      analisisHukum: 'Barang bukti 145 gram MDMA (500 butir) jauh melampaui batas Maksimal SEMA 04/2010. Tersangka terbukti secara sah bertindak sebagai kurir/penyedia tempat transaksi.',
      kesimpulanHukum: 'Tolak Permohonan TAT. Proses hukum dilanjutkan ke tingkat Penuntutan Pidana Umum.'
    },
    sidangPleno: {
      id: 'pleno-003',
      tanggalPleno: '09/06/2026',
      nomorBeritaAcara: 'BA-PLENO/TAT/2026/06/0045-TOLAK',
      jenisRekomendasiFinal: 'Ditolak - Proses Pidana Dilanjutkan',
      catatanPleno: 'Keputusan bulat Pleno TAT: Permohonan ditolak karena tersangka terbukti pengedar.'
    },
    auditLogs: [
      { id: 'a31', timestamp: '05/06/2026 14:00 WIB', actorNama: 'AKP Agus Pratama', actorPeran: 'pengaju', aksi: 'PENGAJUAN_BARU', rincian: 'Permohonan TAT diajukan' },
      { id: 'a32', timestamp: '09/06/2026 15:30 WIB', actorNama: 'Kompol Arya Wicaksono', actorPeran: 'sekretariat', aksi: 'PENOLAKAN_PLENO', rincian: 'Permohonan ditolak berdasarkan keputusan Pleno TAT' }
    ],
    klarifikasiList: []
  },

  {
    id: 'riwayat-tat-004',
    nomorPermohonan: 'TAT/2026/05/0019',
    trackingNumber: 'TRACK-202605-019',
    tanggalPengajuan: '14/05/2026 11:15 WIB',
    tenggatSlaTanggal: '20/05/2026',
    isMendekatiTenggat: false,
    isMelewatiTenggat: false,
    satuanKerjaTujuan: 'BNNP DKI Jakarta',
    pengajuId: 'user-pengaju',
    pengajuNama: 'Ipda Budi Santoso, S.H.',
    pengajuEmail: 'code72694@gmail.com',
    instansiPengaju: 'Satresnarkoba Polres Metro Jakarta Pusat',
    penanggungJawabBerikutnya: 'Selesai (Dirujuk Non-TAT)',
    tindakanBerikutnyaLabel: 'Berkas dirujuk ke Layanan Rehabilitasi Mandiri / Non-TAT.',
    applicationStatus: 'OUT_OF_SCOPE_REFERRED',
    medicalStatus: 'COMPLETED',
    legalStatus: 'COMPLETED',
    deliveryStatus: 'DELIVERED_LEGAL',
    followupStatus: 'VERIFIED_IMPLEMENTED',
    statusProsesUtama: 'selesai',
    statusMedis: 'selesai',
    statusHukum: 'selesai',
    statusDokumen: 'lengkap',
    statusTindakLanjut: 'selesai',
    terperiksa: {
      id: 'terperiksa-004',
      namaLengkap: 'Ahmad Subagyo',
      alias: 'Bagyo',
      nik: '3174051809910007',
      isNikVerified: true,
      tempatLahir: 'Surakarta',
      tanggalLahir: '18/09/1991',
      jenisKelamin: 'Laki-Laki',
      pekerjaan: 'Buruh Harian Lepas',
      alamatKtp: 'Jl. Tebet Timur Dalam No. 19, Jakarta Selatan',
      noHp: '081566778899'
    },
    perkara: {
      id: 'perkara-004',
      nomorLaporanPolisi: 'LP/A/095/V/2026/SPKT/POLRES_JAKSEL',
      tanggalLaporanPolisi: '12/05/2026',
      instansiPenyidik: 'Satresnarkoba Polres Metro Jakarta Selatan',
      namaPenyidik: 'Ipda Budi Santoso, S.H.',
      noHpPenyidik: '081298765432',
      pasalDisangkakan: 'Pasal 127 UU Narkotika',
      peranTersangka: 'Penyalahguna Mandiri (Residivis > 2 kali)',
      kronologiSingkat: 'Subjek mengajukan rehabilitasi secara sukarela pasca operasi kepolisian. Merupakan kasus residivis yang telah 2 kali masuk balai rehabilitasi resmi.',
      barangBuktiList: [
        {
          id: 'bb-04',
          jenisZat: 'Tembakau Sintetis (Gorila)',
          beratBersihGram: 0.15,
          keterangan: 'Sisa Pakai Tembakau Sintetis'
        }
      ]
    },
    dokumenList: [],
    sidangPleno: {
      id: 'pleno-004',
      tanggalPleno: '18/05/2026',
      nomorBeritaAcara: 'BA-PLENO/TAT/2026/05/0019',
      jenisRekomendasiFinal: 'Dirujuk ke Rehabilitasi Mandiri Voluntary'
    },
    auditLogs: [
      { id: 'a41', timestamp: '14/05/2026 11:15 WIB', actorNama: 'Ipda Budi Santoso', actorPeran: 'pengaju', aksi: 'PENGAJUAN_BARU', rincian: 'Permohonan diajukan' },
      { id: 'a42', timestamp: '18/05/2026 16:00 WIB', actorNama: 'Kompol Arya Wicaksono', actorPeran: 'sekretariat', aksi: 'DIRUJUUK_NON_TAT', rincian: 'Subjek dirujuk ke program rehabilitasi sukarela mandiri' }
    ],
    klarifikasiList: []
  }
];
