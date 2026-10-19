import React from 'react';
import { MedisFormData } from './types';
import { Syringe, ArrowRight } from 'lucide-react';

interface Step1AnamnesisZatProps {
  formData: MedisFormData;
  setFormData: React.Dispatch<React.SetStateAction<MedisFormData>>;
  isReadOnlyView: boolean;
  onNext: () => void;
}

export const Step1AnamnesisZat: React.FC<Step1AnamnesisZatProps> = ({
  formData,
  setFormData,
  isReadOnlyView,
  onNext
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
        <Syringe className="w-4 h-4 text-emerald-400" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Wawancara Klinis &amp; Riwayat Penggunaan Zat</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Jenis Zat Narkotika Dominan <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.jenisZat}
            onChange={(e) => setFormData({ ...formData, jenisZat: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Jenis Zat Narkotika --</option>
            <option value="Metamfetamina (Sabu)">Metamfetamina (Sabu)</option>
            <option value="Ganja / Kanabis">Ganja / Kanabis</option>
            <option value="MDMA / Ekstasi">MDMA / Ekstasi</option>
            <option value="Heroin / Putaw">Heroin / Putaw</option>
            <option value="Tembakau Sintetis (Gorila)">Tembakau Sintetis (Gorila)</option>
            <option value="Obat Keras (Tramadol / Trihexyphenidyl)">Obat Keras (Tramadol / Trihex)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Cara Pemakaian <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.caraPakai}
            onChange={(e) => setFormData({ ...formData, caraPakai: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Cara Pemakaian --</option>
            <option value="Dihisap (Bong / Rokok)">Dihisap (Bong / Rokok)</option>
            <option value="Ditelan / Minum (Oral)">Ditelan / Minum (Oral)</option>
            <option value="Disuntikkan (Intravena / IV)">Disuntikkan (Intravena / IV)</option>
            <option value="Dihirup (Snorting)">Dihirup (Snorting)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Frekuensi Penggunaan <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.frekuensi}
            onChange={(e) => setFormData({ ...formData, frekuensi: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Frekuensi --</option>
            <option value="Setiap Hari (Daily)">Setiap Hari (Daily)</option>
            <option value="3-4 Kali Seminggu">3-4 Kali Seminggu</option>
            <option value="1-2 Kali Seminggu">1-2 Kali Seminggu</option>
            <option value="Kadang-kadang / Rekreasi">Kadang-kadang / Rekreasi</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Lama Pemakaian Aktif (Bulan) <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            inputMode="numeric"
            maxLength={3}
            value={formData.lamaPemakaianBulan}
            onChange={(e) => setFormData({ ...formData, lamaPemakaianBulan: e.target.value.replace(/\D/g, '').slice(0, 3) })}
            placeholder="Contoh: 12"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed font-mono"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Usia Pertama Kali Pakai (Tahun) <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={formData.usiaMulaiPakai}
            onChange={(e) => setFormData({ ...formData, usiaMulaiPakai: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            placeholder="Contoh: 19"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed font-mono"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Waktu Terakhir Pemakaian <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            maxLength={100}
            value={formData.terakhirPakai}
            onChange={(e) => setFormData({ ...formData, terakhirPakai: e.target.value })}
            placeholder="Contoh: 2 hari sebelum penangkapan"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Riwayat Overdosis / Komplikasi Zat <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            maxLength={250}
            value={formData.riwayatOverdosis}
            onChange={(e) => setFormData({ ...formData, riwayatOverdosis: e.target.value })}
            placeholder="Contoh: Tidak ada / Pernah dilarikan ke RS / Kejang"
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Riwayat Rehabilitasi Sebelumnya <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.riwayatRehabSebelumnya}
            onChange={(e) => setFormData({ ...formData, riwayatRehabSebelumnya: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Riwayat Rehabilitasi --</option>
            <option value="Belum pernah menjalani rehabilitasi">Belum Pernah Rehabilitasi</option>
            <option value="Pernah Rawat Jalan (1 kali)">Pernah Rawat Jalan (1x)</option>
            <option value="Pernah Rawat Inap (1 kali)">Pernah Rawat Inap (1x)</option>
            <option value="Residivis Rehabilitasi (Lebih dari 1 kali)">Residivis Rehabilitasi (&gt;1x)</option>
          </select>
        </div>
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <span>Lanjut ke Pemeriksaan Fisik</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
