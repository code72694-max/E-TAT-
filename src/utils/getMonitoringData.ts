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
    pelaksanaanRehab: undefined,
    laporanKontrolList: [],
    buktiWajibLaporList: [],
    akhirLayanan: isFinished
      ? {
          id: 'akr-' + permohonan.id,
          tanggalAkhirLayananAktual: new Date().toISOString().slice(0, 10),
          statusAkhir: 'selesai_program',
          namaFasilitas: fasilitas,
          pihakPenerbitKeterangan: dpjp,
          hasilSesuaiDokumenFasilitas:
            'Program rehabilitasi telah dinyatakan selesai berdasarkan rekam tindak lanjut sistem TAT.',
          rencanaLanjutanDariFasilitas:
            'Direkomendasikan mengikuti Program Wajib Lapor Bina Lanjut Pascarehab.',
          fileSuratAkhirLayananUrl: 'internal://surat-keterangan-selesai-rehab',
          diisiOleh: penyidik,
          kapasitasPengisi: 'Tim Medis / Admin TAT',
          tanggalDiisi: new Date().toISOString().slice(0, 10),
          statusVerifikasiAdmin: 'terverifikasi'
        }
      : undefined,
    statusMonitoring: isFinished ? 'selesai' : 'menunggu_pelaksanaan',
    dibuatOleh: 'ADMIN',
    tanggalDibuat: permohonan.tanggalPengajuan
      ? permohonan.tanggalPengajuan.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
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
      tanggalTes: permohonan.tanggalPengajuan ? permohonan.tanggalPengajuan.slice(0, 10) : new Date().toISOString().slice(0, 10),
      tahapKe: 1,
      jenisPemeriksaan: 'Terjadwal (Admisi Awal TAT)',
      parameter: params.length > 0 ? params : ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
      hasil: hasPositive ? 'Positif' : 'Negatif',
      petugasPemeriksa: permohonan.asesmenMedis.asesorNama || permohonan.timAsesmen?.asesorMedisNama || 'Tim Medis TAT',
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
