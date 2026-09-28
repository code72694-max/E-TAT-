import React from 'react';
import { UserRole } from '../types';
import { ActiveTab } from './Sidebar';
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
  User
} from 'lucide-react';

interface MobileBottomNavProps {
  userRole: UserRole;
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewModal?: () => void;
  badgeCounts: {
    perluPerbaikan: number;
    siapVerifikasi: number;
    siapPleno: number;
    menungguPengesahan: number;
    tindakLanjutTerhambat: number;
  };
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  userRole,
  currentTab,
  onSelectTab,
  onOpenNewModal,
  badgeCounts
}) => {
  const getRoleBottomItems = (): NavItem[] => {
    switch (userRole) {
      case 'pengaju':
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'permohonan', label: 'Permohonan', icon: <FileSpreadsheet className="w-5 h-5" />, badge: badgeCounts.perluPerbaikan || undefined },
          { id: 'verifikasi', label: 'Verifikasi', icon: <FileCheck2 className="w-5 h-5" />, badge: badgeCounts.perluPerbaikan || undefined },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];

      case 'sekretariat':
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'permohonan', label: 'Permohonan', icon: <FileSpreadsheet className="w-5 h-5" />, badge: badgeCounts.siapVerifikasi || undefined },
          { id: 'pleno', label: 'Pleno', icon: <Users className="w-5 h-5" />, badge: badgeCounts.siapPleno || undefined },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];

      case 'medis':
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'medis', label: 'Asesmen', icon: <Stethoscope className="w-5 h-5" /> },
          { id: 'pleno', label: 'Pleno', icon: <Users className="w-5 h-5" /> },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];

      case 'hukum':
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'hukum', label: 'Asesmen', icon: <Scale className="w-5 h-5" /> },
          { id: 'pleno', label: 'Pleno', icon: <Users className="w-5 h-5" /> },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];

      case 'koordinator':
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'permohonan', label: 'Permohonan', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { id: 'pleno', label: 'Sidang', icon: <Users className="w-5 h-5" />, badge: badgeCounts.siapPleno || undefined },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];

      case 'pimpinan':
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'monitoring', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
          { id: 'permohonan', label: 'Perkara', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];

      case 'rehabilitasi':
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'tindak_lanjut', label: 'Tindak Lanjut', icon: <Share2 className="w-5 h-5" />, badge: badgeCounts.tindakLanjutTerhambat || undefined },
          { id: 'dokumen', label: 'Dokumen', icon: <FileSignature className="w-5 h-5" /> },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];

      case 'admin':
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'administrasi', label: 'Kelola Akun', icon: <Settings className="w-5 h-5" /> },
          { id: 'monitoring', label: 'Log Audit', icon: <BarChart3 className="w-5 h-5" /> },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];

      default:
        return [
          { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
        ];
    }
  };

  const navItems = getRoleBottomItems().slice(0, 4);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#0F1E3A]/95 via-[#182F5B]/95 to-[#0F1E3A]/95 backdrop-blur-xl px-2 py-2 shadow-[0_-6px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative cursor-pointer min-w-[62px] ${
                isActive
                  ? 'text-[#F3E5AB] font-extrabold scale-105 bg-[#1B3260]/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-extrabold px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-0.5 shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
