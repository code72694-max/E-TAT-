import React from 'react';
import { getDocTemplates } from './types';

interface Step5KonfirmasiPengajuanProps {
  namaLengkap: string;
  nik: string;
  statusResidivis: 'bukan_residivis' | 'residivis_1x' | 'residivis_berulang';
  nomorLp: string;
  pasal: string;
  barangBuktiCount: number;
  uploadedDocIds: string[];
  jenisPengajuan: string;
  agencyName: string;
}

export const Step5KonfirmasiPengajuan: React.FC<Step5KonfirmasiPengajuanProps> = ({
  namaLengkap,
  nik,
  statusResidivis,
  nomorLp,
  pasal,
  barangBuktiCount,
  uploadedDocIds,
  jenisPengajuan,
  agencyName,
}) => {
  const docTemplates = getDocTemplates(jenisPengajuan);
  const uploadedCount = uploadedDocIds.filter((id) =>
    docTemplates.some((d) => d.id === id)
  ).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-5">
        <h4 className="font-bold text-slate-200 text-base mb-1 font-['Cinzel',serif]">
          Konfirmasi Ringkasan Pengajuan
        </h4>
        <p className="text-xs text-[#D4AF37]/90 leading-relaxed">
          Pastikan seluruh data di bawah ini telah sesuai sebelum dikirim ke Sekretariat Tim Asesmen Terpadu (TAT).
        </p>
      </div>

      <div className="border border-[#1b3459] rounded-xl p-5 bg-[#081224] space-y-3 text-xs md:text-sm">
        <div className="flex justify-between py-2 border-b border-[#1b3459]">
          <span className="text-slate-400">Nama Terperiksa</span>
          <span className="font-bold text-white">{namaLengkap || 'Belum diisi'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1b3459]">
          <span className="text-slate-400">Nomor Induk Kependudukan (NIK)</span>
          <span className="font-mono font-bold text-[#D4AF37]">{nik || 'Belum diisi'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1b3459]">
          <span className="text-slate-400">Status Residivisme</span>
          <span
            className={`font-semibold ${
              statusResidivis === 'bukan_residivis' ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {statusResidivis === 'bukan_residivis'
              ? 'Bukan Residivis (Baru)'
              : statusResidivis === 'residivis_1x'
              ? 'Residivis 1x'
              : 'Residivis Berulang'}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1b3459]">
          <span className="text-slate-400">Nomor Laporan Polisi</span>
          <span className="font-mono font-bold text-white">{nomorLp || '-'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1b3459]">
          <span className="text-slate-400">Pasal Sangkaan</span>
          <span className="font-semibold text-[#D4AF37]">{pasal || '-'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1b3459]">
          <span className="text-slate-400">Jumlah Barang Bukti</span>
          <span className="font-semibold text-white font-mono">{barangBuktiCount} Item</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#1b3459]">
          <span className="text-slate-400">Dokumen Dilampirkan</span>
          <span className="font-bold text-[#D4AF37]">
            {uploadedCount} dari {docTemplates.length} Dokumen
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-slate-400">Instansi Pengaju</span>
          <span className="font-semibold text-slate-200">{agencyName || 'Penyidik POLRI'}</span>
        </div>
      </div>
    </div>
  );
};
