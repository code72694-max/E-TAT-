import React, { useRef } from 'react';
import { Scale, Calendar, Activity, Plus, Trash2 } from 'lucide-react';

interface Step3PerkaraBarangBuktiProps {
  jenisPengajuan: 'penangkapan_tanpa_bb' | 'penangkapan_dengan_bb' | 'p19' | 'penuntutan' | 'persidangan';
  setJenisPengajuan: (val: 'penangkapan_tanpa_bb' | 'penangkapan_dengan_bb' | 'p19' | 'penuntutan' | 'persidangan') => void;
  metodePelaksanaan: 'luring' | 'daring' | 'hybrid';
  setMetodePelaksanaan: (val: 'luring' | 'daring' | 'hybrid') => void;
  satuanKerjaTujuan: string;
  setSatuanKerjaTujuan: (val: string) => void;
  nomorLp: string;
  setNomorLp: (val: string) => void;
  tanggalLp: string;
  setTanggalLp: (val: string) => void;
  tanggalWaktuPenangkapan: string;
  setTanggalWaktuPenangkapan: (val: string) => void;
  namaPenyidik: string;
  setNamaPenyidik: (val: string) => void;
  nomorHpPenyidik: string;
  setNomorHpPenyidik: (val: string) => void;
  pasal: string;
  setPasal: (val: string) => void;
  tkp: string;
  setTkp: (val: string) => void;
  kronologi: string;
  setKronologi: (val: string) => void;
  barangBuktiList: any[];
  handleAddBb: () => void;
  handleRemoveBb: (id: string) => void;
  newJenisZat: string;
  setNewJenisZat: (val: string) => void;
  newBerat: string;
  setNewBerat: (val: string) => void;
  newStatusLab: 'proses_lab' | 'positif' | 'negatif' | 'belum_uji';
  setNewStatusLab: (val: 'proses_lab' | 'positif' | 'negatif' | 'belum_uji') => void;
  newNomorLab: string;
  setNewNomorLab: (val: string) => void;
}

