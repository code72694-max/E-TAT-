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
  ArrowLeft
} from "lucide-react";

interface RiwayatViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onBack?: () => void;
}

const SELESAI_STATUSES = ["RESULTS_ISSUED","OUTCOME_RECORDED_FOR_DRAFT","AWAITING_SIGNED_OUTPUTS"];
const SELESAI_PROSES = ["pengesahan_rekomendasi","rekomendasi_terbit","selesai_tindak_lanjut"];

function getOutcomeBadge(p: PermohonanAsesmen) {
  const s = p.applicationStatus;
  if (s === "RESULTS_ISSUED" || p.statusProsesUtama === "rekomendasi_terbit")
    return { label:"Selesai & Terkirim", cls:"bg-emerald-900/60 text-emerald-300 border-emerald-700", icon:<CheckCircle2 className="w-3 h-3"/> };
  if (s === "AWAITING_SIGNED_OUTPUTS" || p.statusProsesUtama === "pengesahan_rekomendasi")
    return { label:"Menunggu Pengesahan", cls:"bg-amber-900/60 text-amber-300 border-amber-700", icon:<Clock className="w-3 h-3"/> };
  if (s === "OUTCOME_RECORDED_FOR_DRAFT" || p.statusDokumen === "draf")
    return { label:"Draf Rekomendasi", cls:"bg-slate-700/60 text-slate-300 border-slate-600", icon:<FileText className="w-3 h-3"/> };
  return { label:s ?? "Selesai", cls:"bg-slate-700 text-slate-300 border-slate-600", icon:<CheckCircle2 className="w-3 h-3"/> };
}

function getRekomendasiSummary(p: PermohonanAsesmen): string {
  if (p.sidangPleno?.jenisRekomendasiFinal) return p.sidangPleno.jenisRekomendasiFinal;
  if (p.asesmenMedis?.kebutuhanRawat) return `Medis: ${p.asesmenMedis.kebutuhanRawat}`;
  return "Belum tersedia";
}

