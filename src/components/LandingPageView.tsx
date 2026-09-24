import React, { useState } from 'react';
import { PermohonanAsesmen } from '../types';
import { PoliceEmblem } from './PoliceEmblem';
import { CommandCenterAnalytics } from './CommandCenterAnalytics';
import {
  ShieldCheck,
  ArrowRight,
  LogIn,
  Search,
  CheckCircle2,
  Calendar,
  Users,
  Stethoscope,
  Scale,
  FileSignature,
  Share2,
  Activity,
  BookOpen,
  Building2,
  FileCheck,
  AlertCircle,
  ChevronRight,
  Shield,
  LifeBuoy,
  HeartHandshake,
  Menu,
  X
} from 'lucide-react';

interface LandingPageViewProps {
  onGoToLogin: (presetRole?: string) => void;
  permohonanList: PermohonanAsesmen[];
  onOpenPermohonanDetail?: (id: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGoToLogin,
  permohonanList
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedResult, setTrackedResult] = useState<PermohonanAsesmen | null | 'not_found'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    const query = trackingNumber.trim().toLowerCase();
    const found = permohonanList.find(
      p =>
        p.nomorPermohonan.toLowerCase().includes(query) ||
        p.id.toLowerCase() === query ||
        p.terperiksa.namaLengkap.toLowerCase().includes(query)
    );

