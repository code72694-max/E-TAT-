import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { Users, CheckCircle2, Clock, ArrowRight, FileText, AlertTriangle } from 'lucide-react';

interface PlenoTATViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
}

export const PlenoTATView: React.FC<PlenoTATViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan
}) => {
  const plenoList = permohonanList.filter(p => 
    ['siap_pleno', 'pembahasan_pleno', 'pengesahan_rekomendasi', 'rekomendasi_terbit'].includes(p.statusProsesUtama)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Sidang Pleno Musyawarah Tim Asesmen Terpadu</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Forum musyawarah terpadu antara Tim Medis, Tim Hukum, dan Penyidik untuk merumuskan rekomendasi resmi bersama.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plenoList.map(item => {
          const isDone = item.sidangPleno?.statusPleno === 'selesai';
          return (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-5 transition-all cursor-pointer space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{item.nomorPermohonan}</span>
                    <span className="text-xs text-slate-600">• Terperiksa: <strong>{item.terperiksa.namaLengkap}</strong></span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No. Berita Acara: <strong>{item.sidangPleno?.nomorBeritaAcara || 'Menunggu Penyusunan'}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    isDone ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                  }`}>
                    {isDone ? 'Pleno Selesai' : 'Siap Diperiksa / Berlangsung'}
                  </span>
                </div>
              </div>

              {/* Side by side preview Medis vs Hukum */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Aspek Medis:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{item.asesmenMedis?.diagnosisKlinisIcd || 'Dalam proses'}</p>
                  <p className="text-slate-600 text-[11px] mt-1">Usulan: {item.asesmenMedis?.kebutuhanRawat} ({item.asesmenMedis?.durasiUsulanBulan} Bulan)</p>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200">
                  <span className="text-[10px] uppercase font-bold text-purple-800 block">Aspek Hukum:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{item.asesmenHukum?.analisisPeran || 'Dalam proses'}</p>
                  <p className="text-slate-600 text-[11px] mt-1">Rekomendasi: {item.asesmenHukum?.rekomendasiHukum}</p>
                </div>
              </div>

              {/* Kesepakatan Final */}
              {item.sidangPleno?.kesepakatanRekomendasi && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-800 block">Kesepakatan Musyawarah Pleno:</span>
                    <span className="font-bold text-indigo-950 text-xs">{item.sidangPleno.kesepakatanRekomendasi}</span>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center space-x-1 shrink-0">
                    <span>Lihat Berita Acara</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
