import React, { useRef } from 'react';
import { User, Search, Calendar, AlertCircle, Activity } from 'lucide-react';

interface Step1IdentitasTerperiksaProps {
  namaLengkap: string;
  setNamaLengkap: (val: string) => void;
  alias: string;
  setAlias: (val: string) => void;
  nik: string;
  setNik: (val: string) => void;
  statusKhusus: 'dewasa' | 'anak_berhadapan_hukum' | 'perlu_penerjemah';
  setStatusKhusus: (val: 'dewasa' | 'anak_berhadapan_hukum' | 'perlu_penerjemah') => void;
  tempatLahir: string;
  setTempatLahir: (val: string) => void;
  tanggalLahir: string;
  setTanggalLahir: (val: string) => void;
  usia: number | '';
  setUsia: (val: number | '') => void;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  setJenisKelamin: (val: 'Laki-laki' | 'Perempuan') => void;
  pekerjaan: string;
  setPekerjaan: (val: string) => void;
  namaWali: string;
  setNamaWali: (val: string) => void;
  alamatKtp: string;
  setAlamatKtp: (val: string) => void;
  kontakWali: string;
  setKontakWali: (val: string) => void;
  lamaPenggunaanZat: string;
  setLamaPenggunaanZat: (val: string) => void;
  hasilTesUrinAwal: string;
  setHasilTesUrinAwal: (val: string) => void;
  catatanProfilingPenyidik: string;
  setCatatanProfilingPenyidik: (val: string) => void;
}

