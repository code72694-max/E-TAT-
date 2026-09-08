import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { MOCK_USERS } from '../data/initialData';
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
  X
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
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  searchQuery,
  onSearchChange,
  onOpenPermohonan,
  pendingAlertsCount,
  onToggleMobileNav,
  isMobileNavOpen
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'pengaju':
        return 'Penyidik / Pengaju (Polri/BNN)';
      case 'sekretariat':
        return 'Sekretariat TAT (Koordinator)';
      case 'medis':
        return 'Tim Asesor Medis & Jiwa';
      case 'hukum':
        return 'Tim Asesor Hukum';
      case 'koordinator':
        return 'Ketua / Koordinator TAT';
      case 'pimpinan':
        return 'Pimpinan / Pengawas (Ka BNN)';
      case 'rehabilitasi':
        return 'Fasilitas Rehabilitasi';
      case 'admin':
        return 'Administrator Sistem';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'pengaju':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'sekretariat':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'medis':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'hukum':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'koordinator':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'pimpinan':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'rehabilitasi':
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-30">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Brand Identifier */}
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Menu Button */}
            {onToggleMobileNav && (
              <button
                type="button"
                onClick={onToggleMobileNav}
                className="md:hidden p-2 -ml-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                aria-label="Buka menu navigasi"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Clean Circular Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 font-sans block leading-tight">
                  e-TAT
                </span>
                <p className="text-[11px] text-slate-500 hidden sm:block leading-tight">
                  Sistem Informasi TAT Terpadu Provinsi Jawa Barat
                </p>
              </div>
            </div>
          </div>

          {/* Center: Clean Quick Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari no. permohonan, nama terperiksa, atau pasal..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 relative transition-colors"
                title="Pemberitahuan Tugas"
              >
                <Bell className="w-4 h-4" />
                {pendingAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {pendingAlertsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Pemberitahuan Tugas</span>
                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                      {pendingAlertsCount} Perlu Tindakan
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    <div
                      onClick={() => {
                        onOpenPermohonan('tat-089');
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            TAT-089: Perlu Perbaikan Berkas
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            Perbedaan penulisan nama KTP dan BA Penimbangan belum jelas.
                          </p>
                          <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-block">
                            Menunggu Penyidik
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        onOpenPermohonan('tat-085');
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-2">
                        <Clock className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            TAT-085: Menuju Tenggat SLA
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            Asesmen medis selesai, menunggu hasil uji konfirmasi lab hukum.
                          </p>
                          <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-block">
                            Sisa 1 hari
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        onOpenPermohonan('tat-079');
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            TAT-079: Menunggu Pengesahan
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            Pleno selesai. Menunggu tanda tangan digital Ketua Tim TAT.
                          </p>
                          <span className="text-[10px] text-purple-600 font-semibold mt-1 inline-block">
                            Siap Terbit
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Button */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 transition-all text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name.split(',')[0]}
                  </div>
                  <div className="text-[10px] mt-0.5">
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold border ${getRoleBadgeColor(
                        currentUser.role
                      )}`}
                    >
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Role Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Ganti Sudut Pandang Peran</p>
                      <span className="text-[10px] text-slate-400 font-medium">Multi-Aktor</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pilih profil pengguna untuk melihat alur kerja operasional sesuai kewenangan institusi.
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1 divide-y divide-slate-50">
                    {MOCK_USERS.map((user) => {
                      const isActive = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          id={`switch-user-${user.id}`}
                          onClick={() => {
                            onSelectUser(user);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-start space-x-3 hover:bg-slate-50 transition-colors ${
                            isActive ? 'bg-blue-50/70 border-l-3 border-blue-600' : ''
                          }`}
                        >
                          <div className="mt-0.5">
                            {isActive ? (
                              <UserCheck className="w-4 h-4 text-blue-600" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {user.name}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${getRoleBadgeColor(
                                  user.role
                                )}`}
                              >
                                {user.role.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                              {getRoleLabel(user.role)}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">{user.agency}</p>
                          </div>
                        </button>
                      );
                    })}
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
