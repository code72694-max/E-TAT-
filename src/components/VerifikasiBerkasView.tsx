import React, { useState } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface VerifikasiBerkasViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
}

export const VerifikasiBerkasView: React.FC<VerifikasiBerkasViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan
}) => {
  const [filter, setFilter] = useState<'all' | 'verifikasi' | 'perbaikan'>('all');

  const pendingList = permohonanList.filter(p => {
    if (filter === 'verifikasi') return p.statusProsesUtama === 'verifikasi_berkas' || p.statusProsesUtama === 'diajukan';
    if (filter === 'perbaikan') return p.statusProsesUtama === 'perlu_perbaikan';
    return ['verifikasi_berkas', 'diajukan', 'perlu_perbaikan'].includes(p.statusProsesUtama);
  });

  const isPengaju = currentUser.role === 'pengaju';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-[#d4af37]" />
            <span>{isPengaju ? 'Daftar Perbaikan & Status Verifikasi Berkas' : 'Meja Verifikasi Kelengkapan Berkas Administrasi'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isPengaju
              ? 'Pantau hasil verifikasi dokumen oleh Sekretariat TAT. Unggah perbaikan pada berkas yang ditandai memerlukan revisi.'
              : 'Pemeriksaan dokumen awal oleh Sekretariat TAT untuk memastikan syarat hukum terpenuhi sebelum tim asesor ditugaskan.'}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs bg-[#0b172a] border border-[#1b3459] rounded-xl p-1 shadow-sm shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${filter === 'all' ? 'bg-[#142642] text-white font-bold border border-[#234475]' : 'text-slate-400 hover:text-white'}`}
          >
            Semua ({permohonanList.filter(p => ['verifikasi_berkas', 'diajukan', 'perlu_perbaikan'].includes(p.statusProsesUtama)).length})
          </button>
          <button
            onClick={() => setFilter('verifikasi')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${filter === 'verifikasi' ? 'bg-[#142642] text-white font-bold border border-[#234475]' : 'text-slate-400 hover:text-white'}`}
          >
            Siap Diperiksa
          </button>
          <button
            onClick={() => setFilter('perbaikan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${filter === 'perbaikan' ? 'bg-[#142642] text-white font-bold border border-[#234475]' : 'text-slate-400 hover:text-white'}`}
          >
            Perlu Perbaikan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {pendingList.length === 0 ? (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-8 text-center text-slate-400 shadow-md">
            <CheckCircle2 className="w-9 h-9 text-[#d4af37] mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">Tidak ada berkas yang menunggu verifikasi.</p>
            <p className="text-xs text-slate-400 mt-0.5">Semua berkas yang diajukan telah selesai diperiksa atau dijadwalkan.</p>
          </div>
        ) : (
          pendingList.map(item => {
            const validCount = item.dokumenList.filter(d => d.statusVerifikasi === 'sesuai').length;
            const totalDocs = item.dokumenList.length;
            const percentComplete = totalDocs > 0 ? Math.round((validCount / totalDocs) * 100) : 0;

            return (
              <div
                key={item.id}
                onClick={() => onSelectPermohonan(item.id)}
                className="bg-[#0b172a] border border-[#1b3459] hover:border-[#d4af37]/60 rounded-2xl p-4 transition-all cursor-pointer shadow-md group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-bold text-xs text-[#d4af37] font-mono group-hover:underline">{item.nomorPermohonan}</span>
                      {item.statusProsesUtama === 'perlu_perbaikan' ? (
                        <span className="text-[10px] bg-rose-500/10 text-rose-300 font-semibold px-2 py-0.5 rounded border border-rose-500/20">
                          Perlu Perbaikan Pengaju
                        </span>
                      ) : (
                        <span className="text-[10px] bg-[#142642] text-slate-200 font-semibold px-2 py-0.5 rounded border border-[#234475]">
                          Menunggu Pemeriksaan Berkas
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 truncate">
                      Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong> &bull; LP: <span className="text-slate-200">{item.perkara.nomorLaporanPolisi}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Pengaju: {item.instansiPengaju} ({item.pengajuNama}) &bull; Diajukan: {item.tanggalPengajuan}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1b3459]">
                    <div className="text-left sm:text-right text-xs">
                      <div className="flex items-center justify-start sm:justify-end space-x-1.5">
                        <span className="text-slate-400 text-[11px]">Kelengkapan:</span>
                        <span className="font-bold font-mono text-[#d4af37]">{percentComplete}%</span>
                      </div>
                      <div className="w-full sm:w-32 bg-[#081224] h-1.5 rounded-full overflow-hidden border border-[#1b3459] mt-1">
                        <div
                          className={`h-full transition-all duration-300 ${percentComplete === 100 ? 'bg-emerald-400' : percentComplete >= 50 ? 'bg-[#d4af37]' : 'bg-rose-400'}`}
                          style={{ width: `${percentComplete}%` }}
                        />
                      </div>
                      <span className="font-medium text-[11px] text-slate-400 block mt-1">
                        {validCount} dari {totalDocs} berkas valid
                      </span>
                    </div>

                    <button className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 border border-[#234475] transition-colors cursor-pointer w-full sm:w-auto">
                      <span>{isPengaju ? (item.statusProsesUtama === 'perlu_perbaikan' ? 'Perbaiki Dokumen' : 'Lihat Status Berkas') : 'Buka Verifikasi'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-200" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
