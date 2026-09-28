import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { Stethoscope, ArrowRight } from 'lucide-react';

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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-[#d4af37]" />
            <span>Asesmen Medis &amp; Psikiatri</span>
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
              className="bg-[#0b172a] border border-[#1b3459] hover:border-[#d4af37]/60 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer space-y-3 shadow-md group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs text-[#d4af37] font-mono group-hover:underline">{item.nomorPermohonan}</span>
                    <p className="text-xs font-semibold text-white mt-0.5 truncate">{item.terperiksa.namaLengkap} ({item.terperiksa.usia} th)</p>
                    <p className="text-[11px] text-slate-400 truncate">BB: {item.perkara.barangBuktiList.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ')}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                    hasMedis ? 'bg-[#142642] text-slate-200 border-[#234475]' : 'bg-[#142642] text-[#d4af37] border-[#d4af37]/30'
                  }`}>
                    {hasMedis ? 'Asesmen Selesai' : 'Perlu Pemeriksaan'}
                  </span>
                </div>

                {hasMedis ? (
                  <div className="bg-[#081224] rounded-xl p-3 text-xs space-y-1 text-slate-300 border border-[#1b3459]">
                    <p>Diagnosis: <strong className="text-white">{item.asesmenMedis?.diagnosisKlinisIcd}</strong></p>
                    <p>ASSIST: <strong className="text-white">{item.asesmenMedis?.skorInstrumen} Poin</strong> ({item.asesmenMedis?.tingkatRisikoInstrumen})</p>
                    <p>Rekomendasi Medis: <strong className="text-slate-200">{item.asesmenMedis?.kebutuhanRawat} ({item.asesmenMedis?.durasiUsulanBulan} Bulan)</strong></p>
                  </div>
                ) : (
                  <div className="bg-[#142642] rounded-xl p-3 text-xs text-slate-300 border border-[#234475]">
                    Pemeriksaan fisik &amp; wawancara klinis belum diinput. Klik untuk membuka formulir asesmen medis.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1b3459] mt-2">
                <span className="truncate">Dokter: {item.asesmenMedis?.asesorNama || 'Belum diisi'}</span>
                <span className="text-[#d4af37] font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                  <span>Buka Lembar Medis</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
