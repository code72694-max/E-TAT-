import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { PermohonanAsesmen } from '../types';

interface FormHasilPlenoModalProps {
  permohonan: PermohonanAsesmen;
  onClose: () => void;
  onSave: (permohonanId: string, payload: any) => void;
}

export const FormHasilPlenoModal: React.FC<FormHasilPlenoModalProps> = ({
  permohonan,
  onClose,
  onSave,
}) => {
  const pleno = permohonan.sidangPleno;
  
  const [pokokBahasan, setPokokBahasan] = useState(pleno?.pokokBahasan || '');
  const [catatanPerbedaanPendapat, setCatatanPerbedaanPendapat] = useState(pleno?.catatanPerbedaanPendapat || '');
  const [kesepakatanRekomendasi, setKesepakatanRekomendasi] = useState(pleno?.kesepakatanRekomendasi || '');
  const [jenisRekomendasiFinal, setJenisRekomendasiFinal] = useState(pleno?.jenisRekomendasiFinal || 'Rehabilitasi_Rawat_Inap');
  const [durasiRehabBulan, setDurasiRehabBulan] = useState(pleno?.durasiRehabBulan || 6);
  const [fasilitasRujukanUsulan, setFasilitasRujukanUsulan] = useState(pleno?.fasilitasRujukanUsulan || '');
  const [statusPleno, setStatusPleno] = useState(pleno?.statusPleno || 'selesai_sepakat');
  
  const [daftarHadir, setDaftarHadir] = useState(
    pleno?.daftarHadir?.length 
      ? pleno.daftarHadir 
      : [{ id: Date.now().toString(), nama: '', peran: '', instansi: '', hadir: true }]
  );

  const handleAddHadir = () => {
    setDaftarHadir([...daftarHadir, { id: Date.now().toString(), nama: '', peran: '', instansi: '', hadir: true }]);
  };

  const handleRemoveHadir = (index: number) => {
    const newDaftar = [...daftarHadir];
    newDaftar.splice(index, 1);
    setDaftarHadir(newDaftar);
  };

  const handleUpdateHadir = (index: number, field: string, value: any) => {
    const newDaftar = [...daftarHadir];
    newDaftar[index] = { ...newDaftar[index], [field]: value };
    setDaftarHadir(newDaftar);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(permohonan.id, {
      pokokBahasan,
      catatanPerbedaanPendapat,
      kesepakatanRekomendasi,
      jenisRekomendasiFinal,
      durasiRehabBulan: Number(durasiRehabBulan),
      fasilitasRujukanUsulan,
      statusPleno,
      daftarHadir
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b3459]">
          <div>
            <h2 className="text-lg font-bold text-white">Input Hasil Sidang Pleno / Case Conference</h2>
            <p className="text-xs text-slate-400">Permohonan: {permohonan.nomorPermohonan}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="form-hasil-pleno" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Notulensi */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#d4af37] uppercase tracking-wider border-b border-[#1b3459] pb-2">1. Notulensi Diskusi</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pokok Bahasan</label>
                <textarea
                  value={pokokBahasan}
                  onChange={(e) => setPokokBahasan(e.target.value)}
                  className="w-full bg-[#142642] border border-[#234475] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] min-h-[80px]"
                  placeholder="Deskripsikan pokok-pokok penting yang dibahas..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Catatan Perbedaan Pendapat (Dissenting Opinion)</label>
                <textarea
                  value={catatanPerbedaanPendapat}
                  onChange={(e) => setCatatanPerbedaanPendapat(e.target.value)}
                  className="w-full bg-[#142642] border border-[#234475] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] min-h-[80px]"
                  placeholder="Kosongkan jika tidak ada perbedaan pendapat..."
                />
              </div>
            </div>

            {/* Section 2: Kesepakatan Final */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#d4af37] uppercase tracking-wider border-b border-[#1b3459] pb-2">2. Kesepakatan Final</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Narasi Kesepakatan Rekomendasi</label>
                <textarea
                  value={kesepakatanRekomendasi}
                  onChange={(e) => setKesepakatanRekomendasi(e.target.value)}
                  className="w-full bg-[#142642] border border-[#234475] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] min-h-[80px]"
                  placeholder="Tuliskan kesepakatan akhir tim asesmen terpadu..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Jenis Rekomendasi (Kategorikal)</label>
                  <select
                    value={jenisRekomendasiFinal}
                    onChange={(e) => setJenisRekomendasiFinal(e.target.value)}
                    className="w-full bg-[#142642] border border-[#234475] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Rehabilitasi_Rawat_Inap">Rehabilitasi Rawat Inap</option>
                    <option value="Rehabilitasi_Rawat_Jalan">Rehabilitasi Rawat Jalan</option>
                    <option value="Lanjut_Proses_Hukum_Tanpa_Rehab">Lanjut Proses Hukum Tanpa Rehab</option>
                    <option value="Pemeriksaan_Tambahan">Pemeriksaan Tambahan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status Sidang Pleno</label>
                  <select
                    value={statusPleno}
                    onChange={(e) => setStatusPleno(e.target.value)}
                    className="w-full bg-[#142642] border border-[#234475] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="berlangsung">Masih Berlangsung</option>
                    <option value="butuh_klarifikasi_tambahan">Butuh Klarifikasi Tambahan</option>
                    <option value="selesai_sepakat">Selesai (Sepakat)</option>
                  </select>
                </div>
              </div>

              {jenisRekomendasiFinal.includes('Rehabilitasi') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Durasi Rehab (Bulan)</label>
                    <input
                      type="number"
                      value={durasiRehabBulan}
                      onChange={(e) => setDurasiRehabBulan(Number(e.target.value))}
                      className="w-full bg-[#142642] border border-[#234475] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                      min={1}
                      max={24}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Usulan Fasilitas Rujukan</label>
                    <input
                      type="text"
                      value={fasilitasRujukanUsulan}
                      onChange={(e) => setFasilitasRujukanUsulan(e.target.value)}
                      className="w-full bg-[#142642] border border-[#234475] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                      placeholder="Nama Balai / IPWL..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Daftar Hadir */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b3459] pb-2">
                <h3 className="text-sm font-semibold text-[#d4af37] uppercase tracking-wider">3. Daftar Hadir Pleno</h3>
                <button type="button" onClick={handleAddHadir} className="text-xs font-medium bg-[#1b3459] text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-[#234475]">
                  <Plus className="w-3.5 h-3.5" /> Tambah Peserta
                </button>
              </div>

              <div className="space-y-3">
                {daftarHadir.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 bg-[#081224] p-3 rounded-xl border border-[#1b3459]">
                    <div className="flex-1">
                      <input type="text" value={item.nama} onChange={(e) => handleUpdateHadir(idx, 'nama', e.target.value)} placeholder="Nama Lengkap" className="w-full bg-[#142642] border border-[#234475] rounded-lg px-3 py-1.5 text-sm text-white mb-2" required />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={item.peran} onChange={(e) => handleUpdateHadir(idx, 'peran', e.target.value)} placeholder="Peran (Medis/Hukum/Penyidik)" className="w-full bg-[#142642] border border-[#234475] rounded-lg px-3 py-1.5 text-sm text-white" required />
                        <input type="text" value={item.instansi} onChange={(e) => handleUpdateHadir(idx, 'instansi', e.target.value)} placeholder="Instansi" className="w-full bg-[#142642] border border-[#234475] rounded-lg px-3 py-1.5 text-sm text-white" required />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-white">
                        <input type="checkbox" checked={item.hadir} onChange={(e) => handleUpdateHadir(idx, 'hadir', e.target.checked)} className="rounded bg-[#142642] border-[#234475] text-[#d4af37] focus:ring-0" />
                        Hadir
                      </label>
                      <button type="button" onClick={() => handleRemoveHadir(idx)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-[#1b3459] flex justify-end gap-3 bg-[#081224] rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Batal
          </button>
          <button type="submit" form="form-hasil-pleno" className="bg-[#d4af37] hover:bg-[#e8c84a] text-[#0b172a] px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
            <Save className="w-4 h-4" /> Simpan Hasil Pleno
          </button>
        </div>
      </div>
    </div>
  );
};
