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
  Building2,
  UserPlus,
  Users,
  Scale,
  Stethoscope,
  Award,
  ChevronRight,
  Info,
  ArrowLeft
} from 'lucide-react';

export interface TimTatMember {
  no: number;
  nama: string;
  jabatan: string;
  pangkatGol: string;
  nipNrp: string;
  tim?: 'TIM 1' | 'TIM 2';
  keterangan:
    | 'Ketua TAT'
    | 'Wakil Ketua TAT'
    | 'Tim Hukum'
    | 'Tim Medis'
    | 'Sekretaris 1'
    | 'Sekretariat'
    | 'Anggota Petugas Administrasi';
}

export const TIM_TAT_LIST: TimTatMember[] = [
  // Pimpinan
  { no: 1, nama: 'Rudy Mulyanto, S.I.K., M.H', jabatan: 'Kepala BNN Provinsi Kaltim', pangkatGol: 'Brigjen Pol. / IV D', nipNrp: '71040400', keterangan: 'Ketua TAT' },
  { no: 2, nama: 'Tejo Yuantoro, S.I.K., M.Si', jabatan: 'Kepala Bidang Pemberantasan BNN Provinsi Kaltim', pangkatGol: 'Kombes Pol. / IV C', nipNrp: '75050936', keterangan: 'Wakil Ketua TAT' },

  // TIM 1
  { no: 3, nama: 'Erick Herlambang, SH., MH', jabatan: 'Kasi B pada Bidang Tindak Pidana Umum Kejaksaan Tinggi Kaltim', pangkatGol: 'Jaksa Madya / IV A', nipNrp: '19840806 200712 1 003', tim: 'TIM 1', keterangan: 'Tim Hukum' },
  { no: 4, nama: 'Happy Al Habiebie, S.H., M.H', jabatan: 'Kasi C pada Bidang Tindak Pidana Umum Kejaksaan Tinggi Kaltim', pangkatGol: 'Jaksa Madya / IV A', nipNrp: '19790417 200312 1 004', tim: 'TIM 1', keterangan: 'Tim Hukum' },
  { no: 5, nama: 'Dwi Bowo Leksono, SH', jabatan: 'Penyidik Sie. Intelijen Bidang Pemberantasan dan Intelijen BNNP Kaltim', pangkatGol: 'AKP / III C', nipNrp: '80120068', tim: 'TIM 1', keterangan: 'Tim Hukum' },
  { no: 6, nama: 'Suriansyah Siregar, SH', jabatan: 'Penyidik Sie. Intelijen Bidang Pemberantasan dan Intelijen BNNP Kaltim', pangkatGol: 'BRIPKA / II D', nipNrp: '84101327', tim: 'TIM 1', keterangan: 'Tim Hukum' },
  { no: 7, nama: 'Bambang Suheri, SE', jabatan: 'Kanit Sidik Resnarkoba Polresta Samarinda', pangkatGol: 'IPTU / III B', nipNrp: '74110386', tim: 'TIM 1', keterangan: 'Tim Hukum' },
  { no: 8, nama: 'Wiwin Ristianti, S.H', jabatan: 'Pembimbing Kemasyarakatan PK Madya Bapas Samarinda', pangkatGol: 'Pembina / IV A', nipNrp: '198112092001 122001', tim: 'TIM 1', keterangan: 'Tim Hukum' },
  { no: 9, nama: 'dr. Risna Sari', jabatan: 'Dokter Muda BNNP Kaltim', pangkatGol: 'Penata / III C', nipNrp: '19870102 201502 2 002', tim: 'TIM 1', keterangan: 'Tim Medis' },
  { no: 10, nama: 'Ayunda Ramadhani, M.Psi., Psikolog', jabatan: 'Psikolog Himpsi Kalimantan Timur', pangkatGol: '-', nipNrp: '-', tim: 'TIM 1', keterangan: 'Tim Medis' },

  // TIM 2
  { no: 11, nama: 'Sinta Lia Latifah, SH., MH', jabatan: 'Jaksa Fungsional pada Bidang Tindak Pidana Umum Kejaksaan Tinggi Kalimantan Timur', pangkatGol: 'Ajun Jaksa / III B', nipNrp: '19960811 201902 2 009', tim: 'TIM 2', keterangan: 'Tim Hukum' },
  { no: 12, nama: 'Muhammad Hendra Hidayat, S.H., M.Hum', jabatan: 'Jaksa Fungsional pada Bidang Tindak Pidana Umum Kejaksaan Tinggi Kalimantan Timur', pangkatGol: 'Ajun Jaksa Madya / III A', nipNrp: '1998103 1202203 1 001', tim: 'TIM 2', keterangan: 'Tim Hukum' },
  { no: 13, nama: 'Saiful Anam, SH', jabatan: 'Penyidik Sie. Intelijen Bidang Pemberantasan dan Intelijen BNNP Kaltim', pangkatGol: 'AIPDA / II E', nipNrp: '83101247', tim: 'TIM 2', keterangan: 'Tim Hukum' },
  { no: 14, nama: 'Edy Santoso, SH., MH', jabatan: 'Penyidik Sie. Intelijen Bidang Pemberantasan dan Intelijen BNNP Kaltim', pangkatGol: 'AIPTU / II F', nipNrp: '84090182', tim: 'TIM 2', keterangan: 'Tim Hukum' },
  { no: 15, nama: 'Akhmad Wira Trayudi, S., M.H', jabatan: 'Kasikum Polresta Samarinda', pangkatGol: 'AKP / III C', nipNrp: '84020288', tim: 'TIM 2', keterangan: 'Tim Hukum' },
  { no: 16, nama: 'Ummi Kalsum Ode, S.Psi', jabatan: 'Pembimbing Kemasyarakatan PK Muda Bapas Samarinda', pangkatGol: 'Penata / III C', nipNrp: '199409172012122001', tim: 'TIM 2', keterangan: 'Tim Hukum' },
  { no: 17, nama: 'dr. Yenny, Sp.KJ', jabatan: 'Psikiater RSJD Atma Husada Mahakam Samarinda', pangkatGol: 'Penata Muda Tk. 1 / III B', nipNrp: '19800107 201403 2 002', tim: 'TIM 2', keterangan: 'Tim Medis' },
  { no: 18, nama: 'Aulia Ramdani, M.Psi., Psikolog', jabatan: 'Psikolog Himpsi Kalimantan Timur', pangkatGol: '-', nipNrp: '-', tim: 'TIM 2', keterangan: 'Tim Medis' },
  { no: 19, nama: 'Tina Khostarina, M.Psi., Psikolog', jabatan: 'Psikolog Himpsi Kalimantan Timur', pangkatGol: '-', nipNrp: '-', tim: 'TIM 2', keterangan: 'Tim Medis' },

  // Sekretariat & Administrasi
  { no: 20, nama: 'Noviantono Eko N', jabatan: 'Petugas Pengejaran Sie. Intelijen Bid. Pemberantasan dan Intelijen BNNP Kaltim', pangkatGol: 'BRIPKA / II D', nipNrp: '89110021', keterangan: 'Sekretaris 1' },
  { no: 21, nama: 'Rudyansyah, S.Ak., S.H', jabatan: 'Petugas Bid. Pemberantasan dan Intelijen BNNP Kaltim', pangkatGol: 'BRIGPOL / II C', nipNrp: '93050316', keterangan: 'Sekretariat' },
  { no: 22, nama: 'Titin Renata Naomi Hasugian, S.Pd', jabatan: 'Tenaga Administrasi Bid. Pemberantasan BNNP Kaltim', pangkatGol: '-', nipNrp: '-', keterangan: 'Anggota Petugas Administrasi' },
  { no: 23, nama: 'Putra Muda Sihombing', jabatan: 'Pawang Hewan Unit K9', pangkatGol: 'Pengatur Muda / IIB', nipNrp: '199212152019021008', keterangan: 'Anggota Petugas Administrasi' },
];

