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
  ShieldCheck,
  CheckCircle2,
  Zap
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

  const getRoleRankBadge = (role: UserRole) => {
    switch (role) {
      case 'pimpinan':
        return 'PATI BINTANG 1';
      case 'koordinator':
        return 'PAMEN MELATI 3';
      case 'hukum':
        return 'PAMEN MELATI 1';
      case 'pengaju':
        return 'PAMA BALAK 3 (AKP)';
      case 'medis':
        return 'DOKTER SP.KJ';
      case 'sekretariat':
        return 'SEKRETARIAT TAT';
      case 'rehabilitasi':
        return 'BALAI REHABILITASI';
      case 'admin':
        return 'PUSDATIN SIBER';
      default:
        return 'PETUGAS RESMI';
    }
  };

  const handleDropdownChange = (userId: string) => {
    setSelectedUserId(userId);
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setEmailInput(user.email);
    }
  };

  const handleBypassSubmit = () => {
    const user = MOCK_USERS.find(u => u.id === selectedUserId) || MOCK_USERS[1];
    onLogin(user);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Match by entered email or fallback to selected user
    const matchedUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    ) || MOCK_USERS.find(u => u.id === selectedUserId) || MOCK_USERS[1];

    onLogin(matchedUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-[#D4AF37] selection:text-slate-950 font-sans">
      {/* Top Protocol Bar (Original Style) */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5 flex items-center justify-between shadow-2xs">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Kembali ke Beranda Utama</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <PoliceEmblem size="sm" />
          <span className="font-bold text-slate-900 tracking-wide font-['Cinzel',serif]">
            PORTAL OTORISASI E-TAT PRESISI
          </span>
        </div>
      </div>

      {/* Main Container - Compact and immediately visible */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center space-y-4">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <PoliceEmblem size="md" className="mx-auto" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Cinzel',serif]">
            SENTRA KOMANDO OTORITAS PENGGUNA e-TAT
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Masukkan kredensial akun kedinasan Anda atau pilih wewenang jabatan untuk mengakses dasbor operasional e-TAT Presisi.
          </p>
        </div>

        {/* Clean Login Form Card */}
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          {/* Standard Login Form: Email & Password */}
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email Kedinasan / NRP
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="nrp.nama@polri.go.id"
                  className="w-full bg-slate-50 text-slate-900 pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-slate-800 font-medium placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi Kedinasan
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full bg-slate-50 text-slate-900 pl-9 pr-9 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-slate-800 font-medium placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-800"
                />
                <span>Ingat kredensial saya</span>
              </label>
              <span className="text-slate-400 hover:text-slate-600 cursor-pointer">
                Lupa Sandi?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs border border-slate-800"
            >
              <LogIn className="w-4 h-4 text-[#D4AF37]" />
              <span>Masuk ke Portal e-TAT</span>
            </button>
          </form>

          {/* Clean Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white px-2.5 text-slate-400 font-medium uppercase tracking-wider">
                Atau Pilih Role Cepat (Bypass)
              </span>
            </div>
          </div>

          {/* Quick Role Selection Dropdown + Immediate Bypass Login */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-[#B89326]" />
                <span>Pilih Otoritas Akun Kedinasan:</span>
              </label>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                8 PILAR
              </span>
            </div>

            <div className="space-y-2">
              <div className="w-full min-w-0">
                <select
                  value={selectedUserId}
                  onChange={e => handleDropdownChange(e.target.value)}
                  className="w-full min-w-0 bg-white text-slate-900 border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-800 truncate"
                >
                  {MOCK_USERS.map(user => (
                    <option key={user.id} value={user.id}>
                      [{getRoleRankBadge(user.role)}] {user.name} ({user.agency})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleBypassSubmit}
                className="w-full bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Bypass Masuk sebagai Role Terpilih</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security & Protocol Guarantee */}
        <div className="max-w-xl mx-auto text-center space-y-1 pt-2 text-xs text-slate-500">
          <div className="flex items-center justify-center space-x-3 text-[11px] font-semibold text-slate-600">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>Enkripsi TLS 1.3</span>
            </span>
            <span>·</span>
            <span className="flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-slate-700" />
              <span>Audit Trail Forensik Siber</span>
            </span>
            <span>·</span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
              <span>Interkoneksi 4 Pilar</span>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
