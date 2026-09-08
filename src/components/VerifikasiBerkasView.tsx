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
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <span>{isPengaju ? 'Daftar Perbaikan & Status Verifikasi Berkas' : 'Meja Verifikasi Kelengkapan Berkas Administrasi'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isPengaju
              ? 'Pantau hasil verifikasi dokumen oleh Sekretariat TAT. Unggah perbaikan pada berkas yang ditandai memerlukan revisi.'
              : 'Pemeriksaan dokumen awal oleh Sekretariat TAT untuk memastikan syarat hukum terpenuhi sebelum tim asesor ditugaskan.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-white border border-slate-200 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Semua ({permohonanList.filter(p => ['verifikasi_berkas', 'diajukan', 'perlu_perbaikan'].includes(p.statusProsesUtama)).length})
          </button>
          <button
            onClick={() => setFilter('verifikasi')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${filter === 'verifikasi' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Siap Diperiksa
          </button>
          <button
            onClick={() => setFilter('perbaikan')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${filter === 'perbaikan' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Perlu Perbaikan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">Tidak ada berkas yang menunggu verifikasi.</p>
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
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">{item.nomorPermohonan}</span>
                      {item.statusProsesUtama === 'perlu_perbaikan' ? (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                          Perlu Perbaikan Pengaju
                        </span>
                      ) : (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-300">
                          Menunggu Pemeriksaan Berkas
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700">
                      Terperiksa: <strong>{item.terperiksa.namaLengkap}</strong> • LP: {item.perkara.nomorLaporanPolisi}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Pengaju: {item.instansiPengaju} ({item.pengajuNama}) • Diajukan: {item.tanggalPengajuan}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 shrink-0">
                    <div className="text-right text-xs">
                      <span className="text-slate-500 block text-[11px]">Progres Dokumen:</span>
                      <span className="font-bold text-slate-900">
                        {validCount} Sesuai • {invalidCount} Perlu Koreksi / {totalDocs} Total
                      </span>
                    </div>

                    <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5">
                      <span>{isPengaju ? (item.statusProsesUtama === 'perlu_perbaikan' ? 'Perbaiki Dokumen' : 'Lihat Status Berkas') : 'Buka Verifikasi'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