interface PublicHeaderProps {
  activePage: 'landing' | 'lacak';
  onGoToLanding: (sectionId?: string) => void;
  onGoToLacak: () => void;
  onGoToLogin: () => void;
  onGoToRegister?: () => void;
  isDetailPage?: boolean;
  onBackFromDetail?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage,
  onGoToLanding,
  onGoToLacak,
  onGoToLogin,
  onGoToRegister,
  isDetailPage,
  onBackFromDetail
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showStrukturModal, setShowStrukturModal] = useState(false);
  const [teamSearch, setTeamSearch] = useState('');
  const [teamCategoryFilter, setTeamCategoryFilter] = useState<string>('semua');

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
        {isDetailPage && onBackFromDetail ? (
          /* Clean Minimal Header on Detail Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackFromDetail}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#0b172a] hover:bg-[#12243d] text-slate-200 hover:text-white border border-[#1b3459] hover:border-[#D4AF37]/50 text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-sm group select-none active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali ke Pencarian</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white font-['Cinzel',serif]">
                E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
              </span>
            </div>
          </div>
        ) : (
          /* Full Header on Landing & Search Pages */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Lockup & Interactive Tim TAT Kaltim Button */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <button
              onClick={() => handleNavClick(() => onGoToLanding())}
              className="flex items-center text-left focus:outline-none cursor-pointer group py-1"
            >
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white font-['Cinzel',serif] truncate group-hover:text-slate-200 transition-colors">
                E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
              </span>
            </button>

            <span className="hidden sm:inline-block text-[#1b3459]">|</span>

            {/* Clickable Tim TAT Kaltim Badge */}
            <button
              type="button"
              onClick={() => setShowStrukturModal(true)}
              title="Klik untuk melihat Struktur Organisasi Tim TAT Kaltim"
              className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-[#D4AF37] bg-[#0d1f38]/60 hover:bg-[#133863] border border-[#1b3459] hover:border-[#D4AF37]/50 transition-all cursor-pointer group"
            >
              <Users className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Tim TAT Kaltim</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-5 lg:space-x-6 shrink-0">
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-6 text-xs font-medium text-slate-300">
              <button
                onClick={() => handleNavClick(() => onGoToLanding('dasar-hukum'))}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Dasar Regulasi
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
            </nav>

            <div className="hidden md:block h-4 w-px bg-[#1b3459]" />

            {/* Login & Register Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={onGoToLogin}
                className="bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-md flex items-center space-x-1.5 transition-all cursor-pointer border border-[#235594]"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-200" />
                <span>Masuk</span>
              </button>

              {onGoToRegister && (
                <button
                  onClick={onGoToRegister}
                  className="bg-transparent hover:bg-[#133863]/40 text-slate-200 hover:text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-all cursor-pointer border border-[#235594] hover:border-sky-400 flex items-center space-x-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-300" />
                  <span>Registrasi</span>
                </button>
              )}
            </div>

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
        )}
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
                <div>
                  <span className="font-extrabold text-base tracking-wider text-white font-['Cinzel',serif] block leading-tight">
                    E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      setShowStrukturModal(true);
                    }}
                    className="inline-flex items-center space-x-1 text-[11px] text-[#D4AF37] font-semibold hover:underline mt-0.5"
                  >
                    <Users className="w-3 h-3 text-[#D4AF37]" />
                    <span>Tim TAT Kaltim (Lihat Struktur)</span>
                  </button>
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
                  onClick={() => handleNavClick(() => onGoToLanding('dasar-hukum'))}
                  className="w-full text-left flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0d1f38] transition-all"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Dasar Regulasi</span>
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
              </nav>
            </div>

            {/* Bottom Action in Drawer */}
            <div className="pt-4 border-t border-[#1b3459] space-y-2">
              <button
                type="button"
                onClick={() => handleNavClick(onGoToLogin)}
                className="w-full bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#235594]"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Masuk Portal SIAP PULIH</span>
              </button>

              {onGoToRegister && (
                <button
                  type="button"
                  onClick={() => handleNavClick(onGoToRegister)}
                  className="w-full bg-transparent hover:bg-[#133863]/40 text-slate-200 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#235594] hover:border-sky-400"
                >
                  <UserPlus className="w-4 h-4 text-slate-300" />
                  <span>Registrasi Akun Baru Satwil</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* DAFTAR NAMA TIM ASESMEN TERPADU MODAL */}
      {showStrukturModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-[#071325] border border-[#1b3459] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Official Kop Header */}
            <div className="px-6 py-5 border-b-2 border-[#D4AF37] bg-[#050c1a] text-center relative shrink-0">
              <button
                type="button"
                onClick={() => setShowStrukturModal(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#133863] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-['Cinzel',serif] tracking-wider uppercase">
                DAFTAR NAMA TIM ASESMEN TERPADU PERUBAHAN KEDUA
              </h3>
              <p className="text-xs text-[#D4AF37] font-semibold tracking-wide uppercase mt-1">
                BADAN NARKOTIKA NASIONAL PROVINSI KALIMANTAN TIMUR &bull; TAHUN 2026
              </p>
              <div className="inline-flex items-center space-x-2 text-[11px] text-slate-400 font-mono mt-1 px-3 py-0.5 rounded-full bg-[#0b172a] border border-[#1b3459]">
                <span>KEP/ /VI/KA/PB.08.00/2026/BNNP</span>
                <span>&bull;</span>
                <span>TANGGAL: JUNI 2026</span>
              </div>
            </div>

            {/* Modal Body: Scrollable Official Org Chart & Table */}
            <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar text-slate-200 space-y-6">
              {/* Bagan Struktur Organisasi */}
              <div className="bg-[#081224] border border-[#1b3459] rounded-xl overflow-hidden shadow-xl p-4 sm:p-5 space-y-4">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider text-center">
                  Bagan Struktur Organisasi Tim Asesmen Terpadu BNNP Kalimantan Timur TA 2026
                </h4>

                {/* Top: Ketua & Wakil Ketua TAT */}
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl w-full">
                    <div className="bg-[#0b172a] border-2 border-[#D4AF37]/70 rounded-xl px-4 py-3 text-center shadow-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                        Ketua TAT
                      </span>
                      <p className="text-sm font-extrabold text-white mt-0.5">
                        Rudy Mulyanto, S.I.K., M.H
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Brigjen Pol. / IV D (NRP. 71040400) &bull; Kepala BNN Provinsi Kaltim
                      </p>
                    </div>
                    <div className="bg-[#0b172a] border-2 border-[#D4AF37]/50 rounded-xl px-4 py-3 text-center shadow-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                        Wakil Ketua TAT
                      </span>
                      <p className="text-sm font-extrabold text-white mt-0.5">
                        Tejo Yuantoro, S.I.K., M.Si
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Kombes Pol. / IV C (NRP. 75050936) &bull; Kabid Pemberantasan BNNP Kaltim
                      </p>
                    </div>
                  </div>
                  <div className="w-px h-5 bg-[#1b3459]" />
                </div>

                {/* 3 Columns: Tim Hukum, Tim Medis, Sekretariat & Administrasi */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tim Hukum */}
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl overflow-hidden">
                    <div className="bg-[#144782] px-3 py-2 text-center text-xs font-bold text-white uppercase tracking-wider">
                      Tim Hukum ({TIM_TAT_LIST.filter(m => m.keterangan === 'Tim Hukum').length} Personel)
                    </div>
                    <div className="p-3 space-y-2 text-xs max-h-72 overflow-y-auto custom-scrollbar">
                      {TIM_TAT_LIST.filter(m => m.keterangan === 'Tim Hukum').map(m => (
                        <div key={m.no} className="bg-[#081224] border border-[#1b3459]/70 rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-white">{m.no}. {m.nama}</span>
                            {m.tim && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#142642] text-sky-300 border border-[#234475] shrink-0">
                                {m.tim}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{m.jabatan}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tim Medis */}
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl overflow-hidden">
                    <div className="bg-emerald-800/80 px-3 py-2 text-center text-xs font-bold text-white uppercase tracking-wider">
                      Tim Medis ({TIM_TAT_LIST.filter(m => m.keterangan === 'Tim Medis').length} Personel)
                    </div>
                    <div className="p-3 space-y-2 text-xs max-h-72 overflow-y-auto custom-scrollbar">
                      {TIM_TAT_LIST.filter(m => m.keterangan === 'Tim Medis').map(m => (
                        <div key={m.no} className="bg-[#081224] border border-[#1b3459]/70 rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-white">{m.no}. {m.nama}</span>
                            {m.tim && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shrink-0">
                                {m.tim}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{m.jabatan}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sekretariat & Administrasi */}
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl overflow-hidden">
                    <div className="bg-slate-800 px-3 py-2 text-center text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                      Sekretariat &amp; Administrasi ({TIM_TAT_LIST.filter(m => m.keterangan === 'Sekretaris 1' || m.keterangan === 'Sekretariat' || m.keterangan === 'Anggota Petugas Administrasi').length} Personel)
                    </div>
                    <div className="p-3 space-y-2 text-xs max-h-72 overflow-y-auto custom-scrollbar">
                      {TIM_TAT_LIST.filter(m => m.keterangan === 'Sekretaris 1' || m.keterangan === 'Sekretariat' || m.keterangan === 'Anggota Petugas Administrasi').map(m => (
                        <div key={m.no} className="bg-[#081224] border border-[#1b3459]/70 rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-white">{m.no}. {m.nama}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#142642] text-amber-300 border border-[#234475] shrink-0">
                              {m.keterangan}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{m.jabatan}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Daftar Nama */}
              <div className="bg-[#081224] border border-[#1b3459] rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0b172a] text-[#D4AF37] border-b border-[#1b3459] font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-3.5 px-3 text-center font-bold border-r border-[#1b3459] w-12">NO.</th>
                        <th className="py-3.5 px-4 font-bold border-r border-[#1b3459]">NAMA</th>
                        <th className="py-3.5 px-4 font-bold border-r border-[#1b3459]">JABATAN</th>
                        <th className="py-3.5 px-4 font-bold border-r border-[#1b3459]">PANGKAT / GOL</th>
                        <th className="py-3.5 px-4 font-bold border-r border-[#1b3459]">NIP / NRP</th>
                        <th className="py-3.5 px-4 text-center font-bold">KETERANGAN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b3459]">
                      {TIM_TAT_LIST.map((member, idx) => {
                        const isPimpinan = member.keterangan === 'Ketua TAT' || member.keterangan === 'Wakil Ketua TAT';
                        return (
                          <tr
                            key={member.no}
                            className={`transition-colors hover:bg-[#133863]/30 ${
                              isPimpinan
                                ? 'bg-[#133863]/40 font-semibold'
                                : idx % 2 === 0
                                ? 'bg-[#071325]/60'
                                : 'bg-[#081224]'
                            }`}
                          >
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-400 border-r border-[#1b3459]">
                              {member.no}
                            </td>
                            <td className="py-3 px-4 border-r border-[#1b3459]">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs ${isPimpinan ? 'font-extrabold text-[#D4AF37]' : 'font-bold text-white'}`}>
                                  {member.nama}
                                </span>
                                {member.tim && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#142642] text-sky-300 border border-[#234475]">
                                    {member.tim}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-[#1b3459] text-slate-200">
                              {member.jabatan}
                            </td>
                            <td className="py-3 px-4 border-r border-[#1b3459] text-slate-300 font-mono text-[11px]">
                              {member.pangkatGol}
                            </td>
                            <td className="py-3 px-4 border-r border-[#1b3459] text-slate-300 font-mono text-[11px]">
                              {member.nipNrp}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded border whitespace-nowrap ${
                                isPimpinan
                                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40'
                                  : member.keterangan === 'Tim Medis'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                                  : 'bg-[#142642] text-slate-200 border-[#234475]'
                              }`}>
                                {member.keterangan}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legality Footer Note */}
              <div className="mt-4 p-3 bg-[#050c1a] border border-[#1b3459] rounded-xl text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="italic text-center sm:text-left">
                  Lampiran Keputusan Kepala BNNP Kaltim Nomor: KEP/ /VI/KA/PB.08.00/2026/BNNP &bull; Tanggal: Juni 2026.
                </span>
                <span className="font-mono text-[#D4AF37] font-bold shrink-0">
                  BNNP Kalimantan Timur
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-[#1b3459] bg-[#050c1a] flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                Total: {TIM_TAT_LIST.length} Personel Tim TAT BNNP Kalimantan Timur TA 2026
              </span>
              <button
                type="button"
                onClick={() => setShowStrukturModal(false)}
                className="bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold text-xs px-6 py-2 rounded-xl transition-all cursor-pointer border border-[#235594] shadow-md"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
