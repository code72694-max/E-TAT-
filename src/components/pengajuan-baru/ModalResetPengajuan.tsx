import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ModalResetPengajuanProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModalResetPengajuan: React.FC<ModalResetPengajuanProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1b3459]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Konfirmasi Reset Form</h3>
              <p className="text-xs text-slate-400 mt-0.5">Pengajuan Permohonan TAT</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#142642] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            Apakah Anda yakin ingin mengosongkan seluruh isian formulir?
          </p>
          <div className="p-3.5 bg-rose-950/20 border border-rose-500/25 rounded-xl flex items-start space-x-3 text-xs text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              Seluruh draf yang telah tersimpan di browser Anda (Langkah 1 s.d. 4) akan dihapus secara permanen.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[#1b3459]/80">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 hover:text-white border border-[#234475] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-rose-950/50 flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ya, Reset Formulir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
