import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { FormDataHukum } from './types';

interface Step1KonstruksiKasusProps {
  formData: FormDataHukum;
  setFormData: React.Dispatch<React.SetStateAction<FormDataHukum>>;
  isReadOnlyView: boolean;
  onNext: () => void;
}

export const Step1KonstruksiKasus: React.FC<Step1KonstruksiKasusProps> = ({
  formData,
  setFormData,
  isReadOnlyView,
  onNext,
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
        <BookOpen className="w-4 h-4 text-blue-400" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Konstruksi Perkara &amp; Dokumen Penyidikan</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Nomor Laporan Polisi (LP / LKN) <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.nomorLp || '').length}/100</span>
          </div>
          <input
            type="text"
            maxLength={100}
            disabled={isReadOnlyView}
            value={formData.nomorLp || ''}
            onChange={(e) => setFormData({ ...formData, nomorLp: e.target.value.toUpperCase() })}
            placeholder="LP/A/128/VIII/2026/SPKT/POLRESTA SAMARINDA"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-mono uppercase disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Pasal yang Dipersangkakan Penyidik <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.pasalSangkaan || '').length}/500</span>
          </div>
          <input
            type="text"
            maxLength={500}
            disabled={isReadOnlyView}
            value={formData.pasalSangkaan || ''}
            onChange={(e) => setFormData({ ...formData, pasalSangkaan: e.target.value })}
            placeholder="Pasal 114 ayat (1) subs Pasal 112 ayat (1) lebih subs Pasal 127 ayat (1) huruf a UU No. 35/2009"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-mono disabled:opacity-75 disabled:cursor-not-allowed"
          />
          {!isReadOnlyView && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 self-center mr-1">Rujukan Cepat:</span>
              {[
                'Pasal 127 ayat (1) huruf a UU 35/2009',
                'Pasal 114 ayat (1) UU 35/2009',
                'Pasal 112 ayat (1) UU 35/2009',
                'jo Pasal 55 ayat (1) ke-1 KUHP'
              ].map((pasal, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const current = formData.pasalSangkaan ? `${formData.pasalSangkaan} subs ${pasal}` : pasal;
                    setFormData({ ...formData, pasalSangkaan: current });
                  }}
                  className="px-2 py-0.5 bg-[#142642] hover:bg-[#1f3a63] text-blue-300 border border-blue-500/30 rounded text-[10px] font-mono transition-colors cursor-pointer"
                >
                  + {pasal.split(' ')[0]} {pasal.split(' ')[1]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Tempat Kejadian Perkara (TKP Penangkapan) <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.lokasiTkp || '').length}/500</span>
          </div>
          <input
            type="text"
            maxLength={500}
            disabled={isReadOnlyView}
            value={formData.lokasiTkp || ''}
            onChange={(e) => setFormData({ ...formData, lokasiTkp: e.target.value })}
            placeholder="Jalan Pelita No. 45, RT 12, Kel. Sungai Pinang Dalam, Kec. Samarinda Utara"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Kronologi Singkat Fakta Penangkapan <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.kronologiPenangkapan || '').length}/2000</span>
          </div>
          <textarea
            rows={4}
            maxLength={2000}
            disabled={isReadOnlyView}
            value={formData.kronologiPenangkapan || ''}
            onChange={(e) => setFormData({ ...formData, kronologiPenangkapan: e.target.value })}
            placeholder="Tuliskan kronologi singkat saat petugas mengamankan tersangka beserta barang buktinya..."
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <span>Lanjut ke Telaah SEMA 04/2010</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
