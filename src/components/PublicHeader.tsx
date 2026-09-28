import React, { useState } from 'react';
import { PoliceEmblem } from './PoliceEmblem';
import {
  LogIn,
  Menu,
  X,
  ShieldCheck,
  LifeBuoy,
  FileCheck,
  Search,
  BookOpen,
  Building2
} from 'lucide-react';

interface PublicHeaderProps {
  activePage: 'landing' | 'lacak';
  onGoToLanding: (sectionId?: string) => void;
  onGoToLacak: () => void;
  onGoToLogin: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage,
  onGoToLanding,
  onGoToLacak,
  onGoToLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closeMobileMenu = (action?: () => void) => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
      if (action) action();
    }, 280);
  };

  const handleNavClick = (action: () => void) => {
    if (mobileMenuOpen) {
      closeMobileMenu(action);
    } else {
      action();
    }
  };

  return (
    <>
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#071325]/95 backdrop-blur-md border-b border-[#1b3459]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Lockup */}
          <button
            onClick={() => handleNavClick(() => onGoToLanding())}
            className="flex items-center space-x-2.5 sm:space-x-3 text-left focus:outline-none cursor-pointer group"
          >
            <img
              src="/bnn.png"
              alt="Logo BNN"
              className="h-8 sm:h-9 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.20)] group-hover:opacity-90 transition-opacity"
            />
            <img
              src="/logo_etat.png"
              alt="Logo E-TAT"
              className="h-10 sm:h-12 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(212,175,55,0.30)] group-hover:opacity-90 transition-opacity"
            />
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white font-['Cinzel',serif] truncate group-hover:text-slate-200 transition-colors">
                E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
              </span>
              <span className="hidden sm:inline-block text-[#1b3459]">|</span>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                BNNP Kalimantan Timur
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-5 lg:space-x-6 shrink-0">
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-6 text-xs font-medium text-slate-300">
              <button
                onClick={() => handleNavClick(() => onGoToLanding('tentang-tat'))}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Tentang E-TAT
              </button>
              <button
                onClick={() => handleNavClick(() => onGoToLanding('gerakan-sekorna'))}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Konsep SIAP PULIH
              </button>
              <button
                onClick={() => handleNavClick(() => onGoToLanding('alur-layanan'))}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Alur SOP
              </button>
              <button
                onClick={() => handleNavClick(onGoToLacak)}
                className={`transition-colors duration-150 cursor-pointer ${
                  activePage === 'lacak'
                    ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5'
                    : 'hover:text-white'
                }`}
              >
                Lacak Berkas
              </button>
              <button
                onClick={() => handleNavClick(() => onGoToLanding('pengawasan'))}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Pengawasan
              </button>
              <button
                onClick={() => handleNavClick(() => onGoToLanding('dasar-hukum'))}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Dasar Regulasi
              </button>
            </nav>

            <div className="hidden md:block h-4 w-px bg-[#1b3459]" />

            {/* Login Action Button */}
            <button
              onClick={onGoToLogin}
              className="hidden md:flex bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold text-xs px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md items-center space-x-1.5 transition-all cursor-pointer border border-[#235594]"
            >
              <LogIn className="w-3.5 h-3.5 text-white" />
              <span>Masuk Portal</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => {
                setIsClosing(false);
                setMobileMenuOpen(true);
              }}
              aria-label="Buka Menu Navigasi"
              className="md:hidden p-2 rounded-lg bg-[#0d1f38] hover:bg-[#142d52] text-slate-300 hover:text-white border border-[#1b3459] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Off-Canvas Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
              isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in'
            }`}
            onClick={() => closeMobileMenu()}
          />
          <aside
            className={`fixed inset-y-0 right-0 w-full max-w-[280px] bg-[#071325] border-l border-[#1b3459] shadow-2xl flex flex-col justify-between p-5 z-10 transition-transform duration-300 ease-in-out ${
              isClosing ? 'translate-x-full' : 'translate-x-0 animate-drawer-in'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1b3459]">
                <div className="flex items-center space-x-2.5">
                  <img
                    src="/logo_etat.png"
                    alt="Logo E-TAT"
                    className="h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(212,175,55,0.30)]"
                  />
                  <div>
                    <span className="font-extrabold text-sm sm:text-base tracking-wider text-white font-['Cinzel',serif] block leading-tight">
                      E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">BNNP Kalimantan Timur</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => closeMobileMenu()}
                  aria-label="Tutup Menu"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1f38] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links in Drawer */}
              <nav className="space-y-1.5">
                <button
                  onClick={() => handleNavClick(() => onGoToLanding())}
                  className={`w-full text-left flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activePage === 'landing' ? 'text-white bg-[#0d1f38] border border-[#1b3459]' : 'text-slate-300 hover:bg-[#0d1f38]'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Beranda Utama</span>
                </button>

                <button
                  onClick={() => handleNavClick(() => onGoToLanding('tentang-tat'))}
                  className="w-full text-left flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0d1f38] transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Tentang E-TAT</span>
                </button>

                <button
                  onClick={() => handleNavClick(() => onGoToLanding('gerakan-sekorna'))}
                  className="w-full text-left flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0d1f38] transition-all"
                >
                  <LifeBuoy className="w-4 h-4 text-slate-400" />
                  <span>Konsep SIAP PULIH</span>
                </button>

                <button
                  onClick={() => handleNavClick(() => onGoToLanding('alur-layanan'))}
                  className="w-full text-left flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0d1f38] transition-all"
                >
                  <FileCheck className="w-4 h-4 text-slate-400" />
                  <span>Alur SOP Layanan</span>
                </button>

                <button
                  onClick={() => handleNavClick(onGoToLacak)}
                  className={`w-full text-left flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'lacak'
                      ? 'text-[#D4AF37] bg-[#0d1f38] border border-[#1b3459]'
                      : 'text-slate-300 hover:bg-[#0d1f38]'
                  }`}
                >
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  <span>Lacak Berkas Perkara</span>
                </button>

                <button
                  onClick={() => handleNavClick(() => onGoToLanding('pengawasan'))}
                  className="w-full text-left flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0d1f38] transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Pengawasan & SOP</span>
                </button>

                <button
                  onClick={() => handleNavClick(() => onGoToLanding('dasar-hukum'))}
                  className="w-full text-left flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0d1f38] transition-all"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Dasar Regulasi</span>
                </button>
              </nav>
            </div>

            {/* Bottom Action in Drawer */}
            <div className="pt-4 border-t border-[#1b3459]">
              <button
                type="button"
                onClick={() => handleNavClick(onGoToLogin)}
                className="w-full bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#235594]"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Masuk Portal SIAP PULIH</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
