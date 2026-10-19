import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { FormDataHukum } from './types';

interface Step4SindikatResidivisProps {
  formData: FormDataHukum;
  setFormData: React.Dispatch<React.SetStateAction<FormDataHukum>>;
  isReadOnlyView: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const Step4SindikatResidivis: React.FC<Step4SindikatResidivisProps> = ({
  formData,
  setFormData,
  isReadOnlyView,
  onBack,
  onNext,
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
        <Shield className="w-4 h-4 text-blue-400" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Penelusuran Sindikat Jaringan &amp; Riwayat Residivisme</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">Status Riwayat Residivis Pidana</label>
          <select
            disabled={isReadOnlyView}
            value={formData.pernahDitangkap ? 'ya' : 'tidak'}
            onChange={(e) => {
              const isYa = e.target.value === 'ya';
              let riwayat = formData.keteranganPerkaraLalu;
              if (isYa && riwayat.includes('Belum pernah dihukum')) {
                riwayat = 'Pernah dipidana: Putusan Pengadilan Negeri ..., No. Perkara: ..., Pidana: ... tahun (Lapas/Rutan ...)';
              } else if (!isYa && riwayat.includes('Pernah dipidana')) {
                riwayat = 'Belum pernah dihukum / tidak terdaftar dalam database residivis Ditresnarkoba & Kejaksaan.';
              }
              setFormData({ ...formData, pernahDitangkap: isYa, keteranganPerkaraLalu: riwayat });
            }}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="tidak">Belum Pernah Ditangkap / Bukan Residivis</option>
            <option value="ya">Pernah Ditangkap / Residivis</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Keterkaitan dengan Jaringan Sindikat Narkotika <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.keterkaitanSindikat || ''}
            onChange={(e) => setFormData({ ...formData, keterkaitanSindikat: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="Tidak terafiliasi dengan jaringan pengedar terorganisir (Konsumen akhir terputus)">Tidak Terafiliasi Sindikat (Konsumen Terputus)</option>
            <option value="Terindikasi sebagai perantara / kurir jaringan pengedar lokal">Terindikasi Perantara / Kurir Lokal</option>
            <option value="Bagian dari sindikat peredaran gelap narkotika aktif">Bagian dari Sindikat Aktif (TO)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Keterangan Riwayat Perkara Lalu (Database Kriminal) <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.keteranganPerkaraLalu || '').length}/1000</span>
          </div>
          <input
            type="text"
            maxLength={1000}
            disabled={isReadOnlyView}
            value={formData.keteranganPerkaraLalu || ''}
            onChange={(e) => setFormData({ ...formData, keteranganPerkaraLalu: e.target.value })}
            placeholder="Tidak terdaftar dalam database residivis perkara narkotika / SKCK Bersih..."
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Pola Transaksi &amp; Sumber Perolehan Narkotika <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.sumberPerolehan || '').length}/1000</span>
          </div>
          <textarea
            rows={3}
            maxLength={1000}
            disabled={isReadOnlyView}
            value={formData.sumberPerolehan || ''}
            onChange={(e) => setFormData({ ...formData, sumberPerolehan: e.target.value })}
            placeholder="Uraikan bagaimana tersangka mendapatkan narkotika (metode tempel, beli tunai, transfer, dll)..."
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
          <span>Lanjut ke Rekomendasi Pleno</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
