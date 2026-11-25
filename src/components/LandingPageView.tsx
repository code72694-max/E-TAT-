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
  Info,
  UserCheck,
  BadgeCheck,
  Award,
  GraduationCap,
  Sparkles,
  Filter,
  User
} from 'lucide-react';

interface LandingPageViewProps {
  onGoToLogin: (presetRole?: string) => void;
  onGoToRegister?: () => void;
  permohonanList: PermohonanAsesmen[];
  onOpenPermohonanDetail?: (id: string) => void;
  onGoToLacak?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGoToLogin,
  onGoToRegister,
  permohonanList,
  onGoToLacak
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutTab, setAboutTab] = useState<'teori' | 'struktur' | 'tim'>('teori');
  const [teamFilter, setTeamFilter] = useState<'all' | 'pimpinan' | 'medis' | 'hukum' | 'sekretariat' | 'rehab'>('all');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedResult, setTrackedResult] = useState<PermohonanAsesmen | null | 'not_found'>(null);
  const [selectedPilar, setSelectedPilar] = useState<any>(null);

  interface DasarHukumItem {
    no: number;
    singkatan: string;
    judul: string;
    penjelasan: string;
  }

  const DASAR_HUKUM_LIST: DasarHukumItem[] = [
    {
      no: 1,
      singkatan: 'UU No. 35 Tahun 2009',
      judul: 'Undang-Undang Nomor 35 Tahun 2009 tentang Narkotika',
      penjelasan: 'Landasan hukum utama penanganan tindak pidana narkotika di Indonesia. Mengatur penggolongan zat narkotika, sanksi pidana tegas bagi penjahat/sindikat, serta kewajiban rehabilitasi medis dan sosial bagi pecandu dan korban penyalahgunaan narkotika.'
    },
    {
      no: 2,
      singkatan: 'PP No. 25 Tahun 2011',
      judul: 'Peraturan Pemerintah Nomor 25 Tahun 2011 tentang Pelaksanaan Wajib Lapor Pecandu Narkotika',
      penjelasan: 'Mengatur tata cara dan pelaksanaan Wajib Lapor bagi pecandu atau korban penyalahgunaan narkotika untuk mendapatkan pengobatan dan perawatan melalui rehabilitasi medis dan rehabilitasi sosial.'
    },
    {
      no: 3,
      singkatan: 'Perpres No. 23 Tahun 2010',
      judul: 'Peraturan Presiden Nomor 23 Tahun 2010 tentang Badan Narkotika Nasional',
      penjelasan: 'Peraturan Presiden Nomor 23 Tahun 2010 tentang Badan Narkotika Nasional sebagaimana telah diubah dengan Peraturan Badan Narkotika Nasional Nomor 47 Tahun 2019 tentang Perubahan atas Peraturan Presiden Nomor 23 Tahun 2010 tentang Badan Narkotika Nasional.'
    },
    {
      no: 4,
      singkatan: 'Peraturan Bersama 7 Lembaga (2014)',
      judul: 'Peraturan Bersama MA, Menkumham, Menkes, Mensos, Jaksa Agung, Kapolri, & Ka BNN RI Tahun 2014',
      penjelasan: 'Peraturan Bersama Ketua Mahkamah Agung RI, Menteri Hukum dan HAM RI, Menteri Kesehatan RI, Menteri Sosial RI, Jaksa Agung RI, Kepala Kepolisian Negara RI, Kepala BNN RI Nomor 01/PB/MA/III/2014, Nomor 03 Tahun 2014, Nomor 11 Tahun 2014, Nomor 03 Tahun 2014, Nomor PER-005/A/JA/03/2014, Nomor 1 Tahun 2014, Perber/01/III/2014/BNN tentang Penanganan Pecandu dan Korban Penyalahgunaan Narkotika ke Dalam Lembaga Rehabilitasi (Berita Negara RI Tahun 2014 Nomor 465).'
    },
    {
      no: 5,
      singkatan: 'Permenkes No. 4 Tahun 2020',
      judul: 'Peraturan Menteri Kesehatan Republik Indonesia Nomor 4 Tahun 2020',
      penjelasan: 'Peraturan Menteri Kesehatan Republik Indonesia Nomor 4 Tahun 2020 tentang Penyelenggaraan Institusi Penerima Wajib Lapor (IPWL) dalam memberikan pelayanan rehabilitasi medis.'
    },
    {
      no: 6,
      singkatan: 'Perban BNN No. 5 Tahun 2020',
      judul: 'Peraturan Badan Narkotika Nasional Nomor 5 Tahun 2020 (Ortaker BNN)',
      penjelasan: 'Peraturan Badan Narkotika Nasional Nomor 5 Tahun 2020 tentang Organisasi dan Tata Kerja Badan Narkotika Nasional sebagaimana telah diubah dengan Peraturan Badan Narkotika Nasional Nomor 1 Tahun 2022 tentang Perubahan atas Peraturan Badan Narkotika Nasional Nomor 5 Tahun 2020 tentang Organisasi dan Tata Kerja Badan Narkotika Nasional.'
    },
    {
      no: 7,
      singkatan: 'Perban BNN No. 6 Tahun 2020',
      judul: 'Peraturan Badan Narkotika Nasional Nomor 6 Tahun 2020 (Ortaker BNNP & BNNK)',
      penjelasan: 'Peraturan Badan Narkotika Nasional Nomor 6 Tahun 2020 tentang Organisasi dan Tata Kerja Badan Narkotika Nasional Provinsi dan Badan Narkotika Nasional Kabupaten/Kota sebagaimana telah diubah dengan Peraturan Badan Narkotika Nasional Nomor 1 Tahun 2024 tentang Perubahan atas Peraturan Badan Narkotika Nasional Nomor 6 Tahun 2020 tentang Organisasi dan Tata Kerja Badan Narkotika Nasional Provinsi dan Badan Narkotika Nasional Kabupaten/Kota.'
    },
    {
      no: 8,
      singkatan: 'Perban BNN No. 6 Tahun 2022',
      judul: 'Peraturan Badan Narkotika Nasional Nomor 6 Tahun 2022',
      penjelasan: 'Peraturan Badan Narkotika Nasional Nomor 6 Tahun 2022 tentang Penyelenggaraan Rehabilitasi Berkelanjutan untuk memberikan pemulihan secara komprehensif bagi mantan pecandu narkotika.'
    },
    {
      no: 9,
      singkatan: 'Perka BNN No. 11 Tahun 2014',
      judul: 'Peraturan Kepala Badan Narkotika Nasional Nomor 11 Tahun 2014',
      penjelasan: 'Peraturan Kepala Badan Narkotika Nasional Nomor 11 Tahun 2014 tentang Tata Cara Penanganan Tersangka dan/atau Terdakw Pecandu Narkotika dan Korban Penyalahgunaan Narkotika ke Dalam Lembaga Rehabilitasi.'
    }
  ];

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
  const [selectedDasarHukum, setSelectedDasarHukum] = useState<DasarHukumItem | null>(null);

  const SOP_8_STEPS: SopStepItem[] = [
    {
      step: '01',
      title: 'Registrasi & Pengajuan',
      actor: 'Pengaju / Hukum / Medis',
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
      title: 'Timeline',
      actor: 'Sekretariat TAT & Penyidik',
      sla: 'SLA Maks. 6 Hari Kerja (3x24 Jam Penangkapan)',
      icon: <Clock className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Pemantauan linimasa permohonan asesmen terpadu pada masa penangkapan (maks. 3×24 jam) hingga penerbitan rekomendasi (hari ke-6).',
      details: [
        'Masa Penangkapan Pertama (Hari ke-0 s.d. Hari ke-3): Maksimal batas pengajuan asesmen terpadu adalah 3×24 jam pasca penangkapan.',
        'Batas Waktu Perbaikan Berkas: Apabila terdapat catatan perbaikan/koreksi administrasi dari verifikator, role Pengaju wajib melengkapi dalam waktu maksimal 3×24 jam sesuai timeline penangkapan.',
        'Penjadwalan Otomatis: Saat Pengaju submit permohonan, estimasi jadwal pemeriksaan terpadu (Medis, Hukum, Pleno) langsung otomatis ter-generate dan tampil di Admin TAT namun tanggal tetap dapat dikustomisasi/disesuaikan.',
        'Masa Pelaksanaan Asesmen Terpadu (Hari ke-3 s.d. Hari ke-6): Pemeriksaan medis klinis, analisis yuridis hukum, dan pelaksanaan Sidang Pleno TAT.',
        'Hari ke-6: Batas akhir pengesahan dan pengeluaran Surat Rekomendasi Resmi TAT.'
      ],
      legalBasis: 'Juknis Terpadu BNN & Polri (Masa Penangkapan 3x24 Jam & SLA TAT)'
    },
    {
      step: '04',
      title: 'Medis',
      actor: 'Tim Medis TAT',
      sla: 'Maks. 2 Hari Kerja',
      icon: <Stethoscope className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Pemeriksaan klinis, tes urin, dan skrining tingkat ketergantungan (ASSIST).',
      details: [
        'Pemeriksaan fisik, tanda vital, dan riwayat penggunaan zat narkotika.',
        'Skrining klinis WHO-ASSIST (skor 0-39) dan uji toksikologi urin.',
        'Penentuan diagnosis klinis (ICD-10) serta usulan modalitas dan durasi rehabilitasi.'
      ],
      legalBasis: 'UU No. 35/2009 & Permenkes No. 4/2020'
    },
    {
      step: '05',
      title: 'Hukum',
      actor: 'Tim Asesor Hukum TAT',
      sla: 'Maks. 2 Hari Kerja',
      icon: <Scale className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Analisis yuridis BAP, peran tersangka, barang bukti, dan rekam residivisme.',
      details: [
        'Analisis BAP, legalitas penangkapan, dan kualifikasi peran (penyalahguna vs pengedar).',
        'Pengujian berat barang bukti terhadap ambang batas SEMA No. 04 Tahun 2010.',
        'Verifikasi riwayat residivisme dan rekomendasi aspek hukum untuk Sidang Pleno.'
      ],
      legalBasis: 'UU No. 35/2009 & SEMA No. 04/2010'
    },
    {
      step: '06',
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
      legalBasis: 'Pedoman Penanganan Perkara TAT BNN Kota Samarinda'
    },
    {
      step: '07',
      title: 'Pengesahan',
      actor: '4 Penanda Tangan Resmi',
      sla: 'Maks. 1 Hari Kerja (Total SLA 6 Hari)',
      icon: <FileSignature className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Pengesahan Surat Rekomendasi Resmi & Verifikasi Dokumen.',
      details: [
        'Pengesahan surat rekomendasi resmi oleh Ketua TAT dan tim terkait.',
        'Penerbitan QR Code verifikasi keaslian dokumen resmi e-TAT SIAP PULIH.',
        'Dokumen siap diunduh oleh Penyidik sebagai kelengkapan berkas perkara.'
      ],
      legalBasis: 'Sistem Verifikasi Dokumen e-TAT SIAP PULIH'
    },
    {
      step: '08',
      title: 'Rujukan & Rehabilitasi',
      actor: 'Balai Rehabilitasi & Penyidik',
      sla: 'Sesuai Rencana Eksekusi',
      icon: <Share2 className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Penerbitan rujukan balai rehab & serah terima pelaksanaan tindak lanjut.',
      details: [
        'Serah terima tersangka oleh Pengaju ke fasilitas rehabilitasi tujuan.',
        'Pelaksanaan kontrol medis berkala, tes urin, dan jurnal wajib lapor.',
        'Penerbitan Surat Keterangan Selesai Rehabilitasi (SKSR) setelah program tuntas.'
      ],
      legalBasis: 'Perja No. 15/2020 & Perpol No. 08/2021'
    },
    {
      step: '09',
      title: 'Pasca Rehab',
      actor: 'Tim Medis / Konselor',
      sla: 'Pemantauan Pascarehab',
      icon: <Activity className="w-5 h-5 text-[#D4AF37]" />,
      summary: 'Penjadwalan dan pemantauan program bina lanjut pasca rehabilitasi oleh Tim Medis.',
      details: [
        'Tim Medis menginput jadwal layanan bina lanjut pasca rehabilitasi.',
        'Pemantauan berkala kondisi pemulihan dan tes urin lanjutan klien.',
        'Mendukung keberlanjutan pemulihan agar klien tetap pulih, produktif, dan bebas relapse.'
      ],
      legalBasis: 'Perban BNN No. 6 Tahun 2022 tentang Rehabilitasi Berkelanjutan'
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
      image: '/kantor.png',
      imageAlt: 'Pertemuan Koordinasi Tim Asesmen Terpadu BNN & Polri'
    },
    {
      id: 1,
      titlePart1: 'MAKNA SIMBOL E-TAT SIAP PULIH',
      titleHighlight: 'INTERPRETASI KONSEPTUAL LOGO',
      titlePart2: 'ASESMEN TEPAT, PEMULIHAN TERPANTAU.',
      description:
        'Sistem Integrasi Asesmen dan Pemantauan Pemulihan — Sinergi tim medis, tim hukum, dan layanan pemulihan.',
      image: '/kantor.png',
      imageAlt: 'Makna Simbol E-TAT SIAP PULIH'
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
        const headerOffset = 120;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
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
        onGoToRegister={onGoToRegister}
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
                className={`absolute inset-0 bg-cover transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                style={{ 
                  backgroundImage: `url('${slide.image}')`,
                  backgroundPosition: slide.id === 0 || slide.id === 1 ? 'center bottom' : 'center right'
                }}
                role="img"
                aria-label={slide.imageAlt}
              />

              {/* Dark Gradient Overlays for High Contrast & Clean Text Legibility */}
              <div className={`absolute inset-0 transition-all duration-1000 ${
                idx === 0 || idx === 1
                  ? 'bg-gradient-to-b from-[#071326]/90 via-[#071326]/80 to-[#071326]/92'
                  : 'bg-gradient-to-r from-[#071326] via-[#071326]/85 to-[#071326]/30 lg:to-transparent'
              }`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071326] via-transparent to-[#071326]/70" />
              <div className="absolute inset-0 bg-[#071326]/20 backdrop-blur-[0.5px]" />
            </div>
          );
        })}

        {/* Content Container - Tailored Slide 0 & 1 Branding vs Regular Slides */}
        <div className={`relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-6 lg:px-8 -translate-y-4 sm:-translate-y-6 lg:-translate-y-8 ${
          currentSlide === 0 ? 'text-center' : ''
        }`}>
          <div className={`${
            currentSlide === 0 ? 'max-w-4xl mx-auto text-center' : currentSlide === 1 ? 'max-w-5xl mx-auto' : 'max-w-3xl'
          } space-y-4`}>
            {/* Animated Slide Content Box */}
            <div key={currentSlide} className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {currentSlide === 0 ? (
                /* SLIDE 1: CLEAN HERO BRANDING CENTERED WITH PROMINENT LOGOS & DIRECT ACRONYM */
                <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 mx-auto">
                  {/* Big Prominent Logos Row - Centered with close spacing */}
                  <div className="flex items-center justify-center space-x-2 sm:space-x-4 pb-1">
                    <img
                      src="/bnn.png"
                      alt="Logo BNN RI"
                      className="h-24 sm:h-32 md:h-36 lg:h-40 w-auto object-contain drop-shadow-[0_8px_24px_rgba(255,255,255,0.35)] hover:scale-105 transition-transform shrink-0"
                    />
                    <img
                      src="/logo_etat.png"
                      alt="Logo E-TAT SIAP PULIH"
                      className="h-24 sm:h-32 md:h-36 lg:h-40 w-auto object-contain drop-shadow-[0_8px_30px_rgba(212,175,55,0.60)] hover:scale-105 transition-transform shrink-0"
                    />
                  </div>

                  {/* Sub-header Institusi - Centered */}
                  <div className="space-y-0.5 text-center">
                    <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase block">
                      BADAN NARKOTIKA NASIONAL PROVINSI
                    </span>
                    <span className="text-sm sm:text-lg font-extrabold text-white tracking-wide block font-['Cinzel',serif]">
                      KALIMANTAN TIMUR
                    </span>
                  </div>

                  {/* Main Title: E-TAT SIAP PULIH - Centered */}
                  <div className="space-y-2 pt-1 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-wider leading-tight font-['Cinzel',serif] drop-shadow-xl">
                      E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
                    </h1>

                    {/* Direct Clean Acronym Subtitles - Centered */}
                    <div className="pt-1 text-slate-200 text-center max-w-2xl mx-auto">
                      <div className="space-y-0 leading-tight">
                        <p className="text-sm sm:text-base md:text-lg font-bold tracking-wide text-white drop-shadow-md">
                          (Elektronik Tim Asesmen Terpadu
                        </p>
                        <p className="text-sm sm:text-base md:text-lg font-bold tracking-wide text-white drop-shadow-md -mt-0.5 sm:-mt-1">
                          Sistem Integrasi Asesmen dan Pemantauan Pemulihan)
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm font-medium italic text-teal-300 drop-shadow-md pt-2 sm:pt-2.5">
                        Asesmen Tepat, Pemulihan Terpantau
                      </p>
                    </div>
                  </div>
                </div>
              ) : currentSlide === 1 ? (
                /* SLIDE 2: MAKNA SIMBOL E-TAT SIAP PULIH */
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-wider font-['Cinzel',serif] uppercase drop-shadow-lg">
                      MAKNA SIMBOL E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-teal-300 font-medium tracking-wide">
                      Interpretasi konseptual logo
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
                    {/* Left: Logo + Kepanjangan + Tagline */}
                    <div className="lg:col-span-5 flex flex-col items-center text-center space-y-3 lg:border-r lg:border-white/15 lg:pr-6">
                      <img
                        src="/logo_etat.png"
                        alt="Logo E-TAT SIAP PULIH"
                        className="h-32 sm:h-44 lg:h-52 w-auto object-contain drop-shadow-[0_8px_28px_rgba(212,175,55,0.5)]"
                      />
                      <div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-['Cinzel',serif] tracking-wide pb-1">
                          E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
                        </h3>
                        <div className="space-y-0 leading-tight">
                          <p className="text-xs sm:text-sm lg:text-base font-bold text-white leading-tight">
                            (Elektronik Tim Asesmen Terpadu
                          </p>
                          <p className="text-xs sm:text-sm lg:text-base font-bold text-white leading-tight -mt-0.5 sm:-mt-1">
                            Sistem Integrasi Asesmen dan Pemantauan Pemulihan)
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm font-medium italic text-teal-300 pt-2 sm:pt-2.5">
                          Asesmen Tepat, Pemulihan Terpantau
                        </p>
                      </div>
                    </div>

                    {/* Right: 5 Makna Simbol Cards */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                      {[
                        {
                          iconSrc: '/images/logo-detail/01_perisai.png',
                          title: 'PERISAI',
                          desc: 'Perlindungan dan kepastian layanan.',
                        },
                        {
                          iconSrc: '/images/logo-detail/02_figur_manusia.png',
                          title: 'FIGUR MANUSIA',
                          desc: 'Pemulihan, harapan, dan keberdayaan.',
                        },
                        {
                          iconSrc: '/images/logo-detail/03_tangan_menopang.png',
                          title: 'TANGAN MENOPANG',
                          desc: 'Kepedulian, pendampingan, dan rehabilitasi humanis.',
                        },
                        {
                          iconSrc: '/images/logo-detail/04_tiga_simpul_terhubung.png',
                          title: 'TIGA SIMPUL TERHUBUNG',
                          desc: 'Sinergi tim medis, tim hukum, dan layanan pemulihan.',
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[#0b172a]/90 border border-[#1b3459]"
                        >
                          <img
                            src={item.iconSrc}
                            alt={item.title}
                            className="w-9 h-9 object-contain shrink-0 drop-shadow-md"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white tracking-wide">{item.title}</h4>
                            <p className="text-[11px] text-slate-300 truncate sm:whitespace-normal">{item.desc}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[#0b172a]/90 border border-[#1b3459] sm:col-span-2 lg:col-span-1">
                        <div className="w-9 flex items-center justify-center gap-1 shrink-0">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] inline-block" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white tracking-wide">WARNA</h4>
                          <p className="text-[11px] text-slate-300">
                            <span className="text-blue-400 font-medium">Biru:</span> kepercayaan &bull;{' '}
                            <span className="text-teal-300 font-medium">Hijau toska:</span> pemulihan &bull;{' '}
                            <span className="text-[#D4AF37] font-medium">Emas:</span> harapan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* SLIDE 3 - ROBOTO FONT & UNIFORM FONT SIZE */
                <div className="space-y-2 font-['Roboto',sans-serif]">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide leading-snug drop-shadow-lg space-y-1">
                    <span className="block text-slate-100">
                      {heroSlides[currentSlide].titlePart1}
                    </span>
                    <span className="block text-[#D4AF37]">
                      {heroSlides[currentSlide].titleHighlight}
                    </span>
                    <span className="block text-slate-100">
                      {heroSlides[currentSlide].titlePart2}
                    </span>
                  </h1>
                </div>
              )}
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

      {/* AFTERCARE + REGULASI (SECTION 2) */}
      <section id="pengawasan" className="py-16 sm:py-24 bg-[#081225] border-b border-[#1b3459]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Regulasi / Dasar Hukum - Full Width Clean Section */}
          <div id="dasar-hukum" className="space-y-6 reveal-on-scroll">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] block">Landasan Hukum &amp; Regulasi</span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide font-['Cinzel',serif]">
                Dasar Hukum Operasional TAT
              </h2>
              <p className="text-xs text-slate-300">
                Landasan yuridis dan peraturan perundang-undangan resmi Tim Asesmen Terpadu (TAT). Klik untuk melihat detail.
              </p>
            </div>

            {/* Grid 9 Items Dasar Hukum - Ultra Clean, Compact & Full Viewport Friendly */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
              {DASAR_HUKUM_LIST.map((item) => (
                <div
                  key={item.no}
                  onClick={() => setSelectedDasarHukum(item)}
                  className="bg-[#071326] border border-[#1b3459]/80 hover:border-[#D4AF37]/60 rounded-xl p-3 sm:p-3.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group flex items-center justify-between gap-3 shadow-md hover:bg-[#0d1f38]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#0d1f38] border border-[#1b3459] text-[#D4AF37] font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                      {item.no}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors block truncate">
                        {item.singkatan}
                      </span>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-tight">
                        {item.judul}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center text-[#D4AF37] opacity-70 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SIAP PULIH TEGAS — 3 Pilar */}
      <section id="gerakan-sekorna" className="py-20 sm:py-24 bg-[#071326] border-b border-[#1b3459]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-on-scroll">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] block mb-2.5">Komitmen Utama</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-wide">
              SIAP · PULIH · TEGAS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 max-w-md mx-auto">Tiga komitmen Teknis Pelaksanaan Asesmen Terpadu (TAT) BNNP Kalimantan Timur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { word: 'SIAP', pillar: 'I', title: 'Sistem Integrasi Asesmen', sub: 'UU 35/2009 · Perpol 08/2021', desc: 'Penyidik, dokter, jaksa bekerja terpadu dalam satu data. SLA 6 hari kerja dijamin sistem.', fullDesc: 'Sistem terpadu yang memadukan data penyidik, hasil pemeriksaan klinis medis, dan analisis hukum jaksa secara real-time. Memastikan SLA (Service Level Agreement) 6 hari kerja dapat terpantau secara transparan dan akuntabel, menghilangkan red tape birokrasi konvensional.', icon: <HeartHandshake className="w-4 h-4" /> },
              { word: 'PULIH', pillar: 'II', title: 'Pemantauan Pemulihan Klien', sub: 'Balai BNN · RSUD · Klinik Pratama', desc: 'Pemantauan ketat pasca-asesmen dengan tes urin berkala dan evaluasi kepatuhan program rehab.', fullDesc: 'Mekanisme pemantauan pasca-rekomendasi rehabilitasi yang mewajibkan klien menjalani tes urin berkala dan evaluasi kepatuhan jadwal rawat jalan/inap. Memastikan proses pemulihan berjalan tuntas dan menurunkan angka kekambuhan (relapse) secara terukur.', icon: <Scale className="w-4 h-4" /> },
              { word: 'TEGAS', pillar: 'III', title: 'Penegakan Hukum Tanpa Kompromi', sub: 'SEMA 04/2010 · Kepastian Peradilan', desc: 'Penindakan maksimal sindikat pengedar, dipisah jelas dari penyelamatan korban penyalahguna.', fullDesc: 'Penindakan maksimal sindikat pengedar dan bandar narkotika yang dipisahkan secara tegas dari proses penyelamatan pecandu/korban penyalahgunaan sesuai ketentuan hukum yang berlaku.', icon: <ShieldCheck className="w-4 h-4" /> },
            ].map((p, i) => (
              <div key={i} onClick={() => setSelectedPilar(p)} className={`reveal-on-scroll reveal-delay-${i + 1} group cursor-pointer bg-[#0d1f38] border border-[#1b3459]/70 rounded-2xl p-6 sm:p-7 hover:border-[#D4AF37]/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl flex flex-col justify-between`}>
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <span className="font-mono font-black text-2xl sm:text-3xl text-[#D4AF37] leading-none tracking-tight">{p.word}</span>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 bg-[#071326] px-2 py-0.5 rounded border border-[#1b3459]">PILAR {p.pillar}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{p.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-5">{p.desc}</p>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 border-t border-[#1b3459]/60 pt-4">
                  <div className="shrink-0 text-[#D4AF37]">{p.icon}</div>
                  <span>{p.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* QUOTE / COMMITMENT MORAL */}
          <div className="mt-8 sm:mt-10 border border-[#1b3459]/80 rounded-2xl p-6 sm:p-8 bg-[#0b172a] text-center reveal-on-scroll reveal-delay-4 shadow-xl">
            <p className="text-sm sm:text-base font-semibold text-white italic leading-relaxed max-w-2xl mx-auto">
              "Satu Nyawa yang Kita Pulihkan adalah Satu Masa Depan Bangsa yang Kita Selamatkan."
            </p>
            <span className="text-[10px] text-[#D4AF37] mt-2 block uppercase tracking-widest font-mono font-bold">Komitmen Moral Penegak Hukum Indonesia</span>
          </div>
        </div>
      </section>

      {/* ALUR SOP */}
      <section id="alur-layanan" className="py-12 sm:py-16 bg-[#071326] border-b border-[#1b3459]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
          <div className="text-center reveal-on-scroll">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1.5">Alur Terpadu SIAP PULIH</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-wide">9 Tahapan SOP Layanan</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
              Klik pada salah satu tahapan di bawah untuk melihat rincian alur kerja, pelaksana, dan batas waktu SLA operasional.
            </p>
          </div>

          {/* SOP Cards Flex Centered (2 rows on desktop: 5 + 4 centered, 2 columns on mobile) */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-3.5">
            {SOP_8_STEPS.map((item, i) => (
              <div
                key={item.step}
                onClick={() => setSelectedSopStep(item)}
                className={`reveal-on-scroll reveal-delay-${Math.min(i + 1, 8)} w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.6rem)] lg:w-[calc(20%-0.7rem)] group bg-[#0d1f38] border border-[#1b3459]/80 hover:border-[#D4AF37] rounded-xl p-3.5 sm:p-4 flex flex-col justify-between space-y-2.5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[#D4AF37]/10 min-h-[145px]`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg bg-[#071326] border border-[#1b3459] flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {item.actor}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1b3459]/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono font-medium truncate max-w-[70%]">{item.sla}</span>
                  <span className="text-[#D4AF37] font-semibold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform shrink-0">
                    <span>Detail</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050e1c] border-t border-[#12233c] reveal-on-scroll">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <img
              src="/logo_etat.png"
              alt="Logo E-TAT"
              className="h-8 sm:h-9 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
            />
            <div>
              <span className="font-bold text-white text-xs sm:text-sm block">E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span></span>
              <span className="text-[10px] text-slate-400 block mt-0.5">BNNP Kaltim &bull; Ditresnarkoba Polda Kaltim &bull; Kejati Kaltim</span>
            </div>
          </div>
          <div className="text-[10px] sm:text-right space-y-0.5">
            <p className="text-slate-500">&copy; {new Date().getFullYear()} Badan Narkotika Nasional Provinsi Kalimantan Timur.</p>
            <p className="text-[#D4AF37] font-semibold font-mono">WAR ON DRUGS · BERSINAR KALTIM</p>
          </div>
        </div>
      </footer>
      {/* MODAL POPUP FOR SOP STEPS DETAIL */}
      {selectedSopStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedSopStep(null)}
          />
          <div className={`relative z-10 w-full max-h-[92vh] overflow-y-auto bg-[#0b172a] border border-[#234b7d] rounded-2xl shadow-2xl text-slate-200 ${selectedSopStep.step === '03' ? 'max-w-5xl p-4 sm:p-6 space-y-3.5' : 'max-w-lg p-6 sm:p-7 space-y-5'}`}>
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-2.5 border-b border-[#1b3459] gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#071326] border border-[#234b7d] flex items-center justify-center shrink-0 shadow-inner">
                  {selectedSopStep.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#D4AF37] bg-[#071326] px-2 py-0.5 rounded border border-[#1b3459]">
                      TAHAP {selectedSopStep.step}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{selectedSopStep.actor}</span>
                    {selectedSopStep.step === '03' && (
                      <span className="font-mono text-[10px] font-bold text-[#D4AF37] bg-[#0d1f38] px-2 py-0.5 rounded border border-[#1b3459] flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{selectedSopStep.sla}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{selectedSopStep.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedSopStep(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedSopStep.step === '03' ? (
              /* LAYOUT 2 KOLOM PROPORSIONAL UNTUK TIMELINE AGAR TERLIHAT 1 HALAMAN PENUH */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Kolom Kiri: Infografis + Ringkasan Fase */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Infografis Linimasa Resmi Penangkapan</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Batas Max: Hari ke-6</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-[#234b7d] bg-white p-2 shadow-lg flex items-center justify-center">
                    <img
                      src="/images/timeline-penangkapan.jpg"
                      alt="Timeline Permohonan Asesmen Terpadu pada Masa Penangkapan"
                      className="w-full max-h-[245px] object-contain rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-xl">
                      <span className="text-[#D4AF37] font-bold text-[11px] block mb-0.5">Hari ke-0 s.d. Hari ke-3</span>
                      <p className="text-slate-300 text-[10px] leading-snug">
                        Masa Penangkapan Pertama (3×24 Jam). Batas akhir pengajuan asesmen &amp; revisi dokumen oleh Pengaju.
                      </p>
                    </div>
                    <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-xl">
                      <span className="text-emerald-400 font-bold text-[11px] block mb-0.5">Hari ke-3 s.d. Hari ke-6</span>
                      <p className="text-slate-300 text-[10px] leading-snug">
                        Masa Pelaksanaan Asesmen (Medis, Hukum &amp; Pleno). Hari ke-6 batas akhir terbit Surat Rekomendasi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Summary & Rincian SOP */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-3 bg-[#071326]/60 border border-[#1b3459] rounded-xl p-3.5 sm:p-4">
                  <div className="space-y-3">
                    <p className="text-[11px] sm:text-xs text-slate-300 italic bg-[#0d1f38]/70 p-2.5 rounded-lg border-l-2 border-[#D4AF37] leading-relaxed">
                      "{selectedSopStep.summary}"
                    </p>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                        Rincian Prosedur Operasional (SOP):
                      </span>
                      <ul className="space-y-2 text-[11px] text-slate-300">
                        {selectedSopStep.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="w-4 h-4 rounded-full bg-[#132d54] text-[#D4AF37] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#1b3459] flex items-center justify-between gap-2 text-[10px] text-slate-400">
                    <span>Landasan:</span>
                    <span className="font-semibold text-slate-200 text-right">{selectedSopStep.legalBasis}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LAYOUT STANDAR UNTUK STEP LAINNYA */
              <>
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
              </>
            )}

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

      {/* MODAL POPUP FOR DASAR HUKUM DETAIL */}
      {selectedDasarHukum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedDasarHukum(null)}
          />
          <div className="relative z-10 max-w-xl w-full bg-[#0b172a] border border-[#234b7d] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#1b3459] gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#071326] border border-[#234b7d] flex items-center justify-center shrink-0 shadow-inner">
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#071326] px-2 py-0.5 rounded border border-[#1b3459]">
                      DASAR HUKUM NO. {selectedDasarHukum.no}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                    {selectedDasarHukum.singkatan}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDasarHukum(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Full Title */}
            <div className="p-3.5 bg-[#071326] border border-[#1b3459] rounded-xl space-y-1">
              <span className="text-[10px] text-[#D4AF37] font-mono font-bold uppercase tracking-wider block">
                Judul Peraturan Resmi:
              </span>
              <p className="text-xs font-semibold text-white leading-relaxed">
                {selectedDasarHukum.judul}
              </p>
            </div>

            {/* Detailed Explanation / Scope */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Deskripsi &amp; Cakupan Substansi Hukum:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0d1f38]/60 p-4 rounded-xl border border-[#1b3459]/80">
                {selectedDasarHukum.penjelasan}
              </p>
            </div>

            {/* Footer / Close Button */}
            <div className="pt-2 border-t border-[#1b3459] flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400 font-mono">
                Tim Asesmen Terpadu &bull; BNNP Kaltim
              </span>
              <button
                onClick={() => setSelectedDasarHukum(null)}
                className="px-5 py-2.5 bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs rounded-xl border border-[#235594] transition-colors cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Pillar Modal */}
      {selectedPilar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#040b16]/90 backdrop-blur-sm" onClick={() => setSelectedPilar(null)} />
          <div className="relative bg-[#0d1f38] border border-[#1b3459] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono font-black text-3xl text-[#D4AF37] leading-none tracking-tight block mb-1">{selectedPilar.word}</span>
                  <h3 className="text-lg font-bold text-white">{selectedPilar.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedPilar(null)}
                  className="p-2 bg-[#142642] hover:bg-[#1b3459] text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-[#234475]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedPilar.fullDesc}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400 bg-[#081224] p-3 rounded-xl border border-[#1b3459]/50">
                  <div className="text-[#D4AF37] shrink-0">{selectedPilar.icon}</div>
                  <span className="text-slate-200">{selectedPilar.sub}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#0b172a] px-6 py-4 border-t border-[#1b3459] flex justify-end">
              <button
                onClick={() => setSelectedPilar(null)}
                className="bg-[#133863] hover:bg-[#1a4a82] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer border border-[#235594]"
              >
                Tutup Penjelasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

