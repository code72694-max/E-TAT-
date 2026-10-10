import React, { useState, useMemo } from "react";
import { PermohonanAsesmen, UserProfile } from "../types";
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  Calendar,
  ChevronRight,
  Search,
  Download,
  Award,
  Building2,
  AlertTriangle,
  Stethoscope,
  Scale,
  Users,
  ArrowLeft,
  FileCheck,
  ShieldCheck,
  Activity
} from "lucide-react";

interface RiwayatViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onBack?: () => void;
}

// Hanya status yang BENAR-BENAR SELESAI / FINISHED
const FINISHED_STATUSES = [
  "RESULTS_ISSUED",
  "REJECTED",
  "OUT_OF_SCOPE_REFERRED",
  "FINISHED",
  "VERIFIED_IMPLEMENTED"
];

const FINISHED_PROSES = [
  "rekomendasi_terbit",
  "selesai_tindak_lanjut",
  "ditolak",
  "selesai"
];

function isCaseFinished(p: PermohonanAsesmen): boolean {
  const statusApp = p.applicationStatus ?? "";
  const statusProses = p.statusProsesUtama ?? "";
  const followup = p.followupStatus ?? "";

  return (
    FINISHED_STATUSES.includes(statusApp) ||
    FINISHED_PROSES.includes(statusProses) ||
    followup === "VERIFIED_IMPLEMENTED"
  );
}

function getOutcomeBadge(p: PermohonanAsesmen) {
  const s = p.applicationStatus;
  const statusProses = p.statusProsesUtama;

  if (s === "RESULTS_ISSUED" || statusProses === "rekomendasi_terbit" || statusProses === "selesai_tindak_lanjut") {
    return {
      label: "Rekomendasi Terbit & Selesai",
      cls: "bg-emerald-900/60 text-emerald-300 border-emerald-700/60",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    };
  }
  if (s === "REJECTED" || statusProses === "ditolak") {
    return {
      label: "Ditolak / Gugur",
      cls: "bg-rose-900/60 text-rose-300 border-rose-800/60",
      icon: <XCircle className="w-3.5 h-3.5" />
    };
  }
  if (s === "OUT_OF_SCOPE_REFERRED") {
    return {
      label: "Dirujuk (Non-TAT)",
      cls: "bg-slate-800 text-slate-300 border-slate-700",
      icon: <FileText className="w-3.5 h-3.5" />
    };
  }
  return {
    label: "Asesmen Selesai",
    cls: "bg-emerald-950 text-emerald-400 border-emerald-800",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  };
}

function getRekomendasiSummary(p: PermohonanAsesmen): string {
  if (p.sidangPleno?.jenisRekomendasiFinal) return p.sidangPleno.jenisRekomendasiFinal;
  if (p.asesmenMedis?.kebutuhanRawat) return `Medis: ${p.asesmenMedis.kebutuhanRawat}`;
  return "Selesai Diproses";
}

