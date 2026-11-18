import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { UserProfile, RegistrasiPengguna } from '../types';
import { authApi, registrasiApi } from '../services/api';
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
      // 1. Cek dari daftar registrations props
      let matchedReg = registrations.find(
        r => r.email.toLowerCase() === inputClean || r.nrp.toLowerCase() === inputClean
      );

      // 2. Jika tidak ada di props, cek dari localStorage
      if (!matchedReg) {
        try {
          const savedStr = localStorage.getItem('etat_last_registration');
          if (savedStr) {
            const parsed = JSON.parse(savedStr);
            if (
              parsed?.email?.toLowerCase() === inputClean ||
              parsed?.nrp?.toLowerCase() === inputClean
            ) {
              matchedReg = parsed;
            }
          }
        } catch {
          // ignore
        }
      }

      // 3. Jika belum ditemukan, periksa langsung ke backend status registrasi
      if (!matchedReg) {
        try {
          const checkRes = await registrasiApi.checkStatus(inputClean);
          if (checkRes && checkRes.data) {
            matchedReg = checkRes.data;
          }
        } catch {
          // ignore
        }
      }

      if (matchedReg && matchedReg.status === 'pending') {
        // Simpan ke localStorage agar RegisterPage langsung menampilkan data tiket & status menunggu verifikasi
        try {
          localStorage.setItem('etat_last_registration', JSON.stringify(matchedReg));
        } catch {
          // ignore
        }

        setLoginNotice({
          type: 'pending',
          title: 'Akun Menunggu Persetujuan Admin',
          message: `Permohonan akun untuk ${matchedReg.pangkat || ''} ${matchedReg.namaLengkap} (${matchedReg.instansi}) masih dalam proses verifikasi oleh Admin Sekretariat TAT. Mengalihkan ke bukti pendaftaran...`
        });

        // Alihkan otomatis setelah jeda singkat (1.2 detik) ke halaman pendaftaran/tiket
        setTimeout(() => {
          if (onGoToRegister) {
            onGoToRegister();
          }
        }, 1200);
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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse?.access_token) {
        setLoginNotice({
          type: 'error',
          title: 'Login Google Gagal',
          message: 'Akses token otentikasi Google tidak diterima.'
        });
        return;
      }

      setIsLoading(true);
      setLoginNotice(null);

      try {
        const response = await authApi.googleLogin({ accessToken: tokenResponse.access_token });
        if (response.success && response.data?.accessToken) {
          const meRes = await authApi.getMe();
          if (meRes.success && meRes.data) {
            onLogin(meRes.data);
          } else {
            throw new Error('Gagal memuat profil pengguna dari server.');
          }
        } else {
          throw new Error(response.message || 'Login dengan Google gagal.');
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Akun Google Anda tidak diizinkan masuk.';
        const isPending =
          errorMsg.toLowerCase().includes('menunggu verifikasi') ||
          errorMsg.toLowerCase().includes('masih menunggu');
        const isRejected = errorMsg.toLowerCase().includes('ditolak');

        setLoginNotice({
          type: isPending ? 'pending' : isRejected ? 'rejected' : 'error',
          title: isPending
            ? 'Akun Menunggu Persetujuan Admin'
            : isRejected
            ? 'Pendaftaran Akun Ditolak'
            : 'Akses Ditolak',
          message: errorMsg
        });

        if (isPending && onGoToRegister) {
          setTimeout(() => {
            onGoToRegister();
          }, 1500);
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setLoginNotice({
        type: 'error',
        title: 'Google Login Dibatalkan',
        message: 'Jendela login Google ditutup atau otentikasi dibatalkan.'
      });
    }
  });

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
            {loginNotice.type === 'pending' && onGoToRegister && (
              <button
                type="button"
                onClick={onGoToRegister}
                className="mt-2 w-full py-2 px-3 bg-[#D4AF37] hover:bg-[#c59e2b] text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow"
              >
                <span>Buka Bukti & Keterangan Pendaftaran Sekarang</span>
              </button>
            )}
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
                  placeholder="contoh: nama@email.com"
                  className="w-full bg-[#081224] focus:bg-[#0c1c34] text-slate-100 focus:text-white pl-10 pr-3.5 py-3 rounded-xl border border-[#1b3459] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 text-xs sm:text-[13px] outline-none placeholder-slate-500 transition-all shadow-inner"
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
                  className="w-full bg-[#081224] focus:bg-[#0c1c34] text-slate-100 focus:text-white pl-10 pr-10 py-3 rounded-xl border border-[#1b3459] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 text-xs sm:text-[13px] outline-none placeholder-slate-500 transition-all font-mono shadow-inner"
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

            {/* Forgot Password */}
            <div className="flex items-center justify-end text-xs pt-0.5">
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
              className="w-full bg-[#1a3a68] hover:bg-[#214a84] active:bg-[#163158] disabled:opacity-50 text-white font-medium text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#2b5999] shadow-md hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(33,74,132,0.4)] mt-3"
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

          {/* Divider ATAU */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-[#1b3459] w-full" />
            <span className="bg-[#0b172a] px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              atau
            </span>
            <div className="border-t border-[#1b3459] w-full" />
          </div>

          {/* Tombol Masuk dengan Google Sesuai Tema */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => loginWithGoogle()}
            className="w-full bg-[#081224] hover:bg-[#0c1c34] active:bg-[#060e1a] text-slate-200 hover:text-white font-medium text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center space-x-2.5 transition-all cursor-pointer border border-[#1b3459] hover:border-[#D4AF37] shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk dengan Google</span>
          </button>

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
