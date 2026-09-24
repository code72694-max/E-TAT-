import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { Scale, CheckCircle2, AlertTriangle, ArrowRight, Shield, FileCheck } from 'lucide-react';

interface AsesmenHukumViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
}

export const AsesmenHukumView: React.FC<AsesmenHukumViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <Scale className="w-5 h-5 text-[#38bdf8]" />
            <span>Asesmen Hukum & Yuridis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Penelaahan kualifikasi peran (SEMA 04/2010), batas gramatur barang bukti narkotika, dan jaringan sindikat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permohonanList.map(item => {
          const hasHukum = !!item.asesmenHukum;
          return (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-[#0b172a] border border-[#1b3459] hover:border-[#38bdf8] rounded-xl p-5 transition-all cursor-pointer space-y-3 shadow-lg shadow-black/20 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] font-mono transition-colors">{item.nomorPermohonan}</span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">{item.terperiksa.namaLengkap} • LP: {item.perkara.nomorLaporanPolisi}</p>
                  <p className="text-[11px] text-slate-400">Pasal: {item.perkara.pasalDipersangkakan}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  hasHukum ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {hasHukum ? 'Telaah Lengkap' : 'Menunggu Telaah'}
                </span>
              </div>

              {hasHukum ? (
                <div className="bg-[#081224] rounded-lg p-3 text-xs space-y-1 text-slate-300 border border-[#1b3459]">
                  <p>Analisis Peran: <strong className="text-white">{item.asesmenHukum?.analisisPeran}</strong></p>
                  <p>Evaluasi BB: {item.asesmenHukum?.analisisBarangBukti}</p>
                  <p>Kesimpulan Hukum: <strong className="text-purple-300">{item.asesmenHukum?.rekomendasiHukum}</strong></p>
                </div>
              ) : (
                <div className="bg-amber-500/10 rounded-lg p-3 text-xs text-amber-200 border border-amber-500/30">
                  Telaah yuridis belum diinput atau menunggu kelengkapan uji lab toksikologi. Klik untuk menelaah.
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#1b3459]">
                <span>Penelaah: {item.asesmenHukum?.asesorNama || 'Belum diisi'}</span>
                <span className="text-[#38bdf8] font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Buka Lembar Hukum</span>
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