function RiwayatCard({ p, onSelect }: { p: PermohonanAsesmen; onSelect: () => void }) {
  const outcome = getOutcomeBadge(p);
  const rekomendasi = getRekomendasiSummary(p);
  const selesai = p.sidangPleno?.tanggalPleno || p.tanggalPengajuan;
  const lastLog = p.auditLogs?.[p.auditLogs.length - 1];
  return (
    <div className="bg-[#0c1b2e] border border-[#1b3459] rounded-2xl p-5 hover:border-[#2a4a7a] transition-all group shadow-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${outcome.cls}`}>
              {outcome.icon}{outcome.label}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">{p.nomorPermohonan}</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <User className="w-3 h-3 shrink-0"/>
            <span className="font-medium text-slate-300">{p.terperiksa.namaLengkap}</span>
            <span className="text-slate-600">•</span>
            <span>{p.terperiksa.usia} th, {p.terperiksa.jenisKelamin}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Building2 className="w-3 h-3"/>{p.instansiPengaju}
          </p>
        </div>
        <button onClick={onSelect}
          className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-black border border-[#d4af37]/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
          Lihat <ChevronRight className="w-3 h-3"/>
        </button>
      </div>

      {/* Outcome summary */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#081526] border border-[#1b3459] rounded-lg p-2.5">
          <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><Stethoscope className="w-3 h-3"/>Medis</p>
          <p className="text-[10px] font-semibold text-white leading-tight">{p.asesmenMedis?.kebutuhanRawat || "—"}</p>
          {p.asesmenMedis?.durasiUsulanBulan && <p className="text-[9px] text-slate-500">{p.asesmenMedis.durasiUsulanBulan} bulan</p>}
        </div>
        <div className="bg-[#081526] border border-[#1b3459] rounded-lg p-2.5">
          <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><Scale className="w-3 h-3"/>Hukum</p>
          <p className="text-[10px] font-semibold text-white leading-tight">{p.asesmenHukum?.analisisPeran || "—"}</p>
          {p.asesmenHukum?.rekomendasiHukum && <p className="text-[9px] text-slate-500 truncate">{p.asesmenHukum.rekomendasiHukum}</p>}
        </div>
        <div className="bg-[#081526] border border-[#1b3459] rounded-lg p-2.5">
          <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><Users className="w-3 h-3"/>Pleno</p>
          <p className="text-[10px] font-semibold text-white leading-tight truncate">{rekomendasi}</p>
          {p.sidangPleno?.durasiRehabBulan && <p className="text-[9px] text-slate-500">{p.sidangPleno.durasiRehabBulan} bulan</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-[#1b3459]">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>Diajukan: {p.tanggalPengajuan}</span>
        {lastLog && <span className="flex items-center gap-1 truncate"><Clock className="w-3 h-3"/>{lastLog.timestamp}</span>}
      </div>
    </div>
  );
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({ permohonanList, currentUser, onSelectPermohonan, onBack }) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"semua"|"selesai"|"menunggu">("semua");

  const selesaiList = useMemo(() =>
    permohonanList.filter(p =>
      SELESAI_STATUSES.includes(p.applicationStatus ?? "") || SELESAI_PROSES.includes(p.statusProsesUtama ?? "")
    ), [permohonanList]);

  const filtered = useMemo(() => {
    let list = selesaiList;
    if (filterType === "selesai") list = list.filter(p => p.applicationStatus === "RESULTS_ISSUED" || p.statusProsesUtama === "rekomendasi_terbit");
    else if (filterType === "menunggu") list = list.filter(p => p.applicationStatus === "AWAITING_SIGNED_OUTPUTS" || p.statusProsesUtama === "pengesahan_rekomendasi");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.nomorPermohonan.toLowerCase().includes(q)||p.terperiksa.namaLengkap.toLowerCase().includes(q)||p.instansiPengaju.toLowerCase().includes(q));
    }
    return list;
  }, [selesaiList, filterType, search]);

  const counts = useMemo(() => ({
    semua: selesaiList.length,
    selesai: selesaiList.filter(p => p.applicationStatus==="RESULTS_ISSUED"||p.statusProsesUtama==="rekomendasi_terbit").length,
    menunggu: selesaiList.filter(p => p.applicationStatus==="AWAITING_SIGNED_OUTPUTS"||p.statusProsesUtama==="pengesahan_rekomendasi").length,
  }), [selesaiList]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 sm:px-3 sm:py-1.5 bg-[#081224] border border-[#1b3459] hover:bg-[#142642] text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 mr-1"
                title="Kembali ke Daftar Permohonan"
              >
                <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
                <span>Kembali</span>
              </button>
            )}
            <div className="w-8 h-8 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center">
              <History className="w-4 h-4 text-slate-300"/>
            </div>
            <h1 className="text-lg font-bold text-white">Riwayat Permohonan</h1>
            <span className="px-2 py-0.5 text-xs font-bold bg-slate-800 text-slate-300 border border-slate-600 rounded-full">{selesaiList.length} Kasus</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 ml-10">Arsip seluruh permohonan yang telah menyelesaikan proses asesmen dan penerbitan dokumen.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Total Riwayat", value:counts.semua, clsBg:"bg-slate-800/40", clsBorder:"border-slate-600/40", clsTxt:"text-slate-300", icon:<History className="w-4 h-4"/> },
          { label:"Selesai Penuh", value:counts.selesai, clsBg:"bg-emerald-900/30", clsBorder:"border-emerald-700/40", clsTxt:"text-emerald-400", icon:<CheckCircle2 className="w-4 h-4"/> },
          { label:"Menunggu Pengesahan", value:counts.menunggu, clsBg:"bg-amber-900/30", clsBorder:"border-amber-700/40", clsTxt:"text-amber-400", icon:<Clock className="w-4 h-4"/> },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0c1b2e] border border-[#1b3459] rounded-xl p-4 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${stat.clsBg} border ${stat.clsBorder} flex items-center justify-center ${stat.clsTxt}`}>{stat.icon}</div>
            <div><p className="text-lg font-black text-white">{stat.value}</p><p className="text-[10px] text-slate-400">{stat.label}</p></div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(["semua","selesai","menunggu"] as const).map(f => {
            const labels: Record<string,string> = { semua:"Semua", selesai:"Selesai Penuh", menunggu:"Menunggu Pengesahan" };
            const isActive = filterType === f;
            return (
              <button key={f} onClick={() => setFilterType(f)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${isActive ? "bg-slate-600 text-white border-slate-500" : "bg-[#0c1b2e] text-slate-400 border-[#1b3459] hover:text-white"}`}>
                {labels[f]} <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive?"bg-slate-500 text-white":"bg-[#1b3459] text-slate-400"}`}>{counts[f]}</span>
              </button>
            );
          })}
        </div>
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"/>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nomor, nama terperiksa, atau instansi..."
            className="w-full bg-[#0c1b2e] border border-[#1b3459] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"/>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <History className="w-10 h-10 mx-auto mb-3 opacity-30"/>
          <p className="font-semibold">Belum ada riwayat permohonan</p>
          <p className="text-xs mt-1">Permohonan yang telah selesai akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(p => (
            <React.Fragment key={p.id}>
              <RiwayatCard p={p} onSelect={() => onSelectPermohonan(p.id)}/>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
