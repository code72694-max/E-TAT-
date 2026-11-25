import React, { useState } from 'react';
import type {
  PermohonanAsesmen,
  MonitoringTindakLanjut,
  UserProfile,
} from '../types';
import { isSuspectExaminedByMedis } from '../utils/medisAuth';
import { tindakLanjutApi } from '../services/api';
import { LembarKendaliModal } from './LembarKendaliModal';
import { resolveMonitoringData, getMonitoringUrineHistory } from '../utils/getMonitoringData';
import { PelaksanaanRehabSection } from './tindak-lanjut/PelaksanaanRehabSection';
import { EvaluasiKlinisSection } from './tindak-lanjut/EvaluasiKlinisSection';
import { WajibLaporSection } from './tindak-lanjut/WajibLaporSection';
import { AkhirLayananSection } from './tindak-lanjut/AkhirLayananSection';
import { SaveConfirmModal, type SaveConfirmInfo } from './tindak-lanjut/shared';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Download,
  Info,
  CheckSquare,
  Stethoscope,
  Syringe,
  Printer,
  Award,
  MapPin,
  AlertCircle,
} from 'lucide-react';

interface Props {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onBack: () => void;
  initialTab?: string;
}

const getDetailTabFromProp = (tab?: string): 'pelaksanaan' | 'laporan' | 'wajib_lapor' | 'akhir' => {
  if (tab === 'tindak_lanjut_monitoring') return 'laporan';
  if (tab === 'tindak_lanjut_wajib_lapor') return 'wajib_lapor';
  if (tab === 'tindak_lanjut_rujukan') return 'akhir';
  if (tab === 'tindak_lanjut_pelaksanaan') return 'pelaksanaan';
  return 'pelaksanaan';
};