function RiwayatCard({ p, onSelect }: { p: PermohonanAsesmen; onSelect: () => void }) {
  const outcome = getOutcomeBadge(p);
  const rekomendasi = getRekomendasiSummary(p);
  const auditLogsCount = p.auditLogs ? p.auditLogs.length : 0;
  const lastLog = p.auditLogs && p.auditLogs.length > 0 ? p.auditLogs[0] : null; // Audit logs sorted recent first

  return (
    <div
      onClick={onSelect}
      className="bg-[#091426] border border-[#1a2e4c] hover:border-[#234475] rounded-2xl p-5 hover:bg-[#0c1a30] transition-all group shadow-sm cursor-pointer space-y-4"
    >
      {/* Top Section */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${outcome.cls}`}>
              {outcome.icon}
              <span>{outcome.label}</span>
            </span>
            <span className="text-[10px] font-mono text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-2 py-0.5 rounded-md font-semibold">
              {p.nomorPermohonan}
            </span>
          </div>

          <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">
            {p.terperiksa.namaLengkap}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{p.terperiksa.usia} th ({p.terperiksa.jenisKelamin})</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[200px]">{p.instansiPengaju}</span>
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="shrink-0 flex items-center space-x-1 text-xs font-semibold text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#060e1a] border border-[#d4af37]/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <span>Detail Log</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Outcome & Assessment Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="bg-[#060e1a] border border-[#1a2e4c] rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
            <Stethoscope className="w-3 h-3 text-emerald-400" /> Medis
          </span>
          <p className="font-semibold text-white truncate">{p.asesmenMedis?.kebutuhanRawat || "Telah Diuji"}</p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.asesmenMedis?.diagnosisKlinisIcd || "Diagnosa Lengkap"}</p>
        </div>

        <div className="bg-[#060e1a] border border-[#1a2e4c] rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
            <Scale className="w-3 h-3 text-amber-400" /> Hukum
          </span>
          <p className="font-semibold text-white truncate">{p.asesmenHukum?.analisisPeran || "Analisis SEMA"}</p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.perkara?.pasalDipersangkakan || "Pasal Narkotika"}</p>
        </div>

        <div className="bg-[#060e1a] border border-[#1a2e4c] rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
            <Users className="w-3 h-3 text-sky-400" /> Pleno TAT
          </span>
          <p className="font-semibold text-[#d4af37] truncate">{rekomendasi}</p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">Rekomendasi Terbit</p>
        </div>
      </div>

      {/* Footer Audit History Summary */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-[#1a2e4c]">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Tgl Diajukan: <strong className="text-slate-300">{p.tanggalPengajuan}</strong></span>
        </span>

        <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>Audit Log: <strong className="text-amber-300">{auditLogsCount} Perubahan Recorded</strong></span>
        </span>
      </div>
    </div>
  );
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({ permohonanList, currentUser, onSelectPermohonan, onBack }) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"semua" | "rekomendasi" | "ditolak">("semua");

  // Hanya permohonan yang SUDAH SELESAI
  const finishedList = useMemo(() => {
    return permohonanList.filter(p => isCaseFinished(p));
  }, [permohonanList]);

  const filtered = useMemo(() => {
    let list = finishedList;
    if (filterType === "rekomendasi") {
      list = list.filter(p => p.applicationStatus === "RESULTS_ISSUED" || p.statusProsesUtama === "rekomendasi_terbit" || p.statusProsesUtama === "selesai_tindak_lanjut");
    } else if (filterType === "ditolak") {
      list = list.filter(p => p.applicationStatus === "REJECTED" || p.statusProsesUtama === "ditolak");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.nomorPermohonan.toLowerCase().includes(q) ||
        p.terperiksa.namaLengkap.toLowerCase().includes(q) ||
        p.instansiPengaju.toLowerCase().includes(q) ||
        (p.perkara?.pasalDipersangkakan || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [finishedList, filterType, search]);

  const counts = useMemo(() => ({
    semua: finishedList.length,
    rekomendasi: finishedList.filter(p => p.applicationStatus === "RESULTS_ISSUED" || p.statusProsesUtama === "rekomendasi_terbit" || p.statusProsesUtama === "selesai_tindak_lanjut").length,
    ditolak: finishedList.filter(p => p.applicationStatus === "REJECTED" || p.statusProsesUtama === "ditolak").length,
  }), [finishedList]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a2e4c] pb-4">
        <div>
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 sm:px-3 sm:py-1.5 bg-[#091426] border border-[#1a2e4c] hover:bg-[#142642] text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                title="Kembali"
              >
                <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
                <span>Kembali</span>
              </button>
            )}
            <div className="w-9 h-9 bg-[#142642] border border-[#234475] rounded-xl flex items-center justify-center text-[#d4af37]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-white">Riwayat Asesmen</h1>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#142642] text-[#d4af37] border border-[#234475] rounded-full">
                  {finishedList.length} Berkas Selesai
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dokumentasi arsip lengkap permohonan yang telah menyelesaikan seluruh rangkaian asesmen TAT beserta jejak audit perubahan status.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[#091426] border border-[#1a2e4c] rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#142642] border border-[#234475] flex items-center justify-center text-slate-200">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-white">{counts.semua}</p>
            <p className="text-xs text-slate-400">Total Permohonan Selesai</p>
          </div>
        </div>

        <div className="bg-[#091426] border border-[#1a2e4c] rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#17382d] border border-emerald-700/50 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-emerald-400">{counts.rekomendasi}</p>
            <p className="text-xs text-slate-400">Rekomendasi Terbit / Selesai</p>
          </div>
        </div>

        <div className="bg-[#091426] border border-[#1a2e4c] rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#26161b] border border-rose-800/50 flex items-center justify-center text-rose-300">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-rose-400">{counts.ditolak}</p>
            <p className="text-xs text-slate-400">Permohonan Ditolak / Gugur</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 bg-[#091426] p-1 rounded-xl border border-[#1a2e4c]">
          <button
            onClick={() => setFilterType("semua")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === "semua" ? "bg-[#142642] text-white border border-[#234475]" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Semua Selesai ({counts.semua})
          </button>

          <button
            onClick={() => setFilterType("rekomendasi")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === "rekomendasi" ? "bg-[#142642] text-emerald-300 border border-[#234475]" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Rekomendasi Terbit ({counts.rekomendasi})
          </button>

          <button
            onClick={() => setFilterType("ditolak")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === "ditolak" ? "bg-[#142642] text-rose-300 border border-[#234475]" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Ditolak ({counts.ditolak})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nomor, terperiksa, instansi..."
            className="w-full bg-[#091426] border border-[#1a2e4c] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#234475] transition-colors"
          />
        </div>
      </div>

      {/* Assessment Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#091426] border border-[#1a2e4c] rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">Belum ada riwayat asesmen yang selesai</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Halaman ini hanya menampilkan permohonan yang telah menyelesaikan seluruh tahapan verifikasi, asesmen medis/hukum, sidang pleno, dan penerbitan rekomendasi resmi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(p => (
            <RiwayatCard key={p.id} p={p} onSelect={() => onSelectPermohonan(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
};
