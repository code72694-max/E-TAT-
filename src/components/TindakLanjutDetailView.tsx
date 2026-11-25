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
  const [showDetailFasilitas, setShowDetailFasilitas] = useState(false);
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
    { id: 'pelaksanaan' as const, label: '1. Admisi & Serah Terima', roleTag: `Input Pengaju • Laporan Ke-${activeBatchKe}`, icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'laporan' as const, label: '2. Rekam Medis & Tes Urin', roleTag: `Input Medis • Laporan Ke-${activeBatchKe}`, icon: <Syringe className="w-3.5 h-3.5" /> },
    { id: 'wajib_lapor' as const, label: '3. Jurnal Wajib Lapor', roleTag: `Input Pengaju • Laporan Ke-${activeBatchKe}`, icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: 'akhir' as const, label: '4. Output Surat SKSR', roleTag: `Input Pengaju • Laporan Ke-${activeBatchKe}`, icon: <Award className="w-3.5 h-3.5" /> },
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
    <div className="space-y-4 text-slate-100 font-sans animate-in fade-in duration-200">
      {/* Role-Specific Medical Authorization Banner */}
      {isMedisRole && (
        isMedisAuthorized ? (
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-emerald-300">
            <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Hak Akses Medis Valid:</strong> Anda ({currentUser.name}) ditugaskan untuk memeriksa tersangka ini.
            </span>
          </div>
        ) : (
          <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Mode Baca:</strong> Tersangka ini ditugaskan ke <strong>{doctorName}</strong>.
            </span>
          </div>
        )
      )}

      {/* Clean Compact Summary Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-md">
                {noSuratRekom}
              </span>
              {isSelesaiRehab ? (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-400" />
                  <span>Rehabilitasi Selesai</span>
                </span>
              ) : (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Sedang Rehabilitasi</span>
                </span>
              )}
              <span className="text-[11px] px-2.5 py-0.5 rounded-md font-mono font-semibold bg-[#144782] text-white border border-sky-400/25">
                Batch Aktif: Laporan Ke-{activeBatchKe}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
              {t?.namaLengkap || 'Terperiksa'} {t?.alias ? `(${t.alias})` : ''}
            </h1>

            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>NIK: <strong className="text-slate-200 font-mono">{t?.nik || '-'}</strong></span>
              <span>&bull;</span>
              <span>Instansi: <strong className="text-slate-200">{permohonan.instansiPengaju}</strong></span>
              <span>&bull;</span>
              <span>Layanan: <strong className="text-slate-200">{modalitas} ({durasiBulan} Bln)</strong></span>
              <span>&bull;</span>
              <span>Fasilitas: <strong className="text-slate-200">{namaFasilitas}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowDetailFasilitas(v => !v)}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium transition-all cursor-pointer"
            >
              {showDetailFasilitas ? 'Tutup Info Detail' : 'Info Fasilitas & Jadwal'}
            </button>
            <button
              type="button"
              onClick={() => setShowLembarKendali(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Lembar Kendali</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Rekomendasi PDF</span>
            </button>
          </div>
        </div>

        {/* 4 Compact Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80">
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3.5 py-2.5">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Progres Sesi</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-white font-mono">{sesiSelesai} / {totalSesi}</span>
              <span className="text-[11px] text-slate-400">({persenSelesai}%)</span>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3.5 py-2.5">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Hasil Tes Urin</span>
            {riwayatUrinList.length === 0 ? (
              <span className="text-sm font-semibold text-slate-300 mt-0.5 block">Belum Ada Tes</span>
            ) : posUrineCount > 0 ? (
              <span className="text-sm font-bold text-rose-400 mt-0.5 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {posUrineCount}x POSITIF
              </span>
            ) : (
              <span className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {negUrineCount}x NEGATIF
              </span>
            )}
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3.5 py-2.5">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Wajib Lapor</span>
            <span className={`text-sm font-semibold mt-0.5 block truncate ${hasSpRecord ? 'text-rose-400' : jumlahWajibLapor > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
              {kepatuhanStatus}
            </span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3.5 py-2.5">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">
              {isSelesaiRehab ? 'Status Program' : 'Kontrol Terdekat'}
            </span>
            <span className="text-sm font-semibold text-slate-200 font-mono mt-0.5 block truncate">
              {isSelesaiRehab ? 'Selesai (SKSR)' : tanggalKontrolBerikutnya}
            </span>
          </div>
        </div>

        {/* Collapsible Secondary Info (Fasilitas & Jadwal Detail) */}
        {showDetailFasilitas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Alamat &amp; DPJP Fasilitas</span>
              <p className="text-slate-200 font-medium">{dpjp}</p>
              <p className="text-[11px] text-slate-400 flex items-start gap-1">
                <MapPin className="w-3 h-3 shrink-0 mt-0.5" /> {alamatFasilitas}
              </p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Periode &amp; Penyidik</span>
              <p className="text-slate-200">Masuk: <span className="font-mono">{tanggalMulai}</span> &bull; Target: <span className="font-mono">{tanggalTargetSelesai}</span></p>
              <p className="text-[11px] text-slate-400">Penyidik: {permohonan.perkara?.namaPenyidik || '-'} &bull; {waktuKontrolBerikutnya}</p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Catatan &amp; Dasar Hukum</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">{catatanKontrolBerikutnya}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
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
            activeBatchKe={activeBatchKe}
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
