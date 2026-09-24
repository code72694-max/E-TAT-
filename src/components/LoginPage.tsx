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
  const [selectedUserId, setSelectedUserId] = useState<string>(MOCK_USERS[1].id);
  const [emailInput, setEmailInput] = useState(MOCK_USERS[1].email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'pimpinan':
        return 'Pimpinan / Kepala BNNP';
      case 'koordinator':
        return 'Koordinator Tim Asesmen (TAT)';
      case 'hukum':
        return 'Asesor Hukum (Kejaksaan/Polri)';
      case 'pengaju':
        return 'Penyidik Pengaju (Polri/BNN)';
      case 'medis':
        return 'Dokter Asesor Medis / Psikiater';
      case 'sekretariat':
        return 'Sekretariat Tata Usaha TAT';
      case 'rehabilitasi':
        return 'Petugas Balai Rehabilitasi';
      case 'admin':
        return 'Pusdatin / Administrator Sistem';
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
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col justify-between antialiased selection:bg-[#38bdf8] selection:text-slate-950 font-sans">
      {/* Top Header Bar */}
      <header className="bg-[#071325]/95 border-b border-[#1b3459] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-2 py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <PoliceEmblem size="sm" />
          <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white font-['Cinzel',serif]">
            E-TAT <span className="text-[#D4AF37]">PRESISI</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Card Header & Branding */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">
              LOGIN
            </h1>
          </div>

          {/* Clean Card Surface */}
          <div className="bg-[#09172e] rounded-2xl border border-[#1b3459] p-6 sm:p-7 shadow-2xl shadow-black/40 space-y-5">
            {/* Quick Role Preset Picker */}
            <div className="space-y-1.5 pb-4 border-b border-[#1b3459]">
              <label className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Pilih Profil Akun Kedinasan (Simulasi):</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">8 Otoritas</span>
              </label>

              <select
                value={selectedUserId}
                onChange={e => handleDropdownChange(e.target.value)}
                className="w-full bg-[#061021] text-white border border-[#1b3459] focus:border-[#38bdf8] rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none transition-colors cursor-pointer truncate"
              >
                {MOCK_USERS.map(user => (
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
                    className="w-full bg-[#061021] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#38bdf8] placeholder-slate-500 transition-colors"
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
                    className="w-full bg-[#061021] text-white pl-10 pr-10 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#38bdf8] placeholder-slate-500 transition-colors"
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
                    className="w-3.5 h-3.5 rounded border-[#1b3459] bg-[#061021] text-[#38bdf8] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Ingat di perangkat ini</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Silakan hubungi Administrator PUSDATIN SIBER untuk reset kata sandi dinas.")}
                  className="text-slate-400 hover:text-[#38bdf8] transition-colors cursor-pointer text-xs"
                >
                  Bantuan Sandi
                </button>
              </div>

              {/* Clean Primary Login Button */}
              <button
                type="submit"
                className="w-full bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#235594] shadow-md shadow-black/30 hover:border-[#3b82f6]"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Masuk ke Dashboard</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Subtle Copyright Bottom */}
      <footer className="py-4 text-center border-t border-[#1b3459] text-[11px] text-slate-400 font-mono">
        Sistem e-TAT Presisi &copy; 2026 Inisiatif SEKORNA
      </footer>
    </div>
  );
};

