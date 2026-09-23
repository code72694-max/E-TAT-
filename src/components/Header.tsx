import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { MOCK_USERS } from '../data/initialData';
import { PoliceEmblem } from './PoliceEmblem';
import {
  ShieldCheck,
  Bell,
  Search,
  ChevronDown,
  UserCheck,
  AlertTriangle,
  Clock,
  FileText,
  Menu,
  X,
  LogOut,
  Globe,
  ArrowLeftRight,
  Shield,
  Star
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenPermohonan: (id: string) => void;
  pendingAlertsCount: number;
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
  onLogout?: () => void;
  onGoToLanding?: () => void;
  onGoToLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  searchQuery,
  onSearchChange,
  onOpenPermohonan,
  pendingAlertsCount,
  onToggleMobileNav,
  isMobileNavOpen,
  onLogout,
  onGoToLanding,
  onGoToLogin
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickList, setShowQuickList] = useState(false);

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

  return (
    <header className="bg-[#0B132B] text-slate-100 border-b border-[#1E2D4A] sticky top-0 z-30 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Brand Identifier */}
          <div className="flex items-center space-x-3">
            {onToggleMobileNav && (
              <button
                type="button"
                onClick={onToggleMobileNav}
                className="md:hidden p-2 -ml-1.5 text-slate-300 hover:text-white hover:bg-[#14213D] rounded-lg transition-colors border border-transparent hover:border-[#2A3F6D]"
                aria-label="Buka menu navigasi"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Official Police Seal & Title */}
            <div className="flex items-center space-x-3">
              <PoliceEmblem size="sm" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base tracking-wider text-white font-['Cinzel',serif] block leading-tight">
                    E-TAT <span className="text-[#D4AF37]">PRESISI</span>
                  </span>
                  <span className="hidden sm:inline-block text-[9px] uppercase font-mono font-bold bg-[#D4AF37]/15 text-[#F3E5AB] px-1.5 py-0.2 rounded border border-[#D4AF37]/30">
                    POLRI · BNN
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block leading-tight mt-0.5">
                  Sentra Pelayanan Asesmen Terpadu & Restorative Justice
                </p>
              </div>
            </div>
          </div>

          {/* Center: Tactical Search Input */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari nomor permohonan, nama tersangka, atau pasal perkara..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#090E1D] focus:bg-[#10182C] border border-[#23355A] rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all font-medium"
              />
            </div>
          </div>

          {/* Right: Actions & User Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
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
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white">TAT-089 (Rian Hidayat)</span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">Perlu Perbaikan</span>
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

            {/* Quick Landing Page Link */}
            {onGoToLanding && (
              <button
                type="button"
                onClick={onGoToLanding}
                className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-[#D4AF37] bg-[#14213D] hover:bg-[#1E2D4A] px-3 py-1.5 rounded-xl border border-[#23355A] transition-colors cursor-pointer"
                title="Ke Halaman Utama Publik"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Portal Publik</span>
              </button>
            )}

            {/* Role / User Profile Menu Button */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2.5 bg-[#14213D] hover:bg-[#1E2D4A] border border-[#2A3F6D] px-3 py-1.5 rounded-xl transition-all text-xs font-medium cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#090E1D] border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                  <PoliceEmblem size="sm" />
                </div>
                <div className="text-left hidden sm:block max-w-[150px]">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-white truncate block text-[11px]">
                      {currentUser.name.split(',')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#F3E5AB] truncate block">
                    {getRoleRankBadge(currentUser.role).label}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] ml-0.5" />
              </button>

              {/* Profile & Role Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-84 bg-[#0F172A] rounded-2xl border border-[#2A3F6D] text-slate-200 py-2.5 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Current User Card */}
                  <div className="px-4 py-3 border-b border-[#1E2D4A] bg-[#14213D]/60 space-y-1">
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
                    <p className="text-xs font-bold text-white mt-1 leading-tight">{currentUser.name}</p>
                    <p className="text-[11px] text-[#F3E5AB] font-medium">{getRoleLabel(currentUser.role)}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.agency}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                  </div>

                  {/* Primary Navigation Actions */}
                  <div className="p-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleDropdown(false);
                        if (onGoToLogin) {
                          onGoToLogin();
                        } else if (onLogout) {
                          onLogout();
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#F3E5AB] hover:bg-[#1E2D4A] flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-[#D4AF37]" />
                      <span>Ganti Otoritas Jabatan di Halaman Login</span>
                    </button>

                    {onGoToLanding && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowRoleDropdown(false);
                          onGoToLanding();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#1E2D4A] flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span>Ke Halaman Depan Publik</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowRoleDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Keluar / Logout</span>
                      </button>
                    )}
                  </div>

                  {/* Quick in-page toggle accordion */}
                  <div className="border-t border-[#1E2D4A] pt-1">
                    <button
                      type="button"
                      onClick={() => setShowQuickList(!showQuickList)}
                      className="w-full px-4 py-2 text-left text-[11px] font-semibold text-slate-400 hover:text-white flex items-center justify-between cursor-pointer"
                    >
                      <span>Bypass Cepat di Sini ({showQuickList ? 'Tutup' : 'Buka'})</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showQuickList ? 'rotate-180' : ''}`} />
                    </button>

                    {showQuickList && (
                      <div className="max-h-60 overflow-y-auto py-1 divide-y divide-[#1E2D4A]">
                        {MOCK_USERS.map((user) => {
                          const isActive = user.id === currentUser.id;
                          const rank = getRoleRankBadge(user.role);
                          return (
                            <button
                              key={user.id}
                              id={`switch-user-${user.id}`}
                              onClick={() => {
                                onSelectUser(user);
                                setShowRoleDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2 flex items-start space-x-2 hover:bg-[#1E2D4A] transition-colors ${
                                isActive ? 'bg-[#1E2D4A] border-l-2 border-[#D4AF37]' : ''
                              }`}
                            >
                              <div className="mt-0.5">
                                {isActive ? (
                                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-white truncate block">
                                  {user.name.split(',')[0]}
                                </span>
                                <span className="text-[10px] text-slate-400 truncate block">
                                  [{rank.label}] {user.agency}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
