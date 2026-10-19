import React from 'react';
import { Gavel, ArrowRight } from 'lucide-react';
import { FormDataHukum } from './types';

interface Step5RekomendasiPlenoProps {
  formData: FormDataHukum;
  setFormData: React.Dispatch<React.SetStateAction<FormDataHukum>>;
  isReadOnlyView: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const Step5RekomendasiPleno: React.FC<Step5RekomendasiPlenoProps> = ({
  formData,
  setFormData,
  isReadOnlyView,
  onBack,
  onNext,
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
        <Gavel className="w-4 h-4 text-[#d4af37]" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Rekomendasi Yuridis &amp; Kesimpulan Hukum untuk Sidang Pleno</h3>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Rekomendasi Yuridis Tindak Lanjut Perkara <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.rekomendasiHukum || 'Proses Hukum Dilanjutkan dengan Rehabilitasi'}
            onChange={(e: any) => setFormData({ ...formData, rekomendasiHukum: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-3 rounded-xl outline-none focus:border-blue-500 cursor-pointer font-bold text-sm text-emerald-400 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="Proses Hukum Dilanjutkan dengan Rehabilitasi">Proses Hukum Dilanjutkan dengan Penempatan Rehabilitasi (Pasal 127)</option>
            <option value="Penerapan Keadilan Restoratif / Diversi">Penerapan Keadilan Restoratif (Restorative Justice / RJ Jaksa)</option>
            <option value="Proses Hukum Dilanjutkan Tanpa Rehabilitasi">Proses Hukum Dilanjutkan Tanpa Rehabilitasi (Unsur Pengedar Terpenuhi)</option>
            <option value="Perlu Pendalaman Penyidikan">Perlu Pendalaman Penyidikan / Pemeriksaan Tambahan</option>
          </select>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
            <label className="text-slate-300 font-semibold">
              Kesimpulan &amp; Pertimbangan Yuridis Lengkap <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.kesimpulanHukum || '').length}/3000</span>
          </div>

          {!isReadOnlyView && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-[10px] text-slate-400 self-center mr-1">Template Argumen:</span>
              {[
                {
                  label: 'Rehabilitasi (Pasal 127)',
                  text: 'Berdasarkan kualifikasi yuridis Pasal 127 UU No. 35/2009, SEMA 04/2010, dan Pedoman Jaksa Agung No. 18/2021, tersangka dikualifikasikan sebagai Penyalah Guna Narkotika bagi Diri Sendiri yang berhak mendapatkan rehabilitasi medis dan sosial melalui mekanisme TAT.'
                },
                {
                  label: 'Restorative Justice (RJ)',
                  text: 'Memenuhi persyaratan materiil dan formil penerapan Restorative Justice berdasarkan Pedoman Jaksa Agung No. 18/2021 dan Perpol No. 08/2021, terperiksa bukan residivis dan barang bukti di bawah batasan SEMA 04/2010.'
                },
                {
                  label: 'Proses Pidana Murni',
                  text: 'Berdasarkan fakta yuridis dan gramatur barang bukti yang melebihi batas SEMA 04/2010 serta terindikasi memiliki peran dalam jaringan peredaran gelap, direkomendasikan proses hukum perkara pokok tetap dilanjutkan ke tahap peradilan tanpa penghentian penuntutan.'
                }
              ].map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, kesimpulanHukum: tpl.text })}
                  className="px-2 py-0.5 bg-[#142642] hover:bg-[#1f3a63] text-[#d4af37] border border-[#234475] rounded text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          )}

          <textarea
            rows={4}
            maxLength={3000}
            disabled={isReadOnlyView}
            value={formData.kesimpulanHukum || ''}
            onChange={(e) => setFormData({ ...formData, kesimpulanHukum: e.target.value })}
            placeholder="Uraikan dasar pertimbangan hukum, rujukan pasal UU 35/2009, SEMA 04/2010, dan Pedoman Kejaksaan No. 18/2021..."
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-300 font-semibold">
              Catatan Klarifikasi Tambahan untuk Ketua TAT &amp; Jaksa <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{(formData.catatanKlarifikasi || '').length}/2000</span>
          </div>
          <input
            type="text"
            maxLength={2000}
            disabled={isReadOnlyView}
            value={formData.catatanKlarifikasi || ''}
            onChange={(e) => setFormData({ ...formData, catatanKlarifikasi: e.target.value })}
            placeholder="Catatan tambahan saat pembahasan Sidang Pleno TAT..."
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
          <span>Lanjut ke Pengesahan</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
