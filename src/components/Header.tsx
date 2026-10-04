import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { PoliceEmblem } from './PoliceEmblem';
import {
  ShieldCheck,
  Bell,
  Search,
  ChevronDown,
  AlertTriangle,
  Clock,
  FileText,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  QrCode,
  User
} from 'lucide-react';
import { PermohonanAsesmen } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  onSelectUser?: (user: UserProfile) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenPermohonan: (id: string) => void;
  pendingAlertsCount: number;
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
  onLogout?: () => void;
  onGoToLanding?: () => void;
  onGoToLogin?: () => void;
  selectedPermohonan?: PermohonanAsesmen | null;
  onBackFromDetail?: () => void;
  onOpenQrModal?: (permohonan: PermohonanAsesmen) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  searchQuery,
  onSearchChange,
  onOpenPermohonan,
  pendingAlertsCount,
  onToggleMobileNav,
  isMobileNavOpen,
  onLogout,
  selectedPermohonan,
  onBackFromDetail,
  onOpenQrModal
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'pengaju':
        return 'Penyidik Satresnarkoba / BNN';
      case 'sekretariat':
        return 'Sekretariat TAT (Koordinator Administrasi)';
      case 'medis':
        return 'Tim Asesor Medis & Kedokteran Kepolisian';
      case 'hukum':
        return 'Tim Asesor Hukum & Kejaksaan';
      case 'koordinator':
        return 'Ketua / Koordinator Tim Asesmen Terpadu';
      case 'pimpinan':
        return 'Pimpinan Satuan & Pengawas Perkara';
      case 'rehabilitasi':
        return 'Petugas Rujukan & Balai Rehabilitasi';
      case 'admin':
        return 'Administrator Siber & Pusdatin';
      default:
        return role;
    }
  };

  const getRoleRankBadge = (role: UserRole) => {
    switch (role) {
      case 'pimpinan':
        return { label: 'PATI BINTANG 1', color: 'bg-[#D4AF37]/20 text-[#F3E5AB] border-[#D4AF37]/50' };
      case 'koordinator':
        return { label: 'PAMEN MELATI 3', color: 'bg-[#D4AF37]/15 text-[#F3E5AB] border-[#D4AF37]/40' };
      case 'hukum':
        return { label: 'PAMEN MELATI 1', color: 'bg-[#14213D] text-slate-200 border-[#2A3F6D]' };
      case 'pengaju':
        return { label: 'PAMA BALAK 3 (AKP)', color: 'bg-[#14213D] text-slate-200 border-[#2A3F6D]' };
      case 'medis':
        return { label: 'DOKTER SP.KJ', color: 'bg-[#14213D] text-slate-200 border-[#2A3F6D]' };
      case 'sekretariat':
        return { label: 'SEKRETARIAT TAT', color: 'bg-[#14213D] text-slate-200 border-[#2A3F6D]' };
      case 'rehabilitasi':
        return { label: 'BALAI REHAB', color: 'bg-[#14213D] text-slate-200 border-[#2A3F6D]' };
      default:
        return { label: 'PUSDATIN SIBER', color: 'bg-[#14213D] text-slate-200 border-[#2A3F6D]' };
    }
  };

  // Dedicated Sticky Detail View Header Bar
  if (selectedPermohonan && onBackFromDetail) {
    return (
      <header className="bg-[#0b172a] text-slate-100 border-b border-[#1b3459] sticky top-0 z-30 shadow-md">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16 gap-3">
            {/* Left: Back Button */}
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <button
                type="button"
                onClick={onBackFromDetail}
                className="px-3.5 py-2 bg-[#081224] border border-[#1b3459] hover:bg-[#142642] rounded-xl text-slate-200 transition-colors cursor-pointer shrink-0 flex items-center space-x-2 text-xs font-bold shadow-sm"
                title="Kembali"
              >
                <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
                <span>Kembali</span>
              </button>
            </div>

            {/* Right: Quick QR Button & Notification Bell */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {selectedPermohonan.rekomendasiResmi && onOpenQrModal && (
                <button
                  type="button"
                  onClick={() => onOpenQrModal(selectedPermohonan)}
                  className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 border border-[#234475] transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="hidden sm:inline">QR Verifikasi</span>
                </button>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-[#142642] rounded-xl border border-[#1b3459] relative transition-colors cursor-pointer"
                  title="Pemberitahuan"
                >
                  <Bell className="w-4 h-4" />
                  {pendingAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {pendingAlertsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#0B132B] text-slate-100 border-b border-[#1E2D4A] sticky top-0 z-30 shadow-md">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Brand Identifier */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <img
              src="/logo_etat.png"
              alt="Logo E-TAT"
              className="h-9 sm:h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(212,175,55,0.30)]"
            />
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-white font-['Cinzel',serif] leading-tight truncate">
              E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
            </span>
          </div>


          {/* Right: Actions & User Switcher & Mobile Nav Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Notification Bell (Left of Hamburger) */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-300 hover:text-white hover:bg-[#14213D] rounded-xl border border-[#23355A] relative transition-colors cursor-pointer"
                title="Pemberitahuan Tugas"
              >
                <Bell className="w-4 h-4" />
                {pendingAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-[#0B132B]">
                    {pendingAlertsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F172A] rounded-2xl border border-[#2A3F6D] text-slate-200 py-3 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 pb-2.5 border-b border-[#1E2D4A] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white font-['Cinzel',serif] block">
                        PEMBERITAHUAN TUGAS DOKET
                      </span>
                      <p className="text-[10px] text-slate-400">Atensi berkas yang memerlukan tindakan</p>
                    </div>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/30">
                      {pendingAlertsCount} Tertunda
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#1E2D4A]">
                    <div
                      onClick={() => {
                        onOpenPermohonan('tat-089');
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-[#14213D] transition-colors cursor-pointer flex items-start space-x-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white">TAT-089 (Rian Hidayat)</span>
                          <span className="text-[9px] bg-amber-500/20 text-[#D4AF37] px-1 rounded">Perlu Perbaikan</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Hasil lab urin dan BA Penggeledahan belum diunggah oleh penyidik.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        onOpenPermohonan('tat-074');
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-[#14213D] transition-colors cursor-pointer flex items-start space-x-2.5"
                    >
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white">TAT-074 (Budi Santoso)</span>
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1 rounded">Jadwal Pleno</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Asesmen medis dan hukum lengkap. Menunggu sidang pleno terpadu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation Toggle (Far Right Corner) */}
            {onToggleMobileNav && (
              <button
                type="button"
                onClick={onToggleMobileNav}
                className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-[#14213D] rounded-xl border border-[#23355A] transition-colors cursor-pointer"
                aria-label="Buka menu navigasi"
                title="Menu Navigasi"
              >
                {isMobileNavOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-[#D4AF37]" />}
              </button>
            )}


            {/* Minimalist Profile & Role Menu Button (No BG / Minimalist) */}
            <div className="relative hidden md:block">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2.5 bg-transparent hover:bg-white/5 px-2 py-1 rounded-xl transition-colors text-xs cursor-pointer group"
                title={`Profil: ${currentUser.name}`}
              >
                <div className="w-8 h-8 rounded-full bg-[#142642]/80 border border-[#234475] flex items-center justify-center shrink-0 text-[#d4af37] group-hover:border-[#d4af37]/50 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left hidden lg:block max-w-[220px]">
                  <span className="font-bold text-white group-hover:text-[#d4af37] truncate block text-xs leading-tight transition-colors">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate block leading-tight mt-0.5">
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-150 ml-0.5" />
              </button>

              {/* Profile Details & Logout Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] rounded-2xl border border-[#2A3F6D] text-slate-200 p-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Current User Profile Card */}
                  <div className="px-3.5 py-3 rounded-xl bg-[#14213D]/70 border border-[#1E2D4A] space-y-1.5 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">AKUN JABATAN AKTIF</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-extrabold border ${
                          getRoleRankBadge(currentUser.role).color
                        }`}
                      >
                        {getRoleRankBadge(currentUser.role).label}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[11px] text-[#F3E5AB] font-medium">{getRoleLabel(currentUser.role)}</p>
                    <div className="pt-1 border-t border-[#1E2D4A]/80 space-y-0.5 text-[10px] text-slate-400">
                      <p className="truncate font-medium">{currentUser.agency}</p>
                      <p className="truncate font-mono text-slate-400">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/50 flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Keluar / Logout</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
