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
  Info
} from 'lucide-react';

export interface TimTatMember {
  no: number;
  nama: string;
  jabatan: string;
  pangkatGol: string;
  nipNrp: string;
  keterangan: 'Ketua Tim TAT' | 'Tim Hukum' | 'Tim Medis' | 'Tim Psikolog' | 'Tim Sekretariat';
}

export const TIM_TAT_LIST: TimTatMember[] = [
  { no: 1, nama: 'Risnoto, S.H., M.H', jabatan: 'Kepala BNN Kabupaten Kutai Timur', pangkatGol: 'AKBP / IV-B', nipNrp: '69010124', keterangan: 'Ketua Tim TAT' },
  { no: 2, nama: 'Irwansyah, S.H', jabatan: 'Jaksa Penuntut Umum', pangkatGol: 'Ajun Jaksa / III-B', nipNrp: '199510042020121011', keterangan: 'Tim Hukum' },
  { no: 3, nama: 'Elsa Chairunnisa, S.H', jabatan: 'Analis Penuntutan dan Penegakan Hukum', pangkatGol: 'Yuana Wira / III-A', nipNrp: '200101212024042001', keterangan: 'Tim Hukum' },
  { no: 4, nama: 'Andi Ishak, S.H', jabatan: 'Petugas Pengejaran Seksi Intelijen Bidang Pemberantasan dan Intelijen BNNP Kaltim', pangkatGol: 'AIPDA / II-E', nipNrp: '84031446', keterangan: 'Tim Hukum' },
  { no: 5, nama: 'Supriadi, S.H., M.H', jabatan: 'Penyidik BNN Kab. Kutai Timur', pangkatGol: 'AIPDA / II-E', nipNrp: '85031825', keterangan: 'Tim Hukum' },
  { no: 6, nama: 'Budiansyah, S.H', jabatan: 'Kanit I Satresnarkoba Polres Kutim', pangkatGol: 'IPDA / III-A', nipNrp: '87111286', keterangan: 'Tim Hukum' },
  { no: 7, nama: 'Muhamad Said Athar, S.H', jabatan: 'Banit Resnarkoba Polres Kutim', pangkatGol: 'BRIPTU / II-B', nipNrp: '00030240', keterangan: 'Tim Hukum' },
  { no: 8, nama: 'dr. Raina Sari Wulan', jabatan: 'Konselor BNN Kabupaten Kutai Timur', pangkatGol: 'Penata Muda Tk. I / III-B', nipNrp: '198805202020122009', keterangan: 'Tim Medis' },
  { no: 9, nama: 'dr. Milka Datu Tasik L.A', jabatan: 'Ahli Pertama Dokter', pangkatGol: 'Ahli Pertama / X', nipNrp: '199308272024212030', keterangan: 'Tim Medis' },
  { no: 10, nama: 'Fufahanna S.Psi., M.Psi', jabatan: 'Ketua Himpsi', pangkatGol: '-', nipNrp: '-', keterangan: 'Tim Psikolog' },
  { no: 11, nama: 'Syarifah Nur Latifah, M.Psi', jabatan: 'Wakil Ketua Himpsi', pangkatGol: '-', nipNrp: '-', keterangan: 'Tim Psikolog' },
  { no: 12, nama: 'Eko Prasetya Prayoko, S.Sos', jabatan: 'Kasubbag Umum BNN Kutai Timur', pangkatGol: 'Penata Muda TK I', nipNrp: '198507102010011001', keterangan: 'Tim Sekretariat' },
  { no: 13, nama: 'Veronica Febrianty, S.A.P', jabatan: 'Staff Bagian Umum', pangkatGol: '-', nipNrp: '689806008', keterangan: 'Tim Sekretariat' }
];

interface PublicHeaderProps {
  activePage: 'landing' | 'lacak';
  onGoToLanding: (sectionId?: string) => void;
  onGoToLacak: () => void;
  onGoToLogin: () => void;
  onGoToRegister?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage,
  onGoToLanding,
  onGoToLacak,
  onGoToLogin,
  onGoToRegister
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
                DAFTAR NAMA TIM ASESMEN TERPADU
              </h3>
              <p className="text-xs text-[#D4AF37] font-semibold tracking-wide uppercase mt-1">
                LAMPIRAN KEPUTUSAN KEPALA BNNK KUTAI TIMUR
              </p>
              <div className="inline-flex items-center space-x-2 text-[11px] text-slate-400 font-mono mt-1 px-3 py-0.5 rounded-full bg-[#0b172a] border border-[#1b3459]">
                <span>NOMOR: KEP/9/VIII/KA/PB.06.06/2026/BNNK-KUTIM</span>
                <span>&bull;</span>
                <span>TANGGAL: 05 AGUSTUS 2026</span>
              </div>
            </div>

            {/* Modal Body: Scrollable Official Table */}
            <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar text-slate-200 space-y-6">
              {/* Struktur Organisasi Image */}
              <div className="bg-[#081224] border border-[#1b3459] rounded-xl overflow-hidden shadow-xl p-3 flex flex-col items-center justify-center">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
                  Bagan Struktur Organisasi Tim Asesmen Terpadu
                </h4>
                <img 
                  src="/struktur.png" 
                  alt="Bagan Struktur Organisasi Tim TAT" 
                  className="w-full h-auto object-contain rounded border border-[#1b3459]/50 shadow-md bg-white/5" 
                />
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
                        const isKetua = member.keterangan === 'Ketua Tim TAT';
                        return (
                          <tr
                            key={member.no}
                            className={`transition-colors hover:bg-[#133863]/30 ${
                              isKetua
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
                              <span className={`text-xs block ${isKetua ? 'font-extrabold text-[#D4AF37]' : 'font-bold text-white'}`}>
                                {member.nama}
                              </span>
                            </td>
                            <td className="py-3 px-4 border-r border-[#1b3459] text-slate-200">
                              {member.jabatan}
                            </td>
                            <td className="py-3 px-4 border-r border-[#1b3459] text-slate-300 font-mono text-[11px]">
                              {member.pangkatGol}
                            </td>
                            <td className="py-3 px-4 border-r border-[#1b3459] font-mono text-slate-300 text-[11px]">
                              {member.nipNrp}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded border ${
                                isKetua
                                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40'
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
                  Dokumen ini telah ditandatangani secara elektronik menggunakan Sertifikat Elektronik yang dikeluarkan oleh Balai Besar Sertifikasi Elektronik (BSrE), BSSN.
                </span>
                <span className="font-mono text-[#D4AF37] font-bold shrink-0">
                  BNNK Kutai Timur
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-[#1b3459] bg-[#050c1a] flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                Total Personel: 13 Anggota Tim TAT Kutai Timur
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
