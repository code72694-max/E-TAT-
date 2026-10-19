import React from 'react';
import { Shield, Phone } from 'lucide-react';
import { PANGKAT_OPTIONS } from './constants';

interface Section1DataPejabatProps {
  namaLengkap: string;
  setNamaLengkap: (val: string) => void;
  pangkat: string;
  setPangkat: (val: string) => void;
  nrp: string;
  setNrp: (val: string) => void;
  jabatan: string;
  setJabatan: (val: string) => void;
  unitFungsi: string;
  setUnitFungsi: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
}

export const Section1DataPejabat: React.FC<Section1DataPejabatProps> = ({
  namaLengkap,
  setNamaLengkap,
  pangkat,
  setPangkat,
  nrp,
  setNrp,
  jabatan,
  setJabatan,
  unitFungsi,
  setUnitFungsi,
  phone,
  setPhone
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
        <Shield className="w-4 h-4 text-[#D4AF37]" />
        <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
          1. Data Pejabat & Kredensial Anggota
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Nama Lengkap & Gelar */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Nama Lengkap & Gelar <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {namaLengkap.length}/100 karakter
            </span>
          </div>
          <input
            type="text"
            required
            maxLength={100}
            value={namaLengkap}
            onChange={e => setNamaLengkap(e.target.value)}
            placeholder="Contoh: AKBP Hendri Gunawan, S.I.K., M.Si."
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        {/* Pangkat Kedinasan */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-200">
            Pangkat Kedinasan <span className="text-rose-400">*</span>
          </label>
          <select
            value={pangkat}
            onChange={e => setPangkat(e.target.value)}
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
          >
            {PANGKAT_OPTIONS.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* NRP / NIP Kedinasan (Angka Saja) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              NRP / NIP Kedinasan <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {nrp.length}/18 digit
            </span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            required
            maxLength={18}
            value={nrp}
            onChange={e => setNrp(e.target.value.replace(/\D/g, ''))}
            placeholder="8 digit NRP / 18 digit NIP"
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors font-mono tracking-wider"
          />
          {nrp.length > 0 && nrp.length < 6 && (
            <span className="text-[10px] text-amber-400 block">
              Minimal 6 digit angka untuk NRP/NIP
            </span>
          )}
        </div>

        {/* Jabatan Resmi */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Jabatan Resmi <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {jabatan.length}/80
            </span>
          </div>
          <input
            type="text"
            required
            maxLength={80}
            value={jabatan}
            onChange={e => setJabatan(e.target.value)}
            placeholder="Contoh: Kapolres / Kasat Resnarkoba"
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        {/* Unit / Satuan Kerja Fungsi (Opsional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Unit / Satuan Fungsi <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {unitFungsi.length}/80
            </span>
          </div>
          <input
            type="text"
            maxLength={80}
            value={unitFungsi}
            onChange={e => setUnitFungsi(e.target.value)}
            placeholder="Contoh: Satresnarkoba / Subdit 2"
            className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        {/* Nomor Handphone / WA (Angka Saja) */}
        <div className="space-y-1.5 sm:col-span-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Nomor Handphone / WhatsApp Aktif <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {phone.length}/14 digit (Format: 08xxxxxxxxxx)
            </span>
          </div>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="tel"
              inputMode="numeric"
              required
              maxLength={14}
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Contoh: 081234567890"
              className="w-full bg-[#081224] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] transition-colors font-mono tracking-wider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
