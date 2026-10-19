import React from 'react';
import { PermohonanAsesmen } from '../../types';
import { Scale, Search, Calendar, ArrowRight } from 'lucide-react';

interface HukumCaseListProps {
  filteredCases: PermohonanAsesmen[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isReadOnly: boolean;
  onOpenCase: (item: PermohonanAsesmen) => void;
}

export const HukumCaseList: React.FC<HukumCaseListProps> = ({
  filteredCases,
  searchQuery,
  setSearchQuery,
  isReadOnly,
  onOpenCase,
}) => {
  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Scale className={`w-5 h-5 ${isReadOnly ? 'text-blue-400' : 'text-[#d4af37]'}`} />
            <span>{isReadOnly ? 'Riwayat Asesmen Hukum TAT' : 'Asesmen Hukum & Kriminalistik TAT'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isReadOnly
              ? 'Daftar arsip berkas telaah yuridis yang telah difinalisasi untuk sidang pleno dan rekomendasi akhir.'
              : 'Daftar berkas perkara aktif yang memerlukan penelaahan kualifikasi peran tersangka (SEMA No. 04/2010).'}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="self-start sm:self-auto">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            isReadOnly
              ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
              : 'bg-[#142642] text-[#d4af37] border-[#234475]'
          }`}>
            {isReadOnly ? `${filteredCases.length} Arsip Final` : `${filteredCases.length} Tugas Aktif`}
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
          placeholder="Cari nama terperiksa, nomor TAT, LP, pasal..."
          className="w-full bg-[#0b172a] border border-[#1b3459] text-white pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#d4af37] transition-colors"
        />
      </div>

      {/* Cases Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredCases.length === 0 ? (
          <div className="text-center py-10 bg-[#0b172a] border border-[#1b3459] rounded-xl text-slate-400 text-xs">
            {isReadOnly
              ? 'Belum ada riwayat asesmen hukum yang difinalisasi.'
              : 'Tidak ada tugas asesmen hukum aktif yang perlu ditelaah.'}
          </div>
        ) : (
          filteredCases.map((item) => {
            const hasHukum = (item.asesmenHukum && item.asesmenHukum.status === 'FINAL') || item.legalStatus === 'FINAL' || isReadOnly;
            const isDraft = !hasHukum && item.asesmenHukum && item.asesmenHukum.status === 'DRAFT';
            const jadwalSesi = item.asesmenHukum?.tanggalTelaah || `${item.tanggalPengajuan} • 09:30 WITA`;
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
                    hasHukum || isReadOnly
                      ? 'bg-blue-950/60 text-blue-300 border-blue-600/40'
                      : isDraft
                      ? 'bg-amber-950/60 text-amber-300 border-amber-600/40'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                  }`}>
                    {hasHukum || isReadOnly ? 'Selesai (Final)' : isDraft ? 'Draf Disimpan' : 'Aktif (Belum Ditelaah)'}
                  </span>
                </div>

                {/* Row 2: Perkara & BB Details */}
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>LP: <strong className="text-slate-300 font-normal">{item.perkara.nomorLaporanPolisi}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Pasal: <strong className="text-slate-300 font-normal">{item.perkara.pasalDipersangkakan}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>BB: <strong className="text-slate-200 font-medium">{bbSummary}</strong></span>
                </div>

                {/* Row 3: Jadwal & Action Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-[#1b3459]/60 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Jadwal Sesi: <strong className="text-slate-200 font-semibold">{jadwalSesi}</strong></span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Penyidik: {item.perkara.namaPenyidik}</span>
                  </div>

                  <div className="text-[#d4af37] font-semibold text-xs flex items-center space-x-1 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>{isReadOnly ? 'Buka Arsip (Read-Only)' : isDraft ? 'Lanjutkan Draf' : 'Mulai Telaah'}</span>
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
