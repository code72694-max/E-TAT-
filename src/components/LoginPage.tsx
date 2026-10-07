import React, { useState } from 'react';
import { UserProfile, RegistrasiPengguna } from '../types';
import { authApi } from '../services/api';
import {
  ArrowLeft,
  LogIn,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
  onBackToLanding: () => void;
  onGoToRegister?: () => void;
  users?: UserProfile[];
  registrations?: RegistrasiPengguna[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onBackToLanding,
  onGoToRegister,
  registrations = []
}) => {
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginNotice, setLoginNotice] = useState<{
    type: 'pending' | 'rejected' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginNotice(null);

    const inputClean = emailInput.trim().toLowerCase();
    const passClean = passwordInput.trim();

    if (!inputClean || !passClean) {
      setLoginNotice({
        type: 'error',
        title: 'Form Belum Lengkap',
        message: 'Silakan masukkan email kedinasan/NRP dan kata sandi Anda.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login(inputClean, passClean);
      
      if (response.success && response.data?.accessToken) {
        const meRes = await authApi.getMe();
        if (meRes.success && meRes.data) {
          onLogin(meRes.data);
        } else {
          throw new Error('Gagal memuat profil pengguna dari server.');
        }
      } else {
        throw new Error(response.message || 'Login gagal.');
      }
    } catch (err: any) {
      const matchedReg = registrations.find(
        r => r.email.toLowerCase() === inputClean || r.nrp.toLowerCase() === inputClean
      );

      if (matchedReg && matchedReg.status === 'pending') {
        setLoginNotice({
          type: 'pending',
          title: 'Akun Menunggu Persetujuan Admin',
          message: `Permohonan akun untuk ${matchedReg.pangkat || ''} ${matchedReg.namaLengkap} (${matchedReg.instansi}) masih dalam proses verifikasi oleh Admin Sekretariat TAT.`
        });
      } else if (matchedReg && matchedReg.status === 'rejected') {
        setLoginNotice({
          type: 'rejected',
          title: 'Pendaftaran Akun Ditolak',
          message: `Pendaftaran akun ditolak oleh Admin. Alasan: ${matchedReg.catatanAdmin || 'Dokumen persyaratan belum lengkap.'}`
        });
      } else {
        setLoginNotice({
          type: 'error',
          title: 'Gagal Masuk ke Sistem',
          message: err.message || 'Email atau kata sandi tidak valid. Pastikan kredensial benar.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#071325] text-slate-100 flex items-center justify-center md:justify-start px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 py-8 sm:py-12 relative overflow-hidden antialiased selection:bg-[#D4AF37] selection:text-slate-950 font-sans">
      
      {/* Background Foto kantor.png: Fokus Pojok Kanan & Blur Full di Mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/kantor.png"
          alt="Gedung Presisi POLRI"
          className="w-full h-full object-cover object-[85%_center] md:object-right filter brightness-[0.55] md:brightness-[0.6] contrast-[1.05]"
        />
        {/* Full Screen Blur Khusus Layar Mobile (< md) agar form tetap jelas */}
        <div className="absolute inset-0 backdrop-blur-md md:backdrop-blur-none bg-[#071325]/75 md:bg-transparent" />
        
        {/* Gradasi Siluet Kiri ke Kanan untuk Layar Desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071325] via-[#071325]/85 md:via-[#071325]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071325]/90 via-transparent to-[#071325]/50" />
      </div>

      {/* Container Form Login di Sisi Kiri (Tengah di Mobile) */}
      <div className="w-full max-w-[440px] space-y-7 relative z-10 my-auto">
        
        {/* Header: Logo Tanpa Border & Judul Sebaris Rata Kiri */}
        <div className="flex items-center space-x-4 text-left">
          <img
            src="/logo_etat.png"
            alt="Logo E-TAT POLRI"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xl shrink-0"
          />
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-normal font-['Roboto',sans-serif] leading-tight">
              LOGIN SISTEM E-TAT
            </h1>
            <p className="text-xs text-slate-400 leading-snug">
              Portal Otentikasi Terpadu Tim Asesmen & Satuan Kerja
            </p>
          </div>
        </div>

        {/* Alert Notice jika ada error / status akun */}
        {loginNotice && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-1.5 animate-in fade-in duration-200 ${
              loginNotice.type === 'pending'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center space-x-2 font-bold">
              {loginNotice.type === 'pending' ? (
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{loginNotice.title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">{loginNotice.message}</p>
          </div>
        )}

        {/* Form Card Lebih Tinggi & Luas */}
        <div className="bg-[#0b172a]/95 rounded-2xl border border-[#1b3459] p-8 sm:p-9 shadow-2xl backdrop-blur-md space-y-6">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Email Kedinasan / Akun Terdaftar
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={emailInput}
                  onChange={e => {
                    setEmailInput(e.target.value);
                    setLoginNotice(null);
                  }}
                  placeholder="nama@polri.go.id / satwil"
                  className="w-full bg-[#081224] text-white pl-10 pr-3.5 py-3 rounded-xl border border-[#1b3459] text-xs sm:text-[13px] focus:outline-none focus:border-[#D4AF37] placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={e => {
                    setPasswordInput(e.target.value);
                    setLoginNotice(null);
                  }}
                  placeholder="Masukkan kata sandi..."
                  className="w-full bg-[#081224] text-white pl-10 pr-10 py-3 rounded-xl border border-[#1b3459] text-xs sm:text-[13px] focus:outline-none focus:border-[#D4AF37] placeholder-slate-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center space-x-2 text-slate-400 hover:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#1b3459] bg-[#081224] text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Ingat perangkat ini</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  alert('Untuk reset kata sandi, silakan hubungi Administrator Sekretariat TAT.')
                }
                className="text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer text-xs"
              >
                Lupa sandi?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#142642] hover:bg-[#1b3459] disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#234475] shadow-md hover:border-[#D4AF37]/50 mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#D4AF37]" />
                  <span>Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          {onGoToRegister && (
            <div className="pt-5 border-t border-[#1b3459] text-center">
              <p className="text-xs text-slate-400">
                Belum memiliki akun kedinasan Satwil?{' '}
                <button
                  onClick={onGoToRegister}
                  className="text-[#D4AF37] hover:underline font-bold inline-flex items-center space-x-1 cursor-pointer"
                >
                  <span>Daftar Akun Baru</span>
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Tombol Kembali ke Beranda (Di bawah Container Form) */}
        <div className="text-center pt-1">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer px-4 py-2.5 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

      </div>

    </div>
  );
};
