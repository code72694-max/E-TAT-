import React from 'react';
import { History, CheckCircle2, Clock, User } from 'lucide-react';
import { PermohonanAsesmen } from '../../types';

interface TabRiwayatLogProps {
  permohonan: PermohonanAsesmen;
}

export const TabRiwayatLog: React.FC<TabRiwayatLogProps> = ({ permohonan }) => {
  const auditLogs = permohonan.auditLogs || [];

  return (
    <div className="space-y-5">
      <div className="pb-3 border-b border-[#1b3459] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <History className="w-4 h-4 text-[#D4AF37]" />
            <span>Jejak Audit & Riwayat Perubahan Status (Audit Trail)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Catatan sejarah permohonan dari pendaftaran hingga penyelesaian akhir, mencakup waktu (jam/tanggal), aktor, dan rincian perubahan status.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded-lg shrink-0">
          {auditLogs.length} Perubahan Terrekam
        </span>
      </div>

      <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1b3459]">
        {auditLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-[#081224] border border-[#1b3459] rounded-xl">
            Belum ada log perubahan status terrekam.
          </div>
        ) : (
          auditLogs.map((log, idx) => (
            <div key={log.id || idx} className="relative pl-9 flex items-start space-x-3 text-xs">
              <div className="absolute left-2.5 top-2.5 w-3 h-3 rounded-full bg-[#d4af37] border-2 border-[#0b172a] shadow-sm shrink-0" />
              
              <div className="flex-1 bg-[#081224] border border-[#1b3459] hover:border-[#234475] rounded-xl p-4 space-y-2 transition-colors shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b3459]/60 pb-2">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                    <span>{log.aksi}</span>
                  </span>
                  <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-400 bg-[#0b172a] px-2.5 py-1 rounded-lg border border-[#1b3459]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {log.rincian}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1.5">
                    <User className="w-3 h-3 text-[#d4af37]" />
                    <span>Oleh: <strong className="text-slate-200">{log.actorNama}</strong> ({log.actorPeran})</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
