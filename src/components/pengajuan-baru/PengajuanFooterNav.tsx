import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PengajuanFooterNavProps {
  step: number;
  isSendingEmail: boolean;
  onBack: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
}

export const PengajuanFooterNav: React.FC<PengajuanFooterNavProps> = ({
  step,
  isSendingEmail,
  onBack,
  onPrevStep,
  onNextStep,
  onSubmit,
}) => {
  return (
    <div className="pt-6 border-t border-[#1b3459] flex items-center justify-between">
      {step > 1 ? (
        <button
          type="button"
          onClick={onPrevStep}
          className="px-5 py-2.5 border border-[#1b3459] rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#1b3459] flex items-center space-x-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-[#1b3459] rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#1b3459] flex items-center space-x-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Batal &amp; Kembali</span>
        </button>
      )}

      {step < 5 ? (
        <button
          type="button"
          onClick={onNextStep}
          className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] cursor-pointer transition-all"
        >
          <span>Lanjutkan ke Langkah {step + 1}</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSendingEmail}
          className="bg-[#133863] hover:bg-[#1a4a82] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-emerald-500 cursor-pointer shadow-lg shadow-emerald-900/30 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {isSendingEmail ? 'Mengirim Berkas...' : 'Kirim Permohonan ke Sekretariat TAT'}
          </span>
        </button>
      )}
    </div>
  );
};