export const TindakLanjutDetailView: React.FC<Props> = ({
  permohonan,
  currentUser,
  onUpdatePermohonan,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'pelaksanaan' | 'laporan' | 'wajib_lapor' | 'akhir'>(
    getDetailTabFromProp(initialTab)
  );

  const initialMonitoring = permohonan.monitoringTindakLanjut ?? resolveMonitoringData(permohonan);
  const [monitoring, setMonitoring] = useState<MonitoringTindakLanjut>(initialMonitoring);
  const [showLembarKendali, setShowLembarKendali] = useState(false);
  const [saveConfirmModal, setSaveConfirmModal] = useState<SaveConfirmInfo | null>(null);

  const handleMonitoringUpdate = (updated: MonitoringTindakLanjut) => {
    setMonitoring(updated);
    onUpdatePermohonan({ ...permohonan, monitoringTindakLanjut: updated });

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`etat_mon_${permohonan.id}`, JSON.stringify(updated));
      } catch {}
    }

    if (permohonan.id && updated.pelaksanaanRehab) {
      const pel = updated.pelaksanaanRehab;
      tindakLanjutApi.updatePelaksanaan(permohonan.id, {
        namaFasilitasTujuan: pel.namaFasilitasTujuan,
        alamatFasilitas: pel.alamatFasilitas,
        kontakPenanggungJawabFasilitas: pel.kontakPenanggungJawabFasilitas,
        namaPenanggungJawabFasilitas: pel.namaPenanggungJawabFasilitas,
        tanggalKoordinasiPenerimaan: pel.tanggalKoordinasiPenerimaan ? new Date(pel.tanggalKoordinasiPenerimaan).toISOString() : undefined,
        hasilKoordinasiPenerimaan: pel.hasilKoordinasiPenerimaan,
        catatanKoordinasi: pel.catatanKoordinasi,
        tanggalSerahTerimaAktual: pel.tanggalSerahTerimaAktual ? new Date(pel.tanggalSerahTerimaAktual).toISOString() : undefined,
        identitasPihakMenyerahkan: pel.identitasPihakMenyerahkan,
        identitasPihakMenerima: pel.identitasPihakMenerima,
        tanggalMasukLayananTerkonfirmasi: pel.tanggalMasukLayananTerkonfirmasi ? new Date(pel.tanggalMasukLayananTerkonfirmasi).toISOString() : undefined,
        adaKendala: pel.adaKendala ?? false,
        kendala: pel.kendala,
        perbedaanDariRekomendasi: pel.perbedaanDariRekomendasi,
        statusPelaksanaan: pel.statusPelaksanaan ?? 'serah_terima_selesai',
      }).catch(err => console.warn('Backend tindakLanjutApi.updatePelaksanaan notice:', err));
    }
  };

  const isSelesaiRehab = Boolean(
    monitoring?.akhirLayanan &&
    (monitoring.statusMonitoring === 'selesai' || monitoring.akhirLayanan.statusAkhir === 'selesai_program')
  );

  const t = permohonan.terperiksa;
  const pgw = permohonan.pengawasanKlien;
  const tl = permohonan.tindakLanjut;
  const pleno = permohonan.sidangPleno;
  const rekom = permohonan.rekomendasiResmi;

  const namaFasilitas =
    tl?.namaFasilitasTujuan ||
    pgw?.instansiPelaksanaRehab ||
    monitoring?.pelaksanaanRehab?.namaFasilitasTujuan ||
    pleno?.fasilitasRujukanUsulan ||
    'Balai Besar Rehabilitasi BNN Tanah Merah Samarinda';

  const alamatFasilitas =
    monitoring?.pelaksanaanRehab?.alamatFasilitas ||
    'Jl. Poros Samarinda-Bontang Km. 24, Tanah Merah, Samarinda, Kalimantan Timur';

  const dpjp =
    monitoring?.pelaksanaanRehab?.namaPenanggungJawabFasilitas ||
    pgw?.konselorPendamping ||
    permohonan.timAsesmen?.asesorMedisNama ||
    'Dokter DPJP Fasilitas';

  const modalitas =
    pgw?.modalitasLayanan ||
    (permohonan.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ? 'Rehabilitasi Rawat Inap' : 'Rehabilitasi Rawat Jalan');

  const durasiBulan =
    pgw?.durasiBulan ||
    pleno?.durasiRehabBulan ||
    permohonan.asesmenMedis?.durasiUsulanBulan ||
    3;

  const tanggalMulai =
    pgw?.tanggalMulai ||
    monitoring?.pelaksanaanRehab?.tanggalMasukLayananTerkonfirmasi ||
    tl?.tanggalMulaiLayanan ||
    'Belum Dimulai';

  const tanggalTargetSelesai =
    pgw?.tanggalTargetSelesai ||
    (monitoring?.akhirLayanan?.tanggalAkhirLayananAktual ? monitoring.akhirLayanan.tanggalAkhirLayananAktual : 'Menunggu Jadwal Rehab');

  const tanggalKontrolBerikutnya =
    pgw?.tanggalKontrolBerikutnya ||
    monitoring?.buktiWajibLaporList?.find(w => w.tanggalRencanaWajibLapor)?.tanggalRencanaWajibLapor ||
    'Belum Dijadwalkan';

  const waktuKontrolBerikutnya =
    pgw?.waktuKontrolBerikutnya ||
    (tanggalKontrolBerikutnya === 'Belum Dijadwalkan' ? 'Menunggu jadwal wajib lapor' : '09:30 WITA');

  const catatanKontrolBerikutnya =
    pgw?.catatanKontrolBerikutnya ||
    'Wajib didampingi keluarga penjamin, membawa kartu kontrol klien, serta menjalani evaluasi skrining toksikologi urin berkala.';

  // Sesi, Toksikologi & Kepatuhan (100% Dinamis dari Data Aktual)
  const totalSesi = pgw?.totalSesiWajib || 12;
  const sesiAktual = (monitoring?.laporanKontrolList?.length || 0) + (monitoring?.buktiWajibLaporList?.length || 0);
  const sesiSelesai = isSelesaiRehab
    ? totalSesi
    : (pgw?.sesiTerselesaikan ?? sesiAktual);
  const persenSelesai = Math.min(100, Math.round((sesiSelesai / totalSesi) * 100));

  const riwayatUrinList = getMonitoringUrineHistory(monitoring, permohonan);
  const negUrineCount = riwayatUrinList.filter(u => u.hasil?.toLowerCase() !== 'positif').length;
  const posUrineCount = riwayatUrinList.filter(u => u.hasil?.toLowerCase() === 'positif').length;

  const hasSpRecord = monitoring?.laporanKontrolList?.some(
    l => l.jenisLaporan === 'Laporan Kejadian Khusus' || l.ringkasanAdministratif?.includes('SURAT PERINGATAN')
  );
  const jumlahWajibLapor = monitoring?.buktiWajibLaporList?.length || 0;
  const kepatuhanStatus = hasSpRecord
    ? 'Dalam Peringatan (SP)'
    : jumlahWajibLapor > 0
    ? 'Patuh Wajib Lapor'
    : 'Menunggu Pelaporan';
  const kepatuhanSub = hasSpRecord
    ? 'Terdapat catatan Surat Peringatan'
    : jumlahWajibLapor > 0
    ? `✓ ${jumlahWajibLapor}x Wajib Lapor Tercatat`
    : 'Belum ada catatan wajib lapor';

  const noSuratRekom = rekom?.nomorSurat || pleno?.nomorBeritaAcara || `R-TAT/2026/${permohonan.id.slice(-4)}`;

  // Batch aktif tetap sama (mis. Laporan Ke-1) mulai dari Admisi -> Medis -> sampai Wajib Lapor selesai dicatat
  const activeBatchKe = monitoring.buktiWajibLaporList.length + 1;

  const tabs = [
    { id: 'pelaksanaan' as const, label: '1. Admisi & Serah Terima', roleTag: 'Input Pengaju • Laporan Ke-1', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'laporan' as const, label: '2. Rekam Medis & Tes Urin', roleTag: `Input Medis • Laporan Ke-${activeBatchKe}`, icon: <Syringe className="w-3.5 h-3.5" /> },
    { id: 'wajib_lapor' as const, label: '3. Jurnal Wajib Lapor', roleTag: `Input Pengaju • Laporan Ke-${activeBatchKe}`, icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: 'akhir' as const, label: '4. Output Surat SKSR', roleTag: 'Input Pengaju', icon: <Award className="w-3.5 h-3.5" /> },
  ];

  const progress = {
    pelaksanaan: !!monitoring.pelaksanaanRehab,
    laporan: monitoring.laporanKontrolList.length > 0,
    wajib_lapor: monitoring.buktiWajibLaporList.length > 0,
    akhir: !!monitoring.akhirLayanan,
  };

  const userRoleUpper = (currentUser.role || '').toUpperCase();
  const isPengajuRole = userRoleUpper === 'PENGAJU';
  const isAdminRole = userRoleUpper === 'ADMIN' || userRoleUpper === 'SEKRETARIAT';
  const isMedisRole = userRoleUpper === 'MEDIS';
  const isMedisAuthorized = isMedisRole ? isSuspectExaminedByMedis(permohonan, currentUser) : true;

  // Hak Akses Edit per Tab sesuai Alur:
  const readOnlyTab1 = !(isPengajuRole || isAdminRole);
  const readOnlyTab2 = isPengajuRole || (isMedisRole && !isMedisAuthorized) || (!isMedisRole && !isAdminRole);
  const readOnlyTab3 = !(isPengajuRole || isAdminRole);
  // Tab 4 (Output SKSR): Hanya Pengaju / Admin (Medis Read-Only)
  const readOnlyTab4 = !(isPengajuRole || isAdminRole);

  const doctorName =
    permohonan.timAsesmen?.asesorMedisNama ||
    permohonan.asesmenMedis?.asesorNama ||
    (permohonan.asesmenMedis as any)?.dokterPemeriksa ||
    'Dokter Asesor Medis Lain';

  const handleDownloadPdf = () => {
    window.open(`/api/rekomendasi/${permohonan.id}/pdf`, '_blank');
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowLembarKendali(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 transition-all cursor-pointer shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-slate-400" />
          <span>Cetak Lembar Kendali Pengawasan</span>
        </button>
      </div>

      {/* Role-Specific Medical Authorization Banner */}
      {isMedisRole && (
        isMedisAuthorized ? (
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-300 shadow-sm">
            <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Hak Akses Medis Valid:</strong> Anda ({currentUser.name}) adalah dokter pemeriksa yang ditugaskan untuk tersangka ini. Anda memiliki wewenang penuh untuk menginput evaluasi klinis, tes urin, dan jadwal kontrol.
            </span>
          </div>
        ) : (
          <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-200 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Akses Medis Terbatas (Mode Baca):</strong> Tersangka ini diperiksa oleh pemeriksa medis <strong>{doctorName}</strong>. Akun Anda ({currentUser.name}) tidak memiliki otorisasi untuk menambah atau mengubah jadwal kontrol &amp; evaluasi rekam medis pasien ini.
            </span>
          </div>
        )
      )}

      {/* Executive Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-lg">
                {noSuratRekom}
              </span>
              {isSelesaiRehab ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span>REHABILITASI SELESAI (LULUS)</span>
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SEDANG MENJALANI REHABILITASI</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
              {t?.namaLengkap || 'Terperiksa'} {t?.alias ? `(${t.alias})` : ''}
            </h1>

            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
              <span>NIK: <strong className="text-slate-300 font-mono">{t?.nik || '-'}</strong></span>
              <span>&bull;</span>
              <span>Usia: <strong className="text-slate-300">{t?.usia || '-'} Tahun</strong></span>
              <span>&bull;</span>
              <span>Instansi: <strong className="text-slate-300">{permohonan.instansiPengaju}</strong></span>
              <span>&bull;</span>
              <span>Penyidik: <strong className="text-slate-300">{permohonan.perkara?.namaPenyidik || '-'}</strong></span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="text-left lg:text-right bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs space-y-0.5 w-full sm:w-auto">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Modalitas &amp; Masa Program</span>
              <span className="font-bold text-slate-100 text-sm block">{modalitas}</span>
              <span className="text-slate-300 font-medium block">{durasiBulan} Bulan Program Terpadu</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Unduh Rekomendasi (PDF)</span>
              </button>

              {isSelesaiRehab && (
                <button
                  type="button"
                  onClick={() => setActiveTab('akhir')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-blue-500/30"
                >
                  <Award className="w-3.5 h-3.5 text-blue-200" />
                  <span>Pratinjau &amp; Cetak SKSR</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Pillars Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Sesi Terlaksana</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white font-mono">{sesiSelesai} / {totalSesi}</span>
              <span className="text-xs text-slate-300 font-medium">({persenSelesai}%)</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${persenSelesai}%` }} />
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Hasil Toksikologi</span>
            {riwayatUrinList.length === 0 ? (
              <>
                <span className="text-base font-bold text-slate-300 flex items-center gap-1 font-mono">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Belum Ada Tes</span>
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Menunggu input Tim Medis
                </span>
              </>
            ) : posUrineCount > 0 ? (
              <>
                <span className="text-base font-bold text-rose-400 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{posUrineCount}x POSITIF</span>
                </span>
                <span className="text-[10px] text-rose-300 block truncate">
                  Terdeteksi Zat ({riwayatUrinList.length}x Uji)
                </span>
              </>
            ) : (
              <>
                <span className="text-base font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{negUrineCount}x NEGATIF</span>
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {isSelesaiRehab ? 'Lulus Uji Toksikologi' : 'Non-Reaktif (Bebas Zat)'}
                </span>
              </>
            )}
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Kepatuhan Klien</span>
            <span className={`text-base font-bold block ${hasSpRecord ? 'text-rose-400' : jumlahWajibLapor > 0 ? 'text-slate-100' : 'text-slate-300'}`}>
              {kepatuhanStatus}
            </span>
            <span className={`text-[10px] block ${hasSpRecord ? 'text-rose-300' : jumlahWajibLapor > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
              {kepatuhanSub}
            </span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {isSelesaiRehab ? 'Status Program' : 'Kontrol Terdekat'}
            </span>
            <span className="text-sm font-bold text-slate-200 font-mono block truncate">
              {isSelesaiRehab ? 'Program Selesai' : tanggalKontrolBerikutnya}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {isSelesaiRehab ? 'Tuntas 100% Seluruh Sesi' : waktuKontrolBerikutnya}
            </span>
          </div>
        </div>
      </div>

      {/* 2 Main Columns: Jadwal Kontrol Utama (7 cols) & Fasilitas Rujukan (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-300" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Jadwal Kontrol Medis &amp; Konseling Berikutnya
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-mono">
                WAJIB HADIR
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">Tanggal Sesi:</span>
                <span className="text-sm font-bold font-mono text-white mt-0.5 block">{tanggalKontrolBerikutnya}</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" /> {waktuKontrolBerikutnya}
                </span>
              </div>

              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">Dokter DPJP / Konselor:</span>
                <span className="text-sm font-semibold text-slate-200 mt-0.5 block flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{dpjp}</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Spesialis Kedokteran Jiwa / Adiksi</span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Lokasi Pelaksanaan Kontrol:</span>
              <span className="font-semibold text-slate-200 block flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{namaFasilitas}</span>
              </span>
              <span className="text-[11px] text-slate-400 block pl-5">{alamatFasilitas}</span>
            </div>

            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5 text-xs">Instruksi Penting Bagi Tersangka / Penjamin:</strong>
                <p className="text-[11px] text-slate-400">{catatanKontrolBerikutnya}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-slate-300" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Fasilitas &amp; Rujukan Resmi
                </h3>
              </div>
              <span className="text-xs font-mono font-medium text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                {modalitas}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">Fasilitas Rujukan Sesuai Rekomendasi:</span>
                <span className="text-xs font-bold text-white block mt-0.5">{namaFasilitas}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Akreditasi Tingkat Nasional (BNN)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Tanggal Masuk:</span>
                  <span className="font-mono text-slate-200 font-bold mt-0.5 block">{tanggalMulai}</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Target Selesai:</span>
                  <span className="font-mono text-slate-200 font-bold mt-0.5 block">{tanggalTargetSelesai}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Pemberian Rekomendasi Hukum:</span>
              <span className="text-slate-200 font-semibold">Keadilan Restoratif (RJ)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Memenuhi kriteria SEMA No. 4/2010 Pasal 127 UU 35/2009 untuk menjalani rehabilitasi dan tidak dipenjara.
            </p>
          </div>
        </div>
      </div>

      {/* Panduan Urutan Pelaporan Tersangka (Pengaju & Medis) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-[#D4AF37]">
            <Info className="w-4 h-4 shrink-0" />
            <span>Alur Urutan Pelaporan Tindak Lanjut (1 → 4)</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md font-mono font-semibold text-[11px] bg-[#144782] text-white border border-sky-400/25">
            Batch Aktif: Laporan Ke-{activeBatchKe}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-sky-300">1. Pengaju (Polsek/Polres)</strong> melakukan <em>Admisi &amp; Serah Terima</em> tersangka ke fasilitas rehab terlebih dahulu &rarr;{' '}
          <strong className="text-emerald-300">2. Tim Medis</strong> menginput hasil kontrol klinis &amp; tes urin toksikologi &rarr;{' '}
          <strong className="text-sky-300">3. Tersangka Wajib Lapor ke Pengaju (Polsek/Polres)</strong> membawa bukti kontrol medis untuk dicatat di <em>Jurnal Wajib Lapor</em> &rarr;{' '}
          <strong className="text-amber-300">4. Output SKSR</strong> diterbitkan oleh Pengaju setelah program selesai.
        </p>
      </div>

      {/* Navigation Tabs Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
        {tabs.map((tab) => {
          const isDone = progress[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-sky-500/50 text-white font-semibold shadow-sm'
                  : isDone
                  ? 'bg-slate-900/50 border-slate-800 text-slate-200 hover:bg-slate-800/60'
                  : 'bg-slate-950/40 border-slate-800/70 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 text-xs truncate">
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </div>
                <span className="block text-[10px] font-medium text-sky-400/90 pl-5 truncate">
                  {tab.roleTag}
                </span>
              </div>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Active Sub View */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
        {activeTab === 'pelaksanaan' && (
          <PelaksanaanRehabSection
            monitoring={monitoring}
            permohonan={permohonan}
            userRole={currentUser.role}
            readOnly={readOnlyTab1}
            onUpdate={handleMonitoringUpdate}
            onSaveSuccess={setSaveConfirmModal}
          />
        )}
        {activeTab === 'laporan' && (
          <EvaluasiKlinisSection
            monitoring={monitoring}
            permohonan={permohonan}
            userRole={currentUser.role}
            activeBatchKe={activeBatchKe}
            readOnly={readOnlyTab2}
            onUpdate={handleMonitoringUpdate}
            onSaveSuccess={setSaveConfirmModal}
          />
        )}
        {activeTab === 'wajib_lapor' && (
          <WajibLaporSection
            monitoring={monitoring}
            permohonan={permohonan}
            userRole={currentUser.role}
            activeBatchKe={activeBatchKe}
            readOnly={readOnlyTab3}
            onUpdate={handleMonitoringUpdate}
            onSaveSuccess={setSaveConfirmModal}
          />
        )}
        {activeTab === 'akhir' && (
          <AkhirLayananSection
            monitoring={monitoring}
            permohonan={permohonan}
            userRole={currentUser.role}
            readOnly={readOnlyTab4}
            onUpdate={handleMonitoringUpdate}
            onSaveSuccess={setSaveConfirmModal}
          />
        )}
      </div>

      {saveConfirmModal && (
        <SaveConfirmModal
          info={saveConfirmModal}
          onClose={() => setSaveConfirmModal(null)}
          onNavigateTab={(tab) => {
            setSaveConfirmModal(null);
            setActiveTab(tab);
          }}
        />
      )}

      {showLembarKendali && (
        <LembarKendaliModal
          permohonan={permohonan}
          monitoring={monitoring}
          currentUser={currentUser}
          onClose={() => setShowLembarKendali(false)}
        />
      )}
    </div>
  );
};

export default TindakLanjutDetailView;
