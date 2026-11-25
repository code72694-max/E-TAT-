import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  CheckCircle2,
  ArrowLeft,
  Search,
  Info,
  Save,
  FileText,
  PlusCircle,
  ClipboardCheck,
  AlertTriangle,
  ChevronRight,
  Trash2,
  UserCheck,
} from 'lucide-react';
import type { PermohonanAsesmen, UserProfile } from '../types';
import { isSuspectExaminedByMedis } from '../utils/medisAuth';

export interface PascaRehabSchedule {
  caseId: string;
  tanggal: string;
  waktu: string;
  jenisProgram: string;
  fasilitas: string;
  dokterPenanggungJawab: string;
  catatan: string;
  diinputOleh: string;
  tanggalInput: string;
}

export interface PascaRehabReport {
  id: string;
  laporanKe: number;
  tanggalPemantauan: string;
  statusKehadiran: 'Hadir & Kooperatif' | 'Hadir Terlambat' | 'Izin Sah' | 'Mangkir';
  hasilTesUrin: 'Negatif (-)' | 'Positif (+)' | 'Tidak Dilakukan';
  kondisiKlinis: 'Membaik / Stabil' | 'Perlu Pendampingan Intensif' | 'Relapse / Kambuh';
  catatanDokter: string;
  diinputOleh: string;
  createdAt: string;
}

export const getPascaRehabSchedule = (caseId: string): PascaRehabSchedule | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(`etat_pasca_rehab_${caseId}`);
    return raw ? (JSON.parse(raw) as PascaRehabSchedule) : null;
  } catch {
    return null;
  }
};

