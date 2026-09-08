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
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
            <span>Asesmen Medis</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permohonanList.map(item => {
          const hasMedis = !!item.asesmenMedis;
          return (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-white border border-slate-200 hover:border-emerald-400 rounded-xl p-5 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-900">{item.nomorPermohonan}</span>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.terperiksa.namaLengkap} ({item.terperiksa.usia} th)</p>
                  <p className="text-[11px] text-slate-500">BB: {item.perkara.barangBuktiList.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ')}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  hasMedis ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {hasMedis ? 'Asesmen Selesai' : 'Perlu Pemeriksaan'}
                </span>
              </div>

              {hasMedis ? (
                <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 text-slate-700 border border-slate-100">
                  <p>Diagnosis: <strong className="text-slate-900">{item.asesmenMedis?.diagnosisKlinisIcd}</strong></p>
                  <p>ASSIST: <strong>{item.asesmenMedis?.skorInstrumen} Poin</strong> ({item.asesmenMedis?.tingkatRisikoInstrumen})</p>
                  <p>Rekomendasi Medis: <strong className="text-emerald-700">{item.asesmenMedis?.kebutuhanRawat} ({item.asesmenMedis?.durasiUsulanBulan} Bulan)</strong></p>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-900 border border-amber-100">
                  Pemeriksaan fisik & wawancara klinis belum diinput. Klik untuk membuka formulir asesmen medis.
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                <span>Dokter: {item.asesmenMedis?.asesorNama || 'Belum diisi'}</span>
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <span>Buka Lembar Medis</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
