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
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FileSignature className="w-5 h-5 text-purple-600" />
            <span>Dokumen Rekomendasi</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dokumenList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <FileSignature className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">Belum ada rekomendasi resmi.</p>
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
                className="bg-white border border-slate-200 hover:border-purple-400 rounded-xl p-5 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">{rek.nomorSurat}</span>
                      <span className="text-xs text-slate-500">• Kasus: {item.nomorPermohonan}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      Terperiksa: {item.terperiksa.namaLengkap} • Tanggal Terbit: {rek.tanggalTerbit}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      rek.isLengkapPengesahan
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {rek.isLengkapPengesahan ? '✓ Sah & Resmi Terbit' : `${signedCount} dari ${totalSigners} Pengesahan`}
                    </span>

                    {rek.buktiPenerimaanPengaju && (
                      <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-full border border-blue-200">
                        ✓ Diterima Penyidik
                      </span>
                    )}

                    <button
                      onClick={() => onOpenQrModal(item)}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
                      title="Buka QR Verifikasi"
                    >
                      <QrCode className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>

              {/* Rekomendasi text preview */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Isi Rekomendasi Terpadu:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{rek.rekomendasiFinalText}</p>
              </div>

              {/* Signers Status Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                {rek.daftarPengesah.map(s => (
                  <div key={s.id} className="p-2 bg-slate-50 rounded border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block truncate">{s.jabatan}</span>
                    <span className="font-bold text-slate-800 block truncate text-[11px] mt-0.5">{s.nama}</span>
                    <span className={`text-[10px] font-bold block mt-1 ${s.status === 'disahkan' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {s.status === 'disahkan' ? '✓ Disahkan' : 'Menunggu TTD'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => onSelectPermohonan(item.id)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5"
                >
                  <span>Lihat Lembar Dokumen & Riwayat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
