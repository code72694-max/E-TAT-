import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { ValidationModalState } from './types';

interface HukumValidationModalProps {
  modalState: ValidationModalState | null;
  onClose: () => void;
}

export const HukumValidationModal: React.FC<HukumValidationModalProps> = ({
  modalState,
  onClose,
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
              <h3 className="text-base font-bold text-white">Lengkapi Telaah Yuridis</h3>
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
          <p className="text-sm text-slate-300">
            Mohon lengkapi isian telaah hukum berikut sebelum beralih ke tahapan selanjutnya:
          </p>
          <div className="bg-[#071326] border border-[#1b3459]/80 rounded-xl p-4 max-h-60 overflow-y-auto space-y-2">
            {modalState.missingFields.map((field, idx) => (
              <div key={idx} className="flex items-center space-x-2.5 text-sm text-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                <span>{field}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-white border border-[#234475] rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Tutup &amp; Lengkapi
          </button>
        </div>
      </div>
    </div>
  );
};
