import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, X, Loader2, ArrowRight } from 'lucide-react';

interface ModalKonfirmasiFinalisasiHukumProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nomorPermohonan: string;
  namaTerperiksa: string;
  nomorLp: string;
  analisisPeran: string;
  rekomendasiHukum: string;
  isSubmitting?: boolean;
}

export const ModalKonfirmasiFinalisasiHukum: React.FC<ModalKonfirmasiFinalisasiHukumProps> = ({
  isOpen,
  onClose,
  onConfirm,
  nomorPermohonan,
  namaTerperiksa,
  nomorLp,
  analisisPeran,
  rekomendasiHukum,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#081224] border border-[#1b3459] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b3459] bg-[#0c1a30]/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600/30 to-amber-600/30 border border-blue-500/40 rounded-xl text-amber-400">
              <Scale className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Konfirmasi Finalisasi Asesmen Hukum</h3>
              <p className="text-[11px] text-slate-400">Sidang Tim Asesmen Terpadu (TAT)</p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Main Question Alert */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white text-xs leading-relaxed">
                Apakah Anda yakin ingin menyelesaikan dan memfinalisasi Asesmen Hukum ini?
              </p>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Berkas akan diteruskan ke <strong className="text-amber-300">Sidang Pleno TAT</strong> dan berpindah ke <strong className="text-amber-300">Riwayat Hukum</strong>.
              </p>
            </div>
          </div>

          {/* Case Summary Card */}
          <div className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rincian Perkara</span>
              <span className="font-mono text-[11px] font-bold text-[#d4af37]">{nomorPermohonan}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Nama Tersangka</span>
                <span className="font-bold text-white truncate block">{namaTerperiksa}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Nomor LP</span>
                <span className="font-mono text-slate-200 truncate block">{nomorLp || '-'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1b3459] space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px]">Kualifikasi Peran (SEMA):</span>
                <span className="font-bold text-amber-300">{analisisPeran || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px]">Rekomendasi Yuridis:</span>
                <span className="font-bold text-blue-300 text-right truncate max-w-[240px]">{rekomendasiHukum || '-'}</span>
              </div>
            </div>
          </div>

          {/* Workflow Status Note */}
          <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl flex items-center space-x-2.5 text-[11px] text-blue-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Setelah finalisasi, hasil telaah yuridis akan terkunci secara permanen dan siap dijadikan bahan Sidang Pleno bersama Tim Medis dan Tim Hukum.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2.5 px-6 py-4 border-t border-[#1b3459] bg-[#0c1a30]/80">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-slate-300 border border-[#234475] rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            Batal / Periksa Kembali
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-5 py-2.5 bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white font-bold rounded-xl text-xs flex items-center space-x-2 border border-[#2d7ad6]/70 shadow-[0_2px_12px_rgba(20,83,154,0.4)] transition-all disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Memfinalisasi Berkas...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-sky-300" />
                <span>Ya, Selesaikan &amp; Finalisasi</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