export const Step1IdentitasTerperiksa: React.FC<Step1IdentitasTerperiksaProps> = ({
  namaLengkap,
  setNamaLengkap,
  alias,
  setAlias,
  nik,
  setNik,
  statusKhusus,
  setStatusKhusus,
  tempatLahir,
  setTempatLahir,
  tanggalLahir,
  setTanggalLahir,
  usia,
  setUsia,
  jenisKelamin,
  setJenisKelamin,
  pekerjaan,
  setPekerjaan,
  namaWali,
  setNamaWali,
  alamatKtp,
  setAlamatKtp,
  kontakWali,
  setKontakWali,
  lamaPenggunaanZat,
  setLamaPenggunaanZat,
  hasilTesUrinAwal,
  setHasilTesUrinAwal,
  catatanProfilingPenyidik,
  setCatatanProfilingPenyidik,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
        <span className="font-bold text-white flex items-center space-x-2 text-sm">
          <User className="w-4 h-4 text-[#D4AF37]" />
          <span>Data Pokok Identitas Terperiksa / Yang Diadukan</span>
        </span>
        <span className="text-xs text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2.5 py-1 rounded-md border border-[#D4AF37]/20">
          Wajib Diisi Penyidik
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-200 block text-xs">
              Nama Lengkap Yang Diadukan / Terperiksa *
            </label>
            <span className="text-[11px] text-slate-400">Huruf saja • Maks 100 karakter</span>
          </div>
          <input
            type="text"
            value={namaLengkap}
            maxLength={100}
            onChange={(e) => setNamaLengkap(e.target.value.replace(/[^a-zA-Z\s.',-]/g, '').slice(0, 100))}
            placeholder="Contoh: Muhammad Reza Pratama"
            className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm font-semibold placeholder:font-normal"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-300 block text-xs">Nama Panggilan / Alias</label>
            <span className="text-[11px] text-slate-400">Maks 50 karakter</span>
          </div>
          <input
            type="text"
            value={alias}
            maxLength={50}
            onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9\s"'-]/g, '').slice(0, 50))}
            placeholder="Contoh: Reza / Eza"
            className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#1b3459]/40">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-300 block text-xs">
              Nomor Induk Kependudukan (NIK) *
            </label>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                nik.length === 16 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}
            >
              {nik.length}/16 digit (Angka saja)
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={16}
              value={nik}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                setNik(val);
              }}
              placeholder="16 Digit NIK KTP (Angka saja)"
              className="w-full p-3 pl-3.5 pr-10 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl font-mono focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm tracking-wider"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            NIK akan diverifikasi secara otomatis pada pangkalan data rekam jejak kriminal &amp; e-TAT di Step 2.
          </p>
        </div>

        <div>
          <label className="font-semibold text-slate-300 block mb-1 text-xs">Status Kategori Terperiksa</label>
          <select
            value={statusKhusus}
            onChange={(e) => setStatusKhusus(e.target.value as any)}
            className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm"
          >
            <option value="dewasa">Dewasa Umum</option>
            <option value="anak_berhadapan_hukum">Anak Berhadapan Hukum (ABH - Di bawah 18 th)</option>
            <option value="perlu_penerjemah">Perlu Penerjemah Bahasa / Isyarat</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-300 block mb-1 text-xs">Tempat &amp; Tanggal Lahir</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              maxLength={60}
              value={tempatLahir}
              onChange={(e) => setTempatLahir(e.target.value.replace(/[^a-zA-Z\s.-]/g, '').slice(0, 60))}
              placeholder="Tempat Lahir (Huruf)"
              className="p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
            />
            <div className="relative flex items-center">
              <input
                ref={dateInputRef}
                type="date"
                max={new Date().toISOString().split('T')[0]}
                min="1920-01-01"
                value={tanggalLahir}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const year = parseInt(val.split('-')[0], 10);
                    if (year > new Date().getFullYear()) return;
                  }
                  setTanggalLahir(val);
                }}
                onClick={() => {
                  try {
                    dateInputRef.current?.showPicker?.();
                  } catch (err) {}
                }}
                style={{ colorScheme: 'dark' }}
                className="w-full p-3 pr-12 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    dateInputRef.current?.showPicker?.();
                  } catch (err) {
                    dateInputRef.current?.focus();
                  }
                }}
                className="absolute right-2 px-2.5 py-1.5 bg-[#1b3a6b] hover:bg-[#254f91] active:bg-[#3166b8] text-white rounded-lg transition-all border border-[#2d5c9e] shadow-md flex items-center justify-center cursor-pointer group"
                title="Buka Kalender Tanggal Lahir"
              >
                <Calendar className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-300 block mb-1 text-xs">Usia &amp; Jenis Kelamin</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={usia}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(0, 3);
                const num = parseInt(clean, 10);
                if (!clean) setUsia('');
                else if (!isNaN(num) && num <= 120) setUsia(num);
              }}
              placeholder="Usia (Tahun)"
              className="p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm font-mono cursor-default"
              title="Otomatis dihitung dari Tanggal Lahir"
            />
            <select
              value={jenisKelamin}
              onChange={(e) => setJenisKelamin(e.target.value as any)}
              className="p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          {typeof usia === 'number' && usia > 0 && usia < 18 && (
            <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Kategori khusus otomatis aktif: Anak Berhadapan Hukum (ABH &lt; 18 tahun)</span>
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-300 block text-xs">Pekerjaan</label>
            <span className="text-[11px] text-slate-400">Maks 80 karakter</span>
          </div>
          <input
            type="text"
            maxLength={80}
            value={pekerjaan}
            onChange={(e) => setPekerjaan(e.target.value.slice(0, 80))}
            placeholder="Pekerjaan / Profesi"
            className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-300 block text-xs">Nama Wali / Pendamping</label>
            <span className="text-[11px] text-slate-400">Huruf saja • Maks 100</span>
          </div>
          <input
            type="text"
            maxLength={100}
            value={namaWali}
            onChange={(e) => setNamaWali(e.target.value.replace(/[^a-zA-Z\s.',-]/g, '').slice(0, 100))}
            placeholder="Nama Orang Tua / Pasangan / Kuasa Hukum"
            className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-300 block text-xs">Alamat Sesuai KTP / Domisili *</label>
            <span className="text-[11px] text-slate-400">Maks 255 karakter</span>
          </div>
          <input
            type="text"
            maxLength={255}
            value={alamatKtp}
            onChange={(e) => setAlamatKtp(e.target.value.slice(0, 255))}
            placeholder="Alamat lengkap terperiksa saat ini"
            className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-300 block text-xs">Kontak Telepon Wali / Keluarga</label>
            <span className="text-[11px] font-mono text-slate-400">{kontakWali.length}/15 digit (Angka saja)</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={15}
            value={kontakWali}
            onChange={(e) => setKontakWali(e.target.value.replace(/\D/g, '').slice(0, 15))}
            placeholder="0812-XXXX-XXXX (Angka saja)"
            className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl font-mono focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
          />
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#1b3459]/60">
        <h4 className="text-xs font-bold text-[#D4AF37] mb-3 uppercase tracking-wider flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>Informasi Asesmen Awal Penyidik</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Lama Penggunaan &amp; Frekuensi Zat</label>
              <span className="text-[11px] text-slate-400">Maks 80</span>
            </div>
            <input
              type="text"
              maxLength={80}
              value={lamaPenggunaanZat}
              onChange={(e) => setLamaPenggunaanZat(e.target.value.slice(0, 80))}
              placeholder="Contoh: 6 bulan, 1-2 kali per minggu"
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Hasil Pemeriksaan Skrining Urin</label>
              <span className="text-[11px] text-slate-400">Maks 100</span>
            </div>
            <input
              type="text"
              maxLength={100}
              value={hasilTesUrinAwal}
              onChange={(e) => setHasilTesUrinAwal(e.target.value.slice(0, 100))}
              placeholder="Contoh: Positif Methamphetamine (Sabu)"
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Catatan Profiling Risiko &amp; Intelijen</label>
              <span className="text-[11px] font-mono text-slate-400">{catatanProfilingPenyidik.length}/1000</span>
            </div>
            <textarea
              rows={3}
              maxLength={1000}
              value={catatanProfilingPenyidik}
              onChange={(e) => setCatatanProfilingPenyidik(e.target.value.slice(0, 1000))}
              placeholder="Keterangan apakah terperiksa adalah pemakai murni, korban penyalahgunaan, atau bukan jaringan pengedar..."
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
