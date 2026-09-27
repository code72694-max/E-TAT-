import React, { useState, useEffect } from 'react';
import { PermohonanAsesmen } from '../types';
import { PoliceEmblem } from './PoliceEmblem';
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
  ChevronLeft,
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

  // Hero Carousel State (siapsespimpolri.id style with auto-slide & distinct content)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const heroSlides = [
    {
      id: 0,
      titlePart1: 'SELAMATKAN KORBAN,',
      titleHighlight: 'PULIHKAN MASA DEPAN,',
      titlePart2: 'SIKAT HABIS SINDIKAT.',
      description:
        'Sinergi penegakan hukum terpadu Tim Asesmen Terpadu (TAT) Ditresnarkoba Polda & BNNP Kalimantan Timur: Merehabilitasi korban penyalahguna secara medis dan sosial, serta menindak tegas sindikat demi kepastian hukum berkeadilan.',
      image: '/images/hero/slide-asesmen.jpg',
      imageAlt: 'Pertemuan Koordinasi Tim Asesmen Terpadu BNN & Polri'
    },
    {
      id: 1,
      titlePart1: 'HARAPAN BARU,',
      titleHighlight: 'PULIH BERSAMA LAYANAN REHABILITASI,',
      titlePart2: 'MENUJU MASA DEPAN GEMILANG.',
      description:
        'Pendampingan medis dan psikososial berstandar nasional bersama Klinik Pratama BNN dan Balai Rehabilitasi Tanah Merah untuk memutus siklus adiksi narkotika serta mengembalikan martabat generasi bangsa.',
      image: '/images/hero/slide-rehabilitasi.jpg',
      imageAlt: 'Konsultasi Medis dan Rehabilitasi Penyalahguna Narkotika Klinik Pratama BNN'
    },
    {
      id: 2,
      titlePart1: 'UJI LABORATORIUM,',
      titleHighlight: 'FORENSIK PRESISI & TRANSPARAN,',
      titlePart2: 'BEBAS DARI INTERVENSI.',
      description:
        'Pengujian toksikologi urin dan verifikasi barang bukti narkotika bersama Puslabfor Bareskrim Polri dan Laboratorium BNN secara ilmiah, akuntabel, dan mengedepankan integritas pembuktian hukum.',
      image: '/images/hero/slide-forensik.jpg',
      imageAlt: 'Uji Laboratorium Forensik Narkotika dan Toksikologi Puslabfor Polri'
    }
  ];

  // Auto sliding timer (5.5 seconds per slide, pause on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const goToNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col antialiased selection:bg-[#D4AF37]/30 selection:text-white font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.55s ease forwards;
        }
        .fade-in-up-delay-1 { animation-delay: 0.08s; }
        .fade-in-up-delay-2 { animation-delay: 0.16s; }
        .fade-in-up-delay-3 { animation-delay: 0.24s; }
        .fade-in-up-delay-4 { animation-delay: 0.32s; }
        .fade-in-up-delay-5 { animation-delay: 0.40s; }
        .fade-in-up-delay-6 { animation-delay: 0.48s; }
        .fade-in-up-delay-7 { animation-delay: 0.56s; }
        .fade-in-up-delay-8 { animation-delay: 0.64s; }
      `}</style>
      {/* Main Clean Header */}
      <header className="sticky top-0 z-40 bg-[#071325]/95 backdrop-blur-md border-b border-[#1b3459]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Lockup */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <PoliceEmblem size="sm" />
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white font-['Cinzel',serif] truncate">
                E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
              </span>
              <span className="hidden sm:inline-block text-[#1b3459]">|</span>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                BNNP Kalimantan Timur
              </span>
            </div>
          </div>

          {/* Right Navigation & Action - Mepet Kanan & Clean */}
          <div className="flex items-center space-x-2 sm:space-x-5 lg:space-x-6 shrink-0">
            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-6 text-xs font-medium text-slate-300">
              <a href="#tentang-tat" className="hover:text-white transition-colors duration-150">
                Tentang E-TAT
              </a>
              <a href="#gerakan-sekorna" className="hover:text-white transition-colors duration-150">
                Konsep SIAP PULIH
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
                      E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">BNNP Kalimantan Timur</span>
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
                  href="#tentang-tat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Tentang E-TAT</span>
                </a>
                <a
                  href="#gerakan-sekorna"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0d1f38] border border-transparent hover:border-[#1b3459] transition-all"
                >
                  <LifeBuoy className="w-4 h-4 text-slate-400" />
                  <span>Konsep SIAP PULIH</span>
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
                <span>Masuk Portal SIAP PULIH</span>
              </button>
              <div className="text-[10px] text-slate-400 text-center font-mono">
                Sistem e-TAT SIAP PULIH &copy; 2026 BNNP Kaltim
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* HERO SLIDER SECTION - SIAP SESPIM STYLE WITH AUTO SLIDE, FULL-PAGE HEIGHT & CLEAN POLICE/REHAB IMAGERY */}
      <section
        id="hero-carousel"
        className="relative overflow-hidden h-[calc(100vh-4rem)] min-h-[580px] flex items-center bg-[#071326] border-b border-[#1b3459] select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Slides */}
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Photo Background with subtle zoom effect */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                style={{ backgroundImage: `url('${slide.image}')` }}
                role="img"
                aria-label={slide.imageAlt}
              />

              {/* Dark Gradient Overlays for High Contrast & Clean Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#071326] via-[#071326]/85 to-[#071326]/30 lg:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071326] via-transparent to-[#071326]/70" />
              <div className="absolute inset-0 bg-[#071326]/20 backdrop-blur-[0.5px]" />
            </div>
          );
        })}

        {/* Content Container - Shifted higher up for clean balance */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -translate-y-6 sm:-translate-y-10 lg:-translate-y-12">
          <div className="max-w-2xl space-y-4">
            {/* Animated Slide Content Box - Clean without label badges */}
            <div key={currentSlide} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Clean Headline */}
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide leading-snug font-['Cinzel',serif] drop-shadow-md">
                <span className="block text-slate-100">
                  {heroSlides[currentSlide].titlePart1}
                </span>
                <span className="block text-[#D4AF37] my-1">
                  {heroSlides[currentSlide].titleHighlight}
                </span>
                <span className="block text-slate-200 text-lg sm:text-2xl lg:text-3xl font-bold">
                  {heroSlides[currentSlide].titlePart2}
                </span>
              </h1>

              {/* Clean Description */}
              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal drop-shadow-sm">
                {heroSlides[currentSlide].description}
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Prev & Next Navigation Buttons (Like siapsespimpolri.id carousel-control-prev/next) */}
        <button
          type="button"
          onClick={goToPrevSlide}
          aria-label="Slide sebelumnya"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#071326]/70 hover:bg-[#0d1f38] text-white/80 hover:text-white border border-[#1b3459] hover:border-[#D4AF37]/60 backdrop-blur-md shadow-xl transition-all cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          type="button"
          onClick={goToNextSlide}
          aria-label="Slide berikutnya"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#071326]/70 hover:bg-[#0d1f38] text-white/80 hover:text-white border border-[#1b3459] hover:border-[#D4AF37]/60 backdrop-blur-md shadow-xl transition-all cursor-pointer group"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Bottom Carousel Indicators */}
        <div className="absolute bottom-8 sm:bottom-10 inset-x-0 z-30 flex justify-center pointer-events-auto">
          {/* Slide Indicator Pills */}
          <div className="flex items-center space-x-2 bg-[#071326]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#1b3459]">
            {heroSlides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Pindah ke slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-7 sm:w-8 h-2.5 bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/40'
                      : 'w-2.5 h-2.5 bg-slate-500/60 hover:bg-slate-300'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="tentang-tat" className="py-20 sm:py-24 bg-[#081225] border-b border-[#1b3459]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">Tentang Sistem</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Cinzel',serif] mb-4">
              E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Sarana digital terpadu BNNP Kalimantan Timur &amp; Polda Kaltim untuk asesmen, rekomendasi, dan pemantauan pemulihan narkotika.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
            {/* Left: Core Mission */}
            <div className="lg:col-span-2 bg-[#0b172a] border border-[#1b3459]/80 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <Shield className="w-7 h-7 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-white font-['Cinzel',serif] leading-snug">
                  Satu Sistem,<br />Satu Data, Satu Keputusan
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  E-TAT menyatukan penyidik, tim medis, dan tim hukum dalam satu alur kerja digital â€” menghilangkan redundansi berkas, memastikan SLA 6 hari kerja, dan menjamin transparansi penuh sesuai UU No. 35/2009 &amp; Perpol 08/2021.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1b3459]/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Status Asesmen</span>
                  <span className="text-[#D4AF37] font-bold">Rekomendasi Terbit</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Status Pemulihan</span>
                  <span className="text-white font-bold">Dalam Pemantauan</span>
                </div>
              </div>
            </div>

            {/* Right: 4 Pillars */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: <FileCheck className="w-4 h-4" />, title: 'Satu Data Berkas', sub: '7 berkas formil terpadu', desc: 'Eliminasi pencatatan ganda â€” LP, BAP, bukti lab, NIK, semua dalam satu perkara digital.' },
                { icon: <Calendar className="w-4 h-4" />, title: 'SLA 6 Hari Kerja', sub: 'Registrasi s.d. rekomendasi', desc: 'Waktu layanan terukur dari 1Ã—24 jam registrasi hingga sidang pleno penetapan.' },
                { icon: <Users className="w-4 h-4" />, title: 'Tim Multidisiplin', sub: '6 peran terpisah', desc: 'Penyidik, medis, hukum, sekretariat, pimpinan, &amp; pemantau â€” independen &amp; terstruktur.' },
                { icon: <HeartHandshake className="w-4 h-4" />, title: 'Monitoring Pasca Rehab', sub: 'Berkelanjutan', desc: 'Pantauan rujukan Balai BNN, uji urin berkala, dan rekam kepatuhan hingga SKSP terbit.' },
              ].map((p, i) => (
                <div key={i} className={`fade-in-up fade-in-up-delay-${i + 1} bg-[#071326] border border-[#1b3459]/70 rounded-xl p-4 sm:p-5 space-y-2 hover:border-[#D4AF37]/30 transition-colors duration-300`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#0d1f38] border border-[#1b3459] flex items-center justify-center text-slate-400">
                      {p.icon}
                    </div>
                    <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{p.sub}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{p.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SIAP PULIH TEGAS â€” 3 Pilar */}
      <section id="gerakan-sekorna" className="py-20 sm:py-24 bg-[#071326] border-b border-[#1b3459]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">Doktrin Operasional</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">
              SIAP · PULIH · TEGAS
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">Tiga komitmen Tim Asesmen Terpadu BNNP Kalimantan Timur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { word: 'SIAP', pillar: 'I', title: 'Sinergi Integrasi Asesmen', sub: 'UU 35/2009 · Perpol 08/2021', desc: 'Penyidik, dokter, jaksa bekerja terpadu dalam satu data. SLA 6 hari kerja dijamin sistem.', icon: <HeartHandshake className="w-4 h-4" /> },
              { word: 'PULIH', pillar: 'II', title: 'Pantauan Pemulihan Klien', sub: 'Balai BNN · RSUD · Klinik Pratama', desc: 'Pemantauan ketat pasca-asesmen dengan tes urin berkala dan evaluasi kepatuhan program rehab.', icon: <Scale className="w-4 h-4" /> },
              { word: 'TEGAS', pillar: 'III', title: 'Penegakan Hukum Tanpa Kompromi', sub: 'SEMA 04/2010 · Kepastian Peradilan', desc: 'Penindakan maksimal sindikat pengedar, dipisah jelas dari penyelamatan korban penyalahguna.', icon: <ShieldCheck className="w-4 h-4" /> },
            ].map((p, i) => (
              <div key={i} className={`fade-in-up fade-in-up-delay-${i + 1} group bg-[#0d1f38] border border-[#1b3459]/70 rounded-2xl p-6 sm:p-7 hover:border-[#D4AF37]/25 transition-colors duration-300`}>
                <div className="flex items-start justify-between mb-5">
                  <span className="font-mono font-black text-2xl sm:text-3xl text-[#D4AF37] leading-none tracking-tight">{p.word}</span>
                  <span className="text-[9px] font-mono text-slate-600 mt-1">PILAR {p.pillar}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{p.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-5">{p.desc}</p>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-600 border-t border-[#1b3459]/60 pt-4">
                  <div className="shrink-0">{p.icon}</div>
                  <span>{p.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-8 sm:mt-10 border border-[#1b3459]/60 rounded-2xl p-6 sm:p-8 bg-[#0b172a] text-center">
            <p className="text-sm sm:text-base font-semibold text-white italic leading-relaxed max-w-2xl mx-auto">
              "Satu Nyawa yang Kita Pulihkan adalah Satu Masa Depan Bangsa yang Kita Selamatkan."
            </p>
            <span className="text-[10px] text-slate-500 mt-2 block uppercase tracking-widest font-mono">Komitmen Moral Penegak Hukum Indonesia</span>
          </div>
        </div>
      </section>

      {/* LACAK BERKAS */}
      <section id="lacak-berkas" className="py-20 sm:py-24 bg-[#081225] border-b border-[#1b3459]/60">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">Pelacakan Perkara</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">Cek Status Berkas</h2>
            <p className="text-xs text-slate-400 mt-3 max-w-sm mx-auto">Akses transparan untuk Penyidik, Jaksa, dan penasihat hukum.</p>
          </div>

          <form onSubmit={handleTrack} className="space-y-3">
            <div className="flex gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Nomor permohonan atau nama terperiksa..."
                  className="w-full bg-[#071326] text-white pl-10 pr-4 py-3 rounded-xl border border-[#1b3459] text-sm focus:outline-none focus:border-[#D4AF37]/50 placeholder-slate-600 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 bg-[#D4AF37] hover:bg-[#c4a030] text-[#071326] font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-600">Contoh:</span>
              {sampleNumbers.map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => { setTrackingNumber(num); const found = permohonanList.find(p => p.nomorPermohonan.includes(num)); setTrackedResult(found || 'not_found'); }}
                  className="font-mono text-slate-400 hover:text-[#D4AF37] bg-[#0d1f38] border border-[#1b3459] px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </form>

          {trackedResult && trackedResult !== 'not_found' && (
            <div className="mt-5 bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between pb-3 border-b border-[#1b3459]/60 gap-3">
                <div>
                  <span className="font-mono font-bold text-white text-sm">{trackedResult.nomorPermohonan}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{trackedResult.terperiksa.namaLengkap} · {trackedResult.instansiPengaju}</p>
                </div>
                <span className="text-[9px] bg-[#071326] text-slate-400 font-bold px-2 py-1 rounded border border-[#1b3459] uppercase tracking-wider shrink-0">
                  {trackedResult.statusProsesUtama.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Dokumen', val: `${trackedResult.dokumenList.filter(d => d.statusVerifikasi === 'sesuai').length}/7` },
                  { label: 'Asesmen', val: trackedResult.asesmenMedis && trackedResult.asesmenHukum ? 'Selesai' : 'Proses' },
                  { label: 'Rekomendasi', val: trackedResult.rekomendasiResmi ? 'Terbit' : 'Pending' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#071326] rounded-lg p-2.5 border border-[#1b3459]/60">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider">{s.label}</span>
                    <span className="font-bold text-white text-xs font-mono">{s.val}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => onGoToLogin()} className="w-full text-xs font-semibold text-slate-400 hover:text-white py-2.5 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-[#1b3459] rounded-xl hover:border-[#1b3459]">
                <span>Buka di Portal Petugas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {trackedResult === 'not_found' && (
            <div className="mt-4 p-4 bg-[#071326] border border-[#1b3459]/60 rounded-xl text-[11px] text-slate-500 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
              <span>Nomor atau nama tersangka tidak ditemukan dalam basis data e-TAT.</span>
            </div>
          )}
        </div>
      </section>

      {/* ALUR SOP */}
      <section id="alur-layanan" className="py-20 sm:py-24 bg-[#071326] border-b border-[#1b3459]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">Alur Terpadu</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">8 Tahapan SOP</h2>
            <p className="text-sm text-slate-400 mt-3 max-w-sm mx-auto">Dari registrasi 1Ã—24 jam hingga kelulusan program pemulihan.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { step: '01', title: 'Registrasi', actor: 'Penyidik / BNN', icon: <FileCheck className="w-4 h-4" /> },
              { step: '02', title: 'Verifikasi Berkas', actor: 'Sekretariat TAT', icon: <CheckCircle2 className="w-4 h-4" /> },
              { step: '03', title: 'Surat Perintah', actor: 'Sek. & Koordinator', icon: <Calendar className="w-4 h-4" /> },
              { step: '04', title: 'Forensik & Yuridis', actor: 'Tim Medis & Hukum', icon: <Stethoscope className="w-4 h-4" /> },
              { step: '05', title: 'Sidang Pleno', actor: 'Koordinator & Asesor', icon: <Users className="w-4 h-4" /> },
              { step: '06', title: 'Pengesahan QR', actor: '3 Pihak Resmi', icon: <FileSignature className="w-4 h-4" /> },
              { step: '07', title: 'Rujukan & Eksekusi', actor: 'Balai Rehab & Penyidik', icon: <Share2 className="w-4 h-4" /> },
              { step: '08', title: 'Pengawasan SKSP', actor: 'Konselor & Bapas', icon: <Activity className="w-4 h-4" /> },
            ].map((item, i) => (
              <div key={item.step} className={`fade-in-up fade-in-up-delay-${Math.min(i + 1, 8)} group bg-[#0d1f38] border border-[#1b3459]/70 rounded-xl p-4 sm:p-5 hover:border-[#D4AF37]/25 transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#071326] border border-[#1b3459]/60 flex items-center justify-center text-slate-500">
                    {item.icon}
                  </div>
                  <span className="font-mono text-base font-black text-[#1b3459] group-hover:text-[#D4AF37]/40 transition-colors">{item.step}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">{item.title}</h3>
                <p className="text-[10px] text-slate-600 mt-0.5">{item.actor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFTERCARE + REGULASI */}
      <section id="pengawasan" className="py-20 sm:py-24 bg-[#081225] border-b border-[#1b3459]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">

            {/* Aftercare */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">Aftercare &amp; Integritas</span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif] leading-snug">
                  Pengawasan Kepatuhan Pasca TAT
                </h2>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Rekomendasi TAT bukan pembebasan tanpa syarat. Klien wajib menjalani program rehabilitasi dengan kepatuhan penuh di bawah pengawasan sistem.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Wajib Lapor', val: 'Mingguan' },
                  { label: 'Uji Toksikologi', val: 'Acak / Berkala' },
                  { label: 'Sanksi', val: 'SP-1 · SP-2 · SP-3' },
                  { label: 'Kelulusan', val: 'Sertifikat SKSP' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#071326] border border-[#1b3459]/60 rounded-xl p-3 sm:p-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{item.label}</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{item.val}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onGoToLogin()}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-[#D4AF37] hover:text-white transition-colors cursor-pointer group"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Portal Petugas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Regulasi */}
            <div id="dasar-hukum" className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">Landasan Hukum</span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif] leading-snug">
                  Dasar Regulasi Operasional
                </h2>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Dasar yuridis yang mengikat seluruh instansi dalam Tim Asesmen Terpadu RI.
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  { ref: 'UU No. 35/2009', desc: 'Mandat rehabilitasi medis &amp; sosial bagi pecandu dan korban penyalahgunaan narkotika.' },
                  { ref: 'SEMA No. 04/2010', desc: 'Batasan berat barang bukti pemakaian 1 hari â€” sabu maksimal 1 gram.' },
                  { ref: 'Perpol No. 08/2021', desc: 'Penerapan Keadilan Restoratif dalam penanganan tindak pidana di lingkungan Polri.' },
                  { ref: 'Perja No. 15/2020', desc: 'Penghentian penuntutan berdasarkan keadilan restoratif pada Kejaksaan RI.' },
                ].map((reg, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#071326] border border-[#1b3459]/60 rounded-xl p-3.5 sm:p-4">
                    <BookOpen className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">{reg.ref}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{reg.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050e1c] border-t border-[#12233c]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <PoliceEmblem size="sm" />
            <div>
              <span className="font-bold text-white text-xs font-['Cinzel',serif] block">E-TAT SIAP PULIH · BNNP KALIMANTAN TIMUR</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">BNNP Kaltim · Ditresnarkoba Polda Kaltim · Kejati Kaltim</span>
            </div>
          </div>
          <div className="text-[10px] sm:text-right space-y-0.5">
            <p className="text-slate-500">&copy; {new Date().getFullYear()} Badan Narkotika Nasional Provinsi Kalimantan Timur.</p>
            <p className="text-[#D4AF37] font-semibold font-mono">WAR ON DRUGS · BERSINAR KALTIM</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

