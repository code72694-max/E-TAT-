import React from 'react';
import { MedisFormData } from './types';
import { HeartPulse, ArrowRight } from 'lucide-react';

interface Step2PemeriksaanFisikProps {
  formData: MedisFormData;
  setFormData: React.Dispatch<React.SetStateAction<MedisFormData>>;
  isReadOnlyView: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2PemeriksaanFisik: React.FC<Step2PemeriksaanFisikProps> = ({
  formData,
  setFormData,
  isReadOnlyView,
  onPrev,
  onNext
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
        <HeartPulse className="w-4 h-4 text-emerald-400" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Pemeriksaan Fisik &amp; Tanda Vital</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Tekanan Darah (mmHg) <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            maxLength={7}
            value={formData.tekananDarah}
            onChange={(e) => setFormData({ ...formData, tekananDarah: e.target.value.replace(/[^0-9/]/g, '').slice(0, 7) })}
            placeholder="Contoh: 120/80"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed font-mono"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Denyut Nadi (x/mnt) <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            inputMode="numeric"
            maxLength={3}
            value={formData.denyutNadi}
            onChange={(e) => setFormData({ ...formData, denyutNadi: e.target.value.replace(/\D/g, '').slice(0, 3) })}
            placeholder="Contoh: 84"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed font-mono"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Pernapasan (x/mnt) <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={formData.pernapasan}
            onChange={(e) => setFormData({ ...formData, pernapasan: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            placeholder="Contoh: 18"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed font-mono"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Suhu Tubuh (°C) <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            maxLength={5}
            value={formData.suhuTubuh}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '').slice(0, 5);
              const parts = val.split('.');
              const clean = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
              setFormData({ ...formData, suhuTubuh: clean });
            }}
            placeholder="Contoh: 36.6"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed font-mono"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Kondisi Pupil Mata &amp; Refleks Cahaya <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            maxLength={150}
            value={formData.kondisiPupil}
            onChange={(e) => setFormData({ ...formData, kondisiPupil: e.target.value })}
            placeholder="Contoh: Isokor (3mm / 3mm), Refleks Cahaya +/+"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Bekas Jarum Suntik (Needle Tracks) <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.needleTracks}
            onChange={(e) => setFormData({ ...formData, needleTracks: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Status Bekas Jarum --</option>
            <option value="tidak_ada">Tidak Ada Bekas Suntikan</option>
            <option value="ada_lama">Ada (Bekas Lama / Menghitam)</option>
            <option value="ada_baru">Ada (Luka Baru / Merah / Aktif)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Status Sakau / Putus Zat <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.kondisiIntoksikasi}
            onChange={(e) => setFormData({ ...formData, kondisiIntoksikasi: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Status Sakau / Putus Zat --</option>
            <option value="stabil">Normal / Stabil (Tidak Sakau)</option>
            <option value="intoksikasi">Intoksikasi Ringan / Pengaruh Zat</option>
            <option value="putus_zat">Putus Zat (Sakau / Tremor / Gelisah)</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Komorbiditas Medis / Penyakit Penyerta (Fisik) <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            maxLength={250}
            value={formData.komorbiditasMedis}
            onChange={(e) => setFormData({ ...formData, komorbiditasMedis: e.target.value })}
            placeholder="Contoh: Tidak ada komorbiditas berat / Riwayat Asma / Hepatitis B / HIV"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>
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
          <span>Lanjut ke Toksikologi Urin</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
