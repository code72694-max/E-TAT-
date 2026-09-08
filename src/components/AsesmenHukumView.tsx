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
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <span>Asesmen Hukum</span>
          </h1>
          
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permohonanList.map(item => {
          const hasHukum = !!item.asesmenHukum;
          return (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-white border border-slate-200 hover:border-purple-400 rounded-xl p-5 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-900">{item.nomorPermohonan}</span>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.terperiksa.namaLengkap} • LP: {item.perkara.nomorLaporanPolisi}</p>
                  <p className="text-[11px] text-slate-500">Pasal: {item.perkara.pasalDipersangkakan}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  hasHukum ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {hasHukum ? 'Telaah Lengkap' : 'Menunggu Telaah'}
                </span>
              </div>

              {hasHukum ? (
                <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 text-slate-700 border border-slate-100">
                  <p>Analisis Peran: <strong className="text-slate-900">{item.asesmenHukum?.analisisPeran}</strong></p>
                  <p>Evaluasi BB: {item.asesmenHukum?.analisisBarangBukti}</p>
                  <p>Kesimpulan Hukum: <strong className="text-purple-800">{item.asesmenHukum?.rekomendasiHukum}</strong></p>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-900 border border-amber-100">
                  Telaah yuridis belum diinput atau menunggu kelengkapan uji lab toksikologi. Klik untuk menelaah.
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                <span>Penelaah: {item.asesmenHukum?.asesorNama || 'Belum diisi'}</span>
                <span className="text-purple-700 font-semibold flex items-center space-x-1">
                  <span>Buka Lembar Hukum</span>
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
