import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
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
  UserCheck
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onBackToLanding
}) => {
  const FIVE_MAIN_ROLES = ['pengaju', 'medis', 'hukum', 'sekretariat', 'admin'];
  const mainUsers = MOCK_USERS.filter(u => FIVE_MAIN_ROLES.includes(u.role));

  const [selectedUserId, setSelectedUserId] = useState<string>(mainUsers[0]?.id || MOCK_USERS[1].id);
  const [emailInput, setEmailInput] = useState(mainUsers[0]?.email || MOCK_USERS[1].email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'pengaju':
        return 'Pemohon / Penyidik (Polri/BNN)';
      case 'medis':
        return 'Petugas Medis / Dokter Asesor';
      case 'hukum':
        return 'Petugas Hukum / Asesor Hukum';
      case 'sekretariat':
        return 'Sekretariat Tata Usaha TAT';
      case 'admin':
        return 'Administrator Sistem';
      case 'pimpinan':
        return 'Pimpinan / Kepala BNNP';
      case 'koordinator':
        return 'Koordinator Tim Asesmen (TAT)';
      case 'rehabilitasi':
        return 'Petugas Balai Rehabilitasi';
      default:
        return 'Petugas Resmi';
    }
  };

  const handleDropdownChange = (userId: string) => {
    setSelectedUserId(userId);
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setEmailInput(user.email);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    ) || MOCK_USERS.find(u => u.id === selectedUserId) || MOCK_USERS[1];

    onLogin(matchedUser);
  };

  const selectedUser = MOCK_USERS.find(u => u.id === selectedUserId) || MOCK_USERS[1];

  return (
    <div className="min-h-screen bg-[#071325] text-slate-100 flex flex-col antialiased selection:bg-[#D4AF37] selection:text-slate-950 font-sans">
      {/* Top Header Bar */}
      <header className="bg-[#071325]/95 border-b border-[#1b3459] px-3.5 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5 border border-[#1b3459]/60 sm:border-transparent"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs">Kembali</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-md space-y-5">
          {/* Card Header & Branding */}
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              LOGIN SISTEM
            </h1>
            <p className="text-xs text-slate-400">Portal Otentikasi Petugas Tim Asesmen Terpadu</p>
          </div>

          {/* Clean Card Surface */}
          <div className="bg-[#0b172a] rounded-2xl border border-[#1b3459] p-4 sm:p-7 shadow-2xl space-y-4">
            {/* Quick Role Preset Picker - 5 Main Roles */}
            <div className="space-y-1.5 pb-4 border-b border-[#1b3459]">
              <label className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Pilih Profil Akun Peran (5 Utama):</span>
                </span>
                <span className="text-[10px] text-[#D4AF37] font-mono">5 Peran Kedinasan</span>
              </label>

              <select
                value={selectedUserId}
                onChange={e => handleDropdownChange(e.target.value)}
                className="w-full bg-[#081224] text-white border border-[#1b3459] focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none transition-colors cursor-pointer truncate"
              >
                {mainUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} — {getRoleLabel(user.role)}
                  </option>
                ))}
              </select>

              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-1">
                <span className="text-slate-500 font-mono">Instansi:</span>
                <span className="text-slate-300 font-medium truncate">{selectedUser.agency}</span>
              </div>
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
                    type="email"
                    required
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
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
                    aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
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
                  onClick={() => alert("Silakan hubungi Administrator PUSDATIN SIBER untuk reset kata sandi dinas.")}
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
          </div>
        </div>
      </main>
    </div>
  );
};

