import React from 'react';
import { MedisFormData } from './types';
import { FileText, ArrowRight } from 'lucide-react';

interface Step4WhoAssistMseProps {
  formData: MedisFormData;
  setFormData: React.Dispatch<React.SetStateAction<MedisFormData>>;
  calculatedAssistScore: number;
  assistRiskLevel: string;
  isReadOnlyView: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const Step4WhoAssistMse: React.FC<Step4WhoAssistMseProps> = ({
  formData,
  setFormData,
  calculatedAssistScore,
  assistRiskLevel,
  isReadOnlyView,
  onPrev,
  onNext
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-5 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Instrumen Skoring WHO ASSIST &amp; Evaluasi Psikiatri (MSE)</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-300">Total Skor:</span>
          <span className="text-sm font-extrabold text-[#d4af37] font-mono">{calculatedAssistScore} Poin</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            assistRiskLevel.includes('Tinggi') ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
          }`}>
            {assistRiskLevel}
          </span>
        </div>
      </div>

      {/* WHO ASSIST Questionnaire Items */}
      <div className="space-y-3 text-xs">
        <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
          <p className="font-semibold text-white">
            Q1. Seberapa sering menggunakan zat dalam 3 bulan terakhir? <span className="text-rose-400">*</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[{ l: 'Tidak Pernah (0)', v: 0 }, { l: '1-2 Kali (2)', v: 2 }, { l: 'Bulanan (3)', v: 3 }, { l: 'Mingguan/Harian (4-6)', v: 5 }].map(opt => (
              <button
                disabled={isReadOnlyView}
                key={opt.v}
                type="button"
                onClick={() => !isReadOnlyView && setFormData({ ...formData, q1_frekuensi: opt.v })}
                className={`p-2 rounded-lg text-center border font-semibold transition-colors disabled:cursor-not-allowed ${
                  formData.q1_frekuensi === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
          <p className="font-semibold text-white">
            Q2. Seberapa sering timbul dorongan kuat / craving untuk memakai zat? <span className="text-rose-400">*</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[{ l: 'Tidak Pernah (0)', v: 0 }, { l: 'Jarang (3)', v: 3 }, { l: 'Mingguan (4)', v: 4 }, { l: 'Hampir Setiap Hari (6)', v: 6 }].map(opt => (
              <button
                disabled={isReadOnlyView}
                key={opt.v}
                type="button"
                onClick={() => !isReadOnlyView && setFormData({ ...formData, q2_dorongan: opt.v })}
                className={`p-2 rounded-lg text-center border font-semibold transition-colors disabled:cursor-not-allowed ${
                  formData.q2_dorongan === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
          <p className="font-semibold text-white">
            Q3. Seberapa sering penggunaan zat menimbulkan masalah kesehatan, sosial, hukum, atau finansial? <span className="text-rose-400">*</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[{ l: 'Tidak Pernah (0)', v: 0 }, { l: '1-2 Kali (4)', v: 4 }, { l: 'Bulanan (5)', v: 5 }, { l: 'Mingguan / Harian (6)', v: 6 }].map(opt => (
              <button
                disabled={isReadOnlyView}
                key={opt.v}
                type="button"
                onClick={() => !isReadOnlyView && setFormData({ ...formData, q3_masalah: opt.v })}
                className={`p-2 rounded-lg text-center border font-semibold transition-colors disabled:cursor-not-allowed ${
                  formData.q3_masalah === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
          <p className="font-semibold text-white">
            Q4. Seberapa sering gagal melakukan hal yang diharapkan (kewajiban kerja/keluarga)? <span className="text-rose-400">*</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[{ l: 'Tidak Pernah (0)', v: 0 }, { l: 'Jarang (4)', v: 4 }, { l: 'Bulanan (5)', v: 5 }, { l: 'Hampir Selalu (6)', v: 6 }].map(opt => (
              <button
                disabled={isReadOnlyView}
                key={opt.v}
                type="button"
                onClick={() => !isReadOnlyView && setFormData({ ...formData, q4_kegagalan: opt.v })}
                className={`p-2 rounded-lg text-center border font-semibold transition-colors disabled:cursor-not-allowed ${
                  formData.q4_kegagalan === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
          <p className="font-semibold text-white">
            Q5. Pernahkah orang lain (keluarga, teman, dokter) mengkhawatirkan penggunaan zat Anda? <span className="text-rose-400">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { l: 'Tidak Pernah (0)', v: 0 },
              { l: 'Pernah, tapi bukan 3 bln terakhir (3)', v: 3 },
              { l: 'Pernah, dalam 3 bln terakhir (6)', v: 6 }
            ].map(opt => (
              <button
                disabled={isReadOnlyView}
                key={opt.v}
                type="button"
                onClick={() => !isReadOnlyView && setFormData({ ...formData, q5_kecemasan_orang_lain: opt.v })}
                className={`p-2 rounded-lg text-center border font-semibold transition-colors disabled:cursor-not-allowed ${
                  formData.q5_kecemasan_orang_lain === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
          <p className="font-semibold text-white">
            Q6. Pernahkah Anda mencoba mengontrol, mengurangi, atau berhenti memakai zat tetapi gagal? <span className="text-rose-400">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { l: 'Tidak Pernah (0)', v: 0 },
              { l: 'Pernah, tapi bukan 3 bln terakhir (3)', v: 3 },
              { l: 'Pernah, dalam 3 bln terakhir (6)', v: 6 }
            ].map(opt => (
              <button
                disabled={isReadOnlyView}
                key={opt.v}
                type="button"
                onClick={() => !isReadOnlyView && setFormData({ ...formData, q6_usaha_berhenti_gagal: opt.v })}
                className={`p-2 rounded-lg text-center border font-semibold transition-colors disabled:cursor-not-allowed ${
                  formData.q6_usaha_berhenti_gagal === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <label className="text-slate-300 font-semibold mb-1.5 block">
            Evaluasi Status Mental / Mental Status Examination (MSE) <span className="text-rose-400">*</span>
          </label>
          <textarea
            disabled={isReadOnlyView}
            rows={2}
            maxLength={1000}
            value={formData.evaluasiMse}
            onChange={(e) => setFormData({ ...formData, evaluasiMse: e.target.value })}
            placeholder="Catatan orientasi, mood, afek, proses pikir, dan ada/tidaknya halusinasi..."
            className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 text-xs disabled:opacity-75 disabled:cursor-not-allowed"
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
          <span>Lanjut ke Diagnosis &amp; Rekomendasi</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
};
