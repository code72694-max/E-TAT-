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
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <Users className="w-5 h-5 text-[#38bdf8]" />
            <span>Sidang Pleno Musyawarah Tim Asesmen Terpadu</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
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
              className="bg-[#0b172a] border border-[#1b3459] hover:border-[#38bdf8] rounded-xl p-5 transition-all cursor-pointer space-y-3 shadow-lg shadow-black/20 group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] font-mono transition-colors">{item.nomorPermohonan}</span>
                    <span className="text-xs text-slate-300">• Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong></span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No. Berita Acara: <strong className="text-slate-200">{item.sidangPleno?.nomorBeritaAcara || 'Menunggu Penyusunan'}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    isDone ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}>
                    {isDone ? 'Pleno Selesai' : 'Siap Diperiksa / Berlangsung'}
                  </span>
                </div>
              </div>

              {/* Side by side preview Medis vs Hukum */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-[#081224] rounded-lg border border-[#1b3459]">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Aspek Medis:</span>
                  <p className="font-semibold text-white mt-0.5">{item.asesmenMedis?.diagnosisKlinisIcd || 'Dalam proses'}</p>
                  <p className="text-slate-300 text-[11px] mt-1">Usulan: {item.asesmenMedis?.kebutuhanRawat} ({item.asesmenMedis?.durasiUsulanBulan} Bulan)</p>
                </div>

                <div className="p-3 bg-[#081224] rounded-lg border border-[#1b3459]">
                  <span className="text-[10px] uppercase font-bold text-purple-400 block">Aspek Hukum:</span>
                  <p className="font-semibold text-white mt-0.5">{item.asesmenHukum?.analisisPeran || 'Dalam proses'}</p>
                  <p className="text-slate-300 text-[11px] mt-1">Rekomendasi: {item.asesmenHukum?.rekomendasiHukum}</p>
                </div>
              </div>

              {/* Kesepakatan Final */}
              {item.sidangPleno?.kesepakatanRekomendasi && (
                <div className="p-3 bg-[#0d1f3d] rounded-lg border border-[#234577] text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#38bdf8] block">Kesepakatan Musyawarah Pleno:</span>
                    <span className="font-bold text-white text-xs">{item.sidangPleno.kesepakatanRekomendasi}</span>
                  </div>
                  <button className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 border border-[#2d7ad6]/70 shadow-sm transition-colors">
                    <span>Lihat Berita Acara</span>
                    <ArrowRight className="w-3 h-3 text-[#F1C40F]" />
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
