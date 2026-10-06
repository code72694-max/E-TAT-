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
  UserPlus,
  Clock,
  XCircle,
  Loader2,
  ShieldCheck
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
      // 1. Call real backend login endpoint
      const response = await authApi.login(inputClean, passClean);
      
      if (response.success && response.data?.accessToken) {
        // 2. Fetch authenticated profile directly from DB via /api/auth/me
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
      // Check if matching pending or rejected registration for informative message
      const matchedReg = registrations.find(
        r => r.email.toLowerCase() === inputClean || r.nrp.toLowerCase() === inputClean
      );

      if (matchedReg && matchedReg.status === 'pending') {
        setLoginNotice({
          type: 'pending',
          title: 'Akun Menunggu Persetujuan Admin',
          message: `Permohonan akun untuk ${matchedReg.pangkat} ${matchedReg.namaLengkap} (${matchedReg.instansi}) masih dalam proses verifikasi oleh Admin Sekretariat TAT.`
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
    <div className="min-h-screen bg-[#071325] text-slate-100 flex flex-col antialiased selection:bg-[#D4AF37] selection:text-slate-950 font-sans">
      {/* Top Header Bar */}
      <header className="bg-[#071325]/95 border-b border-[#1b3459] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5 border border-[#1b3459]/60 sm:border-transparent"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs">Kembali ke Beranda</span>
        </button>

        {onGoToRegister && (
          <button
            onClick={onGoToRegister}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D4AF37] hover:text-[#F3E5AB] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-[#D4AF37]/30"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Registrasi Akun Satwil</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Card Header & Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#142642] border border-[#234475] shadow-lg mb-1">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-['Cinzel',serif]">
              LOGIN SISTEM E-TAT
            </h1>
            <p className="text-xs text-slate-400">
              Portal Otentikasi Terpadu Tim Asesmen & Satuan Kerja Kedinasan
            </p>
          </div>

          {/* Alert Notice if Pending / Rejected / Error */}
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

          {/* Clean Authentication Card */}
          <div className="bg-[#0b172a] rounded-2xl border border-[#1b3459] p-6 sm:p-8 shadow-2xl space-y-5">
            {/* Credential Inputs Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Email Kedinasan / Akun Terdaftar
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
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
                    className="w-full bg-[#081224] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={e => {
                      setPasswordInput(e.target.value);
                      setLoginNotice(null);
                    }}
                    placeholder="Masukkan kata sandi..."
                    className="w-full bg-[#081224] text-white pl-10 pr-10 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] placeholder-slate-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
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

              {/* Clean Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#142642] hover:bg-[#1b3459] disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#234475] shadow-md hover:border-[#D4AF37]/50 mt-2"
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

            {/* Link to Registration */}
            {onGoToRegister && (
              <div className="pt-4 border-t border-[#1b3459] text-center">
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
        </div>
      </main>
    </div>
  );
};



