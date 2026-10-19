import React from 'react';
import { ValidationModalState } from './types';
import { AlertCircle, X, ChevronRight } from 'lucide-react';

interface MedisValidationModalProps {
  modalState: ValidationModalState | null;
  onClose: () => void;
}

export const MedisValidationModal: React.FC<MedisValidationModalProps> = ({
  modalState,
  onClose
}) => {
  if (!modalState || !modalState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1b3459]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#142642] text-[#d4af37] rounded-xl border border-[#234475] shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Lengkapi Formulir</h3>
              <p className="text-xs text-slate-400 mt-0.5">{modalState.stepTitle}</p>
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
        <div className="space-y-3">
          <p className="text-xs text-slate-300">
            Harap lengkapi seluruh field wajib berikut sebelum melanjutkan ke tahapan berikutnya:
          </p>
          <div className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-3.5 max-h-60 overflow-y-auto space-y-2">
            {modalState.missingFields.map((field, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="text-slate-200 font-medium">{field}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <span>Tutup &amp; Lengkapi Sekarang</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
