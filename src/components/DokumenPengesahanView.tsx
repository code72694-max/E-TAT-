import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { FileSignature, CheckCircle2, Clock, QrCode, ArrowRight, Download, ShieldCheck } from 'lucide-react';

interface DokumenPengesahanViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onOpenQrModal: (permohonan: PermohonanAsesmen) => void;
}

export const DokumenPengesahanView: React.FC<DokumenPengesahanViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onOpenQrModal
}) => {
  const isPengaju = currentUser.role === 'pengaju';

  const dokumenList = permohonanList.filter(p => {
    if (!p.rekomendasiResmi) return false;
    if (isPengaju) {
      // Pengaju only views recommendations for their own submissions that are ready or in progress
      const matchesPengaju =
        p.pengajuNama.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        p.instansiPengaju.toLowerCase().includes(currentUser.instansi.toLowerCase());
      return matchesPengaju;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <FileSignature className="w-5 h-5 text-[#38bdf8]" />
            <span>Dokumen Rekomendasi Terpadu & TTE QR Presisi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Penerbitan surat rekomendasi resmi berkekuatan hukum, tanda tangan elektronik terpadu 3 pihak, dan verifikasi barcode.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dokumenList.length === 0 ? (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-12 text-center text-slate-400 shadow-lg shadow-black/20">
            <FileSignature className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">Belum ada rekomendasi resmi.</p>
            <p className="text-xs text-slate-400 mt-0.5">Surat rekomendasi diterbitkan setelah sidang pleno dan pengesahan selesai.</p>
          </div>
        ) : (
          dokumenList.map(item => {
            const rek = item.rekomendasiResmi!;
            const signedCount = rek.daftarPengesah.filter(s => s.status === 'disahkan').length;
            const totalSigners = rek.daftarPengesah.length;

            return (
              <div
                key={item.id}
                className="bg-[#0b172a] border border-[#1b3459] hover:border-[#38bdf8] rounded-xl p-5 transition-all space-y-4 shadow-lg shadow-black/20 group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] font-mono transition-colors">{rek.nomorSurat}</span>
                      <span className="text-xs text-slate-400">• Kasus: <span className="text-[#38bdf8]">{item.nomorPermohonan}</span></span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">
                      Terperiksa: {item.terperiksa.namaLengkap} • Tanggal Terbit: <span className="font-mono text-slate-300">{rek.tanggalTerbit}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      rek.isLengkapPengesahan
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {rek.isLengkapPengesahan ? '✓ Sah & Resmi Terbit' : `${signedCount} dari ${totalSigners} Pengesahan`}
                    </span>

                    {rek.buktiPenerimaanPengaju && (
                      <span className="text-xs bg-[#1b3459] text-sky-200 font-bold px-2.5 py-1 rounded-full border border-[#2d5289]">
                        ✓ Diterima Penyidik
                      </span>
                    )}

                    <button
                      onClick={() => onOpenQrModal(item)}
                      className="p-2 border border-[#1b3459] bg-[#081224] rounded-lg hover:bg-[#112340] text-slate-200 cursor-pointer transition-colors"
                      title="Buka QR Verifikasi"
                    >
                      <QrCode className="w-4 h-4 text-[#38bdf8]" />
                    </button>
                  </div>
                </div>

              {/* Rekomendasi text preview */}
              <div className="p-3 bg-[#081224] rounded-lg border border-[#1b3459] text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Isi Rekomendasi Terpadu:</span>
                <p className="font-semibold text-white mt-0.5">{rek.rekomendasiFinalText}</p>
              </div>

              {/* Signers Status Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1b3459] text-xs">
                {rek.daftarPengesah.map(s => (
                  <div key={s.id} className="p-2 bg-[#081224] rounded-lg border border-[#1b3459] text-center">
                    <span className="text-[10px] text-slate-400 block truncate">{s.jabatan}</span>
                    <span className="font-bold text-slate-200 block truncate text-[11px] mt-0.5">{s.nama}</span>
                    <span className={`text-[10px] font-bold block mt-1 ${s.status === 'disahkan' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {s.status === 'disahkan' ? '✓ Disahkan' : 'Menunggu TTD'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => onSelectPermohonan(item.id)}
                  className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 border border-[#2d7ad6]/70 shadow-sm cursor-pointer transition-all"
                >
                  <span>Lihat Lembar Dokumen & Riwayat</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F1C40F]" />
                </button>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
