import React, { useState, useEffect } from 'react';
import { PermohonanAsesmen } from '../types';
import { PoliceEmblem } from './PoliceEmblem';
import { PublicHeader } from './PublicHeader';
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
  X,
  Clock,
  Info
} from 'lucide-react';

interface LandingPageViewProps {
  onGoToLogin: (presetRole?: string) => void;
  permohonanList: PermohonanAsesmen[];
  onOpenPermohonanDetail?: (id: string) => void;
  onGoToLacak?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGoToLogin,
  permohonanList,
  onGoToLacak
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedResult, setTrackedResult] = useState<PermohonanAsesmen | null | 'not_found'>(null);

  interface SopStepItem {
    step: string;
    title: string;
    actor: string;
    sla: string;
    icon: React.ReactNode;
    summary: string;
    details: string[];
    legalBasis: string;
  }

  const [selectedSopStep, setSelectedSopStep] = useState<SopStepItem | null>(null);

  const SOP_8_STEPS: SopStepItem[] = [
    {
      step: '01',
      title: 'Registrasi & Pengajuan',
      actor: 'Penyidik Polri / BNN',
      sla: 'Maks. 1×24 Jam Penangkapan',
      icon: <FileCheck className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Pendaftaran perkara awal & upload 7 berkas formil persyaratan.',
      details: [
        'Penyidik menginput Identitas Terperiksa (NIK, Nama, Wali, Domisili).',
        'Pengisian Data Perkara (Nomor LP, Tanggal LP, TKP, Kronologi).',
        'Merinci data Barang Bukti (Jenis zat, berat netto/bruto, nomor lab Puslabfor).',
        'Mengunggah 7 dokumen persyaratan formil (Surat Permohonan TAT, LP, BAP, SKHPN, Lab BB).'
      ],
      legalBasis: 'SOP bersama BNNP Kaltim & Ditresnarkoba Polda Kaltim'
    },
    {
      step: '02',
      title: 'Verifikasi Berkas',
      actor: 'Sekretariat TAT BNNP',
      sla: 'Maks. 1 Hari Kerja',
      icon: <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Pemeriksaan keabsahan administrasi & penugasan tim pemeriksa.',
      details: [
        'Sekretariat memeriksa kelengkapan, keterbacaan, dan keabsahan formil berkas.',
        'Jika berkas belum lengkap: dikembalikan ke Penyidik dengan catatan revisi.',
        'Jika berkas lengkap: disetujui dan dilanjutkan ke penugasan tim spesialis.',
        'Menunjuk Dokter Asesor Medis & Asesor Hukum yang bertanggung jawab.'
      ],
      legalBasis: 'Perpol No. 08 Tahun 2021 & Juknis TAT BNN'
    },
    {
      step: '03',
      title: 'Surat Perintah Penugasan',
      actor: 'Sekretariat & Koordinator',
      sla: 'Maks. 1 Hari Kerja',
      icon: <Calendar className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Penerbitan Sprint Tim Terpadu & penjadwalan pemeriksaan.',
      details: [
        'Penerbitan Surat Perintah Penugasan Tim Asesmen Terpadu.',
        'Penetapan jadwal & lokasi pemeriksaan klinis medis dan analisis hukum.',
        'Pengiriman pemberitahuan agenda resmi kepada penyidik & tim pemeriksa.'
      ],
      legalBasis: 'Peraturan Bersama 7 Lembaga/Kementerian'
    },
    {
      step: '04',
      title: 'Forensik & Yuridis',
      actor: 'Tim Medis & Asesor Hukum',
      sla: 'Maks. 2 Hari Kerja (Paralel)',
      icon: <Stethoscope className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Skrining klinis ASSIST & analisis kualifikasi perkara hukum.',
      details: [
        'Asesmen Medis: Tes klinis, skrining ASSIST (skor 0-39), diagnosis ketergantungan, usulan terapi.',
        'Asesmen Hukum: Analisis BAP, legalitas penangkapan, kualifikasi pengedar vs korban.',
        'Pengujian barang bukti di bawah ambang batas SEMA No. 04 Tahun 2010.'
      ],
      legalBasis: 'UU No. 35/2009 & SEMA No. 04/2010'
    },
    {
      step: '05',
      title: 'Sidang Pleno TAT',
      actor: 'Koordinator & Asesor Terpadu',
      sla: 'Maks. 1 Hari Kerja',
      icon: <Users className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Forum musyawarah pembahasan temuan medis & analisis hukum.',
      details: [
        'Tim Terpadu menelaah bersama hasil pemeriksaan medis dan analisis hukum.',
        'Pencatatan notulensi sidang dan daftar hadir anggota pleno.',
        'Penyusunan Draf Berita Acara Pleno untuk merumuskan simpulan rekomendasi final.'
      ],
      legalBasis: 'Pedoman Penanganan Perkara TAT BNNP Kaltim'
    },
    {
      step: '06',
      title: 'Pengesahan QR & TTE',
      actor: '4 Penanda Tangan Resmi',
      sla: 'Maks. 1 Hari Kerja (Total SLA 6 Hari)',
      icon: <FileSignature className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Penerbitan Surat Rekomendasi Resmi 3-Panel & TTE Multi-Pihak.',
      details: [
        'Penerbitan dokumen dalam format 3-Panel (Acuan Visual 8).',
        'Tanda Tangan Elektronik (TTE) berjenjang oleh 4 Pengesah (Medis, Hukum, Penyidik, Ketua TAT).',
        'Penerbitan Barcode QR Code Verifikasi keaslian dokumen resmi.',
        'Penyidik menandatangani lembar konfirmasi tanda terima berkas resmi.'
      ],
      legalBasis: 'Sistem TTE Tersertifikasi & Barcode Verification'
    },
    {
      step: '07',
      title: 'Rujukan & Eksekusi',
      actor: 'Balai Rehabilitasi & Penyidik',
      sla: 'Sesuai Rencana Eksekusi',
      icon: <Share2 className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Penerbitan rujukan balai rehab & penyerahan lembar rekomendasi.',
      details: [
        'Penerbitan surat rujukan resmi ke Balai Besar BNN (Tanah Merah/Lido) atau Klinik Pratama.',
        'Penyidik melampirkan rekomendasi resmi ke berkas perkara penyidikan (BAP / P-21).',
        'Konfirmasi admisi penerimaan klien oleh fasilitas rehabilitasi.'
      ],
      legalBasis: 'Perja No. 15/2020 & Perpol No. 08/2021'
    },
    {
      step: '08',
      title: 'Pengawasan & SKSP',
      actor: 'Konselor & Penyidik Pengawas',
      sla: '3 s.d. 6 Bulan Pemantauan',
      icon: <Activity className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Pemantauan kepatuhan rehabilitasi, tes urin berkala & penerbitan SKSP.',
      details: [
        'Pencatatan Jurnal Kegiatan Konseling dan absensi kepatuhan.',
        'Skrining Tes Urin Periodik (5 Parameter: AMP, MET, THC, BZO, MOP).',
        'Penerbitan Surat Peringatan (SP-1/2/3) jika terdapat pelanggaran mangkir.',
        'Penerbitan Surat Keterangan Selesai Program (SKSP) bagi klien yang lulus.'
      ],
      legalBasis: 'Modul Monitoring Pengawasan Pasca TAT BNNP Kaltim'
    }
  ];

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
        'Sinergi Ditresnarkoba Polda & BNNP Kaltim: merehabilitasi medis & sosial korban penyalahguna serta menindak tegas sindikat narkotika.',
      image: '/images/hero/slide-asesmen.jpg',
      imageAlt: 'Pertemuan Koordinasi Tim Asesmen Terpadu BNN & Polri'
    },
    {
      id: 1,
      titlePart1: 'HARAPAN BARU,',
      titleHighlight: 'PULIH BERSAMA LAYANAN REHABILITASI,',
      titlePart2: 'MENUJU MASA DEPAN GEMILANG.',
      description:
        'Layanan rehabilitasi medis dan psikososial berstandar nasional BNNP Kaltim untuk memutus siklus adiksi dan memulihkan masa depan korban.',
      image: '/images/hero/slide-rehabilitasi.jpg',
      imageAlt: 'Konsultasi Medis dan Rehabilitasi Penyalahguna Narkotika Klinik Pratama BNN'
    },
    {
      id: 2,
      titlePart1: 'UJI LABORATORIUM,',
      titleHighlight: 'FORENSIK PRESISI & TRANSPARAN,',
      titlePart2: 'BEBAS DARI INTERVENSI.',
      description:
        'Pengujian toksikologi urin dan verifikasi barang bukti narkotika Puslabfor Bareskrim Polri dan BNN secara ilmiah, akuntabel, dan transparan.',
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

  const handleGoToLanding = (sectionId?: string) => {
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      {/* Shared Public Header */}
      <PublicHeader
        activePage="landing"
        onGoToLanding={handleGoToLanding}
        onGoToLacak={() => onGoToLacak && onGoToLacak()}
        onGoToLogin={() => onGoToLogin()}
      />

      {/* HERO SLIDER SECTION - SIAP SESPIM STYLE WITH AUTO SLIDE, FULL-PAGE HEIGHT & CLEAN POLICE/REHAB IMAGERY */}
      <section
        id="hero-carousel"
        className="relative overflow-hidden h-[calc(100vh-4rem)] min-h-[520px] sm:min-h-[580px] flex items-center bg-[#071326] border-b border-[#1b3459] select-none"
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

        {/* Content Container - Higher position and larger font size on mobile */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-6 lg:px-8 -translate-y-12 sm:-translate-y-10 lg:-translate-y-12">
          <div className="max-w-2xl space-y-4">
            {/* Animated Slide Content Box */}
            <div key={currentSlide} className="space-y-3.5 sm:space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Clean Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide leading-snug font-['Cinzel',serif] drop-shadow-md">
                <span className="block text-slate-100">
                  {heroSlides[currentSlide].titlePart1}
                </span>
                <span className="block text-[#D4AF37] my-1">
                  {heroSlides[currentSlide].titleHighlight}
                </span>
                <span className="block text-slate-200 text-lg sm:text-2xl lg:text-3xl font-bold mt-1">
                  {heroSlides[currentSlide].titlePart2}
                </span>
              </h1>

              {/* Clean Description */}
              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal drop-shadow-sm mt-3">
                {heroSlides[currentSlide].description}
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Prev & Next Navigation Buttons */}
        <button
          type="button"
          onClick={goToPrevSlide}
          aria-label="Slide sebelumnya"
          className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-[#071326]/75 hover:bg-[#0d1f38] text-white/80 hover:text-white border border-[#1b3459] hover:border-[#D4AF37]/60 backdrop-blur-md shadow-xl transition-all cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          type="button"
          onClick={goToNextSlide}
          aria-label="Slide berikutnya"
          className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-[#071326]/75 hover:bg-[#0d1f38] text-white/80 hover:text-white border border-[#1b3459] hover:border-[#D4AF37]/60 backdrop-blur-md shadow-xl transition-all cursor-pointer group"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Bottom Carousel Indicators */}
        <div className="absolute bottom-4 sm:bottom-10 inset-x-0 z-30 flex justify-center pointer-events-auto">
          {/* Slide Indicator Pills */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-[#071326]/80 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#1b3459]">
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
                      ? 'w-5 sm:w-8 h-1.5 sm:h-2.5 bg-[#D4AF37] shadow-md shadow-[#D4AF37]/40'
                      : 'w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-slate-500/60 hover:bg-slate-300'
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

          {/* QUOTE / COMMITMENT MORAL */}
          <div className="mt-8 sm:mt-10 border border-[#1b3459]/60 rounded-2xl p-6 sm:p-8 bg-[#0b172a] text-center">
            <p className="text-sm sm:text-base font-semibold text-white italic leading-relaxed max-w-2xl mx-auto">
              "Satu Nyawa yang Kita Pulihkan adalah Satu Masa Depan Bangsa yang Kita Selamatkan."
            </p>
            <span className="text-[10px] text-slate-500 mt-2 block uppercase tracking-widest font-mono">Komitmen Moral Penegak Hukum Indonesia</span>
          </div>
        </div>
      </section>

      {/* ALUR SOP */}
      <section id="alur-layanan" className="py-20 sm:py-24 bg-[#071326] border-b border-[#1b3459]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">Alur Terpadu SIAP PULIH</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">8 Tahapan SOP Layanan</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 max-w-md mx-auto leading-relaxed">
              Klik pada salah satu tahapan di bawah untuk melihat rincian alur kerja, pelaksana, dan batas waktu SLA operasional.
            </p>
          </div>

          {/* SOP Cards Grid (Clean & Proportional on Mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5">
            {SOP_8_STEPS.map((item, i) => (
              <div
                key={item.step}
                onClick={() => setSelectedSopStep(item)}
                className={`fade-in-up fade-in-up-delay-${Math.min(i + 1, 8)} group bg-[#0d1f38] border border-[#1b3459]/80 hover:border-[#D4AF37] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-sky-950/40`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-[#071326] border border-[#1b3459] flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-mono text-sm sm:text-base font-black text-[#1b3459] group-hover:text-[#D4AF37] transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium truncate">
                    {item.actor}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1b3459]/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono font-semibold">{item.sla}</span>
                  <span className="text-[#D4AF37] font-bold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Detail</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
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
      {/* MODAL POPUP FOR SOP 8 STEPS DETAIL */}
      {selectedSopStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedSopStep(null)}
          />
          <div className="relative z-10 max-w-lg w-full bg-[#0b172a] border border-[#234b7d] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#1b3459] gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#071326] border border-[#234b7d] flex items-center justify-center shrink-0 shadow-inner">
                  {selectedSopStep.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#071326] px-2 py-0.5 rounded border border-[#1b3459]">
                      TAHAP {selectedSopStep.step}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{selectedSopStep.actor}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">{selectedSopStep.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedSopStep(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SLA Badge */}
            <div className="p-3 bg-[#071326] border border-[#1b3459] rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Estimasi SLA Operasional:</span>
              </span>
              <span className="font-mono font-bold text-[#D4AF37] bg-[#0d1f38] px-2.5 py-1 rounded border border-[#1b3459]">
                {selectedSopStep.sla}
              </span>
            </div>

            {/* Summary */}
            <p className="text-xs text-slate-300 italic bg-[#0d1f38]/60 p-3 rounded-lg border-l-2 border-[#D4AF37]">
              "{selectedSopStep.summary}"
            </p>

            {/* Rincian Langkah SOP */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Rincian Prosedur Operasional (SOP):
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedSopStep.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#132d54] text-[#D4AF37] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Basis */}
            <div className="pt-3 border-t border-[#1b3459] flex items-center justify-between text-[11px] text-slate-400">
              <span>Landasan Regulasi:</span>
              <span className="font-semibold text-slate-200">{selectedSopStep.legalBasis}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedSopStep(null)}
              className="w-full bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs py-2.5 rounded-xl border border-[#235594] transition-colors cursor-pointer"
            >
              Tutup Penjelasan SOP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

