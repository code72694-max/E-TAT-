import React from 'react';
import { UrinTestItem } from './types';
import { Activity, ArrowRight } from 'lucide-react';

interface Step3UjiToksikologiProps {
  urinTests: UrinTestItem[];
  isReadOnlyView: boolean;
  onToggleUrin: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step3UjiToksikologi: React.FC<Step3UjiToksikologiProps> = ({
  urinTests,
  isReadOnlyView,
  onToggleUrin,
  onPrev,
  onNext
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Uji Toksikologi Urin Laboratorium Forensik (SKHPU)</h3>
        </div>
        <span className="text-[11px] text-slate-400 italic">
          {isReadOnlyView ? 'Hasil toksikologi urin resmi terlampir (Terkunci)' : 'Centang / klik tombol status untuk mengubah hasil'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {urinTests.map((test, idx) => {
          const isPos = test.hasil === 'Positif';
          return (
            <div
              key={idx}
              onClick={() => !isReadOnlyView && onToggleUrin(idx)}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                isReadOnlyView ? 'cursor-default' : 'cursor-pointer'
              } ${
                isPos
                  ? 'bg-rose-950/40 border-rose-600/60 shadow-md shadow-rose-950/40'
                  : 'bg-[#050e1c] border-[#1b3459]'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <input
                  disabled={isReadOnlyView}
                  type="checkbox"
                  checked={isPos}
                  onChange={() => !isReadOnlyView && onToggleUrin(idx)}
                  className="w-4 h-4 accent-rose-600 cursor-pointer disabled:cursor-not-allowed rounded"
                />
                <span className="text-xs font-bold text-white truncate">{test.parameter}</span>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ml-2 shrink-0 ${
                isPos ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300'
              }`}>
                {test.hasil}
              </span>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] text-xs space-y-1 text-slate-300">
        <p className="font-semibold text-white">Status Toksikologi Keseluruhan:</p>
        <p className="text-slate-400">
          Terdeteksi metabolit aktif narkotika:{' '}
          <strong className="text-[#d4af37]">
            {urinTests.filter(u => u.hasil === 'Positif').map(u => u.parameter.split('(')[0].trim()).join(', ') || 'Semua Parameter Negatif'}
          </strong>
        </p>
      </div>

      <div className="pt-3 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          ← Kembali
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <span>Lanjut ke Instrumen WHO ASSIST</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
