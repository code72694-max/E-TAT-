import React, { useState } from 'react';
import { UserProfile, UserRole, RegistrasiPengguna } from '../types';
import { MOCK_USERS } from '../data/initialData';
import { PoliceEmblem } from './PoliceEmblem';
import {
  ArrowLeft,
  LogIn,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
  UserCheck,
  UserPlus,
  AlertCircle,
  Clock,
  XCircle,
  CheckCircle2
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
  users = MOCK_USERS,
  registrations = []
}) => {
  const FOUR_ROLES: UserRole[] = ['pengaju', 'sekretariat', 'hukum', 'medis'];
  
  // Ambil tepat 1 akun untuk masing-masing 4 role: Pengaju, Medis, Hukum, Sekretariat (atau Admin sebagai Sekretariat)
  const loginUsers = FOUR_ROLES.map(role => {
    return users.find(u => u.role === role) || 
           (role === 'sekretariat' ? users.find(u => u.role === 'admin') : undefined);
  }).filter((u): u is UserProfile => Boolean(u));

  const [selectedUserId, setSelectedUserId] = useState<string>(loginUsers[0]?.id || users[0]?.id || '');
  const [emailInput, setEmailInput] = useState(loginUsers[0]?.email || users[0]?.email || '');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginNotice, setLoginNotice] = useState<{
    type: 'pending' | 'rejected' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'pengaju':
        return 'Pengaju';
      case 'medis':
        return 'Medis';
      case 'hukum':
        return 'Hukum';
      case 'sekretariat':
      case 'admin':
        return 'Sekretariat';
      default:
        return 'Sekretariat';
    }
  };

  const handleDropdownChange = (userId: string) => {
    setSelectedUserId(userId);
    setLoginNotice(null);
    const user = users.find(u => u.id === userId);
    if (user) {
      setEmailInput(user.email);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginNotice(null);

    const inputClean = emailInput.trim().toLowerCase();

    // Check if matching a pending or rejected registration
    const matchedReg = registrations.find(
      r => r.email.toLowerCase() === inputClean || r.nrp.toLowerCase() === inputClean
    );

    if (matchedReg) {
      if (matchedReg.status === 'pending') {
        setLoginNotice({
          type: 'pending',
          title: 'Akun Menunggu Persetujuan Admin',
          message: `Permohonan akun untuk ${matchedReg.pangkat} ${matchedReg.namaLengkap} (${matchedReg.instansi}) dengan nomor ${matchedReg.nomorRegistrasi} masih dalam proses verifikasi oleh Administrator BNNP Kaltim.`
        });
        return;
      }
      if (matchedReg.status === 'rejected') {
        setLoginNotice({
          type: 'rejected',
          title: 'Pendaftaran Akun Ditolak',
          message: `Pendaftaran akun ditolak oleh Admin. Alasan: ${matchedReg.catatanAdmin || 'Dokumen KTP/KTA tidak memenuhi persyaratan.'}`
        });
        return;
      }
    }

    // Match in approved / active users
    const matchedUser =
      users.find(u => u.email.toLowerCase() === inputClean) ||
      users.find(u => u.id === selectedUserId) ||
      users[0];

    onLogin(matchedUser);
  };

  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  return (
    <div className="min-h-screen bg-[#071325] text-slate-100 flex flex-col antialiased selection:bg-[#D4AF37] selection:text-slate-950 font-sans">
      {/* Top Header Bar */}
      <header className="bg-[#071325]/95 border-b border-[#1b3459] px-3.5 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
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
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-md space-y-5">
          {/* Card Header & Branding */}
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-['Cinzel',serif]">
              LOGIN SISTEM E-TAT
            </h1>
            <p className="text-xs text-slate-400">Portal Otentikasi Petugas Tim Asesmen Terpadu</p>
          </div>

          {/* Alert Notice if Pending / Rejected */}
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

          {/* Clean Card Surface */}
          <div className="bg-[#0b172a] rounded-2xl border border-[#1b3459] p-4 sm:p-7 shadow-2xl space-y-4">
            {/* Quick Role Preset Picker */}
            <div className="space-y-1.5 pb-4 border-b border-[#1b3459]">
              <label className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Pilih Profil Akun Kedinasan:</span>
                </span>
                <span className="text-[10px] text-[#D4AF37] font-mono">Daftar Akun Aktif</span>
              </label>

              <select
                value={selectedUserId}
                onChange={e => handleDropdownChange(e.target.value)}
                className="w-full bg-[#081224] text-white border border-[#1b3459] focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none transition-colors cursor-pointer truncate"
              >
                {loginUsers.map((user, index) => (
                  <option key={user.id} value={user.id}>
                    {index + 1}. {getRoleLabel(user.role)} — {user.name}
                  </option>
                ))}
              </select>

              {selectedUser && (
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="text-slate-500 font-mono">Instansi:</span>
                    <span className="text-slate-300 font-medium truncate">{selectedUser.agency}</span>
                  </div>
                  <span className="text-[#D4AF37] font-semibold text-[10px] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 shrink-0">
                    Role: {getRoleLabel(selectedUser.role)}
                  </span>
                </div>
              )}
            </div>

            {/* Credential Inputs Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Email Kedinasan / NRP
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={emailInput}
                    onChange={e => {
                      setEmailInput(e.target.value);
                      setLoginNotice(null);
                    }}
                    placeholder="nama.nrp@polri.go.id"
                    className="w-full bg-[#081224] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Kata Sandi Kedinasan
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="Masukkan sandi..."
                    className="w-full bg-[#081224] text-white pl-10 pr-10 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] placeholder-slate-500 transition-colors"
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

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-slate-400 hover:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#1b3459] bg-[#081224] text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Ingat di perangkat ini</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Silakan hubungi Administrator PUSDATIN SIBER untuk reset kata sandi dinas.')
                  }
                  className="text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer text-xs"
                >
                  Bantuan Sandi
                </button>
              </div>

              {/* Clean Primary Login Button */}
              <button
                type="submit"
                className="w-full bg-[#142642] hover:bg-[#1b3459] text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#234475] shadow-md hover:border-[#D4AF37]/50"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>Masuk ke Dashboard</span>
              </button>
            </form>

            {/* Link to Registration */}
            {onGoToRegister && (
              <div className="pt-4 border-t border-[#1b3459] text-center">
                <p className="text-xs text-slate-400">
                  Belum memiliki akun kedinasan Satwil / Kapolres?{' '}
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


