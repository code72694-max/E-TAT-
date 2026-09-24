import React from 'react';
import { PermohonanAsesmen } from '../types';
import { ShieldCheck, CheckCircle2, QrCode, X, ExternalLink, Lock } from 'lucide-react';

interface ModalVerifikasiQRProps {
  permohonan: PermohonanAsesmen | null;
  onClose: () => void;
}

export const ModalVerifikasiQR: React.FC<ModalVerifikasiQRProps> = ({
  permohonan,
  onClose
}) => {
  if (!permohonan || !permohonan.rekomendasiResmi) return null;

  const rek = permohonan.rekomendasiResmi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="bg-[#0b172a] rounded-2xl max-w-lg w-full overflow-hidden border border-[#1b3459] shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="bg-[#081224] border-b border-[#1b3459] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-['Cinzel',serif]">Verifikasi Keabsahan Dokumen e-TAT</h3>
              <p className="text-[11px] text-slate-400">Sistem Validasi Publik Tanda Tangan Elektronik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Body */}
        <div className="p-6 space-y-4">
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300">DOKUMEN DINYATAKAN ASLI & VALID</h4>
              <p className="text-[11px] text-emerald-400/90 mt-0.5">
                Tercatat resmi dalam pangkalan data Tim Asesmen Terpadu Provinsi Jawa Barat.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#1b3459]">
              <span className="text-slate-400">Nomor Surat Rekomendasi</span>
              <span className="font-mono font-bold text-[#F1C40F]">{rek.nomorSurat}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1b3459]">
              <span className="text-slate-400">Nomor Permohonan</span>
              <span className="font-bold text-white font-mono">{permohonan.nomorPermohonan}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1b3459]">
              <span className="text-slate-400">Nama Terperiksa</span>
              <span className="font-bold text-white">{permohonan.terperiksa.namaLengkap}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1b3459]">
              <span className="text-slate-400">Perkara (No. LP)</span>
              <span className="font-mono text-slate-300">{permohonan.perkara.nomorLaporanPolisi}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1b3459]">
              <span className="text-slate-400">Tanggal Terbit</span>
              <span className="text-slate-300">{rek.tanggalTerbit}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1b3459]">
              <span className="text-slate-400">Simpulan Rekomendasi</span>
              <span className="font-bold text-[#38bdf8] text-right max-w-[240px]">
                {rek.rekomendasiFinalText}
              </span>
            </div>
          </div>

          {/* Privacy Protection Notice from Dokumen 1 Section 7.2 */}
          <div className="bg-[#081224] border border-[#1b3459] rounded-lg p-3 text-[11px] text-slate-300 flex items-start space-x-2">
            <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p>
              <strong className="text-slate-200">Perlindungan Data Pribadi:</strong> Demi privasi medis dan kepatuhan hukum, catatan klinis psikologis dan riwayat medis terperinci tidak ditampilkan pada halaman verifikasi publik ini.
            </p>
          </div>

          {/* Signers summary */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Pejabat Penandatangan:</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {rek.daftarPengesah.map((s, idx) => (
                <div key={idx} className="p-2 bg-[#081224] rounded-lg border border-[#1b3459]">
                  <span className="font-semibold block text-white truncate">{s.nama}</span>
                  <span className="text-slate-400 block truncate">{s.jabatan}</span>
                  <span className="text-emerald-400 font-bold block mt-0.5">✓ TTD Sah Terverifikasi</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#081224] px-6 py-3 border-t border-[#1b3459] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#1b3459] hover:bg-[#284c80] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer border border-[#2d5289]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
