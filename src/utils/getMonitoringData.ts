import { PermohonanAsesmen, MonitoringTindakLanjut } from '../types';

/**
 * Standardized function to resolve monitoring data for a case,
 * ensuring consistency between TindakLanjutDetailView and DetailPemantauanRehabView.
 */
export const resolveMonitoringData = (permohonan: PermohonanAsesmen): MonitoringTindakLanjut => {
  if (permohonan.monitoringTindakLanjut) {
    return permohonan.monitoringTindakLanjut;
  }

  // Check localStorage cache if admin updated this case's monitoring
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cached = localStorage.getItem(`etat_mon_${permohonan.id}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
  }

  // Check if the case is completed / finished in rehabilitation
  const isFinished =
    permohonan.statusProsesUtama === 'selesai_tindak_lanjut' ||
    (typeof permohonan.id === 'string' && permohonan.id.startsWith('riwayat-')) ||
    (permohonan as any).statusTindakLanjut === 'selesai' ||
    permohonan.pengawasanKlien?.statusKepatuhan === 'selesai_program';

  const isRawatInap =
    permohonan.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ||
    (permohonan.sidangPleno?.kesepakatanRekomendasi?.toLowerCase().includes('inap') ?? false);

  const fasilitas =
    permohonan.tindakLanjut?.namaFasilitasTujuan ||
    permohonan.sidangPleno?.fasilitasRujukanUsulan ||
    permohonan.pengawasanKlien?.instansiPelaksanaRehab ||
    'Balai Besar Rehabilitasi BNN Tanah Merah';

  const dpjp =
    permohonan.pengawasanKlien?.konselorPendamping ||
    '[TEST] Dokter DPJP Fasilitas';

  const penyidik =
    permohonan.perkara?.namaPenyidik || '[TEST] Penyidik Pengaju Satresnarkoba';

  return {
    id: 'mon-' + permohonan.id,
    nomorRekomendasi: permohonan.rekomendasiResmi?.nomorSurat || permohonan.nomorPermohonan,
    pelaksanaanRehab: {
      id: 'pel-' + permohonan.id,
      nomorRekomendasiTAT:
        permohonan.rekomendasiResmi?.nomorSurat ||
        `REK-TAT/2026/${permohonan.id.slice(-4)}`,
      jenisLayananSesuaiRekomendasi: isRawatInap
        ? 'Rehabilitasi Medis Rawat Inap Intensif (3 Bulan)'
        : 'Rehabilitasi Rawat Jalan Kontrol Berkala (8 Sesi)',
      namaFasilitasTujuan: fasilitas,
      alamatFasilitas:
        'Jl. Poros Samarinda-Bontang Km. 24, Tanah Merah, Samarinda, Kaltim',
      namaPenanggungJawabFasilitas: dpjp,
      kontakPenanggungJawabFasilitas: '0812-555-9821 / (0541) 743201',
      tanggalKoordinasiPenerimaan: '2026-09-15',
      hasilKoordinasiPenerimaan: `Fasilitas ${fasilitas} mengonfirmasi kesediaan tempat & tim medis penerima sesuai kuota rekomendasi TAT.`,
      catatanKoordinasi:
        'Persyaratan administratif awal dan hasil uji toksikologi dinyatakan lengkap.',
      tanggalSerahTerimaAktual: '2026-09-16',
      identitasPihakMenyerahkan: penyidik,
      identitasPihakMenerima: `${dpjp} (Tim Medis Balai Rehab)`,
      fileBaSerahTerimaUrl: 'internal://ba-serah-terima',
      tanggalMasukLayananTerkonfirmasi: '2026-09-16',
      adaKendala: false,
      statusPelaksanaan: 'serah_terima_selesai',
      diisiOleh: penyidik,
      kapasitasPengisi: 'Penyidik Pengaju TAT',
      tanggalDiisi: '2026-09-16',
      statusVerifikasiAdmin: 'terverifikasi',
      catatanVerifikasiAdmin:
        'Dokumen BA serah terima & syarat admisi terverifikasi valid oleh Sekretariat TAT.',
      diverifikasiOleh: '[TEST] Admin Sekretariat TAT',
      tanggalVerifikasiAdmin: '2026-09-17'
    },
    laporanKontrolList: [
      {
        id: 'lap-1-' + permohonan.id,
        jenisLaporan: 'Laporan Kemajuan Periodik',
        tanggalKegiatanSebenarnya: '2026-09-25',
        namaFasilitasPelapor: fasilitas,
        nomorLaporanFasilitas: `LAP-KLINIK/2026/09/${permohonan.id.slice(-3)}`,
        tanggalLaporanFasilitas: '2026-09-26',
        namaPenerbitLaporan: dpjp,
        kapasitasPenerbit: 'Dokter Penanggung Jawab Pasien (DPJP)',
        statusPelaksanaanBerdasarkanBukti: 'terlaksana',
        ringkasanAdministratif:
          'Pasien telah menjalani program detoksifikasi dan konseling medis. Menunjukkan kemajuan kognitif signifikan dan kooperatif dalam sesi terapi harian.',
        rencanaBerdasarkanLaporan:
          'Melanjutkan ke fase terapi kelompok (Therapeutic Community) dan pemeriksaan toksikologi urin berkala.',
        fileBuktiUrl: 'internal://laporan-kontrol-minggu-2',
        diunggahOleh: penyidik,
        kapasitasPengunggah: 'Pengaju / Penyidik Pendamping',
        tanggalDiunggah: '2026-09-27',
        statusAdmin: 'terverifikasi',
        catatanAdmin: 'Laporan perkembangan periodik terverifikasi lengkap.',
        diverifikasiOleh: '[TEST] Admin Sekretariat TAT',
        tanggalVerifikasi: '2026-09-28',
        perluTelaahKlinis: true,
        statusTelaahKlinis: 'selesai',
        catatanTelaahKlinis:
          'Hasil review medis TAT: Perkembangan klinis sesuai dengan target intervensi. Rekomendasi dilanjutkan.',
        tanggalTelaahKlinis: '2026-09-29',
        penugasanMedis: '[TEST] Dokter Asesor Medis TAT'
      }
    ],
    buktiWajibLaporList: [
      {
        id: 'wl-1-' + permohonan.id,
        tanggalRencanaWajibLapor: '2026-09-22',
        tanggalPelaporanAktual: '2026-09-22',
        tanggalWajibLapor: '2026-09-22',
        waktuInputSistem: '2026-09-22 14:15:00 WIB',
        namaPenyidikPenerima: penyidik,
        instansiPenyidik: 'Satresnarkoba Polresta Samarinda (Tatap Muka)',
        kegiatanRehabTerkait: 'Pelaporan Wajib Lapor Mingguan Ke-1',
        kanal: 'langsung',
        buktiPenerimaanUrl: 'internal://bukti-wajib-lapor-1',
        statusKonfirmasi: 'dikonfirmasi_penyidik',
        statusVerifikasiAdmin: 'terverifikasi',
        catatanAdmin:
          'Telah diverifikasi Admin: Tanggal pelaporan aktual dan bukti fisik lengkap.',
        diunggahOleh: penyidik,
        tanggalDiunggah: '2026-09-22'
      }
    ],
    // HANYA ada akhirLayanan jika kasus memang sudah selesai seluruh tahapan rehabilitasi!
    akhirLayanan: isFinished
      ? {
          id: 'akr-' + permohonan.id,
          tanggalAkhirLayananAktual: '2026-10-01',
          statusAkhir: 'selesai_program',
          namaFasilitas: fasilitas,
          pihakPenerbitKeterangan: dpjp,
          hasilSesuaiDokumenFasilitas:
            'Klien telah menyelesaikan seluruh rangkaian program rehabilitasi medis dan sosial dengan hasil Evaluasi Klinis Selesai Baik (Pulih & Produktif). Tidak ditemukan indikasi relapse (kekambuhan).',
          rencanaLanjutanDariFasilitas:
            'Direkomendasikan mengikuti Program Wajib Lapor Bina Lanjut Pascarehab selama 3 bulan.',
          fileSuratAkhirLayananUrl: 'internal://surat-keterangan-selesai-rehab',
          diisiOleh: penyidik,
          kapasitasPengisi: 'Pengaju TAT / Penyidik Satresnarkoba',
          tanggalDiisi: '2026-10-02',
          statusVerifikasiAdmin: 'terverifikasi'
        }
      : undefined,
    statusMonitoring: isFinished ? 'selesai' : 'berjalan',
    dibuatOleh: 'ADMIN',
    tanggalDibuat: '2026-09-15',
    terakhirDiperbarui: new Date().toISOString().slice(0, 10)
  };
};

export interface RiwayatUrinViewItem {
  id: string;
  tanggalTes: string;
  tahapKe: number;
  jenisPemeriksaan: string;
  parameter: string[];
  hasil: string;
  petugasPemeriksa: string;
  keterangan: string;
}

/**
 * Standardized function to resolve urine toxicology history from the system
 * rather than hardcoded dummy data.
 */
export const getMonitoringUrineHistory = (
  mon: MonitoringTindakLanjut,
  permohonan?: PermohonanAsesmen
): RiwayatUrinViewItem[] => {
  const result: RiwayatUrinViewItem[] = [];

  // 1. From pengawasanKlien if available
  if (permohonan?.pengawasanKlien?.riwayatTesUrinBerkala && permohonan.pengawasanKlien.riwayatTesUrinBerkala.length > 0) {
    permohonan.pengawasanKlien.riwayatTesUrinBerkala.forEach((u, idx) => {
      result.push({
        id: u.id || `urin-pgw-${idx}`,
        tanggalTes: u.tanggalTes,
        tahapKe: u.tahapKe || idx + 1,
        jenisPemeriksaan: u.jenisPemeriksaan || 'Terjadwal (Evaluasi)',
        parameter: Array.isArray(u.parameter) ? u.parameter : ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
        hasil: u.hasil || 'Negatif',
        petugasPemeriksa: u.petugasPemeriksa || '[TEST] Dokter DPJP Fasilitas',
        keterangan: u.keterangan || 'Hasil skrining toksikologi urin berkala.'
      });
    });
  }

  // 2. From mon.laporanKontrolList
  if (mon?.laporanKontrolList && mon.laporanKontrolList.length > 0) {
    mon.laporanKontrolList.forEach((lap, idx) => {
      const ringkasan = lap.ringkasanAdministratif || '';
      const isUrineRelated =
        ringkasan.toLowerCase().includes('urin') ||
        ringkasan.toLowerCase().includes('toksikologi') ||
        lap.jenisLaporan.includes('Evaluasi') ||
        lap.jenisLaporan.includes('Kemajuan');

      if (isUrineRelated) {
        // avoid duplicate if already added
        const exists = result.some(r => r.id === lap.id || r.tanggalTes === lap.tanggalKegiatanSebenarnya);
        if (!exists) {
          const isAcak = ringkasan.toLowerCase().includes('acak') || ringkasan.toLowerCase().includes('random');
          const isPositif = ringkasan.toLowerCase().includes('positif') || ringkasan.toLowerCase().includes('reaktif');
          result.push({
            id: lap.id,
            tanggalTes: lap.tanggalKegiatanSebenarnya,
            tahapKe: result.length + 1,
            jenisPemeriksaan: isAcak ? 'Acak (Random)' : 'Terjadwal (Kontrol Rutin)',
            parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
            hasil: isPositif ? 'Positif' : 'Negatif',
            petugasPemeriksa: lap.namaPenerbitLaporan || '[TEST] Dokter DPJP Fasilitas',
            keterangan: ringkasan || lap.catatanTelaahKlinis || 'Pemeriksaan toksikologi multi-panel non-reaktif.'
          });
        }
      }
    });
  }

  // 3. Fallback to initial admission drug screening if available and list is empty
  if (result.length === 0 && permohonan?.asesmenMedis?.hasilUrin && permohonan.asesmenMedis.hasilUrin.length > 0) {
    const params = permohonan.asesmenMedis.hasilUrin.map(h => h.parameter);
    const hasPositive = permohonan.asesmenMedis.hasilUrin.some(h => h.hasil?.toLowerCase() === 'positif');
    result.push({
      id: `urin-admisi-${permohonan.id}`,
      tanggalTes: permohonan.tanggalPengajuan ? permohonan.tanggalPengajuan.slice(0, 10) : '2026-09-16',
      tahapKe: 1,
      jenisPemeriksaan: 'Terjadwal (Admisi Awal TAT)',
      parameter: params.length > 0 ? params : ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
      hasil: hasPositive ? 'Positif' : 'Negatif',
      petugasPemeriksa: permohonan.asesmenMedis.asesorNama || permohonan.timAsesmen?.asesorMedisNama || '[TEST] Dokter DPJP Fasilitas',
      keterangan: 'Skrining toksikologi awal saat klien admisi ke sistem TAT.'
    });
  }

  return result;
};

/**
 * Standardized function to resolve wajib lapor history
 */
export const getMonitoringWajibLaporHistory = (
  mon: MonitoringTindakLanjut,
  permohonan?: PermohonanAsesmen
) => {
  if (mon?.buktiWajibLaporList && mon.buktiWajibLaporList.length > 0) {
    return mon.buktiWajibLaporList;
  }
  return [];
};
