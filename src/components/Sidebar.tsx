import React from 'react';
import { UserRole } from '../types';
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
  AlertCircle,
  X,
  Info,
  LogOut,
  Globe
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
  | 'about';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  userRole: UserRole;
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
  badgeColor?: string;
  category: 'utama' | 'asesor' | 'output' | 'kelola';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onOpenNewModal,
  badgeCounts,
  isMobileOpen = false,
  onCloseMobile,
  onLogout,
  onGoToLanding
}) => {
  const getRoleNav = (): {
    categories: { key: string; title: string }[];
    items: MenuItem[];
    showCreateButton: boolean;
    buttonLabel: string;
    roleLabel: string;
    roleDesc: string;
  } => {
    switch (userRole) {
      case 'pengaju':
        return {
          categories: [{ key: 'pengaju', title: 'Menu' }],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'utama'
            },
            {
              id: 'permohonan',
              label: 'Daftar Berkas',
              icon: <FileSpreadsheet className="w-4 h-4" />,
              badge: badgeCounts.perluPerbaikan > 0 ? badgeCounts.perluPerbaikan : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'utama'
            },
            {
              id: 'verifikasi',
              label: 'Perbaikan Berkas',
              icon: <FileCheck2 className="w-4 h-4" />,
              badge: badgeCounts.perluPerbaikan > 0 ? badgeCounts.perluPerbaikan : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'utama'
            },
            {
              id: 'penugasan',
              label: 'Jadwal Pemeriksaan',
              icon: <CalendarCheck className="w-4 h-4" />,
              category: 'utama'
            },
            {
              id: 'dokumen',
              label: 'Rekomendasi Resmi',
              icon: <FileSignature className="w-4 h-4" />,
              category: 'utama'
            },
            {
              id: 'about',
              label: 'Tentang & Panduan Alur',
              icon: <Info className="w-4 h-4" />,
              category: 'utama'
            }
          ],
          showCreateButton: true,
          buttonLabel: 'Pengajuan Baru',
          roleLabel: 'Penyidik Pengaju',
          roleDesc: 'Penyidik Pengaju'
        };

      case 'sekretariat':
        return {
          categories: [
            { key: 'koordinasi', title: 'Alur Layanan' },
            { key: 'distribusi', title: 'Rujukan & Output' }
          ],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'utama'
            },
            {
              id: 'permohonan',
              label: 'Daftar Berkas',
              icon: <FileSpreadsheet className="w-4 h-4" />,
              badge: badgeCounts.siapVerifikasi > 0 ? badgeCounts.siapVerifikasi : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'utama'
            },
            {
              id: 'verifikasi',
              label: 'Verifikasi Berkas',
              icon: <FileCheck2 className="w-4 h-4" />,
              badge: badgeCounts.siapVerifikasi > 0 ? badgeCounts.siapVerifikasi : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'utama'
            },
            {
              id: 'penugasan',
              label: 'Penugasan & Jadwal',
              icon: <CalendarCheck className="w-4 h-4" />,
              category: 'utama'
            },
            {
              id: 'pleno',
              label: 'Sidang Pleno',
              icon: <Users className="w-4 h-4" />,
              badge: badgeCounts.siapPleno > 0 ? badgeCounts.siapPleno : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'utama'
            },
            {
              id: 'dokumen',
              label: 'Pengesahan Dokumen',
              icon: <FileSignature className="w-4 h-4" />,
              badge: badgeCounts.menungguPengesahan > 0 ? badgeCounts.menungguPengesahan : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'output'
            },
            {
              id: 'tindak_lanjut',
              label: 'Rujukan & Fasilitas',
              icon: <Share2 className="w-4 h-4" />,
              badge: badgeCounts.tindakLanjutTerhambat > 0 ? badgeCounts.tindakLanjutTerhambat : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'output'
            },
            {
              id: 'about',
              label: 'Tentang & Panduan Alur',
              icon: <Info className="w-4 h-4" />,
              category: 'output'
            }
          ],
          showCreateButton: true,
          buttonLabel: 'Input Permohonan',
          roleLabel: 'Sekretariat TAT',
          roleDesc: 'Sekretariat'
        };

      case 'medis':
        return {
          categories: [{ key: 'medis_cat', title: 'Menu' }],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'asesor'
            },
            {
              id: 'medis',
              label: 'Asesmen Medis',
              icon: <Stethoscope className="w-4 h-4" />,
              category: 'asesor'
            },
            {
              id: 'penugasan',
              label: 'Jadwal Pemeriksaan',
              icon: <CalendarCheck className="w-4 h-4" />,
              category: 'asesor'
            },
            {
              id: 'pleno',
              label: 'Sidang Pleno',
              icon: <Users className="w-4 h-4" />,
              badge: badgeCounts.siapPleno > 0 ? badgeCounts.siapPleno : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'asesor'
            },
            {
              id: 'about',
              label: 'Tentang & Panduan Alur',
              icon: <Info className="w-4 h-4" />,
              category: 'asesor'
            }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Asesor Medis',
          roleDesc: 'Asesor Medis'
        };

      case 'hukum':
        return {
          categories: [{ key: 'hukum_cat', title: 'Menu' }],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'asesor'
            },
            {
              id: 'hukum',
              label: 'Asesmen Hukum',
              icon: <Scale className="w-4 h-4" />,
              category: 'asesor'
            },
            {
              id: 'penugasan',
              label: 'Jadwal Pemeriksaan',
              icon: <CalendarCheck className="w-4 h-4" />,
              category: 'asesor'
            },
            {
              id: 'pleno',
              label: 'Sidang Pleno',
              icon: <Users className="w-4 h-4" />,
              badge: badgeCounts.siapPleno > 0 ? badgeCounts.siapPleno : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'asesor'
            }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Asesor Hukum',
          roleDesc: 'Asesor Hukum'
        };

      case 'koordinator':
        return {
          categories: [
            { key: 'koor_cat', title: 'Menu' }
          ],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'utama'
            },
            {
              id: 'permohonan',
              label: 'Daftar Berkas',
              icon: <FileSpreadsheet className="w-4 h-4" />,
              category: 'utama'
            },
            {
              id: 'pleno',
              label: 'Sidang Pleno',
              icon: <Users className="w-4 h-4" />,
              badge: badgeCounts.siapPleno > 0 ? badgeCounts.siapPleno : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'utama'
            },
            {
              id: 'dokumen',
              label: 'Pengesahan Rekomendasi',
              icon: <FileSignature className="w-4 h-4" />,
              badge: badgeCounts.menungguPengesahan > 0 ? badgeCounts.menungguPengesahan : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'utama'
            },
            {
              id: 'tindak_lanjut',
              label: 'Rujukan & Fasilitas',
              icon: <Share2 className="w-4 h-4" />,
              badge: badgeCounts.tindakLanjutTerhambat > 0 ? badgeCounts.tindakLanjutTerhambat : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'utama'
            },
            {
              id: 'about',
              label: 'Tentang & Panduan Alur',
              icon: <Info className="w-4 h-4" />,
              category: 'utama'
            }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Ketua / Koordinator TAT',
          roleDesc: 'Koordinator TAT'
        };

      case 'pimpinan':
        return {
          categories: [{ key: 'pimpinan_cat', title: 'Menu' }],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'kelola'
            },
            {
              id: 'monitoring',
              label: 'Monitoring & SLA',
              icon: <BarChart3 className="w-4 h-4" />,
              category: 'kelola'
            },
            {
              id: 'permohonan',
              label: 'Daftar Berkas',
              icon: <FileSpreadsheet className="w-4 h-4" />,
              category: 'kelola'
            },
            {
              id: 'tindak_lanjut',
              label: 'Rujukan & Fasilitas',
              icon: <Share2 className="w-4 h-4" />,
              badge: badgeCounts.tindakLanjutTerhambat > 0 ? badgeCounts.tindakLanjutTerhambat : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'kelola'
            },
            {
              id: 'about',
              label: 'Tentang & Panduan Alur',
              icon: <Info className="w-4 h-4" />,
              category: 'kelola'
            }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Pimpinan / Pengawas',
          roleDesc: 'Pengawas Mutu'
        };

      case 'rehabilitasi':
        return {
          categories: [{ key: 'rehab_cat', title: 'Menu' }],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'output'
            },
            {
              id: 'tindak_lanjut',
              label: 'Rujukan Klien',
              icon: <Share2 className="w-4 h-4" />,
              badge: badgeCounts.tindakLanjutTerhambat > 0 ? badgeCounts.tindakLanjutTerhambat : undefined,
              badgeColor: 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]',
              category: 'output'
            },
            {
              id: 'dokumen',
              label: 'Rekomendasi Resmi',
              icon: <FileSignature className="w-4 h-4" />,
              category: 'output'
            },
            {
              id: 'about',
              label: 'Tentang & Panduan Alur',
              icon: <Info className="w-4 h-4" />,
              category: 'output'
            }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Fasilitas Rehabilitasi',
          roleDesc: 'Fasilitas Rehabilitasi'
        };

      case 'admin':
        return {
          categories: [{ key: 'admin_cat', title: 'Menu' }],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'kelola'
            },
            {
              id: 'administrasi',
              label: 'Pengguna & Regulasi',
              icon: <Settings className="w-4 h-4" />,
              category: 'kelola'
            },
            {
              id: 'monitoring',
              label: 'Audit & Keamanan',
              icon: <BarChart3 className="w-4 h-4" />,
              category: 'kelola'
            },
            {
              id: 'about',
              label: 'Tentang & Panduan Alur',
              icon: <Info className="w-4 h-4" />,
              category: 'kelola'
            }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Administrator',
          roleDesc: 'Administrator'
        };

      default:
        return {
          categories: [{ key: 'default', title: 'Menu Layanan' }],
          items: [
            {
              id: 'beranda',
              label: 'Beranda',
              icon: <LayoutDashboard className="w-4 h-4" />,
              category: 'utama'
            },
            {
              id: 'about',
              label: 'Tentang & Panduan Alur',
              icon: <Info className="w-4 h-4" />,
              category: 'utama'
            }
          ],
          showCreateButton: false,
          buttonLabel: '',
          roleLabel: 'Pengguna',
          roleDesc: 'Layanan Terpadu'
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
    <aside className="w-64 lg:w-72 bg-[#0B132B] text-slate-200 flex flex-col shrink-0 border-r border-[#1E2D4A] select-none h-full shadow-lg">
      {/* Mobile Header Bar inside Drawer */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[#1E2D4A] bg-[#0E172B]">
        <div>
          <span className="font-bold text-sm text-white block">{navConfig.roleLabel}</span>
          <span className="text-[10px] text-slate-400">{navConfig.roleDesc}</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-[#14213D] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Context Bar on Desktop */}
      <div className="hidden md:block px-4 py-3.5 border-b border-[#1E2D4A] bg-[#0E172B]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#F3E5AB] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
            {navConfig.roleLabel}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {navConfig.roleDesc}
        </p>
      </div>

      {/* Primary Action Button (If authorized for this role) */}
      {navConfig.showCreateButton && (
        <div className="p-3.5 border-b border-[#1E2D4A] bg-[#0B132B]">
          <button
            id="btn-buat-permohonan-sidebar"
            onClick={() => {
              onOpenNewModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center space-x-2 bg-[#133863] hover:bg-[#1a4a82] text-white font-bold py-2.5 px-3.5 rounded-xl border border-[#235594] shadow-md transition-all text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{navConfig.buttonLabel}</span>
          </button>
        </div>
      )}

      {/* Navigation List grouped neatly per role */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1E2D4A]">
        <div className="space-y-1">
          {navConfig.items.map((item) => {
            const isActive = currentTab === item.id;
            const isAbout = item.id === 'about';
            return (
              <React.Fragment key={item.id}>
                {isAbout && <div className="my-2 border-t border-[#1E2D4A]" />}
                <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#14213D] text-white font-bold border-l-3 border-[#38bdf8] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#14213D]/60'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#38bdf8]'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`ml-2 shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      item.badgeColor || 'bg-[#1E2D4A] text-slate-200 border-[#2A3F6D]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* Footer Navigation: Portal Publik & Logout */}
      {(onGoToLanding || onLogout) && (
        <div className="p-3 border-t border-[#1E2D4A] space-y-1 bg-[#080D1A] shrink-0">
          {onGoToLanding && (
            <button
              type="button"
              onClick={onGoToLanding}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#14213D] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#2A3F6D]"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Portal Publik Utama</span>
            </button>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#14213D] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#2A3F6D]"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Ganti Akun / Logout</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop View: Clean docked sidebar on far-left corner */}
      <div className="hidden md:flex shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-20">
        {sidebarContent}
      </div>

      {/* Mobile View: Slide-out drawer with backdrop */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-slate-300 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
