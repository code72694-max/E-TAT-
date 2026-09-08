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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Verifikasi Keabsahan Dokumen e-TAT</h3>
              <p className="text-[11px] text-slate-300">Sistem Validasi Publik Tanda Tangan Elektronik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Body */}
        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-950">DOKUMEN DINYATAKAN ASLI & VALID</h4>
              <p className="text-[11px] text-emerald-800">
                Tercatat resmi dalam pangkalan data Tim Asesmen Terpadu Provinsi Jawa Barat.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Nomor Surat Rekomendasi</span>
              <span className="font-mono font-bold text-slate-900">{rek.nomorSurat}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Nomor Permohonan</span>
              <span className="font-bold text-slate-800">{permohonan.nomorPermohonan}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Nama Terperiksa</span>
              <span className="font-bold text-slate-900">{permohonan.terperiksa.namaLengkap}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Perkara (No. LP)</span>
              <span className="font-mono text-slate-700">{permohonan.perkara.nomorLaporanPolisi}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Tanggal Terbit</span>
              <span className="text-slate-800">{rek.tanggalTerbit}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Simpulan Rekomendasi</span>
              <span className="font-bold text-blue-900 text-right max-w-[240px]">
                {rek.rekomendasiFinalText}
              </span>
            </div>
          </div>

          {/* Privacy Protection Notice from Dokumen 1 Section 7.2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 flex items-start space-x-2">
            <Lock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <p>
              <strong>Perlindungan Data Pribadi:</strong> Demi privasi medis dan kepatuhan hukum, catatan klinis psikologis dan riwayat medis terperinci tidak ditampilkan pada halaman verifikasi publik ini.
            </p>
          </div>

          {/* Signers summary */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase">Pejabat Penandatangan:</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {rek.daftarPengesah.map((s, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-semibold block text-slate-800 truncate">{s.nama}</span>
                  <span className="text-slate-500 block truncate">{s.jabatan}</span>
                  <span className="text-emerald-600 font-bold block mt-0.5">✓ TTD Sah Terverifikasi</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
