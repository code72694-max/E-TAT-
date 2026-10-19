import React from 'react';
import { Activity, Check } from 'lucide-react';
import { PERAN_OPTIONS, getSpesialisasiOptions } from './constants';

interface Section2PeranSistemProps {
  peranSistem: string;
  setPeranSistem: (val: string) => void;
  spesialisasiTugas: string[];
  setSpesialisasiTugas: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Section2PeranSistem: React.FC<Section2PeranSistemProps> = ({
  peranSistem,
  setPeranSistem,
  spesialisasiTugas,
  setSpesialisasiTugas
}) => {
  const handleSpesialisasiToggle = (spec: string) => {
    if (spesialisasiTugas.includes(spec)) {
      setSpesialisasiTugas(spesialisasiTugas.filter(s => s !== spec));
    } else {
      setSpesialisasiTugas([...spesialisasiTugas, spec]);
    }
  };

  const currentSpecs = getSpesialisasiOptions(peranSistem);

  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
        <Activity className="w-4 h-4 text-[#D4AF37]" />
        <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
          2. Peran & Tugas dalam Sistem E-TAT
        </h2>
      </div>

      <div className="space-y-4 text-xs">
        <div className="space-y-2">
          <label className="font-semibold text-slate-200 block">
            Tugas / Peran Utama Akses Akun <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {PERAN_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  peranSistem === opt.value
                    ? 'bg-[#133863] border-[#245899] text-white shadow-md'
                    : 'bg-[#081224] border-[#1b3459] text-slate-300 hover:bg-[#0b172a] hover:border-[#1b3459]/80'
                }`}
              >
                <input
                  type="radio"
                  name="peranSistem"
                  value={opt.value}
                  checked={peranSistem === opt.value}
                  onChange={() => {
                    setPeranSistem(opt.value);
                    setSpesialisasiTugas([]);
                  }}
                  className="hidden"
                />
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    peranSistem === opt.value ? 'border-[#D4AF37]' : 'border-slate-500'
                  }`}
                >
                  {peranSistem === opt.value && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                </div>
                <span className="font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {currentSpecs.length > 0 && (
          <div className="space-y-2 pt-2 animate-in fade-in duration-200">
            <label className="font-semibold text-[#D4AF37] block">
              Spesialisasi / Sub-Tugas (Pilih yang sesuai)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#081224] border border-[#1b3459] p-4 rounded-xl">
              {currentSpecs.map(spec => (
                <label
                  key={spec}
                  onClick={() => handleSpesialisasiToggle(spec)}
                  className="flex items-center space-x-3 cursor-pointer group select-none"
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      spesialisasiTugas.includes(spec)
                        ? 'bg-[#D4AF37] border-[#D4AF37]'
                        : 'bg-[#0b172a] border-[#1b3459] group-hover:border-slate-400'
                    }`}
                  >
                    {spesialisasiTugas.includes(spec) && <Check className="w-3.5 h-3.5 text-[#071325]" />}
                  </div>
                  <span
                    className={`text-xs ${
                      spesialisasiTugas.includes(spec) ? 'text-white font-medium' : 'text-slate-300'
                    }`}
                  >
                    {spec}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
