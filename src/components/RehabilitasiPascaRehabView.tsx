import React, { useState, useMemo } from 'react';
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

export const getPascaRehabSchedule = (caseId: string): PascaRehabSchedule | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(`etat_pasca_rehab_${caseId}`);
    return raw ? (JSON.parse(raw) as PascaRehabSchedule) : null;
  } catch {
    return null;
  }
};

interface Props {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  initialCaseId?: string;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  onBack: () => void;
}

export const RehabilitasiPascaRehabView: React.FC<Props> = ({
  permohonanList,
  currentUser,
  initialCaseId,
  onUpdatePermohonan,
  onBack,
}) => {
  const isMedisRole = (currentUser.role || '').toUpperCase() === 'MEDIS';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId || '');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Filter cases examined by this Medis user that have completed Pleno / Rehab
  const eligibleCases = useMemo(() => {
    return permohonanList.filter((p) => {
      if (isMedisRole && !isSuspectExaminedByMedis(p, currentUser)) return false;
      const isSidangBeres =
        p.sidangPleno?.statusPleno === 'selesai_sepakat' ||
        (p.sidangPleno?.statusPleno as string) === 'SELESAI' ||
        (p.sidangPleno?.statusPleno as string) === 'selesai' ||
        p.statusProsesUtama === 'selesai_tindak_lanjut' ||
        Boolean(p.rekomendasiResmi);
      if (!isSidangBeres) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        p.terperiksa.namaLengkap.toLowerCase().includes(q) ||
        (p.nomorPermohonan || '').toLowerCase().includes(q) ||
        (p.terperiksa.nik || '').toLowerCase().includes(q)
      );
    });
  }, [permohonanList, isMedisRole, currentUser, searchTerm]);

  const activeCase = useMemo(
    () => eligibleCases.find((c) => c.id === selectedCaseId) || eligibleCases[0] || null,
    [eligibleCases, selectedCaseId]
  );

  const existingSchedule = activeCase ? getPascaRehabSchedule(activeCase.id) : null;

  const [tanggal, setTanggal] = useState(
    existingSchedule?.tanggal || new Date().toISOString().slice(0, 10)
  );
  const [waktu, setWaktu] = useState(existingSchedule?.waktu || '09:00 WITA');
  const [jenisProgram, setJenisProgram] = useState(
    existingSchedule?.jenisProgram || 'Bina Lanjut & Konseling Pasca Rehab'
  );
  const [fasilitas, setFasilitas] = useState(
    existingSchedule?.fasilitas ||
      activeCase?.tindakLanjut?.namaFasilitasTujuan ||
      activeCase?.monitoringTindakLanjut?.pelaksanaanRehab?.namaFasilitasTujuan ||
      'Balai Besar Rehabilitasi BNN Tanah Merah'
  );
  const [catatan, setCatatan] = useState(
    existingSchedule?.catatan ||
      'Klien wajib hadir mengikuti sesi pemantauan pasca rehabilitasi dan pemeriksaan urin berkala.'
  );

  const handleSelectCase = (c: PermohonanAsesmen) => {
    setSelectedCaseId(c.id);
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
  };

  const handleSave = (e: React.FormEvent) => {
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

    setSavedNotice(`Jadwal Rehabilitasi Pasca Rehab untuk ${activeCase.terperiksa.namaLengkap} (${tanggal} • ${waktu}) berhasil disimpan.`);
  };

  if (!isMedisRole) {
    return (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl max-w-lg mx-auto my-8 space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-sm font-bold text-white">Khusus Tim Medis</h2>
        <p className="text-xs text-slate-400">
          Menu Input Rehabilitasi Pasca Rehab hanya dapat diisi oleh akun Tim Medis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-slate-100 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white">Rehabilitasi Pasca Rehab (Input Medis)</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Penjadwalan layanan bina lanjut &amp; pemantauan pasca rehabilitasi khusus oleh Tim Medis.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Tindak Lanjut</span>
        </button>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: List of Cases & Existing Pasca Rehab Schedules in Cards */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama klien / No. Permohonan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-sky-500/50 outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {eligibleCases.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 border border-slate-800/70 rounded-xl">
                Belum ada kasus tindak lanjut yang siap dijadwalkan Pasca Rehab.
              </div>
            ) : (
              eligibleCases.map((c) => {
                const sched = getPascaRehabSchedule(c.id);
                const isSelected = activeCase?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCase(c)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-800/90 border-sky-500/50 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{c.terperiksa.namaLengkap}</span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{c.nomorPermohonan}</span>
                    </div>
                    {sched ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                        <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="font-mono font-semibold">{sched.tanggal}</span>
                        <span>&bull;</span>
                        <span className="truncate">{sched.waktu} ({sched.jenisProgram})</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>Belum ada jadwal Pasca Rehab</span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Input Form for Jadwal Rehabilitasi Pasca Rehab */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          {!activeCase ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Pilih kasus di sebelah kiri untuk menginput jadwal Rehabilitasi Pasca Rehab.
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="pb-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-white">{activeCase.terperiksa.namaLengkap}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeCase.nomorPermohonan} &bull; {activeCase.instansiPengaju}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-sky-300 border border-slate-700 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Input Tim Medis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 block">
                    Tanggal Jadwal Pasca Rehab <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-sky-500/50 outline-none"
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
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-sky-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 block">
                    Jenis Program Pasca Rehab <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={jenisProgram}
                    onChange={(e) => setJenisProgram(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-sky-500/50 outline-none"
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
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-100 focus:border-sky-500/50 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 block">
                  Catatan / Instruksi Medis Pasca Rehab
                </label>
                <textarea
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:border-sky-500/50 outline-none"
                />
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800/80">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Simpan Jadwal Pasca Rehab</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
