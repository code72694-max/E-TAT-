import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { Activity, ArrowRight } from 'lucide-react';

interface AsesmenPemulihanViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
}

export const AsesmenPemulihanView: React.FC<AsesmenPemulihanViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan
}) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#d4af37]" />
            <span>Instrumen Pemulihan (Kriteria Penempatan Klien ASAM)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Penilaian 6 Dimensi (Intoksikasi, Komplikasi Medis, Kondisi Psikologis, Kesiapan Berubah, Potensi Kekambuhan, Lingkungan Pemulihan).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {permohonanList.map(item => {
          const hasAsam = !!item.instrumenKriteriaPlasemen;
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
                    <p className="text-[11px] text-slate-400 truncate">Status Kasus: {item.statusProsesUtama.replace(/_/g, ' ').toUpperCase()}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                    hasAsam ? 'bg-[#142642] text-slate-200 border-[#234475]' : 'bg-[#142642] text-[#d4af37] border-[#d4af37]/30'
                  }`}>
                    {hasAsam ? 'Instrumen Diisi' : 'Belum Diisi'}
                  </span>
                </div>

                {hasAsam ? (
                  <div className="p-3 text-xs space-y-1 text-slate-300">
                    <p>Level Rekomendasi: <strong className="text-white">Level {item.instrumenKriteriaPlasemen?.hasil?.levelRekomendasiAkhir}</strong></p>
                    <p>Keterangan: <strong className="text-slate-200">{item.instrumenKriteriaPlasemen?.hasil?.justifikasiRekomendasi || 'Telah dievaluasi pada 6 dimensi'}</strong></p>
                  </div>
                ) : (
                  <div className="p-3 text-xs text-slate-300">
                    Instrumen kriteria penempatan klien (ASAM) belum diisi. Klik untuk membuka instrumen.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1b3459] mt-2">
                <span className="truncate">Petugas: {item.instrumenKriteriaPlasemen?.petugasNama || 'Belum ditugaskan'}</span>
                <span className="text-[#d4af37] font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                  <span>Buka Instrumen</span>
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