export const Step3PerkaraBarangBukti: React.FC<Step3PerkaraBarangBuktiProps> = ({
  jenisPengajuan,
  setJenisPengajuan,
  metodePelaksanaan,
  setMetodePelaksanaan,
  satuanKerjaTujuan,
  setSatuanKerjaTujuan,
  nomorLp,
  setNomorLp,
  tanggalLp,
  setTanggalLp,
  tanggalWaktuPenangkapan,
  setTanggalWaktuPenangkapan,
  namaPenyidik,
  setNamaPenyidik,
  nomorHpPenyidik,
  setNomorHpPenyidik,
  pasal,
  setPasal,
  tkp,
  setTkp,
  kronologi,
  setKronologi,
  barangBuktiList,
  handleAddBb,
  handleRemoveBb,
  newJenisZat,
  setNewJenisZat,
  newBerat,
  setNewBerat,
  newStatusLab,
  setNewStatusLab,
  newNomorLab,
  setNewNomorLab,
}) => {
  const tanggalLpRef = useRef<HTMLInputElement>(null);
  const waktuPenangkapanRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]/60">
          <Scale className="w-5 h-5 text-[#D4AF37]" />
          <span className="font-bold text-white text-sm">Informasi Pengajuan &amp; Perkara</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="font-semibold text-slate-300 block mb-1 text-xs">
              Jenis Pengajuan Asesmen TAT *
            </label>
            <select
              value={jenisPengajuan}
              onChange={(e) => setJenisPengajuan(e.target.value as any)}
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none font-semibold text-sm"
            >
              <option value="penangkapan_tanpa_bb">Tingkat Penyidikan - Penangkapan TANPA Barang Bukti</option>
              <option value="penangkapan_dengan_bb">Tingkat Penyidikan - Penangkapan DENGAN Barang Bukti</option>
              <option value="p19">Petunjuk Jaksa (P-19)</option>
              <option value="penuntutan">Kepentingan Penuntutan (JPU)</option>
              <option value="persidangan">Kepentingan Persidangan (Penetapan Hakim)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1 text-xs">Metode Pelaksanaan</label>
            <select
              value={metodePelaksanaan}
              onChange={(e) => setMetodePelaksanaan(e.target.value as any)}
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
            >
              <option value="luring">Luring (Tatap Muka Langsung)</option>
              <option value="daring">Daring (Online Zoom/Virtual)</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Satuan Kerja TAT Tujuan</label>
              <span className="text-[11px] text-slate-400">Maks 80</span>
            </div>
            <input
              type="text"
              maxLength={80}
              value={satuanKerjaTujuan}
              onChange={(e) => setSatuanKerjaTujuan(e.target.value.slice(0, 80))}
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Nomor Laporan Polisi (LP) *</label>
              <span className="text-[11px] text-slate-400">Format Resmi LP</span>
            </div>
            <input
              type="text"
              maxLength={80}
              value={nomorLp}
              onChange={(e) => setNomorLp(e.target.value.toUpperCase().replace(/[^A-Z0-9/.-]/g, '').slice(0, 80))}
              placeholder="LP/A/123/IX/2026/SPKT/..."
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl font-mono focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm uppercase tracking-wider"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1 text-xs">Tanggal Laporan Polisi (LP) *</label>
            <div className="relative flex items-center">
              <input
                ref={tanggalLpRef}
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={tanggalLp}
                onChange={(e) => setTanggalLp(e.target.value)}
                onClick={() => {
                  try {
                    tanggalLpRef.current?.showPicker?.();
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
                    tanggalLpRef.current?.showPicker?.();
                  } catch (err) {
                    tanggalLpRef.current?.focus();
                  }
                }}
                className="absolute right-2 px-2.5 py-1.5 bg-[#1b3a6b] hover:bg-[#254f91] active:bg-[#3166b8] text-white rounded-lg transition-all border border-[#2d5c9e] shadow-md flex items-center justify-center cursor-pointer group"
                title="Buka Kalender Tanggal LP"
              >
                <Calendar className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1 text-xs">Waktu Penangkapan *</label>
            <div className="relative flex items-center">
              <input
                ref={waktuPenangkapanRef}
                type="datetime-local"
                max={new Date().toISOString().slice(0, 16)}
                value={tanggalWaktuPenangkapan}
                onChange={(e) => setTanggalWaktuPenangkapan(e.target.value)}
                onClick={() => {
                  try {
                    waktuPenangkapanRef.current?.showPicker?.();
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
                    waktuPenangkapanRef.current?.showPicker?.();
                  } catch (err) {
                    waktuPenangkapanRef.current?.focus();
                  }
                }}
                className="absolute right-2 px-2.5 py-1.5 bg-[#1b3a6b] hover:bg-[#254f91] active:bg-[#3166b8] text-white rounded-lg transition-all border border-[#2d5c9e] shadow-md flex items-center justify-center cursor-pointer group"
                title="Buka Kalender &amp; Waktu Penangkapan"
              >
                <Calendar className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Nama Penyidik Satuan *</label>
              <span className="text-[11px] text-slate-400">Huruf saja • Maks 100</span>
            </div>
            <input
              type="text"
              maxLength={100}
              value={namaPenyidik}
              onChange={(e) => setNamaPenyidik(e.target.value.replace(/[^a-zA-Z\s.',-]/g, '').slice(0, 100))}
              placeholder="Nama Lengkap Penyidik / NRP"
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm font-semibold"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Nomor HP / WhatsApp Penyidik *</label>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  nomorHpPenyidik.length >= 10 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                }`}
              >
                {nomorHpPenyidik.length}/15 digit (Angka saja)
              </span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={15}
              value={nomorHpPenyidik}
              onChange={(e) => setNomorHpPenyidik(e.target.value.replace(/\D/g, '').slice(0, 15))}
              placeholder="0812-XXXX-XXXX (10-15 digit angka)"
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl font-mono focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
              required
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Pasal yang Dipersangkakan *</label>
              <span className="text-[11px] text-slate-400">Maks 150 karakter</span>
            </div>
            <input
              type="text"
              maxLength={150}
              value={pasal}
              onChange={(e) => setPasal(e.target.value.slice(0, 150))}
              placeholder="Contoh: Pasal 127 ayat (1) huruf a UU RI No. 35 Tahun 2009"
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm font-mono"
              required
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Tempat Kejadian Perkara (TKP) *</label>
              <span className="text-[11px] text-slate-400">Maks 200 karakter</span>
            </div>
            <input
              type="text"
              maxLength={200}
              value={tkp}
              onChange={(e) => setTkp(e.target.value.slice(0, 200))}
              placeholder="Alamat lengkap TKP penangkapan"
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
              required
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300 block text-xs">Kronologi Singkat Penangkapan *</label>
              <span className="text-[11px] font-mono text-slate-400">{kronologi.length}/2000 (Min 10 karakter)</span>
            </div>
            <textarea
              rows={3}
              maxLength={2000}
              value={kronologi}
              onChange={(e) => setKronologi(e.target.value.slice(0, 2000))}
              placeholder="Uraian singkat penangkapan dan situasi saat diamankan..."
              className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs leading-relaxed"
              required
            />
          </div>
        </div>
      </div>

      {/* Barang Bukti Form */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-bold text-white text-sm">Daftar Barang Bukti &amp; Hasil Uji Lab</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {barangBuktiList.length} Barang Bukti Tercatat
          </span>
        </div>

        {/* Input New BB */}
        <div className="p-4 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-3">
          <span className="text-xs font-bold text-slate-200 block">Tambah Barang Bukti Narkotika</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400 block">Jenis Narkotika / Zat *</label>
                <span className="text-[10px] text-slate-500">Maks 80</span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={newJenisZat}
                onChange={(e) => setNewJenisZat(e.target.value.slice(0, 80))}
                placeholder="Metamfetamina / Ganja / Ekstasi"
                className="w-full p-2.5 border border-[#1b3459] bg-[#0b172a] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400 block">Berat Bersih (Gram) *</label>
                <span className="text-[10px] text-amber-400 font-mono">Angka desimal</span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={newBerat}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d+(\.\d*)?$/.test(val) || /^\.\d*$/.test(val)) {
                    setNewBerat(val);
                  }
                }}
                placeholder="Contoh: 0.25"
                className="w-full p-2.5 border border-[#1b3459] bg-[#0b172a] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Status Uji Laboratorium</label>
              <select
                value={newStatusLab}
                onChange={(e) => setNewStatusLab(e.target.value as any)}
                className="w-full p-2.5 border border-[#1b3459] bg-[#0b172a] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs"
              >
                <option value="proses_lab">Sedang Proses Lab Puslabfor</option>
                <option value="positif">Positif Narkotika (Surat Terbit)</option>
                <option value="negatif">Negatif Narkotika</option>
                <option value="belum_uji">Belum Dikirim ke Lab</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400 block">Nomor Surat Hasil Lab (Opsional)</label>
                <span className="text-[10px] text-slate-500">Maks 80</span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={newNomorLab}
                onChange={(e) => setNewNomorLab(e.target.value.toUpperCase().slice(0, 80))}
                placeholder="LAB/TOKSI/XXX/2026/PUSLABFOR"
                className="w-full p-2.5 border border-[#1b3459] bg-[#0b172a] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs font-mono uppercase"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddBb}
                className="w-full py-2.5 bg-[#133863] hover:bg-[#1a4a82] text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border border-[#245899] cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambahkan ke Daftar</span>
              </button>
            </div>
          </div>
        </div>

        {/* List BB */}
        <div className="space-y-2.5">
          {barangBuktiList.length === 0 ? (
            <p className="text-slate-500 italic text-center py-4 text-xs">Belum ada barang bukti yang ditambahkan.</p>
          ) : (
            barangBuktiList.map((bb) => (
              <div
                key={bb.id}
                className="p-3.5 bg-[#050e1c] rounded-xl border border-[#1b3459] flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#142642] flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                    BB
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">{bb.jenisZat}</span>
                      <span className="font-mono text-xs text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                        {bb.beratBersihGram} gr
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                          bb.statusUjiLab === 'positif'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {bb.statusUjiLab === 'positif' ? 'Positif Lab' : bb.statusUjiLab === 'proses_lab' ? 'Proses Lab' : 'Belum Uji'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 truncate font-mono">
                      {bb.nomorSuratLab ? `No. Lab: ${bb.nomorSuratLab}` : 'Surat Lab: Menunggu Puslabfor'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveBb(bb.id)}
                  className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                  title="Hapus barang bukti ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
