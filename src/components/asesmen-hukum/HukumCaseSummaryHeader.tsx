import React from 'react';
import { PermohonanAsesmen } from '../../types';
import { Scale, Package } from 'lucide-react';

interface HukumCaseSummaryHeaderProps {
  selectedCase: PermohonanAsesmen;
  isReadOnlyView: boolean;
  onOpenDokumenModal: () => void;
  onCloseCase?: () => void;
}

export const HukumCaseSummaryHeader: React.FC<HukumCaseSummaryHeaderProps> = ({
  selectedCase,
  isReadOnlyView,
  onOpenDokumenModal,
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-[#142642] text-[#d4af37] rounded-lg border border-[#234475]">
            <Scale className="w-4 h-4 text-[#d4af37]" />
          </div>
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Lembar Telaah Yuridis Asesmen Hukum TAT {isReadOnlyView && <span className="text-blue-400 font-normal">(Riwayat / Selesai)</span>}
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
            isReadOnlyView
              ? 'bg-blue-950/60 text-blue-300 border-blue-500/50'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
          }`}>
            {isReadOnlyView ? 'RIWAYAT / FINAL' : 'AKTIF / DRAFT'}
          </span>
        </div>
      </div>

      {/* Subject Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="md:col-span-2 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-sm text-[#d4af37]">{selectedCase.nomorPermohonan}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#142642] text-slate-200 border border-[#234475]">
              LP: {selectedCase.perkara.nomorLaporanPolisi}
            </span>
          </div>
          <p className="text-base font-bold text-white leading-tight mt-1">{selectedCase.terperiksa.namaLengkap}</p>
          <p className="text-slate-400 text-[11px]">
            NIK: <span className="font-mono text-slate-200">{selectedCase.terperiksa.nik}</span> • Usia: {selectedCase.terperiksa.usia} th • Pasal: <span className="text-amber-300 font-mono">{selectedCase.perkara.pasalDipersangkakan}</span>
          </p>
        </div>

        <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1b3459] md:pl-4 pt-2 md:pt-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Penyidik Satuan:</span>
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
  );
};
