import React from 'react';
import { MedisFormData } from './types';
import { Shield, ArrowRight } from 'lucide-react';

interface Step5DiagnosisRekomendasiProps {
  formData: MedisFormData;
  setFormData: React.Dispatch<React.SetStateAction<MedisFormData>>;
  isReadOnlyView: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const Step5DiagnosisRekomendasi: React.FC<Step5DiagnosisRekomendasiProps> = ({
  formData,
  setFormData,
  isReadOnlyView,
  onPrev,
  onNext
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
        <Shield className="w-4 h-4 text-[#d4af37]" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Diagnosis ICD-10 &amp; Rencana Intervensi Medis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-2">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Diagnosis Klinis ICD-10 <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.diagnosisKlinisIcd}
            onChange={(e) => setFormData({ ...formData, diagnosisKlinisIcd: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer font-mono font-bold disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Diagnosis ICD-10 --</option>
            <option value="F15.2 (Sindrom Ketergantungan Stimulansia / Metamfetamina)">F15.2 - Ketergantungan Stimulansia (Sabu)</option>
            <option value="F15.1 (Penggunaan Merugikan Stimulansia / Harmful Use)">F15.1 - Harmful Use Stimulansia</option>
            <option value="F12.2 (Sindrom Ketergantungan Kanabinoid / Ganja)">F12.2 - Ketergantungan Kanabinoid (Ganja)</option>
            <option value="F11.2 (Sindrom Ketergantungan Opioid / Heroin)">F11.2 - Ketergantungan Opioid (Heroin)</option>
            <option value="F19.2 (Sindrom Ketergantungan Multipel Zat)">F19.2 - Ketergantungan Multipel Zat</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Modalitas Layanan Rehabilitasi <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.kebutuhanRawat}
            onChange={(e) => setFormData({ ...formData, kebutuhanRawat: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer font-bold text-[#d4af37] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Modalitas Layanan --</option>
            <option value="Rawat Inap">Rehabilitasi Rawat Inap (Pemulihan Penuh)</option>
            <option value="Rawat Jalan">Rehabilitasi Rawat Jalan (Konseling Singkat)</option>
            <option value="Detoksifikasi">Detoksifikasi Medis Darurat</option>
            <option value="Tidak Memerlukan Rawat">Tidak Memerlukan Rawat</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Usulan Durasi Layanan (Bulan) <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.durasiUsulanBulan}
            onChange={(e) => setFormData({ ...formData, durasiUsulanBulan: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer font-bold disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Usulan Durasi --</option>
            <option value="3">3 Bulan</option>
            <option value="6">6 Bulan</option>
            <option value="12">12 Bulan</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Fasilitas Rujukan Rekomendasi <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={isReadOnlyView}
            value={formData.fasilitasRujukan}
            onChange={(e) => setFormData({ ...formData, fasilitasRujukan: e.target.value })}
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <option value="">-- Pilih Fasilitas Rujukan --</option>
            <option value="Balai Rehabilitasi BNN Tanah Merah">Balai Rehabilitasi BNN Tanah Merah (Samarinda)</option>
            <option value="RSJD Atma Husada Mahakam Samarinda">RSJD Atma Husada Mahakam Samarinda</option>
            <option value="Klinik Pratama BNNP Kalimantan Timur">Klinik Pratama BNNP Kalimantan Timur</option>
            <option value="RSUD A.W. Sjahranie Samarinda">RSUD A.W. Sjahranie Samarinda</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Interpretasi Klinis Asesor Medis <span className="text-rose-400">*</span>
          </label>
          <textarea
            disabled={isReadOnlyView}
            rows={3}
            maxLength={1000}
            value={formData.interpretasiKlinis}
            onChange={(e) => setFormData({ ...formData, interpretasiKlinis: e.target.value })}
            placeholder="Simpulan klinis hasil pemeriksaan medis, pola adiksi, dan urgensi penempatan rehabilitasi..."
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-3">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Catatan Khusus Rekomendasi untuk Sidang Pleno TAT <span className="text-rose-400">*</span>
          </label>
          <input
            disabled={isReadOnlyView}
            type="text"
            maxLength={500}
            value={formData.catatanKhususPleno}
            onChange={(e) => setFormData({ ...formData, catatanKhususPleno: e.target.value })}
            placeholder="Catatan pertimbangan bagi Ketua TAT dan Jaksa saat pleno..."
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
          <span>Lanjut ke Pengesahan</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
