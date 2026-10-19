import React from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';

interface RegisterHeaderProps {
  onBackToLanding: () => void;
  onGoToLogin: () => void;
}

export const RegisterHeader: React.FC<RegisterHeaderProps> = ({
  onBackToLanding,
  onGoToLogin
}) => {
  return (
    <header className="bg-[#071325]/95 border-b border-[#1b3459] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5 border border-[#1b3459]"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Beranda Utama</span>
        </button>
      </div>

      <div className="flex items-center space-x-2.5">
        <img
          src="/logo_etat.png"
          alt="Logo E-TAT"
          className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.30)]"
        />
        <span className="hidden sm:inline font-extrabold text-sm tracking-wider text-white font-['Cinzel',serif]">
          E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
        </span>
      </div>

      <button
        onClick={onGoToLogin}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-[#133863] hover:bg-[#1a4a82] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-[#235594]"
      >
        <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Sudah Punya Akun? Masuk</span>
      </button>
    </header>
  );
};
