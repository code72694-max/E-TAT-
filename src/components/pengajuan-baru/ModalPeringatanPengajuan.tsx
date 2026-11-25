import React from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';

interface ModalPeringatanPengajuanProps {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: 'warning' | 'error';
  onClose: () => void;
}

export const ModalPeringatanPengajuan: React.FC<ModalPeringatanPengajuanProps> = ({
  isOpen,
  title,
  message,
  variant = 'warning',
  onClose,
}) => {
  if (!isOpen) return null;

  const isError = variant === 'error';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1b3459]">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isError
                  ? 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                  : 'bg-[#142642] text-[#d4af37] border-[#234475]'
              }`}
            >
              {isError ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Sistem Pengajuan E-TAT SIAP PULIH</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#142642] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-[#071326] border border-[#1b3459]/80 rounded-xl p-4">
          <p className="text-sm text-slate-200 leading-relaxed">{message}</p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c84a] text-[#0b172a] rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-md"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
