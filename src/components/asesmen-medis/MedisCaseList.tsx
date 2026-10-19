import React from 'react';
import { PermohonanAsesmen } from '../../types';
import { Stethoscope, Search, Calendar, ArrowRight } from 'lucide-react';

interface MedisCaseListProps {
  mode: 'active' | 'history';
  isReadOnly: boolean;
  filteredCases: PermohonanAsesmen[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCase: (item: PermohonanAsesmen) => void;
}

export const MedisCaseList: React.FC<MedisCaseListProps> = ({
  mode,
  isReadOnly,
  filteredCases,
  searchQuery,
  setSearchQuery,
  onOpenCase
}) => {
  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-[#d4af37]" />
            <span>{mode === 'history' ? 'Riwayat Asesmen Medis TAT' : 'Asesmen Medis & Psikiatri TAT'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'history'
              ? 'Daftar berkas perkara yang telah selesai dilakukan asesmen medis & psikologis dan telah difinalisasi.'
              : 'Daftar berkas perkara aktif yang ditugaskan untuk pemeriksaan medis, uji urine laboratorium, dan skoring WHO ASSIST.'}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="self-start sm:self-auto">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            mode === 'history'
              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50'
              : 'bg-[#142642] text-[#d4af37] border-[#234475]'
          }`}>
            {filteredCases.length} {mode === 'history' ? 'Berkas Selesai' : 'Tugas Aktif'}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama terperiksa, nomor TAT, NIK..."
          className="w-full bg-[#0b172a] border border-[#1b3459] text-white pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#d4af37] transition-colors"
        />
      </div>

      {/* Cases Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredCases.length === 0 ? (
          <div className="text-center py-10 bg-[#0b172a] border border-[#1b3459] rounded-xl text-slate-400 text-xs">
            {isReadOnly
              ? 'Belum ada riwayat asesmen medis yang difinalisasi.'
              : 'Tidak ada tugas asesmen medis aktif yang perlu diperiksa.'}
          </div>
        ) : (
          filteredCases.map(item => {
            const hasMedis = (item.asesmenMedis && item.asesmenMedis.status === 'FINAL') || item.medicalStatus === 'FINAL' || isReadOnly;
            const isDraft = !hasMedis && item.asesmenMedis && item.asesmenMedis.status === 'DRAFT';
            const jadwalSesi = item.asesmenMedis?.tanggalPemeriksaan || `${item.tanggalPengajuan} • 10:00 WITA`;
            const bbSummary = item.perkara.barangBuktiList.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ') || 'Tanpa BB';

            return (
              <div
                key={item.id}
                onClick={() => onOpenCase(item)}
                className="bg-[#0b172a] border border-[#1b3459] hover:border-[#d4af37]/60 rounded-xl p-4 transition-all cursor-pointer shadow-sm hover:shadow-md group space-y-3"
              >
                {/* Row 1: Nomor, Nama, & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-[#d4af37] font-mono shrink-0">
                      {item.nomorPermohonan}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">
                      {item.terperiksa.namaLengkap} <span className="text-xs font-normal text-slate-400">({item.terperiksa.usia} th)</span>
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto shrink-0 ${
                    hasMedis || isReadOnly
                      ? 'bg-blue-950/60 text-blue-300 border-blue-600/40'
                      : isDraft
                      ? 'bg-amber-950/60 text-amber-300 border-amber-600/40'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                  }`}>
                    {hasMedis || isReadOnly ? 'Selesai (Final)' : isDraft ? 'Draf Disimpan' : 'Aktif (Belum Diperiksa)'}
                  </span>
                </div>

                {/* Row 2: Perkara & BB Details */}
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Instansi: <strong className="text-slate-300 font-normal">{item.instansiPengaju}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Penyidik: <strong className="text-slate-300 font-normal">{item.perkara.namaPenyidik}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>BB: <strong className="text-slate-200 font-medium">{bbSummary}</strong></span>
                </div>

                {/* Row 3: Jadwal & Action Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-[#1b3459]/60 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Jadwal Pemeriksaan: <strong className="text-slate-200 font-semibold">{jadwalSesi}</strong></span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Ruang Medis / Poliklinik</span>
                  </div>

                  <div className="text-[#d4af37] font-semibold text-xs flex items-center space-x-1 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>{hasMedis || isReadOnly ? 'Buka Rekam Medis (Arsip)' : isDraft ? 'Lanjutkan Draf' : 'Mulai Asesmen Medis'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
