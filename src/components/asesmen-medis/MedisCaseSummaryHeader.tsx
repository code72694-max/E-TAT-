import React from 'react';
import { PermohonanAsesmen } from '../../types';
import { Stethoscope, Package, Shield, CheckCircle2 } from 'lucide-react';

interface MedisCaseSummaryHeaderProps {
  selectedCase: PermohonanAsesmen;
  isCompleted: boolean;
  isReadOnlyView: boolean;
  saveFeedback: string | null;
  onOpenDokumenModal: () => void;
}

export const MedisCaseSummaryHeader: React.FC<MedisCaseSummaryHeaderProps> = ({
  selectedCase,
  isCompleted,
  isReadOnlyView,
  saveFeedback,
  onOpenDokumenModal
}) => {
  return (
    <div className="space-y-4">
      {/* Top Navigation & Case Summary Header */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-[#142642] text-[#d4af37] rounded-lg border border-[#234475]">
              <Stethoscope className="w-4 h-4 text-[#d4af37]" />
            </div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Lembar Kerja Asesmen Medis TAT {isCompleted && <span className="text-emerald-400 font-normal">(Riwayat / Selesai)</span>}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenDokumenModal}
              className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] border border-[#234475] rounded-xl text-xs font-bold text-white flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lihat Dokumen &amp; Barang Bukti</span>
            </button>
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
              isCompleted
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/50'
            }`}>
              {isCompleted ? 'RIWAYAT / FINAL' : 'AKTIF / DRAFT'}
            </span>
          </div>
        </div>

        {/* Subject Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="md:col-span-2 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-[#d4af37]">{selectedCase.nomorPermohonan}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#142642] text-slate-200 border border-[#234475]">
                {selectedCase.jalurPermohonan}
              </span>
            </div>
            <p className="text-base font-bold text-white leading-tight mt-1">{selectedCase.terperiksa.namaLengkap}</p>
            <p className="text-slate-400 text-[11px]">
              NIK: <span className="font-mono text-slate-200">{selectedCase.terperiksa.nik}</span> • Usia: {selectedCase.terperiksa.usia} th • {selectedCase.terperiksa.pekerjaan}
            </p>
          </div>

          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1b3459] md:pl-4 pt-2 md:pt-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Penyidik Pengaju:</span>
            <p className="font-semibold text-white truncate">{selectedCase.perkara.namaPenyidik}</p>
            <p className="text-[11px] text-slate-400 truncate">{selectedCase.perkara.instansiPenyidik}</p>
          </div>

          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1b3459] md:pl-4 pt-2 md:pt-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Barang Bukti Sitaan:</span>
            <div className="space-y-0.5">
              {selectedCase.perkara.barangBuktiList.map((bb, i) => (
                <p key={i} className="text-[11px] text-slate-200 font-semibold truncate">
                  • {bb.jenisZat} {bb.beratBersihGram} gram ({bb.statusKategoriBb})
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Read-Only Status Banner */}
      {isReadOnlyView && (
        <div className="bg-[#0e2238] border border-blue-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900/50 rounded-xl text-blue-300 border border-blue-500/30 shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Mode Arsip &amp; Rekam Medis (Read-Only)</h4>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Berkas asesmen medis ini telah difinalisasi secara sah. Seluruh lembar isian dan parameter medis terkunci untuk menjaga keaslian data.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-lg font-bold">
              TERKUNCI / FINAL
            </span>
          </div>
        </div>
      )}

      {/* Success Feedback Alert */}
      {saveFeedback && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-semibold flex items-center space-x-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveFeedback}</span>
        </div>
      )}
    </div>
  );
};
