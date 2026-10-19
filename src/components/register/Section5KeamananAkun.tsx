import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { getPasswordStrength } from './constants';

interface Section5KeamananAkunProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  paktaIntegritas: boolean;
  setPaktaIntegritas: (val: boolean) => void;
}

export const Section5KeamananAkun: React.FC<Section5KeamananAkunProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  paktaIntegritas,
  setPaktaIntegritas
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
        <Lock className="w-4 h-4 text-[#D4AF37]" />
        <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
          5. Akun Login & Pakta Integritas
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Email Kedinasan */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-200">
            Email Kedinasan (Username) <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="email"
              required
              maxLength={100}
              value={email}
              onChange={e => setEmail(e.target.value.toLowerCase().trim())}
              placeholder="contoh: kapolres.kukar@polri.go.id"
              className="w-full bg-[#081224] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        {/* Kata Sandi */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Kata Sandi <span className="text-rose-400">*</span>
            </label>
            {password && (
              <span className={`text-[10px] font-bold ${passwordStrength.color.split(' ')[1]}`}>
                {passwordStrength.label}
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter..."
              className="w-full bg-[#081224] text-white pl-10 pr-10 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Password Strength Bar */}
          {password && (
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${passwordStrength.color.split(' ')[0]}`}
                style={{ width: `${passwordStrength.percent}%` }}
              />
            </div>
          )}
        </div>

        {/* Konfirmasi Kata Sandi */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200">
              Konfirmasi Kata Sandi <span className="text-rose-400">*</span>
            </label>
            {confirmPassword && (
              <span
                className={`text-[10px] font-bold ${
                  isPasswordMatch ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPasswordMatch ? 'Cocok' : 'Belum Sama'}
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi..."
              className={`w-full bg-[#081224] text-white pl-10 pr-10 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                confirmPassword && !isPasswordMatch
                  ? 'border-rose-500'
                  : 'border-[#1b3459] focus:border-[#D4AF37]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Pakta Integritas */}
      <div className="pt-3 border-t border-[#1b3459] space-y-3">
        <label className="flex items-start space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={paktaIntegritas}
            onChange={e => setPaktaIntegritas(e.target.checked)}
            className="w-4 h-4 rounded border-[#1b3459] bg-[#081224] text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5"
          />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block font-semibold">
              Pakta Integritas Kedinasan Tim Asesmen Terpadu (e-TAT)
            </strong>
            Saya menyatakan bahwa seluruh data identitas, jabatan kedinasan, serta lampiran dokumen KTP
            dan KTA yang saya unggah adalah sah, benar, dan dapat dipertanggungjawabkan secara hukum
            kedinasan di Kepolisian Negara Republik Indonesia & BNN.
          </div>
        </label>
      </div>
    </div>
  );
};
