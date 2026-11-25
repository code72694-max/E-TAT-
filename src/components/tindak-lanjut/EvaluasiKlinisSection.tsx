import React, { useState } from 'react';
import {
  Stethoscope,
  Syringe,
  FilePlus,
  Info,
} from 'lucide-react';
import type {
  PermohonanAsesmen,
  MonitoringTindakLanjut,
  LaporanKontrol,
  JenisLaporanKontrol,
  UserRole,
} from '../../types';
import { getMonitoringUrineHistory } from '../../utils/getMonitoringData';
import {
  genId,
  today,
  JENIS_LAPORAN_OPTIONS,
  SectionHeader,
  FieldGroup,
  type SaveConfirmInfo,
} from './shared';

export const EvaluasiKlinisSection: React.FC<{
  monitoring: MonitoringTindakLanjut;
  permohonan: PermohonanAsesmen;
  userRole: UserRole;
  activeBatchKe: number;
  readOnly?: boolean;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
  onSaveSuccess?: (info: SaveConfirmInfo) => void;
}> = ({ monitoring, permohonan, userRole, activeBatchKe, readOnly, onUpdate, onSaveSuccess }) => {
  const [showUrineModal, setShowUrineModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [urinJenis, setUrinJenis] = useState<'Terjadwal' | 'Acak (Random)'>('Acak (Random)');
  const [urinHasil, setUrinHasil] = useState<'Negatif' | 'Positif'>('Negatif');
  const [urinKet, setUrinKet] = useState('Pemeriksaan toksikologi 5-panel menunjukkan non-reaktif.');

  const [jenisLaporan, setJenisLaporan] = useState<JenisLaporanKontrol>('Laporan Evaluasi Klinis');
  const [ringkasanKlinis, setRingkasanKlinis] = useState('Klien menjalani terapi medis rutin. Skor WHO-ASSIST menurun signifikan, kestabilan emosi dan fisik pulih.');

  const riwayatUrin = getMonitoringUrineHistory(monitoring, permohonan);
  const currentBatchKe = activeBatchKe;

  const extractBatchNum = (text?: string, fallback?: number) => {
    const match = text?.match(/Laporan Ke-(\d+)/i);
    return match ? Number(match[1]) : fallback;
  };

  const handleAddUrine = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: LaporanKontrol = {
      id: genId(),
      jenisLaporan: 'Laporan Kemajuan Periodik',
      nomorLaporanFasilitas: `Laporan Ke-${currentBatchKe}`,
      tanggalKegiatanSebenarnya: today(),
      namaFasilitasPelapor: monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehab BNN',
      namaPenerbitLaporan: 'Tim Laboratorium Toksikologi Medis',
      kapasitasPenerbit: 'Analis Medis / Dokter DPJP',
      statusPelaksanaanBerdasarkanBukti: urinHasil === 'Negatif' ? 'terlaksana' : 'tidak_terlaksana',
      ringkasanAdministratif: `[Laporan Ke-${currentBatchKe}] Uji Toksikologi Urin Berkala (${urinJenis}): Hasil ${urinHasil.toUpperCase()} (AMP, MET, THC, BZO, MOP). ${urinKet}`,
      diunggahOleh: userRole,
      kapasitasPengunggah: 'Tim Medis TAT',
      tanggalDiunggah: today(),
      statusAdmin: 'terverifikasi',
      perluTelaahKlinis: true,
      statusTelaahKlinis: 'selesai',
      catatanTelaahKlinis: `Hasil Uji Toksikologi: ${urinHasil === 'Negatif' ? 'Bebas Zat Narkotika / Pulih' : 'POSITIF / Indikasi Relapse (Perlu Evaluasi Hukum)'}`
    };

    onUpdate({
      ...monitoring,
      laporanKontrolList: [newReport, ...monitoring.laporanKontrolList],
      terakhirDiperbarui: today()
    });
    setShowUrineModal(false);
    onSaveSuccess?.({
      title: `Hasil Tes Urin (Laporan Ke-${currentBatchKe}) Tersimpan`,
      description: `Hasil uji toksikologi urin untuk Laporan Ke-${currentBatchKe} telah disimpan. Tahap selanjutnya masuk ke Pengaju (Polsek/Polres) pada Tab 3: Jurnal Wajib Lapor (Laporan Ke-${currentBatchKe}).`,
      nextTab: 'wajib_lapor',
      nextStepLabel: `Lanjut ke Tab 3: Wajib Lapor (Laporan Ke-${currentBatchKe})`,
    });
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: LaporanKontrol = {
      id: genId(),
      jenisLaporan: jenisLaporan,
      nomorLaporanFasilitas: `Laporan Ke-${currentBatchKe}`,
      tanggalKegiatanSebenarnya: today(),
      namaFasilitasPelapor: monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehab BNN',
      namaPenerbitLaporan: permohonan.timAsesmen?.asesorMedisNama || 'Tim Medis TAT',
      kapasitasPenerbit: 'Dokter Penanggung Jawab Pasien (DPJP)',
      statusPelaksanaanBerdasarkanBukti: 'terlaksana',
      ringkasanAdministratif: `[Laporan Ke-${currentBatchKe}] ${ringkasanKlinis}`,
      diunggahOleh: userRole,
      kapasitasPengunggah: 'Tim Medis / DPJP',
      tanggalDiunggah: today(),
      statusAdmin: 'terverifikasi',
      perluTelaahKlinis: true,
      statusTelaahKlinis: 'selesai',
      catatanTelaahKlinis: 'Review Medis TAT: Terapi dan kontrol medis berjalan sesuai target JUKNIS.'
    };

    onUpdate({
      ...monitoring,
      laporanKontrolList: [newReport, ...monitoring.laporanKontrolList],
      terakhirDiperbarui: today()
    });
    setShowReportModal(false);
    onSaveSuccess?.({
      title: `Evaluasi Klinis Medis (Laporan Ke-${currentBatchKe}) Tersimpan`,
      description: `Catatan evaluasi klinis medis untuk Laporan Ke-${currentBatchKe} telah disimpan. Tahap selanjutnya masuk ke Pengaju (Polsek/Polres) pada Tab 3: Jurnal Wajib Lapor (Laporan Ke-${currentBatchKe}).`,
      nextTab: 'wajib_lapor',
      nextStepLabel: `Lanjut ke Tab 3: Wajib Lapor (Laporan Ke-${currentBatchKe})`,
    });
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Stethoscope className="w-4 h-4 text-slate-300" />}
        title="2. Input Evaluasi Klinis & Uji Toksikologi Urin Berkala (Input Medis)"
        subtitle="Rekam medis kontrol periodik, skrining tes urin berkala/acak (toksikologi), dan catatan perkembangan pasien."
      />

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-md font-mono font-semibold bg-[#144782] text-white border border-sky-400/25">
            Batch Aktif: Laporan Ke-{currentBatchKe}
          </span>
          <span className="text-slate-300">
            {readOnly
              ? riwayatUrin.length > 0
                ? `Tercatat ${riwayatUrin.length} pemeriksaan medis. Batch aktif saat ini: Laporan Ke-${currentBatchKe}.`
                : `Menunggu Tim Medis menginput Rekam Medis & Tes Urin untuk Laporan Ke-${currentBatchKe}.`
              : `Seluruh input medis pada tahap ini masuk ke Laporan Ke-${currentBatchKe} hingga Wajib Lapor Ke-${currentBatchKe} diselesaikan Pengaju.`}
          </span>
        </div>
      </div>

      {readOnly && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Mode Hanya Baca (Read-Only): Data rekam medis &amp; hasil tes urin diinput oleh Tim Medis. Pengaju dapat memantau hasilnya di sini sebelum mencatat Wajib Lapor.</span>
        </div>
      )}

      {/* Action Input Buttons */}
      {!readOnly && (
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowUrineModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Syringe className="w-3.5 h-3.5 text-sky-200" />
            <span>+ Input Hasil Tes Urin</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <FilePlus className="w-3.5 h-3.5 text-sky-400" />
            <span>+ Input Evaluasi Klinis Medis</span>
          </button>
        </div>
      )}

      {/* Modal Input Urin */}
      {showUrineModal && (
        <form onSubmit={handleAddUrine} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Syringe className="w-3.5 h-3.5 text-slate-400" /> Input Hasil Skrining Urin Berkala (Toksikologi)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldGroup label="Jenis Pemeriksaan Urin">
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" value={urinJenis} onChange={e => setUrinJenis(e.target.value as any)}>
                <option value="Acak (Random)">Acak (Random / Uji Mendadak)</option>
                <option value="Terjadwal">Terjadwal (Kontrol Rutin)</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Hasil Uji Multi-Panel (AMP, MET, THC, BZO, MOP)" required>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" value={urinHasil} onChange={e => setUrinHasil(e.target.value as any)}>
                <option value="Negatif">NEGATIF (Bebas Zat / Non-Reaktif)</option>
                <option value="Positif">POSITIF (Terdeteksi Zat / Relapse)</option>
              </select>
            </FieldGroup>
          </div>
          <FieldGroup label="Catatan Laboratorium / Keterangan Skrining">
            <input className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" value={urinKet} onChange={e => setUrinKet(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-lg text-xs font-semibold cursor-pointer shadow-sm">Simpan Hasil Uji</button>
            <button type="button" className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowUrineModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {/* Modal Input Laporan Medis */}
      {showReportModal && (
        <form onSubmit={handleAddReport} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" /> Input Laporan Evaluasi Klinis Medis
          </h4>
          <FieldGroup label="Jenis Laporan">
            <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" value={jenisLaporan} onChange={e => setJenisLaporan(e.target.value as any)}>
              {JENIS_LAPORAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup label="Ringkasan Catatan Evaluasi Klinis Medis" required>
            <textarea className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" rows={3} value={ringkasanKlinis} onChange={e => setRingkasanKlinis(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-lg text-xs font-semibold cursor-pointer shadow-sm">Simpan Evaluasi Medis</button>
            <button type="button" className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowReportModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {/* Urine & Evaluasi Cards */}
      <div className="space-y-3">
        {riwayatUrin.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-400 space-y-1.5">
            <Syringe className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="font-semibold text-slate-300">Belum Ada Rekam Uji Toksikologi Urin</p>
            <p className="text-[11px] text-slate-400">
              {readOnly
                ? 'Menunggu Tim Medis menginput hasil pemeriksaan toksikologi urin atau evaluasi klinis.'
                : 'Klik tombol "+ Input Hasil Tes Urin" di atas untuk mencatat pemeriksaan urin berkala pasien.'}
            </p>
          </div>
        ) : (
          riwayatUrin.map((urin, idx) => {
            const laporanKeNum = extractBatchNum(urin.keterangan, riwayatUrin.length - idx);
            return (
              <div
                key={urin.id}
                className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-3 text-xs hover:border-slate-700 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-white bg-[#144782] border border-sky-400/25 px-2.5 py-0.5 rounded-md text-[11px]">
                      Laporan Ke-{laporanKeNum}
                    </span>
                    <span className="font-medium text-slate-200 bg-slate-800/80 border border-slate-700/70 px-2.5 py-0.5 rounded-md text-[11px]">
                      {urin.jenisPemeriksaan}
                    </span>
                    <span className={`font-semibold px-2.5 py-0.5 rounded-md text-[11px] ${
                      urin.hasil.toLowerCase() === 'positif'
                        ? 'text-rose-300 bg-rose-950/80 border border-rose-500/30'
                        : 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/30'
                    }`}>
                      {urin.hasil.toLowerCase() === 'positif' ? '⚠ POSITIF' : '✓ NEGATIF'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{urin.tanggalTes}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Parameter 5-Panel</span>
                    <span className="font-mono font-semibold text-slate-200 mt-0.5 block">
                      {Array.isArray(urin.parameter) ? urin.parameter.join(', ') : 'AMP, MET, THC, BZO, MOP'}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Pemeriksa / Analis</span>
                    <span className="text-slate-200 font-medium mt-0.5 block truncate">{urin.petugasPemeriksa}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Catatan Medis</span>
                    <span className="text-slate-300 mt-0.5 block">{urin.keterangan}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
