import React from 'react';
import { UserRole, UserProfile } from '../types';
import { MOCK_USERS } from '../data/initialData';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  CalendarCheck,
  Stethoscope,
  Scale,
  Users,
  FileSignature,
  Share2,
  BarChart3,
  Settings,
  Plus,
  X,
  Info,
  LogOut,
  Globe,
  ChevronDown,
  User
} from 'lucide-react';

export type ActiveTab =
  | 'beranda'
  | 'permohonan'
  | 'verifikasi'
  | 'penugasan'
  | 'medis'
  | 'hukum'
  | 'pleno'
  | 'dokumen'
  | 'tindak_lanjut'
  | 'monitoring'
  | 'administrasi'
  | 'about'
  | 'profile';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  currentUser?: UserProfile;
  onSelectUser?: (user: UserProfile) => void;
  onOpenNewModal: () => void;
  badgeCounts: {
    perluPerbaikan: number;
    siapVerifikasi: number;
    siapPleno: number;
    menungguPengesahan: number;
    tindakLanjutTerhambat: number;
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
  onGoToLanding?: () => void;
}

interface MenuItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  currentUser,
  onSelectUser,
  onOpenNewModal,
  badgeCounts,
  isMobileOpen = false,
  onCloseMobile,
  onLogout,
  onGoToLanding,
  hasTopHeader = true
}) => {
  const getRoleNav = (): {
    items: MenuItem[];
    showCreateButton: boolean;
    buttonLabel: string;
    roleLabel: string;
  } => {
    switch (userRole) {
      case 'pengaju':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'permohonan', label: 'Permohonan Asesmen', icon: <FileSpreadsheet className="w-4 h-4" />, badge: badgeCounts.perluPerbaikan || undefined },
            { id: 'verifikasi', label: 'Verifikasi Berkas', icon: <FileCheck2 className="w-4 h-4" />, badge: badgeCounts.perluPerbaikan || undefined },
            { id: 'penugasan', label: 'Penugasan & Jadwal', icon: <CalendarCheck className="w-4 h-4" /> },
            { id: 'dokumen', label: 'Surat Rekomendasi', icon: <FileSignature className="w-4 h-4" /> },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: true,
          buttonLabel: 'Pengajuan Baru',
          roleLabel: 'Penyidik Pengaju'
        };

      case 'sekretariat':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'permohonan', label: 'Daftar Permohonan', icon: <FileSpreadsheet className="w-4 h-4" />, badge: badgeCounts.siapVerifikasi || undefined },
            { id: 'verifikasi', label: 'Verifikasi Berkas', icon: <FileCheck2 className="w-4 h-4" />, badge: badgeCounts.siapVerifikasi || undefined },
            { id: 'penugasan', label: 'Penugasan & Jadwal', icon: <CalendarCheck className="w-4 h-4" /> },
            { id: 'pleno', label: 'Sidang Pleno TAT', icon: <Users className="w-4 h-4" />, badge: badgeCounts.siapPleno || undefined },
            { id: 'dokumen', label: 'Surat Rekomendasi', icon: <FileSignature className="w-4 h-4" />, badge: badgeCounts.menungguPengesahan || undefined },
            { id: 'tindak_lanjut', label: 'Pasca Rehabilitasi', icon: <Share2 className="w-4 h-4" />, badge: badgeCounts.tindakLanjutTerhambat || undefined },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: true,
          buttonLabel: 'Input Permohonan',
          roleLabel: 'Sekretariat TAT'
        };

      case 'medis':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'medis', label: 'Asesmen Medis', icon: <Stethoscope className="w-4 h-4" /> },
            { id: 'penugasan', label: 'Penugasan & Jadwal', icon: <CalendarCheck className="w-4 h-4" /> },
            { id: 'pleno', label: 'Sidang Pleno TAT', icon: <Users className="w-4 h-4" />, badge: badgeCounts.siapPleno || undefined },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Asesor Medis'
        };

      case 'hukum':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'hukum', label: 'Asesmen Hukum', icon: <Scale className="w-4 h-4" /> },
            { id: 'penugasan', label: 'Penugasan & Jadwal', icon: <CalendarCheck className="w-4 h-4" /> },
            { id: 'pleno', label: 'Sidang Pleno TAT', icon: <Users className="w-4 h-4" />, badge: badgeCounts.siapPleno || undefined },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Asesor Hukum'
        };

      case 'koordinator':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'permohonan', label: 'Daftar Permohonan', icon: <FileSpreadsheet className="w-4 h-4" /> },
            { id: 'pleno', label: 'Sidang Pleno TAT', icon: <Users className="w-4 h-4" />, badge: badgeCounts.siapPleno || undefined },
            { id: 'dokumen', label: 'Pengesahan Rekomendasi', icon: <FileSignature className="w-4 h-4" />, badge: badgeCounts.menungguPengesahan || undefined },
            { id: 'tindak_lanjut', label: 'Pasca Rehabilitasi', icon: <Share2 className="w-4 h-4" />, badge: badgeCounts.tindakLanjutTerhambat || undefined },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Koordinator TAT'
        };

      case 'pimpinan':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'monitoring', label: 'Laporan & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'permohonan', label: 'Pengawasan Perkara', icon: <FileSpreadsheet className="w-4 h-4" /> },
            { id: 'tindak_lanjut', label: 'Pasca Rehabilitasi', icon: <Share2 className="w-4 h-4" />, badge: badgeCounts.tindakLanjutTerhambat || undefined },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Pimpinan & Pengawas'
        };

      case 'rehabilitasi':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'tindak_lanjut', label: 'Pasca Rehabilitasi', icon: <Share2 className="w-4 h-4" />, badge: badgeCounts.tindakLanjutTerhambat || undefined },
            { id: 'dokumen', label: 'Surat Rekomendasi', icon: <FileSignature className="w-4 h-4" /> },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Mitra Rehabilitasi'
        };

      case 'admin':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'administrasi', label: 'Pengaturan System', icon: <Settings className="w-4 h-4" /> },
            { id: 'monitoring', label: 'Laporan & Audit Log', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Administrator'
        };

      default:
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'profile', label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Pengguna'
        };
    }
  };

  const navConfig = getRoleNav();

  const handleItemClick = (id: ActiveTab) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <aside className="w-full md:w-64 bg-[#091426] text-slate-200 flex flex-col shrink-0 border-r border-[#1a2e4c] select-none h-full shadow-md">
      {/* Mobile Drawer Header */}
      <div className="md:hidden p-4 border-b border-[#1a2e4c] bg-[#0c1a30] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#142642] px-2.5 py-1 rounded border border-[#d4af37]/30">
            {navConfig.roleLabel}
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#142642] rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser && onSelectUser && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Otoritas Jabatan (Role):
            </label>
            <div className="relative">
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const targetUser = MOCK_USERS.find(u => u.id === e.target.value);
                  if (targetUser) {
                    onSelectUser(targetUser);
                  }
                }}
                className="w-full bg-[#142642] text-xs font-semibold text-white border border-[#234475] rounded-xl px-3 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#d4af37]"
              >
                {MOCK_USERS.map((user) => (
                  <option key={user.id} value={user.id} className="bg-[#0b172a] text-slate-200">
                    {user.name.split(',')[0]} ({user.role.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#d4af37] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Role Context Bar on Desktop */}
      <div className="hidden md:block px-4 py-3.5 border-b border-[#1a2e4c] bg-[#0c1a30]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#142642] px-2.5 py-0.5 rounded border border-[#d4af37]/30">
            {navConfig.roleLabel}
          </span>
        </div>
        {currentUser && (
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {currentUser.name}
          </p>
        )}
      </div>

      {/* Primary Action Button (if allowed) */}
      {navConfig.showCreateButton && (
        <div className="p-3.5 border-b border-[#1a2e4c]">
          <button
            id="btn-buat-permohonan-sidebar"
            onClick={() => {
              onOpenNewModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center space-x-2 bg-[#142642] hover:bg-[#1b3459] text-white font-semibold py-2.5 px-3.5 rounded-xl border border-[#234475] transition-colors text-xs cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>{navConfig.buttonLabel}</span>
          </button>
        </div>
      )}

      {/* Main Clean Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1a2e4c]">
        {navConfig.items.map((item) => {
          const isActive = currentTab === item.id;
          const isSeparatorBefore = item.id === 'profile' || item.id === 'about';
          return (
            <React.Fragment key={item.id}>
              {isSeparatorBefore && item.id === 'profile' && <div className="my-2 border-t border-[#1a2e4c]/70" />}
              <button
                id={`nav-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#142642] text-white font-bold border-l-2 border-[#d4af37]'
                    : 'text-slate-300 hover:text-white hover:bg-[#142642]/50'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-[#d4af37]' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-2 shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#142642] text-slate-200 border border-[#234475]">
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      {(onGoToLanding || onLogout) && (
        <div className="p-3 border-t border-[#1a2e4c] space-y-1 bg-[#071120] shrink-0">
          {onGoToLanding && (
            <button
              type="button"
              onClick={onGoToLanding}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#142642] rounded-xl transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Portal Beranda Utama</span>
            </button>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#142642] rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Keluar / Ganti Akun</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop View: Clean docked sidebar */}
      <div className={`hidden md:flex shrink-0 sticky ${hasTopHeader ? 'top-16 h-[calc(100vh-4rem)]' : 'top-0 h-screen'} z-20`}>
        {sidebarContent}
      </div>

      {/* Mobile View: Drawer with smooth slide-in animation */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#091426] border-l border-[#1a2e4c] z-10 shadow-2xl animate-drawer-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
