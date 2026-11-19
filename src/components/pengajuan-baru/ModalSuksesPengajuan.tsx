import React from 'react';
import { PermohonanAsesmen } from '../../types';
import { CheckCircle2, FileText, ArrowRight, X, Clock, ShieldCheck, Mail } from 'lucide-react';

interface ModalSuksesPengajuanProps {
  isOpen: boolean;
  permohonan: PermohonanAsesmen | null;
  onClose: () => void;
}

export const ModalSuksesPengajuan: React.FC<ModalSuksesPengajuanProps> = ({
  isOpen,
  permohonan,
  onClose,
}) => {
  if (!isOpen || !permohonan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white animate-in zoom-in-95 duration-150 ring-1 ring-emerald-500/20">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-[#1b3459]">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Permohonan Berhasil Diajukan!</h3>
              <p className="text-xs text-slate-400 mt-0.5">Berkas perkara resmi masuk ke antrean verifikasi Sekretariat TAT</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#142642] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ringkasan Berkas Card */}
        <div className="bg-[#071326] border border-[#1b3459] rounded-xl p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]/60">
            <span className="text-slate-400">Nomor Registrasi Permohonan:</span>
            <span className="font-mono font-bold text-sm text-[#D4AF37]">{permohonan.nomorPermohonan}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
            <div>
              <span className="text-slate-400 block">Nama Terperiksa:</span>
              <span className="text-white font-semibold">{permohonan.terperiksa?.namaLengkap || '-'}</span>
              {permohonan.terperiksa?.nik && (
                <span className="text-slate-400 block font-mono text-[10px]">NIK: {permohonan.terperiksa.nik}</span>
              )}
            </div>

            <div>
              <span className="text-slate-400 block">Nomor Laporan Polisi:</span>
              <span className="text-white font-semibold">{permohonan.perkara?.nomorLaporanPolisi || '-'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#1b3459]/40">
            <div>
              <span className="text-slate-400 block">Satuan Kerja Tujuan:</span>
              <span className="text-slate-200">{permohonan.satuanKerjaTujuan || 'Sekretariat TAT'}</span>
            </div>

            <div>
              <span className="text-slate-400 block">Status Alur Berkas:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                Menunggu Verifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Info Alur Selanjutnya & SOP SLA */}
        <div className="bg-[#050f1d] border border-sky-950/60 rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-start space-x-2.5 text-slate-300 leading-relaxed text-[11px]">
            <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              <strong>Kendali SLA (Maksimal 6 Hari):</strong> Sekretariat TAT akan memvalidasi keabsahan berkas formil. Jika seluruh berkas sesuai, jadwal pemeriksaan medis &amp; telaah hukum akan segera diterbitkan.
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-emerald-300/90 pt-1 border-t border-slate-800/60">
            <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tanda bukti penerimaan &amp; rincian registrasi telah dikirimkan ke email terdaftar Anda.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-[#1b3459]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#AA7C11] hover:brightness-110 active:scale-95 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20 border border-[#FFF2B2]/30"
          >
            <span>Selesai &amp; Buka Beranda Dashboard</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
