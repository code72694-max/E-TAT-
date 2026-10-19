import React from 'react';
import { User, ArrowRight } from 'lucide-react';
import { FormDataHukum, FaktaItem } from './types';

interface Step3KualifikasiPeranProps {
  formData: FormDataHukum;
  setFormData: React.Dispatch<React.SetStateAction<FormDataHukum>>;
  faktaList: FaktaItem[];
  toggleFakta: (id: string) => void;
  showAddFakta: boolean;
  setShowAddFakta: (show: boolean) => void;
  customFaktaInput: string;
  setCustomFaktaInput: (val: string) => void;
  onAddCustomFakta: () => void;
  onSelectAllFakta: (checked: boolean) => void;
  isReadOnlyView: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const Step3KualifikasiPeran: React.FC<Step3KualifikasiPeranProps> = ({
  formData,
  setFormData,
  faktaList,
  toggleFakta,
  showAddFakta,
  setShowAddFakta,
  customFaktaInput,
  setCustomFaktaInput,
  onAddCustomFakta,
  onSelectAllFakta,
  isReadOnlyView,
  onBack,
  onNext,
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
        <User className="w-4 h-4 text-emerald-400" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Kualifikasi Peran &amp; Checklist Fakta Yuridis Terverifikasi</h3>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Kualifikasi Tipologi Peran Terperiksa <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.analisisPeran}
            onChange={(e: any) => setFormData({ ...formData, analisisPeran: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-3 rounded-xl outline-none focus:border-blue-500 cursor-pointer font-bold text-sm text-[#d4af37] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="Penyalahguna Murni">Penyalah Guna Murni (Hanya untuk Diri Sendiri / Konsumsi Pribadi)</option>
            <option value="Pecandu dengan Kepemilikan Terbatas">Pecandu dengan Kepemilikan Terbatas (Patungan / Membeli Bersama)</option>
            <option value="Korban Penyalahgunaan">Korban Penyalahgunaan Narkotika (Ditipu / Dipaksa / Dijebak)</option>
            <option value="Indikasi Pengedar / Jaringan">Indikasi Pengedar / Terlibat Jaringan Peredaran Gelap</option>
            <option value="Belum Dapat Disimpulkan">Belum Dapat Disimpulkan (Perlu Pendalaman)</option>
          </select>
        </div>

        {/* Checklist Fakta Pendukung */}
        <div className="space-y-2 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-slate-300 font-semibold block">
              Checklist Fakta Yuridis Pendukung (Centang yang Terbukti Memenuhi) <span className="text-rose-400">*</span>:
            </label>
            {!isReadOnlyView && (
              <div className="flex items-center space-x-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => onSelectAllFakta(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                >
                  Pilih Semua
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => onSelectAllFakta(false)}
                  className="text-slate-400 hover:text-slate-300 transition-colors font-medium cursor-pointer"
                >
                  Batal Semua
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setShowAddFakta(!showAddFakta)}
                  className="text-[#d4af37] hover:underline font-bold cursor-pointer"
                >
                  + Tambah Fakta
                </button>
              </div>
            )}
          </div>

          {/* Optional Custom Fact Add Field */}
          {showAddFakta && !isReadOnlyView && (
            <div className="p-3 bg-[#071326] border border-blue-500/40 rounded-xl space-y-2 animate-in fade-in">
              <label className="text-[11px] font-semibold text-blue-300">Tambah Fakta Yuridis Baru:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={250}
                  value={customFaktaInput}
                  onChange={(e) => setCustomFaktaInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onAddCustomFakta(); }}
                  placeholder="Tuliskan fakta yuridis baru yang terbukti dalam penyidikan..."
                  className="flex-1 bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={onAddCustomFakta}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFakta(false)}
                  className="px-2.5 py-2 bg-[#142642] text-slate-400 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {faktaList.map((fakta) => (
              <div
                key={fakta.id}
                onClick={() => toggleFakta(fakta.id)}
                className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                  isReadOnlyView ? 'cursor-default' : 'cursor-pointer'
                } ${
                  fakta.checked
                    ? 'bg-blue-950/40 border-blue-500/60 text-white shadow-xs'
                    : 'bg-[#050e1c] border-[#1b3459] text-slate-400 hover:bg-[#0c1c34]'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={isReadOnlyView}
                  checked={fakta.checked}
                  onChange={() => toggleFakta(fakta.id)}
                  className="w-4 h-4 accent-blue-600 rounded shrink-0 disabled:cursor-not-allowed cursor-pointer"
                />
                <span className="text-xs font-semibold leading-snug">{fakta.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Argumentasi Yuridis Kualifikasi Peran <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.argumentasiPeran || '').length}/3000</span>
          </div>
          <textarea
            rows={3}
            maxLength={3000}
            disabled={isReadOnlyView}
            value={formData.argumentasiPeran || ''}
            onChange={(e) => setFormData({ ...formData, argumentasiPeran: e.target.value })}
            placeholder="Uraikan alasan mengapa tersangka dikualifikasikan pada peran tersebut..."
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">Catatan Fakta yang Belum Cukup Bukti / Masih Ditelusuri</label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.catatanBelumTerverifikasi || '').length}/1000</span>
          </div>
          <input
            type="text"
            maxLength={1000}
            disabled={isReadOnlyView}
            value={formData.catatanBelumTerverifikasi || ''}
            onChange={(e) => setFormData({ ...formData, catatanBelumTerverifikasi: e.target.value })}
            placeholder="Contoh: Pemasok narkotika (DPO) masih dalam penelusuran penyidik..."
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
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
          <span>Lanjut ke Sindikat &amp; Jaringan</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
