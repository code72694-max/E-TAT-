import React from 'react';
import { Scale, ArrowRight } from 'lucide-react';
import { FormDataHukum } from './types';

interface Step2TelaahSemaProps {
  formData: FormDataHukum;
  setFormData: React.Dispatch<React.SetStateAction<FormDataHukum>>;
  isReadOnlyView: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const Step2TelaahSema: React.FC<Step2TelaahSemaProps> = ({
  formData,
  setFormData,
  isReadOnlyView,
  onBack,
  onNext,
}) => {
  const berat = parseFloat(formData.totalBeratBersihGram || '0') || 0;
  const isTanpaBB = (formData.kesesuaianSema || '').toLowerCase().includes('tanpa barang bukti');

  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Telaah Batasan Gramatur Barang Bukti (SEMA 04/2010)</h3>
        </div>

        {/* Real-time Indicator Badge */}
        {isTanpaBB ? (
          <span className="px-2.5 py-1 bg-blue-950/80 border border-blue-500/50 text-blue-300 text-[11px] font-bold rounded-lg">
            🔵 Tanpa BB (Hanya Urin/Pasal 127)
          </span>
        ) : berat > 0 && berat <= 1.0 ? (
          <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold rounded-lg flex items-center space-x-1">
            <span>✓</span>
            <span>≤ 1.0g Sabu (Memenuhi SEMA 04/2010)</span>
          </span>
        ) : berat > 1.0 ? (
          <span className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[11px] font-bold rounded-lg flex items-center space-x-1">
            <span>⚠</span>
            <span>&gt; 1.0g Sabu (Melebihi Ambang Batas 1 Hari)</span>
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Total Berat Bersih Barang Bukti (Gram) <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            maxLength={8}
            disabled={isReadOnlyView}
            value={formData.totalBeratBersihGram || ''}
            onChange={(e) => {
              const normalized = e.target.value.replace(/,/g, '.');
              const val = normalized.replace(/[^0-9.]/g, '').slice(0, 8);
              const parts = val.split('.');
              const clean = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
              setFormData({ ...formData, totalBeratBersihGram: clean });
            }}
            placeholder="0.42"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-bold font-mono text-sm disabled:opacity-75 disabled:cursor-not-allowed"
          />
          <p className="text-[10px] text-slate-400 mt-1 italic">
            * Koma otomatis diubah menjadi titik desimal (contoh: 0.42 gram).
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="text-slate-300 font-semibold mb-1.5 block">Rujukan Ambang Batas SEMA No. 04 Tahun 2010</label>
          <input
            type="text"
            maxLength={200}
            disabled={isReadOnlyView}
            value={formData.ambangBatasSema || ''}
            onChange={(e) => setFormData({ ...formData, ambangBatasSema: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-slate-300 p-2.5 rounded-xl outline-none disabled:opacity-75 disabled:cursor-not-allowed"
          />
          {!isReadOnlyView && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 self-center mr-1">Preset Ambang Batas:</span>
              {[
                { label: 'Sabu (≤ 1.0g)', text: 'Maksimal 1.0 Gram (Metamfetamina / Sabu SEMA No. 04/2010)' },
                { label: 'Ganja (≤ 5.0g)', text: 'Maksimal 5.0 Gram (Ganja / Kanabis SEMA No. 04/2010)' },
                { label: 'Ekstasi (≤ 2.4g / 8 Butir)', text: 'Maksimal 2.4 Gram atau 8 Butir (MDMA / Ekstasi SEMA No. 04/2010)' },
                { label: 'Heroin (≤ 1.8g)', text: 'Maksimal 1.8 Gram (Heroin / Putau SEMA No. 04/2010)' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, ambangBatasSema: item.text })}
                  className="px-2 py-0.5 bg-[#142642] hover:bg-[#1f3a63] text-[#d4af37] border border-[#234475] rounded text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-3">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Status Kesesuaian Gramatur Konsumsi 1 Hari <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.kesesuaianSema || ''}
            onChange={(e) => setFormData({ ...formData, kesesuaianSema: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 cursor-pointer font-bold text-emerald-400 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="Memenuhi Batas Gramatur SEMA 04/2010 (Pemakaian 1 Hari)">Memenuhi Batas Gramatur SEMA 04/2010 (Pemakaian 1 Hari Konsumsi Pribadi)</option>
            <option value="Melebihi Batas Gramatur SEMA 04/2010 (Indikasi Stok / Penjualan)">Melebihi Batas Gramatur SEMA 04/2010 (Indikasi Stok / Penjualan)</option>
            <option value="Tanpa Barang Bukti Narkotika (Hanya Positif Urin / Pasal 127)">Tanpa Barang Bukti Narkotika (Hanya Positif Urin / Pasal 127)</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Analisis &amp; Pertimbangan Yuridis Barang Bukti <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.analisisBarangBukti || '').length}/3000</span>
          </div>
          <textarea
            rows={3}
            maxLength={3000}
            disabled={isReadOnlyView}
            value={formData.analisisBarangBukti || ''}
            onChange={(e) => setFormData({ ...formData, analisisBarangBukti: e.target.value })}
            placeholder="Uraikan evaluasi yuridis terkait barang bukti yang disita penyidik..."
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="pt-3 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          ← Kembali
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <span>Lanjut ke Kualifikasi Peran</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
