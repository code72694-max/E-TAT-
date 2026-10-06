import React from 'react';
import { UserRole, UserProfile } from '../types';
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
  Calendar,
  Plus,
  X,
  Info,
  LogOut,
  Globe,
  ChevronDown,
  User,
  Activity,
  ShieldCheck,
  Zap,
  History,
  Building2
} from 'lucide-react';

export type ActiveTab =
  | 'beranda'
  | 'permohonan'
  | 'asesmen_aktif'
  | 'riwayat'
  | 'riwayat_hukum'
  | 'verifikasi'
  | 'penugasan'
  | 'medis'
  | 'hukum'
  | 'pleno'
  | 'dokumen'
  | 'tindak_lanjut'
  | 'tindak_lanjut_input_jadwal'
  | 'tindak_lanjut_jadwal'
  | 'monitoring'
  | 'administrasi'
  | 'pemulihan'
  | 'verifikasi_akun'
  | 'about'
  | 'profile';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  currentUser?: UserProfile;
  users?: UserProfile[];
  onSelectUser?: (user: UserProfile) => void;
  onOpenNewModal: () => void;
  badgeCounts: {
    perluPerbaikan: number;
    siapVerifikasi: number;
    siapPleno: number;
    menungguPengesahan: number;
    tindakLanjutTerhambat: number;
    akunPending?: number;
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
  onGoToLanding?: () => void;
  hasTopHeader?: boolean;
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
  users = [],
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
      // === PENGAJU: Penyidik Polri / BNN / Jaksa (Pemohon) ===
      case 'PENGAJU':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'permohonan', label: 'Permohonan Asesmen', icon: <FileSpreadsheet className="w-4 h-4" />, badge: badgeCounts.perluPerbaikan || undefined },
            { id: 'penugasan', label: 'Jadwal & Sesi', icon: <CalendarCheck className="w-4 h-4" /> },
            { id: 'dokumen', label: 'Surat Rekomendasi', icon: <FileSignature className="w-4 h-4" /> },
            { id: 'tindak_lanjut', label: 'Tindak Lanjut', icon: <Share2 className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: true,
          buttonLabel: 'Pengajuan Baru',
          roleLabel: 'PENGAJU'
        };

      // === ADMIN: Sekretariat TAT (Administrasi, Disposisi, Penerbitan) ===
      case 'ADMIN':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'permohonan', label: 'Daftar Permohonan', icon: <FileSpreadsheet className="w-4 h-4" />, badge: badgeCounts.siapVerifikasi || undefined },
            { id: 'asesmen_aktif', label: 'Asesmen Aktif', icon: <Zap className="w-4 h-4" /> },
            { id: 'pleno', label: 'Pembahasan (Pleno)', icon: <Users className="w-4 h-4" />, badge: badgeCounts.siapPleno || undefined },
            { id: 'tindak_lanjut', label: 'Tindak Lanjut', icon: <Share2 className="w-4 h-4" />, badge: badgeCounts.tindakLanjutTerhambat || undefined },
            { id: 'verifikasi_akun', label: 'Verifikasi Akun', icon: <ShieldCheck className="w-4 h-4" />, badge: badgeCounts.akunPending || undefined },
            { id: 'monitoring', label: 'Laporan & Monitoring', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'ADMIN (Sekretariat)'
        };

      // === MEDIS: Asesor Medis & Psikologis ===
      case 'MEDIS':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'medis', label: 'Asesmen Medis', icon: <Stethoscope className="w-4 h-4" /> },
            { id: 'tindak_lanjut', label: 'Tindak Lanjut & Kontrol Rehab', icon: <Share2 className="w-4 h-4" />, badge: badgeCounts.tindakLanjutTerhambat || undefined },
            { id: 'pleno', label: 'Pembahasan (Pleno)', icon: <Users className="w-4 h-4" />, badge: badgeCounts.siapPleno || undefined },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'MEDIS'
        };

      // === HUKUM: Asesor Hukum (Jaksa/Penyidik dalam tim) ===
      case 'HUKUM':
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'hukum', label: 'Asesmen Hukum', icon: <Scale className="w-4 h-4" /> },
            { id: 'pleno', label: 'Pembahasan (Pleno)', icon: <Users className="w-4 h-4" />, badge: badgeCounts.siapPleno || undefined },
            { id: 'riwayat_hukum', label: 'Riwayat Asesmen Hukum', icon: <History className="w-4 h-4" /> },
            { id: 'about', label: 'Bantuan & SOP', icon: <Info className="w-4 h-4" /> }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'HUKUM'
        };

      default:
        return {
          items: [
            { id: 'beranda', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
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

  const [isTindakLanjutDropdownOpen, setIsTindakLanjutDropdownOpen] = React.useState(true);

  const sidebarContent = (
    <aside className="w-full md:w-64 bg-[#091426] text-slate-200 flex flex-col shrink-0 border-r border-[#1a2e4c] select-none h-full shadow-md">
      {/* Mobile Drawer Header */}
      <div className="md:hidden p-4 border-b border-[#1a2e4c] bg-[#0c1a30] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-[#142642] px-2.5 py-1 rounded border border-blue-500/30">
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
                  const targetUser = (users || [currentUser]).find(u => u.id === e.target.value);
                  if (targetUser) {
                    onSelectUser(targetUser);
                  }
                }}
                className="w-full bg-[#142642] text-xs font-semibold text-white border border-[#234475] rounded-xl px-3 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
              >
                {(users && users.length > 0 ? users : [currentUser]).map((user) => (
                  <option key={user.id} value={user.id} className="bg-[#0b172a] text-slate-200">
                    {user.name.split(',')[0]} ({user.role.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-blue-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
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
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-3.5 rounded-xl border border-blue-500/40 transition-colors text-xs cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{navConfig.buttonLabel}</span>
          </button>
        </div>
      )}

      {/* Main Clean Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1a2e4c]">
        {navConfig.items.map((item) => {
          const isActive = currentTab === item.id;
          const isSeparatorBefore = item.id === 'about';
          const isTindakLanjut = item.id === 'tindak_lanjut';

          if (isTindakLanjut) {
            return (
              <div key={item.id} className="space-y-1">
                <button
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    handleItemClick(item.id);
                    setIsTindakLanjutDropdownOpen(!isTindakLanjutDropdownOpen);
                  }}
                  className={`w-full group flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#142642] text-white font-bold border-l-2 border-blue-500'
                      : 'text-slate-300 hover:text-white hover:bg-[#142642]/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#142642] text-slate-200 border border-[#234475]">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isTindakLanjutDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Sub-menu Dropdown List */}
                {isTindakLanjutDropdownOpen && (
                  <div className="ml-5 pl-2.5 border-l border-[#1e3a5f] space-y-1.5 pt-1 pb-1">
                    <button
                      onClick={() => handleItemClick('tindak_lanjut_input_jadwal')}
                      className={`w-full text-left px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        currentTab === 'tindak_lanjut_input_jadwal'
                          ? 'bg-blue-600 text-white shadow-lg border border-blue-400'
                          : 'bg-blue-950/60 text-[#38bdf8] hover:bg-blue-900/60 border border-blue-800/60'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Input Jadwal Kontrol & Lapor</span>
                    </button>
                    <button
                      onClick={() => handleItemClick('tindak_lanjut_jadwal')}
                      className={`w-full text-left px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                        currentTab === 'tindak_lanjut_jadwal'
                          ? 'bg-[#142642] text-[#38bdf8] font-bold border border-[#234475]'
                          : 'text-slate-300 hover:text-white hover:bg-[#142642]/60'
                      }`}
                    >
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>Daftar Jadwal (Kontrol & Lapor)</span>
                    </button>
                    <button
                      onClick={() => handleItemClick('tindak_lanjut')}
                      className={`w-full text-left px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                        currentTab === 'tindak_lanjut'
                          ? 'bg-[#142642] text-[#38bdf8] font-bold border border-[#234475]'
                          : 'text-slate-300 hover:text-white hover:bg-[#142642]/60'
                      }`}
                    >
                      <FileCheck2 className="w-3 h-3 text-blue-400" />
                      <span>Daftar Tindak Lanjut</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          return (
            <React.Fragment key={item.id}>
              {isSeparatorBefore && <div className="my-2 border-t border-[#1a2e4c]/70" />}
              <button
                id={`nav-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#142642] text-white font-bold border-l-2 border-blue-500'
                    : 'text-slate-300 hover:text-white hover:bg-[#142642]/50'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
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
