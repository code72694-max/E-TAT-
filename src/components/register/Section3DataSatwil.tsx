import React from 'react';
import { Building2 } from 'lucide-react';
import { WILAYAH_OPTIONS } from './constants';

interface Section3DataSatwilProps {
  instansi: string;
  setInstansi: (val: string) => void;
  kategoriInstansi: 'Polres / Polresta' | 'Polda' | 'Polsek' | 'BNNK / BNNP' | 'Kejaksaan' | 'Lainnya';
  setKategoriInstansi: (val: any) => void;
  wilayahHukum: string;
  setWilayahHukum: (val: string) => void;
  nomorSprint: string;
  setNomorSprint: (val: string) => void;
  teleponKantor: string;
  setTeleponKantor: (val: string) => void;
  alamatKantor: string;
  setAlamatKantor: (val: string) => void;
}

export const Section3DataSatwil: React.FC<Section3DataSatwilProps> = ({
  instansi,
  setInstansi,
  kategoriInstansi,
  setKategoriInstansi,
  wilayahHukum,
  setWilayahHukum,
  nomorSprint,
  setNomorSprint,
  teleponKantor,
  setTeleponKantor,
  alamatKantor,
  setAlamatKantor
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
        <Building2 className="w-4 h-4 text-[#D4AF37]" />
        <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
          3. Data Satuan Wilayah (Satwil) / Instansi Pemohon
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Nama Satker / Instansi */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Nama Satuan Kerja / Instansi <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {instansi.length}/120
            </span>
          </div>
          <input
            type="text"
            required
            maxLength={120}
            value={instansi}
            onChange={e => setInstansi(e.target.value)}
            placeholder="Contoh: Polres Kutai Kartanegara / Ditresnarkoba Polda Kaltim"
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        {/* Kategori Satker */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-200">
            Kategori Satker <span className="text-rose-400">*</span>
          </label>
          <select
            value={kategoriInstansi}
            onChange={e => setKategoriInstansi(e.target.value)}
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <option value="Polres / Polresta">Polres / Polresta</option>
            <option value="Polda">Polda (Ditresnarkoba)</option>
            <option value="Polsek">Polsek</option>
            <option value="BNNK / BNNP">BNNK / BNNP</option>
            <option value="Kejaksaan">Kejaksaan Negeri / Tinggi</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Wilayah Hukum */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-200">
            Wilayah Hukum Operasional <span className="text-rose-400">*</span>
          </label>
          <select
            value={wilayahHukum}
            onChange={e => setWilayahHukum(e.target.value)}
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
          >
            {WILAYAH_OPTIONS.map(w => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Nomor Sprint (Opsional) */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Nomor Surat Perintah Tugas / Sprint <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {nomorSprint.length}/60
            </span>
          </div>
          <input
            type="text"
            maxLength={60}
            value={nomorSprint}
            onChange={e => setNomorSprint(e.target.value)}
            placeholder="Contoh: Sprin/142/X/HUK.6.6/2026"
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors font-mono"
          />
        </div>

        {/* Telepon Kantor */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-200">
            Telepon Kantor / Ruangan Satker
          </label>
          <input
            type="text"
            maxLength={20}
            value={teleponKantor}
            onChange={e => setTeleponKantor(e.target.value.replace(/[^0-9()\-\s]/g, ''))}
            placeholder="(0541) 661110"
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors font-mono"
          />
        </div>

        {/* Alamat Mako / Kantor */}
        <div className="space-y-1.5 sm:col-span-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Alamat Markas Komando (Mako) / Kantor <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {alamatKantor.length}/250
            </span>
          </div>
          <textarea
            required
            rows={2}
            maxLength={250}
            value={alamatKantor}
            onChange={e => setAlamatKantor(e.target.value)}
            placeholder="Contoh: Jl. Wolter Monginsidi No. 12, Tenggarong, Kab. Kutai Kartanegara"
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
