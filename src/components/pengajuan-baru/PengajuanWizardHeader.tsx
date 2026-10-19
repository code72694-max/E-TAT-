import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface PengajuanWizardHeaderProps {
  currentStep: number;
  onStepClick: (stepNum: number) => void;
  onResetClick: () => void;
}

const WIZARD_STEPS = [
  { num: 1, label: 'Identitas Terperiksa' },
  { num: 2, label: 'Riwayat Kasus (NIK)' },
  { num: 3, label: 'Perkara & Barang Bukti' },
  { num: 4, label: 'Kelengkapan Dokumen' },
  { num: 5, label: 'Konfirmasi Pengajuan' },
];

export const PengajuanWizardHeader: React.FC<PengajuanWizardHeaderProps> = ({
  currentStep,
  onStepClick,
  onResetClick,
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#142642] border border-[#234475] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Pengajuan Permohonan Asesmen Terpadu (TAT)
          </span>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={onResetClick}
            className="text-xs font-semibold text-slate-300 hover:text-rose-400 bg-[#142642] hover:bg-rose-950/40 px-3 py-1.5 rounded-lg border border-[#234475] hover:border-rose-500/50 transition-all cursor-pointer flex items-center space-x-1.5"
            title="Kosongkan formulir dan hapus draf lokal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        </div>
      </div>

      {/* Wizard Step Indicators Bar */}
      <div className="pt-1">
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
          {WIZARD_STEPS.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => onStepClick(s.num)}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                currentStep === s.num
                  ? 'bg-[#142642] text-[#D4AF37] font-bold border border-[#2d5289] shadow-md shadow-black/40'
                  : currentStep > s.num
                  ? 'text-emerald-400 hover:bg-white/5'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                  currentStep === s.num
                    ? 'bg-[#1b3459] text-[#D4AF37] border-[#D4AF37]'
                    : currentStep > s.num
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-[#050e1c] text-slate-500 border-[#1b3459]'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-normal">Langkah {s.num}</div>
                <div className="text-xs">{s.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
