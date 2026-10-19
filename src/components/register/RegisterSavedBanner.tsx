import React from 'react';
import { RegistrasiPengguna } from '../../types';
import { formatOfficerName } from './constants';
import { CheckCircle2 } from 'lucide-react';

interface RegisterSavedBannerProps {
  savedRegistration: RegistrasiPengguna;
  onViewTicket: () => void;
}

export const RegisterSavedBanner: React.FC<RegisterSavedBannerProps> = ({
  savedRegistration,
  onViewTicket
}) => {
  return (
    <div className="bg-[#132847]/80 border border-[#234b7f] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in shadow-md">
      <div className="flex items-start sm:items-center space-x-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <span className="font-semibold text-white block">
            Pendaftaran Sebelumnya Tersimpan: <span className="text-[#D4AF37] font-mono">{savedRegistration.nomorRegistrasi}</span>
          </span>
          <span className="text-slate-300 text-[11px]">
            Atas nama {formatOfficerName(savedRegistration.pangkat, savedRegistration.namaLengkap)} ({savedRegistration.instansi}) - Menunggu Verifikasi Admin.
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onViewTicket}
        className="bg-[#1b3459] hover:bg-[#234475] text-[#D4AF37] hover:text-white border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-sm"
      >
        Lihat Tiket Pendaftaran
      </button>
    </div>
  );
};
