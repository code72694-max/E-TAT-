import React, { useState } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { FileCheck, AlertTriangle, CheckCircle2, Clock, ArrowRight, Search, FileText } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <FileCheck className="w-5 h-5 text-[#38bdf8]" />
            <span>{isPengaju ? 'Daftar Perbaikan & Status Verifikasi Berkas' : 'Meja Verifikasi Kelengkapan Berkas Administrasi'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isPengaju
              ? 'Pantau hasil verifikasi dokumen oleh Sekretariat TAT. Unggah perbaikan pada berkas yang ditandai memerlukan revisi.'
              : 'Pemeriksaan dokumen awal oleh Sekretariat TAT untuk memastikan syarat hukum terpenuhi sebelum tim asesor ditugaskan.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-[#0b172a] border border-[#1b3459] rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${filter === 'all' ? 'bg-[#1b3459] text-white font-bold border border-[#2d5289]' : 'text-slate-400 hover:text-white'}`}
          >
            Semua ({permohonanList.filter(p => ['verifikasi_berkas', 'diajukan', 'perlu_perbaikan'].includes(p.statusProsesUtama)).length})
          </button>
          <button
            onClick={() => setFilter('verifikasi')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${filter === 'verifikasi' ? 'bg-[#1b3459] text-white font-bold border border-[#2d5289]' : 'text-slate-400 hover:text-white'}`}
          >
            Siap Diperiksa
          </button>
          <button
            onClick={() => setFilter('perbaikan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${filter === 'perbaikan' ? 'bg-[#1b3459] text-white font-bold border border-[#2d5289]' : 'text-slate-400 hover:text-white'}`}
          >
            Perlu Perbaikan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingList.length === 0 ? (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-12 text-center text-slate-400 shadow-lg shadow-black/20">
            <CheckCircle2 className="w-10 h-10 text-[#38bdf8] mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">Tidak ada berkas yang menunggu verifikasi.</p>
            <p className="text-xs text-slate-400 mt-0.5">Semua berkas yang diajukan telah selesai diperiksa atau dijadwalkan.</p>
          </div>
        ) : (
          pendingList.map(item => {
            const validCount = item.dokumenList.filter(d => d.statusVerifikasi === 'sesuai').length;
            const invalidCount = item.dokumenList.filter(d => d.statusVerifikasi === 'perlu_perbaikan').length;
            const totalDocs = item.dokumenList.length;

            return (
              <div
                key={item.id}
                onClick={() => onSelectPermohonan(item.id)}
                className="bg-[#0b172a] border border-[#1b3459] hover:border-[#38bdf8] rounded-xl p-4 transition-all cursor-pointer shadow-md shadow-black/20 hover:shadow-cyan-950/20 group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] font-mono transition-colors">{item.nomorPermohonan}</span>
                      {item.statusProsesUtama === 'perlu_perbaikan' ? (
                        <span className="text-[10px] bg-[#081224] text-slate-200 font-mono font-medium px-2 py-0.5 rounded border border-[#1b3459]">
                          Perlu Perbaikan Pengaju
                        </span>
                      ) : (
                        <span className="text-[10px] bg-[#081224] text-slate-200 font-mono font-medium px-2 py-0.5 rounded border border-[#1b3459]">
                          Menunggu Pemeriksaan Berkas
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong> • LP: <span className="text-slate-200">{item.perkara.nomorLaporanPolisi}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Pengaju: {item.instansiPengaju} ({item.pengajuNama}) • Diajukan: {item.tanggalPengajuan}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 shrink-0">
                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[11px]">Progres Dokumen:</span>
                      <span className="font-bold text-slate-200">
                        <span>{validCount} Sesuai</span> • <span>{invalidCount} Perlu Koreksi</span> / {totalDocs} Total
                      </span>
                    </div>

                    <button className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 border border-[#235594] transition-all cursor-pointer">
                      <span>{isPengaju ? (item.statusProsesUtama === 'perlu_perbaikan' ? 'Perbaiki Dokumen' : 'Lihat Status Berkas') : 'Buka Verifikasi'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
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
