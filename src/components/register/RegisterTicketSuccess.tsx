import React from 'react';
import { RegistrasiPengguna } from '../../types';
import { formatOfficerName } from './constants';
import { CheckCircle2, Info, LogIn, UserPlus } from 'lucide-react';

interface RegisterTicketSuccessProps {
  submittedReg: RegistrasiPengguna;
  onGoToLogin: () => void;
  onRegisterNewAccount: () => void;
  onBackToLanding: () => void;
}

export const RegisterTicketSuccess: React.FC<RegisterTicketSuccessProps> = ({
  submittedReg,
  onGoToLogin,
  onRegisterNewAccount,
  onBackToLanding
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-9 h-9 text-[#D4AF37]" />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Status: Pendaftaran Berhasil</span>
          </span>
          <span className="inline-block bg-amber-500/15 border border-amber-500/30 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            Verifikasi: Menunggu Persetujuan Admin
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif]">
          Registrasi Akun Berhasil Diajukan!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Permohonan akun Satuan Wilayah / Penyidik Anda telah tersimpan dan masuk ke sistem antrean verifikasi Administrator PUSDATIN / BNNP Kalimantan Timur.
        </p>
      </div>

      {/* Ticket Card */}
      <div className="bg-[#071325] border border-[#1b3459] rounded-xl p-4 sm:p-5 text-left space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
          <span className="text-slate-400">Nomor Registrasi:</span>
          <span className="text-[#D4AF37] font-bold text-sm">{submittedReg.nomorRegistrasi}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500 block">Nama & Pangkat:</span>
            <span className="text-slate-200 font-semibold">
              {formatOfficerName(submittedReg.pangkat, submittedReg.namaLengkap)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">NRP / NIP Kedinasan:</span>
            <span className="text-slate-200 font-semibold">{submittedReg.nrp}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Jabatan & Sub-Satker:</span>
            <span className="text-slate-200 font-semibold">
              {submittedReg.jabatan} {submittedReg.unitFungsi ? `(${submittedReg.unitFungsi})` : ''}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Satwil / Instansi:</span>
            <span className="text-slate-200 font-semibold">{submittedReg.instansi}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Email Kedinasan (Username):</span>
            <span className="text-slate-200 font-semibold">{submittedReg.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block">No. WhatsApp Aktif:</span>
            <span className="text-slate-200 font-semibold">{submittedReg.phone}</span>
          </div>
          {submittedReg.nomorSprint && (
            <div className="sm:col-span-2">
              <span className="text-slate-500 block">No. Sprint / Surat Tugas:</span>
              <span className="text-[#D4AF37] font-semibold">{submittedReg.nomorSprint}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-[#132847]/50 border border-[#234b7f] rounded-xl p-3.5 flex items-start space-x-3 text-left">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <span className="font-bold text-white block">Petunjuk Lanjutan:</span>
          <p>
            1. Administrator akan memverifikasi Foto KTP, KTA, dan keabsahan Surat Tugas dalam kurun waktu <strong>1x24 jam kerja</strong>.
          </p>
          <p>
            2. Setelah status disetujui, Anda dapat langsung masuk melalui menu login menggunakan Email Kedinasan dan Kata Sandi yang telah Anda buat.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onGoToLogin}
          className="w-full sm:w-auto bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs px-6 py-2.5 rounded-xl border border-[#235594] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
        >
          <LogIn className="w-4 h-4 text-[#D4AF37]" />
          <span>Buka Halaman Login</span>
        </button>
        <button
          onClick={onRegisterNewAccount}
          className="w-full sm:w-auto bg-[#1b3459]/70 hover:bg-[#1b3459] text-[#D4AF37] hover:text-white font-semibold text-xs px-5 py-2.5 rounded-xl border border-[#D4AF37]/30 transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Daftarkan Akun Baru Lainnya</span>
        </button>
        <button
          onClick={onBackToLanding}
          className="w-full sm:w-auto bg-[#071325] hover:bg-[#0d1f38] text-slate-300 hover:text-white font-semibold text-xs px-5 py-2.5 rounded-xl border border-[#1b3459] transition-all cursor-pointer"
        >
          <span>Kembali ke Beranda Utama</span>
        </button>
      </div>
    </div>
  );
};
