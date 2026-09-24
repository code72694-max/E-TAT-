import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { Stethoscope, CheckCircle2, Clock, AlertTriangle, ArrowRight, Activity, FileText } from 'lucide-react';

interface AsesmenMedisViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
}

export const AsesmenMedisView: React.FC<AsesmenMedisViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <Stethoscope className="w-5 h-5 text-[#38bdf8]" />
            <span>Asesmen Medis & Psikiatri</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pemeriksaan fisik, diagnosis ICD-10 (F10-F19), uji urin konfirmasi, dan pemetaan tingkat adiksi instrumen WHO ASSIST.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permohonanList.map(item => {
          const hasMedis = !!item.asesmenMedis;
          return (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-[#0b172a] border border-[#1b3459] hover:border-[#38bdf8] rounded-xl p-5 transition-all cursor-pointer space-y-3 shadow-lg shadow-black/20 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] font-mono transition-colors">{item.nomorPermohonan}</span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">{item.terperiksa.namaLengkap} ({item.terperiksa.usia} th)</p>
                  <p className="text-[11px] text-slate-400">BB: {item.perkara.barangBuktiList.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ')}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  hasMedis ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {hasMedis ? 'Asesmen Selesai' : 'Perlu Pemeriksaan'}
                </span>
              </div>

              {hasMedis ? (
                <div className="bg-[#081224] rounded-lg p-3 text-xs space-y-1 text-slate-300 border border-[#1b3459]">
                  <p>Diagnosis: <strong className="text-white">{item.asesmenMedis?.diagnosisKlinisIcd}</strong></p>
                  <p>ASSIST: <strong className="text-white">{item.asesmenMedis?.skorInstrumen} Poin</strong> ({item.asesmenMedis?.tingkatRisikoInstrumen})</p>
                  <p>Rekomendasi Medis: <strong className="text-emerald-300">{item.asesmenMedis?.kebutuhanRawat} ({item.asesmenMedis?.durasiUsulanBulan} Bulan)</strong></p>
                </div>
              ) : (
                <div className="bg-amber-500/10 rounded-lg p-3 text-xs text-amber-200 border border-amber-500/30">
                  Pemeriksaan fisik & wawancara klinis belum diinput. Klik untuk membuka formulir asesmen medis.
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#1b3459]">
                <span>Dokter: {item.asesmenMedis?.asesorNama || 'Belum diisi'}</span>
                <span className="text-[#38bdf8] font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Buka Lembar Medis</span>
                  <ArrowRight className="w-3 h-3 text-[#F1C40F]" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
