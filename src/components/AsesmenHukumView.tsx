import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { Scale, ArrowRight } from 'lucide-react';

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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Scale className="w-5 h-5 text-[#d4af37]" />
            <span>Asesmen Hukum &amp; Yuridis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Penelaahan kualifikasi peran (SEMA 04/2010), batas gramatur barang bukti narkotika, dan jaringan sindikat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {permohonanList.map(item => {
          const hasHukum = !!item.asesmenHukum;
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
                    <p className="text-xs font-semibold text-white mt-0.5 truncate">{item.terperiksa.namaLengkap} &bull; LP: {item.perkara.nomorLaporanPolisi}</p>
                    <p className="text-[11px] text-slate-400 truncate">Pasal: {item.perkara.pasalDipersangkakan}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                    hasHukum ? 'bg-[#142642] text-slate-200 border-[#234475]' : 'bg-[#142642] text-[#d4af37] border-[#d4af37]/30'
                  }`}>
                    {hasHukum ? 'Telaah Lengkap' : 'Menunggu Telaah'}
                  </span>
                </div>

                {hasHukum ? (
                  <div className="bg-[#081224] rounded-xl p-3 text-xs space-y-1 text-slate-300 border border-[#1b3459]">
                    <p>Analisis Peran: <strong className="text-white">{item.asesmenHukum?.analisisPeran}</strong></p>
                    <p>Evaluasi BB: {item.asesmenHukum?.analisisBarangBukti}</p>
                    <p>Kesimpulan Hukum: <strong className="text-slate-200">{item.asesmenHukum?.rekomendasiHukum}</strong></p>
                  </div>
                ) : (
                  <div className="bg-[#142642] rounded-xl p-3 text-xs text-slate-300 border border-[#234475]">
                    Telaah yuridis belum diinput atau menunggu kelengkapan uji lab toksikologi. Klik untuk menelaah.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1b3459] mt-2">
                <span className="truncate">Penelaah: {item.asesmenHukum?.asesorNama || 'Belum diisi'}</span>
                <span className="text-[#d4af37] font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                  <span>Buka Lembar Hukum</span>
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