export const getPascaRehabReports = (caseId: string): PascaRehabReport[] => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(`etat_pasca_rehab_reports_${caseId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

interface Props {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  initialCaseId?: string;
  onSelectCase?: (caseId: string | null) => void;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  onBack: () => void;
}

export const RehabilitasiPascaRehabView: React.FC<Props> = ({
  permohonanList,
  currentUser,
  initialCaseId,
  onSelectCase,
  onUpdatePermohonan,
  onBack,
}) => {
  const roleUpper = (currentUser.role || '').toUpperCase();
  const isMedisRole = roleUpper === 'MEDIS';
  const isAdminOrPengaju = roleUpper === 'ADMIN' || roleUpper === 'SEKRETARIAT' || roleUpper === 'PENGAJU';
  const canView = isMedisRole || isAdminOrPengaju;
  const isReadOnly = !isMedisRole;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'semua' | 'terjadwal' | 'belum'>('semua');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId || '');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    setSelectedCaseId(initialCaseId || '');
  }, [initialCaseId]);

  // Filter cases examined by this Medis user that have completed Pleno / Rehab
  const allEligibleCases = useMemo(() => {
    return permohonanList.filter((p) => {
      if (isMedisRole && !isSuspectExaminedByMedis(p, currentUser)) return false;
      const isSidangBeres =
        p.sidangPleno?.statusPleno === 'selesai_sepakat' ||
        (p.sidangPleno?.statusPleno as string) === 'SELESAI' ||
        (p.sidangPleno?.statusPleno as string) === 'selesai' ||
        p.statusProsesUtama === 'selesai_tindak_lanjut' ||
        Boolean(p.rekomendasiResmi);
      return isSidangBeres;
    });
  }, [permohonanList, isMedisRole, currentUser]);

  const filteredCases = useMemo(() => {
    return allEligibleCases.filter((p) => {
      const sched = getPascaRehabSchedule(p.id);
      if (filterStatus === 'terjadwal' && !sched) return false;
      if (filterStatus === 'belum' && sched) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        p.terperiksa.namaLengkap.toLowerCase().includes(q) ||
        (p.nomorPermohonan || '').toLowerCase().includes(q) ||
        (p.terperiksa.nik || '').toLowerCase().includes(q) ||
        (p.instansiPengaju || '').toLowerCase().includes(q)
      );
    });
  }, [allEligibleCases, filterStatus, searchTerm, refreshTick]);

  const stats = useMemo(() => {
    let terjadwal = 0;
    let totalLaporan = 0;
    allEligibleCases.forEach((c) => {
      if (getPascaRehabSchedule(c.id)) terjadwal++;
      totalLaporan += getPascaRehabReports(c.id).length;
    });
    return {
      total: allEligibleCases.length,
      terjadwal,
      belum: allEligibleCases.length - terjadwal,
      totalLaporan,
    };
  }, [allEligibleCases, refreshTick]);

  const activeCase = useMemo(
    () => allEligibleCases.find((c) => c.id === selectedCaseId) || null,
    [allEligibleCases, selectedCaseId]
  );

  // Detail Form States (Schedule)
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [waktu, setWaktu] = useState('09:00 WITA');
  const [jenisProgram, setJenisProgram] = useState('Bina Lanjut & Konseling Pasca Rehab');
  const [fasilitas, setFasilitas] = useState('Balai Besar Rehabilitasi BNN Tanah Merah');
  const [catatan, setCatatan] = useState(
    'Klien wajib hadir mengikuti sesi pemantauan pasca rehabilitasi dan pemeriksaan urin berkala.'
  );

  // Detail Form States (Doctor Monitoring Report)
  const [reportTanggal, setReportTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [reportKehadiran, setReportKehadiran] = useState<PascaRehabReport['statusKehadiran']>('Hadir & Kooperatif');
  const [reportUrin, setReportUrin] = useState<PascaRehabReport['hasilTesUrin']>('Negatif (-)');
  const [reportKondisi, setReportKondisi] = useState<PascaRehabReport['kondisiKlinis']>('Membaik / Stabil');
  const [reportCatatan, setReportCatatan] = useState('');

  const handleOpenDetail = (c: PermohonanAsesmen) => {
    setSelectedCaseId(c.id);
    onSelectCase?.(c.id);
    setSavedNotice(null);
    const sched = getPascaRehabSchedule(c.id);
    setTanggal(sched?.tanggal || new Date().toISOString().slice(0, 10));
    setWaktu(sched?.waktu || '09:00 WITA');
    setJenisProgram(sched?.jenisProgram || 'Bina Lanjut & Konseling Pasca Rehab');
    setFasilitas(
      sched?.fasilitas ||
        c.tindakLanjut?.namaFasilitasTujuan ||
        c.monitoringTindakLanjut?.pelaksanaanRehab?.namaFasilitasTujuan ||
        'Balai Besar Rehabilitasi BNN Tanah Merah'
    );
    setCatatan(
      sched?.catatan ||
        'Klien wajib hadir mengikuti sesi pemantauan pasca rehabilitasi dan pemeriksaan urin berkala.'
    );
    setReportTanggal(new Date().toISOString().slice(0, 10));
    setReportKehadiran('Hadir & Kooperatif');
    setReportUrin('Negatif (-)');
    setReportKondisi('Membaik / Stabil');
    setReportCatatan('');
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMedisRole || !activeCase) return;

    const schedule: PascaRehabSchedule = {
      caseId: activeCase.id,
      tanggal,
      waktu,
      jenisProgram,
      fasilitas,
      dokterPenanggungJawab: currentUser.name,
      catatan,
      diinputOleh: currentUser.name,
      tanggalInput: new Date().toISOString().slice(0, 10),
    };

    try {
      localStorage.setItem(`etat_pasca_rehab_${activeCase.id}`, JSON.stringify(schedule));
    } catch {}

    if (onUpdatePermohonan && activeCase.monitoringTindakLanjut) {
      onUpdatePermohonan({
        ...activeCase,
        monitoringTindakLanjut: {
          ...activeCase.monitoringTindakLanjut,
          akhirLayanan: activeCase.monitoringTindakLanjut.akhirLayanan
            ? {
                ...activeCase.monitoringTindakLanjut.akhirLayanan,
                rencanaLanjutanDariFasilitas: `Pasca Rehab (${tanggal} ${waktu}): ${jenisProgram} — ${fasilitas}`,
              }
            : activeCase.monitoringTindakLanjut.akhirLayanan,
          terakhirDiperbarui: new Date().toISOString().slice(0, 10),
        },
      });
    }

    setRefreshTick((t) => t + 1);
    setSavedNotice(
      `Jadwal Rehabilitasi Pasca Rehab untuk ${activeCase.terperiksa.namaLengkap} (${tanggal} • ${waktu}) berhasil disimpan.`
    );
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMedisRole || !activeCase) return;

    const currentReports = getPascaRehabReports(activeCase.id);
    const nextNumber = currentReports.length + 1;
    const newReport: PascaRehabReport = {
      id: `pr-rep-${Date.now()}`,
      laporanKe: nextNumber,
      tanggalPemantauan: reportTanggal,
      statusKehadiran: reportKehadiran,
      hasilTesUrin: reportUrin,
      kondisiKlinis: reportKondisi,
      catatanDokter: reportCatatan.trim() || 'Pemantauan pasca rehabilitasi berjalan sesuai rencana.',
      diinputOleh: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    const updatedReports = [newReport, ...currentReports];
    try {
      localStorage.setItem(`etat_pasca_rehab_reports_${activeCase.id}`, JSON.stringify(updatedReports));
    } catch {}

    setReportCatatan('');
    setRefreshTick((t) => t + 1);
    setSavedNotice(
      `Laporan Pemantauan ke-${nextNumber} untuk ${activeCase.terperiksa.namaLengkap} (${reportKondisi} • Urin ${reportUrin}) berhasil dicatat.`
    );
  };

  const handleDeleteReport = (reportId: string) => {
    if (!activeCase) return;
    const currentReports = getPascaRehabReports(activeCase.id);
    const filtered = currentReports
      .filter((r) => r.id !== reportId)
      .map((r, idx, arr) => ({ ...r, laporanKe: arr.length - idx }));
    try {
      localStorage.setItem(`etat_pasca_rehab_reports_${activeCase.id}`, JSON.stringify(filtered));
    } catch {}
    setRefreshTick((t) => t + 1);
  };

  if (!canView) {
    return (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl max-w-lg mx-auto my-8 space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-sm font-bold text-white">Akses Terbatas</h2>
        <p className="text-xs text-slate-400">
          Menu Rehabilitasi Pasca Rehab hanya dapat diakses oleh Tim Medis, Admin Sekretariat, dan Pengaju.
        </p>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: HALAMAN DETAIL PASCA REHAB PER TERSANGKA / KLIEN
  // =========================================================================
  if (activeCase) {
    const activeSchedule = getPascaRehabSchedule(activeCase.id);
    const activeReports = getPascaRehabReports(activeCase.id);
    const latestReport = activeReports[0] || null;

    return (
      <div className="space-y-5 text-slate-100 animate-in fade-in duration-200">
        {/* Top Bar Detail */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">
                  {activeCase.terperiksa.namaLengkap}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#142642] text-[#D4AF37] border border-[#234475]">
                  {activeCase.nomorPermohonan}
                </span>
                {activeSchedule ? (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                    ✓ Sudah Dijadwalkan ({activeSchedule.tanggal})
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40">
                    Belum Dijadwalkan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activeCase.instansiPengaju} &bull; NIK: {activeCase.terperiksa.nik || '-'} &bull; Total Laporan:{' '}
                <strong className="text-white">{activeReports.length}x</strong>
                {latestReport && (
                  <>
                    {' '}
                    &bull; Hasil Terakhir:{' '}
                    <strong className="text-emerald-300">
                      {latestReport.kondisiKlinis} (Urin {latestReport.hasilTesUrin})
                    </strong>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {isReadOnly && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0b172a] border border-sky-500/30 text-xs text-sky-200">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Mode Pantau (Read-Only):</strong> Jadwal bina lanjut dan laporan hasil pemantauan pasca rehabilitasi diinput oleh <strong>Tim Medis</strong>.
            </span>
          </div>
        )}

        {savedNotice && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {isReadOnly ? (
          /* TAMPILAN READ-ONLY (PENGAJU & ADMIN): HANYA DATA JADWAL & RIWAYAT LAPORAN */
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="pb-3 border-b border-[#1b3459] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Data Jadwal Pasca Rehabilitasi</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Diinput oleh Tim Medis
              </span>
            </div>

            {activeSchedule ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Tanggal &amp; Waktu</span>
                  <span className="font-mono font-bold text-emerald-300 mt-1 block">
                    {activeSchedule.tanggal} &bull; {activeSchedule.waktu}
                  </span>
                </div>
                <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Jenis Program</span>
                  <span className="font-semibold text-white mt-1 block">{activeSchedule.jenisProgram}</span>
                </div>
                <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Fasilitas / Lokasi</span>
                  <span className="font-semibold text-white mt-1 block">{activeSchedule.fasilitas}</span>
                </div>
                <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Dokter / Petugas Medis</span>
                  <span className="font-semibold text-sky-300 mt-1 block">{activeSchedule.dokterPenanggungJawab || activeSchedule.diinputOleh}</span>
                </div>
                {activeSchedule.catatan && (
                  <div className="sm:col-span-2 lg:col-span-4 p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Catatan / Instruksi Medis</span>
                    <p className="text-slate-200 leading-relaxed">{activeSchedule.catatan}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 bg-[#050e1c] border border-dashed border-[#1b3459] rounded-xl text-xs text-slate-400 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Jadwal pasca rehabilitasi belum diinput oleh Tim Medis.</span>
              </div>
            )}
          </div>
        ) : (
        /* Grid 2 Kolom (KHUSUS MEDIS): Kiri Penjadwalan, Kanan Input Laporan Dokter */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Section 1: Jadwal Pasca Rehab */}
          <div className="lg:col-span-5 bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="pb-3 border-b border-[#1b3459] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>1. Penjadwalan Pasca Rehab</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                {activeSchedule ? 'Terjadwal' : 'Belum Di-assign'}
              </span>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 block">
                    Tanggal Jadwal <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 block">
                    Waktu Pelaksanaan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: 09:00 WITA"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 block">
                  Jenis Program Pasca Rehab <span className="text-rose-400">*</span>
                </label>
                <select
                  value={jenisProgram}
                  onChange={(e) => setJenisProgram(e.target.value)}
                  className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-[#D4AF37] outline-none"
                >
                  <option value="Bina Lanjut & Konseling Pasca Rehab">Bina Lanjut &amp; Konseling Pasca Rehab</option>
                  <option value="Tes Urin Berkala Pasca Rehab">Tes Urin Berkala Pasca Rehab</option>
                  <option value="Pemantauan Medis & Psikososial">Pemantauan Medis &amp; Psikososial</option>
                  <option value="Rehabilitasi Rawat Jalan Lanjutan">Rehabilitasi Rawat Jalan Lanjutan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 block">
                  Fasilitas / Lokasi <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fasilitas}
                    onChange={(e) => setFasilitas(e.target.value)}
                    className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg pl-8 pr-3 py-2 text-xs text-slate-100 focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 block">
                  Catatan / Instruksi Medis
                </label>
                <textarea
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg p-3 text-xs text-slate-100 focus:border-[#D4AF37] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5 text-emerald-300" />
                <span>{activeSchedule ? 'Perbarui Jadwal Pasca Rehab' : 'Simpan Jadwal Pasca Rehab'}</span>
              </button>
            </form>
          </div>

          {/* Section 2: Input Laporan & Hasil Pemantauan oleh Dokter */}
          <div className="lg:col-span-7 bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="pb-3 border-b border-[#1b3459] flex items-center justify-between">
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>2. Input Laporan &amp; Hasil Pemantauan Dokter</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050e1c] border border-[#1b3459] text-slate-300">
                Laporan ke-{activeReports.length + 1}
              </span>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 block">
                    Tanggal Pemantauan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={reportTanggal}
                    onChange={(e) => setReportTanggal(e.target.value)}
                    className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 block">
                    Status Kehadiran Klien <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={reportKehadiran}
                    onChange={(e) => setReportKehadiran(e.target.value as PascaRehabReport['statusKehadiran'])}
                    className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 outline-none"
                  >
                    <option value="Hadir & Kooperatif">Hadir &amp; Kooperatif</option>
                    <option value="Hadir Terlambat">Hadir Terlambat</option>
                    <option value="Izin Sah">Izin Sah</option>
                    <option value="Mangkir">Mangkir</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 block">
                    Hasil Tes Urin Berkala <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={reportUrin}
                    onChange={(e) => setReportUrin(e.target.value as PascaRehabReport['hasilTesUrin'])}
                    className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 outline-none"
                  >
                    <option value="Negatif (-)">Negatif (-)</option>
                    <option value="Positif (+)">Positif (+)</option>
                    <option value="Tidak Dilakukan">Tidak Dilakukan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 block">
                    Evaluasi Kondisi Klinis <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={reportKondisi}
                    onChange={(e) => setReportKondisi(e.target.value as PascaRehabReport['kondisiKlinis'])}
                    className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 outline-none"
                  >
                    <option value="Membaik / Stabil">Membaik / Stabil</option>
                    <option value="Perlu Pendampingan Intensif">Perlu Pendampingan Intensif</option>
                    <option value="Relapse / Kambuh">Relapse / Kambuh</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 block">
                  Catatan Hasil Pemeriksaan &amp; Rekomendasi Dokter <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan hasil evaluasi konseling, kepatuhan minum obat/terapi, atau tindak lanjut medis..."
                  value={reportCatatan}
                  onChange={(e) => setReportCatatan(e.target.value)}
                  className="w-full bg-[#050e1c] border border-[#1b3459] rounded-lg p-3 text-xs text-slate-100 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Simpan Laporan ke-{activeReports.length + 1}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

        {/* Section 3: Riwayat Laporan Pemantauan Pasca Rehab */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>{isReadOnly ? `Riwayat Laporan Pemantauan Pasca Rehab (${activeReports.length} Laporan)` : `3. Riwayat Laporan Pemantauan Pasca Rehab (${activeReports.length} Laporan)`}</span>
            </h2>
          </div>

          {activeReports.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-[#050e1c] border border-[#1b3459]/70 rounded-xl">
              Belum ada laporan hasil pemantauan pasca rehab yang diinput dokter untuk klien ini.
            </div>
          ) : (
            <div className="space-y-3">
              {activeReports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#0b172a] px-2 py-0.5 rounded border border-[#1b3459]">
                        LAPORAN #{rep.laporanKe}
                      </span>
                      <span className="text-xs font-mono text-slate-300">{rep.tanggalPemantauan}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          rep.hasilTesUrin === 'Negatif (-)'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                            : rep.hasilTesUrin === 'Positif (+)'
                            ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        Urin: {rep.hasilTesUrin}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          rep.kondisiKlinis === 'Membaik / Stabil'
                            ? 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                            : rep.kondisiKlinis === 'Perlu Pendampingan Intensif'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {rep.kondisiKlinis}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#142642] text-slate-200 border border-[#234475]">
                        {rep.statusKehadiran}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{rep.catatanDokter}</p>
                    <p className="text-[10px] text-slate-500">Diinput oleh: {rep.diinputOleh}</p>
                  </div>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReport(rep.id)}
                      className="self-end sm:self-start px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: FULL-PAGE DAFTAR KLIEN PASCA REHAB (CARDS PENUH)
  // =========================================================================
  return (
    <div className="space-y-5 text-slate-100 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white">
                Rehabilitasi Pasca Rehab {isReadOnly ? '(Pantau — Diinput oleh Medis)' : '(Input Medis)'}
              </h1>
              {isReadOnly && (
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-950/60 text-sky-300 border border-sky-500/40">
                  Read-Only • Diinput oleh Tim Medis
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Penjadwalan layanan bina lanjut, pemantauan laporan dokter, &amp; hasil pasca rehabilitasi setiap klien.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 bg-[#142642] hover:bg-[#1a345a] text-slate-200 border border-[#234475] rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Tindak Lanjut</span>
        </button>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4">
          <span className="text-[11px] text-slate-400 block">Total Klien Pasca Rehab</span>
          <span className="text-xl font-extrabold text-white font-mono mt-1 block">{stats.total}</span>
        </div>
        <div className="bg-[#0b172a] border border-emerald-500/30 rounded-xl p-4">
          <span className="text-[11px] text-emerald-300 block">Sudah Dijadwalkan</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono mt-1 block">{stats.terjadwal}</span>
        </div>
        <div className="bg-[#0b172a] border border-amber-500/30 rounded-xl p-4">
          <span className="text-[11px] text-amber-300 block">Belum Dijadwalkan</span>
          <span className="text-xl font-extrabold text-amber-400 font-mono mt-1 block">{stats.belum}</span>
        </div>
        <div className="bg-[#0b172a] border border-sky-500/30 rounded-xl p-4">
          <span className="text-[11px] text-sky-300 block">Total Laporan Pemantauan</span>
          <span className="text-xl font-extrabold text-sky-400 font-mono mt-1 block">{stats.totalLaporan}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama klien, No. Permohonan, NIK, atau instansi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050e1c] border border-[#1b3459] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-[#D4AF37] outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(
            [
              { key: 'semua', label: 'Semua' },
              { key: 'terjadwal', label: 'Sudah Dijadwalkan' },
              { key: 'belum', label: 'Belum Dijadwalkan' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                filterStatus === tab.key
                  ? 'bg-[#133863] text-[#D4AF37] border-[#D4AF37]/50'
                  : 'bg-[#050e1c] text-slate-400 hover:text-white border-[#1b3459]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full-Page List Cards */}
      {filteredCases.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-400 bg-[#0b172a] border border-[#1b3459] rounded-2xl">
          Belum ada kasus tindak lanjut yang siap dijadwalkan Pasca Rehab sesuai filter ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map((c) => {
            const sched = getPascaRehabSchedule(c.id);
            const reports = getPascaRehabReports(c.id);
            const latest = reports[0] || null;

            return (
              <div
                key={c.id}
                onClick={() => handleOpenDetail(c)}
                className="bg-[#0b172a] border border-[#1b3459] hover:border-[#D4AF37]/60 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Row: Name & Nomor Permohonan */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {c.terperiksa.namaLengkap}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {c.instansiPengaju || 'Instansi Pengaju'} &bull; NIK: {c.terperiksa.nik || '-'}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#D4AF37] bg-[#050e1c] px-2.5 py-1 rounded-lg border border-[#1b3459] shrink-0">
                      {c.nomorPermohonan}
                    </span>
                  </div>

                  {/* Labels: Status Jadwal, Jumlah Laporan & Hasil Terakhir */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {sched ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sudah Dijadwalkan</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/40">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Belum Dijadwalkan</span>
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#142642] text-sky-300 border border-[#234475]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{reports.length}x Laporan Medis</span>
                    </span>

                    {latest ? (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                          latest.hasilTesUrin === 'Negatif (-)'
                            ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                            : latest.hasilTesUrin === 'Positif (+)'
                            ? 'bg-rose-950/50 text-rose-300 border-rose-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>
                          {latest.kondisiKlinis} • Urin {latest.hasilTesUrin}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 px-2.5 py-1 rounded-lg bg-[#050e1c] border border-[#1b3459]">
                        Belum Ada Laporan Hasil
                      </span>
                    )}
                  </div>

                  {/* Schedule Info Preview */}
                  {sched ? (
                    <div className="p-3 rounded-xl bg-[#050e1c] border border-[#1b3459] text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 font-mono font-semibold text-emerald-300">
                          <Calendar className="w-3.5 h-3.5" />
                          {sched.tanggal} &bull; {sched.waktu}
                        </span>
                        <span className="text-[11px] text-slate-400">{sched.jenisProgram}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{sched.fasilitas}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#050e1c] border border-dashed border-[#1b3459] text-[11px] text-slate-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Klik kartu ini untuk mengatur jadwal Pasca Rehab dan menginput laporan pemantauan dokter.</span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[#1b3459]/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {latest ? `Pemantauan terakhir: ${latest.tanggalPemantauan}` : 'Siap dijadwalkan & dipantau'}
                  </span>
                  <span className="font-bold text-[#D4AF37] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Buka Detail Pasca Rehab</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
