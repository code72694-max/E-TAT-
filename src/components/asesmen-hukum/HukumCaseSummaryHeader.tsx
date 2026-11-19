import React, { useState } from 'react';
import { PermohonanAsesmen } from '../../types';
import { Scale, Package, Stethoscope, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';

interface HukumCaseSummaryHeaderProps {
  selectedCase: PermohonanAsesmen;
  isReadOnlyView: boolean;
  onOpenDokumenModal: () => void;
  onCloseCase?: () => void;
}

export const HukumCaseSummaryHeader: React.FC<HukumCaseSummaryHeaderProps> = ({
  selectedCase,
  isReadOnlyView,
  onOpenDokumenModal,
}) => {
  const [showDetailPerkara, setShowDetailPerkara] = useState<boolean>(false);
  const medis = selectedCase.asesmenMedis;
  const isMedisFinal = medis?.status === 'FINAL' || selectedCase.medicalStatus === 'FINAL';

  return (
    <div className="space-y-3">
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-[#142642] text-[#d4af37] rounded-lg border border-[#234475]">
              <Scale className="w-4 h-4 text-[#d4af37]" />
            </div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Lembar Telaah Yuridis Asesmen Hukum TAT {isReadOnlyView && <span className="text-blue-400 font-normal">(Riwayat / Selesai)</span>}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowDetailPerkara(!showDetailPerkara)}
              className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] border border-[#234475] rounded-xl text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Detail Kasus</span>
              {showDetailPerkara ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={onOpenDokumenModal}
              className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] border border-[#234475] rounded-xl text-xs font-bold text-white flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lihat Dokumen &amp; BB</span>
            </button>
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
              isReadOnlyView
                ? 'bg-blue-950/60 text-blue-300 border-blue-500/50'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
            }`}>
              {isReadOnlyView ? 'RIWAYAT / FINAL' : 'AKTIF / DRAFT'}
            </span>
          </div>
        </div>

        {/* Subject Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="md:col-span-2 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-[#d4af37]">{selectedCase.nomorPermohonan}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#142642] text-slate-200 border border-[#234475]">
                LP: {selectedCase.perkara.nomorLaporanPolisi}
              </span>
            </div>
            <p className="text-base font-bold text-white leading-tight mt-1">{selectedCase.terperiksa.namaLengkap}</p>
            <p className="text-slate-400 text-[11px]">
              NIK: <span className="font-mono text-slate-200">{selectedCase.terperiksa.nik}</span> • Usia: {selectedCase.terperiksa.usia} th • Pasal: <span className="text-amber-300 font-mono">{selectedCase.perkara.pasalDipersangkakan}</span>
            </p>
          </div>

          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1b3459] md:pl-4 pt-2 md:pt-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Penyidik Satuan:</span>
            <p className="font-semibold text-white truncate">{selectedCase.perkara.namaPenyidik}</p>
            <p className="text-[11px] text-slate-400 truncate">{selectedCase.perkara.instansiPenyidik}</p>
          </div>

          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1b3459] md:pl-4 pt-2 md:pt-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Barang Bukti Sitaan:</span>
            <div className="space-y-0.5">
              {selectedCase.perkara.barangBuktiList.map((bb, i) => (
                <p key={i} className="text-[11px] text-slate-200 font-semibold truncate">
                  • {bb.jenisZat} {bb.beratBersihGram} gram ({bb.statusKategoriBb})
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Detail Perkara Awal */}
        {showDetailPerkara && (
          <div className="pt-3 border-t border-[#1b3459] bg-[#050e1c] p-3.5 rounded-xl space-y-2 text-xs animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tempat Kejadian Perkara (TKP)</span>
                <span className="text-slate-200 text-[11px]">{selectedCase.perkara.tempatKejadianPerkara || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Waktu Penangkapan</span>
                <span className="text-slate-200 text-[11px] font-mono">{selectedCase.perkara.tanggalWaktuPenangkapan || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kontak Penyidik</span>
                <span className="text-slate-200 text-[11px] font-mono">{selectedCase.perkara.nomorHpPenyidik || '-'}</span>
              </div>
            </div>
            {selectedCase.perkara.kronologiSingkat && (
              <div className="pt-2 border-t border-[#1b3459]/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Kronologi Singkat Penangkapan:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed italic bg-[#081224] p-2.5 rounded-lg border border-[#1b3459]/40">
                  "{selectedCase.perkara.kronologiSingkat}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* HASIL ASESMEN MEDIS REFERENCE CARD FOR HUKUM */}
      {isMedisFinal && medis && (
        <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/40 rounded-2xl p-4 shadow-md text-xs space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-emerald-200 text-xs uppercase tracking-wider">
                Rujukan Hasil Asesmen Medis TAT (Selesai Difinalisasi)
              </h4>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Medis Siap untuk Pleno</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-slate-400 text-[10px] block">Dokter Pemeriksa:</span>
              <span className="font-semibold text-white">{medis.asesorNama || selectedCase.timAsesmen?.asesorMedisNama || 'Dokter Asesor Medis'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Diagnosis ICD-10:</span>
              <span className="font-bold text-amber-300">{medis.diagnosisKlinisIcd || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Tingkat Ketergantungan (ASSIST):</span>
              <span className="font-semibold text-slate-200">{medis.tingkatRisikoInstrumen || '-'} (Skor: {medis.skorInstrumen ?? '-'})</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Rekomendasi Medis:</span>
              <span className="font-bold text-emerald-300">{medis.kebutuhanRawat || '-'} {medis.durasiUsulanBulan ? `(${medis.durasiUsulanBulan} Bulan)` : ''}</span>
            </div>
          </div>

          {medis.catatanKhusus && (
            <div className="pt-1.5 border-t border-emerald-500/20 text-[11px] text-slate-300">
              <span className="text-slate-400 font-semibold mr-1">Catatan Medis untuk Pleno:</span>
              <span>{medis.catatanKhusus}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
