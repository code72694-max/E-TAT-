import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Check, ShieldCheck } from 'lucide-react';
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
      <div className="pt-4 border-t border-[#1b3459]">
        <label
          className={`flex items-start space-x-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
            paktaIntegritas
              ? 'bg-emerald-950/25 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
              : 'bg-[#0c1a30]/80 border-[#D4AF37]/45 hover:border-[#D4AF37] hover:bg-[#112442]'
          }`}
        >
          <input
            type="checkbox"
            checked={paktaIntegritas}
            onChange={e => setPaktaIntegritas(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              paktaIntegritas
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-950/50'
                : 'bg-[#081224] border-[#D4AF37] text-transparent hover:border-[#f3e5ab]'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div className="text-xs text-slate-300 leading-relaxed flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <strong className="text-white font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <ShieldCheck className={`w-4 h-4 ${paktaIntegritas ? 'text-emerald-400' : 'text-[#D4AF37]'}`} />
                <span>Pakta Integritas Kedinasan Tim Asesmen Terpadu (e-TAT)</span>
              </strong>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  paktaIntegritas
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40'
                }`}
              >
                {paktaIntegritas ? 'Sudah Disetujui' : 'Wajib Dicentang'}
              </span>
            </div>
            <p className="text-slate-300/95">
              Saya menyatakan bahwa seluruh data identitas, jabatan kedinasan, serta lampiran dokumen KTP
              dan KTA yang saya unggah adalah sah, benar, dan dapat dipertanggungjawabkan secara hukum
              kedinasan di Kepolisian Negara Republik Indonesia &amp; BNN.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