    setTrackedResult(found || 'not_found');
  };

  const sampleNumbers = ['TAT-089', 'TAT-074', 'TAT-068', 'TAT-055'];

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col antialiased selection:bg-[#38bdf8] selection:text-slate-950 font-sans">
      {/* Main Clean Header */}
      <header className="sticky top-0 z-40 bg-[#071325]/95 backdrop-blur-md border-b border-[#1b3459]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Lockup */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <PoliceEmblem size="sm" />
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white font-['Cinzel',serif] truncate">
                E-TAT <span className="text-[#D4AF37]">PRESISI</span>
              </span>
              <span className="hidden sm:inline-block text-[#1b3459]">|</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-300">
                SEKORNA <span className="text-slate-400 font-normal">· Asesmen Terpadu</span>
              </span>
            </div>
          </div>

          {/* Right Navigation & Action - Mepet Kanan & Clean */}
          <div className="flex items-center space-x-2 sm:space-x-5 lg:space-x-6 shrink-0">
            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-6 text-xs font-medium text-slate-300">
              <a href="#pantauan-tat" className="hover:text-white transition-colors duration-150">
                Pantauan Kinerja
              </a>
              <a href="#gerakan-sekorna" className="hover:text-white transition-colors duration-150">
                Inisiatif SEKORNA
              </a>
              <a href="#alur-layanan" className="hover:text-white transition-colors duration-150">
                Alur SOP
              </a>
              <a href="#lacak-berkas" className="hover:text-white transition-colors duration-150">
                Lacak Berkas
              </a>
              <a href="#pengawasan" className="hover:text-white transition-colors duration-150">
                Pengawasan
              </a>
              <a href="#dasar-hukum" className="hover:text-white transition-colors duration-150">
                Dasar Regulasi
              </a>
            </nav>

            {/* Subtle Divider before Action */}
            <div className="hidden md:block h-4 w-px bg-[#1b3459]" />

            {/* Primary Action Button (Desktop only on small screens) */}
            <button
              onClick={() => onGoToLogin()}
              className="hidden md:flex bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold text-xs px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md items-center space-x-1.5 transition-all cursor-pointer border border-[#235594]"
            >
              <LogIn className="w-3.5 h-3.5 text-white" />
              <span>Masuk Portal</span>
            </button>

            {/* Hamburger Button (Mobile only) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka Menu Navigasi"
              className="md:hidden p-2 rounded-lg bg-[#0d1f38] hover:bg-[#142d52] text-slate-300 hover:text-white border border-[#1b3459] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Off-Canvas Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar Drawer Sheet */}
          <aside className="fixed inset-y-0 right-0 w-full max-w-[280px] bg-[#071325] border-l border-[#1b3459] shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1b3459]">
                <div className="flex items-center space-x-2.5">
                  <PoliceEmblem size="sm" />
                  <div>
                    <span className="font-extrabold text-sm tracking-wider text-white font-['Cinzel',serif] block">
                      E-TAT <span className="text-[#D4AF37]">PRESISI</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Navigasi Terpadu</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Tutup Menu"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links in Sidebar */}
              <nav className="space-y-1.5">
                <a
                  href="#pantauan-tat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-all"
                >
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span>Pantauan Kinerja</span>
                </a>
                <a
                  href="#gerakan-sekorna"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-all"
                >
                  <LifeBuoy className="w-4 h-4 text-slate-400" />
                  <span>Inisiatif SEKORNA</span>
                </a>
                <a
                  href="#alur-layanan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-all"
                >
                  <FileCheck className="w-4 h-4 text-slate-400" />
                  <span>Alur SOP Layanan</span>
                </a>
                <a
                  href="#lacak-berkas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-all"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Lacak Berkas</span>
                </a>
                <a
                  href="#pengawasan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Pengawasan & SOP</span>
                </a>
                <a
                  href="#dasar-hukum"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-all"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Dasar Regulasi</span>
                </a>
              </nav>
            </div>

            {/* Bottom Action in Sidebar */}
            <div className="pt-4 border-t border-[#1b3459] space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToLogin();
                }}
                className="w-full bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#235594]"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Masuk Portal Presisi</span>
              </button>
              <div className="text-[10px] text-slate-400 text-center font-mono">
                Sistem Terpadu SEKORNA &copy; 2026
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* HERO SECTION - Pure Clean & Authoritative (No Silhouettes, No Graphics, No Colorful Highlights) */}
      <section className="relative overflow-hidden min-h-[calc(100vh-65px)] flex flex-col justify-start sm:justify-center items-center pt-28 pb-16 sm:py-20 bg-[#071326] border-b border-[#1b3459]">
        {/* Subtle Ambient Radial Glow (Clean, Zero Clutter, No Silhouettes) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(20,70,130,0.18)_0%,rgba(7,19,38,0.7)_55%,#071326_100%)]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 sm:my-auto">
          {/* Grand Centered Headline - 3 Lines, Bold on Mobile, Elegant on Desktop */}
          <h1 className="text-[clamp(1.5rem,5.5vw,2.5rem)] lg:text-[2.65rem] font-extrabold text-white tracking-normal sm:tracking-wider leading-[1.25] sm:leading-[1.28] font-['Cinzel',serif] max-w-4xl mx-auto px-2">
            <span className="block animate-hero-title-1">
              SELAMATKAN KORBAN,
            </span>
            <span className="block animate-hero-title-2 text-[#D4AF37]">
              PULIHKAN MASA DEPAN,
            </span>
            <span className="block animate-hero-title-3">
              SIKAT HABIS SINDIKAT.
            </span>
          </h1>

          {/* Concise, High-Impact Description */}
          <p className="animate-hero-desc text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal px-2">
            Sinergi penegakan hukum terpadu: Merehabilitasi korban penyalahguna secara medis dan sosial, serta menindak tegas pengedar demi kepastian hukum.
          </p>
        </div>
      </section>

      {/* COMMAND CENTER MONITORING SECTION */}
      <section id="pantauan-tat" className="py-12 sm:py-16 bg-[#081225] border-b border-[#1b3459]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#0d1f38] px-3.5 py-1.5 rounded-lg border border-[#1b3459]">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>PANTAUAN OPERASIONAL e-TAT</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">
              Dasbor Kinerja Penegakan Hukum & Pemulihan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Statistik pemulihan berkala, status distribusi kasus, log aktivitas waktu-nyata, dan indikator kunci pelayanan Tim Asesmen Terpadu.
            </p>
          </div>

          {/* Embed CommandCenterAnalytics widget */}
          <CommandCenterAnalytics />
        </div>
      </section>

      {/* GERAKAN SEKORNA PHILOSOPHY & ACRONYM SECTION */}
      <section id="gerakan-sekorna" className="py-12 sm:py-16 bg-[#0a182f] border-b border-[#1b3459]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#0d1f38] px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg border border-[#1b3459]">
              <LifeBuoy className="w-3.5 h-3.5 text-slate-400" />
              <span>DOKTRIN & FILOSOFI PENYELAMATAN GENERASI</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif] px-1">
              Inisiatif SEKORNA: SElamatkan KORban NArkotika
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto px-2">
              Singkatan kata <strong className="text-white">SEKORNA</strong> merangkum tekad moral Tim Asesmen Terpadu Polri & BNN: <em className="text-slate-200">memulihkan korban kecanduan dengan rehabilitasi, seraya menumpas pengedar dan bandar tanpa kompromi</em>.
            </p>
          </div>

          {/* 3 Pillar Cards Deconstructing the Acronym */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* SE - Selamatkan */}
            <div className="bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-5 sm:p-6 space-y-3.5 hover:border-[#2a4d80] transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white bg-[#0a182f] border border-[#1b3459] w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center">
                  SE
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-[#0a182f] px-2.5 py-1 rounded-md border border-[#1b3459]">
                  PILAR PERTAMA
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  SElamatkan Jiwa & Hak Hidup
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Penyalahguna dan pecandu adalah korban zat adiktif yang sedang sakit dan membutuhkan intervensi medis serta psikologis sesegera mungkin (maksimal 1x24 jam sejak diamankan). Menyelamatkan mereka berarti menyelamatkan masa depan keluarga dan bangsa.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1b3459] text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-slate-400" />
                <span>Amanat Pasal 54 UU No. 35/2009</span>
              </div>
            </div>

            {/* KOR - Korban Dipulihkan */}
            <div className="bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-5 sm:p-6 space-y-3.5 hover:border-[#2a4d80] transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white bg-[#0a182f] border border-[#1b3459] w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center">
                  KOR
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-[#0a182f] px-2.5 py-1 rounded-md border border-[#1b3459]">
                  PILAR KEDUA
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  KORban Dilindungi, Bukan Dikriminalisasi
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Melalui instrumen WHO ASSIST dan uji laboratorium toksikologi, Tim Asesmen memverifikasi status tersangka secara objektif. Korban murni diarahkan ke rehabilitasi medis dan sosial, menghindarkan mereka dari penularan kriminalitas lapas.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1b3459] text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                <span>Keadilan Restoratif Perpol 08/2021</span>
              </div>
            </div>

            {/* NA - Narkotika Diberantas */}
            <div className="bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-5 sm:p-6 space-y-3.5 hover:border-[#2a4d80] transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white bg-[#0a182f] border border-[#1b3459] w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center">
                  NA
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-[#0a182f] px-2.5 py-1 rounded-md border border-[#1b3459]">
                  PILAR KETIGA
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  NArkotika Diberantas, Bandar Dihukum Maksimal
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Penyelamatan korban berjalan beriringan dengan penegakan hukum tanpa ampun terhadap produsen dan pengedar gelap narkotika. Batas ketat berat barang bukti (SEMA 04/2010) memastikan sindikat tidak dapat menyamar sebagai korban.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1b3459] text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>SEMA 04/2010 & UU 35/2009</span>
              </div>
            </div>
          </div>

          {/* Moral Manifesto Banner */}
          <div className="bg-[#071326] text-white rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 border border-[#1b3459] text-center md:text-left shadow-xl">
            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#0a182f] border border-[#1b3459] flex items-center justify-center shrink-0">
                <LifeBuoy className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">
                  KOMITMEN MORAL PENEGAK HUKUM INDONESIA
                </span>
                <h4 className="text-sm sm:text-lg font-bold text-white mt-0.5">
                  "Satu Nyawa yang Kita Pulihkan adalah Satu Masa Depan Bangsa yang Kita Selamatkan."
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Rehabilitasi adalah wujud kehadiran negara melindungi generasi penerus dari kehancuran narkotika.
                </p>
              </div>
            </div>

            <button
              onClick={() => onGoToLogin()}
              className="w-full md:w-auto bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs px-5 py-3 rounded-xl shrink-0 transition-all cursor-pointer flex items-center justify-center space-x-2 border border-[#235594]"
            >
              <span>Akses Portal Penanganan Berkas</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* TRACKING DOCK SECTION - Clean Docket Search */}
      <section id="lacak-berkas" className="py-12 sm:py-16 bg-[#071326] border-b border-[#1b3459]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-6 sm:mb-7">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 bg-[#0d1f38] px-3 py-1 rounded-md border border-[#1b3459]">
              <Search className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>TERMINAL PELACAKAN DOKET PERKARA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Pemeriksaan Status Berkas Asesmen Terpadu
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto px-2">
              Akses transparan bagi Penyidik Satresnarkoba, Kejaksaan, dan penasihat hukum untuk memeriksa status pemenuhan berkas serta jadwal sidang pleno.
            </p>
          </div>

          <form onSubmit={handleTrack} className="bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Ketik Nomor Permohonan (misal: TAT-089 atau nama)..."
                  className="w-full bg-[#0a182f] text-white pl-10 pr-4 py-2.5 rounded-xl border border-[#1b3459] text-xs sm:text-sm focus:outline-none focus:border-[#38bdf8] font-medium placeholder-slate-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#133863] hover:bg-[#1a4a82] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-all shrink-0 border border-[#235594]"
              >
                <Search className="w-4 h-4 text-white" />
                <span>Cari Doket</span>
              </button>
            </div>

            {/* Quick Sample Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs pt-1">
              <span className="text-slate-400 text-[11px] sm:text-xs">Contoh Doket:</span>
              {sampleNumbers.map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setTrackingNumber(num);
                    const found = permohonanList.find(p => p.nomorPermohonan.includes(num));
                    setTrackedResult(found || 'not_found');
                  }}
                  className="text-[11px] font-mono font-bold bg-[#0a182f] text-slate-300 hover:text-white hover:bg-[#122846] border border-[#1b3459] px-2.5 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </form>

          {/* Search Result Display - Clean Docket Style */}
          {trackedResult && trackedResult !== 'not_found' && (
            <div className="mt-5 sm:mt-6 p-4 sm:p-6 bg-[#0d1f38] border border-[#1b3459] rounded-2xl space-y-4 sm:space-y-5 animate-in fade-in duration-200 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-[#1b3459]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-sm sm:text-base text-white">{trackedResult.nomorPermohonan}</span>
                    <span className="text-[10px] bg-[#0a182f] text-slate-300 font-bold px-2 py-0.5 rounded border border-[#1b3459] uppercase tracking-wider">
                      {trackedResult.statusProsesUtama.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Terperiksa: <strong className="text-white">{trackedResult.terperiksa.namaLengkap}</strong> · Instansi: <span className="text-slate-400">{trackedResult.instansiPengaju}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right text-xs">
                  <span className="text-slate-400">Tanggal Pengajuan:</span>
                  <div className="font-bold text-white font-mono">{trackedResult.tanggalPengajuan}</div>
                </div>
              </div>

              {/* Progress 3 Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
                <div className="bg-[#0a182f] p-3 sm:p-3.5 rounded-xl border border-[#1b3459]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Kepatuhan Formil Legalitas</span>
                  <span className="font-bold text-white block mt-1 font-mono">
                    {trackedResult.dokumenList.filter(d => d.statusVerifikasi === 'sesuai').length} / 7 Dokumen Sah
                  </span>
                </div>
                <div className="bg-[#0a182f] p-3 sm:p-3.5 rounded-xl border border-[#1b3459]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Asesmen Medis & Hukum</span>
                  <span className="font-bold text-white block mt-1">
                    {trackedResult.asesmenMedis && trackedResult.asesmenHukum ? 'Selesai Dilaksanakan' : 'Dalam Proses Telaah'}
                  </span>
                </div>
                <div className="bg-[#0a182f] p-3 sm:p-3.5 rounded-xl border border-[#1b3459]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Rekomendasi</span>
                  <span className="font-bold text-white block mt-1">
                    {trackedResult.rekomendasiResmi ? 'Sah Diterbitkan (QR Siber)' : 'Menunggu Sidang Pleno'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onGoToLogin()}
                  className="w-full sm:w-auto bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#235594]"
                >
                  <span>Buka Berkas di Portal Petugas</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          )}

          {trackedResult === 'not_found' && (
            <div className="mt-4 p-3.5 sm:p-4 bg-[#0a182f] border border-[#1b3459] rounded-xl text-xs text-slate-300 flex items-start sm:items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>Nomor registrasi doket perkara atau nama tersangka tidak ditemukan dalam basis data e-TAT. Mohon periksa kembali nomor permohonan Anda.</span>
            </div>
          )}
        </div>
      </section>

      {/* 8 STAGES OF WORKFLOW SOP - Deep Navy Grid */}
      <section id="alur-layanan" className="py-12 sm:py-16 bg-[#0a182f] border-b border-[#1b3459]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#0d1f38] px-3 py-1 rounded-md border border-[#1b3459]">
              STANDAR OPERASIONAL PROSEDUR (SOP)
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight font-['Cinzel',serif] px-1">
              8 Tahapan Alur Terpadu Penanganan Perkara e-TAT
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 px-2">
              Siklus akuntabilitas penegakan hukum dari pendaftaran tangkapan 1x24 jam hingga pengawasan pasca asesmen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                step: '01',
                title: 'Registrasi Tangkapan 1x24 Jam',
                actor: 'Penyidik Satresnarkoba / BNN',
                desc: 'Maksimal 1x24 jam sejak tersangka diamankan dengan unggah 7 berkas formil persyaratan hukum.',
                icon: <FileCheck className="w-5 h-5 text-slate-300" />
              },
              {
                step: '02',
                title: 'Uji Formil Berkas Legalitas',
                actor: 'Sekretariat TAT',
                desc: 'Pemeriksaan keabsahan Sprintik, BAP, BA Penangkapan, BA Penggeledahan, dan Surat Permohonan.',
                icon: <CheckCircle2 className="w-5 h-5 text-slate-300" />
              },
              {
                step: '03',
                title: 'Disposisi Surat Perintah Asesmen',
                actor: 'Sekretariat & Koordinator',
                desc: 'Penetapan Surat Perintah Tugas Asesor Medis, Asesor Hukum, ruang klinis, dan jadwal waktu.',
                icon: <Calendar className="w-5 h-5 text-slate-300" />
              },
              {
                step: '04',
                title: 'Pemeriksaan Forensik & Yuridis',
                actor: 'Tim Asesor Medis & Hukum',
                desc: 'Wawancara instrumen WHO ASSIST, uji skrining urin laboratorium, serta telaah batas berat SEMA 04/2010.',
                icon: <Stethoscope className="w-5 h-5 text-slate-300" />
              },
              {
                step: '05',
                title: 'Sidang Pleno Komparatif',
                actor: 'Koordinator & Seluruh Asesor',
                desc: 'Musyawarah pleno menyatukan diagnosis medis dan status hukum peran perkara tersangka.',
                icon: <Users className="w-5 h-5 text-slate-300" />
              },
              {
                step: '06',
                title: 'Pengesahan Rekomendasi Terpadu',
                actor: '3 Pihak: Koordinator, Medis, Hukum',
                desc: 'Penandatanganan digital resmi dan penerbitan sertifikat QR Code anti-pemalsuan siber.',
                icon: <FileSignature className="w-5 h-5 text-slate-300" />
              },
              {
                step: '07',
                title: 'Koordinasi Rujukan & Eksekusi',
                actor: 'Balai Rehabilitasi & Penyidik',
                desc: 'Konfirmasi kuota kamar, pengawalan tersangka ke balai rehabilitasi, serta pelimpahan berkas P-21.',
                icon: <Share2 className="w-5 h-5 text-slate-300" />
              },
              {
                step: '08',
                title: 'Pengawasan Kepatuhan Pasca TAT',
                actor: 'Konselor, Penyidik & Bapas',
                desc: 'Pemantauan wajib lapor mingguan, uji skrining urin acak bebas relapse, sanksi SP, dan SKSP kelulusan.',
                icon: <Activity className="w-5 h-5 text-slate-300" />
              }
            ].map(item => (
              <div
                key={item.step}
                className="bg-[#0d1f38] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#1b3459] space-y-2.5 hover:border-[#2a4d80] transition-all group shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0a182f] border border-[#1b3459] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono font-extrabold text-xs sm:text-sm text-slate-500 group-hover:text-slate-300 transition-colors">{item.step}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">{item.actor}</span>
                  <h3 className="font-bold text-xs sm:text-sm text-white mt-1">{item.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PENGAWASAN PASCA TAT */}
      <section id="pengawasan" className="py-12 sm:py-16 bg-[#071326] border-b border-[#1b3459]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0d1f38] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-[#1b3459] shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#0a182f] px-3 py-1 rounded-md border border-[#1b3459]">
                  PENEGAKAN INTEGRITAS KLIEN (AFTERCARE)
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">
                  Mekanisme Pengawasan Kepatuhan & Sanksi Pencabutan Restorative Justice
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Penyelesaian perkara melalui Keadilan Restoratif bukanlah pembebasan tanpa syarat. Tersangka wajib menjalani program rehabilitasi dengan kepatuhan penuh. Sistem e-TAT mencatat buku monitoring wajib lapor berkala, uji urin acak bebas relapse, dan sanksi Surat Peringatan (SP-1, SP-2, SP-3) hingga rekomendasi pelimpahan kembali ke proses peradilan pidana jika melanggar komitmen.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2 text-xs font-semibold">
                  <div className="bg-[#0a182f] p-2.5 sm:p-3 rounded-xl border border-[#1b3459] text-center">
                    <span className="text-white font-bold block text-xs sm:text-sm">Wajib Lapor</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Mingguan / Berkala</span>
                  </div>
                  <div className="bg-[#0a182f] p-2.5 sm:p-3 rounded-xl border border-[#1b3459] text-center">
                    <span className="text-white font-bold block text-xs sm:text-sm">Uji Toksikologi</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Acak Bebas Relapse</span>
                  </div>
                  <div className="bg-[#0a182f] p-2.5 sm:p-3 rounded-xl border border-[#1b3459] text-center">
                    <span className="text-white font-bold block text-xs sm:text-sm">Sanksi SP-1/3</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Pencabutan Hak RJ</span>
                  </div>
                  <div className="bg-[#0a182f] p-2.5 sm:p-3 rounded-xl border border-[#1b3459] text-center">
                    <span className="text-white font-bold block text-xs sm:text-sm">Sertifikat SKSP</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Kelulusan Resmi</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
                <button
                  onClick={() => onGoToLogin()}
                  className="w-full bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs sm:text-sm py-3 sm:py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#235594]"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Buka Buku Pengawasan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASAR REGULASI RESMI */}
      <section id="dasar-hukum" className="py-12 sm:py-16 bg-[#0a182f] border-b border-[#1b3459]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center justify-center space-x-2 font-['Cinzel',serif] px-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              <span>Landasan Hukum Operasional Perkara</span>
            </h2>
            <p className="text-xs text-slate-400 px-2">
              Dasar yuridis formal yang mengikat seluruh instansi dalam Tim Asesmen Terpadu Republik Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div className="bg-[#0d1f38] p-3.5 sm:p-4 rounded-xl border border-[#1b3459] space-y-1">
              <span className="font-bold text-white block text-xs sm:text-sm">UU No. 35 Tahun 2009</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">Pasal 54 & 103: Mandat rehabilitasi medis & sosial bagi pecandu dan korban penyalahgunaan narkotika.</p>
            </div>
            <div className="bg-[#0d1f38] p-3.5 sm:p-4 rounded-xl border border-[#1b3459] space-y-1">
              <span className="font-bold text-white block text-xs sm:text-sm">SEMA No. 04 Tahun 2010</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">Pedoman batasan berat barang bukti untuk pemakaian 1 hari (sabu maksimal 1 gram).</p>
            </div>
            <div className="bg-[#0d1f38] p-3.5 sm:p-4 rounded-xl border border-[#1b3459] space-y-1">
              <span className="font-bold text-white block text-xs sm:text-sm">Perpol No. 08 Tahun 2021</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">Penerapan Keadilan Restoratif (Restorative Justice) dalam penanganan tindak pidana di lingkungan Polri.</p>
            </div>
            <div className="bg-[#0d1f38] p-3.5 sm:p-4 rounded-xl border border-[#1b3459] space-y-1">
              <span className="font-bold text-white block text-xs sm:text-sm">Perja No. 15 Tahun 2020</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">Penghentian penuntutan perkara pidana berdasarkan keadilan restoratif pada Kejaksaan RI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050e1c] text-slate-400 text-xs py-8 sm:py-10 border-t border-[#12233c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <PoliceEmblem size="md" />
            <div>
              <span className="font-bold text-white block text-xs sm:text-sm font-['Cinzel',serif]">
                E-TAT PRESISI · INISIATIF SEKORNA
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400">
                SElamatkan KORban NArkotika · Sentra Terpadu Polri & BNN
              </span>
            </div>
          </div>

          <div className="sm:text-right text-[10px] sm:text-[11px] space-y-0.5">
            <p className="text-slate-300">© {new Date().getFullYear()} Kepolisian Negara Republik Indonesia & Badan Narkotika Nasional.</p>
            <p className="text-slate-500">Rastra Sewakotama · Abdi Utama daripada Nusa dan Bangsa</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

